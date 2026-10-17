import '/static/vendor/d3.min.js';
import {REGULATION_NAMES} from '/static/draft-builder.js';
import {icon} from '/static/design.js';

// Shared by the public landing map and the workspace Data dashboard (data-dashboard.js).
export const escape=(value='')=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const fmt=value=>new Intl.NumberFormat('id-ID').format(value||0);
export const NATIONAL_TYPES=['UU','PERPPU','PP','PERPRES','PERMEN','PER_LEMBAGA'];
const statusLabels={link_pending:'Waiting for retrieval',needs_review:'Needs review',needs_ocr:'Needs OCR'};
let geographyPromise;

export function visualIcon(name,tone='crimson',size=20){return `<span class="collection-visual-icon collection-icon-${tone}" aria-hidden="true">${icon(name,size)}</span>`;}

export function geometry(){
 if(!geographyPromise)geographyPromise=fetch('/static/geo/indonesia-provinces.geojson').then(response=>{if(!response.ok)throw Error('Map geometry not available.');return response.json();}).then(data=>{
  // D3 uses spherical clockwise exteriors; normalize published GeoJSON winding.
  for(const feature of data.features){const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;for(const polygon of polygons){if(globalThis.d3.geoArea({type:'Polygon',coordinates:polygon})>2*Math.PI)for(const ring of polygon)ring.reverse();}}
  return data;
 }).catch(error=>{geographyPromise=null;throw error;});
 return geographyPromise;
}

// Choropleth of province counts; `rows` are {id,count}; returns nothing, wires tooltip and keyboard selection.
export function drawProvinceMap({svg,canvas,geo,rows,selected='',zoom=1,ratio=.43,maxHeight=390,minHeight=240,label='documents',onSelect}){
 const width=Math.max(260,canvas.clientWidth),height=Math.max(minHeight,Math.min(maxHeight,width*ratio));svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
 const projection=globalThis.d3.geoMercator().fitExtent([[18,22],[width-18,height-22]],geo);
 const path=globalThis.d3.geoPath(projection),max=Math.max(1,...rows.map(p=>p.count));
 const graticule=globalThis.d3.geoGraticule().extent([[94,-12],[142,8]]).step([4,4]);
 svg.innerHTML='<path class="collection-map-grid" aria-hidden="true" d="'+path(graticule())+'"/><g class="collection-map-land">'+geo.features.map(feature=>{
  const count=rows.find(p=>p.id===feature.properties.id)?.count||0;
  return `<path class="province-shape ${count?'has-documents':''} ${selected===feature.properties.id?'selected':''}" data-province="${feature.properties.id}" data-count="${count}" role="button" tabindex="0" aria-label="${escape(feature.properties.name)}: ${count} ${label}" aria-pressed="${selected===feature.properties.id}" style="--density:${count?(.25+.7*count/max):0}" d="${path(feature)}"><title>${escape(feature.properties.name)} · ${count} ${label}</title></path>`;
 }).join('')+'</g>';
 const group=svg.querySelector('g');group.setAttribute('transform',`translate(${width/2} ${height/2}) scale(${zoom}) translate(${-width/2} ${-height/2})`);
 svg.querySelector('.collection-map-grid')?.setAttribute('transform',group.getAttribute('transform'));
 const tooltip=canvas.querySelector('.collection-map-tooltip');
 svg.onpointermove=event=>{const target=event.target.closest('[data-province]');if(!target||!tooltip){if(tooltip)tooltip.hidden=true;return;}const name=geo.features.find(f=>f.properties.id===target.dataset.province).properties.name;tooltip.textContent=name+' · '+fmt(target.dataset.count)+' '+label;tooltip.hidden=false;const box=canvas.getBoundingClientRect();tooltip.style.left=Math.max(8,Math.min(event.clientX-box.left+12,width-tooltip.offsetWidth-8))+'px';tooltip.style.top=Math.max(8,Math.min(event.clientY-box.top-46,height-48))+'px';};
 svg.onpointerleave=()=>{if(tooltip)tooltip.hidden=true;};
 svg.onkeydown=event=>{if(['Enter',' '].includes(event.key)&&event.target.dataset.province){event.preventDefault();onSelect?.(event.target.dataset.province);svg.querySelector(`[data-province="${event.target.dataset.province}"]`)?.focus();}};
}

