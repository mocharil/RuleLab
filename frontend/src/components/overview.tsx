import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle, ArrowRight, BookOpen, Check, ChevronDown, CircleDot, Clock3, FileInput, FilePenLine, Loader2,
  Map as MapIcon, Plus, Search, Sparkles, X,
} from "lucide-react";
import type { OverviewData, OverviewDraft, WorkspaceState } from "../state";

/* Overview: continue the last draft, see what needs a decision, scan every draft's stage.
   Buttons reuse the workspace's action bridge (data-action / data-view handled by app.js). */

/** Readable names for regulation type codes (same labels as the draft builder). */
const TYPE: Record<string, string> = {
  UU: "Undang-Undang", PERPPU: "Perppu", PP: "Peraturan Pemerintah", PERPRES: "Peraturan Presiden", PERMEN: "Peraturan Menteri",
  PER_LEMBAGA: "Peraturan Lembaga", PERDA_PROV: "Perda Provinsi", PERDA_KAB: "Perda Kabupaten/Kota", PERGUB: "Peraturan Gubernur",
  PERBUP: "Peraturan Bupati", PERWALI: "Peraturan Wali Kota", PERDPRD_PROV: "Peraturan DPRD Provinsi",
  PERDPRD_KAB: "Peraturan DPRD Kabupaten/Kota", PERDES: "Peraturan Desa", PERKADES: "Peraturan Kepala Desa",
};
const typeName = (code?: string) => (code && TYPE[code]) || code || "Regulation";

const timeOfDay = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };

export function relativeTime(iso?: string, now = Date.now()) {
  if (!iso) return "";
  const s = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 172800) return "yesterday";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

type StepState = "done" | "active" | "warn" | "todo" | "running";
interface Step { label: string; state: StepState; detail: string }

export function stagesOf(d: OverviewDraft, dirty: boolean): Step[] {
  const running = d.job?.active ? d.job : null;
  const verifyRunning = running && ["legal", "full"].includes(running.intent);
  const impactRunning = running && ["impact", "full", "social"].includes(running.intent);
  const a = d.analysis, i = d.impact;
  return [
    { label: "Draft", state: dirty ? "warn" : "done", detail: dirty ? "Unsaved changes" : `v${d.revision} saved` },
    {
      label: "Verify sources",
      state: verifyRunning ? "running" : !a ? "todo" : a.outdated ? "warn" : d.pending_reviews ? "active" : "done",
      detail: verifyRunning ? "Running…" : !a ? "Not checked yet" : a.outdated ? `Outdated · ran on v${a.revision}` :
        `${a.findings} finding${a.findings === 1 ? "" : "s"}${d.pending_reviews ? " · awaiting review" : " · reviewed"}`,
    },
    {
      label: "Test impact",
      state: impactRunning ? "running" : !i ? "todo" : i.outdated ? "warn" : "done",
      detail: impactRunning ? "Running…" : !i ? "Not tested yet" : i.outdated ? `Outdated · ran on v${i.revision}` : i.kind === "social" ? "Public forum done" : "A/B test done",
    },
  ];
}

export interface NextStep { label: string; action?: string; target?: string }

/** First matching rule wins (docs/OVERVIEW_REVAMP_STRATEGY.md §5). */
export function nextStep(d: OverviewDraft, dirty: boolean): NextStep {
  if (dirty) return { label: "Save draft", action: "save" };
  if (d.job?.active) return { label: "View progress", target: "agents" };
  if (d.pending_reviews) return { label: `Review ${d.pending_reviews} result${d.pending_reviews > 1 ? "s" : ""}`, target: "history" };
  if (!d.analysis || d.analysis.outdated) return { label: `Run source check on v${d.revision}`, target: "analysis" };
  if (!d.impact || d.impact.outdated) return { label: "Test the impact", target: "simulation" };
  return { label: "Export to Word", action: "export-draft" };
}

