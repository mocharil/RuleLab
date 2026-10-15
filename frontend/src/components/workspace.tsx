import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, FilePenLine, ShieldCheck, Network, BookOpen, Plus, Clock3, ChevronRight, FileInput, LayoutDashboard, Scale } from "lucide-react";
import { Button } from "./primitives";
import type { WorkspaceState } from "../state";

export function HomeHero({ state }: { state: WorkspaceState }) {
  const reduced = useReducedMotion();
  const readOnly = ["viewer", "reviewer"].includes(state.status.principal?.role || "");
  return <motion.section className="home-banner visual-heading visual-tone-crimson" initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}>
    <div className="visual-heading-copy"><div className="eyebrow visual-heading-label"><LayoutDashboard size={17} aria-hidden="true"/>REGULATION WORKSPACE</div><h1>Regulation desk</h1><p>Continue a draft, review findings, or test policy alternatives.</p></div>
    <div className="actions"><Button disabled={readOnly} data-action="import"><FileInput size={16}/>Import document</Button><Button variant="primary" disabled={readOnly} data-action="new"><Plus size={16}/>New draft</Button></div>
    <div className="visual-art visual-tone-crimson visual-art-home" aria-hidden="true"><span className="visual-art-orbit"/><span className="visual-art-sheet visual-art-back"/><span className="visual-art-sheet visual-art-middle"/><span className="visual-art-sheet visual-art-front"><LayoutDashboard size={28}/><i/><i/><i/></span><span className="visual-art-satellite"><FilePenLine size={19}/></span><span className="visual-art-dot"/></div>
  </motion.section>;
}

export function BentoStats({ state }: { state: WorkspaceState }) {
  const active = state.jobs.filter(j => ["queued", "running", "cancelling"].includes(j.status)).length;
  const cards = [
    ["Draft", state.drafts.length, "In the workspace", FilePenLine],
    ["Regulation sources", state.status.regulations ?? state.corpus.length, `${state.status.articles ?? 0} articles/blocks`, BookOpen],
    ["Results on the document", state.runs.length, "Checks and simulations", ShieldCheck],
    ["Agents running", active, "On the selected document", Network],
  ] as const;
  return <div className="workspace-metrics">{cards.map(([label, value, note, Icon], index) => <div className="workspace-metric" key={label}><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div><span className={`visual-badge visual-tone-${["crimson", "blue", "green", "violet"][index]}`} aria-hidden="true"><Icon size={20}/></span></div>)}</div>;
}

