import '/static/vendor/d3.min.js';
import {REGULATION_NAMES} from '/static/draft-builder.js';
import {icon} from '/static/design.js';
import {renderCollectionStats,renderNumberTicker} from '/static/framework/framework.js';


const escape=(value='')=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=value=>new Intl.NumberFormat('id-ID').format(value||0);
const statusLabels={link_pending:'Waiting for retrieval',needs_review:'Needs review',needs_ocr:'Needs OCR'};
const TOPIC_LABELS={akses_layanan:'service access',pembentukan_regulasi:'regulation making',biaya:'cost',data_pribadi:'personal data',disabilitas:'disability',pengaduan:'complaints',anggaran:'budget',aksesibilitas:'accessibility'},topicName=key=>TOPIC_LABELS[key]||key.replaceAll('_',' ');
const topicIcons={akses_layanan:'landmark',disabilitas:'accessibility',partisipasi:'network',pengaduan:'reviewer',informasi:'book',pembentukan_regulasi:'scale',biaya:'coins',data_pribadi:'shield'};
let geographyPromise;

function visualIcon(name,tone='crimson',size=20){return `<span class="collection-visual-icon collection-icon-${tone}" aria-hidden="true">${icon(name,size)}</span>`;}

export function collectionArtwork(){return `<div class="collection-artwork" aria-hidden="true"><div class="collection-art-orbit"></div><div class="collection-art-paper art-paper-back"></div><div class="collection-art-paper art-paper-middle"></div><div class="collection-art-paper art-paper-front">${icon('scale',28)}<i></i><i></i><i></i></div><span class="collection-art-pin">${icon('pin',22)}</span><span class="collection-art-database">${icon('database',18)}</span></div>`;}

function regulationVisual(type){const local=['PERDA_PROV','PERDA_KAB','PERGUB','PERBUP','PERWALI','PERDES','PERKADES','PERDPRD_PROV','PERDPRD_KAB'].includes(type);return visualIcon(local?'pin':['UU','PERPPU'].includes(type)?'scale':'landmark',local?'blue':'crimson',18);}

function geometry(){
 if(!geographyPromise)geographyPromise=fetch('/static/geo/indonesia-provinces.geojson').then(response=>{if(!response.ok)throw Error('Map geometry not available.');return response.json();}).then(data=>{
  // D3 uses spherical clockwise exteriors; normalize published GeoJSON winding.
  for(const feature of data.features){const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;for(const polygon of polygons){if(globalThis.d3.geoArea({type:'Polygon',coordinates:polygon})>2*Math.PI)for(const ring of polygon)ring.reverse();}}
  return data;
 }).catch(error=>{geographyPromise=null;throw error;});
 return geographyPromise;
}

export function collectionPage(){return `<div class="page-heading collection-page-heading"><div><div class="eyebrow">COLLECTION & REGIONAL COVERAGE</div><h1>Data dashboard</h1><p class="subtitle">See which sources are available, how they spread across regions, and which data still needs review.</p></div><div class="actions"><button class="btn" data-action="collection-refresh">${icon('refresh')}Refresh data</button><button class="btn primary" data-action="collection-upload">${icon('upload')}Upload source</button></div></div><div class="collection-intro"><div><span class="collection-intro-label">${icon('globe',14)} INDONESIA REGULATION ATLAS</span><h2>Legal sources, seen more clearly.</h2><p>Explore documents, know the regions, and trace where every source comes from.</p></div>${collectionArtwork()}</div><div id="collection-dashboard" class="collection-host"></div>`;}

