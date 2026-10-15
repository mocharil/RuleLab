import * as Tooltip from "@radix-ui/react-tooltip";
import { FilePenLine, LibraryBig, History, House, PanelLeftClose, Settings2, ScanLine, Map } from "lucide-react";
const items = [
  ["studio", "Policy Studio", FilePenLine],
  ["data", "Data dashboard", Map], ["library", "Legal library", LibraryBig], ["activity", "Activity", History],
] as const;
export function Sidebar() {
  return <Tooltip.Provider delayDuration={450}>
    <div className="sidebar-brand"><a className="brand" href="/" aria-label="RuleLab, home page"><span className="brand-icon" aria-hidden="true"/><div>RuleLab<span className="brand-edition">INDONESIA</span></div></a><button id="sidebar-toggle" className="sidebar-toggle" data-ux="sidebar" aria-controls="workspace-sidebar" aria-expanded="true" aria-label="Collapse sidebar"><PanelLeftClose size={17} aria-hidden="true"/></button></div>
    <div className="workspace"><span className="workspace-icon">ID</span><div>Workspace Indonesia<small>Regulation drafting</small></div></div>
    <div className="nav-label">WORKSPACE</div>
    <button className="workspace-home-link" data-view="home" aria-label="Workspace overview"><House size={18} aria-hidden="true"/><span className="home-label">Overview</span></button>
    <nav id="nav" aria-label="Navigasi utama">{items.map(([view, label, Icon], i) => <div key={view} className={i === 1 ? "nav-section-start" : "nav-item"}>{i === 1 && <div className="nav-label">SOURCES & ACTIVITY</div>}<Tooltip.Root><Tooltip.Trigger asChild><button data-view={view} aria-label={label}><span className="nav-icon" aria-hidden="true"><Icon size={18}/></span><span className="nav-title">{label}</span></button></Tooltip.Trigger><Tooltip.Portal><Tooltip.Content className="fx-tooltip" side="right" sideOffset={12}>{label}<Tooltip.Arrow/></Tooltip.Content></Tooltip.Portal></Tooltip.Root></div>)}</nav>
    <div className="sidebar-bottom">
      <a className="settings-link" href="/guide" target="_blank" rel="noopener"><LibraryBig size={17} aria-hidden="true"/><span className="settings-label">User guide</span></a>
      <div className="source-badge"><span className="dot"/><div>Source trail available<small>Document · Article · Version</small></div></div>
      <button className="settings-link" data-action="audit" aria-label="Audit workspace"><ScanLine size={17} aria-hidden="true"/><span className="settings-label">Audit workspace</span></button>
      <button id="settings-btn" className="settings-link" aria-label="Integration settings"><Settings2 size={17} aria-hidden="true"/><span className="settings-label">Integration settings</span></button>
      <div className="sidebar-foot"><span className="workspace-icon">RL</span><div>RuleLab Studio<small>Hackathon workspace</small></div></div>
    </div>
  </Tooltip.Provider>;
}
