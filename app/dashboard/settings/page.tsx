import { PageHeader } from "@/components/dashboard/ui";
import { SettingsClient } from "@/components/dashboard/settings-client";
import { getSessionUser } from "@/lib/auth";
import { MOCK_ORG } from "@/lib/mock";

export const metadata = { title: "Settings · Policy Expert" };

export default async function SettingsPage() {
  const user = await getSessionUser();
  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure your workspace, bot persona, and notifications."
      />
      <SettingsClient org={MOCK_ORG} email={user?.email ?? ""} />
    </>
  );
}