export function sourceFormHTML(channel,provinces){return `<div class="source-intake-form"><div class="source-intake-context">${visualIcon(channel==='upload'?'upload':'link',channel==='upload'?'crimson':'blue',23)}<p class="help-text">${channel==='upload'?'Upload a source document, then complete its identity for review.':'Register a government JDIH link in the retrieval queue. Links are not downloaded or added to the analysis corpus automatically.'}</p></div><input type="hidden" id="intake-channel" value="${channel}"><div class="form-grid"><div><label for="intake-kind">Regulation type</label><select id="intake-kind">${Object.entries(REGULATION_NAMES).map(([id,name])=>`<option value="${id}" ${id==='PP'?'selected':''}>${name}</option>`).join('')}</select></div><div><label for="intake-year">Year</label><input id="intake-year" type="number" min="1945" max="2100" value="${new Date().getFullYear()}"></div></div><label for="intake-title">Regulation title</label><input id="intake-title" maxlength="300" placeholder="Title as in the source document"><label for="intake-number">Number</label><input id="intake-number" maxlength="40" placeholder="For example: 12"><div class="form-grid"><div><label for="intake-province">Issuing / covered province</label><select id="intake-province"><option value="">National / unknown</option>${provinces.map(p=>`<option value="${p.id}">${escape(p.name)}</option>`).join('')}</select></div><div><label for="intake-scope">Known coverage</label><select id="intake-scope"><option value="unknown">Not set</option><option value="national">National</option><option value="province">Province</option><option value="district">Regency/city</option></select></div></div><label for="intake-district">Regency/city (if relevant)</label><input id="intake-district" maxlength="100" placeholder="For example: Kota Bandung"><label for="intake-url">${channel==='jdih'?'Document URL / JDIH page':'Government source URL (optional)'}</label><input id="intake-url" type="url" maxlength="2000" placeholder="https://jdih.…go.id/…">${channel==='upload'?'<label for="intake-file">Source document</label><input id="intake-file" type="file" accept=".pdf,.docx,.txt,.json"><p class="micro">Max 10 MB / 150 PDF pages. Scanned PDFs are flagged for OCR.</p>':''}<p class="micro">Identity is taken from the document. The queue is kept separate from sources already available for analysis.</p></div>`;}

export async function readSourceForm(){
 const value=id=>document.getElementById(id).value.trim();
 const request={channel:value('intake-channel'),title:value('intake-title'),regulation_type:value('intake-kind'),number:value('intake-number'),year:Number(value('intake-year')),province_id:value('intake-province'),district:value('intake-district'),scope:value('intake-scope'),source_url:value('intake-url')};
 if(request.channel==='upload'){
  const file=document.getElementById('intake-file').files[0];if(!file)throw Error('Choose a source document first.');if(file.size>10*1024*1024)throw Error('Maximum file size is 10 MB.');
  request.filename=file.name;
  request.content_base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=()=>reject(Error('The file could not be read.'));reader.readAsDataURL(file);});
 }
 return request;
}

export function intakeDetailHTML(item){return `<div class="note"><b>${escape(statusLabels[item.status]||item.status)}</b> · ${item.channel==='jdih'?'Link recorded. File not fetched yet.':'File saved for review.'}</div><h3>${escape(item.title)}</h3><p>${escape(REGULATION_NAMES[item.regulation_type]||item.regulation_type)} ${escape(item.number)}/${item.year}</p><p class="micro">${item.article_count} article headings detected · ${item.text_available?'Text available':'No text yet'} · ${new Date(item.created_at).toLocaleString('id-ID')}</p>${item.source_url?`<a href="${escape(item.source_url)}" target="_blank" rel="noopener">Open government source ↗</a>`:''}${item.preview?`<h4>Extracted text preview</h4><pre class="intake-preview">${escape(item.preview)}</pre>`:''}${item.sha256?`<p class="micro intake-fingerprint">SHA256 ${escape(item.sha256)}</p>`:''}<p class="micro">This source has not been added to the gallery, legal search or analysis yet.</p>`;}

