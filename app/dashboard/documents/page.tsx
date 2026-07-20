import { PageHeader } from "@/components/dashboard/ui";
import { DocumentsClient } from "@/components/dashboard/documents-client";
import { mockDocs } from "@/lib/mock";

export const metadata = { title: "Documents · Policy Expert" };

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        title="Documents"
        description="Upload the PDFs your bot answers from. Everything is indexed privately."
      />
      <DocumentsClient initial={mockDocs} />
    </>
  );
}
