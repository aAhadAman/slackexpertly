import { PageHeader } from "@/components/dashboard/ui";
import { EscalationsClient } from "@/components/dashboard/escalations-client";
import { mockEscalations } from "@/lib/mock";

export const metadata = { title: "Escalations · Policy Expert" };

export default function EscalationsPage() {
  return (
    <>
      <PageHeader
        title="Escalations"
        description="Questions the bot wasn't confident enough to answer. Reply once and it learns."
      />
      <EscalationsClient initial={mockEscalations} />
    </>
  );
}
