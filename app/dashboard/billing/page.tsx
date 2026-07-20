import { PageHeader } from "@/components/dashboard/ui";
import { BillingClient } from "@/components/dashboard/billing-client";
import { getCurrentOrg } from "@/lib/data";

export const metadata = { title: "Billing · Policy Expert" };

export default async function BillingPage() {
  const org = await getCurrentOrg();
  return (
    <>
      <PageHeader
        title="Billing"
        description="Manage your plan, payment method, and invoices."
      />
      <BillingClient
        currentPlan={org?.plan ?? "team"}
        status={org?.subscription_status ?? "trialing"}
        trialEndsAt={org?.trial_ends_at ?? null}
      />
    </>
  );
}
