import { PageHeader } from "@/components/dashboard/ui";
import { IntegrationsClient } from "@/components/dashboard/integrations-client";
import { mockIntegrations } from "@/lib/mock";

export const metadata = { title: "Integrations · Policy Expert" };

export default function IntegrationsPage() {
  return (
    <>
      <PageHeader
        title="Integrations"
        description="Connect Slack or Teams and tune how the bot behaves."
      />
      <IntegrationsClient initial={mockIntegrations} />
    </>
  );
}
