import { PageHeader } from "@/components/dashboard/ui";
import { IntegrationsClient } from "@/components/dashboard/integrations-client";
import { getIntegrations, getCurrentOrg } from "@/lib/data";
import {
  buildInstallUrl,
  SLACK_CONFIGURED,
  SLACK_SLASH_COMMAND,
} from "@/lib/slack";

export const metadata = { title: "Integrations · Policy Expert" };

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ slack?: string }>;
}) {
  const [{ slack }, integrations, org] = await Promise.all([
    searchParams,
    getIntegrations(),
    getCurrentOrg(),
  ]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const installUrl = org ? buildInstallUrl(org.id, appUrl) : null;

  return (
    <>
      <PageHeader
        title="Integrations"
        description="Connect Slack and tune how the bot behaves."
      />
      <IntegrationsClient
        initial={integrations}
        threshold={org?.confidence_threshold ?? 70}
        installUrl={installUrl}
        slackConfigured={SLACK_CONFIGURED}
        slashCommand={SLACK_SLASH_COMMAND}
        statusParam={slack ?? null}
      />
    </>
  );
}
