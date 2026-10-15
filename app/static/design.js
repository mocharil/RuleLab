import {iconNodes} from '/static/icons.js';
export function icon(name,size=16){
 const width=Math.max(12,Math.min(64,Number(size)||16));
 const nodes=iconNodes[name]||iconNodes.file;
 const markup=nodes.map(([tag,attrs])=>'<'+tag+' '+Object.entries(attrs).map(([key,value])=>key+'="'+String(value).replace(/"/g,'&quot;')+'"').join(' ')+'/>').join('');
 return '<svg class="ui-icon" width="'+width+'" height="'+width+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+markup+'</svg>';
}
const preferences={get(key){try{return localStorage.getItem(key)}catch{return null}},set(key,value){try{localStorage.setItem(key,value)}catch{}}};

const menuVisuals={
 home:{icon:'layout',secondary:'pen',tone:'crimson'},
 studio:{icon:'pen',secondary:'scale',tone:'crimson'},
 data:{icon:'globe',secondary:'database',tone:'blue'},
 editor:{icon:'pen',secondary:'scale',tone:'crimson'},
 analysis:{icon:'shield',secondary:'fileSearch',tone:'crimson'},
 simulation:{icon:'chart',secondary:'compare',tone:'blue'},
 social:{icon:'network',secondary:'message',tone:'violet'},
 corpus:{icon:'book',secondary:'landmark',tone:'blue'},
 gallery:{icon:'book',secondary:'message',tone:'violet'},
 library:{icon:'book',secondary:'message',tone:'violet'},
 activity:{icon:'clock',secondary:'network',tone:'green'},
 history:{icon:'clock',secondary:'reviewer',tone:'green'},
 agents:{icon:'network',secondary:'verified',tone:'violet'},
};

export function visualBadge(name,tone='crimson',size=20){
 return `<span class="visual-badge visual-tone-${tone}" aria-hidden="true">${icon(name,size)}</span>`;
}

// These illustrations are decorative; real figures and network nodes stay in their own views.
export function menuArtwork(view='editor',compact=false){
 const kind=Object.hasOwn(menuVisuals,view)?view:'editor';
 const visual=menuVisuals[kind];
 return `<div class="visual-art visual-tone-${visual.tone} visual-art-${kind}${compact?' visual-art-small':''}" aria-hidden="true"><span class="visual-art-orbit"></span><span class="visual-art-sheet visual-art-back"></span><span class="visual-art-sheet visual-art-middle"></span><span class="visual-art-sheet visual-art-front">${icon(visual.icon,28)}<i></i><i></i><i></i></span><span class="visual-art-satellite">${icon(visual.secondary,19)}</span><span class="visual-art-dot"></span></div>`;
}

function markTitle(title,name,tone){
 if(!title||title.querySelector('svg,.visual-badge'))return;
 title.classList.add('visual-section-title');
 title.insertAdjacentHTML('afterbegin',visualBadge(name,tone,17));
}

export function enhanceVisualSurface(root,state={view:'editor'}){
 if(!root)return;
 const view=['history','agents'].includes(state.view)?'activity':state.view==='simulation'&&state.simSection==='social'?'social':state.view;
 const visual=menuVisuals[view]||menuVisuals.editor;
 const heading=root.querySelector('.page-heading,.enterprise-heading');
 if(heading&&!heading.classList.contains('visual-heading')){
  heading.classList.add('visual-heading',`visual-tone-${visual.tone}`);
  heading.querySelector(':scope>div:first-child')?.classList.add('visual-heading-copy');
  const eyebrow=heading.querySelector('.eyebrow');
  if(eyebrow){eyebrow.classList.add('visual-heading-label');eyebrow.insertAdjacentHTML('afterbegin',icon(visual.icon,17));}
  if(view!=='data')heading.insertAdjacentHTML('beforeend',menuArtwork(view));
 }
 const sectionIcons=[
  ['.assumptions .panel-head h2','settings','blue'],
  ['.document-panel .preamble-title','landmark','crimson'],
  ['.history-timeline .panel-head h2','clock','green'],
  ['.mission-panel .panel-head h2','route','violet'],
  ['.gallery-collection-header h2','files','violet'],
  ['.social-feed .panel-head h3','message','violet'],
  ['.social-network .panel-head h3','network','violet'],
  ['.social-inspector .panel-head h3','reviewer','violet'],
  ['.social-summary .panel-head h3','layers','violet'],
  ['.quant-card>h2','chart','blue'],
  ['.qual-card>h2','users','violet'],
 ];
 for(const [selector,name,tone] of sectionIcons)root.querySelectorAll(selector).forEach(title=>markTitle(title,name,tone));
 root.querySelectorAll('.panel-head h2,.panel-head h3').forEach(title=>markTitle(title,visual.icon,visual.tone));
 const metricGroups=[['.metrics>.metric',['attention','book','files']],['.collection-overview>div',['book','tree','scan']],['.review-count',['reviewer','clock']],['.synthesis-stats>.stat-box',['accessibility','users','coins']]];
 for(const [selector,names] of metricGroups)root.querySelectorAll(selector).forEach((card,index)=>{
  if(card.classList.contains('visual-stat'))return;
  card.classList.add('visual-stat');card.insertAdjacentHTML('afterbegin',visualBadge(names[index%names.length],['crimson','blue','violet'][index%3],19));
 });
 root.querySelectorAll('.empty,.studio-empty,.agent-idle,.gallery-empty,.gallery-reader-empty,.sim-result-empty,.social-empty-copy').forEach(empty=>{
  if(empty.classList.contains('visual-empty'))return;
  empty.classList.add('visual-empty');
  const kind=empty.closest('.qual-card,.social-shell')?'social':empty.closest('.quant-card')?'simulation':view;
  empty.insertAdjacentHTML('afterbegin',menuArtwork(kind,true));
 });
 const title=root.querySelector('.modal-head h2');
 if(title)markTitle(title,/integrasi/i.test(title.textContent)?'settings':/review/i.test(title.textContent)?'reviewer':visual.icon,visual.tone);
}

export function enhanceDesign(state){
 document.body.dataset.view=state.view;
 document.querySelectorAll('#nav [data-view]').forEach(button=>{
  const tone=menuVisuals[button.dataset.view]?.tone||'crimson';
  button.classList.add(`visual-tone-${tone}`);
 });
 document.body.classList.toggle('editor-focus',state.view==='editor'&&preferences.get('rulelab.editorFocus')==='1');
 const toggle=document.querySelector('[data-ux="focus-editor"]');if(toggle){const focused=document.body.classList.contains('editor-focus');toggle.setAttribute('aria-pressed',String(focused));toggle.innerHTML=icon('focus')+(focused?'Show assistant':'Fokus menulis');}
 enhanceVisualSurface(document.querySelector('#main'),state);
 document.querySelectorAll('[data-article]').forEach(field=>{
  const update=()=>{const a=field.closest('.article-card');document.querySelectorAll('.document-outline [data-index]').forEach(b=>{const active=b.dataset.index===field.dataset.article;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});document.querySelectorAll('.article-card').forEach(el=>el.classList.toggle('article-active',el===a));};
  field.addEventListener('focus',update);
 });
}
document.addEventListener('click',event=>{
 if(!event.target.closest('[data-ux="focus-editor"]'))return;
 const focused=!document.body.classList.contains('editor-focus');preferences.set('rulelab.editorFocus',focused?'1':'0');document.body.classList.toggle('editor-focus',focused);
 const button=event.target.closest('button');button.setAttribute('aria-pressed',String(focused));button.innerHTML=icon('focus')+(focused?'Show assistant':'Fokus menulis');
});
