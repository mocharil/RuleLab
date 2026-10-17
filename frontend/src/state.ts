export interface WorkspaceState {
  view: string;
  dirty: boolean;
  draft: { id: string; title: string; revision: number; articles: { number: string; text: string }[] };
  drafts: { id?: string; title?: string; revision?: number; regulation_type?: string }[];
  corpus: unknown[];
  runs: { revision: number; kind: string; review_status: string; payload?: { findings?: unknown[] } }[];
  jobs: { status: string }[];
  status: { provider?: string; regulations?: number; articles?: number; principal?: { role: string } };
  /** GET /api/overview — undefined while loading, null when it failed. */
  overview?: OverviewData | null;
}

export interface OverviewDraft {
  id: string; title: string; regulation_type?: string; revision: number; articles: number; updated_at: string;
  analysis: { id: string; revision: number; findings: number; review_status: string; outdated: boolean; at: string } | null;
  impact: { id: string; kind: "simulation" | "social"; revision: number; outdated: boolean; at: string } | null;
  forum: { revision: number; outdated: boolean } | null;
  job: { id: string; intent: string; status: string; revision: number; at: string; active: boolean } | null;
  pending_reviews: number;
}
export interface OverviewAttention { kind: "running" | "failed" | "review" | "outdated"; draft_id: string; draft: string; label: string; detail: string; target: string }
export interface OverviewActivity { at: string; draft_id: string; draft: string; kind: string; label: string }
export interface OverviewData { drafts: OverviewDraft[]; attention: OverviewAttention[]; activity: OverviewActivity[] }
