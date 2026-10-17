// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { OverviewHome, nextStep, stagesOf } from "./overview";
import type { OverviewData, OverviewDraft } from "../state";
import { CommandMenu } from "./command-menu";
import { Sidebar } from "./sidebar";
import { NumberTicker } from "./ui/number-ticker";
import { renderCollectionStats } from "../entry";
import type { WorkspaceState } from "../state";

beforeAll(()=>{
  Object.defineProperty(window,"matchMedia",{writable:true,value:()=>({matches:true,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}})});
});
afterEach(()=>{cleanup();document.body.innerHTML="";});
const state:WorkspaceState={
  view:"home",dirty:false,draft:{id:"d",title:"Example",revision:3,articles:[]},drafts:[{},{}],corpus:[{},{}],runs:[{kind:"analysis",revision:3,review_status:"needs_review"}],jobs:[{status:"queued"},{status:"completed"}],status:{provider:"demo",regulations:6,articles:406},
};
describe("framework components",()=>{
  it("formats Indonesian numbers and preserves accessible textContent in NumberTicker",()=>{
    const {container}=render(<NumberTicker value={5463}/>);
    const ticker=container.querySelector(".number-ticker");
    expect(ticker?.textContent).toBe("5.463");
    expect(ticker?.querySelector(".number-ticker-visual")?.getAttribute("data-ticker-value")).toBeTruthy();
  });
  it("renders collection stats with NumberTicker and updates values in place",()=>{
    const host=document.createElement("div");
    document.body.append(host);
    renderCollectionStats(host,[
      {value:109,title:"Unique regulations",caption:"Identitas",iconHtml:"<svg></svg>",tone:"crimson"},
      {value:[19,38],title:"Provinces in collection",caption:"Sebaran",iconHtml:"<svg></svg>",tone:"green"},
    ]);
    expect(Array.from(host.querySelectorAll("strong")).map(el=>el.textContent)).toEqual(["109","19 / 38"]);
  });
  it("sidebar provides labelled destinations and folding control",()=>{
    const {container}=render(<Sidebar/>);
    expect(container.querySelectorAll("#nav [data-view]")).toHaveLength(4);
    expect(screen.getByRole("button",{name:"Activity"})).toBeTruthy();
    expect(screen.getByRole("button",{name:"Data dashboard"})).toBeTruthy();
    expect(screen.getByRole("button",{name:"Collapse sidebar"})).toBeTruthy();
    expect(screen.getByRole("button",{name:"Policy Studio"})).toBeTruthy();
    expect(screen.getByRole("button",{name:"Legal library"})).toBeTruthy();
  });
  it("searches menus and delegates navigation to the established save-aware control",async()=>{
    const target=document.createElement("button");target.dataset.view="studio";const clicked=vi.fn();target.addEventListener("rulelab:studio-route",clicked);document.body.append(target);
    render(<CommandMenu/>);fireEvent.click(screen.getByRole("button",{name:"Quick navigation"}));
    const input=screen.getByRole("combobox",{name:"Search menu"});fireEvent.change(input,{target:{value:"netizen"}});
    expect(screen.getByRole("dialog")).toBeTruthy();fireEvent.keyDown(input,{key:"Enter"});
    await waitFor(()=>expect(clicked).toHaveBeenCalledTimes(1));
    expect(clicked.mock.calls[0][0].detail).toEqual({stage:"simulation",sub:"social"});
  });
  it("returns an empty state when no destination matches",()=>{
    render(<CommandMenu/>);fireEvent.click(screen.getByRole("button",{name:"Quick navigation"}));
    fireEvent.change(screen.getByRole("combobox",{name:"Search menu"}),{target:{value:"does-not-exist"}});
    expect(screen.getByText("No matching menu. Try another term.")).toBeTruthy();
  });
  it("opens with the keyboard and focuses search",async()=>{
    render(<CommandMenu/>);
    fireEvent.keyDown(document,{key:"k",ctrlKey:true});
    await waitFor(()=>expect(document.activeElement?.id).toBe("framework-command-input"));
    fireEvent.keyDown(document,{key:"Escape"});
    await waitFor(()=>expect(screen.queryByRole("dialog")).toBeNull());
  });
  it("does not open above an existing native workflow dialog",()=>{
    const modal=document.createElement("dialog");modal.setAttribute("open","");document.body.append(modal);
    render(<CommandMenu/>);
    fireEvent.keyDown(document,{key:"k",ctrlKey:true});
    expect(document.querySelector(".fx-command-content")).toBeNull();
  });
  it("does not open from its trigger above an existing workflow dialog",()=>{
    const modal=document.createElement("dialog");modal.setAttribute("open","");document.body.append(modal);
    render(<CommandMenu/>);fireEvent.click(screen.getByRole("button",{name:"Quick navigation"}));
    expect(document.querySelector(".fx-command-content")).toBeNull();
    expect(modal.open).toBe(true);
  });
  it("does not open during a busy workspace request",()=>{
    const main=document.createElement("main");main.id="main";main.inert=true;document.body.append(main);
    render(<CommandMenu/>);fireEvent.click(screen.getByRole("button",{name:"Quick navigation"}));
    fireEvent.keyDown(document,{key:"k",ctrlKey:true});
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

const base:OverviewDraft={id:"d",title:"Example",regulation_type:"PP",revision:3,articles:4,updated_at:new Date().toISOString(),analysis:null,impact:null,forum:null,job:null,pending_reviews:0};
const overview:OverviewData={drafts:[{...base,pending_reviews:1,analysis:{id:"r",revision:3,findings:3,review_status:"needs_review",outdated:false,at:base.updated_at}},
  {...base,id:"e",title:"Wage protection",analysis:{id:"q",revision:1,findings:2,review_status:"reviewed_with_notes",outdated:true,at:base.updated_at}}],
  attention:[{kind:"review",draft_id:"d",draft:"Example",label:"1 result awaiting review",detail:"Source check · v3",target:"history"}],
  activity:[{at:base.updated_at,draft_id:"d",draft:"Example",kind:"analysis",label:"Source check finished on v3 · 3 findings"}]};

describe("overview",()=>{
  it("picks the next step by the documented rule order",()=>{
    const run={active:true,id:"j",intent:"legal",status:"running",revision:3,at:""};
    const checked={id:"r",revision:3,findings:2,review_status:"reviewed_with_notes",outdated:false,at:""};
    expect(nextStep(base,true)).toEqual({label:"Save draft",action:"save"});
    expect(nextStep({...base,job:run},false).target).toBe("agents");
    expect(nextStep({...base,pending_reviews:2},false).label).toBe("Review 2 results");
    expect(nextStep(base,false)).toEqual({label:"Run source check on v3",target:"analysis"});
    expect(nextStep({...base,analysis:{...checked,outdated:true,revision:2}},false).target).toBe("analysis");
    expect(nextStep({...base,analysis:checked},false).target).toBe("simulation");
    expect(nextStep({...base,analysis:checked,impact:{id:"s",kind:"simulation",revision:3,outdated:false,at:""}},false).action).toBe("export-draft");
  });
  it("reports each stage with version-bound wording",()=>{
    const steps=stagesOf({...base,analysis:{id:"r",revision:2,findings:3,review_status:"needs_review",outdated:true,at:""}},false);
    expect(steps.map(s=>s.state)).toEqual(["done","warn","todo"]);
    expect(steps[1].detail).toBe("Outdated · ran on v2");
  });
  it("keeps the workspace action bridge and routes other drafts through open-draft-at",()=>{
    const {container}=render(<OverviewHome state={{...state,draft:{...state.draft,id:"d"},overview}}/>);
    expect(container.querySelector('.ov-continue [data-view="history"]')?.textContent).toContain("Review 1 result");
    expect(container.querySelector('.ov-quick [data-action="generate"]')).toBeTruthy();
    expect(container.querySelector('.ov-quick [data-action="import"]')).toBeTruthy();
    fireEvent.click(screen.getByRole("button",{name:"More ways to start a draft"}));
    expect(container.querySelector('.ov-menu [data-action="new"]')).toBeTruthy();
    const row=container.querySelector('[aria-label="Open Wage protection"]') as HTMLElement;
    expect(row.dataset.action).toBe("open-draft-at");expect(row.dataset.id).toBe("e");expect(row.dataset.target).toBe("editor");
    expect(screen.getByText("1 result awaiting review")).toBeTruthy();
  });
  it("filters drafts and hides creation for read-only roles",()=>{
    const {container}=render(<OverviewHome state={{...state,overview,status:{...state.status,principal:{role:"viewer"}}}}/>);
    expect(container.querySelector('[data-action="generate"],[data-action="new"],[data-action="import"]')).toBeNull();
    fireEvent.click(screen.getByRole("button",{name:"Outdated"}));
    expect(container.querySelectorAll(".ov-row:not(.ov-row-head)")).toHaveLength(1);
    expect(screen.getByText("Wage protection")).toBeTruthy();
  });
  it("shows loading and empty states without zero-heavy metrics",()=>{
    const {container}=render(<OverviewHome state={state}/>);
    expect(container.querySelector('[aria-label="Loading overview"]')).toBeTruthy();
    cleanup();
    render(<OverviewHome state={{...state,overview:{...overview,attention:[]}}}/>);
    expect(screen.getByText(/All clear/)).toBeTruthy();
  });
});
