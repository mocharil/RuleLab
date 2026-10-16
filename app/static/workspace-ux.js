import {icon} from '/static/design.js';
const E=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const GUIDES={
 data:{title:'Get to know the collection and data spread',intro:'Numbers come from the application’s collection. New uploads and links are recorded in a separate queue.',steps:[
  ['Collection size','Unique regulations, documents/versions and articles/blocks are counted from the available data.','.collection-stats'],
  ['Choose distribution meaning','Distinguish issuing region, regulated coverage and mentioned locations. Click a province or use the region picker.','.collection-map-panel'],
  ['Explore sources','Choose a document to open the gallery and read its source articles.','.collection-documents'],
  ['Add data','Upload sources or record JDIH links. The queue shows review and OCR status.','.collection-intake']]},
 home:{title:'Start from the policy goal',intro:'Choose a draft or start from a brief. Every result stays bound to a document version.',steps:[
  ['Choose a task','Open an existing draft or create a new one.','.home-grid'],
  ['Understand the workflow','Draft the document, run a legal review, then test impact and persona reactions.','.home-banner'],
  ['Continue a draft','This list opens saved documents, not new copies.','.home-bottom']]},
 editor:{title:'Draft, review and simulate on one screen',intro:'Write articles on the left. Use the assistant tabs on the right for review and impact tests.',steps:[
  ['Choose a document','Choose the draft you want to work on. Title and regulation type can be edited.','.document-header'],
  ['Edit articles','Every change is marked as unsaved. Save before sharing or reviewing the latest version.','.article-list'],
  ['Use the assistant','The Simulation, Review, Sources, Public and Agents tabs stay next to the document.','.studio-tabs'],
  ['Save and export','Save changes or export DOCX for human review.','.page-heading .actions']]},
 analysis:{title:'Trace findings back to their source',intro:'Potential conflicts must be reviewed together with quotes, legal versions and alternative interpretations.',steps:[
  ['Set the date','The analysis date affects the version context and regulatory amendments.','#legal-date'],
  ['Run a check','Retrieve related sources for the saved document with the check button.','.page-heading .actions'],
  ['Review reasoning','Open source quotes, validation and alternative interpretations on findings. If there are no results yet, run a check first.','.finding'],
  ['Apply with review','A proposal can only be applied when the analysis version matches the draft. Save reviewer notes after reviewing.','.finding-bottom']]},
 simulation:{title:'Impact projection and public reaction exploration',intro:'Compare access and cost, and hear AI persona reactions on one unified screen.',steps:[
  ['Fill in assumptions & scenario','Set applicant parameters and prepare Alternative B.','.assumptions'],
  ['Compare numbers','Run the simulation to see changes in access and cost.','.scenario-grid'],
  ['AI public exploration','Review the persona network map, multi-round opinions and citizen sentiment.','.social-launch'],
  ['Review & apply','Evaluate stakeholder mitigations and apply the best alternative to the draft.','.page-heading .actions']]},
 social:{title:'Explore opinions, replies and mitigations',intro:'Synthetic personas read the document, reply to each other and produce traceable opinions.',steps:[
  ['Collect opinions','Prepare B and click Collect opinions. Demo uses templates; live uses Gemini/Vertex.','.social-launch'],
  ['Explore nodes','Click a persona for its latest opinion, satellites 1/2/3 for a specific comment, or a legal node for its source.','.social-network'],
  ['Read context','The inspector shows opinions, reasoning, replies and proposals. It makes no claim to represent real public opinion.','.social-inspector'],
  ['Compare and replay','Choose A/B, a round or replay. Replay does not call the AI again; pausing the visual does not cancel the server run.','.social-toolbar']]},
 library:{title:'Find, read, ask about and compare sources',intro:'One library for the document collection and article search. Reader and conversation stay in place when you switch tabs.',steps:[
  ['Choose how to explore','Document collection searches titles/numbers/years. Article search looks for phrases across all sources.','.library-tabs'],
  ['Read context','Choose a document or open a search result to read articles and their source trail.','#gallery-reader'],
  ['Ask what it means','The assistant uses the context you choose and quotes from the collection. Demo mode shows excerpts only.','#gallery-chat-form'],
  ['Compare articles','Choose two sources and their articles to review the hierarchy and how the norms relate.','[data-action="compare"]']]},
 history:{title:'A decision trail you can audit',intro:'The Results & review tab in Activity keeps results for the version they ran on, together with reviewer notes.',steps:[
  ['Choose a result','Filter checks, simulations and public forums to find the run you need.','.filter-bar'],
  ['Check the version','Version status shows whether the draft changed after a result was created.','.history-timeline'],
  ['Review and record','View run results or add review notes. Notes do not enact any law.','.history-row .actions'],
  ['Open document versions','Open draft versions to trace article changes.','.page-heading .actions']]},
 agents:{title:'Follow execution, sources and results',intro:'The Agent runs tab in Activity uses a coordinator that runs bounded tools. Activity is recorded without applying document changes automatically.',steps:[
  ['Choose scope','Choose legal review, impact or both. Fill in the comparison text and assumptions needed.','.mission-panel'],
  ['Start run','Run agents on a draft version snapshot. Avoid starting another run while a task is still active.','[data-action="start-agent"]'],
  ['Trace activity','The run trace contains steps, sources, status and results. Failed or interrupted runs are never replaced by demo results.','#agent-live'],
  ['Review results','Open outputs and run history. Cancelling is available to the owner or an admin.','.agent-job-history']]}
};
let context,step=0,trigger,lastView,highlight;
const storage={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
function applySidebar(folded){
 document.body.classList.toggle('sidebar-folded',folded);
 const toggle=document.querySelector('#sidebar-toggle');if(!toggle)return;
 toggle.setAttribute('aria-expanded',String(!folded));toggle.setAttribute('aria-label',folded?'Expand sidebar':'Collapse sidebar');toggle.title=folded?'Expand sidebar':'Collapse sidebar';
 storage.set('rulelab.sidebarFolded',folded?'1':'0');
}
export function enhanceWorkspace(state){
 context=state;const guide=GUIDES[state.view]||GUIDES.home,main=document.querySelector('#main');
 const intro=document.createElement('details');intro.className='menu-guide';intro.id='page-guide';
 intro.innerHTML='<summary><span class="guide-symbol" aria-hidden="true">'+icon('book')+'</span><span><b>'+E(guide.title)+'</b><small>Quick guide for this menu</small></span><span class="guide-expand" aria-hidden="true">'+icon('down',16)+'</span></summary><div class="guide-content"><p>'+E(guide.intro)+'</p><div class="guide-flow">'+guide.steps.map(([title],i)=>'<span><em>0'+(i+1)+'</em>'+E(title)+'</span>').join('')+'</div><button class="btn" data-ux="tour">Start interactive guide ↗</button></div>';
 main.append(intro);
 if(lastView!==state.view){main.classList.remove('ux-enter');void main.offsetWidth;main.classList.add('ux-enter');lastView=state.view;}
 document.querySelectorAll('#nav [data-view]').forEach(el=>{const name=el.querySelector('.nav-title')?.textContent;el.setAttribute('aria-label',name);if(document.body.classList.contains('framework-ready'))el.removeAttribute('title');else el.title=name;});
 const topHelp=document.querySelector('#menu-help');if(topHelp){topHelp.title='Guide '+guide.title;topHelp.setAttribute('aria-label','Open menu guide '+guide.title);}
 if(document.querySelector('#guide-dialog')?.open)showStep();
}
function clearHighlight(){highlight?.classList.remove('guide-highlight');highlight=null;}
function showStep(){
 clearHighlight();const g=GUIDES[context.view]||GUIDES.home;let [title,copy,selector]=g.steps[step];
 if(context.view==='editor'&&document.body.classList.contains('editor-focus')&&selector==='.studio-tabs'){selector='[data-ux="focus-editor"]';title='Show the assistant when needed';copy='Focus mode hides the assistant. Close the guide, then click Show assistant to open review, simulation and persona opinions next to the document.';}
 highlight=document.querySelector('#main '+selector)||document.querySelector('#main .page-heading,#main .home-banner');
 highlight?.classList.add('guide-highlight');
 if(highlight)highlight.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 const dialog=document.querySelector('#guide-dialog');dialog.innerHTML='<div class="coach-top"><span class="eyebrow">GUIDE · '+(step+1)+' / '+g.steps.length+'</span><button data-ux="end-tour" aria-label="Close guide">×</button></div><div class="coach-illustration" aria-hidden="true"><span>0'+(step+1)+'</span><i></i><i></i><i></i></div><h2 id="coach-title">'+E(title)+'</h2><p>'+E(copy)+'</p><div class="coach-dots">'+g.steps.map((_,i)=>'<span class="'+(i===step?'current':'')+'"></span>').join('')+'</div><div class="coach-actions"><button class="btn" data-ux="previous" '+(step===0?'disabled':'')+'>← Previous</button><button class="btn primary" data-ux="next">'+(step===g.steps.length-1?'Done':'Next →')+'</button></div>';
 dialog.querySelector('[data-ux=next]').focus({preventScroll:true});
}
export function initializeWorkspaceUX(){
 const toggle=document.querySelector('#sidebar-toggle');if(!toggle)return;applySidebar(storage.get('rulelab.sidebarFolded')==='1');
 document.querySelectorAll('.workspace-home-link,.settings-link').forEach(el=>{const name=el.querySelector('.home-label,.settings-label')?.textContent||el.textContent.trim();el.setAttribute('aria-label',name);el.title=name;});
 const dialog=document.querySelector('#guide-dialog');
 dialog.addEventListener('close',()=>{clearHighlight();if(trigger?.isConnected)trigger.focus({preventScroll:true});else document.querySelector('#menu-help')?.focus({preventScroll:true});});
 dialog.addEventListener('cancel',()=>clearHighlight());
 document.addEventListener('click',e=>{
  const el=e.target.closest('[data-ux]');if(!el||el.disabled)return;
  if(el.dataset.ux==='sidebar'){applySidebar(!document.body.classList.contains('sidebar-folded'));return;}
  if(!context)return;
  if(el.dataset.ux==='tour'){trigger=el;step=0;if(!dialog.open)dialog.showModal();showStep();}
  if(el.dataset.ux==='end-tour')dialog.close();
  if(el.dataset.ux==='previous'){step=Math.max(0,step-1);showStep();}
  if(el.dataset.ux==='next'){const g=GUIDES[context.view]||GUIDES.home;if(step<g.steps.length-1){step++;showStep();}else dialog.close();}
 });
}
