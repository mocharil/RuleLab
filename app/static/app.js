import {builderHTML,readBuilder,previewHTML,updateBuilderNote,REGULATION_NAMES} from '/static/draft-builder.js';
import {collectionPage,sourceFormHTML,readSourceForm,intakeDetailHTML} from '/static/collection-ui.js';
import {mountDataDashboard,DATA_FILTER_KEYS} from '/static/data-dashboard.js';
import {initializeSelects} from '/static/select.js';
import {icon,enhanceDesign,enhanceVisualSurface} from '/static/design.js';
import {libraryPage,resultsHTML,documentListHTML,formatLegalArticleHTML,searchWords,citationText} from '/static/gallery.js';
import {initializeFrameworkShell,renderFrameworkComponents,disposePageComponents,refreshFrameworkStatus} from '/static/framework/framework.js';
import {initializeWorkspaceUX,enhanceWorkspace} from '/static/workspace-ux.js';
import {socialShell,updateSocial,setGraphView} from '/static/social.js';
import {mountKnowledgeGraph,focusKnowledgeEntity} from '/static/kg-graph.js';
import {activityPage,activityModel,timelineHTML,detailHTML,sheetHTML,chipsHTML,countsText,STATUS_FILTERS} from '/static/activity.js';
import {defaultAssumptions,assumptionInputs,readAssumptions,articlesText,sameText,wordDiff,diffHTML,alternativeFromProposals} from '/static/studio.js';
import {skeleton,withLoading,isBusy} from '/static/ui.js';
initializeFrameworkShell();
const $=s=>document.querySelector(s), E=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={high:'High',medium:'Medium',low:'Low',potential_vertical_conflict:'Potential vertical conflict',potential_horizontal_conflict:'Potential horizontal conflict',ambiguity:'Ambiguity',implementation_risk:'Implementation risk',coverage_gap:'Context incomplete',potential_only:'Initial indication',requires_review:'Needs review',temporal:'Time and version',scope:'Scope',authority:'Authority',exceptions:'Exceptions',alternative_interpretation:'Alternative interpretation',binding_statute:'Statutory norm',drafting_technique:'Drafting technique',engineering_guardrail:'Application protocol',needs_review:'Needs review',reviewed_with_notes:'Reviewed with notes'};
const label=v=>labels[v]||v;
const fmt=n=>new Intl.NumberFormat('id-ID').format(n), rup=n=>'Rp '+fmt(n);
const names={home:'Overview',data:'Data dashboard',editor:'Draft',analysis:'Verify sources',simulation:'Test impact',library:'Legal library',history:'Activity',social:'Impact & public simulation',agents:'Activity'};
const canonicalView=view=>['gallery','corpus'].includes(view)?'library':view==='social'?'simulation':view==='agents'?'history':Object.hasOwn(names,view)?view:'home';
const workflowViews=['editor','analysis','simulation'];
const activityViews=['history'];
const workflowNames={editor:'Draft',analysis:'Verify sources',simulation:'Test impact'};
const workflowRoute=params=>params.get('view')==='studio'?(workflowViews.includes(params.get('stage'))?params.get('stage'):'editor'):params.get('view')==='activity'?(params.get('tab')==='agents'?'agents':'history'):params.get('view')||'home';
const _urlP=new URLSearchParams(location.search), _initV=workflowRoute(_urlP);
// Activity filters and selection live in the URL (status, type, item); the old tab=agents opens the latest agent run.
function activityFromURL(params,agents=false){return {status:STATUS_FILTERS.some(([key])=>key===params.get('status'))?params.get('status'):null,kind:['analysis','simulation','social'].includes(params.get('type'))?params.get('type'):'all',item:params.get('item')||(agents?'job:latest':null),detail:Boolean(params.get('item'))||agents};}
let S={view:canonicalView(_initV),lastStudioView:'editor',agentIntent:'full',libraryTab:_initV==='corpus'||_urlP.get('tab')==='passages'?'passages':'documents',searchResultQuery:'',simSection:_initV==='social'?'social':(['projection','social','unified'].includes(_urlP.get('sub'))?_urlP.get('sub'):'projection'),draft:null,drafts:[],runs:[],corpus:[],status:{},catalog:null,builderResult:null,socialConfig:{persona_count:24,rounds:4,crowd_size:100},socialPreview:null,collectionFilters:_initV==='data'?Object.fromEntries(DATA_FILTER_KEYS.filter(key=>_urlP.get(key)).map(key=>[key,_urlP.get(key)])):{},gallery:{type:'',sort:'',list:null,doc:null,articleNumber:null,readerMode:'formatted',chatFolded:false,chatSheet:false,reading:false,highlight:[],find:'',tocOpen:false,scopeId:'',scopeLabel:'',question:'',turns:[]},searchLimit:12,dirty:false,alt:'',simAss:null,focusArticle:null,findingSel:null,results:null,searchQuery:_urlP.get('q')||'',findingFilter:'all',activity:{...activityFromURL(['history','agents'].includes(_initV)?_urlP:new URLSearchParams(),_initV==='agents'),versions:null,versionsKey:null,sheet:false},jobs:[],asOf:new Date().toISOString().slice(0,10)},timer,agentTimer;
let collectionCleanup,collectionData;
const actionIcons={new:'plus',add:'plus',generate:'file',import:'upload',export:'download',report:'download',save:'save',analyze:'shield','analyze-inline':'shield',simulate:'chart','sim-section':'chart','start-agent':'network',compare:'compare',copy:'copy','back-editor':'back',close:'close','legal-guide':'book','refresh-agents':'refresh',raw:'download','law-json':'download',versions:'clock',review:'reviewer','template-preamble':'sparkles'};
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
// Policy Studio shell: one sticky document bar (draft, save state, primary action, More menu) and the stage stepper.
const STAGES=[['editor','Draft'],['analysis','Verify sources'],['simulation','Test impact']];
const SEVERITY=['high','medium','low'];
const draftText=()=>articlesText(S.draft.articles);
function stageStates(){
 const review=last('analysis'),impact=last('simulation');
 return {
  editor:S.dirty?['Not saved','warn']:['Saved · v'+S.draft.revision,'done'],
  analysis:!review?['Not checked yet','todo']:stale(review)?['v'+review.revision+' · older result','warn']:[review.payload.findings.length+(review.payload.findings.length===1?' finding':' findings')+' · v'+review.revision,'done'],
  simulation:!impact?['No A/B comparison yet','todo']:stale(impact)?['v'+impact.revision+' · older result','warn']:['A/B v'+impact.revision,'done']};
}
function stageStepper(){
 const states=stageStates();
 return `<div class="ps-steps" role="tablist" aria-label="Policy Studio stage">${STAGES.map(([stage,title],index)=>{const [status,tone]=states[stage];return `<button id="workflow-stage-${stage}" class="ps-step is-${tone}" data-view="${stage}" role="tab" aria-selected="${S.view===stage}" aria-controls="workflow-stage-content" tabindex="${S.view===stage?'0':'-1'}"><span class="ps-step-dot" aria-hidden="true">${tone==='done'?icon('check',13):index+1}</span><span class="ps-step-copy"><b>${title}</b><small>${E(status)}</small></span></button>`;}).join('')}</div>`;
}
function studioBar(primary=''){
 const d=S.draft,checked=Boolean(last('analysis'));
 const item=(text,glyph,attrs)=>`<button type="button" role="menuitem" class="ps-menu-item" ${attrs}>${icon(glyph)}<span>${text}</span></button>`;
 const menu=[S.view==='editor'?item('Focus mode','focus','data-ux="focus-editor" aria-pressed="false"'):'',item('Import draft','upload','data-action="import"'),item('Export DOCX','download','data-action="export"'),item('Review report (DOCX)','download','data-action="report"'+(checked?'':' disabled title="Run Verify sources first"')),item('Draft versions','clock','data-action="versions"'),item('New draft from a brief','sparkles','data-action="generate"'),item('Legal guidelines','book','data-action="legal-guide"')].join('');
 return `<header class="ps-bar" aria-label="Draft"><h1 class="ps-sr">Policy Studio · ${workflowNames[S.view]}</h1><div class="ps-bar-row"><div class="ps-doc"><select id="draft-select" class="ps-draft-select" aria-label="Select draft">${S.drafts.map(x=>`<option value="${E(x.id)}" ${x.id===d.id?'selected':''}>${E(x.title)}</option>`).join('')}</select><div class="ps-doc-meta"><span>${E(REGULATION_NAMES[d.regulation_type]||d.regulation_type)}</span><span>${d.articles.length} articles</span><span id="save-state" class="ps-save ${S.dirty?'dirty':''}">${S.dirty?'Not saved':'Saved · v'+d.revision}</span>${S.view==='editor'?`<button type="button" class="ps-focus-chip" data-ux="focus-editor" aria-pressed="false">${icon('focus',14)}Focus mode · Exit</button>`:''}</div></div><div class="ps-bar-actions">${primary}<div class="ps-more"><button type="button" class="btn ps-more-toggle" data-ps-more aria-haspopup="menu" aria-expanded="false">More${icon('down',14)}</button><div class="ps-menu" role="menu" aria-label="More draft actions" hidden>${menu}</div></div></div></div>${stageStepper()}</header>`;
}
const studioStage=(primary,content)=>studioBar(primary)+`<section id="workflow-stage-content" role="tabpanel" aria-labelledby="workflow-stage-${S.view}">${content}</section>`;
const ROLE_BLOCKED=new Set(['new','create','generate','run-generate','save','add','remove','analyze','analyze-inline','simulate','apply','apply-alt','confirm-alt','import','run-import','start-agent','cancel-agent','collection-upload','collection-jdih','collection-submit','activity-sheet']);
const readOnlyRole=()=>['viewer','reviewer'].includes(S.status.principal?.role);
function lockForRole(root=$('#main')){
 if(!root||!readOnlyRole())return;
 root.querySelectorAll('[data-action]').forEach(el=>{if(ROLE_BLOCKED.has(el.dataset.action)){el.disabled=true;el.title='This action requires the editor or admin role';}});
}
function mountActivity(){
 if(S.view!=='history')return;
 mountActivityDetail();
 document.querySelector('#activity-timeline [aria-current="true"]')?.scrollIntoView({block:'nearest'});
}
function mountActivityDetail(m=activityModel(S)){
 const [type,id]=String(m.selected||'').split(':'),run=type==='run'&&S.runs.find(r=>r.id===id),graph=$('#activity-kg');
 if(run?.kind==='social'&&run.payload.network?.graph&&graph)mountKnowledgeGraph(graph,{graph:run.payload.network.graph,key:'activity-'+run.id,actions:['article'],onAction:(kind,entity)=>{if(kind==='article')document.dispatchEvent(new CustomEvent('rulelab:open-article',{detail:{number:entity.id.replace('article:','')}}));}});
}
// Repaint the timeline (and optionally the detail) in place, keeping scroll position and open disclosures.
function paintActivity({detail=true}={}){
 const root=$('#main .act');if(!root)return;
 const m=activityModel(S);
 root.classList.toggle('show-detail',Boolean(S.activity.detail));
 $('#act-counts').textContent=countsText(S);
 const report=root.querySelector('.act-head [data-action="report"]'),noCheck=!S.runs.some(r=>r.kind==='analysis');
 if(report){report.disabled=noCheck;if(noCheck)report.title='Run a source check first';else report.removeAttribute('title');}
 root.querySelector('.act-chips').innerHTML=chipsHTML(m);
 $('#activity-timeline').innerHTML=timelineHTML(S,activityCtx,m);
 if(detail){
  const panel=$('#activity-detail'),open=[...panel.querySelectorAll('details')].map(d=>d.open);
  panel.innerHTML=detailHTML(S,activityCtx,m);
  if(panel.dataset.item===m.selected)panel.querySelectorAll('details').forEach((d,i)=>{if(open[i])d.open=true;});
  panel.dataset.item=m.selected||'';
  mountActivityDetail(m);lockForRole(panel);
 }
 syncRoute();
}
// Polling and server refreshes: never rewrite a result the user may be reviewing.
function refreshActivity(){
 if(S.view!=='history'||!$('#main .act'))return;
 const type=String(activityModel(S).selected||'').split(':')[0],editing=document.activeElement?.closest?.('#activity-detail')&&document.activeElement.matches('textarea,input');
 paintActivity({detail:type!=='run'&&!editing});
}
function selectActivity(key,{detail=true,focus=false}={}){
 S.activity.item=key;if(detail)S.activity.detail=true;
 paintActivity();
 if(focus)$('#activity-timeline [aria-current="true"]')?.focus({preventScroll:true});
 $('#activity-timeline [aria-current="true"]')?.scrollIntoView({block:'nearest'});
 if(detail&&window.innerWidth<=760)window.scrollTo({top:0,behavior:'instant'});else if(detail&&$('#activity-detail').getBoundingClientRect().top<0)$('#activity-detail').scrollIntoView({block:'start'});
}
// Keep the current selection when it still matches the filters; otherwise fall back to the first visible item.
function refilterActivity(){
 const m=activityModel(S);if(!m.keys.includes(m.selected))S.activity.item=m.keys.find(k=>!k.startsWith('version:'))||m.keys[0]||null;
 paintActivity();
}
async function loadVersions(){
 const key=S.draft.id+':'+S.draft.revision;if(S.activity.versionsKey===key)return;S.activity.versionsKey=key;
 try{const rows=await api('/drafts/'+S.draft.id+'/history');if(S.activity.versionsKey!==key)return;S.activity.versions=rows;if(S.view==='history')paintActivity({detail:String(activityModel(S).selected||'').startsWith('version:')});}
 catch(error){S.activity.versionsKey=null;toast('Draft versions could not be loaded. '+error.message,true);}
}
function demoNote(){return S.status.provider==='demo'?'<div class="note demo-note"><span class="tag">Demo</span><span>Results use local rules and templates. Numbers are computed from your assumptions.</span></div>':'';}
function source(a){return `<details class="source-details"><summary>${E(a.regulation_label)} · Article ${E(a.number)} <span class="tag">Source snapshot</span></summary><p class="micro" style="margin-top:8px">${E(a.hierarchy_relation||a.legal_status)}</p><div class="quote legal-formatted-quote">${formatLegalArticleHTML(a.text,E)}</div><a href="${E(a.source.url)}" target="_blank" rel="noopener">Official source ↗</a><div class="micro">${a.pages.length?'Page '+a.pages.join(', '):'HTML'} · SHA256 ${E(a.source.sha256.slice(0,16))}…</div></details>`;}
function render(){collectionCleanup?.();syncRoute();document.body.classList.toggle('control-room',S.view==='simulation'&&S.simSection==='social');const views={home,data:collectionPage,editor,analysis,simulation,library,history,social:()=>simulation()};if(workflowViews.includes(S.view))S.lastStudioView=S.view;document.body.dataset.workspace=workflowViews.includes(S.view)?'studio':activityViews.includes(S.view)?'activity':S.view;$('#crumb').textContent=workflowViews.includes(S.view)?'Policy Studio · '+workflowNames[S.view]:activityViews.includes(S.view)?'Activity':names[S.view];document.querySelectorAll('#nav button,.workspace-home-link').forEach(x=>{const active=x.dataset.view===S.view||(x.dataset.view==='studio'&&workflowViews.includes(S.view))||(x.dataset.view==='activity'&&activityViews.includes(S.view));x.classList.toggle('active',active);if(active)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current');});if(window.innerWidth<=760){const nav=$('#nav'),active=nav.querySelector('[aria-current=page]');if(active)nav.scrollLeft=Math.max(0,active.offsetLeft-nav.offsetLeft-(nav.clientWidth-active.offsetWidth)/2);}disposePageComponents();$('#main').innerHTML=(views[S.view]||home)();mountActivity();document.body.classList.remove('ps-insights-open');measureStudioBar();renderFrameworkComponents(S);if(S.view==='home')loadOverview();enhanceWorkspace(S);enhanceDesign(S);updateSocial(S);agentControls();if(S.view==='editor')mountInsightsGraph();
 if(S.view==='data')collectionCleanup=mountDataDashboard($('#collection-dashboard'),{request:api,initialFilters:S.collectionFilters,onFiltersChange:filters=>{S.collectionFilters=filters;syncRoute();},onLoaded:data=>{collectionData=data;const role=S.status.principal?.role;if(['viewer','reviewer'].includes(role))document.querySelectorAll('#main [data-action="collection-upload"],#main [data-action="collection-jdih"]').forEach(button=>{button.disabled=true;button.title='This action requires the editor or admin role';});},onDocument:async id=>{try{await withLoading('gallery-open',async()=>{showDocument(await api('/corpus/'+id),null);S.libraryTab='documents';await view('library');});}catch(error){toast(error.message,true);}},onIntake:async id=>{try{const item=await api('/data/intake/'+id);modal('Sources in queue',intakeDetailHTML(item),btn('Close','close')+(item.channel==='upload'?btn('Download file','collection-raw',`data-id="${item.id}"`):''));}catch(error){toast(error.message,true);}}});
 const selectedTab=document.querySelector('.sim-unified-tab[aria-selected=true]');
 if(selectedTab){const list=selectedTab.parentElement;list.scrollLeft=Math.max(0,selectedTab.offsetLeft-list.offsetLeft-(list.clientWidth-selectedTab.offsetWidth)/2);}
 lockForRole();
 if(readOnlyRole()&&S.view==='editor')document.querySelectorAll('#draft-title,#reg-type,#scope,#preamble,#document-heading,#draft-closing,#draft-explanation,#draft-attachments,[data-chapter],[data-number],[data-article]').forEach(el=>el.disabled=true);
}
// Sticky outline, insights and finding list sit below the sticky document bar.
function measureStudioBar(){const bar=$('.ps-bar');if(bar)document.body.style.setProperty('--ps-bar-h',bar.offsetHeight+'px');}
window.addEventListener('resize',measureStudioBar);
function findingsByArticle(run){const map=new Map();(run?.payload.findings||[]).forEach((f,i)=>{if(!map.has(f.article_number))map.set(f.article_number,[]);map.get(f.article_number).push({f,i});});return map;}
const topSeverity=items=>SEVERITY.find(s=>items.some(x=>x.f.severity===s))||'low';
const articleOrder=f=>{const k=S.draft.articles.findIndex(a=>a.number===f.article_number);return k<0?S.draft.articles.length:k;};
const plural=(n,word)=>n+' '+word+(n===1?'':'s');
// A proposal is already in the draft when its article now carries exactly the proposed wording.
const alreadyApplied=f=>Boolean(f.proposed_text?.trim())&&S.draft.articles.find(a=>a.number===f.article_number)?.text.trim()===f.proposed_text.trim();
function editor(){
 const d=S.draft,r=last('analysis'),fresh=r&&!stale(r),byArticle=findingsByArticle(r),amendment=d.drafting?.form==='amendment';
 if(!(Number.isInteger(S.focusArticle)&&S.focusArticle<d.articles.length))S.focusArticle=Math.max(0,d.articles.findIndex(a=>byArticle.has(a.number)));
 const preview=(d.preamble||'').split('\n').map(x=>x.trim()).find(Boolean)||'Not written yet';
 const outline=`<nav class="ps-outline" aria-label="Document outline"><span class="ps-label">Outline</span><button type="button" class="ps-outline-item" data-ps-jump="ps-opening">Opening</button>${d.articles.map((a,i)=>{const items=byArticle.get(a.number)||[];return `<button type="button" class="ps-outline-item ${i===S.focusArticle?'active':''}" data-action="jump-article" data-index="${i}" ${i===S.focusArticle?'aria-current="true"':''}><span>Pasal ${E(a.number)}</span>${items.length?`<span class="ps-count sev-${topSeverity(items)} ${fresh?'':'is-old'}" title="${plural(items.length,'finding')}${fresh?'':' from an older check'}">${items.length}</span>`:''}</button>`;}).join('')}<button type="button" class="ps-outline-item" data-ps-jump="ps-closing">Closing & annexes</button>${btn('Add article','add',amendment?'disabled title="Amendment drafts keep the article structure of the amended regulation"':'')}</nav>`;
 const articles=d.articles.map((a,i)=>{const items=fresh?byArticle.get(a.number)||[]:[];return `<article id="article-${i}" class="article-card ${items.length?'warn':''} ${i===S.focusArticle?'article-active':''}"><div class="article-top"><div class="article-number">Pasal <input data-number="${i}" value="${E(a.number)}" aria-label="Article number ${i+1}"></div><div class="actions">${items.length?`<span class="tag ${topSeverity(items)}">${plural(items.length,'finding')}</span>`:''}<button class="text-button" data-action="remove" data-index="${i}" ${amendment?'disabled':''}>Remove</button></div></div>${a.chapter?`<label for="chapter-${i}" class="micro">Chapter / part (Bab / Bagian)</label><textarea id="chapter-${i}" data-chapter="${i}" rows="2" class="article-chapter">${E(a.chapter)}</textarea>`:''}<textarea data-article="${i}" aria-label="Article ${E(a.number)} text">${E(a.text)}</textarea></article>`;}).join('');
 const paper=`<section class="ps-paper" aria-label="Draft document"><div class="document-header ps-doc-head"><div class="doc-type">DRAFT <select id="reg-type" aria-label="Regulation type">${Object.keys(REGULATION_NAMES).map(t=>`<option ${t===d.regulation_type?'selected':''}>${t}</option>`).join('')}</select></div><input id="draft-title" aria-label="Draft title" value="${E(d.title)}"></div>
 <details id="ps-opening" class="ps-fold" ${d.preamble?.trim()?'':'open'}><summary><span class="ps-fold-title"><b>Opening</b><small>Menimbang · Mengingat · Memutuskan</small></span><span class="ps-fold-preview">${E(preview)}</span>${icon('down',16)}</summary><div class="ps-fold-body"><div class="ps-fold-tools"><p class="micro">Indonesian regulations open with considerations and a legal basis before the body (UU 12/2011, Annex II).</p><button class="btn btn-sm" data-action="template-preamble" type="button">${icon('sparkles')}Standard ${E(d.regulation_type)} format</button></div><textarea id="preamble" class="preamble-textarea" aria-label="Opening, considerations (Menimbang) and legal basis (Mengingat)" placeholder="DENGAN RAHMAT TUHAN YANG MAHA ESA...&#10;Menimbang: ...&#10;Mengingat: ...&#10;MEMUTUSKAN:&#10;Menetapkan: ...">${E(d.preamble)}</textarea></div></details>
 <div class="ps-body-head"><h2>Body</h2><details class="ps-tip"><summary>${icon('book',14)}Drafting rule</summary><p>Each <strong>Pasal</strong> holds one core norm. More than one norm is numbered as <strong>ayat (1), (2)</strong>, with items <strong>a., b.</strong> ending in a semicolon and sub-items <strong>1., 2.</strong></p></details></div>
 <div class="article-list">${articles}</div>
 <details id="ps-closing" class="ps-fold"><summary><span class="ps-fold-title"><b>Closing & annexes</b><small>Full title, enactment, elucidation, annexes and scope notes</small></span>${icon('down',16)}</summary><div class="ps-fold-body"><label for="document-heading">Full document title</label><textarea id="document-heading" rows="5">${E(d.document_heading||'')}</textarea><label for="draft-closing">Enactment & promulgation</label><textarea id="draft-closing" rows="8">${E(d.closing||'')}</textarea><label for="draft-explanation">Elucidation / Penjelasan (optional)</label><textarea id="draft-explanation" rows="4">${E(d.explanation||'')}</textarea><label for="draft-attachments">Annexes / Lampiran (optional)</label><textarea id="draft-attachments" rows="4">${E(d.attachments||'')}</textarea><label for="scope">Scope & drafting notes</label><input id="scope" value="${E(d.scope)}"><p class="micro">Placeholders must be completed. Identity and legal basis need updating if the regulation type changes.</p></div></details></section>`;
 return studioStage(btn('Save version','save','',true),`<div class="ps-editor">${outline}${paper}<aside id="ps-insights" class="ps-insights" aria-label="Article insights">${insightsHTML()}</aside></div><button type="button" class="ps-insights-toggle" data-ps-insights aria-controls="ps-insights" aria-expanded="false">${insightsToggleLabel()}</button>`);
}
function insightsHTML(){
 const d=S.draft,i=Math.min(Math.max(0,S.focusArticle||0),d.articles.length-1),a=d.articles[i],r=last('analysis');
 const head=`<div class="ps-ins-head"><div><span class="ps-label">Insights</span><h2>Pasal ${E(a.number)}</h2></div><button type="button" class="ps-ins-close" data-ps-insights aria-label="Close insights">${icon('close')}</button></div>`;
 const ask=`<button type="button" class="btn ps-ask" data-action="ask-library" data-index="${i}">${icon('message')}Ask the library about Pasal ${E(a.number)}</button>`;
 if(!r)return head+insightsGraphHTML(a)+`<div class="ps-ins-empty"><p>Not checked yet. A source check finds possible conflicts and the sources behind them, article by article.</p>${btn('Check sources','analyze-inline','',true)}</div>`+ask;
 const old=S.dirty||stale(r),items=findingsByArticle(r).get(a.number)||[];
 const status=old?`<div class="ps-ins-note">${icon('clock',15)}<p>${S.dirty?'Unsaved changes. ':''}Findings are from v${r.revision}${stale(r)?`; the draft is now v${d.revision}`:''}. Proposals apply only to the version they were made on.</p>${btn(S.dirty?'Save & re-check':'Re-check v'+d.revision,'analyze-inline')}</div>`:`<p class="ps-ins-meta">From the check on v${r.revision} · ${plural(r.payload.findings.length,'finding')} in the draft</p>`;
 const cards=items.map(({f,i:index})=>`<article class="ps-ins-finding sev-${E(f.severity)}"><div class="ps-ins-title"><span class="tag ${E(f.severity)}">${E(label(f.severity))}</span><b>${E(f.title)}</b></div><p>${E(f.reasoning)}</p><details><summary>Proposed wording</summary><div class="ps-diff">${diffHTML(f.original_text,f.proposed_text,E)}</div></details><div class="ps-ins-actions">${alreadyApplied(f)?`<span class="ps-applied">${icon('check',14)}Already in the draft</span>`:btn('Apply proposal','apply',`data-index="${index}" ${old?'disabled':''}`,true)}<button type="button" class="btn" data-action="open-finding" data-index="${index}">Open in Verify</button></div></article>`).join('');
 const evidence=items.flatMap(x=>x.f.evidence).filter((e,k,all)=>all.findIndex(y=>y.id===e.id)===k);
 const elsewhere=d.articles.map((x,k)=>({k,n:(findingsByArticle(r).get(x.number)||[]).length,number:x.number})).filter(x=>x.n&&x.k!==i);
 const others=!items.length&&elsewhere.length?`<div class="ps-ins-others"><span class="ps-label">Findings in other articles</span><div>${elsewhere.map(x=>`<button type="button" class="ps-chip" data-action="jump-article" data-index="${x.k}">Pasal ${E(x.number)} <b>${x.n}</b></button>`).join('')}</div></div>`:'';
 return head+status+(cards||`<p class="ps-ins-clear">${icon('verified',16)}No findings for this article${old?' in v'+r.revision:''}.</p>`)+others+(evidence.length?`<details class="ps-ins-sources"><summary>Related sources (${evidence.length})</summary>${evidence.map(source).join('')}</details>`:'')+insightsGraphHTML(a)+ask;
}
// Stakeholder map for the focused article, from the latest public-forum knowledge graph.
function insightsGraphHTML(a){
 const graph=last('social')?.payload.network?.graph;
 if(!graph)return `<div class="ps-ins-graph"><div class="ps-ins-graph-head"><span class="ps-label">Stakeholder map</span></div><p class="micro">Run the public forum in Test impact to map who this article affects.</p><button type="button" class="text-button" data-action="open-forum-graph">Open the public forum</button></div>`;
 return `<div class="ps-ins-graph"><div class="ps-ins-graph-head"><span class="ps-label">Stakeholder map</span><button type="button" class="text-button" data-action="open-forum-graph" data-entity="article:${E(a.number)}">Open full graph</button></div><div id="ps-ins-kg"></div></div>`;
}
function mountInsightsGraph(){
 const host=$('#ps-ins-kg'),run=last('social'),a=S.draft.articles[S.focusArticle||0];if(!host||!run||!a)return;
 mountKnowledgeGraph(host,{graph:run.payload.network.graph,key:run.id,compact:true,focus:'article:'+a.number,caption:'From the public forum on v'+run.revision+(stale(run)?' · the draft has changed since':'')+' · click a node to open it in the full graph',onAction:(kind,entity)=>{if(isBusy())return;withLoading('navigate',()=>openForumGraph(entity.id)).catch(error=>toast(error.message,true));}});
}
function openForumGraph(entityId){const run=last('social');if(run&&entityId)focusKnowledgeEntity(run.id,entityId);setGraphView('kg');S.simSection='social';return view('simulation');}
// Graph nodes for draft articles open that article in the Draft stage.
document.addEventListener('rulelab:open-article',async event=>{
 const index=S.draft.articles.findIndex(a=>a.number===String(event.detail?.number));
 if(index<0){toast('That article is no longer in the draft.',true);return;}
 if(isBusy())return;S.focusArticle=index;
 try{await withLoading('navigate',()=>view('editor'));actions['jump-article']({dataset:{index:String(index)}});}catch(error){toast(error.message,true);}
});
function insightsToggleLabel(){const a=S.draft.articles[S.focusArticle||0],n=(findingsByArticle(last('analysis')).get(a?.number)||[]).length;return `${icon('shield',16)}<span>Insights · Pasal ${E(a?.number||'')}</span>${n?`<b>${n}</b>`:''}`;}
function refreshInsights(){
 const rail=$('#ps-insights');if(!rail)return;
 rail.innerHTML=insightsHTML();lockForRole(rail);mountInsightsGraph();
 const toggle=$('.ps-insights-toggle');if(toggle)toggle.innerHTML=insightsToggleLabel();
 document.querySelectorAll('.ps-outline [data-index]').forEach(b=>{const active=Number(b.dataset.index)===S.focusArticle;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
}
function analysis(){
 const r=last('analysis'),p=r?.payload,rev=S.draft.revision;
 const primary=btn(!r?'Check sources':stale(r)?'Re-check v'+rev:'Re-check','analyze','',true);
 const date=`<label class="ps-date" for="legal-date">${icon('calendar',14)}<span>As of</span><input id="legal-date" type="date" value="${E(S.asOf)}"></label>`;
 if(!r)return studioStage(primary,`<div class="ps-summary">${date}<span class="ps-summary-item">Source versions and legal status are checked against this date.</span></div>${demoNote()}<section class="ps-empty">${icon('shield',28)}<h2>Not checked yet</h2><p>Use <b>Check sources</b> above to retrieve related regulations. Each finding comes with its sources, a proposed wording and an alternative reading.</p></section>`);
 const findings=p.findings,count=k=>findings.filter(f=>f.severity===k).length;
 // Most severe first, then document order; the original index stays the key for apply-revision.
 const visible=findings.map((f,i)=>({f,i})).filter(({f})=>S.findingFilter==='all'||f.severity===S.findingFilter).sort((x,y)=>(SEVERITY.indexOf(x.f.severity)+3)%3-(SEVERITY.indexOf(y.f.severity)+3)%3||articleOrder(x.f)-articleOrder(y.f)||x.i-y.i);
 if(!visible.some(x=>x.i===S.findingSel))S.findingSel=visible[0]?.i??null;
 const remaining=findings.filter(f=>!alreadyApplied(f)).length;
 const summary=`<div class="ps-summary"><span class="ps-summary-item">Checked <b>v${r.revision}</b></span>${date}<span class="ps-summary-item"><b>${fmt(p.coverage.retrieved_articles)}</b> sources</span><span class="ps-summary-item"><b>${findings.length}</b> ${findings.length===1?'finding':'findings'}${findings.length?' ('+SEVERITY.filter(count).map(k=>count(k)+' '+k).join(', ')+')':''}</span><span class="ps-summary-review"><span class="pill ${r.review_status==='reviewed_with_notes'?'green':'amber'}">${E(label(r.review_status))}</span>${btn('Review in Activity','review',`data-run="${r.id}"`)}</span></div>`;
 const banner=stale(r)?`<div class="ps-stale" role="status">${icon('clock',18)}<p><b>Draft is now v${rev}.</b> These findings are from v${r.revision}. ${remaining?`Re-check v${rev} to apply the remaining ${plural(remaining,'proposal')}.`:'Re-check to confirm the new version.'}</p></div>`:'';
 const limits=`<details class="ps-limits"><summary>Review limits & legal context</summary><p class="help-text">${E(p.summary)}</p>${p.legal_context?`<p class="micro">Guidelines ${E(p.legal_context.rulebook_version)} · Date ${E(p.legal_context.as_of_date)} · ${p.legal_context.pending_changes.length} related amendment candidates, not yet applied. ${E(p.legal_context.notice)}</p>`:''}${limitations(p.limitations)}${r.review_notes?`<p class="help-text"><b>Reviewer notes:</b> ${E(r.review_notes)}</p>`:''}</details>`;
 if(!findings.length)return studioStage(primary,summary+demoNote()+banner+`<div class="note green">No problem patterns detected. This does not prove the draft is conflict-free.</div>`+limits);
 const list=`<div class="ps-list-col">${filterBar('findings',[['all','All',findings.length],...SEVERITY.map(k=>[k,label(k),count(k)])],S.findingFilter)}${visible.length?`<div class="ps-finding-list" role="listbox" aria-label="Findings">${visible.map(({f,i})=>`<button type="button" role="option" id="ps-fi-${i}" class="ps-finding-item sev-${E(f.severity)}" data-ps-finding="${i}" aria-selected="${i===S.findingSel}" aria-controls="ps-finding-${i}"><span class="ps-sev-dot" aria-hidden="true"></span><span class="ps-fi-copy"><small>${E(label(f.severity))} · Pasal ${E(f.article_number)}${alreadyApplied(f)?' · in draft':''}</small><b>${E(f.title)}</b></span>${icon('chevron',16)}</button>`).join('')}</div><p class="ps-keys micro"><kbd>J</kbd> <kbd>K</kbd> next / previous</p>`:'<div class="filter-empty">No findings at this level. Choose All to see other findings.</div>'}${limits}</div>`;
 const detail=visible.map(({f,i},k)=>{const applied=alreadyApplied(f),prev=visible[k-1]?.i,next=visible[k+1]?.i;return `<article class="finding" id="ps-finding-${i}" data-finding="${i}" aria-labelledby="ps-finding-title-${i}" ${i===S.findingSel?'':'hidden'}><button type="button" class="ps-back" data-ps-back>${icon('back',15)}All findings</button><div class="finding-head"><span class="tag ${E(f.severity)}">${E(label(f.severity))}</span><span class="pill">Pasal ${E(f.article_number)}</span><span class="ps-pos">${k+1} of ${visible.length}</span></div><h2 id="ps-finding-title-${i}" tabindex="-1">${E(f.title)}</h2><p class="ps-reasoning">${E(f.reasoning)}</p><div class="ps-diff-block"><div class="ps-diff-legend"><span><i class="ps-key-del"></i>Draft v${r.revision}</span><span><i class="ps-key-ins"></i>Proposed for review</span></div><div class="ps-diff">${diffHTML(f.original_text,f.proposed_text,E)}</div></div><section class="ps-sources"><h3>Sources (${f.evidence.length})</h3>${f.evidence.map(source).join('')||'<p class="micro">No source quotes were retrieved for this finding.</p>'}</section>${legalValidation(f)}<details class="ps-alt-reading"><summary>Alternative reading & review questions</summary><p>${E(f.counterargument)}</p>${limitations(f.review_questions)}</details><div class="finding-bottom" data-category="${E(f.category)}"><span class="micro">${E(label(f.category))} · Needs expert review</span><div class="ps-detail-actions"><span class="ps-pager"><button type="button" class="btn" data-ps-finding="${prev??''}" ${prev===undefined?'disabled':''} aria-label="Previous finding">${icon('back',15)}</button><button type="button" class="btn" data-ps-finding="${next??''}" ${next===undefined?'disabled':''} aria-label="Next finding">${icon('arrow',15)}</button></span>${applied?`<span class="ps-applied">${icon('check',14)}Already in the draft</span>`:btn('Apply to draft','apply',`data-index="${i}" ${stale(r)?`disabled aria-describedby="ps-reason-${i}"`:''}`,true)}</div></div>${!applied&&stale(r)?`<p class="ps-reason" id="ps-reason-${i}">${icon('attention',14)}This proposal was made on v${r.revision}; the draft is now v${rev}. Re-check v${rev} before applying it.</p>`:''}</article>`;}).join('');
 return studioStage(primary,summary+demoNote()+banner+`<div class="ps-verify">${list}<div class="ps-detail-col">${detail}</div></div>`);
}
function showFinding(index,focusHeading=false){
 if(!Number.isInteger(index))return;
 S.findingSel=index;
 document.querySelectorAll('.ps-finding-item').forEach(el=>el.setAttribute('aria-selected',String(Number(el.dataset.psFinding)===index)));
 document.querySelectorAll('.ps-detail-col .finding').forEach(el=>el.hidden=Number(el.dataset.finding)!==index);
 $('.ps-verify')?.classList.add('is-detail');
 if(focusHeading)$('#ps-finding-title-'+index)?.focus({preventScroll:true});
 if(window.innerWidth<=860)$('.ps-detail-col')?.scrollIntoView({block:'start',behavior:'instant'});
}
function altDiffHTML(){return sameText(S.alt,draftText())?'<p class="ps-diff-empty">No differences yet. B reads exactly like the draft.</p>':diffHTML(draftText(),S.alt,E);}
function altStatus(){if(sameText(S.alt,draftText()))return 'B is identical to draft A. Edit B or start from Verify proposals, then compare.';const diff=wordDiff(draftText(),S.alt);return diff?`B differs from A: ${plural(diff.added,'word')} added, ${plural(diff.removed,'word')} removed.`:'B differs from A.';}
let altTimer;
function updateAltPreview(){
 const same=sameText(S.alt,draftText()),diff=$('#ps-alt-diff'),status=$('#ps-alt-status'),compare=$('#ps-compare');
 if(diff)diff.innerHTML=altDiffHTML();
 if(status){status.textContent=altStatus();status.classList.toggle('is-same',same);}
 if(compare&&!readOnlyRole()){compare.disabled=same;compare.title=same?'Alternative B is identical to the draft':'';}
}
function simulation(){
  const r=last('simulation'),p=r?.payload,ass=S.simAss||p?.assumptions||defaultAssumptions;
  if(!S.alt)S.alt=(r&&!stale(r)&&p.alternative_text)||draftText();
  if(!S.simSection)S.simSection='projection';

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
    body=`${socialShell(S.socialConfig,`${p?'A/B projection v'+r.revision+': access <b>'+p.A.access_pct+'% → '+p.B.access_pct+'%</b>'+(stale(r)?' · older result':''):'No A/B projection yet.'} <button type="button" class="text-button" data-action="sim-section" data-section="projection">${p?'Edit assumptions':'Prepare the comparison'}</button>`)}
    <details class="panel social-data" style="margin-top:16px"><summary>Review draft B & assumption parameters</summary><label for="alternative">Alternative B</label><textarea id="alternative" rows="6">${E(S.alt)}</textarea>${assumptionInputs(ass)}<p class="micro">A uses the saved draft. B uses the alternative above. Personas evaluate these articles.</p></details>`;
  } else if(S.simSection==='unified'){
    const socialRun=last('social'),sp=socialRun?.payload;
    const socialPersonas=sp?.personas||[];
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
      ${p?`<section class="policy-matrix-card"><div class="matrix-head"><div class="matrix-title"><span class="matrix-badge">FOLLOW-UP</span><h3>Review mitigations before applying</h3></div><div class="matrix-actions">${btn('Review alternative B','apply-alt',stale(r)?'disabled':'',true)}${btn('Review in Activity','review',`data-run="${r.id}"`)}</div></div><div class="matrix-grid">${p.stakeholders.map(st=>`<div class="matrix-col"><h4>${E(st.stakeholder)}</h4><ul>${st.mitigations.map(m=>`<li>${E(m)}</li>`).join('')}</ul></div>`).join('')}</div><p class="micro">Projections and synthetic opinions support review; they do not replace public consultation.</p></section>`:''}
    </div>`;
  } else {
    const proposals=(last('analysis')?.payload.findings||[]).filter(f=>f.proposed_text?.trim()).length;
    const results=p?`<div class="scenario-grid">${['A','B'].map(k=>`<section class="scenario ${k==='B'?'b':''}"><div class="eyebrow">ALTERNATIVE ${k}</div><h3>${k==='A'?'Draft at comparison time':'Comparison text'}</h3><div class="number">${p[k].access_pct}%</div><div class="micro">Access in the assumption model</div><div class="bar"><span style="width:${p[k].access_pct}%"></span></div><dl>${[['Applicants served',fmt(p[k].served)],['Not served',fmt(p[k].unserved)],['Variable cost',rup(p[k].cost)],['Staff workdays',fmt(p[k].staff_days)],['Assistance channel detected',p.assistance_detection[k]?'Yes':'No']].map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl></section>`).join('')}</div><div class="delta-banner"><div><b>${p.delta.served>=0?'+':''}${fmt(p.delta.served)}</b><small>APPLICANTS SERVED</small></div><div><b>${p.delta.access_points} pts</b><small>ACCESS CHANGE</small></div><div><b>${rup(p.delta.cost)}</b><small>COST CHANGE</small></div></div>
    <details class="ps-fold-card"><summary>Stakeholder benefits & risks (${p.stakeholders.length})${icon('down',16)}</summary><div class="persona-grid">${p.stakeholders.map(s=>`<section class="persona"><h3>${E(s.stakeholder)}</h3>${[['BENEFITS',s.benefits],['RISKS',s.risks],['MITIGATIONS',s.mitigations]].map(([k,v])=>`<strong>${k}</strong><ul>${v.map(x=>`<li>${E(x)}</li>`).join('')}</ul>`).join('')}<details><summary>Validation & sources</summary>${limitations(s.questions_to_validate)}${p.evidence.filter(a=>s.evidence_ids.includes(a.id)).map(source).join('')}</details></section>`).join('')}</div></details>
    <details class="ps-fold-card"><summary>Sensitivity ±10 points & formula${icon('down',16)}</summary><table><thead><tr><th>Digital access input</th><th>Access A</th><th>Access B</th></tr></thead><tbody>${p.sensitivity.map(x=>`<tr><td>${x.digital_access_pct}%</td><td>${x.A}%</td><td>${x.B}%</td></tr>`).join('')}</tbody></table><p class="inline-code">${E(p.A.formula)}</p>${limitations(p.limitations)}</details>
    <div class="ps-result-actions">${btn('Review & apply B','apply-alt',stale(r)?'disabled title="This comparison is from an older version. Compare again."':'',true)}${btn('Review in Activity','review',`data-run="${r.id}"`)}<span class="micro">${E(label(r.review_status))}</span></div>`:'';
    body=`<div class="ps-impact">
    <section class="ps-card" aria-labelledby="ps-b-title"><div class="ps-card-head"><span class="ps-num" aria-hidden="true">1</span><div><h2 id="ps-b-title">Alternative B</h2><p>A is the saved draft (v${S.draft.revision}). Write B as the wording you want to compare.</p></div><div class="ps-card-tools">${btn('Start from Verify proposals','alt-from-proposals',proposals?'':'disabled title="Run Verify sources to get proposals first"')}${btn('Reset to draft A','copy')}</div></div><div class="ps-alt-grid"><div class="ps-alt-edit"><label for="alternative">Text of B</label><textarea id="alternative" rows="14" aria-describedby="ps-alt-status">${E(S.alt)}</textarea></div><div class="ps-alt-diff-wrap"><span class="ps-label">Changes from A</span><div id="ps-alt-diff" class="ps-diff ps-alt-diff">${altDiffHTML()}</div></div></div><p id="ps-alt-status" class="ps-alt-status ${sameText(S.alt,draftText())?'is-same':''}" role="status">${altStatus()}</p></section>
    <section class="ps-card"><div class="ps-card-head"><span class="ps-num" aria-hidden="true">2</span><div><h2>Assumptions</h2><p>Example starting numbers. Replace them with field data; each result keeps the values used when it ran.</p></div></div><div class="ps-assumptions">${assumptionInputs(ass)}</div></section>
    <section class="ps-card ps-results"><div class="ps-card-head"><span class="ps-num" aria-hidden="true">3</span><div><h2>Results</h2><p>${p?`Compared on v${r.revision}${stale(r)?' · older result: the draft is now v'+S.draft.revision+', compare again':''}`:'Use Compare A/B above once B differs from A.'}</p></div></div>${results}</section></div>`;
  }
  const primary=S.simSection==='projection'?btn('Compare A/B','simulate',`id="ps-compare" ${sameText(S.alt,draftText())?'disabled title="Alternative B is identical to the draft"':''}`,true):'';
  return studioStage(primary,subNav+demoNote()+`<div id="simulation-content" role="tabpanel" aria-labelledby="sim-tab-${S.simSection}">${body}</div>`);
}
function library(){if(S.libraryTab==='documents'&&!S.gallery.list)queueMicrotask(()=>loadLibraryList());return libraryPage(S,E,icon);}
const activityCtx={E,fmt,rup,source,limitations};
function history(){if(S.activity.versionsKey!==S.draft.id+':'+S.draft.revision)queueMicrotask(loadVersions);return activityPage(S,activityCtx);}
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
 <details class="source-details"><summary>Advanced configuration</summary><p class="micro">${readiness.project_configured?'Project configured · ':''}Model ${E(readiness.model||'Demo')} · Location ${E(readiness.location)} · Retrieval ${E(readiness.search_backend)}.</p><p class="micro">Embeddings use ${E(readiness.embedding_location)} when Elasticsearch is active. Change the model, location or search backend in .env.</p><label for="token">Workspace access token (optional)</label><input id="token" type="password" autocomplete="off"><p class="micro">The workspace token is different from a Google key. Only needed when the server enables restricted access.</p>${btn('Save token','token')}</details>
 <p class="micro integration-notice">The connection test sends one model request. If Elasticsearch is active, an embedding query is also sent. Usage follows the project quota and billing.</p>`,btn('Refresh status','open-settings')+btn(readiness.provider==='demo'?'Check demo mode':'Test Gemini connection','probe-ai',isAdmin?'':'disabled',true)+btn('Close','close'));
}
function collect(){if(S.view!=='editor')return;Object.assign(S.draft,{title:$('#draft-title').value,regulation_type:$('#reg-type').value,scope:$('#scope').value,preamble:$('#preamble').value,document_heading:$('#document-heading')?.value||S.draft.document_heading||'',closing:$('#draft-closing')?.value||S.draft.closing||'',explanation:$('#draft-explanation')?.value||S.draft.explanation||'',attachments:$('#draft-attachments')?.value||S.draft.attachments||'',articles:S.draft.articles.map((a,i)=>({number:$(`[data-number="${i}"]`).value,text:$(`[data-article="${i}"]`).value,chapter:$(`[data-chapter="${i}"]`)?.value||a.chapter||''}))});}
async function save(){collect();if(!S.dirty)return;S.draft=await api('/drafts/'+S.draft.id,'PUT',{...S.draft,expected_revision:S.draft.revision});S.dirty=false;const status=$('#save-state');if(status){status.textContent='Saved · v'+S.draft.revision;status.classList.remove('dirty');}S.drafts=await api('/drafts');}
async function refresh(){S.drafts=await api('/drafts');S.jobs=await api('/drafts/'+S.draft.id+'/agent-jobs');S.runs=await api('/drafts/'+S.draft.id+'/runs');}
function routeURL(){
 const params=new URLSearchParams({view:workflowViews.includes(S.view)?'studio':activityViews.includes(S.view)?'activity':S.view});
 if(workflowViews.includes(S.view))params.set('stage',S.view);
 if(S.view==='history'){const a=S.activity,item=a.item==='job:latest'?(S.jobs[0]?'job:'+S.jobs[0].id:''):a.item;if(a.status)params.set('status',a.status);if(a.kind!=='all')params.set('type',a.kind);if(item)params.set('item',item);}
 if(S.draft?.id)params.set('draft',S.draft.id);
 if(S.view==='simulation'&&S.simSection!=='projection')params.set('sub',S.simSection);
 if(S.view==='library'){if(S.libraryTab==='passages')params.set('tab','passages');if(S.searchQuery)params.set('q',S.searchQuery);if(S.gallery.doc){params.set('doc',S.gallery.doc.id);if(S.gallery.articleNumber)params.set('article',S.gallery.articleNumber);}}
 if(S.view==='data')for(const [key,value] of Object.entries(S.collectionFilters||{}))if(value)params.set(key,value);
 return '/workspace?'+params;
}
function syncRoute(){try{window.history?.replaceState?.(null,'',routeURL());}catch{}}
async function select(id){
 await save();
 // Commit selection only after every dependent resource has loaded.
 const [draft,runs,jobs]=await Promise.all([api('/drafts/'+id),api('/drafts/'+id+'/runs'),api('/drafts/'+id+'/agent-jobs')]);
 Object.assign(S,{draft,runs,jobs,alt:'',simAss:null,socialPreview:null,dirty:false,findingFilter:'all',findingSel:null,focusArticle:null});Object.assign(S.activity,{item:null,detail:false,versions:null,versionsKey:null});
 render();watchAgents();
}
async function view(v,push=true){
 const previous=routeURL();await save();
 if(v==='studio')S.view=S.lastStudioView;
 else if(v==='activity'||v==='history')S.view='history';
 else if(v==='agents'){Object.assign(S.activity,{item:'job:latest',detail:true,status:'all',kind:'all'});S.view='history';}
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
   S.simSection=['projection','social','unified'].includes(params.get('sub'))?params.get('sub'):'projection';S.libraryTab=destination==='corpus'||params.get('tab')==='passages'?'passages':'documents';if(canonicalView(destination)==='history')Object.assign(S.activity,activityFromURL(params,destination==='agents'),{sheet:false});if(canonicalView(destination)==='library')await restoreLibraryDocument(params);await view(destination,false);
 });}catch(error){syncRoute();toast(error.message,true);displayError(error);}
});
async function download(path,name){const t=sessionStorage.getItem('rulelab_token');const r=await fetch('/api'+path,{headers:t?{Authorization:'Bearer '+t}:{}});if(!r.ok)throw Error('Download failed. Check the token and document.');const u=URL.createObjectURL(await r.blob()),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);}
async function compareSelectors(k){const d=await api('/corpus/'+$('#cmp-'+k).value);$('#art-'+k).innerHTML=d.articles.map(a=>`<option value="${E(a.number)}">Pasal ${E(a.number)}</option>`).join('');}
const actions={close,'open-settings':settings,'retry-init':()=>{disposePageComponents();$('#main').innerHTML=skeleton();return init();},'legal-guide':showLegalGuide,token:async()=>{sessionStorage.setItem('rulelab_token',$('#token').value);close();await init();},
'collection-refresh':()=>render(),
'collection-upload':async()=>{collectionData=collectionData||await api('/data/overview');modal('Upload regulation source',sourceFormHTML('upload',collectionData.provinces),btn('Cancel','close')+btn('Save to queue','collection-submit','',true));},
'collection-jdih':async()=>{collectionData=collectionData||await api('/data/overview');modal('Add JDIH link',sourceFormHTML('jdih',collectionData.provinces),btn('Cancel','close')+btn('Register link','collection-submit','',true));},
'collection-submit':async()=>{const result=await api('/data/intake','POST',await readSourceForm());close();render();toast(result.duplicate?'The same source is already in the queue.':'Source saved to the review queue.');},
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
copy:()=>{S.alt=draftText();$('#alternative').value=S.alt;updateAltPreview();},
simulate:async()=>{const assumptions=$('#ass-population')?readAssumptions():S.simAss||last('simulation')?.payload.assumptions||defaultAssumptions;const alternative=$('#alternative')?.value??(S.alt||draftText());if(alternative.trim().length<10)throw Error('Alternative B must be at least 10 characters before running the simulation.');if(sameText(alternative,draftText()))throw Error('Alternative B is identical to the draft. Edit B or start from Verify proposals before comparing.');await save();S.alt=alternative;S.simAss=assumptions;toast('Comparing A and B and stakeholder perspectives…');await api('/drafts/'+S.draft.id+'/simulate','POST',{alternative_text:S.alt,assumptions});await refresh();render();toast('Comparison complete. Results depend on the assumptions.');},
'apply-alt':()=>{const r=last('simulation');if(S.dirty||stale(r))throw Error('Simulation is from an older version.');modal('Review alternative B',`<div class="note">The applied text is the simulated alternative B. Run a conflict check after the revision.</div><div class="quote" style="max-height:400px">${E(r.payload.alternative_text)}</div>`,btn('Cancel','close')+btn('Apply new version','confirm-alt','',true));},
'confirm-alt':async()=>{if(S.dirty||stale(last('simulation')))throw Error('Draft changed. Run the simulation again.');const text=last('simulation').payload.alternative_text,m=[...text.matchAll(/^[ \t]*Pasal[ \t]+(\d+[A-Z]?|I|II)[ \t]*$/gm)];if(!m.length)throw Error('Put headings Pasal 1, Pasal 2 on their own lines.');const articles=m.map((x,i)=>({number:x[1],chapter:S.draft.articles.find(a=>a.number===x[1])?.chapter||'',text:text.slice(x.index+x[0].length,i+1<m.length?m[i+1].index:text.length).trim()}));S.draft=await api('/drafts/'+S.draft.id,'PUT',{...S.draft,articles,expected_revision:S.draft.revision});close();S.dirty=false;await refresh();S.alt='';S.view='editor';render();toast('Alternative applied. Run the check again.');},
export:async()=>{await save();await download('/drafts/'+S.draft.id+'/export','rulelab-draft.docx');render();},report:async()=>{if(!last('analysis'))throw Error('Run a check first to create a report.');await download('/drafts/'+S.draft.id+'/export?format=report','rulelab-review.docx');},
'law-json':el=>download('/corpus/'+el.dataset.id+'/json',el.dataset.id+'.json'),raw:el=>download('/corpus/'+el.dataset.id+'/raw',S.gallery.doc?.id===el.dataset.id?S.gallery.doc.provenance.raw_file.split('/').at(-1):el.dataset.id),reset:()=>{S.results=null;S.searchQuery='';S.searchResultQuery='';S.searchLimit=12;render();$('#search-q')?.focus();},
compare:async()=>{
 // The picker list is fetched once, on demand; the workspace no longer downloads the whole corpus at startup.
 S.corpusIndex=S.corpusIndex||await api('/corpus/index');
 const index=S.corpusIndex,options=index.map(d=>`<option value="${E(d.id)}">${E(d.label)} · ${E(d.title)}</option>`).join('');
 modal('Compare two articles',`<div class="note">Demo provides the source and hierarchy comparison. Gemini analyzes potential conflicts between the two selected articles.</div><div class="form-grid">${['left','right'].map(k=>`<div><label for="cmp-${k}">Source ${k==='left'?'A':'B'}</label><select id="cmp-${k}" data-cmp="${k}">${options}</select><label for="art-${k}" style="margin-top:10px">Pasal</label><select id="art-${k}"></select></div>`).join('')}</div><div id="compare-result"></div>`,btn('Compare','run-compare','',true));
 const left=S.gallery.doc?.id||index.find(d=>d.articles>0)?.id;$('#cmp-left').value=left;$('#cmp-right').value=index.find(d=>d.id!==left&&d.articles>0)?.id||left;
 await Promise.all(['left','right'].map(compareSelectors));
 if(S.gallery.doc&&S.gallery.doc.articles.some(a=>a.number===S.gallery.articleNumber)){$('#art-left').value=S.gallery.articleNumber;$('#art-left').dispatchEvent(new Event('rulelab:sync'));}
},
'run-compare':async()=>{const r=await api('/compare','POST',{left_id:$('#cmp-left').value,right_id:$('#cmp-right').value,left_article:$('#art-left').value,right_article:$('#art-right').value});$('#compare-result').innerHTML=`<div class="relation">${E(r.hierarchy_relation)}</div><div class="comparison">${[r.left,r.right].map(a=>`<div><h3>${E(a.regulation_label)} · Article ${E(a.number)}</h3><div class="quote">${E(a.text)}</div><a class="micro" href="${E(a.source.url)}" target="_blank" rel="noopener">Official source ↗</a></div>`).join('')}</div><p class="help-text">${E(r.summary)}</p>${r.findings.map(f=>`<div class="note"><b>${E(f.title)}</b><br>${E(f.reasoning)}<br>${E(f.counterargument)}</div>`).join('')}${limitations(r.limitations)}`;},
'save-review':async el=>{const status=document.querySelector('input[name="review-status"]:checked')?.value||'needs_review';await api('/runs/'+el.dataset.run+'/review','POST',{status,notes:$('#review-notes').value});S.runs=await api('/drafts/'+S.draft.id+'/runs');paintActivity();refreshFrameworkStatus(S);toast('Review decision saved.');},
review:el=>{Object.assign(S.activity,{item:'run:'+el.dataset.run,detail:true,status:'all',kind:'all'});return view('history');},
versions:()=>{Object.assign(S.activity,{item:'version:'+S.draft.revision,detail:true,status:'all',kind:'all'});return view('history');},
import:()=>modal('Import draft','<p class="help-text">TXT, JSON DraftInput, DOCX or text PDF. The “Pasal 1” heading must be on its own line. Max 10MB. Scanned PDFs need OCR first.</p><input id="import-file" type="file" accept=".txt,.json,.docx,.pdf">',btn('Import','run-import','',true)),
'run-import':async()=>{await save();const f=$('#import-file').files[0];if(!f)throw Error('Choose a file.');if(f.size>10*1024*1024)throw Error('Maximum 10MB.');const b64=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(',')[1]);r.onerror=reject;r.readAsDataURL(f);});const d=await api('/import','POST',{filename:f.name,content_base64:b64});close();S.drafts=await api('/drafts');await select(d.id);S.view='editor';render();toast('Draft imported.');}
};
document.addEventListener('click',async e=>{
 const el=e.target.closest('[data-action],button[data-view],a[data-view]');if(!el||el.disabled||isBusy())return;
 const kind=el.dataset.view?'navigate':el.dataset.action;
 try{el.disabled=true;await withLoading(kind,()=>el.dataset.view?view(el.dataset.view):actions[el.dataset.action]?.(el));}
 catch(err){toast(err.message,true);displayError(err);}
 finally{if(el.isConnected)el.disabled=false;agentControls();
  if(el.dataset.action==='library-tab')document.querySelector('#library-tab-'+S.libraryTab)?.focus({preventScroll:true});
  if(el.dataset.action==='library-ask-source')$('#gallery-question')?.focus({preventScroll:true});
  if(el.dataset.action==='library-read-source')$('#gallery-reader')?.focus({preventScroll:true});
  if(['library-search','reset'].includes(el.dataset.action))$('#search-q')?.focus({preventScroll:true});
  if(el.closest('.ps-steps'))document.querySelector('#workflow-stage-'+S.view)?.focus({preventScroll:true});
  if(['gallery-prompt','gallery-retry','gallery-clear'].includes(el.dataset.action))$('#gallery-question')?.focus();
  if(el.dataset.action==='jump-article')document.querySelector('[data-article="'+el.dataset.index+'"]').focus({preventScroll:true});
 }
});
document.addEventListener('input',e=>{if(e.target.id.startsWith('ass-')){S.simAss={...(S.simAss||last('simulation')?.payload.assumptions||defaultAssumptions),[e.target.id.slice(4)]:Number(e.target.value)};}if(e.target.id==='search-q')S.searchQuery=e.target.value;if(e.target.id==='legal-date')S.asOf=e.target.value;if(e.target.id==='alternative'||e.target.id==='agent-alternative')S.alt=e.target.value;if(e.target.id==='alternative'&&$('#ps-alt-diff')){clearTimeout(altTimer);altTimer=setTimeout(updateAltPreview,180);}if(S.view==='editor'&&e.target.closest('#main')&&e.target.matches('#draft-title,#reg-type,#scope,#preamble,#document-heading,#draft-closing,#draft-explanation,#draft-attachments,[data-chapter],[data-number],[data-article]'))markDirty();});
function markDirty(){
 const first=!S.dirty;S.dirty=true;
 const step=$('#workflow-stage-editor');if(step){step.querySelector('small').textContent='Not saved';step.classList.replace('is-done','is-warn');}
 const x=$('#save-state');if(x){x.textContent='Not saved';x.classList.add('dirty');}
 if(first)refreshInsights();
}
document.addEventListener('change',async e=>{if(isBusy())return;try{
 if(e.target.id==='draft-select')await withLoading('navigate',()=>select(e.target.value));
 if(e.target.dataset.cmp)await withLoading('navigate',()=>compareSelectors(e.target.dataset.cmp));
 if(e.target.id==='reg-type')markDirty();
 if(e.target.id==='agent-intent'){S.agentIntent=e.target.value;$('.act-sheet')?.setAttribute('data-intent',e.target.value);}
 if(e.target.id==='activity-kind'){S.activity.kind=e.target.value;refilterActivity();}
 if(e.target.closest('.draft-builder')){S.builderResult=null;$('#builder-preview-status').textContent='Input changed · preview again';updateBuilderNote(S.catalog);}
 if(['social-persona-count','social-round-count','social-crowd-size'].includes(e.target.id)){collect();S.socialConfig={persona_count:Number($('#social-persona-count').value),rounds:Number($('#social-round-count').value),crowd_size:Number($('#social-crowd-size').value)};await withLoading('social-config',async()=>{S.socialPreview=(await api('/social/personas?draft_id='+S.draft.id+'&count='+S.socialConfig.persona_count)).personas;render();});}
}catch(err){if(e.target.id==='draft-select'){e.target.value=S.draft.id;e.target.dispatchEvent(new Event('rulelab:sync'));}toast(err.message,true);displayError(err);}});
 document.addEventListener('submit',async e=>{if(e.target.id!=='search-form')return;e.preventDefault();if(isBusy())return;const q=$('#search-q').value.trim();S.searchQuery=q;
 if(S.libraryTab==='documents'){clearTimeout(libraryTimer);S.searchQuery=q.slice(0,200);syncRoute();return loadLibraryList();}
 S.searchLimit=12;
 try{await withLoading('search',async()=>{S.results=(await api('/search?q='+encodeURIComponent(q)+'&limit='+S.searchLimit)).results;S.searchResultQuery=q;render();$('#search-q').value=q;});$('#search-q')?.focus({preventScroll:true});}
 catch(err){toast(err.message,true);}});

