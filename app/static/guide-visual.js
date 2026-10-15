import {icon,visualBadge,menuArtwork} from '/static/design.js';

const sections=['settings','layout','globe','book','pen','shield','chart','network','route','verified','scan'];
const title=document.querySelector('main>h1');
if(title){
 const intro=title.nextElementSibling;
 const hero=document.createElement('section');
 hero.className='guide-visual-hero visual-tone-blue';
 title.before(hero);hero.append(title);
 if(intro?.tagName==='P')hero.append(intro);
 hero.insertAdjacentHTML('beforeend',menuArtwork('corpus'));
}
document.querySelectorAll('main>h2').forEach((heading,index)=>{
 heading.classList.add('visual-section-title');
 heading.insertAdjacentHTML('afterbegin',visualBadge(sections[index]||'book','blue',18));
});
document.querySelector('header>a:first-child')?.insertAdjacentHTML('afterbegin',icon('scale',21));
document.querySelector('header>a:last-child')?.insertAdjacentHTML('afterbegin',icon('download',16));
