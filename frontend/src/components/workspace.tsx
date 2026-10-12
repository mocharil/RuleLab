import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, FilePenLine, ShieldCheck, Network, BookOpen, Plus, Clock3, ChevronRight, FileInput } from "lucide-react";
import { Button } from "./primitives";
import type { WorkspaceState } from "../state";

export function HomeHero({ state }: { state: WorkspaceState }) {
  const reduced = useReducedMotion();
  const readOnly = ["viewer", "reviewer"].includes(state.status.principal?.role || "");
  return <motion.section className="home-banner" initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}>
    <div><h1>Meja kerja regulasi</h1><p>Lanjutkan rancangan, tinjau temuan, atau uji alternatif kebijakan.</p></div>
    <div className="actions"><Button disabled={readOnly} data-action="import"><FileInput size={16}/>Impor dokumen</Button><Button variant="primary" disabled={readOnly} data-action="new"><Plus size={16}/>Rancangan baru</Button></div>
  </motion.section>;
}

export function BentoStats({ state }: { state: WorkspaceState }) {
  const active = state.jobs.filter(j => ["queued", "running", "cancelling"].includes(j.status)).length;
  const cards = [
    ["Rancangan", state.drafts.length, "Dalam workspace", FilePenLine],
    ["Sumber regulasi", state.status.regulations ?? state.corpus.length, `${state.status.articles ?? 0} pasal/blok`, BookOpen],
    ["Hasil pada naskah", state.runs.length, "Pemeriksaan dan simulasi", ShieldCheck],
    ["Agen berjalan", active, "Pada naskah yang dipilih", Network],
  ] as const;
  return <div className="workspace-metrics">{cards.map(([label, value, note, Icon]) => <div className="workspace-metric" key={label}><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div><Icon size={19} aria-hidden="true"/></div>)}</div>;
}

export function HomeWorkspace({ state }: { state: WorkspaceState }) {
  const pending = state.runs.filter(r => r.review_status === "needs_review");
  const analysis = state.runs.find(r => r.kind === "analysis");
  const readOnly = ["viewer", "reviewer"].includes(state.status.principal?.role || "");
  const paths = [
    ["editor", "01", "Susun rancangan", "Edit pasal dan jalankan asisten dari satu layar.", FilePenLine],
    ["analysis", "02", "Tinjau potensi konflik", "Periksa kutipan, hierarki, dan interpretasi.", ShieldCheck],
    ["social", "03", "Eksplorasi reaksi", "Ikuti pendapat dan balasan lima persona sintetis.", Network],
  ] as const;
  return <><HomeHero state={state}/><BentoStats state={state}/>
    <section className="resume-workspace" aria-label="Rancangan aktif">
      <div className="resume-manuscript"><span className="resume-type">{state.draft.title}</span><div className="resume-clause">{state.draft.articles[0] ? <><b>Pasal {state.draft.articles[0].number}</b><p>{state.draft.articles[0].text}</p></> : <p>Isi pasal akan tampil setelah rancangan disusun.</p>}</div><span className="resume-version">Versi {state.draft.revision} · {state.draft.articles.length} pasal</span></div>
      <div className="resume-copy"><span className="resume-label">Rancangan aktif</span><h2>Lanjutkan dari naskah Anda.</h2><p>Baca pasal, periksa sumber, dan uji alternatif di editor.</p><Button variant="primary" data-view="editor">Buka editor<ArrowRight size={16}/></Button><Button variant="ghost" data-view="gallery">Belajar dari dokumen<BookOpen size={16}/></Button></div>
    </section>
    <div className="home-bottom">
      <section className="panel draft-collection"><div className="panel-head"><div><h2>Rancangan Anda</h2><p>{state.drafts.length} naskah tersimpan</p></div><Button size="small" disabled={readOnly} data-action="generate">Mulai dari brief<ArrowRight size={14}/></Button></div>
        <div className="draft-table" role="table" aria-label="Rancangan tersimpan"><div className="draft-table-head" role="row"><span role="columnheader">Naskah</span><span role="columnheader">Versi</span><span role="columnheader">Tindakan</span></div>
          {state.drafts.map((draft, i) => <div className="resume-row" role="row" key={draft.id || i}><div role="cell" className="draft-cell"><span className="document-icon"><FilePenLine size={18}/></span><div><h3>{draft.title || "Rancangan"}</h3><span className="micro">{draft.regulation_type || "Naskah regulasi"}{draft.id === state.draft.id ? " · Sedang dipilih" : ""}</span></div></div><span role="cell" className="version-label">v{draft.revision ?? 1}</span><div role="cell"><Button size="small" variant="ghost" data-action="open-draft" data-id={draft.id}>Buka<ChevronRight size={15}/></Button></div></div>)}
        </div>
      </section>
      <aside className="panel review-inbox"><div className="panel-head"><h2>Perlu perhatian</h2><Clock3 size={16}/></div><div className="panel-body"><span className="inbox-count">{pending.length}</span><h3>hasil menunggu review</h3><p>Pada rancangan “{state.draft.title}”.</p>{analysis && <div className="inbox-context"><ShieldCheck size={16}/><span>{analysis.payload?.findings?.length ?? 0} temuan pada pemeriksaan terakhir <small>Snapshot v{analysis.revision}</small></span></div>}<Button data-view="history">Tinjau hasil<ArrowRight size={14}/></Button></div><div className="inbox-foot">Keputusan dan penerapan revisi tetap melalui reviewer.</div></aside>
    </div>
    <section className="home-grid" aria-label="Langkah kerja"><div className="section-toolbar"><div><h2>Lanjutkan alur Anda</h2><p>Susun naskah, periksa sumber, lalu pertimbangkan dampaknya.</p></div><Button variant="ghost" data-action="legal-guide">Pedoman legal<ArrowRight size={14}/></Button></div><div className="workspace-paths">{paths.map(([view, n, title, desc, Icon]) => <button key={view} className="workspace-path" data-view={view}><div><Icon size={19}/><span>{n}</span></div><h3>{title}</h3><p>{desc}</p><ArrowRight size={17} className="path-arrow"/></button>)}</div></section>
    <div className="workspace-provenance"><BookOpen size={15}/><span>{state.status.regulations ?? state.corpus.length} sumber regulasi · {state.status.articles ?? 0} pasal/blok</span><span>{state.status.provider === "demo" ? "Demo tanpa kredensial" : `Provider ${state.status.provider}`}</span><Button size="small" variant="ghost" data-view="corpus">Lihat sumber<ArrowRight size={13}/></Button></div>
  </>;
}

export function WorkflowCard({ state }: { state: WorkspaceState }) {
  return <div className="workspace-context"><span className="context-document"><FilePenLine size={14}/>{state.draft.title}</span><span className="context-version">v{state.draft.revision}</span><span className={state.dirty ? "context-dirty" : "context-saved"}>{state.dirty ? "Belum disimpan" : "Naskah tersimpan"}</span>{state.view !== "editor" && <Button size="small" variant="ghost" data-view="editor">Buka editor<ChevronRight size={13}/></Button>}</div>;
}
