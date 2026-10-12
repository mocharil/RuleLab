import {iconNodes} from '/static/icons.js';
export function icon(name,size=16){
 const width=Math.max(12,Math.min(64,Number(size)||16));
 const nodes=iconNodes[name]||iconNodes.file;
 const markup=nodes.map(([tag,attrs])=>'<'+tag+' '+Object.entries(attrs).map(([key,value])=>key+'="'+String(value).replace(/"/g,'&quot;')+'"').join(' ')+'/>').join('');
 return '<svg class="ui-icon" width="'+width+'" height="'+width+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+markup+'</svg>';
}
const preferences={get(key){try{return localStorage.getItem(key)}catch{return null}},set(key,value){try{localStorage.setItem(key,value)}catch{}}};
export function enhanceDesign(state){
 document.body.dataset.view=state.view;
 document.body.classList.toggle('editor-focus',state.view==='editor'&&preferences.get('rulelab.editorFocus')==='1');
 const toggle=document.querySelector('[data-ux="focus-editor"]');if(toggle){const focused=document.body.classList.contains('editor-focus');toggle.setAttribute('aria-pressed',String(focused));toggle.innerHTML=icon('focus')+(focused?'Tampilkan asisten':'Fokus menulis');}
 document.querySelectorAll('[data-article]').forEach(field=>{
  const update=()=>{const a=field.closest('.article-card');document.querySelectorAll('.document-outline [data-index]').forEach(b=>{const active=b.dataset.index===field.dataset.article;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});document.querySelectorAll('.article-card').forEach(el=>el.classList.toggle('article-active',el===a));};
  field.addEventListener('focus',update);
 });
}
document.addEventListener('click',event=>{
 if(!event.target.closest('[data-ux="focus-editor"]'))return;
 const focused=!document.body.classList.contains('editor-focus');preferences.set('rulelab.editorFocus',focused?'1':'0');document.body.classList.toggle('editor-focus',focused);
 const button=event.target.closest('button');button.setAttribute('aria-pressed',String(focused));button.innerHTML=icon('focus')+(focused?'Tampilkan asisten':'Fokus menulis');
});
