// Data dashboard: what the collection holds, how fresh it is and where the gaps are — see docs/DATA_DASHBOARD_REVAMP_STRATEGY.md.
import {REGULATION_NAMES} from '/static/draft-builder.js';
import {icon} from '/static/design.js';
import {escape,fmt,NATIONAL_TYPES,visualIcon,geometry,drawProvinceMap,statCard,statusLabels} from '/static/collection-ui.js';

const TABS=[['overview','Overview','layout'],['explore','Explore documents','search'],['quality','Data quality','verified'],['queue','Source queue','database']];
const TOPICS={akses_layanan:'Service access',pembentukan_regulasi:'Regulation making',biaya:'Cost',data_pribadi:'Personal data',disabilitas:'Disability',pengaduan:'Complaints',anggaran:'Budget',aksesibilitas:'Accessibility',informasi:'Information',partisipasi:'Participation'};
const topicName=key=>TOPICS[key]||key.replaceAll('_',' ').replace(/^./,c=>c.toUpperCase());
const MODES={issuer:['Issuing region','Where a document comes from. National documents are counted separately, not split across provinces.'],scope:['Regulated coverage','Which regions a document applies to, from recorded metadata. One document can cover several regions.'],mentions:['Mentioned region','Regions named in the text. A mentioned place is not necessarily where the rule applies.']};
const STATUS={text:'Text available',ocr:'Needs OCR',verified:'Human-reviewed',unverified:'Not reviewed yet',amendment:'Amendments',checksum:'Checksum issue'};
const SORTS=[['retrieved','Recently retrieved'],['year','Newest year'],['articles','Most articles'],['title','Title A–Z']];
const DEFAULTS={tab:'overview',kind:'',mode:'issuer',start:'',end:'',province:'',district:'',layer:'corpus',q:'',sort:'retrieved',status:'',topic:'',host:'',day:'',page:'1'};
export const DATA_FILTER_KEYS=Object.keys(DEFAULTS);
const typeName=t=>REGULATION_NAMES[t]||t;
const dateLabel=iso=>iso?new Date(iso).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'—';

function clean(input){
 const f={...DEFAULTS};
 for(const key of DATA_FILTER_KEYS)if(input?.[key]!==undefined&&input[key]!==null&&input[key]!=='')f[key]=String(input[key]);
 if(!TABS.some(([id])=>id===f.tab))f.tab='overview';
 if(!Object.hasOwn(REGULATION_NAMES,f.kind))f.kind='';
 if(!MODES[f.mode])f.mode='issuer';
 for(const name of ['start','end']){const year=Number(f[name]);f[name]=Number.isInteger(year)&&year>=1945&&year<=2100?String(year):'';}
 if(f.start&&f.end&&Number(f.start)>Number(f.end)){f.start='';f.end='';}
 if(!['corpus','intake'].includes(f.layer))f.layer='corpus';
 if(!SORTS.some(([id])=>id===f.sort))f.sort='retrieved';
 if(f.status&&!STATUS[f.status])f.status='';
 if(!/^(|national|unmapped|\d{2})$/.test(f.province))f.province='';
 if(!/^(|\d{4}-\d{2}-\d{2})$/.test(f.day))f.day='';
 f.page=String(Math.max(1,Number.parseInt(f.page)||1));
 return f;
}

