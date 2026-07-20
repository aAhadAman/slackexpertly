-- =====================================================================
--  RAG support for Gemini embeddings (text-embedding-004 = 768 dims)
--  Run AFTER 0001_init.sql. Safe while document_chunks is empty.
-- =====================================================================

-- 1. Match the embedding column to Gemini's dimension.
alter table public.document_chunks
  alter column embedding type vector(768);

-- Rebuild the vector index for the new dimension.
drop index if exists doc_chunks_embedding_idx;
create index doc_chunks_embedding_idx on public.document_chunks
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- 2. Vector search, scoped to one org, with the source document name/page.
create or replace function public.match_chunks(
  query_embedding vector(768),
  match_org uuid,
  match_count int default 5
)
returns table (
  id          uuid,
  document_id uuid,
  doc_name    text,
  content     text,
  page        int,
  similarity  float
)
language sql
stable
as $$
  select
    dc.id,
    dc.document_id,
    d.name as doc_name,
    dc.content,
    dc.page,
    1 - (dc.embedding <=> query_embedding) as similarity
  from public.document_chunks dc
  join public.documents d on d.id = dc.document_id
  where dc.org_id = match_org
    and dc.embedding is not null
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;

grant execute on function public.match_chunks(vector, uuid, int)
  to authenticated, service_role;