/** Props that route a button to a draft and a destination, selecting the draft first when needed. */
function go(d: OverviewDraft, selectedId: string, step: NextStep) {
  if (step.action === "save") return { "data-action": "save" };
  if (step.action === "export-draft") return { "data-action": "export-draft", "data-id": d.id };
  return d.id === selectedId && step.target !== "editor" ? { "data-view": step.target } : { "data-action": "open-draft-at", "data-id": d.id, "data-target": step.target };
}

function StepDot({ state }: { state: StepState }) {
  const cls = `ov-dot ov-dot-${state}`;
  if (state === "done") return <span className={cls}><Check size={12} strokeWidth={3} /></span>;
  if (state === "running") return <span className={cls}><Loader2 size={12} className="ov-spin" /></span>;
  if (state === "warn") return <span className={cls}><AlertTriangle size={11} strokeWidth={2.6} /></span>;
  if (state === "active") return <span className={cls}><CircleDot size={12} /></span>;
  return <span className={cls} />;
}

function Stepper({ steps, compact = false }: { steps: Step[]; compact?: boolean }) {
  if (compact) return (
    <span className="ov-mini" role="img" aria-label={steps.map((s) => `${s.label}: ${s.detail}`).join("; ")}>
      {steps.map((s) => <i key={s.label} className={`ov-mini-${s.state}`} />)}
    </span>
  );
  return (
    <ol className="ov-stepper">
      {steps.map((s) => (
        <li key={s.label} className={`ov-step ov-step-${s.state}`}>
          <StepDot state={s.state} />
          <div><b>{s.label}</b><small>{s.detail}</small></div>
        </li>
      ))}
    </ol>
  );
}