export function HomeWorkspace({ state }: { state: WorkspaceState }) {
  const pending = state.runs.filter(r => r.review_status === "needs_review");
  const analysis = state.runs.find(r => r.kind === "analysis");
  const readOnly = ["viewer", "reviewer"].includes(state.status.principal?.role || "");
  const paths = [
    ["editor", "01", "Draft a regulation", "Edit articles and run the assistant from one screen.", FilePenLine],
    ["analysis", "02", "Review potential conflicts", "Check quotes, hierarchy and interpretations.", ShieldCheck],
    ["simulation", "03", "Test policy impact", "Compare A/B scenarios and review synthetic persona reactions.", Network],
  ] as const;
  return <><HomeHero state={state}/><BentoStats state={state}/>
    <section className="resume-workspace" aria-label="Active draft">
      <div className="resume-manuscript"><span className="resume-document-mark" aria-hidden="true"><Scale size={22}/></span><span className="resume-type">{state.draft.title}</span><div className="resume-clause">{state.draft.articles[0] ? <><b>Pasal {state.draft.articles[0].number}</b><p>{state.draft.articles[0].text}</p></> : <p>Article text appears once the draft is composed.</p>}</div><span className="resume-version">Version {state.draft.revision} · {state.draft.articles.length} articles</span></div>
      <div className="resume-copy"><span className="resume-label">Active draft</span><h2>Continue from your document.</h2><p>Read articles, verify sources and test alternatives in the editor.</p><Button variant="primary" data-view="editor">Continue drafting<ArrowRight size={16}/></Button><Button variant="ghost" data-view="library">Learn from documents<BookOpen size={16}/></Button></div>
    </section>
    <div className="home-bottom">
      <section className="panel draft-collection"><div className="panel-head"><div><h2 className="visual-section-title"><span className="visual-badge visual-tone-crimson" aria-hidden="true"><FilePenLine size={17}/></span>Your drafts</h2><p>{state.drafts.length} saved documents</p></div><Button size="small" disabled={readOnly} data-action="generate">Start from a brief<ArrowRight size={14}/></Button></div>
        <div className="draft-table" role="table" aria-label="Saved drafts"><div className="draft-table-head" role="row"><span role="columnheader">Document</span><span role="columnheader">Version</span><span role="columnheader">Action</span></div>
          {state.drafts.map((draft, i) => <div className="resume-row" role="row" key={draft.id || i}><div role="cell" className="draft-cell"><span className="document-icon"><FilePenLine size={18}/></span><div><h3>{draft.title || "Draft"}</h3><span className="micro">{draft.regulation_type || "Regulation document"}{draft.id === state.draft.id ? " · Selected" : ""}</span></div></div><span role="cell" className="version-label">v{draft.revision ?? 1}</span><div role="cell"><Button size="small" variant="ghost" data-action="open-draft" data-id={draft.id}>Open<ChevronRight size={15}/></Button></div></div>)}
        </div>
      </section>
      <aside className="panel review-inbox"><div className="panel-head"><h2 className="visual-section-title"><span className="visual-badge visual-tone-green" aria-hidden="true"><Clock3 size={17}/></span>Needs attention</h2></div><div className="panel-body"><span className="inbox-count">{pending.length}</span><h3>results awaiting review</h3><p>On draft “{state.draft.title}”.</p>{analysis && <div className="inbox-context"><ShieldCheck size={16}/><span>{analysis.payload?.findings?.length ?? 0} findings in the latest check <small>Snapshot v{analysis.revision}</small></span></div>}<Button data-view="history">Review results<ArrowRight size={14}/></Button></div><div className="inbox-foot">Decisions and applying revisions always go through a reviewer.</div></aside>
    </div>
    <section className="home-grid" aria-label="Workflow"><div className="section-toolbar"><div><h2>Lanjutkan alur Anda</h2><p>Draft the document, verify sources, then weigh its impact.</p></div><Button variant="ghost" data-action="legal-guide">Pedoman legal<ArrowRight size={14}/></Button></div><div className="workspace-paths">{paths.map(([view, n, title, desc, Icon]) => <button key={view} className="workspace-path" data-view={view}><div><Icon size={19}/><span>{n}</span></div><h3>{title}</h3><p>{desc}</p><ArrowRight size={17} className="path-arrow"/></button>)}</div></section>
    <div className="workspace-provenance"><BookOpen size={15}/><span>{state.status.regulations ?? state.corpus.length} regulation sources · {state.status.articles ?? 0} articles/blocks</span><span>{state.status.provider === "demo" ? "Demo without credentials" : `Provider ${state.status.provider}`}</span><Button size="small" variant="ghost" data-view="data">Jelajahi data & peta<ArrowRight size={13}/></Button><Button size="small" variant="ghost" data-view="library">Open legal library<ArrowRight size={13}/></Button></div>
  </>;
}

export function WorkflowCard({ state }: { state: WorkspaceState }) {
  return <div className="workspace-context"><span className="context-document"><FilePenLine size={14}/>{state.draft.title}</span><span className="context-version">v{state.draft.revision}</span><span className={state.dirty ? "context-dirty" : "context-saved"}>{state.dirty ? "Not saved" : "Saved document"}</span>{state.view !== "editor" && <Button size="small" variant="ghost" data-view="editor">Edit document<ChevronRight size={13}/></Button>}</div>;
}
