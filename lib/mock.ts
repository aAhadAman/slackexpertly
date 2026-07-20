import type {
  PolicyDoc,
  Escalation,
  Integration,
  DashboardStats,
  ChatMessage,
} from "./types";

export const MOCK_ORG = "Northwind Labs";

export const mockStats: DashboardStats = {
  questionsAnswered: 1284,
  questionsThisWeek: 173,
  deflectionRate: 0.87,
  openEscalations: 3,
  activeEmployees: 142,
  hoursSaved: 41,
};

/** 8 weeks of questions answered, for the overview chart. */
export const mockWeeklyVolume = [64, 82, 71, 96, 118, 104, 151, 173];

export const mockDocs: PolicyDoc[] = [
  {
    id: "d1",
    name: "2025 Benefits Guide.pdf",
    category: "Benefits",
    sizeBytes: 3_940_112,
    pages: 42,
    chunks: 168,
    status: "ready",
    uploadedAt: "2026-07-02T14:12:00Z",
  },
  {
    id: "d2",
    name: "Medical Plan – Aetna PPO.pdf",
    category: "Insurance",
    sizeBytes: 1_204_882,
    pages: 18,
    chunks: 74,
    status: "ready",
    uploadedAt: "2026-07-02T14:15:00Z",
  },
  {
    id: "d3",
    name: "Dental & Vision Summary.pdf",
    category: "Insurance",
    sizeBytes: 642_100,
    pages: 9,
    chunks: 33,
    status: "ready",
    uploadedAt: "2026-07-05T09:41:00Z",
  },
  {
    id: "d4",
    name: "Employee Handbook 2026.pdf",
    category: "Policy",
    sizeBytes: 5_512_400,
    pages: 88,
    chunks: 341,
    status: "ready",
    uploadedAt: "2026-07-06T11:02:00Z",
  },
  {
    id: "d5",
    name: "401(k) Plan Details.pdf",
    category: "Retirement",
    sizeBytes: 988_220,
    pages: 14,
    chunks: 51,
    status: "processing",
    uploadedAt: "2026-07-19T16:30:00Z",
  },
];

export const mockEscalations: Escalation[] = [
  {
    id: "e1",
    question:
      "If I switch from the PPO to the HDHP mid-year after a baby, is that a qualifying life event?",
    employee: "Priya S.",
    channel: "#ask-hr",
    reason: "Low confidence — conflicting guidance across two documents",
    status: "open",
    askedAt: "2026-07-20T08:14:00Z",
  },
  {
    id: "e2",
    question: "What's the reimbursement limit for the home-office stipend this year?",
    employee: "Marcus T.",
    channel: "DM",
    reason: "No matching policy found",
    status: "open",
    askedAt: "2026-07-19T15:47:00Z",
  },
  {
    id: "e3",
    question: "Does our dental plan cover Invisalign for adults?",
    employee: "Dana R.",
    channel: "#benefits",
    reason: "Answer below confidence threshold",
    status: "open",
    askedAt: "2026-07-19T10:05:00Z",
  },
  {
    id: "e4",
    question: "How many days of bereavement leave am I entitled to?",
    employee: "Chen W.",
    channel: "#ask-hr",
    reason: "Low confidence",
    status: "answered",
    askedAt: "2026-07-17T13:22:00Z",
  },
];

export const mockIntegrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    connected: true,
    workspace: "northwind.slack.com",
    connectedAt: "2026-07-02T14:20:00Z",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    connected: false,
  },
];

export const mockConversation: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "How much is my deductible on the PPO plan?",
  },
  {
    id: "m2",
    role: "bot",
    content:
      "On the Aetna PPO plan, the annual in-network deductible is $1,500 for individual coverage and $3,000 for family coverage. Out-of-network deductibles are higher ($3,000 / $6,000). Preventive care is covered at 100% and does not count toward your deductible.",
    citations: [
      { doc: "Medical Plan – Aetna PPO.pdf", page: 4 },
      { doc: "2025 Benefits Guide.pdf", page: 11 },
    ],
  },
];

export const MOCK_SUGGESTIONS = [
  "How do I add a dependent during open enrollment?",
  "What's the difference between the PPO and HDHP?",
  "When does my dental coverage start after joining?",
  "How much does the company match in the 401(k)?",
];