function NewMenu({ readOnly }: { readOnly: boolean }) {
  const [open, setOpen] = useState(false);
  if (readOnly) return null;
  const items: [string, string, string, ReactNode][] = [
    ["generate", "Draft from a brief", "Gemini writes the first version", <Sparkles size={16} />],
    ["new", "Guided template", "Pick a regulation type and fill the form", <FilePenLine size={16} />],
    ["import", "Import a document", "TXT, DOCX, PDF or JSON", <FileInput size={16} />],
  ];
  return (
    <div className="ov-new" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <button className="ov-btn ov-btn-primary" data-action="generate"><Plus size={16} />New draft</button>
      <button className="ov-btn ov-btn-primary ov-new-toggle" aria-label="More ways to start a draft" aria-expanded={open} onClick={() => setOpen((o) => !o)}><ChevronDown size={16} /></button>
      {open && (
        <div className="ov-menu" role="menu">
          {items.map(([action, title, hint, icon]) => (
            <button key={action} role="menuitem" data-action={action} onClick={() => setOpen(false)}>
              <span className="ov-menu-icon">{icon}</span><span><b>{title}</b><small>{hint}</small></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Opens the existing command menu through its own trigger (keeps its busy/dialog guards). */
function openCommandMenu() {
  document.querySelector<HTMLButtonElement>(".fx-command-trigger")?.click();
}

function Skeleton() {
  return <div className="ov-skeleton" aria-busy="true" aria-label="Loading overview"><i /><i /><i /></div>;
}

const ICON: Record<string, ReactNode> = {
  running: <Loader2 size={16} className="ov-spin" />, failed: <X size={16} />, review: <Clock3 size={16} />, outdated: <AlertTriangle size={16} />,
};

type Filter = "all" | "review" | "outdated" | "running";

export function OverviewHome({ state }: { state: WorkspaceState }) {
  const data: OverviewData | null | undefined = state.overview;
  const readOnly = ["viewer", "reviewer"].includes(state.status.principal?.role || "");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const drafts = data?.drafts ?? [];
  // The draft with unsaved local edits wins; otherwise the most recently updated draft.
  const current = (state.dirty && drafts.find((d) => d.id === state.draft.id)) || drafts[0];
  const dirty = !!current && state.dirty && current.id === state.draft.id;
  const attention = data?.attention ?? [];
  const status = !data ? "Loading your workspace…" :
    `${drafts.length} draft${drafts.length === 1 ? "" : "s"} · ${attention.length ? `${attention.length} item${attention.length === 1 ? "" : "s"} need${attention.length === 1 ? "s" : ""} attention` : "nothing waits for a decision"}`;

  const visible = useMemo(() => drafts.filter((d) => {
    if (query && !`${d.title} ${d.regulation_type ?? ""}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (filter === "review") return d.pending_reviews > 0;
    if (filter === "outdated") return !!(d.analysis?.outdated || d.impact?.outdated);
    if (filter === "running") return !!d.job?.active;
    return true;
  }), [drafts, query, filter]);

  return (
    <div className="ov">
      <header className="ov-header">
        <div>
          <h1>{timeOfDay()}.</h1>
          <p aria-live="polite">{status}</p>
        </div>
        <div className="ov-header-actions">
          <button className="ov-btn ov-btn-ghost ov-search" onClick={openCommandMenu} aria-label="Search menus and actions (Ctrl+K)"><Search size={16} />Search<kbd>Ctrl K</kbd></button>
          <NewMenu readOnly={readOnly} />
        </div>
      </header>

      {data === undefined ? <Skeleton /> : data === null ? (
        <div className="ov-card ov-error" role="alert">The overview could not be loaded. <button className="ov-link" data-view="home">Try again</button></div>
      ) : (
        <>
          <div className="ov-top">
            {current ? (() => {
              const steps = stagesOf(current, dirty), next = nextStep(current, dirty);
              return (
                <section className={`ov-card ov-continue${current.job?.active ? " ov-live" : ""}`} aria-labelledby="ov-continue-title">
                  <span className="ov-eyebrow">Continue where you left off</span>
                  <div className="ov-continue-head">
                    <h2 id="ov-continue-title">{current.title}</h2>
                    <span className="ov-meta">{typeName(current.regulation_type)} · v{current.revision} · {current.articles} article{current.articles === 1 ? "" : "s"} · edited {relativeTime(current.updated_at)}</span>
                  </div>
                  <Stepper steps={steps} />
                  <div className="ov-continue-actions">
                    <button className="ov-btn ov-btn-primary" {...go(current, state.draft.id, next)}>{next.label}<ArrowRight size={16} /></button>
                    {next.target !== "editor" && <button className="ov-btn ov-btn-ghost" {...go(current, state.draft.id, { label: "Open editor", target: "editor" })}>Open editor</button>}
                    {current.analysis && !current.analysis.outdated && !current.job?.active && (
                      <button className="ov-btn ov-btn-ghost" {...go(current, state.draft.id, { label: "Run public forum", target: "social" })}>Run public forum</button>
                    )}
                  </div>
                </section>
              );
            })() : <section className="ov-card ov-continue"><h2>No drafts yet</h2><p>Create the first draft to start.</p></section>}

            <section className="ov-card ov-attention" aria-labelledby="ov-attention-title">
              <div className="ov-card-head"><h2 id="ov-attention-title">Needs your attention</h2>{attention.length > 0 && <span className="ov-count">{attention.length}</span>}</div>
              {attention.length ? (
                <ul>
                  {attention.map((a, i) => (
                    <li key={i}>
                      <button className={`ov-attn ov-attn-${a.kind}`} data-action="open-draft-at" data-id={a.draft_id} data-target={a.target}>
                        <span className="ov-attn-icon">{ICON[a.kind]}</span>
                        <span className="ov-attn-copy"><b>{a.label}</b><small>{a.draft} · {a.detail}</small></span>
                        <ArrowRight size={15} className="ov-attn-arrow" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : <p className="ov-clear"><Check size={16} />All clear — nothing waits for a decision.</p>}
            </section>
          </div>

          <section className="ov-card ov-drafts" aria-labelledby="ov-drafts-title">
            <div className="ov-card-head ov-drafts-head">
              <h2 id="ov-drafts-title">Your drafts <span className="ov-muted">{drafts.length}</span></h2>
              <div className="ov-drafts-tools">
                <label className="ov-filter-search"><Search size={15} aria-hidden="true" /><input type="search" placeholder="Search drafts" aria-label="Search drafts" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
                <div className="ov-chips" role="group" aria-label="Filter drafts">
                  {([["all", "All"], ["review", "Needs review"], ["outdated", "Outdated"], ["running", "Running"]] as [Filter, string][]).map(([k, label]) => (
                    <button key={k} className="ov-chip" aria-pressed={filter === k} onClick={() => setFilter(k)}>{label}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="ov-table" role="table" aria-label="Drafts">
              <div className="ov-row ov-row-head" role="row">
                <span role="columnheader">Draft</span><span role="columnheader">Stage</span><span role="columnheader">Updated</span><span role="columnheader">Version</span><span role="columnheader"><span className="sr-only">Open</span></span>
              </div>
              {visible.map((d) => {
                const steps = stagesOf(d, state.dirty && d.id === state.draft.id);
                return (
                  <div key={d.id} className="ov-row" role="row">
                    <span role="cell" className="ov-cell-title">
                      <b>{d.title}</b>
                      <small>{typeName(d.regulation_type)}{d.id === state.draft.id ? " · selected" : ""}</small>
                    </span>
                    <span role="cell" className="ov-cell-stage">
                      <Stepper steps={steps} compact />
                      {d.pending_reviews > 0 && <span className="ov-badge ov-badge-review">{d.pending_reviews} to review</span>}
                      {(d.analysis?.outdated || d.impact?.outdated) && <span className="ov-badge ov-badge-warn">Outdated</span>}
                      {d.job?.active && <span className="ov-badge ov-badge-run">Running</span>}
                    </span>
                    <span role="cell" className="ov-muted">{relativeTime(d.updated_at)}</span>
                    <span role="cell"><span className="ov-version">v{d.revision}</span></span>
                    <span role="cell"><button className="ov-btn ov-btn-ghost ov-btn-sm" data-action="open-draft-at" data-id={d.id} data-target="editor" aria-label={`Open ${d.title}`}>Open<ArrowRight size={14} /></button></span>
                  </div>
                );
              })}
              {!visible.length && <p className="ov-empty">No drafts match this filter.</p>}
            </div>
          </section>

          <div className="ov-bottom">
            <section className="ov-card ov-activity" aria-labelledby="ov-activity-title">
              <div className="ov-card-head"><h2 id="ov-activity-title">Recent activity</h2><button className="ov-link" data-view="history">View all<ArrowRight size={14} /></button></div>
              {data.activity.length ? (
                <ol>
                  {data.activity.map((e, i) => (
                    <li key={i}><time dateTime={e.at}>{relativeTime(e.at)}</time><span><b>{e.label}</b><small>{e.draft}</small></span></li>
                  ))}
                </ol>
              ) : <p className="ov-muted">No activity yet.</p>}
            </section>
            <section className="ov-card ov-quick" aria-labelledby="ov-quick-title">
              <div className="ov-card-head"><h2 id="ov-quick-title">Quick start</h2></div>
              <div className="ov-quick-grid">
                {!readOnly && <button data-action="generate"><Sparkles size={18} /><b>Draft from a brief</b><small>Gemini writes the first version</small></button>}
                {!readOnly && <button data-action="import"><FileInput size={18} /><b>Import a document</b><small>TXT, DOCX, PDF or JSON</small></button>}
                <button data-view="library"><BookOpen size={18} /><b>Ask the legal library</b><small>Answers cite the exact article</small></button>
                <button data-view="data"><MapIcon size={18} /><b>Explore the regulation map</b><small>Collection across 38 provinces</small></button>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
