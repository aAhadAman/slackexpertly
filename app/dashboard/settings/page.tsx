import { PageHeader } from "@/components/dashboard/ui";
import { SettingsClient } from "@/components/dashboard/settings-client";
import { getSessionUser } from "@/lib/auth";
import { getCurrentOrg } from "@/lib/data";

export const metadata = { title: "Settings · Policy Expert" };

export default async function SettingsPage() {
  const [user, org] = await Promise.all([getSessionUser(), getCurrentOrg()]);
  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure your workspace, bot persona, and notifications."
      />
      <SettingsClient
        org={org?.name ?? "My workspace"}
        email={user?.email ?? ""}
        botName={org?.bot_name ?? "Policy Expert"}
        botTone={org?.bot_tone ?? "friendly"}
        fallbackMessage={org?.fallback_message ?? ""}
      />
    </>
  );
}