$('#settings-btn').addEventListener('click',async()=>{if(isBusy())return;try{await withLoading('open-settings',settings);}catch(err){toast(err.message,true);}});$('#progress-modal').addEventListener('cancel',e=>e.preventDefault());window.addEventListener('beforeunload',e=>{if(S.dirty){e.preventDefault();e.returnValue='';}});
async function init(){try{[S.status,S.drafts,S.catalog]=await Promise.all([api('/status'),api('/drafts'),api('/drafting/templates')]);if(!S.drafts.length)throw Error('No initial draft yet.');S.draft=S.drafts.find(d=>d.id===_urlP.get('draft'))||S.drafts[0];S.runs=await api('/drafts/'+S.draft.id+'/runs');S.jobs=await api('/drafts/'+S.draft.id+'/agent-jobs');watchAgents();$('#provider-pill').textContent=S.status.provider==='demo'?'Demo mode · no LLM':'Gemini · '+S.status.provider;$('#provider-pill').className='pill '+(S.status.provider==='demo'?'amber':'green');$('#corpus-pill').textContent=S.status.regulations+' regulations · '+S.status.articles+' articles/blocks';if(S.view==='library'){await restoreLibraryDocument(_urlP);if(S.libraryTab==='passages'&&S.searchQuery.length>=2){try{S.results=(await api('/search?q='+encodeURIComponent(S.searchQuery)+'&limit=12')).results;S.searchResultQuery=S.searchQuery;}catch{}}}render();}catch(err){disposePageComponents();$('#main').innerHTML=`<div class="error-state"><h2>Workspace could not be loaded</h2><p>${E(err.message)}</p><p>Check the server and configuration, then try again.</p>${btn('Try again','retry-init')}${btn('Settings','open-settings')}</div>`;toast(err.message,true);}}
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

