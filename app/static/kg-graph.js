// Stakeholder knowledge graph (MiroFish-style): force-directed entities and relations from a public-forum run.
// Pure rendering of `payload.network.graph`; the layout is computed once per graph and kept with zoom and selection.
import {icon} from '/static/design.js';
const E=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const KG_TYPES={policy:['Policy','#b42338'],article:['Article','#2f6fb0'],source:['Legal source','#7a5ab0'],issue:['Issue','#c58a1a'],stakeholder:['Stakeholder','#1f8a5b'],institution:['Institution','#0e7490'],group:['Group','#d0477a'],instrument:['Instrument','#4f46e5'],place:['Place','#5e8f1b'],concept:['Concept','#64748b']};
const typeInfo=t=>KG_TYPES[t]||[String(t||'Entity'),'#94a3b8'];
const STANCE={support:['Support','#1f9d6b'],conditional:['Conditional','#c58a1a'],concern:['Concern','#c0392b'],uncertain:['Undecided','#9aa3b2']};
const relLabel=t=>String(t||'').replace(/_/g,' ');
const layouts=new Map(),views=new Map();

function subgraph(graph,focus,limit=12){
 const near=graph.relations.filter(r=>r.source===focus||r.target===focus).sort((a,b)=>(b.weight||1)-(a.weight||1));
 const keep=new Set([focus]);for(const r of near){if(keep.size>limit)break;keep.add(r.source===focus?r.target:r.source);}
 return {...graph,entities:graph.entities.filter(e=>keep.has(e.id)),relations:graph.relations.filter(r=>keep.has(r.source)&&keep.has(r.target))};
}

function layout(graph,key,W,H){
 if(layouts.has(key))return layouts.get(key);
 const d3=globalThis.d3,nodes=graph.entities.map(e=>({...e})),ids=new Set(nodes.map(n=>n.id));
 const links=graph.relations.filter(r=>ids.has(r.source)&&ids.has(r.target)&&r.source!==r.target).map(r=>({...r}));
 const degree={};for(const l of links){degree[l.source]=(degree[l.source]||0)+1;degree[l.target]=(degree[l.target]||0)+1;}
 const types=[...new Set(nodes.map(n=>n.type))];
 nodes.forEach((n,i)=>{n.degree=degree[n.id]||0;n.r=n.type==='policy'?19:Math.min(15,6+Math.sqrt(n.degree)*2.3);
  const a=2*Math.PI*types.indexOf(n.type)/types.length+i*.41,rad=n.type==='policy'?0:Math.min(W,H)*.3;n.x=W/2+Math.cos(a)*rad;n.y=H/2+Math.sin(a)*rad;});
 if(d3?.forceSimulation){
  const compactDistance=nodes.length<16?80:130;
  const sim=d3.forceSimulation(nodes)
   .force('link',d3.forceLink(links).id(d=>d.id).distance(l=>l.type==='part_of'?70:['concerned_with','grounds'].includes(l.type)?90:compactDistance).strength(l=>l.type==='part_of'?.7:.18))
   .force('charge',d3.forceManyBody().strength(n=>n.type==='policy'?-1600:-520).distanceMax(520))
   .force('collide',d3.forceCollide(n=>n.r+24).strength(.9))
   .force('x',d3.forceX(W/2).strength(H>W?.16:.035)).force('y',d3.forceY(H/2).strength(H>W?.025:.06)).stop();
  for(let i=0;i<320;i++)sim.tick();
 }
 for(const l of links){if(typeof l.source==='object'){l.source=l.source.id;l.target=l.target.id;}}
 const result={nodes,links,byId:Object.fromEntries(nodes.map(n=>[n.id,n]))};
 if(layouts.size>24)layouts.delete(layouts.keys().next().value);
 layouts.set(key,result);return result;
}

export function focusKnowledgeEntity(key,id){const view=views.get(key)||{};views.set(key,{...view,sel:id,fit:true});}

/* mountKnowledgeGraph(el,{graph,key,stances,compact,focus,onAction,actions})
   stances: {stakeholderEntityId: 'support'|'concern'|...}; onAction(kind, entity) for 'persona', 'article' and (compact) 'open'. */