export function mountCollection(root,{publicOnly=false,request,initialFilters={},onFiltersChange=()=>{},onDocument=()=>{},onIntake=()=>{},onLoaded=()=>{}}={}){
 if(!root)return()=>{};
 initialFilters={...initialFilters,kind:Object.hasOwn(REGULATION_NAMES,initialFilters.kind)?initialFilters.kind:'',mode:['issuer','scope','mentions'].includes(initialFilters.mode)?initialFilters.mode:'issuer'};
 for(const name of ['start','end']){const year=Number(initialFilters[name]);initialFilters[name]=Number.isInteger(year)&&year>=1945&&year<=2100?String(year):'';}
 if(initialFilters.start&&initialFilters.end&&Number(initialFilters.start)>Number(initialFilters.end)){initialFilters.start='';initialFilters.end='';}
 let alive=true,payload,geo,sequence=0,province=initialFilters.province||'',district='',layer=initialFilters.layer==='intake'&&!publicOnly?'intake':'corpus',zoom=1,observer;
 const prefix=publicOnly?'landing-collection':'data-collection';
 root.innerHTML=`<div class="collection-loading" role="status">${visualIcon('globe','blue',26)}<span>Preparing the collection and the Indonesia map…</span></div>`;
 const api=request||(async path=>{const response=await fetch('/api'+path);if(!response.ok)throw Error('Collection data could not be loaded.');return response.json();});

 function shell(){
  root.innerHTML=`<div class="collection-stats" aria-label="Collection summary"></div><section class="collection-map-panel"><div class="collection-filterbar"><label for="${prefix}-kind">Regulation type<select id="${prefix}-kind" data-collection-filter="kind"><option value="">All types</option>${Object.entries(REGULATION_NAMES).map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label for="${prefix}-mode">Distribution meaning<select id="${prefix}-mode" data-collection-filter="mode"><option value="issuer">Issuing region</option><option value="scope">Regulated coverage</option><option value="mentions">Mentioned region</option></select></label><label for="${prefix}-start">From year<input id="${prefix}-start" data-collection-filter="start" type="number" min="1945" max="2100" placeholder="All"></label><label for="${prefix}-end">To year<input id="${prefix}-end" data-collection-filter="end" type="number" min="1945" max="2100" placeholder="All"></label></div><div class="collection-map-layout"><div class="collection-map-main"><div class="collection-map-top"><div><span class="collection-map-heading-icon" aria-hidden="true">${icon('map',23)}</span><span class="eyebrow">COLLECTION DISTRIBUTION</span><h3>Indonesia, in context.</h3></div><div class="collection-map-tools"><button type="button" data-map-zoom="in" aria-label="Zoom in map">${icon('zoomIn',17)}</button><button type="button" data-map-zoom="out" aria-label="Zoom out map">${icon('zoomOut',17)}</button><button type="button" data-map-zoom="reset">${icon('refresh',14)}<span>Reset</span></button></div></div><div class="collection-map-canvas"><svg class="collection-map" aria-label="Map of documents by province"></svg><div class="collection-map-tooltip" hidden></div><div class="collection-map-compass" aria-hidden="true"><span>N</span>${icon('compass',25)}</div></div><div class="collection-map-legend"><span><i class="legend-empty"></i>0 documents</span><span><i class="legend-filled"></i>Documents</span><small data-map-summary></small></div><div class="collection-geography-note">${icon('globe',12)}Geometry: <a href="https://geoservices.big.go.id/gis/rest/services/STIG/Batas_Provinsi/MapServer/0" target="_blank" rel="noopener">BIG</a> · 38 provinces · Snapshot 13 Oct 2026</div></div><aside class="collection-region-detail"><label for="${prefix}-province">Explore region<select id="${prefix}-province" data-collection-province><option value="">National</option><option value="unmapped">Unmapped</option>${geo.features.slice().sort((a,b)=>a.properties.name.localeCompare(b.properties.name)).map(f=>`<option value="${f.properties.id}">${escape(f.properties.name)}</option>`).join('')}</select></label>${publicOnly?'':`<label for="${prefix}-layer">Data shown<select id="${prefix}-layer" data-collection-layer><option value="corpus">Source collection</option><option value="intake">Source queue</option></select></label>`}<div data-region-content aria-live="polite"></div>${publicOnly?`<a class="btn primary collection-dashboard-link" href="/workspace?view=data">${icon('map',16)}Explore data dashboard${icon('arrow',14)}</a>`:''}</aside></div><p class="collection-mode-note"></p></section>${publicOnly?'':`<div class="collection-breakdown"><section class="panel"><div class="panel-head"><h3>${icon('scale',18)}Regulation type</h3><span class="micro">Documents in the collection</span></div><div class="collection-types"></div></section><section class="panel"><div class="panel-head"><h3>${icon('tag',18)}Identified topics</h3><span class="micro">May overlap</span></div><div class="collection-topics"></div></section></div><div class="collection-quality"></div><section class="panel collection-documents"><div class="panel-head"><h3 class="collection-document-heading">${icon('files',18)}<span data-document-heading>Documents in the collection</span></h3><span class="tag" data-document-count></span></div><div data-document-list></div></section><section class="panel collection-intake"><div class="panel-head"><div><span class="eyebrow">TWO CHANNELS, ONE QUEUE</span><h3>${icon('database',20)}Add the next source.</h3></div><span class="collection-intake-emblem" aria-hidden="true">${icon('layers',28)}</span></div><div class="collection-intake-actions"><button class="collection-source-card" data-action="collection-upload" aria-label="Upload source">${visualIcon('upload','crimson',24)}<span><b>Upload source</b><small>PDF, DOCX, TXT, or JSON</small></span>${icon('arrow',17)}</button><button class="collection-source-card" data-action="collection-jdih" aria-label="Add JDIH link">${visualIcon('link','blue',24)}<span><b>Add JDIH link</b><small>Record a government source URL</small></span>${icon('arrow',17)}</button></div><div class="collection-source-flow" aria-label="Sources received, recorded and awaiting review"><span>${icon('files',14)}Incoming sources</span>${icon('chevron',12)}<span>${icon('database',14)}Recorded</span>${icon('chevron',12)}<span>${icon('fileSearch',14)}Needs review</span><button class="text-button" data-action="collection-draft">${icon('file',14)}Import my draft</button></div><div class="collection-intake-status"></div><div class="collection-intake-list"></div><p class="collection-intake-note">Uploads and links are recorded for review. The queue is not yet part of the analysis corpus; JDIH links are not fetched automatically.</p></section>`}<div class="collection-error" role="alert" hidden></div>`;
  root.querySelector('[data-collection-province]').value=province;
  for(const name of ['kind','mode','start','end'])root.querySelector(`[data-collection-filter="${name}"]`).value=initialFilters[name]||'';
  if(!publicOnly)root.querySelector('[data-collection-layer]').value=layer;
 }

 function rows(){
  if(layer==='corpus')return payload.provinces;
  const mode=field('mode'),kind=field('kind'),start=Number(field('start'))||null,end=Number(field('end'))||null;
  return payload.provinces.map(p=>{
   const items=payload.intake.filter(i=>(!kind||i.regulation_type===kind)&&(!start||i.year>=start)&&(!end||i.year<=end)&&i.province_id===p.id&&(mode==='issuer'&&!['UU','PERPPU','PP','PERPRES','PERMEN','PER_LEMBAGA'].includes(i.regulation_type)||mode==='scope'&&['province','district'].includes(i.scope)));
   const districts={};for(const item of items)if(item.district)districts[item.district]=(districts[item.district]||0)+1;
   return {...p,count:items.length,districts};
  });
 }
 const field=name=>{const input=root.querySelector(`[data-collection-filter="${name}"]`);return input?input.value:initialFilters[name]||'';};
 function drawMap(){
  if(!alive||!root.isConnected||!geo)return;
  const svg=root.querySelector('.collection-map'),canvas=root.querySelector('.collection-map-canvas');
  const width=Math.max(260,canvas.clientWidth),height=Math.max(240,Math.min(390,width*.43));svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  const projection=globalThis.d3.geoMercator().fitExtent([[18,22],[width-18,height-22]],geo);
  const path=globalThis.d3.geoPath(projection),data=rows(),max=Math.max(1,...data.map(p=>p.count));
  const graticule=globalThis.d3.geoGraticule().extent([[94,-12],[142,8]]).step([4,4]);
  svg.innerHTML='<path class="collection-map-grid" aria-hidden="true" d="'+path(graticule())+'"/><g class="collection-map-land">'+geo.features.map(feature=>{
   const p=data.find(p=>p.id===feature.properties.id),count=p?.count||0;
   return `<path class="province-shape ${count?'has-documents':''} ${province===feature.properties.id?'selected':''}" data-province="${feature.properties.id}" data-count="${count}" role="button" tabindex="0" aria-label="${escape(feature.properties.name)}: ${count} documents" aria-pressed="${province===feature.properties.id}" style="--density:${count?(.25+.7*count/max):0}" d="${path(feature)}"><title>${escape(feature.properties.name)} · ${count} documents</title></path>`;
  }).join('')+'</g>';
  const group=svg.querySelector('g');group.setAttribute('transform',`translate(${width/2} ${height/2}) scale(${zoom}) translate(${-width/2} ${-height/2})`);
  svg.querySelector('.collection-map-grid')?.setAttribute('transform',group.getAttribute('transform'));
  root.querySelector('[data-map-summary]').textContent=data.filter(p=>p.count>0).length+' / '+data.length+' provinces have '+(layer==='corpus'?'collection':'queued sources');
  const tooltip=root.querySelector('.collection-map-tooltip');
  svg.onpointermove=event=>{const target=event.target.closest('[data-province]');if(!target){tooltip.hidden=true;return;}const name=geo.features.find(f=>f.properties.id===target.dataset.province).properties.name;tooltip.textContent=name+' · '+target.dataset.count+' documents';tooltip.hidden=false;const box=canvas.getBoundingClientRect();tooltip.style.left=Math.max(8,Math.min(event.clientX-box.left+12,width-tooltip.offsetWidth-8))+'px';tooltip.style.top=Math.max(8,Math.min(event.clientY-box.top-46,height-48))+'px';};
  svg.onpointerleave=()=>tooltip.hidden=true;
  svg.onkeydown=event=>{if(['Enter',' '].includes(event.key)&&event.target.dataset.province){event.preventDefault();selectProvince(event.target.dataset.province);root.querySelector(`[data-province="${province}"]`)?.focus();}};
 }

 function regionDocs(){
  const mode=field('mode');return (payload.documents||[]).filter(d=>province==='unmapped'?(mode==='issuer'?d.issuer_level==='unknown':mode==='scope'?d.scope==='unknown':!d.mentioned_provinces.length):province?(mode==='issuer'?d.issuer_level==='province'&&d.province_id===province:mode==='scope'?d.scope_provinces.includes(province):d.mentioned_provinces.includes(province)):(mode==='issuer'?d.issuer_level==='national':mode==='scope'?d.scope==='national':false)).filter(d=>!district||d.district===district);
 }
 function paint(){
  if(!alive||!root.isConnected)return;
  const s=payload.summary;
  renderCollectionStats(root.querySelector('.collection-stats'),[
   {value:s.unique_regulations,title:'Unique regulations',caption:'Type, number, year & region identity',iconHtml:icon('scale',21),tone:'crimson'},
   {value:s.documents,title:'Documents / versions',caption:'Amendments have their own identity',iconHtml:icon('files',21),tone:'blue'},
   {value:s.articles,title:'Articles / blocks',caption:'Extracted from the collection',iconHtml:icon('tree',21),tone:'violet'},
   {value:[s.mapped_provinces,s.province_total],title:'Provinces in collection',caption:'By the selected distribution meaning',iconHtml:icon('map',21),tone:'green'},
  ]);
  const region=rows().find(p=>p.id===province),mode=field('mode');
  const kind=field('kind'),start=Number(field('start'))||null,end=Number(field('end'))||null;
  const nationalQueue=(payload.intake||[]).filter(i=>(!kind||i.regulation_type===kind)&&(!start||i.year>=start)&&(!end||i.year<=end)&&(mode==='issuer'?['UU','PERPPU','PP','PERPRES','PERMEN','PER_LEMBAGA'].includes(i.regulation_type):mode==='scope'?i.scope==='national':false));
  const unknownQueue=(payload.intake||[]).filter(i=>(!kind||i.regulation_type===kind)&&(!start||i.year>=start)&&(!end||i.year<=end)&&(mode==='mentions'||mode==='scope'&&i.scope==='unknown'||mode==='issuer'&&!['UU','PERPPU','PP','PERPRES','PERMEN','PER_LEMBAGA'].includes(i.regulation_type)&&!i.province_id)).length;
  const unknownCount=layer==='corpus'?s.unknown_region:unknownQueue;
  const regionName=province==='unmapped'?'Unmapped':region?.name||'National';
  const count=province==='unmapped'?unknownCount:province?region?.count||0:layer==='corpus'?s.national:nationalQueue.length;
  const regionContent=root.querySelector('[data-region-content]');
  const prevRegionCount=Number(regionContent.dataset.regionCount||0);
  regionContent.dataset.regionCount=String(count);
  regionContent.innerHTML=`<div class="collection-region-visual">${visualIcon(province==='unmapped'?'search':province?'pin':'landmark',province?'blue':'crimson',25)}<span class="collection-region-tag">${layer==='corpus'?'SOURCE COLLECTION':'SOURCE QUEUE'}</span></div><h3>${escape(regionName)}</h3><div class="collection-region-number">${fmt(count)} <span>documents</span></div><p>${province?(count?'Choose a document or regency/city to explore sources in this region.':'None yet '+(layer==='corpus'?'documents in the collection':'sources in queue')+' for this region and filter.'):'National documents are counted separately. Their number is not split across provinces.'}</p>${region&&Object.keys(region.districts).length?`<h4>Regency / city</h4><div class="collection-districts">${Object.entries(region.districts).map(([name,n])=>`<button type="button" data-district="${escape(name)}" aria-pressed="${district===name}">${escape(name)} <span>${n}</span></button>`).join('')}</div>`:''}${district?'<button type="button" class="text-button" data-district="">All regencies/cities</button>':''}<div class="collection-unmapped">${fmt(unknownCount)} documents ${mode==='mentions'?'without mentioned-region metadata':'unmapped'}</div>`;
  renderNumberTicker(regionContent.querySelector('.collection-region-number'),count,{startValue:prevRegionCount,suffix:'documents'});
  root.querySelector('.collection-mode-note').textContent={issuer:'Issuing region shows where a document comes from. National coverage is shown separately from regional collections.',scope:'Coverage uses recorded metadata; one document can cover several regions. This spread does not measure population or policy impact.',mentions:'Mentioned regions use location reference metadata. One document can mention several regions; a mentioned location is not necessarily where it applies or has impact.'}[mode];
  if(!publicOnly){
   const max=Math.max(1,...Object.values(payload.types));
   root.querySelector('.collection-types').innerHTML=Object.entries(REGULATION_NAMES).map(([id,name])=>`<button type="button" data-kind="${id}" aria-pressed="${kind===id}"><span class="collection-type-name">${icon(id.startsWith('PERDA')||['PERGUB','PERBUP','PERWALI'].includes(id)?'map':id.includes('DES')?'pin':['UU','PERPPU'].includes(id)?'scale':'landmark',14)}${escape(name)}</span><div class="collection-type-track"><i style="width:${100*(payload.types[id]||0)/max}%"></i></div><b>${payload.types[id]||0}</b></button>`).join('');
   root.querySelector('.collection-topics').innerHTML=Object.entries(payload.topics).sort((a,b)=>b[1]-a[1]).map(([key,n])=>`<span>${icon(topicIcons[key]||'tag',16)}<b>${escape(topicName(key))}</b><small>${n} documents</small></span>`).join('')||'<p class="help-text">No topics identified for this filter yet.</p>';
   root.querySelector('.collection-quality').innerHTML=`<div>${visualIcon('scan','blue',20)}<strong>${s.documents-s.needs_ocr}</strong><span>documents with text available</span></div><div>${visualIcon('reviewer','green',20)}<strong>${s.human_verified}</strong><span>marked as human-reviewed</span></div><div class="${s.checksum_issues?'quality-attention':''}">${visualIcon('attention','amber',20)}<strong>${s.checksum_issues}</strong><span>source checksum needs checking</span></div>`;
   const docs=regionDocs();root.querySelector('[data-document-heading]').textContent='Collection · '+(district||regionName);root.querySelector('[data-document-count]').textContent=docs.length+' documents';
   root.querySelector('.collection-documents').hidden=layer==='intake';
    root.querySelector('[data-document-list]').innerHTML=docs.length?docs.slice(0,5).map(d=>`<button type="button" class="collection-document-row" data-document="${escape(d.id)}">${regulationVisual(d.regulation_type)}<div><span>${escape(REGULATION_NAMES[d.regulation_type]||d.regulation_type)} ${escape(d.number)}/${d.year}</span><h4>${escape(d.title)}</h4><small>${d.articles} articles/blocks · ${escape(d.version_kind)} · ${d.human_verified?'Review recorded':'Legal status not verified'}</small></div><span class="collection-row-arrow" aria-hidden="true">${icon('arrow',17)}</span></button>`).join('')+(docs.length>5?'<p class="help-text">Showing the first 5 documents. Narrow the filters to browse the collection.</p>':''):`<div class="collection-empty">${visualIcon('fileSearch','blue',28)}<div><h4>This region’s collection is still empty.</h4><p>Add sources for review or explore national documents.</p><button class="btn" data-collection-national>${icon('globe',15)}Explore national</button></div></div>`;
   const intake=payload.intake||[];
   root.querySelector('.collection-intake-status').innerHTML=[['upload','Uploads',intake.filter(i=>i.channel==='upload').length],['jdih','JDIH links',intake.filter(i=>i.channel==='jdih').length],['ocr','Needs OCR',intake.filter(i=>i.status==='needs_ocr').length]].map(([channel,title,n])=>`<div><span class="collection-intake-stat-label">${icon(channel==='upload'?'upload':channel==='jdih'?'link':'scan',16)}${title}</span><strong>${n}</strong></div>`).join('');
   root.querySelector('.collection-intake-list').innerHTML=intake.length?intake.slice(0,30).map(i=>`<button type="button" class="collection-intake-row" data-intake="${i.id}">${visualIcon(i.channel==='upload'?'file':'link',i.channel==='upload'?'crimson':'blue',19)}<div><b>${escape(i.title)}</b><small>${escape(REGULATION_NAMES[i.regulation_type])} ${escape(i.number)}/${i.year} · ${i.channel==='upload'?'Upload':'JDIH'}</small></div><span class="tag">${escape(statusLabels[i.status])}</span></button>`).join(''):`<div class="collection-intake-empty">${visualIcon('database','blue',25)}<p>No sources in the queue yet. Upload a document or register a JDIH link to start collecting data.</p></div>`;
  }
  const filters={kind:field('kind'),mode:field('mode'),start:field('start'),end:field('end'),province,layer};
  if(publicOnly){const query=new URLSearchParams({view:'data'});for(const [key,value] of Object.entries(filters))if(value&&key!=='layer')query.set(key,value);root.querySelector('.collection-dashboard-link').href='/workspace?'+query;}
  drawMap();onLoaded(payload);onFiltersChange(filters);
 }

 async function load(initial=false){
  const ticket=++sequence;
  root.setAttribute('aria-busy','true');
  try{
   const query=new URLSearchParams();for(const name of ['kind','start','end','mode'])if(field(name))query.set(name,field(name));
   const [data,geography]=await Promise.all([api((publicOnly?'/public/collection':'/data/overview')+'?'+query),geometry()]);
   if(!alive||ticket!==sequence||!root.isConnected)return;
   payload=data;geo=geography;if(province!=='unmapped'&&!geo.features.some(f=>f.properties.id===province))province='';if(initial)shell();
   root.querySelector('.collection-error').hidden=true;paint();
   if(!observer){observer=new ResizeObserver(()=>drawMap());observer.observe(root.querySelector('.collection-map-canvas'));}
  }catch(error){
   if(!alive||ticket!==sequence||!root.isConnected)return;
   if(initial)root.innerHTML='<div class="collection-load-error" role="alert"><h3>Collection data could not be loaded.</h3><p></p><button type="button" class="btn" data-collection-retry>Try again</button></div>';
   const target=root.querySelector(initial?'.collection-load-error p':'.collection-error');target.textContent=error.message;target.hidden=false;
  }finally{if(alive&&ticket===sequence)root.setAttribute('aria-busy','false');}
 }
 function selectProvince(id){province=id;district='';root.querySelector('[data-collection-province]').value=id;paint();}
 root.addEventListener('click',click);
 function click(event){
  const button=event.target.closest('[data-province],[data-kind],[data-district],[data-map-zoom],[data-document],[data-intake],[data-collection-national],[data-collection-retry]');if(!button)return;
  if(button.hasAttribute('data-collection-retry'))return load(true);
  if(button.hasAttribute('data-collection-national'))return selectProvince('');
  if(button.dataset.province)return selectProvince(button.dataset.province);
  if(button.dataset.kind){const select=root.querySelector('[data-collection-filter="kind"]');select.value=select.value===button.dataset.kind?'':button.dataset.kind;select.dispatchEvent(new Event('rulelab:sync'));return load();}
  if(button.hasAttribute('data-district')){district=button.dataset.district;return paint();}
  if(button.dataset.mapZoom){zoom=button.dataset.mapZoom==='in'?Math.min(3,zoom+.5):button.dataset.mapZoom==='out'?Math.max(1,zoom-.5):1;return drawMap();}
  if(button.dataset.document)onDocument(button.dataset.document);
  if(button.dataset.intake)onIntake(button.dataset.intake);
 }
 root.addEventListener('change',change);
 function change(event){if(event.target.dataset.collectionFilter){district='';load();}if(event.target.hasAttribute('data-collection-province'))selectProvince(event.target.value);if(event.target.hasAttribute('data-collection-layer')){layer=event.target.value;district='';paint();}}
 load(true);
 return()=>{alive=false;observer?.disconnect();root.removeEventListener('click',click);root.removeEventListener('change',change);};
}
