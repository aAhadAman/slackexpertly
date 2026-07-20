-- =====================================================================
--  The Policy Expert — initial schema
--  Run this in the Supabase SQL Editor (or `supabase db push`).
--  Safe to re-run: everything is guarded with IF NOT EXISTS / OR REPLACE.
-- =====================================================================

-- ---- Extensions -----------------------------------------------------
create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists vector;     -- pgvector for RAG embeddings

-- ---- Tables ---------------------------------------------------------

create table if not exists public.organizations (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null default 'My workspace',
  owner_id              uuid references auth.users(id) on delete set null,
  plan                  text not null default 'team'
                          check (plan in ('starter','team','pro')),
  subscription_status   text not null default 'trialing'
                          check (subscription_status in ('trialing','active','past_due','canceled')),
  trial_ends_at         timestamptz default (now() + interval '14 days'),
  stripe_customer_id    text,
  stripe_subscription_id text,
  -- bot configuration (edited from Settings / Integrations)
  bot_name              text not null default 'Policy Expert',
  bot_tone              text not null default 'friendly'
                          check (bot_tone in ('friendly','professional','concise')),
  fallback_message      text not null default
                          'I''m not fully sure about that one — I''ve passed it to our HR team and they''ll get back to you shortly.',
  confidence_threshold  int  not null default 70
                          check (confidence_threshold between 0 and 100),
  active_channels       jsonb not null default '["#ask-hr"]'::jsonb,
  created_at            timestamptz not null default now()
);

create table if not exists public.organization_members (
  org_id     uuid not null references public.organizations(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'owner' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations(id) on delete cascade,
  name        text not null,
  category    text not null default 'Other',
  size_bytes  bigint not null default 0,
  pages       int not null default 0,
  chunks      int not null default 0,
  status      text not null default 'processing'
                check (status in ('processing','ready','error')),
  storage_path text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table if not exists public.escalations (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references public.organizations(id) on delete cascade,
  question      text not null,
  employee_name text,
  channel       text,
  reason        text,
  status        text not null default 'open'
                  check (status in ('open','answered','dismissed')),
  answer        text,
  asked_at      timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create table if not exists public.integrations (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references public.organizations(id) on delete cascade,
  provider     text not null check (provider in ('slack','teams')),
  connected    boolean not null default false,
  workspace    text,
  config       jsonb not null default '{}'::jsonb,
  connected_at timestamptz,
  created_at   timestamptz not null default now(),
  unique (org_id, provider)
);

-- Analytics log: one row per question the bot handled (written by the backend).
create table if not exists public.questions (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references public.organizations(id) on delete cascade,
  question      text not null,
  answer        text,
  confidence    numeric,
  was_escalated boolean not null default false,
  channel       text,
  employee_name text,
  asked_at      timestamptz not null default now()
);

-- RAG chunks with embeddings (populated during ingestion).
create table if not exists public.document_chunks (
  id          uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  org_id      uuid not null references public.organizations(id) on delete cascade,
  content     text not null,
  page        int,
  embedding   vector(1536),
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- ---- Indexes --------------------------------------------------------
create index if not exists documents_org_idx       on public.documents(org_id);
create index if not exists escalations_org_idx      on public.escalations(org_id);
create index if not exists escalations_status_idx   on public.escalations(org_id, status);
create index if not exists questions_org_idx        on public.questions(org_id);
create index if not exists questions_asked_idx      on public.questions(org_id, asked_at);
create index if not exists org_members_user_idx     on public.organization_members(user_id);
create index if not exists doc_chunks_org_idx       on public.document_chunks(org_id);
create index if not exists doc_chunks_embedding_idx on public.document_chunks
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ---- Membership helper (SECURITY DEFINER avoids RLS recursion) -------
create or replace function public.is_org_member(p_org uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.organization_members m
    where m.org_id = p_org and m.user_id = auth.uid()
  );
$$;

-- ---- Row Level Security ---------------------------------------------
alter table public.organizations        enable row level security;
alter table public.organization_members enable row level security;
alter table public.documents            enable row level security;
alter table public.escalations          enable row level security;
alter table public.integrations         enable row level security;
alter table public.questions            enable row level security;
alter table public.document_chunks      enable row level security;

-- organizations: members can read + update their org
drop policy if exists org_select on public.organizations;
create policy org_select on public.organizations
  for select to authenticated using (public.is_org_member(id));
drop policy if exists org_update on public.organizations;
create policy org_update on public.organizations
  for update to authenticated using (public.is_org_member(id)) with check (public.is_org_member(id));

-- organization_members: read rows of orgs you belong to
drop policy if exists members_select on public.organization_members;
create policy members_select on public.organization_members
  for select to authenticated using (public.is_org_member(org_id));

-- generic per-org tables: full CRUD scoped to membership
do $$
declare t text;
begin
  foreach t in array array['documents','escalations','integrations','questions','document_chunks']
  loop
    execute format('drop policy if exists %I_all on public.%I;', t, t);
    execute format(
      'create policy %I_all on public.%I for all to authenticated
         using (public.is_org_member(org_id))
         with check (public.is_org_member(org_id));', t, t);
  end loop;
end $$;

-- ---- Auto-provision an org for every new user -----------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  org_name   text;
begin
  org_name := coalesce(
    nullif(new.raw_user_meta_data->>'company', ''),
    split_part(new.email, '@', 1) || '''s workspace'
  );

  insert into public.organizations (name, owner_id)
  values (org_name, new.id)
  returning id into new_org_id;

  insert into public.organization_members (org_id, user_id, role)
  values (new_org_id, new.id, 'owner');

  insert into public.integrations (org_id, provider, connected)
  values (new_org_id, 'slack', false), (new_org_id, 'teams', false)
  on conflict (org_id, provider) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Self-heal: give the current user an org if they don't have one yet
-- (covers accounts created before this trigger existed).
create or replace function public.ensure_org()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_id uuid;
  new_org_id  uuid;
  u           record;
  org_name    text;
begin
  select org_id into existing_id
  from public.organization_members
  where user_id = auth.uid()
  limit 1;

  if existing_id is not null then
    return existing_id;
  end if;

  select * into u from auth.users where id = auth.uid();
  if u.id is null then
    return null;
  end if;

  org_name := coalesce(
    nullif(u.raw_user_meta_data->>'company', ''),
    split_part(u.email, '@', 1) || '''s workspace'
  );

  insert into public.organizations (name, owner_id)
  values (org_name, auth.uid())
  returning id into new_org_id;

  insert into public.organization_members (org_id, user_id, role)
  values (new_org_id, auth.uid(), 'owner');

  insert into public.integrations (org_id, provider, connected)
  values (new_org_id, 'slack', false), (new_org_id, 'teams', false)
  on conflict (org_id, provider) do nothing;

  return new_org_id;
end;
$$;

grant execute on function public.ensure_org() to authenticated;

-- ---- Storage bucket for uploaded PDFs -------------------------------
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Files are stored under  <org_id>/<file>.  Access = membership of that org.
drop policy if exists documents_storage_all on storage.objects;
create policy documents_storage_all on storage.objects
  for all to authenticated
  using (
    bucket_id = 'documents'
    and public.is_org_member(nullif((storage.foldername(name))[1], '')::uuid)
  )
  with check (
    bucket_id = 'documents'
    and public.is_org_member(nullif((storage.foldername(name))[1], '')::uuid)
  );
