import { PageHeader } from "@/components/dashboard/ui";
import { BillingClient } from "@/components/dashboard/billing-client";

export const metadata = { title: "Billing · Policy Expert" };

export default function BillingPage() {
  return (
    <>
      <PageHeader
        title="Billing"
        description="You're on the free beta plan — no payment needed."
      />
      <BillingClient />
    </>
  );
}
