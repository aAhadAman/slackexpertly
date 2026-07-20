import { PageHeader } from "@/components/dashboard/ui";
import { EscalationsClient } from "@/components/dashboard/escalations-client";
import { getEscalations } from "@/lib/data";

export const metadata = { title: "Escalations · Policy Expert" };

export default async function EscalationsPage() {
  const escalations = await getEscalations();
  return (
    <>
      <PageHeader
        title="Escalations"
        description="Questions the bot wasn't confident enough to answer. Reply once and it learns."
      />
      <EscalationsClient initial={escalations} />
    </>
  );
}