export function mountDataDashboard(root,{request,initialFilters={},onFiltersChange=()=>{},onDocument=()=>{},onIntake=()=>{},onLoaded=()=>{}}={}){
 if(!root)return()=>{};
 let alive=true,data=null,geo=null,docs=null,regionDocs=null,seq=0,docSeq=0,regionSeq=0,zoom=1,observer,animated=false,searchTimer;
 const f=clean(initialFilters);
 root.innerHTML=`<div class="collection-loading" role="status">${visualIcon('globe','blue',26)}<span>Preparing the collection and the Indonesia map…</span></div>`;
 const notify=()=>onFiltersChange(Object.fromEntries(Object.entries(f).filter(([key,value])=>value!==DEFAULTS[key])));
 const provinceName=id=>id==='national'?'National':id==='unmapped'?'Unmapped':data?.provinces.find(p=>p.id===id)?.name||id;
 const query=keys=>{const q=new URLSearchParams();for(const key of keys)if(f[key]&&f[key]!==DEFAULTS[key])q.set(key,f[key]);return q;};

 // ---------- shell ----------
 function shell(){
  root.innerHTML=`<header class="dd-head"><div class="dd-title"><h1>Data dashboard</h1><p class="dd-fresh" data-dd-fresh></p></div><div class="dd-actions"><button type="button" class="btn" data-action="collection-refresh">${icon('refresh')}Refresh</button><div class="dd-add"><button type="button" class="btn primary" data-dd-add aria-haspopup="menu" aria-expanded="false">${icon('upload')}Add source${icon('down',14)}</button><div class="dd-menu" role="menu" aria-label="Add a source" hidden><button type="button" role="menuitem" data-action="collection-upload">${icon('upload')}<span><b>Upload a file</b><small>PDF, DOCX, TXT or JSON for review</small></span></button><button type="button" role="menuitem" data-action="collection-jdih">${icon('link')}<span><b>Add a JDIH link</b><small>Record a government source URL</small></span></button></div></div></div></header>`+
   `<div class="dd-tabs" role="tablist" aria-label="Data dashboard sections">${TABS.map(([id,title,glyph])=>`<button type="button" role="tab" id="dd-tab-${id}" data-dd-tab="${id}" aria-controls="dd-panel">${icon(glyph,16)}<span>${title}</span><b data-dd-tab-count="${id}"></b></button>`).join('')}</div>`+
   `<section id="dd-panel" class="dd-panel" role="tabpanel"></section><div class="collection-error" role="alert" hidden></div>`;
 }
 function paintChrome(){
  const s=data.summary,latest=data.retrieval_days.at(-1);
  root.querySelector('[data-dd-fresh]').innerHTML=`Updated <b>${dateLabel(data.latest_retrieval)}</b>${latest?` · ${fmt(latest.count)} documents retrieved that day`:''} · ${data.sources.length===1?'1 source site':fmt(data.sources.length)+' source sites'} · ${fmt(s.documents)} documents`;
  root.dataset.tab=f.tab;
  root.querySelectorAll('[data-dd-tab]').forEach(tab=>{const on=tab.dataset.ddTab===f.tab;tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;});
  root.querySelector('#dd-panel').setAttribute('aria-labelledby','dd-tab-'+f.tab);
  root.querySelector('[data-dd-tab-count="queue"]').textContent=data.intake.length?fmt(data.intake.length):'';
 }

 // ---------- shared filters ----------
 function filtersHTML(){
  return `<div class="dd-filters"><label for="data-collection-mode">Distribution meaning<select id="data-collection-mode" data-dd-filter="mode">${Object.entries(MODES).map(([id,[name]])=>`<option value="${id}" ${f.mode===id?'selected':''}>${name}</option>`).join('')}</select></label><label for="data-collection-kind">Regulation type<select id="data-collection-kind" data-dd-filter="kind"><option value="">All types</option>${Object.entries(REGULATION_NAMES).map(([id,name])=>`<option value="${id}" ${f.kind===id?'selected':''}>${escape(name)}</option>`).join('')}</select></label><label for="data-collection-start">From year<input id="data-collection-start" data-dd-filter="start" type="number" min="1945" max="2100" placeholder="Any" value="${escape(f.start)}"></label><label for="data-collection-end">To year<input id="data-collection-end" data-dd-filter="end" type="number" min="1945" max="2100" placeholder="Any" value="${escape(f.end)}"></label>${f.tab==='overview'?`<label for="data-collection-layer">Map shows<select id="data-collection-layer" data-dd-filter="layer"><option value="corpus" ${f.layer==='corpus'?'selected':''}>Collection</option><option value="intake" ${f.layer==='intake'?'selected':''}>Source queue</option></select></label>`:''}</div>`;
 }

 // ---------- overview ----------
 function mapRows(){
  if(f.layer==='corpus')return data.provinces;
  const start=Number(f.start)||null,end=Number(f.end)||null;
  return data.provinces.map(p=>{
   const items=data.intake.filter(i=>(!f.kind||i.regulation_type===f.kind)&&(!start||i.year>=start)&&(!end||i.year<=end)&&i.province_id===p.id&&(f.mode==='issuer'&&!NATIONAL_TYPES.includes(i.regulation_type)||f.mode==='scope'&&['province','district'].includes(i.scope)));
   const districts={};for(const item of items)if(item.district)districts[item.district]=(districts[item.district]||0)+1;
   return {...p,count:items.length,districts};
  });
 }
 function kpis(){
  const s=data.summary,share=s.documents?Math.round(100*s.national/s.documents):0;
  return `<div class="dd-kpis collection-stats" aria-label="Collection summary">${[
   statCard({value:s.unique_regulations,title:'Regulations',caption:fmt(s.documents)+' documents incl. versions',glyph:'scale',tone:'crimson'}),
   statCard({value:s.articles,title:'Articles / blocks',caption:'Extracted for search and analysis',glyph:'tree',tone:'violet'}),
   statCard({value:[s.mapped_provinces,s.province_total],title:'Provinces',caption:'With documents · '+MODES[f.mode][0].toLowerCase(),glyph:'map',tone:'green'}),
   statCard({value:s.national,title:'National',caption:f.mode==='mentions'?'Not used for mentioned regions':share+'% of documents · not split by province',glyph:'landmark',tone:'blue'}),
   statCard({value:s.needs_ocr,title:'Needs OCR',caption:'Of '+fmt(s.documents)+' · scanned pages without text',glyph:'scan',tone:'amber'})].join('')}</div>`;
 }
 function rankHTML(){
  const rows=mapRows(),s=data.summary,select=`<label for="data-collection-province" class="dd-region-select">Region<select id="data-collection-province" data-dd-province><option value="">All regions</option><option value="national" ${f.province==='national'?'selected':''}>National</option><option value="unmapped" ${f.province==='unmapped'?'selected':''}>Unmapped</option>${geo.features.slice().sort((a,b)=>a.properties.name.localeCompare(b.properties.name)).map(x=>`<option value="${x.properties.id}" ${f.province===x.properties.id?'selected':''}>${escape(x.properties.name)}</option>`).join('')}</select></label>`;
  if(!f.province){
   const ranked=rows.filter(p=>p.count).sort((a,b)=>b.count-a.count),gaps=rows.filter(p=>!p.count).sort((a,b)=>a.name.localeCompare(b.name)),max=Math.max(1,f.layer==='corpus'?s.national:0,...ranked.map(p=>p.count));
   const national=f.layer==='corpus'&&f.mode!=='mentions'?`<button type="button" class="dd-rank-national" data-dd-region="national"><span><b>National</b><small>${s.documents?Math.round(100*s.national/s.documents):0}% of documents · not split by province</small></span><strong>${fmt(s.national)}</strong><i style="--w:${100*s.national/max}%"></i></button>`:'';
   return `<div class="dd-rank" data-region-content>${select}${national}<h4>${f.layer==='corpus'?'Provinces':'Provinces in the source queue'}</h4>${ranked.length?`<ol class="dd-rank-list">${ranked.slice(0,10).map(p=>`<li><button type="button" data-province="${p.id}"><span>${escape(p.name)}</span><strong>${fmt(p.count)}</strong><i style="--w:${100*p.count/max}%"></i></button></li>`).join('')}</ol>${ranked.length>10?`<p class="micro">+ ${ranked.length-10} more provinces with documents on the map.</p>`:''}`:'<p class="micro">No province has documents for this filter yet.</p>'}${gaps.length?`<details class="dd-gaps"><summary>${gaps.length} provinces without ${f.layer==='corpus'?'documents':'queued sources'}</summary><p>${gaps.map(p=>`<button type="button" class="text-button" data-province="${p.id}">${escape(p.name)}</button>`).join(', ')}</p></details>`:''}${s.unknown_region&&f.layer==='corpus'?`<button type="button" class="text-button dd-unmapped" data-dd-region="unmapped">${fmt(s.unknown_region)} documents without region metadata</button>`:''}</div>`;
  }
  const region=rows.find(p=>p.id===f.province),count=f.province==='national'?s.national:f.province==='unmapped'?s.unknown_region:region?.count||0;
  const districts=region?Object.entries(region.districts).sort((a,b)=>b[1]-a[1]):[];
  const list=f.layer==='intake'?'<p class="micro">Queued sources are listed in the Source queue tab.</p>':regionListHTML(count);
  return `<div class="dd-rank" data-region-content>${select}<button type="button" class="text-button dd-back" data-dd-region="">${icon('back',14)}All regions</button><h3>${escape(provinceName(f.province))}${f.district?' · '+escape(f.district):''}</h3><div class="collection-region-number"><b>${fmt(f.district?region?.districts[f.district]||0:count)}</b> <span>${f.layer==='corpus'?'documents':'queued sources'}</span></div>${districts.length?`<h4>Regency / city</h4><div class="collection-districts">${districts.map(([name,n])=>`<button type="button" data-district="${escape(name)}" aria-pressed="${f.district===name}">${escape(name)} <span>${n}</span></button>`).join('')}</div>`:''}${f.layer==='corpus'?'<h4>Latest documents</h4>':''}<div data-dd-region-docs>${list}</div></div>`;
 }
 // Only this part changes when the region's documents arrive, so an open region dropdown is never replaced.
 function regionListHTML(count){
  const list=regionDocs===null?'<p class="micro">Loading documents…</p>':regionDocs.items.length?`<div class="dd-mini-list">${regionDocs.items.map(rowHTML).join('')}</div>`:'<p class="micro">No documents for this region and filter yet.</p>';
  const total=regionDocs?.total??count;
  return list+(total?`<button type="button" class="btn dd-see-all" data-dd-explore>${icon('search',15)}See all ${fmt(total)} in Explore</button>`:'');
 }
 function chartsHTML(){
  const years=Object.entries(data.years).map(([y,n])=>[Number(y),n]),start=Number(f.start)||null,end=Number(f.end)||null;
  const first=years[0]?.[0],last=years.at(-1)?.[0],max=Math.max(1,...years.map(([,n])=>n)),span=first?Array.from({length:last-first+1},(_,i)=>first+i):[];
  const typeRows=group=>Object.entries(data.types).filter(([t,n])=>n&&(group==='national')===NATIONAL_TYPES.includes(t)).sort((a,b)=>b[1]-a[1]);
  const typeMax=Math.max(1,...Object.values(data.types));
  const typeList=(title,rows)=>rows.length?`<h4>${title}</h4>${rows.map(([t,n])=>`<button type="button" class="dd-type" data-kind="${escape(t)}" aria-pressed="${f.kind===t}"><span>${escape(typeName(t))}</span><i style="--w:${100*n/typeMax}%"></i><b>${fmt(n)}</b></button>`).join('')}`:'';
  const topics=Object.entries(data.topics).sort((a,b)=>b[1]-a[1]);
  return `<div class="dd-charts"><section class="dd-card dd-years"><div class="dd-card-head"><h3>${icon('calendar',17)}Year of enactment</h3>${start||end?'<button type="button" class="text-button" data-dd-clear="years">All years</button>':''}</div><div class="dd-bars" role="group" aria-label="Documents per year">${span.map(y=>{const n=data.years[String(y)]||0,on=(!start||y>=start)&&(!end||y<=end);return `<button type="button" data-dd-year="${y}" class="${on?'':'off'}" style="--h:${n?Math.max(4,100*n/max):0}%" aria-label="${y}: ${n} documents" title="${y} · ${n} documents"><i></i></button>`;}).join('')}</div><div class="dd-bars-axis"><span>${first||''}</span><span>${last||''}</span></div><p class="micro">${fmt(years.filter(([y])=>y>=(last||0)-3).reduce((n,[,c])=>n+c,0))} of ${fmt(years.reduce((n,[,c])=>n+c,0))} documents were enacted in ${(last||0)-3}–${last||''}. Click a year to filter.</p></section>`+
   `<section class="dd-card dd-types"><div class="dd-card-head"><h3>${icon('scale',17)}Regulation type</h3>${f.kind?'<button type="button" class="text-button" data-dd-clear="kind">All types</button>':''}</div>${typeList('National',typeRows('national'))}${typeList('Regional & village',typeRows('regional'))}</section>`+
   `<section class="dd-card dd-topics"><div class="dd-card-head"><h3>${icon('tag',17)}Identified topics</h3><span class="micro">May overlap</span></div><div class="dd-topic-list">${topics.map(([key,n])=>`<button type="button" data-dd-topic="${escape(key)}"><span>${escape(topicName(key))}</span><b>${fmt(n)}</b></button>`).join('')||'<p class="micro">No topics identified for this filter yet.</p>'}</div><p class="micro">Click a topic to list its documents.</p></section></div>`;
 }
 function overviewHTML(){
  return kpis()+`<section class="dd-map-section collection-map-panel">${filtersHTML()}<p class="dd-mode-hint">${icon('attention',14)}${escape(MODES[f.mode][1])}</p><div class="dd-map-grid"><div class="dd-map-card"><div class="dd-map-top"><h3>${f.layer==='corpus'?'Collection by province':'Source queue by province'}</h3><div class="collection-map-tools"><button type="button" data-map-zoom="in" aria-label="Zoom in map">${icon('zoomIn',17)}</button><button type="button" data-map-zoom="out" aria-label="Zoom out map">${icon('zoomOut',17)}</button><button type="button" data-map-zoom="reset">${icon('refresh',14)}<span>Reset</span></button></div></div><div class="collection-map-canvas"><svg class="collection-map" aria-label="Map of ${f.layer==='corpus'?'documents':'queued sources'} by province"></svg><div class="collection-map-tooltip" hidden></div></div><div class="collection-map-legend"><span><i class="legend-empty"></i>None</span><span><i class="legend-filled"></i>More documents</span><small data-map-summary></small></div><div class="collection-geography-note">${icon('globe',12)}Geometry: <a href="https://geoservices.big.go.id/gis/rest/services/STIG/Batas_Provinsi/MapServer/0" target="_blank" rel="noopener">BIG</a> · 38 provinces · Snapshot 13 Oct 2026</div></div>${rankHTML()}</div></section>`+chartsHTML();
 }
 function drawMap(){
  const svg=root.querySelector('.collection-map'),canvas=root.querySelector('.collection-map-canvas');if(!svg||!canvas||!geo)return;
  const rows=mapRows();
  drawProvinceMap({svg,canvas,geo,rows,selected:f.province,zoom,ratio:window.innerWidth<=760?.62:.5,maxHeight:470,minHeight:window.innerWidth<=760?220:260,label:f.layer==='corpus'?'documents':'queued sources',onSelect:selectProvince});
  root.querySelector('[data-map-summary]').textContent=rows.filter(p=>p.count>0).length+' / '+rows.length+' provinces have '+(f.layer==='corpus'?'documents':'queued sources');
 }

 // ---------- explore ----------
 function regionText(d){return d.issuer_level==='national'?'National':d.issuer_level==='province'?provinceName(d.province_id)+(d.district?' · '+d.district:''):'Unmapped';}
 function rowHTML(d){return `<button type="button" class="dd-row" data-document="${escape(d.id)}"><span class="dd-row-type">${visualIcon(NATIONAL_TYPES.includes(d.regulation_type)?(['UU','PERPPU'].includes(d.regulation_type)?'scale':'landmark'):'pin',NATIONAL_TYPES.includes(d.regulation_type)?'crimson':'blue',17)}</span><span class="dd-row-main"><small>${escape(typeName(d.regulation_type))} ${escape(d.number)}/${d.year}${d.version_kind!=='original'?' · amendment':''}</small><b>${escape(d.title)}</b></span><span class="dd-row-meta"><span>${escape(regionText(d))}</span><span>${fmt(d.articles)} articles</span><span class="dd-row-status ${d.needs_ocr?'warn':''}">${d.needs_ocr?'Needs OCR':d.human_verified?'Reviewed':'Text available'}</span><span>${dateLabel(d.retrieved_at)}</span></span>${icon('arrow',16)}</button>`;}
 function chips(){
  const items=[];
  if(f.kind)items.push(['kind',typeName(f.kind)]);
  if(f.start||f.end)items.push(['years',f.start&&f.end&&f.start===f.end?f.start:(f.start||'…')+'–'+(f.end||'…')]);
  if(f.province)items.push(['province',provinceName(f.province)+(f.mode!=='issuer'?' ('+MODES[f.mode][0].toLowerCase()+')':'')]);
  if(f.district)items.push(['district',f.district]);
  if(f.topic)items.push(['topic','Topic: '+topicName(f.topic)]);
  if(f.status)items.push(['status',STATUS[f.status]]);
  if(f.host)items.push(['host','Source: '+f.host]);
  if(f.day)items.push(['day','Retrieved '+dateLabel(f.day)]);
  return items.length?`<div class="dd-chips">${items.map(([key,text])=>`<button type="button" data-dd-clear="${key}" aria-label="Remove filter ${escape(text)}">${escape(text)}${icon('close',13)}</button>`).join('')}<button type="button" class="text-button" data-dd-clear="all">Clear all</button></div>`:'';
 }
 function exploreResults(){
  if(!docs)return '<p class="micro dd-count">Loading documents…</p>';
  const page=docs.page,pages=docs.pages;
  return `<p class="dd-count" role="status">${fmt(docs.total)} documents${docs.total?` · page ${page} of ${pages}`:''}</p>${docs.items.length?`<div class="dd-table">${docs.items.map(rowHTML).join('')}</div>`:`<div class="collection-empty">${visualIcon('fileSearch','blue',28)}<div><h4>No documents match.</h4><p>Remove a filter or search for a shorter phrase.</p></div></div>`}${pages>1?`<nav class="dd-pager" aria-label="Pages"><button type="button" class="btn" data-dd-page="${page-1}" ${page<=1?'disabled':''}>${icon('back',15)}Previous</button><span>Page ${page} of ${pages}</span><button type="button" class="btn" data-dd-page="${page+1}" ${page>=pages?'disabled':''}>Next${icon('arrow',15)}</button></nav>`:''}`;
 }
 function exploreHTML(){
  return filtersHTML()+`<div class="dd-explore-bar"><label class="dd-search" for="dd-q">${icon('search',16)}<input id="dd-q" type="search" data-dd-q placeholder="Search title, number, year or regency…" value="${escape(f.q)}" aria-label="Search documents"></label><label for="dd-sort">Sort<select id="dd-sort" data-dd-filter="sort">${SORTS.map(([id,name])=>`<option value="${id}" ${f.sort===id?'selected':''}>${name}</option>`).join('')}</select></label><label for="dd-status">Status<select id="dd-status" data-dd-filter="status"><option value="">Any status</option>${Object.entries(STATUS).map(([id,name])=>`<option value="${id}" ${f.status===id?'selected':''}>${name}</option>`).join('')}</select></label></div>${chips()}<div class="dd-results" data-dd-results>${exploreResults()}</div>`;
 }

 // ---------- quality ----------
 function qualityHTML(){
  const s=data.summary,total=Math.max(1,s.documents);
  const card=(status,title,value,caption,tone,region='')=>`<button type="button" class="dd-quality-card dd-tone-${tone}" ${region?`data-dd-region-explore="${region}"`:`data-dd-status="${status}"`}><span>${escape(title)}</span><strong>${fmt(value)}<small> / ${fmt(s.documents)}</small></strong><i style="--w:${100*value/total}%"></i><small>${escape(caption)}</small></button>`;
  const maxDay=Math.max(1,...data.retrieval_days.map(d=>d.count)),maxHost=Math.max(1,...data.sources.map(x=>x.count));
  return `<div class="dd-quality-grid">${card('text','Text available',s.text_available,'Searchable and usable by checks','green')}${card('ocr','Needs OCR',s.needs_ocr,'Scanned pages without extractable text','amber')}${card('verified','Human-reviewed',s.human_verified,'A reviewer confirmed the extraction','blue')}${card('amendment','Amendments',s.amendments,'Versions that change an earlier regulation','violet')}${card('checksum','Checksum issues',s.checksum_issues,'Stored file differs from its recorded fingerprint','crimson')}${card('','Without region',s.unknown_region,'No issuing region in the metadata','slate','unmapped')}</div>`+
   `<div class="dd-charts dd-charts-two"><section class="dd-card"><div class="dd-card-head"><h3>${icon('clock',17)}Retrieval by day</h3><span class="micro">When documents entered the collection</span></div><div class="dd-day-list">${data.retrieval_days.slice(-14).map(d=>`<button type="button" data-dd-day="${d.date}"><span>${dateLabel(d.date)}</span><i style="--w:${100*d.count/maxDay}%"></i><b>${fmt(d.count)}</b></button>`).join('')||'<p class="micro">No retrieval dates recorded.</p>'}</div></section>`+
   `<section class="dd-card"><div class="dd-card-head"><h3>${icon('link',17)}Source sites</h3><span class="micro">Where the official texts come from</span></div><div class="dd-day-list">${data.sources.map(x=>`<button type="button" data-dd-host="${escape(x.host)}"><span>${escape(x.host)}</span><i style="--w:${100*x.count/maxHost}%"></i><b>${fmt(x.count)}</b></button>`).join('')}</div><p class="micro">Every document keeps its source URL, retrieval time and SHA256 fingerprint; open one in the Legal library to see them.</p></section></div>`;
 }

 // ---------- queue ----------
 function queueHTML(){
  const intake=data.intake;
  return `<section class="collection-intake dd-queue"><div class="collection-intake-actions"><button type="button" class="collection-source-card" data-action="collection-upload" aria-label="Upload source">${visualIcon('upload','crimson',24)}<span><b>Upload source</b><small>PDF, DOCX, TXT, or JSON</small></span>${icon('arrow',17)}</button><button type="button" class="collection-source-card" data-action="collection-jdih" aria-label="Add JDIH link">${visualIcon('link','blue',24)}<span><b>Add JDIH link</b><small>Record a government source URL</small></span>${icon('arrow',17)}</button></div><div class="collection-source-flow" aria-label="Sources received, recorded and awaiting review"><span>${icon('files',14)}Incoming sources</span>${icon('chevron',12)}<span>${icon('database',14)}Recorded</span>${icon('chevron',12)}<span>${icon('fileSearch',14)}Needs review</span></div><div class="collection-intake-status">${[['upload','Uploads',intake.filter(i=>i.channel==='upload').length],['link','JDIH links',intake.filter(i=>i.channel==='jdih').length],['scan','Needs OCR',intake.filter(i=>i.status==='needs_ocr').length]].map(([glyph,title,n])=>`<div><span class="collection-intake-stat-label">${icon(glyph,16)}${title}</span><strong>${n}</strong></div>`).join('')}</div><div class="collection-intake-list">${intake.length?intake.slice(0,50).map(i=>`<button type="button" class="collection-intake-row" data-intake="${i.id}">${visualIcon(i.channel==='upload'?'file':'link',i.channel==='upload'?'crimson':'blue',19)}<div><b>${escape(i.title)}</b><small>${escape(typeName(i.regulation_type))} ${escape(i.number)}/${i.year} · ${i.channel==='upload'?'Upload':'JDIH'}${i.province_id?' · '+escape(provinceName(i.province_id)):''}</small></div><span class="tag">${escape(statusLabels[i.status]||i.status)}</span></button>`).join(''):`<div class="collection-intake-empty">${visualIcon('database','blue',25)}<p>No sources in the queue yet. Upload a document or register a JDIH link to start collecting data.</p></div>`}</div><p class="collection-intake-note">Uploads and links are recorded for review. The queue is not yet part of the analysis corpus; JDIH links are not fetched automatically.</p></section>`;
 }

 // ---------- render & load ----------
 function render(){
  if(!alive||!root.isConnected||!data)return;
  paintChrome();
  const panel=root.querySelector('#dd-panel');
  panel.innerHTML=f.tab==='overview'?overviewHTML():f.tab==='explore'?exploreHTML():f.tab==='quality'?qualityHTML():queueHTML();
  if(f.tab==='overview'){drawMap();countUp();}
  onLoaded(data);notify();
 }
 function countUp(){
  if(animated)return;animated=true;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  root.querySelectorAll('.dd-kpis strong[data-value]').forEach(el=>{
   const [a,b]=el.dataset.value.split('/').map(Number),t0=performance.now();
   const step=now=>{if(!alive||!el.isConnected)return;const k=Math.min(1,(now-t0)/450),e=1-Math.pow(1-k,3);el.textContent=b===undefined?fmt(Math.round(a*e)):fmt(Math.round(a*e))+' / '+fmt(b);if(k<1)requestAnimationFrame(step);};
   requestAnimationFrame(step);
  });
 }
 async function load(initial=false){
  const ticket=++seq;root.setAttribute('aria-busy','true');
  try{
   const [payload,geography]=await Promise.all([request('/data/overview?'+query(['kind','start','end','mode'])),geometry()]);
   if(!alive||ticket!==seq||!root.isConnected)return;
   data=payload;geo=geography;
   if(f.province&&!['national','unmapped'].includes(f.province)&&!geo.features.some(x=>x.properties.id===f.province))f.province='';
   if(initial)shell();
   root.querySelector('.collection-error').hidden=true;
   render();
   if(f.tab==='explore')loadDocs();else if(f.tab==='overview'&&f.province)loadRegion();
   if(!observer){observer=new ResizeObserver(()=>{if(f.tab==='overview')drawMap();});observer.observe(root);}
  }catch(error){
   if(!alive||ticket!==seq||!root.isConnected)return;
   if(initial||!data){root.innerHTML='<div class="collection-load-error" role="alert"><h3>Collection data could not be loaded.</h3><p></p><button type="button" class="btn" data-collection-retry>Try again</button></div>';root.querySelector('.collection-load-error p').textContent=error.message;}
   else{const target=root.querySelector('.collection-error');target.textContent=error.message;target.hidden=false;}
  }finally{if(alive&&ticket===seq)root.setAttribute('aria-busy','false');}
 }
 const docQuery=()=>query(['q','kind','start','end','mode','province','district','status','topic','host','day','sort','page']);
 async function loadDocs(){
  const ticket=++docSeq;docs=null;const results=root.querySelector('[data-dd-results]');if(results)results.innerHTML=exploreResults();
  try{const page=await request('/data/documents?'+docQuery());if(!alive||ticket!==docSeq)return;docs=page;f.page=String(page.page);}
  catch(error){if(!alive||ticket!==docSeq)return;docs={total:0,page:1,pages:1,items:[]};const target=root.querySelector('.collection-error');target.textContent=error.message;target.hidden=false;}
  const target=root.querySelector('[data-dd-results]');if(target)target.innerHTML=exploreResults();notify();
 }
 async function loadRegion(){
  const ticket=++regionSeq;regionDocs=null;
  if(f.layer!=='corpus'||!f.province)return;
  try{const q=query(['kind','start','end','mode','province','district']);q.set('size','5');const page=await request('/data/documents?'+q);if(!alive||ticket!==regionSeq)return;regionDocs=page;}
  catch{if(!alive||ticket!==regionSeq)return;regionDocs={total:0,items:[]};}
  const target=root.querySelector('[data-dd-region-docs]');if(target&&f.tab==='overview')target.innerHTML=regionListHTML(regionDocs.total);
 }
 function selectProvince(id){f.province=id;f.district='';f.page='1';regionDocs=null;render();loadRegion();}
 // Drill-downs replace the previous drill-down so the list matches the number that was clicked; type, years and meaning stay.
 function openExplore(changes={},keepRegion=false){Object.assign(f,{topic:'',status:'',host:'',day:'',q:''},keepRegion?{}:{province:'',district:''},changes,{tab:'explore',page:'1'});docs=null;render();loadDocs();root.querySelector('#dd-tab-explore')?.focus({preventScroll:true});}
 function closeMenu(focus=false){const menu=root.querySelector('.dd-menu:not([hidden])');if(!menu)return;menu.hidden=true;const toggle=root.querySelector('[data-dd-add]');toggle.setAttribute('aria-expanded','false');if(focus)toggle.focus();}

 function click(event){
  const add=event.target.closest('[data-dd-add]');
  if(add){const menu=root.querySelector('.dd-menu'),open=menu.hidden;menu.hidden=!open;add.setAttribute('aria-expanded',String(open));if(open)menu.querySelector('[role=menuitem]')?.focus();return;}
  if(!event.target.closest('.dd-menu')||event.target.closest('[role=menuitem]'))closeMenu();
  const el=event.target.closest('[data-dd-tab],[data-province],[data-dd-region],[data-district],[data-map-zoom],[data-kind],[data-dd-year],[data-dd-topic],[data-dd-status],[data-dd-region-explore],[data-dd-host],[data-dd-day],[data-dd-explore],[data-dd-clear],[data-dd-page],[data-document],[data-intake],[data-collection-retry]');
  if(!el||el.disabled)return;
  if(el.hasAttribute('data-collection-retry'))return load(true);
  if(el.dataset.ddTab){if(el.dataset.ddTab===f.tab)return;f.tab=el.dataset.ddTab;render();if(f.tab==='explore')loadDocs();if(f.tab==='overview'&&f.province)loadRegion();root.querySelector('#dd-tab-'+f.tab)?.focus({preventScroll:true});return;}
  if(el.dataset.province)return selectProvince(el.dataset.province);
  if(el.hasAttribute('data-dd-region'))return selectProvince(el.dataset.ddRegion);
  if(el.hasAttribute('data-district')){f.district=f.district===el.dataset.district?'':el.dataset.district;render();return loadRegion();}
  if(el.dataset.mapZoom){zoom=el.dataset.mapZoom==='in'?Math.min(3,zoom+.5):el.dataset.mapZoom==='out'?Math.max(1,zoom-.5):1;return drawMap();}
  if(el.dataset.kind){f.kind=f.kind===el.dataset.kind?'':el.dataset.kind;f.page='1';return load();}
  if(el.dataset.ddYear){const y=el.dataset.ddYear;if(f.start===y&&f.end===y){f.start='';f.end='';}else{f.start=y;f.end=y;}f.page='1';return load();}
  if(el.dataset.ddTopic)return openExplore({topic:el.dataset.ddTopic});
  if(el.dataset.ddStatus)return openExplore({status:el.dataset.ddStatus});
  if(el.dataset.ddRegionExplore)return openExplore({province:el.dataset.ddRegionExplore,district:''});
  if(el.dataset.ddHost)return openExplore({host:el.dataset.ddHost});
  if(el.dataset.ddDay)return openExplore({day:el.dataset.ddDay});
  if(el.hasAttribute('data-dd-explore'))return openExplore({},true);
  if(el.dataset.ddClear){
   const key=el.dataset.ddClear;
   if(key==='all')Object.assign(f,{kind:'',start:'',end:'',province:'',district:'',topic:'',status:'',host:'',day:'',q:''});
   else if(key==='years'){f.start='';f.end='';}else{f[key]='';if(key==='province')f.district='';}
   f.page='1';return ['kind','years','all'].includes(key)?load():(render(),f.tab==='explore'?loadDocs():null);
  }
  if(el.dataset.ddPage){f.page=el.dataset.ddPage;loadDocs();root.querySelector('.dd-count')?.scrollIntoView({block:'nearest'});return;}
  if(el.dataset.document)return onDocument(el.dataset.document);
  if(el.dataset.intake)return onIntake(el.dataset.intake);
 }
 function change(event){
  const t=event.target;
  if(t.dataset.ddFilter){
   const key=t.dataset.ddFilter;f[key]=t.value;f.page='1';
   if(key==='start'||key==='end'){const c=clean(f);f.start=c.start;f.end=c.end;}
   if(['kind','start','end','mode'].includes(key)){f.district='';regionDocs=null;return load();}
   if(key==='layer'){f.district='';render();return loadRegion();}
   return loadDocs();
  }
  if(t.hasAttribute('data-dd-province'))selectProvince(t.value);
 }
 function input(event){if(!event.target.matches('[data-dd-q]'))return;clearTimeout(searchTimer);searchTimer=setTimeout(()=>{f.q=event.target.value.trim();f.page='1';loadDocs();},300);}
 function keydown(event){
  if(event.key==='Escape'&&root.querySelector('.dd-menu:not([hidden])')){event.preventDefault();closeMenu(true);return;}
  const tab=event.target.closest?.('[data-dd-tab]');
  if(tab&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const tabs=[...root.querySelectorAll('[data-dd-tab]')],i=tabs.indexOf(tab);tabs[event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length].click();}
  const item=event.target.closest?.('.dd-menu [role=menuitem]');
  if(item&&['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();const items=[...root.querySelectorAll('.dd-menu [role=menuitem]')],i=items.indexOf(item);items[(i+(event.key==='ArrowDown'?1:-1)+items.length)%items.length].focus();}
 }
 const outside=event=>{if(!root.contains(event.target))closeMenu();};
 root.addEventListener('click',click);root.addEventListener('change',change);root.addEventListener('input',input);root.addEventListener('keydown',keydown);document.addEventListener('click',outside);
 load(true);
 return()=>{alive=false;clearTimeout(searchTimer);observer?.disconnect();root.removeEventListener('click',click);root.removeEventListener('change',change);root.removeEventListener('input',input);root.removeEventListener('keydown',keydown);document.removeEventListener('click',outside);};
}