actions['open-forum-graph']=el=>openForumGraph(el.dataset.entity);
actions['open-finding']=el=>{S.findingFilter='all';S.findingSel=Number(el.dataset.index);return view('analysis');};
actions['ask-library']=async el=>{
 collect();const a=S.draft.articles[Number(el.dataset.index)];if(!a)return;
 S.gallery.question=`Which regulations relate to this draft article, and could anything conflict with it?\n\nPasal ${a.number}: ${a.text}`.slice(0,1500);
 S.gallery.chatFolded=false;S.gallery.scopeId='';S.libraryTab='documents';
 await view('library');$('#gallery-question')?.scrollIntoView({block:'center',behavior:'instant'});
};
actions['alt-from-proposals']=()=>{
 const r=last('analysis');if(!r)throw Error('Run Verify sources first to get proposals.');
 const result=alternativeFromProposals(S.draft.articles,r.payload.findings);
 if(!result.used)throw Error('The last check has no proposals for articles in this draft.');
 S.alt=result.text;$('#alternative').value=S.alt;updateAltPreview();
 toast(`B now uses ${plural(result.used,'proposal')} from the check on v${r.revision}${result.duplicates?` (${result.duplicates} more for the same articles skipped)`:''}${stale(r)?'. That check is from an older version':''}. Review the changes before comparing.`);
};
// Pure view interactions (no server call) stay outside the busy/progress wrapper.
function closeStudioMenu(focusToggle=false){const menu=$('.ps-menu:not([hidden])');if(!menu)return;menu.hidden=true;const toggle=menu.previousElementSibling;toggle.setAttribute('aria-expanded','false');if(focusToggle)toggle.focus();}
document.addEventListener('click',e=>{
 const more=e.target.closest('[data-ps-more]');
 if(more){const menu=more.nextElementSibling,open=menu.hidden;closeStudioMenu();if(open){menu.hidden=false;more.setAttribute('aria-expanded','true');menu.querySelector('[role=menuitem]:not([disabled])')?.focus();}return;}
 if(!e.target.closest('.ps-menu'))closeStudioMenu();else if(e.target.closest('[role=menuitem]'))closeStudioMenu();
 const finding=e.target.closest('[data-ps-finding]');
 if(finding&&finding.dataset.psFinding!==''&&!finding.disabled){const fromPager=!finding.classList.contains('ps-finding-item');showFinding(Number(finding.dataset.psFinding),fromPager||window.innerWidth<=860);return;}
 if(e.target.closest('[data-ps-back]')){$('.ps-verify')?.classList.remove('is-detail');$('#ps-fi-'+S.findingSel)?.focus();$('.ps-list-col')?.scrollIntoView({block:'start',behavior:'instant'});return;}
 const jump=e.target.closest('[data-ps-jump]');
 if(jump){const target=document.getElementById(jump.dataset.psJump);if(target){target.open=true;target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});target.querySelector('summary')?.focus({preventScroll:true});}return;}
 if(e.target.closest('[data-ps-insights]')){const open=!document.body.classList.contains('ps-insights-open');document.body.classList.toggle('ps-insights-open',open);$('.ps-insights-toggle')?.setAttribute('aria-expanded',String(open));if(open)$('#ps-insights')?.focus?.();}
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&$('.ps-menu:not([hidden])')){e.preventDefault();closeStudioMenu(true);return;}
 if(e.key==='Escape'&&document.body.classList.contains('ps-insights-open')){document.body.classList.remove('ps-insights-open');$('.ps-insights-toggle')?.setAttribute('aria-expanded','false');return;}
 const item=e.target.closest?.('.ps-menu [role=menuitem]');
 if(item&&['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const items=[...item.parentElement.querySelectorAll('[role=menuitem]:not([disabled])')],i=items.indexOf(item);items[e.key==='Home'?0:e.key==='End'?items.length-1:(i+(e.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus();return;}
 if(S.view!=='analysis'||e.ctrlKey||e.metaKey||e.altKey||isBusy()||document.querySelector('dialog[open]'))return;
 const inList=e.target.closest?.('.ps-finding-item');
 const key=inList&&e.key==='ArrowDown'?'j':inList&&e.key==='ArrowUp'?'k':e.key.toLowerCase();
 if(!['j','k'].includes(key)||(!inList&&e.target.closest?.('input,textarea,select,[contenteditable]')))return;
 const items=[...document.querySelectorAll('.ps-finding-item')],i=items.findIndex(x=>Number(x.dataset.psFinding)===S.findingSel),next=items[Math.min(items.length-1,Math.max(0,i+(key==='j'?1:-1)))];
 if(!next)return;e.preventDefault();showFinding(Number(next.dataset.psFinding));if(inList)next.focus();
});
document.addEventListener('focusin',e=>{
 if(S.view!=='editor')return;const card=e.target.closest?.('.article-card');if(!card)return;
 document.querySelectorAll('.article-card').forEach(c=>c.classList.toggle('article-active',c===card));
 const index=Number(card.id.replace('article-',''));if(index!==S.focusArticle){S.focusArticle=index;refreshInsights();}
});
actions['jump-article']=el=>{document.body.classList.remove('ps-insights-open');document.querySelector('.ps-insights-toggle')?.setAttribute('aria-expanded','false');document.querySelector('#article-'+el.dataset.index)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'});document.querySelector('[data-article="'+el.dataset.index+'"]').focus({preventScroll:true});};
actions['analyze-inline']=async()=>{await save();toast('Checking the draft and retrieving related sources…');await api('/drafts/'+S.draft.id+'/analyze','POST',{as_of_date:S.asOf});await refresh();render();toast('Check complete. Findings now appear next to each article.');};
document.addEventListener('keydown',e=>{if(!e.target.matches('.sim-unified-nav [role=tab]')||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)||isBusy())return;e.preventDefault();const tabs=[...e.target.closest('[role=tablist]').querySelectorAll('[role=tab]')],i=tabs.indexOf(e.target),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].click();});

