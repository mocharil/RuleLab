import {icon} from '/static/design.js';
const E=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const GUIDES={
 data:{title:'See what the collection holds, how fresh it is and where the gaps are',intro:'Numbers come from the collection itself. Uploads and links wait in a separate queue until they are reviewed.',steps:[
  ['Collection at a glance','Regulations, articles, provinces, national documents and OCR needs, counted from the collection.','.dd-kpis'],
  ['Read the map','Choose what a region means, then click a province or a ranked row to see its documents.','.collection-map-panel'],
  ['Explore and check quality','Search every document, or open Data quality for OCR needs, retrieval dates and source sites.','.dd-tabs'],
  ['Add sources','Upload a file or register a JDIH link. The queue is reviewed before anything reaches analysis.','.dd-add']]},
 home:{title:'Pick up where you left off',intro:'The overview shows each draft’s stage. Every result stays bound to the document version it was made on.',steps:[
  ['Continue your work','The most recently edited draft, its stage and the suggested next step.','.ov-continue'],
  ['Decide what is waiting','Results to review, runs in progress and results that are outdated after a new version.','.ov-attention'],
  ['Find any draft','Search and filter drafts by stage, then open one.','.ov-drafts'],
  ['Start something new','Draft from a brief, import a document or explore the sources.','.ov-quick']]},
 editor:{title:'Write the draft with evidence beside each article',intro:'The outline shows findings per article. Insights on the right follow the article you are editing.',steps:[
  ['Draft, save state and stages','The bar shows the draft, whether it is saved and the next action. The steps lead to Verify sources and Test impact.','.ps-bar'],
  ['Move through the document','The outline lists the opening, each article with its number of findings, and the closing.','.ps-outline'],
  ['Edit articles','Every change is marked as unsaved. Save a version before checking or sharing it.','.article-list'],
  ['Read the insights','Findings, proposed wording and sources for the article you are editing. Proposals apply only to the version they were made on.','.ps-insights']]},
 analysis:{title:'Trace findings back to their source',intro:'Potential conflicts are reviewed together with quotes, legal versions and alternative readings.',steps:[
  ['Date and check','Findings are checked against the date shown. Use Check sources or Re-check in the bar.','.ps-summary'],
  ['Pick a finding','Findings are listed by severity and article. J and K move between them.','.ps-list-col'],
  ['Compare the wording','The diff shows what the proposal changes, with sources and an alternative reading below it.','.finding:not([hidden])'],
  ['Apply with review','A proposal applies only when the check matches the draft version. Record reviewer notes after reviewing.','.finding:not([hidden]) .finding-bottom']]},
 simulation:{title:'Compare two wordings before deciding',intro:'Test impact compares draft A with an alternative B under explicit assumptions, then lets synthetic personas react.',steps:[
  ['Write alternative B','Edit B or start from Verify proposals. The diff shows how B differs from the draft.','.ps-alt-grid'],
  ['Set assumptions','Six numbers drive the access and cost model. Replace the examples with field data.','.ps-assumptions'],
  ['Compare A/B','Compare A/B runs once B differs from A. Results show access, cost and the change.','.ps-results'],
  ['Hear the public','The public forum lets synthetic personas react to A and B. It does not replace public consultation.','.sim-unified-nav']]},
 social:{title:'Explore opinions, replies and mitigations',intro:'Synthetic personas read the document, reply to each other and produce traceable opinions.',steps:[
  ['Collect opinions','Prepare B and click Collect opinions. Demo uses templates; live uses Gemini/Vertex.','.social-launch'],
  ['Explore nodes','Click a persona for its latest opinion, satellites 1/2/3 for a specific comment, or a legal node for its source.','.social-network'],
  ['Read context','The inspector shows opinions, reasoning, replies and proposals. It makes no claim to represent real public opinion.','.social-inspector'],
  ['Compare and replay','Choose A/B, a round or replay. Replay does not call the AI again; pausing the visual does not cancel the server run.','.social-toolbar']]},
 library:{title:'Search, read and ask on one screen',intro:'Documents and article text share one search box. The reader stays in the middle and the assistant quotes the source for every answer.',steps:[
  ['Search documents or articles','Switch between Documents (title, number, year) and Articles (the text of every article).','.lib-search'],
  ['Pick a result','Results stay on the left; article results show the matching passage.','[data-lib-results]'],
  ['Read the article','Move with the arrows or Contents, switch to the original PDF, copy the citation or compare it.','#gallery-reader'],
  ['Ask what it means','The assistant uses the open document as context and quotes the collection. Demo mode shows excerpts only.','.lib-chat']]},
 history:{title:'One decision trail you can audit',intro:'Activity keeps every result with the draft version it ran on, the agent run that produced it and each review decision.',steps:[
  ['Filter the trail','Start with what needs review, or show reviewed, outdated or all results. Type narrows it to checks, simulations or forums.','.act-bar'],
  ['Pick an item','Versions hold their agent runs and results; each row says what it found. J and K move through the list.','#activity-timeline'],
  ['Record a decision','Read the result, then save a review decision. Each decision keeps its reviewer and time; earlier ones stay in the history.','#activity-detail'],
  ['Run the agent team','Start a legal review, impact simulation or public forum on a snapshot of this version. Agents never change the draft.','[data-action="activity-sheet"]']]}
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
 if(!['home','data','library','editor','analysis','simulation','history'].includes(state.view))main.append(intro);  // these menus keep the screen for work; the ? button still opens this guide
 if(lastView!==state.view){main.classList.remove('ux-enter');void main.offsetWidth;main.classList.add('ux-enter');lastView=state.view;}
 document.querySelectorAll('#nav [data-view]').forEach(el=>{const name=el.querySelector('.nav-title')?.textContent;el.setAttribute('aria-label',name);if(document.body.classList.contains('framework-ready'))el.removeAttribute('title');else el.title=name;});
 const topHelp=document.querySelector('#menu-help');if(topHelp){topHelp.title='Guide '+guide.title;topHelp.setAttribute('aria-label','Open menu guide '+guide.title);}
 if(document.querySelector('#guide-dialog')?.open)showStep();
}
function clearHighlight(){highlight?.classList.remove('guide-highlight');highlight=null;}
function showStep(){
 clearHighlight();const g=GUIDES[context.view]||GUIDES.home;let [title,copy,selector]=g.steps[step];
 if(context.view==='editor'&&document.body.classList.contains('editor-focus')&&['.ps-outline','.ps-insights'].includes(selector)){selector='.ps-focus-chip';title='Focus mode is on';copy='Focus mode hides the outline and insights. Use Exit in the bar to show them again.';}
 highlight=document.querySelector('#main '+selector)||document.querySelector('#main .page-heading,#main .ps-bar');
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
