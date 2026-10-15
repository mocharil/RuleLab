import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Search, Command, ArrowUpRight, X } from "lucide-react";
import { Button } from "./primitives";
const destinations = [
  ["home","Workspace overview","Start from the policy goal"],
  ["data","Data dashboard","Collection, regional map and the upload/JDIH source queue"],
  ["studio","Policy Studio","Draft documents, verify sources and test policy impact","editor analysis review check conflict simulation forum public persona impact analisis pemeriksaan periksa konflik simulasi netizen dampak"],
  ["library","Legal library","Document gallery and regulation sources: search articles, read, ask and compare","gallery library corpus documents galeri pustaka"],
  ["activity","Activity","Results, reviews, draft versions and agent runs","history agent agents runs execution trace notes riwayat eksekusi catatan"],
];
export function CommandMenu() {
  const [open,setOpen]=useState(false),[query,setQuery]=useState(""),[selected,setSelected]=useState(0);
  const filtered=destinations.filter(row=>row.join(" ").toLowerCase().includes(query.toLowerCase()));
  const navigate=(view:string)=>{
    setOpen(false);
    requestAnimationFrame(()=>{
      const target=document.querySelector<HTMLButtonElement>('[data-view="'+view+'"]');
      if(view==="activity"){
        const tab=/agen|agent|eksekusi|trace|proses/.test(query.toLowerCase())?"agents":"results";
        target?.dispatchEvent(new CustomEvent("rulelab:activity-route",{bubbles:true,detail:{tab}}));return;
      }
      if(view!=="studio"){target?.click();return;}
      const search=query.toLowerCase();
      const stage=/simulasi|dampak|forum|netizen|persona/.test(search)?"simulation":/analisis|konflik|periksa|pemeriksaan|review/.test(search)?"analysis":/editor|rancang|naskah|susun/.test(search)?"editor":undefined;
      if(!stage){target?.click();return;}
      target?.dispatchEvent(new CustomEvent("rulelab:studio-route",{bubbles:true,detail:{stage,sub:/forum|netizen|persona/.test(search)?"social":undefined}}));
    });
  };
  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"&&!document.querySelector("dialog[open]")&&!document.querySelector<HTMLElement>("#main")?.inert){e.preventDefault();setOpen(value=>!value);}};
    document.addEventListener("keydown",key);return()=>document.removeEventListener("keydown",key);
  },[]);
  return <Dialog.Root open={open} onOpenChange={value=>{setOpen(value);if(value){setQuery("");setSelected(0);}}}>
    <Dialog.Trigger asChild><Button className="fx-command-trigger" size="small" aria-label="Quick navigation" onClick={event=>{if(document.querySelector("dialog[open]")||document.querySelector<HTMLElement>("#main")?.inert)event.preventDefault();}}><Command size={14}/><span>Quick menu</span><kbd>⌘ K</kbd></Button></Dialog.Trigger>
    <Dialog.Portal><Dialog.Overlay className="fx-dialog-overlay"/><Dialog.Content className="fx-command-content" onOpenAutoFocus={e=>{e.preventDefault();document.getElementById("framework-command-input")?.focus();}}>
      <Dialog.Title className="fx-command-title">Navigasi workspace</Dialog.Title><Dialog.Description className="fx-command-description">Search the menu and continue your work. Changed drafts are saved before switching.</Dialog.Description>
      <Dialog.Close className="fx-command-close" aria-label="Close quick menu"><X size={15}/></Dialog.Close>
      <div className="fx-command-search"><Search size={17}/><input id="framework-command-input" role="combobox" aria-controls="framework-command-results" aria-expanded="true" aria-autocomplete="list" aria-activedescendant={filtered[selected]?"framework-command-"+filtered[selected][0]:undefined} aria-label="Search menu" autoComplete="off" placeholder="Search editor, simulation, sources…" value={query} onChange={e=>{setQuery(e.target.value);setSelected(0);}} onKeyDown={e=>{
        if(e.key==="ArrowDown"){e.preventDefault();setSelected(i=>Math.max(0,Math.min(filtered.length-1,i+1)));}
        if(e.key==="ArrowUp"){e.preventDefault();setSelected(i=>Math.max(0,i-1));}
        if(e.key==="Enter"&&filtered[selected]){e.preventDefault();navigate(filtered[selected][0]);}
      }}/></div>
      <div className="fx-command-results" id="framework-command-results" role="listbox" aria-label="Menu workspace">{filtered.map(([view,title,description],i)=><button key={view} id={"framework-command-"+view} role="option" aria-selected={i===selected} tabIndex={-1} onClick={()=>navigate(view)} className={i===selected?"selected":""}><span><b>{title}</b><small>{description}</small></span><ArrowUpRight size={14}/></button>)}{!filtered.length&&<p>No matching menu. Try another term.</p>}</div>
      <div className="fx-command-footer"><span>↑ ↓ Pilih</span><span>Enter Open</span><span>Esc Tutup</span></div>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}
