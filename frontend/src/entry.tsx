import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { Sidebar } from "./components/sidebar";
import { CommandMenu } from "./components/command-menu";
import { WorkflowCard } from "./components/workspace";
import { OverviewHome } from "./components/overview";
import type { WorkspaceState } from "./state";
import "./styles.css";

const pageRoots: Root[]=[];
let initialized=false;
let homeRoot: Root|null=null;

export function initializeFrameworkShell() {
  if(initialized)return;
  const sidebar=document.querySelector<HTMLElement>("#workspace-sidebar");
  const tools=document.querySelector<HTMLElement>("#framework-tools");
  if(!sidebar||!tools)return;
  initialized=true;document.body.classList.add("framework-ready");
  const sidebarRoot=createRoot(sidebar,{identifierPrefix:"nav-"}),toolsRoot=createRoot(tools,{identifierPrefix:"cmd-"});
  flushSync(()=>{sidebarRoot.render(<Sidebar/>);toolsRoot.render(<CommandMenu/>);});
}
export function disposePageComponents() {
  // Legacy workflows may replace main; React must release its roots first.
  while(pageRoots.length)pageRoots.pop()?.unmount();homeRoot=null;
}
export function renderFrameworkComponents(state:WorkspaceState) {
  if(state.view==="data")return;
  const home=document.querySelector<HTMLElement>("#framework-home");
  if(home){
    const root=createRoot(home,{identifierPrefix:"home-"});pageRoots.push(root);homeRoot=root;
    flushSync(()=>root.render(<OverviewHome state={state}/>));return;
  }
  const heading=document.querySelector("#main .page-heading,#main .enterprise-heading");
  if(!heading)return;
  const container=document.createElement("div");container.className="framework-context";heading.after(container);
  const root=createRoot(container,{identifierPrefix:"flow-"});pageRoots.push(root);
  flushSync(()=>root.render(<WorkflowCard state={state}/>));
}

export function refreshFrameworkStatus(state:WorkspaceState){if(homeRoot&&state.view==="home")flushSync(()=>homeRoot?.render(<OverviewHome state={state}/>));}