export function mountKnowledgeGraph(el,{graph,key='kg',stances={},compact=false,focus=null,onAction=null,actions=['persona','article'],caption=''}={}){
 if(!el)return;
 if(!graph?.entities?.length){el.innerHTML='<p class="micro kg-empty">This run has no knowledge graph. Choose a crowd size above zero before collecting opinions.</p>';return;}
 const g=compact&&focus?subgraph(graph,focus):graph;
 if(compact&&g.entities.length<2){el.innerHTML='<p class="micro kg-empty">No stakeholder links for this article in the last public forum.</p>';return;}
 // Narrow screens get a portrait canvas so labels stay readable instead of a shrunken landscape graph.
 const narrow=!compact&&el.clientWidth>0&&el.clientWidth<640,W=compact?340:narrow?560:1000,H=compact?220:narrow?760:620,layoutKey=key+(compact?'|'+focus:'')+(narrow?'|narrow':'');
 const L=layout(g,layoutKey,W,H),st=views.get(layoutKey)||{sel:compact?focus:null,labels:false,hidden:[],query:'',transform:null,fit:true};views.set(layoutKey,st);
 if(st.sel&&!L.byId[st.sel])st.sel=null;
 const counts={};for(const n of L.nodes)counts[n.type]=(counts[n.type]||0)+1;
 const label=n=>n.label.length>28?n.label.slice(0,27)+'…':n.label;
 const node=n=>{const [,color]=typeInfo(n.type),stance=STANCE[stances[n.id]];return '<g class="kg-node kg-t-'+E(n.type)+'" data-kg-id="'+E(n.id)+'" transform="translate('+n.x.toFixed(1)+' '+n.y.toFixed(1)+')" role="button" tabindex="0" aria-label="'+E(typeInfo(n.type)[0]+': '+n.label)+'">'+(stance?'<circle class="kg-stance" r="'+(n.r+4.5)+'" stroke="'+stance[1]+'"/>':'')+'<circle class="kg-dot" r="'+n.r+'" fill="'+color+'"/>'+(n.type==='policy'?'<text class="kg-glyph" dy="5">§</text>':'')+'<text class="kg-label" x="'+(n.r+5)+'" dy="4">'+E(label(n))+'</text></g>';};
 const link=(l,i)=>{const a=L.byId[l.source],b=L.byId[l.target];return '<g class="kg-link kg-r-'+E(l.type)+'" data-kg-link="'+i+'" data-s="'+E(l.source)+'" data-t="'+E(l.target)+'"><line x1="'+a.x.toFixed(1)+'" y1="'+a.y.toFixed(1)+'" x2="'+b.x.toFixed(1)+'" y2="'+b.y.toFixed(1)+'"/><text class="kg-link-label" x="'+((a.x+b.x)/2).toFixed(1)+'" y="'+((a.y+b.y)/2).toFixed(1)+'" dy="-3">'+E(relLabel(l.type))+'</text></g>';};
 const svg='<svg class="kg-svg" viewBox="0 0 '+W+' '+H+'" style="aspect-ratio:'+W+' / '+H+'" role="group" aria-label="Knowledge graph: '+L.nodes.length+' entities, '+L.links.length+' relations"><g class="kg-zoom"><g class="kg-links">'+L.links.map(link).join('')+'</g><g class="kg-nodes">'+L.nodes.slice().sort((a,b)=>a.degree-b.degree).map(node).join('')+'</g></g></svg>';
 if(compact){
  el.innerHTML='<div class="kg kg-compact">'+svg+(caption?'<p class="kg-caption micro">'+caption+'</p>':'')+'</div>';
 }else{
  el.innerHTML='<div class="kg"><div class="kg-canvas"><div class="kg-toolbar"><input class="kg-search" type="search" placeholder="Find an entity…" aria-label="Find an entity in the knowledge graph" value="'+E(st.query)+'"><label class="kg-toggle"><input type="checkbox" data-kg-labels '+(st.labels?'checked':'')+'> Relation labels</label><button type="button" class="kg-tool" data-kg-fit title="Fit to view" aria-label="Fit graph to view">'+icon('focus',16)+'</button><button type="button" class="kg-tool" data-kg-full title="Full screen" aria-label="Show graph full screen">'+icon('zoomIn',16)+'</button></div>'+svg+
   '<div class="kg-legend" aria-label="Entity types">'+Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([t,c])=>'<button type="button" data-kg-type="'+E(t)+'" aria-pressed="'+!st.hidden.includes(t)+'"><i style="background:'+typeInfo(t)[1]+'"></i>'+E(typeInfo(t)[0])+' <b>'+c+'</b></button>').join('')+(Object.keys(stances).length?'<span class="kg-legend-note"><i class="kg-ring"></i>ring = latest persona stance</span>':'')+'</div></div><aside class="kg-detail" aria-live="polite"></aside></div>';
 }
 const root=el.querySelector('.kg'),svgEl=el.querySelector('.kg-svg'),zoomG=el.querySelector('.kg-zoom'),d3=globalThis.d3;
 root.classList.toggle('kg-show-labels',Boolean(st.labels));
 const neighbors=id=>{const s=new Set([id]);for(const l of L.links){if(l.source===id)s.add(l.target);if(l.target===id)s.add(l.source);}return s;};
 const apply=()=>{
  const focusSet=st.sel?neighbors(st.sel):null,query=st.query.trim().toLocaleLowerCase();
  el.querySelectorAll('.kg-node').forEach(n=>{const id=n.dataset.kgId,ent=L.byId[id],hidden=st.hidden.includes(ent.type);n.style.display=hidden?'none':'';n.classList.toggle('kg-selected',id===st.sel);n.classList.toggle('kg-dim',Boolean(focusSet&&!focusSet.has(id)));n.classList.toggle('kg-match',Boolean(query)&&ent.label.toLocaleLowerCase().includes(query));});
  el.querySelectorAll('.kg-link').forEach(l=>{const s=L.byId[l.dataset.s],t=L.byId[l.dataset.t],hidden=st.hidden.includes(s.type)||st.hidden.includes(t.type);l.style.display=hidden?'none':'';const hot=Boolean(st.sel&&(s.id===st.sel||t.id===st.sel));l.classList.toggle('kg-hot',hot);l.classList.toggle('kg-dim',Boolean(st.sel&&!hot));});
  if(!compact)el.querySelector('.kg-detail').innerHTML=detail();
 };
 const detail=()=>{
  const ent=st.sel&&L.byId[st.sel];
  if(!ent)return '<span class="ps-label">Knowledge graph</span><h3>'+L.nodes.length+' entities · '+L.links.length+' relations</h3><p class="micro">Built from the draft articles, retrieved legal sources and the synthetic stakeholders'+(graph.extraction==='rules+llm'?', enriched by the AI model with institutions, groups and instruments it found in the text':'')+'. Click a node to see how it connects.</p>'+(graph.notes||[]).map(n=>'<p class="micro">'+E(n)+'</p>').join('')+'<h4>Most connected</h4><div class="kg-rel-list">'+L.nodes.slice().sort((a,b)=>b.degree-a.degree).slice(0,6).map(n=>'<button type="button" data-kg-goto="'+E(n.id)+'"><i style="background:'+typeInfo(n.type)[1]+'"></i><span>'+E(n.label)+'</span><small>'+n.degree+'</small></button>').join('')+'</div>';
  const [typeName,color]=typeInfo(ent.type),rels=L.links.filter(l=>l.source===ent.id||l.target===ent.id),stance=STANCE[stances[ent.id]];
  const act=ent.type==='stakeholder'&&actions.includes('persona')?'<button type="button" class="btn" data-kg-act="persona">Show persona opinions</button>':ent.type==='article'&&actions.includes('article')?'<button type="button" class="btn" data-kg-act="article">Open '+E(ent.label.replace('Article','Pasal'))+' in Draft</button>':'';
  return '<span class="kg-chip" style="--kg-c:'+color+'"><i></i>'+E(typeName)+'</span><h3>'+E(ent.label)+'</h3>'+(ent.description?'<p>'+E(ent.description)+'</p>':'')+(stance?'<p class="kg-stance-line"><i style="background:'+stance[1]+'"></i>Latest stance: <b>'+stance[0]+'</b></p>':'')+act+
   '<h4>Relations ('+rels.length+')</h4><div class="kg-rel-list">'+rels.map(l=>{const other=L.byId[l.source===ent.id?l.target:l.source],out=l.source===ent.id;return '<button type="button" data-kg-goto="'+E(other.id)+'"><i style="background:'+typeInfo(other.type)[1]+'"></i><span><em>'+(out?'':'← ')+E(relLabel(l.type))+(out?' →':'')+'</em> '+E(other.label)+(l.description?'<small>'+E(l.description)+'</small>':'')+'</span></button>';}).join('')+'</div><button type="button" class="text-button" data-kg-clear>Clear selection</button>';
 };
 // Zoom and pan keep their transform between repaints of the surrounding page.
 let zoom=null;
 const fit=()=>{const vis=L.nodes.filter(n=>!st.hidden.includes(n.type));if(!vis.length||!zoom)return;const xs=vis.map(n=>n.x),ys=vis.map(n=>n.y),pad=compact?28:60;const x0=Math.min(...xs)-pad,x1=Math.max(...xs)+pad+(compact?40:90),y0=Math.min(...ys)-pad,y1=Math.max(...ys)+pad;const k=Math.min(3,W/(x1-x0),H/(y1-y0));const t=d3.zoomIdentity.translate(W/2-k*(x0+x1)/2,H/2-k*(y0+y1)/2).scale(k);d3.select(svgEl).call(zoom.transform,t);};
 if(d3?.zoom){
  zoom=d3.zoom().extent([[0,0],[W,H]]).scaleExtent([.25,4]).on('zoom',event=>{zoomG.setAttribute('transform',event.transform.toString());st.transform=event.transform;});
  const sel=d3.select(svgEl).call(zoom).on('dblclick.zoom',null);
  if(compact)sel.on('wheel.zoom',null);
  if(st.transform&&!st.fit)sel.call(zoom.transform,st.transform);else{st.fit=false;fit();}
  if(!compact&&d3.drag){
   const moveNode=(n,g)=>{g.setAttribute('transform','translate('+n.x+' '+n.y+')');el.querySelectorAll('.kg-link').forEach(l=>{if(l.dataset.s!==n.id&&l.dataset.t!==n.id)return;const a=L.byId[l.dataset.s],b=L.byId[l.dataset.t],line=l.firstChild,txt=l.lastChild;line.setAttribute('x1',a.x);line.setAttribute('y1',a.y);line.setAttribute('x2',b.x);line.setAttribute('y2',b.y);txt.setAttribute('x',(a.x+b.x)/2);txt.setAttribute('y',(a.y+b.y)/2);});};
   d3.selectAll(el.querySelectorAll('.kg-node')).call(d3.drag().on('drag',function(event){const n=L.byId[this.dataset.kgId];n.x=event.x;n.y=event.y;moveNode(n,this);}));
  }
 }
 const select=id=>{st.sel=st.sel===id&&!compact?null:id;apply();};
 el.onclick=e=>{
  const n=e.target.closest('.kg-node');
  if(n){if(compact){onAction?.('open',L.byId[n.dataset.kgId]);return;}select(n.dataset.kgId);return;}
  const go=e.target.closest('[data-kg-goto]');if(go){st.sel=go.dataset.kgGoto;apply();[...el.querySelectorAll('.kg-node')].find(x=>x.dataset.kgId===st.sel)?.focus({preventScroll:true});return;}
  if(e.target.closest('[data-kg-clear]')){st.sel=null;apply();return;}
  const t=e.target.closest('[data-kg-type]');if(t){const type=t.dataset.kgType;st.hidden=st.hidden.includes(type)?st.hidden.filter(x=>x!==type):[...st.hidden,type];t.setAttribute('aria-pressed',String(!st.hidden.includes(type)));apply();return;}
  if(e.target.closest('[data-kg-fit]')){fit();return;}
  if(e.target.closest('[data-kg-full]')){const box=el.querySelector('.kg');if(document.fullscreenElement)document.exitFullscreen?.();else box.requestFullscreen?.().catch(()=>box.classList.toggle('kg-expanded'));return;}
  const a=e.target.closest('[data-kg-act]');if(a&&st.sel)onAction?.(a.dataset.kgAct,L.byId[st.sel]);
 };
 el.onkeydown=e=>{const n=e.target.closest?.('.kg-node');if(n&&['Enter',' '].includes(e.key)){e.preventDefault();n.click();}if(e.target.matches?.('.kg-search')&&e.key==='Enter'){const q=st.query.trim().toLocaleLowerCase(),hit=q&&L.nodes.find(x=>x.label.toLocaleLowerCase().includes(q));if(hit){st.sel=hit.id;apply();}}};
 el.oninput=e=>{if(e.target.matches('.kg-search')){st.query=e.target.value;apply();}};
 el.onchange=e=>{if(e.target.matches('[data-kg-labels]')){st.labels=e.target.checked;root.classList.toggle('kg-show-labels',st.labels);}};
 el.onmouseover=e=>{const n=e.target.closest('.kg-node');if(!n||st.sel)return;const s=neighbors(n.dataset.kgId);el.querySelectorAll('.kg-node').forEach(x=>x.classList.toggle('kg-hover-dim',!s.has(x.dataset.kgId)));el.querySelectorAll('.kg-link').forEach(l=>l.classList.toggle('kg-hover-hot',l.dataset.s===n.dataset.kgId||l.dataset.t===n.dataset.kgId));};
 el.onmouseout=e=>{if(!e.target.closest('.kg-node'))return;el.querySelectorAll('.kg-hover-dim,.kg-hover-hot').forEach(x=>x.classList.remove('kg-hover-dim','kg-hover-hot'));};
 apply();
}
