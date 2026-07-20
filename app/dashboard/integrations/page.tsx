import { PageHeader } from "@/components/dashboard/ui";
import { IntegrationsClient } from "@/components/dashboard/integrations-client";
import { getIntegrations, getCurrentOrg } from "@/lib/data";

export const metadata = { title: "Integrations · Policy Expert" };

export default async function IntegrationsPage() {
  const [integrations, org] = await Promise.all([
    getIntegrations(),
    getCurrentOrg(),
  ]);

  return (
    <>
      <PageHeader
        title="Integrations"
        description="Connect Slack or Teams and tune how the bot behaves."
      />
      <IntegrationsClient
        initial={integrations}
        threshold={org?.confidence_threshold ?? 70}
        channels={org?.active_channels ?? ["#ask-hr"]}
      />
    </>
  );
}
