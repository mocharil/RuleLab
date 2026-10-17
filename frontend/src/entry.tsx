import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { Sidebar } from "./components/sidebar";
import { CommandMenu } from "./components/command-menu";
import { WorkflowCard } from "./components/workspace";
import { OverviewHome } from "./components/overview";
import { NumberTicker } from "./components/ui/number-ticker";
import type { WorkspaceState } from "./state";
import "./styles.css";

export { NumberTicker };

export interface CollectionStatItem {
  value: number | [number, number];
  title: string;
  caption: string;
  iconHtml: string;
  tone: string;
}

const pageRoots: Root[]=[];
const tickerRoots = new WeakMap<Element, Root>();
let initialized=false;
let homeRoot: Root|null=null;

function getOrCreateRoot(container: Element, prefix: string): Root {
  let root = tickerRoots.get(container);
  if (!root) {
    root = createRoot(container, { identifierPrefix: prefix });
    tickerRoots.set(container, root);
  }
  return root;
}

export function renderCollectionStats(container: HTMLElement | null, items: CollectionStatItem[]) {
  if (!container) return;
  const root = getOrCreateRoot(container, "collection-stats-");
  flushSync(() => {
    root.render(
      <>
        {items.map((item, idx) => (
          <div key={item.title} className={`collection-stat collection-stat-${item.tone}`}>
            <div className="collection-stat-top">
              <span>{item.title}</span>
              <span
                className={`collection-visual-icon collection-icon-${item.tone}`}
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: item.iconHtml }}
              />
            </div>
            <strong>
              {Array.isArray(item.value) ? (
                <>
                  <NumberTicker value={item.value[0]} delay={idx * 0.06} />
                  {" / "}
                  <NumberTicker value={item.value[1]} delay={idx * 0.06 + 0.04} />
                </>
              ) : (
                <NumberTicker value={item.value} delay={idx * 0.06} />
              )}
            </strong>
            <small>{item.caption}</small>
          </div>
        ))}
      </>,
    );
  });
}

export function renderNumberTicker(
  container: HTMLElement | null,
  value: number,
  options?: { startValue?: number; delay?: number; suffix?: string },
) {
  if (!container) return;
  const root = getOrCreateRoot(container, "ticker-");
  flushSync(() => {
    root.render(
      <>
        <NumberTicker
          value={value}
          startValue={options?.startValue ?? 0}
          delay={options?.delay ?? 0}
        />
        {options?.suffix ? (
          <>
            {" "}
            <span>{options.suffix}</span>
          </>
        ) : null}
      </>,
    );
  });
}

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

