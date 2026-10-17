import {mountCollection} from '/static/collection-ui.js';
const root=document.getElementById('landing-collection');
if(root){
 const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();mountCollection(root);}},{rootMargin:'400px'});
 observer.observe(root);
}
