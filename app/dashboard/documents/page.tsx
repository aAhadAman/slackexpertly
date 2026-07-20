import { PageHeader } from "@/components/dashboard/ui";
import { DocumentsClient } from "@/components/dashboard/documents-client";
import { getDocuments } from "@/lib/data";

export const metadata = { title: "Documents · Policy Expert" };

export default async function DocumentsPage() {
  const docs = await getDocuments();
  return (
    <>
      <PageHeader
        title="Documents"
        description="Upload the PDFs your bot answers from. Everything is indexed privately."
      />
      <DocumentsClient initial={docs} />
    </>
  );
}
