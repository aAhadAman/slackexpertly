import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/shell";
import { getCurrentOrg, getEscalations } from "@/lib/data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const [org, escalations] = await Promise.all([
    getCurrentOrg(),
    getEscalations(),
  ]);
  const openEscalations = escalations.filter((e) => e.status === "open").length;

  return (
    <DashboardShell
      user={user}
      org={org?.name ?? "My workspace"}
      escalationCount={openEscalations}
    >
      {children}
    </DashboardShell>
  );
}
