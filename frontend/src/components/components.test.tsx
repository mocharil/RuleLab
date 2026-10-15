// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HomeWorkspace, BentoStats } from "./workspace";
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
  it("shows source counts from state rather than decorative metrics",()=>{
    render(<HomeWorkspace state={state}/>);
    expect(screen.getByText("6 regulation sources · 406 articles/blocks")).toBeTruthy();
    expect(screen.getByText("406 articles/blocks")).toBeTruthy();
    expect(screen.getByText("Demo without credentials")).toBeTruthy();
  });
  it("counts active jobs rather than all jobs",()=>{
    const {container}=render(<BentoStats state={state}/>);
    expect(Array.from(container.querySelectorAll("strong")).map(el=>el.textContent)).toEqual(["2","6","1","1"]);
  });
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
  it("preserves the action bridge for existing legal workflows",()=>{
    const {container}=render(<HomeWorkspace state={state}/>);
    expect(container.querySelector('[data-action="new"]')).toBeTruthy();
    expect(container.querySelector('[data-action="generate"]')).toBeTruthy();
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
  it("keeps mutation actions disabled for a read-only workspace role",()=>{
    const {container}=render(<HomeWorkspace state={{...state,status:{...state.status,principal:{role:"viewer"}}}}/>);
    expect((container.querySelector('[data-action="new"]') as HTMLButtonElement).disabled).toBe(true);
    expect((container.querySelector('[data-action="generate"]') as HTMLButtonElement).disabled).toBe(true);
  });
});

