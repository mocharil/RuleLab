import {builderHTML,readBuilder,previewHTML,updateBuilderNote,REGULATION_NAMES} from '/static/draft-builder.js';
import {collectionPage,mountCollection,sourceFormHTML,readSourceForm,intakeDetailHTML} from '/static/collection-ui.js';
import {initializeSelects} from '/static/select.js';
import {icon,visualBadge,enhanceDesign,enhanceVisualSurface,menuArtwork} from '/static/design.js';
import {galleryPage,galleryCards,formatLegalArticleHTML} from '/static/gallery.js';
import {initializeFrameworkShell,renderFrameworkComponents,disposePageComponents,refreshFrameworkStatus} from '/static/framework/framework.js';
import {initializeWorkspaceUX,enhanceWorkspace} from '/static/workspace-ux.js';
import {socialShell,updateSocial} from '/static/social.js';
import {agentWorkspace,agentPanel,agentActivity,agentJobHistory} from '/static/agents.js';
import {studioPanel,defaultAssumptions,assumptionInputs,readAssumptions} from '/static/studio.js';
import {skeleton,withLoading,isBusy} from '/static/ui.js';
initializeFrameworkShell();
const $=s=>document.querySelector(s), E=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={high:'High',medium:'Medium',low:'Low',potential_vertical_conflict:'Potential vertical conflict',potential_horizontal_conflict:'Potential horizontal conflict',ambiguity:'Ambiguity',implementation_risk:'Implementation risk',coverage_gap:'Context incomplete',potential_only:'Initial indication',requires_review:'Needs review',temporal:'Time and version',scope:'Scope',authority:'Authority',exceptions:'Exceptions',alternative_interpretation:'Alternative interpretation',binding_statute:'Statutory norm',drafting_technique:'Drafting technique',engineering_guardrail:'Application protocol',needs_review:'Needs review',reviewed_with_notes:'Reviewed with notes'};
const label=v=>labels[v]||v;
const fmt=n=>new Intl.NumberFormat('id-ID').format(n), rup=n=>'Rp '+fmt(n);
const names={home:'Overview',data:'Data dashboard',editor:'Draft editor',analysis:'Conflict check',simulation:'Impact & public simulation',library:'Legal library',history:'Activity',social:'Impact & public simulation',agents:'Activity'};
const canonicalView=view=>['gallery','corpus'].includes(view)?'library':view==='social'?'simulation':Object.hasOwn(names,view)?view:'home';
const workflowViews=['editor','analysis','simulation'];
const activityViews=['history','agents'];
const activityTab=view=>view==='agents'?'agents':'results';
const workflowNames={editor:'Draft',analysis:'Check',simulation:'Test impact'};
const workflowRoute=params=>params.get('view')==='studio'?(workflowViews.includes(params.get('stage'))?params.get('stage'):'editor'):params.get('view')==='activity'?(params.get('tab')==='agents'?'agents':'history'):params.get('view')||'home';
const _urlP=new URLSearchParams(location.search), _initV=workflowRoute(_urlP);
let S={view:canonicalView(_initV),lastStudioView:'editor',lastActivityView:'history',agentIntent:'full',libraryTab:_initV==='corpus'||_urlP.get('tab')==='passages'?'passages':'documents',searchResultQuery:'',simSection:_initV==='social'?'social':(['projection','social','unified'].includes(_urlP.get('sub'))?_urlP.get('sub'):'projection'),draft:null,drafts:[],runs:[],corpus:[],status:{},catalog:null,builderResult:null,socialConfig:{persona_count:24,rounds:4,crowd_size:100},socialPreview:null,collectionFilters:Object.fromEntries(['kind','mode','start','end','province','layer'].map(key=>[key,_urlP.get(key)||''])),gallery:{query:'',type:'all',doc:null,articleNumber:null,readerMode:'formatted',chatFolded:false,scopeId:'',question:'',turns:[]},dirty:false,alt:'',simAss:null,studioTab:'impact',results:null,searchQuery:'',findingFilter:'all',historyFilter:'all',jobs:[],asOf:new Date().toISOString().slice(0,10)},timer,agentTimer;
let collectionCleanup,collectionData;
const actionIcons={new:'plus',add:'plus',generate:'file',import:'upload',export:'download',report:'download',save:'save',analyze:'shield','analyze-inline':'shield',simulate:'chart','sim-section':'chart','open-studio':'chart','go-social':'network','start-agent':'network',compare:'compare',copy:'copy','back-editor':'back',close:'close','legal-guide':'book','refresh-agents':'refresh',raw:'download','law-json':'download',versions:'clock',review:'shield','run-detail':'file','activity-agents':'network','template-preamble':'sparkles'};
const btn=(text,action,extra='',primary=false)=>`<button class="btn ${primary?'primary':''}" data-action="${action}" ${extra}>${actionIcons[action]?icon(actionIcons[action]):''}${text.replace(/[◎✧↑↗↓→✕+]/g,'').trim()}</button>`;
function toast(text,error=false){$('#toast').textContent=text;$('#toast').className=error?'error':'';$('#toast').style.display='block';clearTimeout(timer);timer=setTimeout(()=>$('#toast').style.display='none',7000);}
function requestError(detail){
 if(typeof detail==='string')return Error(detail);
 if(!Array.isArray(detail))return Error('The request could not be processed. Check the input and try again.');
 const issue=detail[0]||{},parts=(issue.loc||[]).filter(x=>x!=='body'&&x!=='query'),field=parts.at(-1);
 const fields={question:['Question',['gallery-question']],title:['Draft title',['new-title','intake-title','draft-title']],brief:['Policy brief',['brief']],regulation_type:['Regulation type',['new-type','generate-type','intake-kind','reg-type']],alternative_text:['Alternative B',['alternative','agent-alternative']],q:['Keyword',['search-q']],as_of_date:['Analysis date',['legal-date']],notes:['Reviewer notes',['review-notes']],year:['Year',['intake-year']],number:['Number',['intake-number']],source_url:['Source URL',['intake-url']],province_id:['Province',['intake-province']],district:['Regency/city',['intake-district']],filename:['Source file',['intake-file','import-file']],population:['Applicants',['ass-population']],digital_access_pct:['Digital access',['ass-digital_access_pct']],assisted_success_pct:['Assisted success',['ass-assisted_success_pct']],digital_cost:['Digital cost',['ass-digital_cost']],assisted_cost:['Assisted cost',['ass-assisted_cost']],staff_capacity:['Staff capacity',['ass-staff_capacity']]};
 let [label,ids]=fields[field]||['Input',[]];
 if(field==='title'&&document.getElementById('intake-title'))label='Regulation title';
 if(parts.includes('articles')){const index=parts[parts.indexOf('articles')+1];label=(field==='number'?'Number':'Content')+' of Pasal '+(Number(index)+1);const control=document.querySelector('[data-'+(field==='number'?'number':'article')+'="'+index+'"]');if(control)control.id=control.id||'validation-article-'+index;ids=control?[control.id]:[];}
 const messages={string_too_short:'at least '+issue.ctx?.min_length+' characters.',string_too_long:'at most '+issue.ctx?.max_length+' characters.',missing:'is required.',greater_than_equal:'at least '+issue.ctx?.ge+'.',less_than_equal:'at most '+issue.ctx?.le+'.',int_parsing:'must be a whole number.',float_parsing:'must be a number.',literal_error:'selection is not valid.',date_from_datetime_parsing:'enter a valid date.',date_parsing:'enter a valid date.',value_error:'check the input for completeness and consistency.'};
 const error=Error(label+': '+(messages[issue.type]||'format is not valid. Check that input.'));
 error.fieldId=ids.find(id=>document.getElementById(id));return error;
}
function clearFieldError(control){
 if(!control?.id)return;
 const id='rulelab-field-error-'+control.id;document.getElementById(id)?.remove();
 if(control.classList.contains('field-error-control')){control.classList.remove('field-error-control');control.removeAttribute('aria-invalid');const described=(control.getAttribute('aria-describedby')||'').split(' ').filter(x=>x&&x!==id).join(' ');if(described)control.setAttribute('aria-describedby',described);else control.removeAttribute('aria-describedby');}
}
function displayError(error){
 const control=error.fieldId?document.getElementById(error.fieldId):null;
 if(control){clearFieldError(control);const message=document.createElement('p');message.id='rulelab-field-error-'+control.id;message.className='field-error';message.setAttribute('role','alert');message.textContent=error.message;control.after(message);control.setAttribute('aria-invalid','true');control.classList.add('field-error-control');control.setAttribute('aria-describedby',[control.getAttribute('aria-describedby'),message.id].filter(Boolean).join(' '));control.focus();return;}
 const surface=$('#modal').open?$('#modal'):$('#main');surface.querySelector('.workflow-error')?.remove();const alert=document.createElement('div');alert.className='workflow-error';alert.setAttribute('role','alert');alert.innerHTML='<p>'+E(error.message)+'</p><button type="button" data-error-dismiss>Close</button>';surface.prepend(alert);
}
document.addEventListener('input',e=>clearFieldError(e.target));
document.addEventListener('change',e=>clearFieldError(e.target));
document.addEventListener('click',e=>{if(e.target.closest('[data-error-dismiss]'))e.target.closest('.workflow-error')?.remove();});
async function api(path,method='GET',body,extraHeaders={}){
 const token=sessionStorage.getItem('rulelab_token'),controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),method==='GET'?45000:180000);
 try{
  const r=await fetch('/api'+path,{method,signal:controller.signal,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...extraHeaders},...(body?{body:JSON.stringify(body)}:{})});
  if(!r.ok){const x=await r.json().catch(()=>({detail:'Server cannot be reached'}));if(r.status===401)tokenModal();throw requestError(x.detail);}
  return await r.json();
 }catch(err){if(err.name==='AbortError')throw Error('Request timed out. The server may still be processing it. Check the history before repeating the action.');throw err;}
 finally{clearTimeout(timer);}
}
const last=kind=>S.runs.find(r=>r.kind===kind), stale=r=>r?.revision!==S.draft.revision;
const limitations=items=>`<ul class="limitations">${items.map(x=>`<li>${E(x)}</li>`).join('')}</ul>`;
function head(k,title,desc,buttons=''){return `<div class="page-heading"><div><div class="eyebrow">${k}</div><h1>${E(workflowViews.includes(S.view)?'Policy Studio':activityViews.includes(S.view)?'Activity':title)}</h1><div class="subtitle">${E(desc)}</div></div><div class="actions">${buttons}</div></div>`;}
function steps(){return '';}
function workflowNavigation(){
 const review=last('analysis'),impact=last('simulation');
 const status={editor:S.dirty?'Not saved':'Draft v'+S.draft.revision,analysis:review?review.payload.findings.length+' findings · v'+review.revision+(stale(review)?' · older result':''):'Not checked yet',simulation:impact?'Projection v'+impact.revision+(stale(impact)?' · older result':''):'No A/B projection yet'};
 return `<div class="workflow-stage-nav" role="tablist" aria-label="Policy Studio stage">${[['editor','Draft','pen'],['analysis','Verify sources','shield'],['simulation','Test impact','chart']].map(([stage,title,glyph],index)=>`<button id="workflow-stage-${stage}" class="workflow-stage" data-view="${stage}" role="tab" aria-selected="${S.view===stage}" aria-controls="workflow-stage-content" tabindex="${S.view===stage?'0':'-1'}"><span class="workflow-stage-glyph" aria-hidden="true">${icon(glyph,20)}</span><span class="workflow-stage-copy"><b>${title}</b><small>${E(status[stage])}</small></span><span class="workflow-stage-number" aria-hidden="true">0${index+1}</span></button>`).join('')}</div>`;
}
function mountWorkflowStage(){
 if(!workflowViews.includes(S.view))return;
 const heading=$('#main .page-heading');if(!heading)return;
 heading.insertAdjacentHTML('afterend',workflowNavigation());
 const navigation=$('#main .workflow-stage-nav'),content=document.createElement('section');
 content.id='workflow-stage-content';content.setAttribute('role','tabpanel');
 content.setAttribute('aria-labelledby','workflow-stage-'+S.view);
 while(navigation.nextSibling)content.append(navigation.nextSibling);
 navigation.after(content);
}
function activitySummary(){
 const active=S.jobs.filter(j=>['queued','running','cancelling'].includes(j.status)).length;
 return `<div class="activity-summary" aria-label="Draft activity summary">${[['files','blue','Saved results',S.runs.length,'Analysis and simulation'],['clock','crimson','Awaiting review',S.runs.filter(r=>r.review_status==='needs_review').length,'Needs human review'],['verified','green','With notes',S.runs.filter(r=>r.review_status==='reviewed_with_notes').length,'Documented decisions'],['network','violet','Active runs',active,S.jobs.length+' runs recorded']].map(([glyph,tone,title,count,detail])=>`<div class="activity-stat">${visualBadge(glyph,tone)}<div><span>${title}</span><strong>${fmt(count)}</strong><small>${detail}</small></div></div>`).join('')}</div>`;
}
function mountActivity(){
 if(!activityViews.includes(S.view))return;
 const heading=$('#main .page-heading');
 heading.insertAdjacentHTML('afterend',`<div id="activity-summary" aria-live="polite">${activitySummary()}</div><div class="activity-tabs" role="tablist" aria-label="Activity section">${[['history','results','Results & review','clock','Outputs, notes and document versions'],['agents','agents','Agent runs','network','Analysis team and execution trace']].map(([view,tab,title,glyph,detail])=>`<button id="activity-tab-${tab}" class="activity-tab" data-view="${view}" role="tab" aria-selected="${S.view===view}" tabindex="${S.view===view?'0':'-1'}" aria-controls="activity-content">${visualBadge(glyph,S.view===view?'green':'blue',19)}<span><b>${title}</b><small>${detail}</small></span>${icon('arrow')}</button>`).join('')}</div>`);
 const nav=$('#main .activity-tabs'),content=document.createElement('section');content.id='activity-content';content.setAttribute('role','tabpanel');content.setAttribute('aria-labelledby','activity-tab-'+activityTab(S.view));
 while(nav.nextSibling)content.append(nav.nextSibling);nav.after(content);
}
function refreshActivity(updateResults=true){
 if(!activityViews.includes(S.view))return;
 const summary=$('#activity-summary');if(summary&&summary.innerHTML!==activitySummary())summary.innerHTML=activitySummary();
 const jobs=$('#agent-job-list');if(jobs)jobs.innerHTML=agentJobHistory(S,E);
 if(S.view==='history'&&updateResults){
  const content=$('#activity-content');if(content){const template=document.createElement('template');template.innerHTML=history();template.content.querySelector('.page-heading')?.remove();content.replaceChildren(template.content);enhanceVisualSurface(content,{view:'activity'});const role=S.status.principal?.role;if(role==='viewer')content.querySelectorAll('[data-action=review]').forEach(button=>button.disabled=true);}
 }
}
function demoNote(){return S.status.provider==='demo'?'<div class="note demo-note"><span class="tag">Demo</span><span>Results use local rules and templates. Numbers are computed from your assumptions.</span></div>':'';}
function source(a){return `<details class="source-details"><summary>${E(a.regulation_label)} · Article ${E(a.number)} <span class="tag">Source snapshot</span></summary><p class="micro" style="margin-top:8px">${E(a.hierarchy_relation||a.legal_status)}</p><div class="quote legal-formatted-quote">${formatLegalArticleHTML(a.text,E)}</div><a href="${E(a.source.url)}" target="_blank" rel="noopener">Official source ↗</a><div class="micro">${a.pages.length?'Page '+a.pages.join(', '):'HTML'} · SHA256 ${E(a.source.sha256.slice(0,16))}…</div></details>`;}
function render(){collectionCleanup?.();syncRoute();document.body.classList.toggle('control-room',S.view==='simulation'&&S.simSection==='social');const views={home,data:collectionPage,editor,analysis,simulation,library,history,social:()=>simulation(),agents:()=>head('RESULTS, REVIEW & EXECUTION','Activity','Run the analysis team and trace results on the same draft version.',btn('View draft versions','versions'))+agentWorkspace(S,E,btn,{embedded:true})};if(workflowViews.includes(S.view))S.lastStudioView=S.view;if(activityViews.includes(S.view))S.lastActivityView=S.view;document.body.dataset.workspace=workflowViews.includes(S.view)?'studio':activityViews.includes(S.view)?'activity':S.view;$('#crumb').textContent=workflowViews.includes(S.view)?'Policy Studio · '+workflowNames[S.view]:activityViews.includes(S.view)?'Activity · '+(S.view==='agents'?'Agent runs':'Results & review'):names[S.view];document.querySelectorAll('#nav button,.workspace-home-link').forEach(x=>{const active=x.dataset.view===S.view||(x.dataset.view==='studio'&&workflowViews.includes(S.view))||(x.dataset.view==='activity'&&activityViews.includes(S.view));x.classList.toggle('active',active);if(active)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current');});if(window.innerWidth<=760){const nav=$('#nav'),active=nav.querySelector('[aria-current=page]');if(active)nav.scrollLeft=Math.max(0,active.offsetLeft-nav.offsetLeft-(nav.clientWidth-active.offsetWidth)/2);}disposePageComponents();$('#main').innerHTML=(views[S.view]||home)();mountWorkflowStage();mountActivity();renderFrameworkComponents(S);if(S.view==='home')loadOverview();enhanceWorkspace(S);enhanceDesign(S);updateSocial(S);agentControls();
 if(S.view==='data')collectionCleanup=mountCollection($('#collection-dashboard'),{request:api,initialFilters:S.collectionFilters,onFiltersChange:filters=>{S.collectionFilters=filters;syncRoute();},onLoaded:data=>{collectionData=data;const role=S.status.principal?.role;if(['viewer','reviewer'].includes(role))document.querySelectorAll('#main [data-action="collection-upload"],#main [data-action="collection-jdih"],#main [data-action="collection-draft"]').forEach(button=>button.disabled=true);},onDocument:async id=>{try{await withLoading('gallery-open',async()=>{S.gallery.doc=await api('/corpus/'+id);S.gallery.articleNumber=S.gallery.doc.articles[0]?.number;S.gallery.scopeId=id;S.libraryTab='documents';await view('library');});}catch(error){toast(error.message,true);}},onIntake:async id=>{try{const item=await api('/data/intake/'+id);modal('Sources in queue',intakeDetailHTML(item),btn('Close','close')+(item.channel==='upload'?btn('Download file','collection-raw',`data-id="${item.id}"`):''));}catch(error){toast(error.message,true);}}});
 const selectedTab=document.querySelector('.sim-unified-tab[aria-selected=true]');
 if(selectedTab){const list=selectedTab.parentElement;list.scrollLeft=Math.max(0,selectedTab.offsetLeft-list.offsetLeft-(list.clientWidth-selectedTab.offsetWidth)/2);}
 const role=S.status.principal?.role;
 if(role==='viewer'||role==='reviewer'){
  const blocked=new Set(['new','create','generate','run-generate','save','add','remove','analyze','analyze-inline','simulate','apply','apply-alt','confirm-alt','import','run-import','start-agent','cancel-agent','collection-upload','collection-jdih','collection-draft','collection-submit']);
  document.querySelectorAll('#main [data-action]').forEach(el=>{if(blocked.has(el.dataset.action)){el.disabled=true;el.title='This action requires the editor or admin role';}});
  if(S.view==='editor')document.querySelectorAll('#draft-title,#reg-type,#scope,#preamble,#document-heading,#draft-closing,#draft-explanation,#draft-attachments,[data-chapter],[data-number],[data-article]').forEach(el=>el.disabled=true);
  if(role==='viewer')document.querySelectorAll('#main [data-action=review]').forEach(el=>el.disabled=true);
 }
}
function editor(){
 const d=S.draft,r=last('analysis'),warn=new Set(r&&!stale(r)?r.payload.findings.map(f=>f.article_number):[]);
 return head('DRAFTING','Draft editor','Edit the draft and review sources, impact and persona reactions in the assistant panel.',`<button class="btn" data-ux="focus-editor" aria-pressed="false">${icon('focus')}Focus mode</button>`+btn('Import','import')+btn('Export DOCX','export')+btn('Save','save','',true))+`
 <div class="editor-layout"><section class="panel document-panel"><div class="panel-head"><select id="draft-select" class="draft-selector" aria-label="Select draft">${S.drafts.map(x=>`<option value="${E(x.id)}" ${x.id===d.id?'selected':''}>${E(x.title)}</option>`).join('')}</select><span id="save-state" class="draft-status ${S.dirty?'dirty':''}">${S.dirty?'Not saved':'Saved · v'+d.revision}</span></div>
 <div class="document-header"><span class="pill">DRAFT FOR REVIEW</span><div class="doc-type">DRAFT <select id="reg-type" aria-label="Regulation type">${Object.keys(REGULATION_NAMES).map(t=>`<option ${t===d.regulation_type?'selected':''}>${t}</option>`).join('')}</select></div><input id="draft-title" aria-label="Draft title" value="${E(d.title)}"><div class="micro">Indonesia · ${d.articles.length} articles · Version ${d.revision}</div></div>

 <div class="preamble-editor-card">
  <div class="preamble-header">
   <div>
    <span class="preamble-badge">REGULATION OPENING (UU 12/2011)</span>
    <h3 class="preamble-title">Considerations (Menimbang), Legal Basis (Mengingat), & Enacting Clause</h3>
    <p class="micro">Indonesian regulations must include a formal opening, considerations and legal basis before the body.</p>
   </div>
   <div class="preamble-actions">
    <button class="btn btn-sm btn-preamble-tpl" data-action="template-preamble" type="button" title="Insert standard Annex II UU 12/2011 format">${icon('sparkles')} Standard Format ${d.regulation_type}</button>
   </div>
  </div>
  <textarea id="preamble" class="preamble-textarea" aria-label="Opening, considerations (Menimbang) and legal basis (Mengingat)" placeholder="DENGAN RAHMAT TUHAN YANG MAHA ESA...&#10;Menimbang: ...&#10;Mengingat: ...&#10;MEMUTUSKAN:&#10;Menetapkan: ...">${E(d.preamble)}</textarea>
 </div>

 <div class="document-outline" aria-label="Article navigation"><span class="micro">ARTICLE LIST</span>${d.articles.map((a,i)=>`<button data-action="jump-article" data-index="${i}">Pasal ${E(a.number)}</button>`).join('')}</div>

 <div class="article-tip-badge">
  <span class="article-tip-icon">${icon('book')}</span>
  <div><strong>Body drafting rule:</strong> each <strong>Pasal</strong> (article) contains one core norm. If it holds more than one norm, number them as <strong>Ayat (1), (2)</strong>, with items <strong>a., b.</strong> (ending with a semicolon) and numbers <strong>1., 2.</strong></div>
 </div>

 <div class="article-list">${d.articles.map((a,i)=>`<article id="article-${i}" class="article-card ${warn.has(a.number)?'warn':''}"><div class="article-top"><div class="article-number">Pasal <input data-number="${i}" value="${E(a.number)}" aria-label="Article number ${i+1}"></div><div class="actions">${warn.has(a.number)?'<span class="tag medium">Needs review</span>':''}<button class="text-button" data-action="remove" data-index="${i}" ${d.drafting?.form==='amendment'?'disabled':''}>Remove article</button></div></div>${a.chapter?`<label for="chapter-${i}" class="micro">Chapter / part (Bab / Bagian)</label><textarea id="chapter-${i}" data-chapter="${i}" rows="2" class="article-chapter">${E(a.chapter)}</textarea>`:''}<textarea data-article="${i}" aria-label="Article ${E(a.number)} text">${E(a.text)}</textarea></article>`).join('')}<div class="actions">${btn('Add article','add',d.drafting?.form==='amendment'?'disabled':'')}${btn('Save document','save','',true)}</div></div>
 <details class="document-format-fields"><summary>Identity, closing, elucidation & annexes</summary><label for="document-heading">Full document title</label><textarea id="document-heading" rows="5">${E(d.document_heading||'')}</textarea><label for="draft-closing">Enactment & promulgation</label><textarea id="draft-closing" rows="8">${E(d.closing||'')}</textarea><label for="draft-explanation">Elucidation / Penjelasan (optional)</label><textarea id="draft-explanation" rows="4">${E(d.explanation||'')}</textarea><label for="draft-attachments">Annexes / Lampiran (optional)</label><textarea id="draft-attachments" rows="4">${E(d.attachments||'')}</textarea><p class="micro">Placeholders must be completed. Identity and legal basis need updating if the regulation type changes.</p></details><div class="scope-fields"><div><label for="scope">Scope & drafting notes</label><input id="scope" value="${E(d.scope)}"></div></div></section>
 ${studioPanel({state:S,analysis:r,simulation:last('simulation'),alternative:S.alt||defaultAlt(),escape:E,button:btn,source,legalValidation,socialPanel:()=>socialShell(true,S.socialConfig),agentPanel:()=>agentPanel(S,E,btn)})}</div>`;
}
function analysis(){const r=last('analysis'),p=r?.payload;return head('SOURCE-BASED REVIEW','Conflict check','Review the hierarchy, source quotes and alternative interpretations for each finding.',btn('Re-check ✧','analyze','',true)+btn('DOCX Report ↗','report',r?'':'disabled'))+steps(1)+`<div class="note analysis-settings"><label for="legal-date">Analysis as of</label> <input id="legal-date" type="date" value="${E(S.asOf)}" style="width:170px;display:inline-block"> <span class="micro">Source versions & status are checked against this date.</span></div>`+demoNote()+(!r?`<section class="panel empty"><h2>Start with one check.</h2><p>Retrieve related sources and review each finding with its alternative interpretations.</p>${btn('Check draft','analyze','',true)}</section>`:`${stale(r)?`<div class="note">Draft changed to v${S.draft.revision}. This result is from v${r.revision}. Re-check before applying proposals.</div>`:''}<div class="metrics">${[['POTENTIAL ISSUES',p.findings.length,'Needs review, not a verdict'],['SOURCES REVIEWED',p.coverage.retrieved_articles,'Articles and related context'],['DRAFT VERSION',r.revision,stale(r)?'Older result':'Matches draft']].map(([k,v,t])=>`<div class="metric"><small>${k}</small><div class="value">${v}</div><small>${t}</small></div>`).join('')}</div><p class="help-text">${E(p.summary)}</p>${p.legal_context?`<div class="note">Guidelines ${E(p.legal_context.rulebook_version)} · Date ${E(p.legal_context.as_of_date)} · ${p.legal_context.pending_changes.length} related amendment candidates, not yet applied. ${E(p.legal_context.notice)}</div>`:""}${findingFilters(p)}${p.findings.length?p.findings.map((f,i)=>({f,i})).filter(({f})=>S.findingFilter==='all'||f.severity===S.findingFilter).map(({f,i})=>`<article class="finding"><div class="finding-head"><span class="tag ${f.severity}">${E(label(f.severity))}</span><h2>${E(f.title)}</h2><span class="pill">Pasal ${E(f.article_number)}</span></div><div class="finding-body"><p>${E(f.reasoning)}</p><div class="two-cols"><div><div class="quote-label">DRAFT · V${r.revision}</div><div class="quote">${E(f.original_text)}</div></div><div><div class="quote-label">PROPOSED FOR REVIEW</div><div class="quote">${E(f.proposed_text)}</div></div></div>${f.evidence.map(source).join('')}${legalValidation(f)}<details style="margin-top:15px"><summary>Alternative interpretation & review questions</summary><p style="margin-top:10px">${E(f.counterargument)}</p>${limitations(f.review_questions)}</details><div class="finding-bottom" data-category="${E(f.category)}"><span class="micro">${E(label(f.category))} · Needs expert review</span>${btn('Apply proposal to draft','apply',`data-index="${i}" ${stale(r)?'disabled':''}`,true)}</div></div></article>`).join(''):'<div class="note green">No problem patterns detected. This does not prove the draft is conflict-free.</div>'}<section class="panel"><div class="panel-body"><h3>Review limitations</h3>${limitations(p.limitations)}<div class="actions">${btn('Reviewer notes','review',`data-run="${r.id}"`)}${btn('Continue to simulation →','go-sim','',true)}<span class="micro">${E(label(r.review_status))}</span></div>${r.review_notes?`<p class="help-text">${E(r.review_notes)}</p>`:''}</div></section>`);}
function draftText(){return S.draft.articles.map(a=>'Pasal '+a.number+'\n'+a.text).join('\n\n');}
function defaultAlt(){return S.draft.articles.map(a=>'Pasal '+a.number+'\n'+(a.number==='2'?'(1) Permohonan dapat diajukan melalui aplikasi digital atau kanal pendampingan.\n(2) Penyelenggara menyediakan bantuan dan akomodasi yang layak bagi pemohon yang mengalami hambatan akses.':a.text)).join('\n\n');}
function simulation(){
  const r=last('simulation'),p=r?.payload,ass=S.simAss||p?.assumptions||defaultAssumptions;
  if(!S.alt)S.alt=defaultAlt();
  if(!S.simSection)S.simSection='projection';
  const personas = S.draft?.personas || S.status?.social_personas || [
    {id:'sari_desa',name:'Sari',role:'Rural resident (remote area)',background:'Rural resident without stable internet',goal:'Needs a physical or offline assistance channel'},
    {id:'nadia_disabilitas',name:'Nadia',role:'Blind citizen',background:'Blind person with a visual disability',goal:'Ensure the app works with screen readers and offers assistance'},
    {id:'bima_loket',name:'Bima',role:'Counter officer',background:'One-stop service counter officer',goal:'Realistic workload capacity without queue overload'},
    {id:'raka_umkm',name:'Raka',role:'MSME operator',background:'Informal MSME operator',goal:'Fast application process without complicated requirements'},
    {id:'dewi_anggaran',name:'Dewi',role:'Budget officer',background:'Regional/agency budget officer',goal:'Fiscal efficiency and well-targeted assistance'}
  ];

  const subNav=`<div class="sim-unified-nav" role="tablist" aria-label="Simulation and public forum navigation">
    <button type="button" class="sim-unified-tab ${S.simSection==='projection'?'active':''}" data-action="sim-section" data-section="projection" id="sim-tab-projection" role="tab" aria-controls="simulation-content" tabindex="${S.simSection==='projection'?'0':'-1'}" aria-selected="${S.simSection==='projection'}">
      <span class="tab-icon">${icon('chart', 16)}</span>
      <span>A/B Scenario Projection</span>
      <span class="tab-badge">Quantitative</span>
    </button>
    <button type="button" class="sim-unified-tab ${S.simSection==='social'?'active':''}" data-action="sim-section" data-section="social" id="sim-tab-social" role="tab" aria-controls="simulation-content" tabindex="${S.simSection==='social'?'0':'-1'}" aria-selected="${S.simSection==='social'}">
      <span class="tab-icon">${icon('network', 16)}</span>
      <span>AI Persona Public Forum</span>
      <span class="tab-badge">Qualitative</span>
    </button>
    <button type="button" class="sim-unified-tab ${S.simSection==='unified'?'active':''}" data-action="sim-section" data-section="unified" id="sim-tab-unified" role="tab" aria-controls="simulation-content" tabindex="${S.simSection==='unified'?'0':'-1'}" aria-selected="${S.simSection==='unified'}">
      <span class="tab-icon">${icon('shield', 16)}</span>
      <span>Unified Review</span>
      <span class="tab-badge">Synthesis</span>
    </button>
  </div>`;

  let body='';
  if(S.simSection==='social'){
    body=`<div class="social-context-banner">
      <div class="context-banner-left">
        <span class="context-tag">ACTIVE SCENARIO CONTEXT</span>
        <h3>Citizen acceptance test: Draft A vs Alternative B</h3>
        <p>${p?'Access projection on snapshot v'+r.revision+': <strong>'+p.A.access_pct+'% → '+p.B.access_pct+'%</strong>.':'No projection yet. Run the A/B simulation to compare access and cost.'} Personas review the draft text and alternative B.</p>
      </div>
      <div class="context-banner-right">
        <div class="context-metric"><small>ACCESS A</small><strong>${p?p.A.access_pct+'%':'None yet'}</strong></div>
        <div class="context-arrow">→</div>
        <div class="context-metric highlight"><small>ACCESS B</small><strong>${p?p.B.access_pct+'%':'None yet'}</strong></div>
        <button type="button" class="btn-context-sim" data-action="sim-section" data-section="projection">${icon('chart',14)} Edit assumptions</button>
      </div>
    </div>
    ${socialShell(false,S.socialConfig)}
    <details class="panel social-data" style="margin-top:16px"><summary>Review draft B & assumption parameters</summary><label for="alternative">Alternative B</label><textarea id="alternative" rows="6">${E(S.alt)}</textarea>${assumptionInputs(ass)}<p class="micro">A uses the saved draft. B uses the alternative above. Personas evaluate these articles.</p></details>`;
  } else if(S.simSection==='unified'){
    const socialRun=last('social'),sp=socialRun?.payload;
    const socialPersonas=sp?.personas||personas;
    const latestOpinions=Object.fromEntries((sp?.scenarios?.B?.comments||[]).map(c=>[c.persona_id,c]));
    const signed=n=>(n>0?'+':'')+fmt(n);
    body=`<div class="unified-synthesis-layout">
      <div class="synthesis-header-grid">
        <section class="synthesis-card quant-card">
          <div class="card-eyebrow">ACCESS & COST</div><h2>Impact projection</h2>
          ${p?`<span class="pill ${stale(r)?'amber':'green'}">Snapshot v${r.revision}${stale(r)?' · Older result':''}</span>
          <div class="synthesis-stats">
            <div class="stat-box"><span class="label">Access change</span><strong>${signed(p.delta.access_points)} pts</strong><small>${p.A.access_pct}% → ${p.B.access_pct}%</small></div>
            <div class="stat-box"><span class="label">Applicants served</span><strong>${signed(p.delta.served)}</strong><small>From ${fmt(p.assumptions.population)} applicants</small></div>
            <div class="stat-box"><span class="label">Cost change</span><strong>${rup(p.delta.cost)}</strong><small>Variable cost in the model</small></div>
          </div><p class="card-desc">Results follow the assumptions and text at the time the simulation ran.</p>`:
          `<div class="sim-result-empty">${icon('chart',28)}<h3>Compare before concluding</h3><p>Prepare assumptions and run the A/B simulation. Access and cost changes will appear here.</p>${btn('Prepare scenario','sim-section','data-section="projection"',true)}</div>`}
          ${p?btn('Review assumptions & sensitivity','sim-section','data-section="projection"'):''}
        </section>
        <section class="synthesis-card qual-card">
          <div class="card-eyebrow">SYNTHETIC PERSONA REACTIONS</div><h2>Voices from the AI forum</h2>
          ${sp?`<span class="pill ${stale(socialRun)?'amber':'green'}">Snapshot v${socialRun.revision}${stale(socialRun)?' · Older result':''}</span><div class="synthesis-persona-summary">${socialPersonas.map(pers=>{
            const op=latestOpinions[pers.id];
            return `<div class="persona-row"><span class="avatar">${E(pers.name.slice(0,2).toUpperCase())}</span><div class="p-info"><strong>${E(pers.name)} · ${E(pers.role||pers.background||'')}</strong><span class="tag">${op?E({support:'Support',concern:'Concern',conditional:'Conditional',uncertain:'Undecided'}[op.stance]||op.stance):'No opinions yet'}</span></div><p>${E(op?.comment||'No responses recorded for this persona yet.')}</p></div>`;
          }).join('')}</div>`:
          `<div class="sim-result-empty">${icon('network',28)}<h3>No opinions collected yet</h3><p>Run the forum to see persona responses, reasoning and mitigation proposals for texts A/B.</p>${btn('Open public forum','sim-section','data-section="social"',true)}</div>`}
          ${sp?btn('Explore discussion & replies','sim-section','data-section="social"'):''}
        </section>
      </div>
      ${p?`<section class="policy-matrix-card"><div class="matrix-head"><div class="matrix-title"><span class="matrix-badge">FOLLOW-UP</span><h3>Review mitigations before applying</h3></div><div class="matrix-actions">${btn('Review alternative B','apply-alt',stale(r)?'disabled':'',true)}${btn('Reviewer notes','review',`data-run="${r.id}"`)}</div></div><div class="matrix-grid">${p.stakeholders.map(st=>`<div class="matrix-col"><h4>${E(st.stakeholder)}</h4><ul>${st.mitigations.map(m=>`<li>${E(m)}</li>`).join('')}</ul></div>`).join('')}</div><p class="micro">Projections and synthetic opinions support review; they do not replace public consultation.</p></section>`:''}
    </div>`;
  } else {
    // projection tab
    body=`${r&&stale(r)?'<div class="note">This result is from an older version. Run the simulation again.</div>':''}<div class="sim-layout"><section class="panel assumptions"><div class="panel-head"><h2>Scenario assumptions</h2><span class="tag">User input</span></div><div class="panel-body">${assumptionInputs(ass)}<p class="help-text">Starting numbers are example assumptions. Replace them with field data for policy evaluation.</p></div></section><div><section class="panel"><div class="panel-head"><h2>Alternative B · Comparison draft</h2>${btn('Copy current draft','copy')}</div><div class="panel-body"><textarea id="alternative" rows="9" aria-label="Alternative B text">${E(S.alt)}</textarea><p class="micro">Alternative A uses the saved draft. B can be edited before the simulation.</p></div></section>${!p?`<section class="panel empty" style="margin-top:18px"><h2>Understand the options and their impact.</h2><p>Compute access and cost from assumptions, then review stakeholder perspectives and citizen reactions.</p>${btn('Compare scenarios','simulate','',true)}</section>`:`<div class="scenario-grid" style="margin-top:18px">${['A','B'].map(k=>`<section class="scenario ${k==='B'?'b':''}"><div class="eyebrow">ALTERNATIVE ${k}</div><h3>${k==='A'?'Draft at simulation time':'Comparison text'}</h3><div class="number">${p[k].access_pct}%</div><div class="micro">Access in the assumption model</div><div class="bar"><span style="width:${p[k].access_pct}%"></span></div><dl>${[['Applicants served',fmt(p[k].served)],['Not served',fmt(p[k].unserved)],['Variable cost',rup(p[k].cost)],['Staff workdays',fmt(p[k].staff_days)],['Assistance channel detected',p.assistance_detection[k]?'Yes':'No']].map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl></section>`).join('')}</div><div class="delta-banner"><div><b>${p.delta.served>=0?'+':''}${fmt(p.delta.served)}</b><small>APPLICANTS SERVED</small></div><div><b>${p.delta.access_points} pts</b><small>ACCESS CHANGE</small></div><div><b>${rup(p.delta.cost)}</b><small>COST CHANGE</small></div></div><div class="netizen-bridge-card"><div class="bridge-header"><div class="bridge-title-group"><span class="bridge-icon">${icon('network',18)}</span><div><h3>AI citizen & stakeholder persona acceptance test (${personas.length} agents)</h3><p>How do citizens, business owners, workers/fishers, and officials respond to Alternative B?</p></div></div><button type="button" class="btn-bridge-nav" data-action="sim-section" data-section="social"><span>Open the interactive public forum</span><span class="arrow">→</span></button></div><div class="bridge-persona-grid">${personas.map(pers=>`<div class="bridge-persona-item"><div class="bridge-persona-avatar">${E(pers.name.slice(0,2).toUpperCase())}</div><div class="bridge-persona-info"><strong>${E(pers.name)}</strong><span class="bridge-role">${E(pers.role||'')}</span><span class="bridge-bg">${E(pers.background)}</span><span class="bridge-goal">${E(pers.goal||'')}</span></div></div>`).join('')}</div></div><div class="persona-grid">${p.stakeholders.map(s=>`<section class="persona"><h3>${E(s.stakeholder)}</h3>${[['BENEFITS',s.benefits],['RISKS',s.risks],['MITIGATIONS',s.mitigations]].map(([k,v])=>`<strong>${k}</strong><ul>${v.map(x=>`<li>${E(x)}</li>`).join('')}</ul>`).join('')}<details><summary>Validation & sources</summary>${limitations(s.questions_to_validate)}${p.evidence.filter(a=>s.evidence_ids.includes(a.id)).map(source).join('')}</details></section>`).join('')}</div><section class="panel"><div class="panel-head"><h2>Digital access sensitivity</h2><span class="micro">Assumption ±10 points</span></div><table><thead><tr><th>Digital access input</th><th>Access A</th><th>Access B</th></tr></thead><tbody>${p.sensitivity.map(x=>`<tr><td>${x.digital_access_pct}%</td><td>${x.A}%</td><td>${x.B}%</td></tr>`).join('')}</tbody></table><div class="panel-body"><p class="inline-code">${E(p.A.formula)}</p>${limitations(p.limitations)}<div class="actions">${btn('Review & apply alternative B','apply-alt',stale(r)?'disabled':'',true)}${btn('Reviewer notes','review',`data-run="${r.id}"`)}</div></div></section>`}</div></div>`;
  }

  return head('POLICY LAB & PUBLIC TESTING','Impact & public simulation','Compare A/B quantitative projections and AI persona reactions side by side.',btn('Run simulation ◎','simulate','',!p)+`<button class="btn" data-action="start-agent" data-intent="social">${icon('network')}Collect public opinions</button>`+(p?btn('Review & apply B','apply-alt',stale(r)?'disabled':'',true):''))+steps(2)+subNav+demoNote()+`<div id="simulation-content" role="tabpanel" aria-labelledby="sim-tab-${S.simSection}">${body}</div>`;
}
function library(){
 const passages=S.libraryTab==='passages';
 const tabs=`<div class="library-tabs" role="tablist" aria-label="Explore the legal library">${[['documents','Document collection','book'],['passages','Search articles','search']].map(([key,title,glyph])=>`<button class="library-tab" id="library-tab-${key}" data-action="library-tab" data-tab="${key}" role="tab" aria-controls="library-content" aria-selected="${S.libraryTab===key}" tabindex="${S.libraryTab===key?'0':'-1'}">${icon(glyph,17)}${title}</button>`).join('')}</div>`;
 return head('UNIFIED LEGAL SOURCES','Legal library','Find documents, search article text, and understand it with the assistant.',btn('Compare articles','compare')+'<a class="btn" href="/guide" target="_blank" rel="noopener">'+icon('help')+'Guide</a>')+tabs+`<div id="library-content" role="tabpanel" aria-labelledby="library-tab-${S.libraryTab}">${passages?passageLibrary():galleryPage(S,E,icon,{embedded:true})}</div>`;
}
function passageLibrary(){
 const results=S.results;
 return `${corpusOverview()}<div class="note demo-note"><span class="tag">Snapshot</span><span>Original texts and amendments are stored separately. Check quotes and version status before drawing conclusions.</span></div><section class="panel library-search-panel"><div class="panel-head"><div><h2>Search within articles</h2><p>Keywords are searched across the entire source collection.</p></div></div><div class="panel-body"><form id="search-form" class="searchbar"><div class="search-field">${icon('search')}<input id="search-q" type="search" minlength="2" maxlength="500" required value="${E(S.searchQuery)}" aria-label="Search articles" placeholder="For example: pengaduan, aksesibilitas or biaya layanan…"></div><button type="submit" class="btn primary">Search articles</button>${results!==null?btn('Reset','reset'):''}</form><div class="library-search-suggestions"><span>Try a topic</span>${['pengaduan','aksesibilitas','biaya layanan'].map(query=>`<button class="library-topic" data-action="library-search" data-query="${E(query)}">${icon('tag',13)}${E(query)}</button>`).join('')}</div></div></section>${results===null?`<section class="panel empty visual-empty">${menuArtwork('library',true)}<h2>Start from what you want to understand.</h2><p>Search a phrase to find article quotes, then open the document context or ask the assistant.</p></section>`:`<p class="library-result-count" role="status">${results.length} results for “${E(S.searchResultQuery)}”</p>${results.length?results.map(a=>`<article class="library-passage-result">${source(a)}<div class="actions"><button class="btn" data-action="library-read-source" data-result="${E(a.id)}">${icon('book')}Read in document</button><button class="btn" data-action="library-ask-source" data-result="${E(a.id)}">${icon('message')}Ask about this article</button></div></article>`).join(''):`<section class="panel empty"><h2>No matching article found yet.</h2><p>Try a shorter phrase or a related topic.</p></section>`}`}`;
}
function history(){const rows=S.runs.filter(r=>S.historyFilter==='all'||r.kind===S.historyFilter);return head('TRACEABLE DECISIONS','Activity','Trace document versions, analysis results and reviewer decision notes.',btn('View draft versions','versions'))+`${historyOverview()}<section class="panel history-timeline"><div class="panel-head"><h2>Analysis & simulation</h2><span class="pill">Draft v${S.draft.revision}</span></div>${rows.length?rows.map(r=>`<div class="history-row"><span class="timeline-dot" aria-hidden="true">${icon(r.kind==='analysis'?'shield':r.kind==='social'?'network':'chart')}</span><div><h3>${r.kind==='analysis'?'Conflict check':r.kind==='social'?'Synthetic public forum':'Impact simulation'} · v${r.revision}</h3><div class="micro">${new Date(r.created_at).toLocaleString('id-ID')} · ${E(r.payload.provider.mode)} · ${E(label(r.review_status))}</div><p class="help-text">${E(r.review_notes)}</p></div><div class="actions"><span class="pill ${stale(r)?'amber':'green'}">${stale(r)?'Draft changed':'Version matches'}</span>${btn('View results','run-detail',`data-run="${r.id}"`)}${btn('Review','review',`data-run="${r.id}"`)}</div></div>`).join(''):`<div class="empty"><h3>The decision trail starts with a single check.</h3><p>Analysis and simulation results will be recorded here along with reviewer notes.</p>${btn('Open Policy Studio','back-editor')}${btn('Run agent team','activity-agents')}</div>`}</section>`;}
function modal(title,body,footer=''){
  $('#modal').classList.remove('builder-modal');
  $('#modal').setAttribute('aria-labelledby','modal-title');
  const foot = footer || `<button type="button" class="btn" data-action="close">Close</button>`;
  $('#modal-content').innerHTML = `
    <div class="modal-head">
      <h2 id="modal-title">${E(title)}</h2>
      <button type="button" class="btn modal-close-btn" data-action="close" aria-label="Close">✕</button>
    </div>
    <div class="modal-body-scroll">
      ${body}
    </div>
    <div class="modal-foot">
      ${foot}
    </div>`;
  enhanceVisualSurface($('#modal-content'),S);
  if(!$('#modal').open)$('#modal').showModal();
}
const close=()=>$('#modal').close();
function tokenModal(){modal('Workspace access','<label for="token">Server token</label><input id="token" type="password" autocomplete="off">',btn('Enter','token','',true));}
async function settings(){
 const readiness=await api('/readiness');
 const isAdmin=S.status.principal?.role==='admin';
 const latest=readiness.last_probe;
 modal('Integration settings',`<div class="integration-summary"><div><span class="micro">PROVIDER</span><h3>${E(readiness.provider==='vertex'?'Gemini via Vertex AI':readiness.provider==='gemini'?'Gemini API':'Local demo')}</h3><p>${E(readiness.model||'Template without LLM')}</p></div><span class="pill ${latest?.ready?'green':'amber'}">${latest?latest.ready?latest.live?'Test passed':'Demo ready':'Test failed':readiness.provider==='demo'?'Demo mode':'Not tested live'}</span></div>
 <div class="integration-checks">${readiness.checks.map(check=>`<div><span class="check-state ${E(check.status)}">${check.status==='passed'?'✓':check.status==='failed'?'!':'·'}</span><div><b>${E(check.label)}</b><p>${E(check.detail)}</p></div></div>`).join('')}</div>
 ${latest?`<div class="note ${latest.ready?'green':''}">${E(latest.detail)}<br><span class="micro">Checked ${new Date(latest.checked_at).toLocaleString('id-ID')}${latest.live?' · Live provider':''}</span></div>`:''}
 <div class="integration-setup"><h3>Connect local service account</h3><p>Use the SA JSON file on your computer. The project is read automatically; the key is never sent to the browser.</p><div class="inline-code">./start.sh --sa "/path/to/service-account.json"</div><p class="micro">Windows: start.bat "C:/path/to/service-account.json". After changing configuration, restart the server.</p></div>
 <details class="source-details"><summary>Advanced configuration</summary><p class="micro">Project ${E(readiness.project||'Not set')} · Model ${E(readiness.model||'Demo')} · Location ${E(readiness.location)} · Retrieval ${E(readiness.search_backend)}.</p><p class="micro">Embeddings use ${E(readiness.embedding_location)} when Elasticsearch is active. Change the model, location or search backend in .env.</p><label for="token">Workspace access token (optional)</label><input id="token" type="password" autocomplete="off"><p class="micro">The workspace token is different from a Google key. Only needed when the server enables restricted access.</p>${btn('Save token','token')}</details>
 <p class="micro integration-notice">The connection test sends one model request. If Elasticsearch is active, an embedding query is also sent. Usage follows the project quota and billing.</p>`,btn('Refresh status','open-settings')+btn(readiness.provider==='demo'?'Check demo mode':'Test Gemini connection','probe-ai',isAdmin?'':'disabled',true)+btn('Close','close'));
}
function collect(){if(S.view!=='editor')return;Object.assign(S.draft,{title:$('#draft-title').value,regulation_type:$('#reg-type').value,scope:$('#scope').value,preamble:$('#preamble').value,document_heading:$('#document-heading')?.value||S.draft.document_heading||'',closing:$('#draft-closing')?.value||S.draft.closing||'',explanation:$('#draft-explanation')?.value||S.draft.explanation||'',attachments:$('#draft-attachments')?.value||S.draft.attachments||'',articles:S.draft.articles.map((a,i)=>({number:$(`[data-number="${i}"]`).value,text:$(`[data-article="${i}"]`).value,chapter:$(`[data-chapter="${i}"]`)?.value||a.chapter||''}))});}
async function save(){collect();if(!S.dirty)return;S.draft=await api('/drafts/'+S.draft.id,'PUT',{...S.draft,expected_revision:S.draft.revision});S.dirty=false;const status=$('#save-state');if(status){status.textContent='Saved · v'+S.draft.revision;status.classList.remove('dirty');}S.drafts=await api('/drafts');}
async function refresh(){S.drafts=await api('/drafts');S.jobs=await api('/drafts/'+S.draft.id+'/agent-jobs');S.runs=await api('/drafts/'+S.draft.id+'/runs');}
function routeURL(){
 const params=new URLSearchParams({view:workflowViews.includes(S.view)?'studio':activityViews.includes(S.view)?'activity':S.view});
 if(workflowViews.includes(S.view))params.set('stage',S.view);
 if(activityViews.includes(S.view))params.set('tab',activityTab(S.view));
 if(S.draft?.id)params.set('draft',S.draft.id);
 if(S.view==='simulation'&&S.simSection!=='projection')params.set('sub',S.simSection);
 if(S.view==='library'){if(S.libraryTab==='passages')params.set('tab','passages');if(S.gallery.doc){params.set('doc',S.gallery.doc.id);if(S.gallery.articleNumber)params.set('article',S.gallery.articleNumber);}}
 if(S.view==='data')for(const [key,value] of Object.entries(S.collectionFilters||{}))if(value)params.set(key,value);
 return '/workspace?'+params;
}
function syncRoute(){try{window.history?.replaceState?.(null,'',routeURL());}catch{}}
async function select(id){
 await save();
 // Commit selection only after every dependent resource has loaded.
 const [draft,runs,jobs]=await Promise.all([api('/drafts/'+id),api('/drafts/'+id+'/runs'),api('/drafts/'+id+'/agent-jobs')]);
 Object.assign(S,{draft,runs,jobs,alt:'',simAss:null,socialPreview:null,dirty:false,findingFilter:'all',historyFilter:'all'});
 render();watchAgents();
}
async function view(v,push=true){
 const previous=routeURL();await save();
 if(v==='studio')S.view=S.lastStudioView;
 else if(v==='activity')S.view=S.lastActivityView;
 else if(v==='social'){S.view='simulation';S.simSection='social';}
 else{S.view=canonicalView(v);if(v==='corpus')S.libraryTab='passages';if(v==='gallery')S.libraryTab='documents';}
 if(push&&previous!==routeURL())try{window.history?.pushState?.(null,'',routeURL());}catch{}
 render();window.scrollTo({top:0,behavior:'instant'});
}
window.addEventListener('popstate',async()=>{
 if(isBusy()){syncRoute();return;}
 const params=new URLSearchParams(location.search),destination=workflowRoute(params),draftId=params.get('draft');
 try{await withLoading('navigate',async()=>{
   await save();if(draftId&&draftId!==S.draft.id)await select(draftId);
   S.simSection=['projection','social','unified'].includes(params.get('sub'))?params.get('sub'):'projection';S.libraryTab=destination==='corpus'||params.get('tab')==='passages'?'passages':'documents';if(canonicalView(destination)==='library')await restoreLibraryDocument(params);await view(destination,false);
 });}catch(error){syncRoute();toast(error.message,true);displayError(error);}
});
async function download(path,name){const t=sessionStorage.getItem('rulelab_token');const r=await fetch('/api'+path,{headers:t?{Authorization:'Bearer '+t}:{}});if(!r.ok)throw Error('Download failed. Check the token and document.');const u=URL.createObjectURL(await r.blob()),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);}
async function compareSelectors(k){const d=await api('/corpus/'+$('#cmp-'+k).value);$('#art-'+k).innerHTML=d.articles.map(a=>`<option value="${E(a.number)}">Pasal ${E(a.number)}</option>`).join('');}
const actions={close,'open-settings':settings,'retry-init':()=>{disposePageComponents();$('#main').innerHTML=skeleton();return init();},'legal-guide':showLegalGuide,token:async()=>{sessionStorage.setItem('rulelab_token',$('#token').value);close();await init();},
'collection-refresh':()=>render(),
'collection-upload':async()=>{collectionData=collectionData||await api('/data/overview');modal('Upload regulation source',sourceFormHTML('upload',collectionData.provinces),btn('Cancel','close')+btn('Save to queue','collection-submit','',true));},
'collection-jdih':async()=>{collectionData=collectionData||await api('/data/overview');modal('Add JDIH link',sourceFormHTML('jdih',collectionData.provinces),btn('Cancel','close')+btn('Register link','collection-submit','',true));},
'collection-submit':async()=>{const result=await api('/data/intake','POST',await readSourceForm());close();render();toast(result.duplicate?'The same source is already in the queue.':'Source saved to the review queue.');},
'collection-draft':async()=>{await view('editor');actions.import();},
'collection-raw':async el=>{const item=await api('/data/intake/'+el.dataset.id);await download('/data/intake/'+el.dataset.id+'/raw',item.filename||'rulelab-source');},
new:async()=>{
 await save();S.catalog=S.catalog||await api('/drafting/templates');S.builderResult=null;
 modal('Guided draft',builderHTML(S.catalog,E),btn('Cancel','close')+btn('Preview document','preview-draft')+btn('Create draft','create','',true));
 $('#modal').classList.add('builder-modal');updateBuilderNote(S.catalog);
},
'preview-draft':async()=>{
 S.builderResult=await api('/drafting/preview','POST',readBuilder());
 $('#builder-preview-content').innerHTML=previewHTML(S.builderResult,E);$('#builder-preview-status').textContent='Matches input';
 $('#modal .modal-body-scroll').scrollTo({top:0,behavior:'instant'});
},
create:async()=>{
 const result=await api('/drafting/create','POST',readBuilder());
 close();S.drafts=await api('/drafts');await select(result.draft.id);S.view='editor';render();toast('Draft skeleton created. Fill in the placeholders and review the legal basis.');
},
'template-preamble':async()=>{
 collect();const result=await api('/drafting/preview','POST',{...(S.draft.drafting||{}),title:S.draft.title,regulation_type:S.draft.regulation_type});
 const d=result.draft;
 Object.assign(S.draft,{preamble:d.preamble,document_heading:d.document_heading,closing:d.closing,drafting:d.drafting,template_source_ids:d.template_source_ids});
 S.dirty=true;render();toast('Opening and closing updated. Article content still follows your text.');
},
generate:()=>modal('From brief to draft',`<p class="help-text">Describe the goal, target groups, scope and constraints.</p><label for="brief">Policy brief</label><textarea id="brief" rows="6" placeholder="Create a digital service that stays accessible to residents without internet…"></textarea><label for="generate-type">Regulation type</label><select id="generate-type">${Object.keys(REGULATION_NAMES).map(type=>`<option value="${type}" ${type==='PP'?'selected':''}>${type}</option>`).join('')}</select>${demoNote()}`,btn('Create draft ✧','run-generate','',true)),
'run-generate':async()=>{await save();toast('Retrieving context and composing the draft…');const r=await api('/generate','POST',{brief:$('#brief').value,regulation_type:$('#generate-type').value});close();S.drafts=await api('/drafts');await select(r.draft.id);S.view='editor';render();toast('Initial draft ready. Review it and complete its legal basis.');},
save:async()=>{await save();render();toast('Draft saved.');},add:()=>{collect();S.draft.articles.push({number:String(Math.max(0,...S.draft.articles.map(a=>parseInt(a.number)).filter(Number.isFinite))+1),text:''});S.dirty=true;render();},remove:el=>{if(S.draft.articles.length===1)throw Error('At least one article is required.');collect();S.draft.articles.splice(Number(el.dataset.index),1);S.dirty=true;render();},
analyze:async()=>{await save();toast('Checking the draft and retrieving related sources…');await api('/drafts/'+S.draft.id+'/analyze','POST',{as_of_date:$('#legal-date')?.value||S.asOf});await refresh();S.view='analysis';render();toast('Check complete. Review the sources and proposals.');},
apply:async el=>{if(S.dirty)throw Error('Draft changed. Re-check before applying a proposal.');S.draft=await api('/drafts/'+S.draft.id+'/apply-revision','POST',{run_id:last('analysis').id,finding_index:Number(el.dataset.index),expected_revision:S.draft.revision});await refresh();S.alt='';render();toast('Proposal applied as a new version. Re-check before the next revision.');},
'go-sim':()=>view('simulation'),copy:()=>{S.alt=draftText();$('#alternative').value=S.alt;},
simulate:async()=>{const assumptions=$('#ass-population')?readAssumptions():S.simAss||last('simulation')?.payload.assumptions||defaultAssumptions;const alternative=$('#alternative')?.value||S.alt||defaultAlt();if(alternative.trim().length<10)throw Error('Alternative B must be at least 10 characters before running the simulation.');await save();S.alt=alternative;S.simAss=assumptions;toast('Comparing scenarios and stakeholder perspectives…');await api('/drafts/'+S.draft.id+'/simulate','POST',{alternative_text:S.alt,assumptions});await refresh();render();toast('Simulation complete. Results depend on the assumptions.');},
'apply-alt':()=>{const r=last('simulation');if(S.dirty||stale(r))throw Error('Simulation is from an older version.');modal('Review alternative B',`<div class="note">The applied text is the simulated alternative B. Run a conflict check after the revision.</div><div class="quote" style="max-height:400px">${E(r.payload.alternative_text)}</div>`,btn('Cancel','close')+btn('Apply new version','confirm-alt','',true));},
'confirm-alt':async()=>{if(S.dirty||stale(last('simulation')))throw Error('Draft changed. Run the simulation again.');const text=last('simulation').payload.alternative_text,m=[...text.matchAll(/^[ \t]*Pasal[ \t]+(\d+[A-Z]?|I|II)[ \t]*$/gm)];if(!m.length)throw Error('Put headings Pasal 1, Pasal 2 on their own lines.');const articles=m.map((x,i)=>({number:x[1],chapter:S.draft.articles.find(a=>a.number===x[1])?.chapter||'',text:text.slice(x.index+x[0].length,i+1<m.length?m[i+1].index:text.length).trim()}));S.draft=await api('/drafts/'+S.draft.id,'PUT',{...S.draft,articles,expected_revision:S.draft.revision});close();S.dirty=false;await refresh();S.alt='';S.view='editor';render();toast('Alternative applied. Run the check again.');},
export:async()=>{await save();await download('/drafts/'+S.draft.id+'/export','rulelab-draft.docx');render();},report:async()=>{if(!last('analysis'))throw Error('Run a check first to create a report.');await download('/drafts/'+S.draft.id+'/export?format=report','rulelab-review.docx');},
law:async el=>{
  const d=await api('/corpus/'+el.dataset.id);
  modal(d.metadata.type+' '+d.metadata.number+'/'+d.metadata.year,
    `<div class="modal-law-doc-header">
       <div class="modal-law-badge"><span class="tag ${d.metadata.version_kind==='original'?'tag-original':'tag-amend'}">${E(d.metadata.version_kind==='original'?'Original text':d.metadata.version_kind)}</span></div>
       <h3 class="modal-law-title">${E(d.metadata.title)}</h3>
       <div class="note ${d.metadata.status_note?.includes('Perlu')?'amber':'green'}">${E(d.metadata.status_note)}</div>
       ${d.metadata.source_issues?limitations(d.metadata.source_issues):''}
       <p class="micro">Version ${E(d.version_id)} · SHA256 ${E(d.provenance.sha256)} · Retrieved ${new Date(d.provenance.retrieved_at).toLocaleDateString('id-ID')}</p>
     </div>
     <div class="modal-law-articles">
       <div class="modal-articles-header">
         <strong>Articles & provisions (${d.articles.length} Articles/Blocks)</strong>
         <span class="micro">Structured provisions from extraction</span>
       </div>
       <div class="modal-articles-list">
         ${d.articles.map(a=>`
           <details class="source-details modal-article-card" open>
             <summary>
               <span class="modal-article-num">Pasal ${E(a.number)}</span>
               <span class="modal-article-topics">${a.enrichment.topics.map(t=>`<span class="tag">${E(t)}</span>`).join(' ')}</span>
             </summary>
             <div class="quote legal-formatted-quote">${formatLegalArticleHTML(a.text,E)}</div>
             <p class="micro">${a.pages.length?'Page '+a.pages.join(', '):'HTML format'} · ${a.paragraphs.length} ayat/definitions detected</p>
           </details>
         `).join('')}
       </div>
     </div>`,
    btn('Close','close')
  );
},
'law-json':el=>download('/corpus/'+el.dataset.id+'/json',el.dataset.id+'.json'),raw:el=>download('/corpus/'+el.dataset.id+'/raw',S.corpus.find(d=>d.id===el.dataset.id).provenance.raw_file.split('/').at(-1)),reset:()=>{S.results=null;S.searchQuery='';S.searchResultQuery='';render();$('#search-q')?.focus();},
compare:async()=>{modal('Compare two articles',`<div class="note">Demo provides the source and hierarchy comparison. Gemini analyzes potential conflicts between the two selected articles.</div><div class="form-grid">${['left','right'].map(k=>`<div><label>Source ${k==='left'?'A':'B'}</label><select id="cmp-${k}" data-cmp="${k}">${S.corpus.map(d=>`<option value="${d.id}">${E(d.metadata.type)} ${d.metadata.number}/${d.metadata.year}</option>`).join('')}</select><label style="margin-top:10px">Pasal</label><select id="art-${k}"></select></div>`).join('')}</div><div id="compare-result"></div>`,btn('Compare','run-compare','',true));$('#cmp-left').value=S.gallery.doc?.id||'pp-96-2012';$('#cmp-right').value=S.corpus.find(d=>d.id!==$('#cmp-left').value&&(d.quality?.article_count||0)>0)?.id||$('#cmp-left').value;await Promise.all(['left','right'].map(compareSelectors));if(S.gallery.doc&&S.gallery.doc.articles.some(a=>a.number===S.gallery.articleNumber)){$('#art-left').value=S.gallery.articleNumber;$('#art-left').dispatchEvent(new Event('rulelab:sync'));}},
'run-compare':async()=>{const r=await api('/compare','POST',{left_id:$('#cmp-left').value,right_id:$('#cmp-right').value,left_article:$('#art-left').value,right_article:$('#art-right').value});$('#compare-result').innerHTML=`<div class="relation">${E(r.hierarchy_relation)}</div><div class="comparison">${[r.left,r.right].map(a=>`<div><h3>${E(a.regulation_label)} · Article ${E(a.number)}</h3><div class="quote">${E(a.text)}</div><a class="micro" href="${E(a.source.url)}" target="_blank" rel="noopener">Official source ↗</a></div>`).join('')}</div><p class="help-text">${E(r.summary)}</p>${r.findings.map(f=>`<div class="note"><b>${E(f.title)}</b><br>${E(f.reasoning)}<br>${E(f.counterargument)}</div>`).join('')}${limitations(r.limitations)}`;},
review:el=>modal('Reviewer notes',`<p class="help-text">Human review is recorded for follow-up, not as a determination of legal validity.</p><label for="review-status">Status</label><select id="review-status"><option value="needs_review" ${S.runs.find(r=>r.id===el.dataset.run)?.review_status==='needs_review'?'selected':''}>Still needs review</option><option value="reviewed_with_notes" ${S.runs.find(r=>r.id===el.dataset.run)?.review_status==='reviewed_with_notes'?'selected':''}>Reviewed with notes</option></select><label for="review-notes" style="margin-top:15px">Notes</label><textarea id="review-notes" rows="5" placeholder="Verified sources, interpretations and follow-up…">${E(S.runs.find(r=>r.id===el.dataset.run)?.review_notes||'')}</textarea>`,btn('Save notes','save-review',`data-run="${el.dataset.run}"`,true)),
'save-review':async el=>{await api('/runs/'+el.dataset.run+'/review','POST',{status:$('#review-status').value,notes:$('#review-notes').value});close();await refresh();render();toast('Review notes saved.');},
versions:async()=>{const rows=await api('/drafts/'+S.draft.id+'/history');modal('Draft version',rows.map(r=>`<details class="source-details"><summary>Version ${r.revision} · ${new Date(r.created_at).toLocaleString('id-ID')}</summary><h3>${E(r.payload.title)}</h3><div class="quote">${E(r.payload.articles.map(a=>'Pasal '+a.number+'\n'+a.text).join('\n\n'))}</div></details>`).join(''));},
import:()=>modal('Import draft','<p class="help-text">TXT, JSON DraftInput, DOCX or text PDF. The “Pasal 1” heading must be on its own line. Max 10MB. Scanned PDFs need OCR first.</p><input id="import-file" type="file" accept=".txt,.json,.docx,.pdf">',btn('Import','run-import','',true)),
'run-import':async()=>{await save();const f=$('#import-file').files[0];if(!f)throw Error('Choose a file.');if(f.size>10*1024*1024)throw Error('Maximum 10MB.');const b64=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(',')[1]);r.onerror=reject;r.readAsDataURL(f);});const d=await api('/import','POST',{filename:f.name,content_base64:b64});close();S.drafts=await api('/drafts');await select(d.id);S.view='editor';render();toast('Draft imported.');}
};
document.addEventListener('click',async e=>{
 const moreBtn=e.target.closest('[data-gallery-more]');
 if(moreBtn){e.preventDefault();e.stopPropagation();const card=moreBtn.closest('.gallery-card'),expanded=card?.classList.toggle('is-title-expanded');moreBtn.textContent=expanded?'See less':'See more';moreBtn.setAttribute('aria-expanded',expanded?'true':'false');return;}
 const el=e.target.closest('[data-action],button[data-view],a[data-view]');if(!el||el.disabled||isBusy())return;
 const kind=el.dataset.view?'navigate':el.dataset.action;
 try{el.disabled=true;await withLoading(kind,()=>el.dataset.view?view(el.dataset.view):actions[el.dataset.action]?.(el));}
 catch(err){toast(err.message,true);displayError(err);}
 finally{if(el.isConnected)el.disabled=false;agentControls();
  if(el.dataset.action==='library-tab')document.querySelector('#library-tab-'+S.libraryTab)?.focus({preventScroll:true});
  if(el.dataset.action==='library-ask-source')$('#gallery-question')?.focus({preventScroll:true});
  if(el.dataset.action==='library-read-source')$('#gallery-reader')?.focus({preventScroll:true});
  if(['library-search','reset'].includes(el.dataset.action))$('#search-q')?.focus({preventScroll:true});
  if(el.closest('.activity-tabs'))document.querySelector('#activity-tab-'+activityTab(S.view))?.focus({preventScroll:true});
  if(el.closest('.workflow-stage-nav'))document.querySelector('#workflow-stage-'+S.view)?.focus({preventScroll:true});
  if(['gallery-prompt','gallery-retry','gallery-clear'].includes(el.dataset.action))$('#gallery-question')?.focus();
  if(el.dataset.action==='studio-tab'||el.dataset.action==='open-studio')document.querySelector('#tab-'+S.studioTab)?.focus({preventScroll:true});
  if(el.dataset.action==='jump-article')document.querySelector('[data-article="'+el.dataset.index+'"]').focus({preventScroll:true});
 }
});
document.addEventListener('input',e=>{if(e.target.id.startsWith('ass-')){S.simAss={...(S.simAss||last('simulation')?.payload.assumptions||defaultAssumptions),[e.target.id.slice(4)]:Number(e.target.value)};}if(e.target.id==='search-q')S.searchQuery=e.target.value;if(e.target.id==='legal-date')S.asOf=e.target.value;if(e.target.id==='alternative'||e.target.id==='agent-alternative')S.alt=e.target.value;if(S.view==='editor'&&e.target.closest('#main')&&e.target.matches('#draft-title,#reg-type,#scope,#preamble,#document-heading,#draft-closing,#draft-explanation,#draft-attachments,[data-chapter],[data-number],[data-article]')){S.dirty=true;const stageStatus=$('#workflow-stage-editor small');if(stageStatus)stageStatus.textContent='Not saved';const x=$('#save-state');if(x){x.textContent='Not saved';x.classList.add('dirty');}const context=$('.context-saved');if(context){context.className='context-dirty';context.textContent='Not saved';}document.querySelectorAll('.studio-freshness,.studio-analysis-freshness').forEach(x=>x.textContent='Draft changed · run again');document.querySelectorAll('.studio-panel [data-action=apply],.studio-panel [data-action=apply-alt]').forEach(x=>x.disabled=true);}});
document.addEventListener('change',async e=>{if(isBusy())return;try{
 if(e.target.id==='draft-select')await withLoading('navigate',()=>select(e.target.value));
 if(e.target.dataset.cmp)await withLoading('navigate',()=>compareSelectors(e.target.dataset.cmp));
 if(e.target.id==='reg-type')S.dirty=true;
 if(e.target.id==='agent-intent')S.agentIntent=e.target.value;
 if(e.target.closest('.draft-builder')){S.builderResult=null;$('#builder-preview-status').textContent='Input changed · preview again';updateBuilderNote(S.catalog);}
 if(['social-persona-count','social-round-count','social-crowd-size'].includes(e.target.id)){collect();S.socialConfig={persona_count:Number($('#social-persona-count').value),rounds:Number($('#social-round-count').value),crowd_size:Number($('#social-crowd-size').value)};await withLoading('social-config',async()=>{S.socialPreview=(await api('/social/personas?draft_id='+S.draft.id+'&count='+S.socialConfig.persona_count)).personas;render();});}
}catch(err){if(e.target.id==='draft-select'){e.target.value=S.draft.id;e.target.dispatchEvent(new Event('rulelab:sync'));}toast(err.message,true);displayError(err);}});
 document.addEventListener('submit',async e=>{if(e.target.id!=='search-form')return;e.preventDefault();if(isBusy())return;const q=$('#search-q').value.trim();S.searchQuery=q;
 try{await withLoading('search',async()=>{S.results=(await api('/search?q='+encodeURIComponent(q))).results;S.searchResultQuery=q;render();$('#search-q').value=q;});$('#search-q')?.focus({preventScroll:true});$('.library-result-count')?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
 catch(err){toast(err.message,true);}});

$('#settings-btn').addEventListener('click',async()=>{if(isBusy())return;try{await withLoading('open-settings',settings);}catch(err){toast(err.message,true);}});$('#progress-modal').addEventListener('cancel',e=>e.preventDefault());window.addEventListener('beforeunload',e=>{if(S.dirty){e.preventDefault();e.returnValue='';}});
async function init(){try{[S.status,S.drafts,S.corpus,S.catalog]=await Promise.all([api('/status'),api('/drafts'),api('/corpus'),api('/drafting/templates')]);if(!S.drafts.length)throw Error('No initial draft yet.');S.draft=S.drafts.find(d=>d.id===_urlP.get('draft'))||S.drafts[0];S.runs=await api('/drafts/'+S.draft.id+'/runs');S.jobs=await api('/drafts/'+S.draft.id+'/agent-jobs');watchAgents();$('#provider-pill').textContent=S.status.provider==='demo'?'Demo mode · no LLM':'Gemini · '+S.status.provider;$('#provider-pill').className='pill '+(S.status.provider==='demo'?'amber':'green');$('#corpus-pill').textContent=S.status.regulations+' regulations · '+S.status.articles+' articles/blocks';if(S.view==='library')await restoreLibraryDocument(_urlP);render();}catch(err){disposePageComponents();$('#main').innerHTML=`<div class="error-state"><h2>Workspace could not be loaded</h2><p>${E(err.message)}</p><p>Check the server and configuration, then try again.</p>${btn('Try again','retry-init')}${btn('Settings','open-settings')}</div>`;toast(err.message,true);}}
initializeWorkspaceUX();initializeSelects();if(!names[S.view])S.view='home';$('#main').innerHTML=skeleton();withLoading('init',init);

function legalValidation(f){const v=f.validation;if(!v)return '';return `<details style="margin-top:14px"><summary>Legal validation · ${E(label(v.verdict))}</summary><p class="micro">${v.source_quotes_checked} verified quotes · ${E((f.legal_rule_ids||[]).join(', '))}</p>${Object.entries(v.checks||{}).map(([k,x])=>`<p><b>${E(label(k))}</b>: ${E(x)}</p>`).join('')}${limitations(v.warnings||[])}</details>`;}
async function showLegalGuide(){const [g,c]=await Promise.all([api('/legal/guide'),api('/legal/changes')]);modal('Indonesian legal guidelines',`<div class="stack"><div class="note">${E(g.version)} · ${E(g.coverage_note)}</div><h3>Hierarchy under Article 7</h3><p>UUD 1945 → TAP MPR → UU / Perppu → PP → Perpres → Perda Provinsi → Perda Kabupaten/Kota</p><div class="note">Ministerial/agency regulation: review authority and delegation under Article 8.</div>${g.rules.map(r=>`<details class="source-details"><summary>${E(r.title)} <span class="tag">${E(label(r.classification))}</span></summary><p>${E(r.instruction)}</p>${r.source?`<p class="micro">${E(r.source.locator)} · Source version ${E(r.source.source_version)}</p><a href="${E(r.source.url)}" target="_blank" rel="noopener">Official source ↗</a>`:'<p class="micro">Application protocol; not a legal norm.</p>'}</details>`).join('')}<h3>${c.candidates.length} amendment instruction candidates</h3><p class="micro">Not reviewed and not applied automatically. The parser is still limited.</p>${c.candidates.map(x=>`<details class="source-details"><summary>${E(x.source_regulation_id)} · instruction ${E(x.instruction_number)} · ${E(x.operation)}</summary><div class="quote">${E(x.source_quote)}</div><p class="micro">Target: ${E(x.target_regulation_id)} · Article ${E(x.target_articles.join(', ')||'needs review')} · Page ${E(x.pages.join(', '))}</p></details>`).join('')}</div>`);}

function home(){return '<div id="framework-home"></div>';}
// Overview summary (per-draft stage, attention, activity); stale data stays visible while it refreshes.
let overviewRequest=0;
function loadOverview(){const ticket=++overviewRequest;api('/overview').then(data=>{if(ticket!==overviewRequest)return;S.overview=data;refreshFrameworkStatus(S);}).catch(()=>{if(ticket!==overviewRequest)return;if(S.overview===undefined)S.overview=null;refreshFrameworkStatus(S);});}
actions['open-draft-at']=async el=>{if(el.dataset.id!==S.draft.id)await select(el.dataset.id);await view(el.dataset.target||'editor');};
actions['export-draft']=async el=>{if(el.dataset.id!==S.draft.id)await select(el.dataset.id);await actions.export();};
actions['open-draft']=async el=>{await select(el.dataset.id);S.view='editor';render();};

actions['studio-tab']=el=>{collect();S.studioTab=el.dataset.tab;render();document.querySelector('#tab-'+S.studioTab)?.focus({preventScroll:true});};
actions['jump-article']=el=>{document.querySelector('#article-'+el.dataset.index)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'});document.querySelector('[data-article="'+el.dataset.index+'"]').focus({preventScroll:true});};
actions['analyze-inline']=async()=>{await save();await api('/drafts/'+S.draft.id+'/analyze','POST',{as_of_date:S.asOf});await refresh();S.studioTab='review';render();toast('Checks are available next to the draft.');};
document.addEventListener('keydown',e=>{if(!e.target.matches('.studio-tabs [role=tab],.sim-unified-nav [role=tab]')||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)||isBusy())return;e.preventDefault();const tabs=[...e.target.closest('[role=tablist]').querySelectorAll('[role=tab]')],i=tabs.indexOf(e.target),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].click();});

