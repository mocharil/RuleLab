export interface WorkspaceState {
  view: string;
  dirty: boolean;
  draft: { id: string; title: string; revision: number; articles: { number: string; text: string }[] };
  drafts: { id?: string; title?: string; revision?: number; regulation_type?: string }[];
  corpus: unknown[];
  runs: { revision: number; kind: string; review_status: string; payload?: { findings?: unknown[] } }[];
  jobs: { status: string }[];
  status: { provider?: string; regulations?: number; articles?: number; principal?: { role: string } };
}
