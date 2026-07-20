import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/shell";
import { MOCK_ORG, mockEscalations } from "@/lib/mock";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const openEscalations = mockEscalations.filter(
    (e) => e.status === "open"
  ).length;

  return (
    <DashboardShell
      user={user}
      org={MOCK_ORG}
      escalationCount={openEscalations}
    >
      {children}
    </DashboardShell>
  );
}
