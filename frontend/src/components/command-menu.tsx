import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Search, Command, ArrowUpRight, X } from "lucide-react";
import { Button } from "./primitives";
const destinations = [
  ["home","Ringkasan workspace","Mulai dari tujuan kebijakan"],
  ["editor","Editor rancangan","Susun pasal dan ekspor DOCX"],
  ["analysis","Pemeriksaan konflik","Telusuri sumber dan interpretasi"],
  ["simulation","Simulasi dampak & forum publik","Bandingkan asumsi A/B dan reaksi persona netizen AI"],
  ["corpus","Pustaka regulasi","Cari pasal dan dokumen resmi"],
  ["gallery","Galeri dokumen","Baca dokumen dan tanyakan maknanya kepada bot"],
  ["history","Riwayat & review","Versi dan catatan reviewer"],
  ["agents","Operasi agen","Eksekusi, sumber dan tool trace"],
];
export function CommandMenu() {
  const [open,setOpen]=useState(false),[query,setQuery]=useState(""),[selected,setSelected]=useState(0);
  const filtered=destinations.filter(row=>row.join(" ").toLowerCase().includes(query.toLowerCase()));
  const navigate=(view:string)=>{setOpen(false);requestAnimationFrame(()=>document.querySelector<HTMLButtonElement>('[data-view="'+view+'"]')?.click());};
  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"&&!document.querySelector("dialog[open]")&&!document.querySelector<HTMLElement>("#main")?.inert){e.preventDefault();setOpen(value=>!value);}};
    document.addEventListener("keydown",key);return()=>document.removeEventListener("keydown",key);
  },[]);
  return <Dialog.Root open={open} onOpenChange={value=>{setOpen(value);if(value){setQuery("");setSelected(0);}}}>
    <Dialog.Trigger asChild><Button className="fx-command-trigger" size="small" aria-label="Navigasi cepat" onClick={event=>{if(document.querySelector("dialog[open]")||document.querySelector<HTMLElement>("#main")?.inert)event.preventDefault();}}><Command size={14}/><span>Menu cepat</span><kbd>⌘ K</kbd></Button></Dialog.Trigger>
    <Dialog.Portal><Dialog.Overlay className="fx-dialog-overlay"/><Dialog.Content className="fx-command-content" onOpenAutoFocus={e=>{e.preventDefault();document.getElementById("framework-command-input")?.focus();}}>
      <Dialog.Title className="fx-command-title">Navigasi workspace</Dialog.Title><Dialog.Description className="fx-command-description">Cari menu dan lanjutkan pekerjaan. Draft yang berubah disimpan sebelum berpindah.</Dialog.Description>
      <Dialog.Close className="fx-command-close" aria-label="Tutup menu cepat"><X size={15}/></Dialog.Close>
      <div className="fx-command-search"><Search size={17}/><input id="framework-command-input" role="combobox" aria-controls="framework-command-results" aria-expanded="true" aria-autocomplete="list" aria-activedescendant={filtered[selected]?"framework-command-"+filtered[selected][0]:undefined} aria-label="Cari menu" autoComplete="off" placeholder="Cari editor, simulasi, sumber…" value={query} onChange={e=>{setQuery(e.target.value);setSelected(0);}} onKeyDown={e=>{
        if(e.key==="ArrowDown"){e.preventDefault();setSelected(i=>Math.min(filtered.length-1,i+1));}
        if(e.key==="ArrowUp"){e.preventDefault();setSelected(i=>Math.max(0,i-1));}
        if(e.key==="Enter"&&filtered[selected]){e.preventDefault();navigate(filtered[selected][0]);}
      }}/></div>
      <div className="fx-command-results" id="framework-command-results" role="listbox" aria-label="Menu workspace">{filtered.map(([view,title,description],i)=><button key={view} id={"framework-command-"+view} role="option" aria-selected={i===selected} tabIndex={-1} onClick={()=>navigate(view)} className={i===selected?"selected":""}><span><b>{title}</b><small>{description}</small></span><ArrowUpRight size={14}/></button>)}{!filtered.length&&<p>Tidak ada menu yang cocok. Coba istilah lain.</p>}</div>
      <div className="fx-command-footer"><span>↑ ↓ Pilih</span><span>Enter Buka</span><span>Esc Tutup</span></div>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}
