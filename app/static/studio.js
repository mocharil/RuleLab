// Shared Policy Studio helpers: scenario assumptions, text comparison and alternative B from proposals.
export const defaultAssumptions={population:1000,digital_access_pct:70,assisted_success_pct:80,digital_cost:20000,assisted_cost:50000,staff_capacity:40};
export const assumptionFields=[['population','Applicants','people',1,10000000],['digital_access_pct','Digital access','%',0,100],['assisted_success_pct','Assisted success','%',0,100],['digital_cost','Digital cost','Rp / case',0,100000000],['assisted_cost','Assisted cost','Rp / case',0,100000000],['staff_capacity','Staff capacity','applicants / day',1,100000]];
export function assumptionInputs(values){return assumptionFields.map(([key,title,unit,min,max])=>`<label class="scenario-field" for="ass-${key}"><span>${title}</span><div><input id="ass-${key}" type="number" value="${Number(values[key])}" min="${min}" max="${max}" step="${key.includes('pct')||key.includes('cost')?'any':'1'}"><small>${unit}</small></div></label>`).join('');}
export function readAssumptions(root=document){return Object.fromEntries(assumptionFields.map(([key])=>{const input=root.querySelector('#ass-'+key);if(!input||!input.value||!input.checkValidity()){const error=Error('Check the assumption inputs: '+(input?.closest('label')?.textContent||key));error.fieldId='ass-'+key;throw error;}return [key,Number(input.value)];}));}

export const articlesText=articles=>articles.map(a=>'Pasal '+a.number+'\n'+a.text).join('\n\n');
// Whitespace-only differences never count as a different alternative.
export const sameText=(a,b)=>String(a||'').replace(/\s+/g,' ').trim()===String(b||'').replace(/\s+/g,' ').trim();

// Word-level diff (LCS over words; whitespace runs collapse to a space or a line break).
// Returns null when the texts are too long to compare interactively.
export function wordDiff(before,after){
 const split=text=>String(text||'').split(/(\s+)/).filter(Boolean).map(t=>/^\s+$/.test(t)?(t.includes('\n')?'\n':' '):t);
 const a=split(before),b=split(after),n=a.length,m=b.length;
 if(n*m>2_000_000)return null;
 const table=new Uint32Array((n+1)*(m+1)),w=m+1;
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)table[i*w+j]=a[i]===b[j]?table[(i+1)*w+j+1]+1:Math.max(table[(i+1)*w+j],table[i*w+j+1]);
 const parts=[],push=(type,text)=>{const last=parts.at(-1);if(last?.type===type)last.text+=text;else parts.push({type,text});};
 let i=0,j=0;
 while(i<n&&j<m){if(a[i]===b[j]){push('same',a[i]);i++;j++;}else if(table[(i+1)*w+j]>=table[i*w+j+1])push('del',a[i++]);else push('ins',b[j++]);}
 while(i<n)push('del',a[i++]);while(j<m)push('ins',b[j++]);
 const words=type=>parts.filter(p=>p.type===type).reduce((count,p)=>count+(p.text.match(/\S+/g)||[]).length,0);
 return {parts:readable(parts),added:words('ins'),removed:words('del')};
}
// Word-by-word alternation is hard to read; short unchanged runs (≤2 words) between edits join the
// surrounding edit so each hunk reads as one removed phrase followed by one added phrase.
function readable(parts){
 const out=[];let del='',ins='';
 const flush=()=>{if(del)out.push({type:'del',text:del});if(ins)out.push({type:'ins',text:ins});del=ins='';};
 parts.forEach((part,k)=>{
  if(part.type==='del')del+=part.text;else if(part.type==='ins')ins+=part.text;
  else if((del||ins)&&k<parts.length-1&&(part.text.match(/\S+/g)||[]).length<=2&&!part.text.includes('\n')){del+=part.text;ins+=part.text;}
  else{flush();out.push(part);}
 });
 flush();return out;
}
export function diffHTML(before,after,E){
 const diff=wordDiff(before,after);
 if(!diff)return `<div class="ps-diff-fallback"><del>${E(before)}</del><ins>${E(after)}</ins></div>`;
 return diff.parts.map(p=>p.type==='same'?E(p.text):`<${p.type}>${E(p.text)}</${p.type}>`).join('');
}

// Alternative B built from the latest check: each article takes the first proposal made for it,
// the same whole-article replacement the server performs when a proposal is applied.
export function alternativeFromProposals(articles,findings){
 const proposals=new Map();let duplicates=0;
 for(const f of findings||[]){
  if(!f.proposed_text?.trim()||!articles.some(a=>a.number===f.article_number))continue;
  if(proposals.has(f.article_number)){duplicates++;continue;}
  proposals.set(f.article_number,f.proposed_text);
 }
 return {text:articlesText(articles.map(a=>({...a,text:proposals.get(a.number)??a.text}))),used:proposals.size,duplicates};
}
