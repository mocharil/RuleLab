import { FilePenLine, ChevronRight } from "lucide-react";
import { Button } from "./primitives";
import type { WorkspaceState } from "../state";

export function WorkflowCard({ state }: { state: WorkspaceState }) {
  return <div className="workspace-context"><span className="context-document"><FilePenLine size={14}/>{state.draft.title}</span><span className="context-version">v{state.draft.revision}</span><span className={state.dirty ? "context-dirty" : "context-saved"}>{state.dirty ? "Not saved" : "Saved document"}</span>{state.view !== "editor" && <Button size="small" variant="ghost" data-view="editor">Edit document<ChevronRight size={13}/></Button>}</div>;
}
