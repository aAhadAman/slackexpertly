import {
  LayoutDashboard,
  FileText,
  MessagesSquare,
  Inbox,
  Plug,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badgeKey?: "escalations";
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/playground", label: "Test the bot", icon: MessagesSquare },
  {
    href: "/dashboard/escalations",
    label: "Escalations",
    icon: Inbox,
    badgeKey: "escalations",
  },
  { href: "/dashboard/integrations", label: "Integrations", icon: Plug },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];