function filterBar(kind,options,current){return `<div class="filter-bar" aria-label="Filter ${E(kind)}">${options.map(([key,title,count])=>`<button data-action="filter-${kind}" data-filter="${E(key)}" aria-pressed="${current===key}">${E(title)}${count!==undefined?`<span>${count}</span>`:''}</button>`).join('')}</div>`;}
actions['filter-findings']=el=>{S.findingFilter=el.dataset.filter;render();};

actions['toggle-assistant']=()=>{if(S.gallery.chatSheet)S.gallery.chatSheet=false;else S.gallery.chatFolded=!S.gallery.chatFolded;render();};
actions['library-tab']=el=>{
 const next=el.dataset.tab==='passages'?'passages':'documents';
 if(next===S.libraryTab)return;
 S.libraryTab=next;S.gallery.reading=false;
 if(next==='documents')S.gallery.list=null;
 window.history.pushState(null,'',routeURL());render();
};
actions['library-search']=async el=>{
 const query=el.dataset.query;
 S.searchQuery=query;S.searchLimit=12;S.results=(await api('/search?q='+encodeURIComponent(query)+'&limit=12')).results;S.searchResultQuery=query;render();
};
actions['library-search-more']=async()=>{S.searchLimit=Math.min(60,S.searchLimit+12);S.results=(await api('/search?q='+encodeURIComponent(S.searchResultQuery)+'&limit='+S.searchLimit)).results;paintLibraryResults();};
actions['library-more']=()=>loadLibraryList(true);
actions['lib-back']=()=>{S.gallery.reading=false;render();$('[data-lib-results]')?.scrollIntoView({block:'start',behavior:'instant'});};
actions['lib-scope-clear']=()=>{S.gallery.scopeId='';S.gallery.scopeLabel='';render();$('#gallery-question')?.focus();};
actions['lib-scope-doc']=()=>{const d=S.gallery.doc;if(!d)return;S.gallery.scopeId=d.id;S.gallery.scopeLabel=d.metadata.type+' '+d.metadata.number+'/'+d.metadata.year;render();$('#gallery-question')?.focus();};
actions['lib-chat-sheet']=()=>{S.gallery.chatSheet=!S.gallery.chatSheet;S.gallery.chatFolded=false;render();if(S.gallery.chatSheet)$('#gallery-question')?.focus();};
actions['lib-copy-citation']=async()=>{
 const d=S.gallery.doc,a=d?.articles.find(x=>x.number===S.gallery.articleNumber)||d?.articles[0];if(!a)return;
 const text=citationText(d,a);
 try{await navigator.clipboard.writeText(text);toast('Citation copied: '+text);}catch{toast('Copy this citation: '+text);}
};
actions['library-read-source']=el=>openLibrarySource(el.dataset.result);
actions['library-ask-source']=el=>openLibrarySource(el.dataset.result,true);