export function statCard({value,title,caption,glyph,tone}){return `<div class="collection-stat collection-stat-${tone}"><div class="collection-stat-top"><span>${escape(title)}</span>${visualIcon(glyph,tone,21)}</div><strong data-value="${escape(Array.isArray(value)?value.join('/'):value)}">${Array.isArray(value)?fmt(value[0])+' / '+fmt(value[1]):fmt(value)}</strong><small>${escape(caption)}</small></div>`;}

export function collectionPage(){return '<div id="collection-dashboard" class="collection-host dd"></div>';}

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
export {statusLabels};

// Public landing map (no login): live counts, filters, province drill-down and a link into the dashboard.
export function mountCollection(root){
 if(!root)return()=>{};
 let alive=true,payload,geo,sequence=0,province='',zoom=1,observer;
 const prefix='landing-collection';
 root.innerHTML=`<div class="collection-loading" role="status">${visualIcon('globe','blue',26)}<span>Preparing the collection and the Indonesia map…</span></div>`;
 const field=name=>root.querySelector(`[data-collection-filter="${name}"]`)?.value||'';
 function shell(){
  root.innerHTML=`<div class="collection-stats" aria-label="Collection summary"></div><section class="collection-map-panel"><div class="collection-filterbar"><label for="${prefix}-kind">Regulation type<select id="${prefix}-kind" data-collection-filter="kind"><option value="">All types</option>${Object.entries(REGULATION_NAMES).map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label for="${prefix}-mode">Distribution meaning<select id="${prefix}-mode" data-collection-filter="mode"><option value="issuer">Issuing region</option><option value="scope">Regulated coverage</option><option value="mentions">Mentioned region</option></select></label><label for="${prefix}-start">From year<input id="${prefix}-start" data-collection-filter="start" type="number" min="1945" max="2100" placeholder="All"></label><label for="${prefix}-end">To year<input id="${prefix}-end" data-collection-filter="end" type="number" min="1945" max="2100" placeholder="All"></label></div><div class="collection-map-layout"><div class="collection-map-main"><div class="collection-map-top"><div><span class="collection-map-heading-icon" aria-hidden="true">${icon('map',23)}</span><span class="eyebrow">COLLECTION DISTRIBUTION</span><h3>Indonesia, in context.</h3></div><div class="collection-map-tools"><button type="button" data-map-zoom="in" aria-label="Zoom in map">${icon('zoomIn',17)}</button><button type="button" data-map-zoom="out" aria-label="Zoom out map">${icon('zoomOut',17)}</button><button type="button" data-map-zoom="reset">${icon('refresh',14)}<span>Reset</span></button></div></div><div class="collection-map-canvas"><svg class="collection-map" aria-label="Map of documents by province"></svg><div class="collection-map-tooltip" hidden></div><div class="collection-map-compass" aria-hidden="true"><span>N</span>${icon('compass',25)}</div></div><div class="collection-map-legend"><span><i class="legend-empty"></i>0 documents</span><span><i class="legend-filled"></i>Documents</span><small data-map-summary></small></div><div class="collection-geography-note">${icon('globe',12)}Geometry: <a href="https://geoservices.big.go.id/gis/rest/services/STIG/Batas_Provinsi/MapServer/0" target="_blank" rel="noopener">BIG</a> · 38 provinces · Snapshot 13 Oct 2026</div></div><aside class="collection-region-detail"><label for="${prefix}-province">Explore region<select id="${prefix}-province" data-collection-province><option value="">National</option><option value="unmapped">Unmapped</option>${geo.features.slice().sort((a,b)=>a.properties.name.localeCompare(b.properties.name)).map(f=>`<option value="${f.properties.id}">${escape(f.properties.name)}</option>`).join('')}</select></label><div data-region-content aria-live="polite"></div><a class="btn primary collection-dashboard-link" href="/workspace?view=data">${icon('map',16)}Explore data dashboard${icon('arrow',14)}</a></aside></div><p class="collection-mode-note"></p></section><div class="collection-error" role="alert" hidden></div>`;
 }
 function drawMap(){if(alive&&root.isConnected&&geo)drawProvinceMap({svg:root.querySelector('.collection-map'),canvas:root.querySelector('.collection-map-canvas'),geo,rows:payload.provinces,selected:province,zoom,onSelect:selectProvince});}
 function paint(){
  if(!alive||!root.isConnected)return;
  const s=payload.summary,mode=field('mode');
  root.querySelector('.collection-stats').innerHTML=[statCard({value:s.unique_regulations,title:'Unique regulations',caption:'Type, number, year & region identity',glyph:'scale',tone:'crimson'}),statCard({value:s.documents,title:'Documents / versions',caption:'Amendments have their own identity',glyph:'files',tone:'blue'}),statCard({value:s.articles,title:'Articles / blocks',caption:'Extracted from the collection',glyph:'tree',tone:'violet'}),statCard({value:[s.mapped_provinces,s.province_total],title:'Provinces in collection',caption:'By the selected distribution meaning',glyph:'map',tone:'green'})].join('');
  const region=payload.provinces.find(p=>p.id===province);
  const regionName=province==='unmapped'?'Unmapped':region?.name||'National';
  const count=province==='unmapped'?s.unknown_region:province?region?.count||0:s.national;
  root.querySelector('[data-region-content]').innerHTML=`<div class="collection-region-visual">${visualIcon(province==='unmapped'?'search':province?'pin':'landmark',province?'blue':'crimson',25)}<span class="collection-region-tag">SOURCE COLLECTION</span></div><h3>${escape(regionName)}</h3><div class="collection-region-number">${fmt(count)} <span>documents</span></div><p>${province?(count?'Open the data dashboard to explore the documents of this region.':'No documents in the collection for this region and filter yet.'):'National documents are counted separately. Their number is not split across provinces.'}</p><div class="collection-unmapped">${fmt(s.unknown_region)} documents ${mode==='mentions'?'without mentioned-region metadata':'unmapped'}</div>`;
  root.querySelector('[data-map-summary]').textContent=s.mapped_provinces+' / '+s.province_total+' provinces have collection';
  root.querySelector('.collection-mode-note').textContent={issuer:'Issuing region shows where a document comes from. National coverage is shown separately from regional collections.',scope:'Coverage uses recorded metadata; one document can cover several regions. This spread does not measure population or policy impact.',mentions:'Mentioned regions use location reference metadata. One document can mention several regions; a mentioned location is not necessarily where it applies or has impact.'}[mode];
  const query=new URLSearchParams({view:'data'});for(const name of ['kind','mode','start','end'])if(field(name))query.set(name,field(name));if(province)query.set('province',province);
  root.querySelector('.collection-dashboard-link').href='/workspace?'+query;
  drawMap();
 }
 async function load(initial=false){
  const ticket=++sequence;root.setAttribute('aria-busy','true');
  try{
   const query=new URLSearchParams();for(const name of ['kind','start','end','mode'])if(field(name))query.set(name,field(name));
   const [response,geography]=await Promise.all([fetch('/api/public/collection?'+query),geometry()]);
   if(!response.ok)throw Error('Collection data could not be loaded.');
   const data=await response.json();
   if(!alive||ticket!==sequence||!root.isConnected)return;
   payload=data;geo=geography;if(initial)shell();
   root.querySelector('.collection-error').hidden=true;paint();
   if(!observer){observer=new ResizeObserver(()=>drawMap());observer.observe(root.querySelector('.collection-map-canvas'));}
  }catch(error){
   if(!alive||ticket!==sequence||!root.isConnected)return;
   if(initial)root.innerHTML='<div class="collection-load-error" role="alert"><h3>Collection data could not be loaded.</h3><p></p><button type="button" class="btn" data-collection-retry>Try again</button></div>';
   const target=root.querySelector(initial?'.collection-load-error p':'.collection-error');target.textContent=error.message;target.hidden=false;
  }finally{if(alive&&ticket===sequence)root.setAttribute('aria-busy','false');}
 }
 function selectProvince(id){province=id;root.querySelector('[data-collection-province]').value=id;paint();}
 root.addEventListener('click',click);
 function click(event){
  const button=event.target.closest('[data-province],[data-map-zoom],[data-collection-retry]');if(!button)return;
  if(button.hasAttribute('data-collection-retry'))return load(true);
  if(button.dataset.province)return selectProvince(button.dataset.province);
  if(button.dataset.mapZoom){zoom=button.dataset.mapZoom==='in'?Math.min(3,zoom+.5):button.dataset.mapZoom==='out'?Math.max(1,zoom-.5):1;return drawMap();}
 }
 root.addEventListener('change',change);
 function change(event){if(event.target.dataset.collectionFilter)load();if(event.target.hasAttribute('data-collection-province'))selectProvince(event.target.value);}
 load(true);
 return()=>{alive=false;observer?.disconnect();root.removeEventListener('click',click);root.removeEventListener('change',change);};
}
