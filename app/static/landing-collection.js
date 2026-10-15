import {mountCollection,collectionArtwork} from '/static/collection-ui.js';
import {icon} from '/static/design.js';
const artwork=document.querySelector('[data-collection-art]');
if(artwork)artwork.outerHTML=collectionArtwork();
document.querySelector('[data-collection-mark]')?.insertAdjacentHTML('afterbegin',icon('globe',16));
const root=document.getElementById('landing-collection');
if(root){
 const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();mountCollection(root,{publicOnly:true});}},{rootMargin:'400px'});
 observer.observe(root);
}