// Documents come from the server page by page; typing filters after a short pause.
let libraryRequest=0,libraryTimer;
async function loadLibraryList(append=false){
 const g=S.gallery,ticket=++libraryRequest,page=append?(g.list?.page||1)+1:1;
 if(!append){g.list=null;paintLibraryResults();}
 const query=new URLSearchParams({size:'20',page:String(page),sort:g.sort||(S.searchQuery?'relevance':'year')});
 if(S.searchQuery)query.set('q',S.searchQuery.slice(0,200));if(g.type)query.set('kind',g.type);
 try{const data=await api('/data/documents?'+query);if(ticket!==libraryRequest)return;g.list=append&&g.list?{...data,items:[...g.list.items,...data.items]}:data;}
 catch(error){if(ticket!==libraryRequest)return;g.list={total:0,page:1,pages:1,items:[]};toast(error.message,true);}
 paintLibraryResults();
}
function paintLibraryResults(){if(S.view!=='library')return;const list=S.libraryTab==='documents'&&$('[data-lib-list]');if(list){list.innerHTML=documentListHTML(S,E);return;}const host=$('[data-lib-results]');if(host)host.innerHTML=resultsHTML(S,E,icon);}
function showDocument(doc,number,highlight=[]){
 const g=S.gallery;g.doc=doc;g.articleNumber=doc.articles.find(a=>a.number===number)?.number||doc.articles[0]?.number;g.highlight=highlight;g.find='';g.reading=true;
 g.scopeId=doc.id;g.scopeLabel=doc.metadata.type+' '+doc.metadata.number+'/'+doc.metadata.year;
}
async function restoreLibraryDocument(params){
 const id=params.get('doc');
 if(!id){S.gallery.doc=null;S.gallery.articleNumber=null;return;}
 try{const doc=S.gallery.doc?.id===id?S.gallery.doc:await api('/corpus/'+encodeURIComponent(id));showDocument(doc,params.get('article'),S.gallery.highlight);}
 catch{S.gallery.doc=null;S.gallery.articleNumber=null;}
}
async function openLibrarySource(resultId,ask=false){
 const result=S.results?.find(article=>article.id===resultId);
 if(!result)throw Error('Result unavailable. Run the search again.');
 const doc=await api('/corpus/'+encodeURIComponent(result.regulation_id));
 showDocument(doc,result.number,searchWords(S.searchResultQuery));
 if(ask){S.gallery.question=`Explain Article ${result.number} on ${result.regulation_label} in plain language.`;S.gallery.chatFolded=false;S.gallery.chatSheet=window.innerWidth<=1100;}
 window.history.pushState(null,'',routeURL());render();
 if(window.innerWidth<=760&&!ask)$('#gallery-reader')?.scrollIntoView({block:'start',behavior:'instant'});
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
 const stage=event.target.closest?.('.ps-step');
 if(!stage||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||isBusy())return;
 event.preventDefault();
 const tabs=[...document.querySelectorAll('.ps-step')],index=tabs.indexOf(stage);
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
// Forum results in the Activity detail: scenario tabs and round filters.
document.addEventListener('click',e=>{
 const tab=e.target.closest('[data-forum-tab]');
 if(tab){const body=tab.closest('.act-body');body.querySelectorAll('[data-forum-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b===tab)));body.querySelectorAll('.act-forum-panel').forEach(panel=>panel.hidden=panel.dataset.forumScenario!==tab.dataset.forumTab);return;}
 const round=e.target.closest('[data-forum-round]');
 if(round){const panel=round.closest('.act-forum-panel');panel.querySelectorAll('[data-forum-round]').forEach(b=>b.setAttribute('aria-pressed',String(b===round)));panel.querySelectorAll('.act-comments li').forEach(li=>li.hidden=round.dataset.forumRound!=='all'&&li.dataset.round!==round.dataset.forumRound);}
});
// The full event log of a run is only serialised when it is opened.
document.addEventListener('toggle',e=>{const d=e.target;if(!d.matches?.('.act-events')||!d.open||d.querySelector('pre').textContent)return;d.querySelector('pre').textContent=JSON.stringify(S.jobs.find(j=>j.id===d.dataset.job)?.events||[],null,2);},true);

async function watchAgents(){
 clearTimeout(agentTimer);
 if(!S.jobs.some(j=>['queued','running','cancelling'].includes(j.status)))return;
 const draftId=S.draft.id;
 agentTimer=setTimeout(async()=>{try{
  const jobs=await api('/drafts/'+draftId+'/agent-jobs');if(S.draft.id!==draftId)return;S.jobs=jobs;
  if(!jobs.some(j=>['queued','running','cancelling'].includes(j.status))){const runs=await api('/drafts/'+draftId+'/runs');if(S.draft.id!==draftId)return;S.runs=runs;}
  refreshActivity();if(S.view==='home')loadOverview();else refreshFrameworkStatus(S);updateSocial(S);agentControls();
  watchAgents();
 }catch(err){toast('Agent activity could not be loaded. Use Refresh to try again.',true);}},1200);
}
actions['start-agent']=async el=>{
 const intent=el.dataset.intent||$('#agent-intent')?.value||'full';
 const alternative=$('#alternative')?.value||$('#agent-alternative')?.value||S.alt||draftText();
 const assumptions=$('#ass-population')?readAssumptions():S.simAss||last('simulation')?.payload.assumptions||defaultAssumptions;
 if(intent!=='legal'&&alternative.trim().length<10)throw Error('Alternative B must be at least 10 characters.');
 if(el.closest('.act-sheet')&&intent!=='legal'&&sameText(alternative,draftText())){const error=Error('Alternative B is identical to the draft. Change it before comparing A and B.');error.fieldId='agent-alternative';throw error;}
 await save();S.alt=alternative;S.simAss=assumptions;
 const job=await api('/drafts/'+S.draft.id+'/agent-jobs','POST',{intent,expected_revision:S.draft.revision,alternative_text:intent==='legal'?null:alternative,assumptions,as_of_date:S.asOf,social_options:S.socialConfig},{'Idempotency-Key':crypto.randomUUID()});
 if(S.view==='history')Object.assign(S.activity,{sheet:false,item:'job:'+job.id,detail:true,status:'all',kind:'all'});
 await refresh();render();watchAgents();
};
actions['cancel-agent']=async el=>{await api('/agent-jobs/'+el.dataset.job+'/cancel','POST',{});S.jobs=await api('/drafts/'+S.draft.id+'/agent-jobs');refreshActivity();refreshFrameworkStatus(S);updateSocial(S);agentControls();watchAgents();};
actions['refresh-agents']=async()=>{await refresh();refreshActivity();refreshFrameworkStatus(S);updateSocial(S);agentControls();watchAgents();};
actions['activity-open']=el=>selectActivity(el.dataset.item,{focus:true});
actions['activity-back']=()=>{S.activity.detail=false;paintActivity({detail:false});$('#activity-timeline [aria-current="true"]')?.focus({preventScroll:false});};
actions['activity-status']=el=>{S.activity.status=el.dataset.status;if(el.dataset.kind){S.activity.kind=el.dataset.kind;const kind=$('#activity-kind');if(kind){kind.value=el.dataset.kind;kind.dispatchEvent(new Event('rulelab:sync'));}}refilterActivity();};
actions['activity-studio']=el=>{if(el.dataset.stage==='social')return view('social');if(el.dataset.stage==='simulation')S.simSection='projection';return view(el.dataset.stage);};
// The run sheet is a modal <dialog>: the top layer keeps it above the workspace bars, traps focus and handles Escape.
actions['activity-sheet']=()=>{if($('.act-sheet'))return;S.activity.sheet=true;$('#main .act').insertAdjacentHTML('beforeend',sheetHTML(S,activityCtx));$('.act-sheet').showModal();requestAnimationFrame(()=>($('#agent-intent-trigger')||$('#agent-intent'))?.focus());lockForRole($('.act-sheet'));agentControls();};
actions['activity-sheet-close']=()=>{S.activity.sheet=false;document.querySelectorAll('.act-sheet').forEach(el=>{if(el.open)el.close();el.remove();});$('[data-action="activity-sheet"]')?.focus({preventScroll:true});};
actions['audit']=async()=>{const data=await api('/audit');modal('Audit workspace',`<p class="micro">Request metadata only; document content and credentials are not logged.</p><table><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Status</th></tr></thead><tbody>${data.events.map(e=>`<tr><td>${E(new Date(e.created_at).toLocaleString('id-ID'))}</td><td>${E(e.actor)}<br>${E(e.role)}</td><td>${E(e.action)}</td><td>${e.status}</td></tr>`).join('')}</tbody></table>`);};

function agentControls(){
 const active=S.jobs.some(j=>['queued','running','cancelling'].includes(j.status));
 const role=S.status.principal?.role;
 document.querySelectorAll('#main [data-action=start-agent]').forEach(el=>{el.disabled=active||role==='viewer'||role==='reviewer';if(active)el.title='Wait for or cancel the active run before starting a new one.';});
}

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
 try{turn.answer=await api('/gallery/chat','POST',{question:q,document_id:g.scopeId||null,history});if(turn.answer.status==='answered'&&turn.answer.documents.length===1){g.scopeId=turn.answer.documents[0].id;g.scopeLabel=turn.answer.documents[0].label;}g.question='';}
 catch(error){turn.error=error.message;g.question=q;throw error;}
 finally{turn.pending=false;render();document.querySelector('.gallery-transcript')?.lastElementChild?.scrollIntoView({behavior:'instant',block:'nearest'});}
}
actions['gallery-open']=async el=>{const doc=await api('/corpus/'+encodeURIComponent(el.dataset.id));showDocument(doc,null,S.libraryTab==='documents'?[]:S.gallery.highlight);render();if(window.innerWidth<=760)$('#gallery-reader')?.scrollIntoView({block:'start',behavior:'instant'});};
actions['gallery-reader-mode']=el=>{S.gallery.readerMode=el.dataset.mode||'formatted';render();};
actions['gallery-step-article']=el=>{if(!el.dataset.article)return;S.gallery.articleNumber=el.dataset.article;if(el.closest('.lib-toc'))S.gallery.tocOpen=false;render();};
actions['gallery-prompt']=el=>{S.gallery.chatFolded=false;S.gallery.question=el.dataset.question;render();$('#gallery-question')?.focus();};
actions['gallery-clear']=()=>{S.gallery.chatFolded=false;S.gallery.turns=[];S.gallery.question='';render();$('#gallery-question')?.focus();};
actions['gallery-retry']=el=>{S.gallery.chatFolded=false;S.gallery.question=S.gallery.turns[Number(el.dataset.turn)]?.question||'';render();$('#gallery-question')?.focus();};
actions['gallery-read-source']=async el=>{const a=S.gallery.turns[Number(el.dataset.turn)]?.answer?.sources.find(a=>a.id===el.dataset.source);if(!a)return;const doc=S.gallery.doc?.id===a.regulation_id?S.gallery.doc:await api('/corpus/'+encodeURIComponent(a.regulation_id));const scope=[S.gallery.scopeId,S.gallery.scopeLabel];showDocument(doc,a.number);[S.gallery.scopeId,S.gallery.scopeLabel]=scope;S.gallery.chatSheet=false;render();$('#gallery-reader')?.focus({preventScroll:true});if(window.innerWidth<=760)$('#gallery-reader')?.scrollIntoView({block:'start',behavior:'instant'});};
document.addEventListener('input',e=>{
 if(e.target.closest('.draft-builder')){S.builderResult=null;$('#builder-preview-status').textContent='Input changed · preview again';}
 if(e.target.id==='draft-title'&&$('#document-heading')?.value){const lines=$('#document-heading').value.split('\n');lines[lines.length-1]=e.target.value.toUpperCase();$('#document-heading').value=lines.join('\n');}
 if(e.target.id==='gallery-question')S.gallery.question=e.target.value;
 if(e.target.id==='search-q'&&S.view==='library'&&S.libraryTab==='documents'){clearTimeout(libraryTimer);libraryTimer=setTimeout(()=>{S.searchQuery=e.target.value.trim().slice(0,200);syncRoute();loadLibraryList();},300);}
 if(e.target.id==='lib-find'){S.gallery.find=e.target.value;const q=e.target.value.trim().toLowerCase();document.querySelectorAll('.lib-toc-list button').forEach(b=>b.hidden=Boolean(q)&&!b.textContent.toLowerCase().includes(q));}
});
document.addEventListener('toggle',e=>{if(e.target.classList?.contains('lib-toc'))S.gallery.tocOpen=e.target.open;},true);
document.addEventListener('change',e=>{
 if(isBusy())return;
 if(e.target.id==='library-type'){S.gallery.type=e.target.value;loadLibraryList();}
 if(e.target.id==='library-sort'){S.gallery.sort=e.target.value;loadLibraryList();}
 if(e.target.id==='gallery-article'){S.gallery.articleNumber=e.target.value;render();queueMicrotask(()=>($('#gallery-article-trigger')||$('#gallery-article'))?.focus({preventScroll:true}));}
});
document.addEventListener('keydown',e=>{
 // ←/→ step through articles while reading, unless typing.
 if(S.view==='library'&&S.gallery.doc&&['ArrowLeft','ArrowRight'].includes(e.key)&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!e.target.closest?.('input,textarea,select,[contenteditable],[role=tab],[role=combobox],.rl-select-popup')&&!document.querySelector('dialog[open]')&&!isBusy()){
  const step=document.querySelector(`#gallery-reader [data-action="gallery-step-article"][aria-label="${e.key==='ArrowLeft'?'Previous':'Next'} article"]`);
  if(step&&!step.disabled){e.preventDefault();step.click();}
  return;
 }
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

// Activity run sheet: Escape (the dialog's cancel) and a click on the backdrop close it and clear its state.
document.addEventListener('cancel',event=>{if(!event.target.matches?.('.act-sheet'))return;event.preventDefault();if(!isBusy())actions['activity-sheet-close']();},true);
// Select controls inside the sheet swallow Escape (so no cancel fires); close from the capture phase unless a list is open.
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&S.activity.sheet&&$('.act-sheet')?.open&&!isBusy()&&!document.querySelector('.rl-select-popup:popover-open')){event.preventDefault();event.stopPropagation();actions['activity-sheet-close']();}},true);
document.addEventListener('click',event=>{if(event.target.matches?.('dialog.act-sheet')&&!isBusy())actions['activity-sheet-close']();});
// Activity: J/K (or ↑/↓ inside the timeline) move through the trail.
document.addEventListener('keydown',event=>{
 if(S.view!=='history'||isBusy()||document.querySelector('dialog[open]'))return;
 if(S.activity.sheet||event.ctrlKey||event.metaKey||event.altKey||event.target.closest?.('input,textarea,select,[contenteditable],.rl-select-popup'))return;
 const step={j:1,k:-1,ArrowDown:1,ArrowUp:-1}[event.key];
 if(!step||(event.key.startsWith('Arrow')&&!event.target.closest?.('#activity-timeline')))return;
 const m=activityModel(S),next=m.keys[Math.max(0,Math.min(m.keys.length-1,m.keys.indexOf(m.selected)+step))];
 event.preventDefault();if(next&&next!==m.selected)selectActivity(next,{detail:S.activity.detail||window.innerWidth>760,focus:true});
});
document.addEventListener('rulelab:activity-route',async event=>{
 if(isBusy()||document.querySelector('dialog[open]'))return;
 try{await withLoading('navigate',()=>view(event.detail?.tab==='agents'?'agents':'history'));$('#activity-timeline [aria-current="true"]')?.focus({preventScroll:true});}catch(error){toast(error.message,true);displayError(error);}
});
