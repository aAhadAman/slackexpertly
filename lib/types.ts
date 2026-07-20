export type DocStatus = "processing" | "ready" | "error";

export interface PolicyDoc {
  id: string;
  name: string;
  category: string;
  sizeBytes: number;
  pages: number;
  chunks: number;
  status: DocStatus;
  uploadedAt: string; // ISO
}

export type EscalationStatus = "open" | "answered" | "dismissed";

export interface Escalation {
  id: string;
  question: string;
  employee: string;
  channel: string;
  reason: string;
  status: EscalationStatus;
  askedAt: string; // ISO
}

export interface Integration {
  id: "slack" | "teams";
  name: string;
  connected: boolean;
  workspace?: string;
  connectedAt?: string;
}

export interface Citation {
  doc: string;
  page: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  citations?: Citation[];
  escalated?: boolean;
}

export interface DashboardStats {
  questionsAnswered: number;
  questionsThisWeek: number;
  deflectionRate: number; // 0-1, share auto-answered
  openEscalations: number;
  activeEmployees: number;
  hoursSaved: number;
}