function filterBar(kind,options,current){return `<div class="filter-bar" aria-label="Filter ${E(kind)}">${options.map(([key,title,count])=>`<button data-action="filter-${kind}" data-filter="${E(key)}" aria-pressed="${current===key}">${E(title)}${count!==undefined?`<span>${count}</span>`:''}</button>`).join('')}</div>`;}
function findingFilters(p){return `<div class="section-toolbar"><div><h2>Findings to review</h2><p class="micro">Open the source quotes and interpretations before applying a proposal.</p></div>${filterBar('findings',[['all','All',p.findings.length],['high','High',p.findings.filter(f=>f.severity==='high').length],['medium','Medium',p.findings.filter(f=>f.severity==='medium').length],['low','Low',p.findings.filter(f=>f.severity==='low').length]],S.findingFilter)}</div>${S.findingFilter!=='all'&&!p.findings.some(f=>f.severity===S.findingFilter)?'<div class="filter-empty">No findings at this level. Choose All to see other findings.</div>':''}`;}
function corpusOverview(){return `<div class="gallery-overview library-source-overview"><div>${icon('book',20)}<span><strong>${S.status.regulations}</strong> official regulations</span></div><div>${icon('tree',20)}<span><strong>${S.status.articles}</strong> articles / blocks</span></div><div>${icon('scan',20)}<span><strong>${S.corpus.reduce((n,d)=>n+d.quality.ocr_needed_pages.length,0)}</strong> pages need OCR</span></div></div>`;}
function historyOverview(){return `${filterBar('history',[['all','All',S.runs.length],['analysis','Checks',S.runs.filter(r=>r.kind==='analysis').length],['simulation','Simulation',S.runs.filter(r=>r.kind==='simulation').length],['social','Public forum',S.runs.filter(r=>r.kind==='social').length]],S.historyFilter)}`;}
actions['filter-findings']=el=>{S.findingFilter=el.dataset.filter;render();};

