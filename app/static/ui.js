const operationCopy={
 'collection-submit':['Saving source','Extracting the document and recording it in the review queue.'],
 'collection-upload':['Menyiapkan unggahan','Loading identity and source region options.'],
 'collection-jdih':['Preparing JDIH source','The link will be recorded in the retrieval queue.'],
 'preview-draft':['Menyusun preview','Preparing the structure, opening and closing for the regulation type.'],
 create:['Creating draft','Saving the guided document skeleton.'],
 'gallery-ask':['Searching for an answer','Retrieving articles from the collection and checking explanation quotes.'],
 'gallery-open':['Opening document','Loading metadata and articles from the source document.'],
 'probe-ai':['Menguji koneksi Gemini','Checking authentication, JSON output and source retrieval.'],
 'open-settings':['Checking integration','Loading local readiness without sending documents to the model.'],
 'start-agent':['Preparing agents','Saving a snapshot and starting the run. Next activity appears in the workspace.'],
 init:['Menyiapkan workspace','Loading drafts, regulation sources and history.'],
 'analyze-inline':['Reviewing draft','Retrieving sources and checking each article’s context.'],
 analyze:['Reviewing draft','Retrieving sources and checking each article’s context.'],
 simulate:['Comparing scenarios','Computing assumptions and reviewing stakeholder perspectives.'],
 'run-generate':['Composing the initial draft','Retrieving source context and composing article proposals.'],
 search:['Searching sources','Searching the corpus for relevant articles.'],
 'run-import':['Reading document','Extracting articles and saving the draft.'],
 'run-compare':['Comparing articles','Reviewing the hierarchy, context and selected sources.'],
 export:['Menyiapkan DOCX','Building the document from the saved draft version.'],
 report:['Menyiapkan laporan','Combining findings, sources and review notes.'],
 save:['Saving draft','Recording changes as a new version.'],
 apply:['Saving revision','Applying the proposal to the matching draft version.'],
 'legal-guide':['Loading legal guidelines','Menyiapkan aturan dan kandidat perubahan terkait.']
};
let pending=false;
export const isBusy=()=>pending;
export const illustration=(view,cls='')=>`<img class="menu-art ${cls}" src="/static/art/${view}.svg" alt="" aria-hidden="true" loading="lazy" width="240" height="210">`;
export function skeleton(){return `<div class="workspace-skeleton" aria-hidden="true"><div class="skeleton-line short"></div><div class="skeleton-line title"></div><div class="skeleton-line"></div><div class="skeleton-cards">${[1,2,3].map(()=>'<div class="skeleton-card"><div class="skeleton-orb"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>').join('')}</div><div class="skeleton-document"></div></div><p class="micro" role="status">Menyiapkan workspace…</p>`;}
export async function withLoading(kind,task){
 if(pending)return;
 pending=true;
 const inline=kind==='gallery-ask';
 const [title,description]=operationCopy[kind]||['Menyiapkan tampilan','Loading data and saving changes when needed.'];
 const dialog=document.querySelector('#progress-modal');
 const main=document.querySelector('#main');
 const active=document.activeElement;
 const surfaces=inline?[]:[...document.querySelectorAll('#main,.sidebar,#modal')].map(el=>[el,el.inert]);
 surfaces.forEach(([el])=>el.inert=true);
 main.setAttribute('aria-busy','true');
 document.body.dataset.busyAction=kind;
 if(!inline){
  document.querySelector('#progress-title').textContent=title;
  document.querySelector('#progress-copy').textContent=description;
 }
 const timer=inline?null:setTimeout(()=>{if(pending&&!dialog.open)dialog.showModal();},180);
 try{return await task();}
 finally{
  if(timer)clearTimeout(timer);if(!inline&&dialog.open)dialog.close();
  surfaces.forEach(([el,value])=>el.inert=value);
  main.setAttribute('aria-busy','false');delete document.body.dataset.busyAction;
  pending=false;
  if(active?.isConnected&&!active.inert)active.focus({preventScroll:true});
 }
}