actions['toggle-assistant']=()=>{S.gallery.chatFolded=!S.gallery.chatFolded;render();};
actions['library-tab']=el=>{
 const next=el.dataset.tab==='passages'?'passages':'documents';
 if(next===S.libraryTab)return;
 S.libraryTab=next;
 window.history.pushState(null,'',routeURL());render();
};
actions['library-doc-page']=el=>{
 S.gallery.page=Number(el.dataset.page);$('#gallery-card-results').innerHTML=galleryCards(S,E,icon);
 document.querySelector('.gallery-collection')?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
};
actions['library-search']=async el=>{
 const query=el.dataset.query;
 S.searchQuery=query;S.results=(await api('/search?q='+encodeURIComponent(query))).results;S.searchResultQuery=query;render();
};
actions['library-read-source']=el=>openLibrarySource(el.dataset.result);
actions['library-ask-source']=el=>openLibrarySource(el.dataset.result,true);

async function restoreLibraryDocument(params){
 const id=params.get('doc');
 if(!id||!S.corpus.some(doc=>doc.id===id)){S.gallery.doc=null;S.gallery.articleNumber=null;return;}
 const doc=S.gallery.doc?.id===id?S.gallery.doc:await api('/corpus/'+encodeURIComponent(id));
 S.gallery.doc=doc;S.gallery.articleNumber=doc.articles.find(article=>article.number===params.get('article'))?.number||doc.articles[0]?.number;S.gallery.scopeId=id;
}
async function openLibrarySource(resultId,ask=false){
 const result=S.results?.find(article=>article.id===resultId);
 if(!result)throw Error('Result unavailable. Run the search again.');
 const doc=await api('/corpus/'+encodeURIComponent(result.regulation_id));
 S.gallery.doc=doc;S.gallery.articleNumber=result.number;S.gallery.scopeId=doc.id;S.libraryTab='documents';
 if(ask){S.gallery.question=`Explain Article ${result.number} on ${result.regulation_label} in plain language.`;S.gallery.chatFolded=false;}
 window.history.pushState(null,'',routeURL());render();
 const target=document.querySelector(ask?'#gallery-question':'#gallery-reader');
 target?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
}
document.addEventListener('keydown',event=>{
 const tab=event.target.closest?.('.library-tab');
 if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||isBusy())return;
 event.preventDefault();
 const tabs=[...document.querySelectorAll('.library-tab')],index=tabs.indexOf(tab);
 const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
 tabs[next]?.click();
});
document.addEventListener('keydown',event=>{
 const stage=event.target.closest?.('.workflow-stage');
 if(!stage||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||isBusy())return;
 event.preventDefault();
 const tabs=[...document.querySelectorAll('.workflow-stage')],index=tabs.indexOf(stage);
 const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
 tabs[next]?.click();
});
document.addEventListener('rulelab:studio-route',async event=>{
 if(isBusy()||document.querySelector('dialog[open]'))return;
 const stage=event.detail?.stage;
 if(!workflowViews.includes(stage))return;
 try{
  await withLoading('navigate',async()=>{
   if(stage==='simulation')S.simSection=event.detail.sub==='social'?'social':'projection';
   await view(stage);
  });
  document.querySelector('#workflow-stage-'+S.view)?.focus({preventScroll:true});
 }catch(error){toast(error.message,true);displayError(error);}
});
actions['filter-history']=el=>{S.historyFilter=el.dataset.filter;render();};
actions['open-studio']=()=>{collect();S.studioTab='impact';render();document.querySelector('.studio-panel').scrollIntoView({behavior:'instant',block:'start'});document.querySelector('#tab-impact').focus({preventScroll:true});};
function renderSocialModalBody(r, p) {
  const payloadPersonas = Object.fromEntries((p.personas || []).map(x => [x.id, {
    name: x.name,
    role: x.role || 'Stakeholder',
    issue: x.issue || 'General',
    avatar: x.name.slice(0, 2).toUpperCase(),
    cls: 'persona-' + x.id
  }]));
  const defaultMap = {
    sari: { name: 'Sari', role: 'Rural resident', issue: 'Access & network', avatar: 'SA', cls: 'persona-sari' },
    nadia: { name: 'Nadia', role: 'Vulnerable groups', issue: 'Digital accessibility', avatar: 'NA', cls: 'persona-nadia' },
    bima: { name: 'Bima', role: 'Service officer', issue: 'Operational capacity', avatar: 'BI', cls: 'persona-bima' },
    raka: { name: 'Raka', role: 'MSME business owner', issue: 'Regulatory clarity', avatar: 'RA', cls: 'persona-raka' },
    dewi: { name: 'Dewi', role: 'Budget watchdog', issue: 'Cost efficiency', avatar: 'DE', cls: 'persona-dewi' }
  };
  const personas = { ...defaultMap, ...payloadPersonas };
  const stances = {
    concern: { label: 'Concern', icon: '⚠️', cls: 'stance-concern' },
    conditional: { label: 'Conditional', icon: '⚡', cls: 'stance-conditional' },
    support: { label: 'Support', icon: '✓', cls: 'stance-support' },
    uncertain: { label: 'Undecided', icon: '·', cls: 'stance-uncertain' }
  };

  const getStats = k => {
    const list = p.scenarios[k]?.comments || [];
    const conc = list.filter(c => c.stance === 'concern').length;
    const cond = list.filter(c => c.stance === 'conditional').length;
    const supp = list.filter(c => c.stance === 'support').length;
    return { conc, cond, supp, total: list.length };
  };

  const statsA = getStats('A');
  const statsB = getStats('B');

  const renderScenarioContent = (k, active) => {
    const comments = p.scenarios[k]?.comments || [];
    return `<div class="modal-scenario-content" data-scenario="${k}" style="display:${active ? 'block' : 'none'}">
      <div class="modal-scenario-toolbar">
        <div class="round-filters">
          <span class="filter-label">Round filter:</span>
          <button type="button" class="round-pill active" data-modal-round="all">All (${comments.length})</button>
          <button type="button" class="round-pill" data-modal-round="1">Round 1 · Initial reaction (${comments.filter(c => c.round === 1).length})</button>
          <button type="button" class="round-pill" data-modal-round="2">Round 2 · Response (${comments.filter(c => c.round === 2).length})</button>
          <button type="button" class="round-pill" data-modal-round="3">Round 3 · Reflection (${comments.filter(c => c.round === 3).length})</button>
        </div>
      </div>
      <div class="persona-cards-list">
        ${comments.map(c => {
          const meta = personas[c.persona_id] || { name: c.name, role: 'Synthetic persona', issue: c.issue || 'General', avatar: c.name.slice(0, 2).toUpperCase(), cls: 'persona-default' };
          const st = stances[c.stance] || { label: c.stance, icon: '·', cls: 'stance-neutral' };
          const targetComment = c.reply_to ? comments.find(x => x.id === c.reply_to) : null;
          return `<div class="persona-card" data-round="${c.round}">
            <div class="persona-card-header">
              <div class="persona-info">
                <span class="persona-avatar-badge ${meta.cls}">${meta.avatar}</span>
                <div>
                  <div class="persona-name-row">
                    <strong class="persona-name">${E(c.name)}</strong>
                    <span class="persona-issue-tag">${E(meta.role)} · ${E(meta.issue)}</span>
                  </div>
                  <span class="persona-round-label">Round ${c.round} · ${c.round === 1 ? 'First reaction' : c.round === 2 ? 'Response & Discussion' : 'Final Reflection'}</span>
                </div>
              </div>
              <div class="persona-stance-badge ${st.cls}">
                <span class="stance-icon">${st.icon}</span>
                <span>${st.label}</span>
              </div>
            </div>
            <div class="persona-card-body">
              <div class="persona-comment-box">
                <span class="quote-symbol">“</span>
                <p class="persona-comment-text">${E(c.comment)}</p>
              </div>
              ${c.rationale ? `<div class="persona-rationale-row">
                <span class="row-label">Reasoning & Considerations:</span>
                <p>${E(c.rationale)}</p>
              </div>` : ''}
              ${c.proposal ? `<div class="persona-proposal-row">
                <span class="proposal-icon">💡</span>
                <div>
                  <span class="proposal-label">Proposed solution:</span>
                  <p>${E(c.proposal)}</p>
                </div>
              </div>` : ''}
              ${targetComment ? `<div class="persona-reply-row">
                <span class="reply-arrow">↳</span>
                <span>Replying to <strong>${E(targetComment.name)}</strong> (Round ${targetComment.round}): “${E(targetComment.comment.slice(0, 110))}…”</span>
              </div>` : ''}
              ${(c.evidence_ids && c.evidence_ids.length) ? `<div class="persona-evidence-row">
                <span class="evidence-icon">📜</span>
                <span class="evidence-text">Legal references: ${c.evidence_ids.map(id => `<code class="evidence-chip">${E(id.split('@')[0])}</code>`).join(' ')}</span>
              </div>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  };

  return `<div class="social-modal-container">
    <div class="social-modal-banner">
      <div class="social-modal-meta">
        <span class="pill ${stale(r) ? 'amber' : 'green'}">${stale(r) ? 'Older version' : 'Matches draft v' + r.revision}</span>
        <span class="pill">${p.provider.mode === 'live' ? '⚡ AI Live (Gemini)' : '⚙️ Template Demo'}</span>
        <span class="social-modal-count">5 synthetic personas · 3 evaluation rounds</span>
      </div>
      <p class="social-modal-disclaimer">Recorded snapshot of synthetic persona reactions used to test policy alternatives. Reactions are AI model inferences, not an empirical survey of real public opinion.</p>
    </div>

    <div class="modal-scenario-switcher" role="tablist">
      <button type="button" class="scenario-tab-btn active" data-modal-scenario="A">
        <span class="tab-title">Scenario A · Initial draft (v${r.revision})</span>
        <span class="tab-counts">
          ${statsA.conc ? `<span class="count-tag concern">${statsA.conc} Concern</span>` : ''}
          ${statsA.cond ? `<span class="count-tag conditional">${statsA.cond} Conditional</span>` : ''}
          ${statsA.supp ? `<span class="count-tag support">${statsA.supp} Support</span>` : ''}
        </span>
      </button>
      <button type="button" class="scenario-tab-btn" data-modal-scenario="B">
        <span class="tab-title">Scenario B · Comparison Alternative</span>
        <span class="tab-counts">
          ${statsB.conc ? `<span class="count-tag concern">${statsB.conc} Concern</span>` : ''}
          ${statsB.cond ? `<span class="count-tag conditional">${statsB.cond} Conditional</span>` : ''}
          ${statsB.supp ? `<span class="count-tag support">${statsB.supp} Support</span>` : ''}
        </span>
      </button>
    </div>

    ${renderScenarioContent('A', true)}
    ${renderScenarioContent('B', false)}

    <details class="social-modal-limitations">
      <summary>Simulation limits & methodology notes</summary>
      ${limitations(p.limitations || [])}
    </details>
  </div>`;
}

function renderAnalysisModalBody(r, p) {
  const sevMeta = {
    high: { label: 'High', icon: '⛔', cls: 'sev-high' },
    medium: { label: 'Medium', icon: '⚠️', cls: 'sev-medium' },
    low: { label: 'Low', icon: 'ℹ️', cls: 'sev-low' }
  };
  return `<div class="analysis-modal-container">
    <div class="modal-status-banner">
      <span class="pill ${stale(r) ? 'amber' : 'green'}">${stale(r) ? 'Older version' : 'Matches saved draft'}</span>
      <span class="pill">${E(label(r.review_status))}</span>
    </div>
    <div class="analysis-summary-card">
      <span class="analysis-summary-icon">📋</span>
      <p>${E(p.summary)}</p>
    </div>
    <div class="analysis-findings-list">
      ${p.findings.map(f => {
        const sm = sevMeta[f.severity] || { label: f.severity || 'Findings', icon: '•', cls: 'sev-medium' };
        return `<div class="finding-modal-card">
          <div class="finding-modal-head">
            <div>
              <strong class="finding-pasal">Pasal ${E(f.article_number)}</strong>
              <span class="finding-title">${E(f.title)}</span>
            </div>
            <span class="severity-pill ${sm.cls}">${sm.icon} ${sm.label}</span>
          </div>
          <p class="finding-reasoning">${E(f.reasoning)}</p>
          ${f.proposed_text ? `<div class="finding-proposed-box">
            <span class="box-label">Drafting proposal:</span>
            <div class="quote">${E(f.proposed_text)}</div>
          </div>` : ''}
          ${(f.evidence && f.evidence.length) ? `<details class="finding-evidence-disclosure">
            <summary>Legal references (${f.evidence.length} Sources)</summary>
            ${f.evidence.map(source).join('')}
          </details>` : ''}
        </div>`;
      }).join('')}
    </div>
    <div class="reviewer-notes-section">
      <h3>Reviewer notes</h3>
      <p>${E(r.review_notes || 'No notes yet.')}</p>
    </div>
    ${limitations(p.limitations || [])}
  </div>`;
}

actions['run-detail']=el=>{
  const r=S.runs.find(x=>x.id===el.dataset.run),p=r.payload;
  if(r.kind==='social'){
    modal('Synthetic forum · v'+r.revision, renderSocialModalBody(r, p), btn('Close','close'));
    return;
  }
  if(r.kind==='analysis'){
    modal('Check result · v'+r.revision, renderAnalysisModalBody(r, p), btn('Close','close'));
    return;
  }
  modal('Simulation result · v'+r.revision,
    `<div class="note">${stale(r)?'Result from an older version.':'Version matches the saved draft.'} ${E(label(r.review_status))}</div><div class="impact-mini-grid">${['A','B'].map(k=>`<div class="impact-mini"><small>ALTERNATIVE ${k}</small><strong>${p[k].access_pct}%</strong><span>${p[k].served} served</span><span>${rup(p[k].cost)}</span></div>`).join('')}</div><p class="micro">Model output based on the assumptions at run time.</p>${p.stakeholders.map(x=>`<details class="source-details"><summary>${E(x.stakeholder)}</summary>${limitations(x.risks)}${limitations(x.mitigations)}</details>`).join('')}<h3>Reviewer notes</h3><p>${E(r.review_notes||'No notes yet.')}</p>${limitations(p.limitations)}`,
    btn('Close','close')
  );
};

document.addEventListener('click', e => {
  const scTab = e.target.closest('[data-modal-scenario]');
  if (scTab) {
    const sc = scTab.dataset.modalScenario;
    document.querySelectorAll('[data-modal-scenario]').forEach(b => b.classList.toggle('active', b === scTab));
    document.querySelectorAll('.modal-scenario-content').forEach(panel => {
      panel.style.display = panel.dataset.scenario === sc ? 'block' : 'none';
    });
    return;
  }
  const roundPill = e.target.closest('[data-modal-round]');
  if (roundPill) {
    const r = roundPill.dataset.modalRound;
    const parent = roundPill.closest('.modal-scenario-content');
    parent.querySelectorAll('[data-modal-round]').forEach(b => b.classList.toggle('active', b === roundPill));
    parent.querySelectorAll('.persona-card').forEach(card => {
      card.style.display = (r === 'all' || card.dataset.round === r) ? 'block' : 'none';
    });
    return;
  }
});

async function watchAgents(){
 clearTimeout(agentTimer);
 if(!S.jobs.some(j=>['queued','running','cancelling'].includes(j.status)))return;
 const draftId=S.draft.id;
 agentTimer=setTimeout(async()=>{try{
  const jobs=await api('/drafts/'+draftId+'/agent-jobs');if(S.draft.id!==draftId)return;S.jobs=jobs;
  if(!jobs.some(j=>['queued','running','cancelling'].includes(j.status))){const runs=await api('/drafts/'+draftId+'/runs');if(S.draft.id!==draftId)return;S.runs=runs;}
  const live=$('#agent-live');if(live)live.innerHTML=agentActivity(S,E,btn);refreshActivity(!jobs.some(j=>['queued','running','cancelling'].includes(j.status)));if(S.view==='home')loadOverview();else refreshFrameworkStatus(S);updateSocial(S);agentControls();
  watchAgents();
 }catch(err){toast('Agent activity could not be loaded. Use Refresh to try again.',true);}},1200);
}
actions['start-agent']=async el=>{
 const intent=el.dataset.intent||$('#agent-intent')?.value||'full';
 const alternative=$('#alternative')?.value||$('#agent-alternative')?.value||S.alt||defaultAlt();
 const assumptions=$('#ass-population')?readAssumptions():S.simAss||last('simulation')?.payload.assumptions||defaultAssumptions;
 if(intent!=='legal'&&alternative.trim().length<10)throw Error('Alternative B must be at least 10 characters.');
 await save();S.alt=alternative;S.simAss=assumptions;
 await api('/drafts/'+S.draft.id+'/agent-jobs','POST',{intent,expected_revision:S.draft.revision,alternative_text:intent==='legal'?null:alternative,assumptions,as_of_date:S.asOf,social_options:S.socialConfig},{'Idempotency-Key':crypto.randomUUID()});
 await refresh();if(S.view==='editor')S.studioTab=intent==='social'?'social':'agents';render();watchAgents();
};
actions['cancel-agent']=async el=>{await api('/agent-jobs/'+el.dataset.job+'/cancel','POST',{});S.jobs=await api('/drafts/'+S.draft.id+'/agent-jobs');const live=$('#agent-live');if(live)live.innerHTML=agentActivity(S,E,btn);refreshActivity();refreshFrameworkStatus(S);updateSocial(S);agentControls();watchAgents();};
actions['refresh-agents']=async()=>{await refresh();const live=$('#agent-live');if(live)live.innerHTML=agentActivity(S,E,btn);refreshActivity();refreshFrameworkStatus(S);updateSocial(S);agentControls();watchAgents();};
actions['inspect-job']=async el=>{const job=await api('/agent-jobs/'+el.dataset.job);modal('Run trace · v'+job.revision,agentActivity({...S,jobs:[job]},E,btn));};
actions['audit']=async()=>{const data=await api('/audit');modal('Audit workspace',`<p class="micro">Request metadata only; document content and credentials are not logged.</p><table><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Status</th></tr></thead><tbody>${data.events.map(e=>`<tr><td>${E(new Date(e.created_at).toLocaleString('id-ID'))}</td><td>${E(e.actor)}<br>${E(e.role)}</td><td>${E(e.action)}</td><td>${e.status}</td></tr>`).join('')}</tbody></table>`);};

function agentControls(){
 const active=S.jobs.some(j=>['queued','running','cancelling'].includes(j.status));
 const role=S.status.principal?.role;
 document.querySelectorAll('#main [data-action=start-agent]').forEach(el=>{el.disabled=active||role==='viewer'||role==='reviewer';if(active)el.title='Wait for or cancel the active run before starting a new one.';});
}

actions['go-social']=()=>view('social');
actions['go-sim']=()=>{S.simSection='projection';return view('simulation');};
actions['sim-section']=el=>{S.simSection=el.dataset.section||'projection';render();requestAnimationFrame(()=>document.querySelector('.sim-unified-tab[aria-selected=true]')?.focus({preventScroll:true}));};
actions['back-editor']=()=>view('editor');

actions['probe-ai']=async()=>{const result=await api('/readiness/probe','POST',{});await settings();toast(result.detail,!result.ready);};

// Chat state lives in memory for this page session; corpus remains the only legal evidence.
async function askGallery(question){
 const g=S.gallery,q=question.trim();
 if(q.length<3){const error=Error('Question: at least 3 characters.');error.fieldId='gallery-question';throw error;}
 if(q.length>2500)throw Error('Question: max 2,500 characters.');
 const history=g.turns.filter(t=>t.answer).slice(-3).flatMap(t=>[{role:'user',content:t.question},{role:'assistant',content:(t.answer.sections.map(s=>s.heading+': '+s.explanation).join('\n')||t.answer.message).slice(0,4000)}]);
 const turn={question:q,answer:null,error:null,pending:true,time:new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})};
 g.turns.push(turn);g.turns=g.turns.slice(-20);g.question='';
 render();document.querySelector('.gallery-transcript')?.lastElementChild?.scrollIntoView({behavior:'instant',block:'nearest'});
 try{turn.answer=await api('/gallery/chat','POST',{question:q,document_id:g.scopeId||null,history});if(turn.answer.status==='answered'&&turn.answer.documents.length===1)g.scopeId=turn.answer.documents[0].id;g.question='';}
 catch(error){turn.error=error.message;g.question=q;throw error;}
 finally{turn.pending=false;render();document.querySelector('.gallery-transcript')?.lastElementChild?.scrollIntoView({behavior:'instant',block:'nearest'});}
}
actions['gallery-open']=async el=>{const doc=await api('/corpus/'+encodeURIComponent(el.dataset.id));S.gallery.doc=doc;S.gallery.articleNumber=doc.articles[0]?.number;S.gallery.scopeId=doc.id;render();$('#gallery-reader').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});};
actions['gallery-reader-mode']=el=>{S.gallery.readerMode=el.dataset.mode||'formatted';render();};
actions['gallery-step-article']=el=>{if(!el.dataset.article)return;S.gallery.articleNumber=el.dataset.article;render();};
actions['gallery-prompt']=el=>{S.gallery.chatFolded=false;S.gallery.question=el.dataset.question;render();$('#gallery-question')?.focus();};
actions['gallery-clear']=()=>{S.gallery.chatFolded=false;S.gallery.turns=[];S.gallery.question='';render();$('#gallery-question')?.focus();};
actions['gallery-retry']=el=>{S.gallery.chatFolded=false;S.gallery.question=S.gallery.turns[Number(el.dataset.turn)]?.question||'';render();$('#gallery-question')?.focus();};
actions['gallery-read-source']=el=>{const a=S.gallery.turns[Number(el.dataset.turn)]?.answer?.sources.find(a=>a.id===el.dataset.source);if(a)modal('Quote context · '+a.regulation_label+' Pasal '+a.number,source(a));};
document.addEventListener('input',e=>{
 if(e.target.closest('.draft-builder')){S.builderResult=null;$('#builder-preview-status').textContent='Input changed · preview again';}
 if(e.target.id==='draft-title'&&$('#document-heading')?.value){const lines=$('#document-heading').value.split('\n');lines[lines.length-1]=e.target.value.toUpperCase();$('#document-heading').value=lines.join('\n');}
 if(e.target.id==='gallery-question')S.gallery.question=e.target.value;
 if(e.target.id==='gallery-search'){S.gallery.query=e.target.value;S.gallery.page=1;$('#gallery-card-results').innerHTML=galleryCards(S,E,icon);}
});
document.addEventListener('change',e=>{
 if(isBusy())return;
 if(e.target.id==='gallery-type'){S.gallery.type=e.target.value;S.gallery.page=1;$('#gallery-card-results').innerHTML=galleryCards(S,E,icon);}
 if(e.target.id==='gallery-article'){S.gallery.articleNumber=e.target.value;render();queueMicrotask(()=>($('#gallery-article-trigger')||$('#gallery-article'))?.focus({preventScroll:true}));}
 if(e.target.id==='gallery-scope'){S.gallery.scopeId=e.target.value;$('.scope-indicator').textContent=e.target.value?'1 regulation selected':'Entire collection';}
});
document.addEventListener('keydown',e=>{
 const moreBtn=e.target.closest?.('[data-gallery-more]');
 if(moreBtn&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.stopPropagation();moreBtn.click();return;}
 if(e.target.id==='gallery-question'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){
  e.preventDefault();
  if(!isBusy())$('#gallery-chat-form')?.requestSubmit();
 }
});
document.addEventListener('submit',async e=>{
 if(e.target.id!=='gallery-chat-form')return;e.preventDefault();if(isBusy())return;
 try{await withLoading('gallery-ask',()=>askGallery($('#gallery-question').value));}
 catch(error){toast(error.message,true);displayError(error);}
 finally{$('#gallery-question')?.focus();}
});

// Saving with the keyboard follows the same single-operation guard as buttons.
document.addEventListener('keydown',async event=>{
 if(!(event.ctrlKey||event.metaKey)||event.key.toLowerCase()!=='s')return;
 event.preventDefault();
 if(S.view!=='editor'||isBusy()||document.querySelector('dialog[open]'))return;
 const button=document.querySelector('[data-action="save"]');
 if(button&&!button.disabled)button.click();
});

document.addEventListener('keydown',event=>{
 const tab=event.target.closest?.('.activity-tab');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||isBusy())return;
 event.preventDefault();const tabs=[...document.querySelectorAll('.activity-tab')],index=tabs.indexOf(tab);const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next]?.click();
});
document.addEventListener('rulelab:activity-route',async event=>{
 if(isBusy()||document.querySelector('dialog[open]'))return;
 try{await withLoading('navigate',()=>view(event.detail?.tab==='agents'?'agents':'history'));document.querySelector('#activity-tab-'+activityTab(S.view))?.focus({preventScroll:true});}catch(error){toast(error.message,true);displayError(error);}
});
actions['activity-agents']=()=>view('agents');
