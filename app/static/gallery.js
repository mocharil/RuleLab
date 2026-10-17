// Legal library: results | reader | assistant on one screen — see docs/LEGAL_LIBRARY_REVAMP_STRATEGY.md.
import {REGULATION_NAMES} from '/static/draft-builder.js';
const NATIONAL=['UU','PERPPU','PP','PERPRES','PERMEN','PER_LEMBAGA'];
const fmt=n=>new Intl.NumberFormat('id-ID').format(n||0);
const typeName=t=>REGULATION_NAMES[t]||t;
const STOP=new Set(['nomor','no','tahun','yang','dan','atau','dari','pada','untuk','dengan','dalam','the','and','of']);
export const searchWords=q=>[...new Set(String(q||'').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w=>w.length>=3&&!STOP.has(w)))];
const escapeRegex=w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

// Wrap matches in <mark> inside text nodes of already-escaped HTML.
export function highlightHTML(html,words){
 if(!words.length)return html;
 const pattern=new RegExp('('+words.map(escapeRegex).join('|')+')','giu');
 // Only text between tags is marked, and HTML entities (&amp; &quot; …) are left whole.
 return html.replace(/>([^<]+)</g,(_,text)=>'>'+text.split(/(&#?\w+;)/).map(part=>part.startsWith('&')&&part.endsWith(';')?part:part.replace(pattern,'<mark>$1</mark>')).join('')+'<');
}
function snippetHTML(text,words,E){
 const clean=String(text||'').replace(/\s+/g,' ').trim(),low=clean.toLowerCase();
 const at=Math.max(0,Math.min(...words.map(w=>low.indexOf(w)).filter(i=>i>=0),clean.length));
 const start=at>=clean.length?0:Math.max(0,at-90),piece=clean.slice(start,start+260);
 return highlightHTML('>'+(start?'…':'')+E(piece)+(start+260<clean.length?'…':'')+'<',words).slice(1,-1);
}

export function formatLegalArticleHTML(rawText,E){
 if(!rawText)return '<p class="legal-lead-paragraph">No article text yet.</p>';
 let cleaned=String(rawText)
  .replace(/\r\n?/g,'\n')
  .replace(/\b\d{1,3}\s+(?:19|20)\d{2}\s*,\s*No\.\s*\d+\b/g,' ')
  .replace(/\b(?:19|20)\d{2}\s*,\s*No\.\s*\d+(?:\s+\d{1,3})?\b/g,' ')
  .replace(/\bwww\.(?:peraturan|djpp\.depkumham)\.go\.id\b/gi,' ')
  .replace(/\bSK\s+No\s+\d+\s*[A-Z]*\b/gi,' ')
  .replace(/[ \t]{2,}/g,' ')
  .trim();
 let pasalHeader='';
 const leadMatch=cleaned.match(/^(Pasal\s+\d+[A-Z]?)\b\s*(.*)$/is);
 if(leadMatch&&leadMatch[2]){
  pasalHeader=`<div class="legal-pasal-lead"><span class="legal-pasal-chip">${E(leadMatch[1])}</span></div> `;
  cleaned=leadMatch[2].trim();
 }
 const segmented=cleaned
  .replace(/(?<!\bayat\s*)(?:^|(?<=[.:;])\s+|\s+(?=\(\d+[a-z]?\)\s+[A-Z“"']))(\(\d+[a-z]?\))\s+/g,'\n@@AYAT@@$1 ')
  .replace(/(?<!\b(?:Pasal|pasal|angka|Angka|Nomor|No|Bab|bab|ayat|Ayat)\s*)(?:^|(?<=[.:;])\s+)(\d{1,2}\.)\s+(?=[A-Z“"'])/g,'\n@@NUM@@$1 ')
  .replace(/(?:(?<=[:;])\s+|(?<=\.)\s+(?=[a-z]\.\s+[a-zA-Z]))([a-z]\.)\s+/g,'\n@@LET@@$1 ')
  .split(/\n+/)
  .map(s=>s.trim())
  .filter(Boolean);
 const renderRichClause=text=>{
  const defMatch=text.match(/^([^.;:]{2,140}?)\s+(adalah|merupakan)\s+([\s\S]+)$/i);
  if(defMatch){
   return `<strong class="legal-defined-term">${E(defMatch[1])}</strong> <span class="legal-def-verb">${E(defMatch[2])}</span> ${E(defMatch[3])}`;
  }
  return E(text);
 };
 const blocks=segmented.map(line=>{
  if(line.startsWith('@@AYAT@@')){
   const rest=line.slice(8),m=rest.match(/^(\(\d+[a-z]?\))\s*([\s\S]*)$/);
   return m?`<div class="legal-clause legal-ayat"><span class="legal-badge ayat-badge">${E(m[1])}</span> <div class="legal-clause-body">${renderRichClause(m[2])}</div></div>`:`<p class="legal-lead-paragraph">${E(rest)}</p>`;
  }
  if(line.startsWith('@@NUM@@')){
   const rest=line.slice(7),m=rest.match(/^(\d{1,2}\.)\s*([\s\S]*)$/);
   return m?`<div class="legal-clause legal-number"><span class="legal-badge number-badge">${E(m[1])}</span> <div class="legal-clause-body">${renderRichClause(m[2])}</div></div>`:`<p class="legal-lead-paragraph">${E(rest)}</p>`;
  }
  if(line.startsWith('@@LET@@')){
   const rest=line.slice(7),m=rest.match(/^([a-z]\.)\s*([\s\S]*)$/);
   return m?`<div class="legal-clause legal-letter"><span class="legal-badge letter-badge">${E(m[1])}</span> <div class="legal-clause-body">${E(m[2])}</div></div>`:`<p class="legal-lead-paragraph">${E(rest)}</p>`;
  }
  return `<p class="legal-lead-paragraph">${renderRichClause(line)}</p>`;
 });
 return `<div class="legal-structured-body">${pasalHeader}${blocks.join('\n')}</div>`;
}
export const citationText=(d,a)=>`Pasal ${a.number} ${d.metadata.type==='UU'?'Undang-Undang':typeName(d.metadata.type)} Nomor ${d.metadata.number} Tahun ${d.metadata.year} tentang ${d.metadata.title}`;

// ---------- results column ----------
export function resultsHTML(S,E,icon){
 const g=S.gallery,passages=S.libraryTab==='passages';
 if(passages){
  const results=S.results,words=searchWords(S.searchResultQuery);
  if(results===null)return `<div class="lib-start"><p>Search the text of every article in the collection.</p><div class="library-search-suggestions"><span>Try a topic</span>${['pengaduan','aksesibilitas','biaya layanan'].map(query=>`<button type="button" class="library-topic" data-action="library-search" data-query="${E(query)}">${icon('tag',13)}${E(query)}</button>`).join('')}</div></div>`;
  return `<p class="library-result-count" role="status">${fmt(results.length)} articles for “${E(S.searchResultQuery)}”</p>${results.length?`<div class="lib-hits">${results.map(a=>`<article class="library-passage-result lib-hit ${g.doc?.id===a.regulation_id&&g.articleNumber===a.number?'selected':''}"><button type="button" class="lib-hit-main" data-action="library-read-source" data-result="${E(a.id)}"><small>${E(a.regulation_label)} · Pasal ${E(a.number)}</small><b>${E(a.regulation_title||'')}</b><p>${snippetHTML(a.text,words,E)}</p></button><button type="button" class="text-button lib-hit-ask" data-action="library-ask-source" data-result="${E(a.id)}">${icon('message',13)}Ask</button></article>`).join('')}</div>${results.length>=S.searchLimit&&S.searchLimit<60?`<button type="button" class="btn lib-more" data-action="library-search-more">Load more articles</button>`:''}`:`<div class="lib-empty"><h3>No matching article yet.</h3><p>Try a shorter phrase or a related topic.</p></div>`}`;
 }
 const list=g.list,types=Object.keys(REGULATION_NAMES);
 const filters=`<div class="lib-filters"><label for="library-type">Type<select id="library-type"><option value="">All types</option>${types.map(t=>`<option value="${t}" ${g.type===t?'selected':''}>${E(typeName(t))}</option>`).join('')}</select></label><label for="library-sort">Sort<select id="library-sort">${[['year','Newest'],['relevance','Best match'],['title','Title A–Z']].map(([id,name])=>`<option value="${id}" ${(g.sort||(S.searchQuery?'relevance':'year'))===id?'selected':''}>${name}</option>`).join('')}</select></label></div>`;
 return filters+`<div data-lib-list>${documentListHTML(S,E)}</div>`;
}
// The list part alone is repainted when a page arrives, so an open Type/Sort dropdown is never replaced.
export function documentListHTML(S,E){
 const g=S.gallery,list=g.list;
 if(!list)return '<p class="library-result-count" role="status">Loading documents…</p>';
 return `<p class="library-result-count" role="status">${fmt(list.total)} ${list.total===1?'document':'documents'}${S.searchQuery?` for “${E(S.searchQuery)}”`:''}</p>${list.items.length?`<div class="lib-list">${list.items.map(d=>`<button type="button" class="lib-doc ${g.doc?.id===d.id?'selected':''}" data-action="gallery-open" data-id="${E(d.id)}" aria-pressed="${g.doc?.id===d.id}"><small>${E(d.regulation_type)} ${E(d.number)}/${d.year}${d.version_kind!=='original'?' · amendment':''}</small><b>${E(d.title)}</b><span>${NATIONAL.includes(d.regulation_type)?'National':E(d.district||'Regional')} · ${fmt(d.articles)} articles</span></button>`).join('')}</div>${list.items.length<list.total?`<button type="button" class="btn lib-more" data-action="library-more">Load more (${fmt(list.total-list.items.length)} left)</button>`:''}`:`<div class="lib-empty"><h3>No documents found.</h3><p>Change the search or the type filter.</p></div>`}`;
}

// ---------- reader ----------
export function readerHTML(S,E,icon){
 const g=S.gallery,d=g.doc;
 if(!d)return `<div class="gallery-reader-empty lib-reader-empty">${icon('book',30)}<h2>Choose a document or an article</h2><p>Pick a result on the left to read it here. Ask the assistant about any article; every answer quotes the source.</p></div>`;
 const m=d.metadata,n=g.articleNumber||d.articles[0]?.number,idx=Math.max(0,d.articles.findIndex(x=>x.number===n)),a=d.articles[idx]||d.articles[0];
 const prevArt=idx>0?d.articles[idx-1]:null,nextArt=idx<d.articles.length-1?d.articles[idx+1]:null,mode=g.readerMode||'formatted';
 const isPdf=String(d.provenance?.raw_file||'').toLowerCase().endsWith('.pdf'),pageAnchor=isPdf&&a?.pages?.length?`#page=${a.pages[0]}`:'';
 const rawInlineUrl=`/api/corpus/${encodeURIComponent(d.id)}/raw?inline=1${pageAnchor}`,q=`Explain Article ${n} on ${m.type} ${m.number} year ${m.year} in plain language.`;
 const words=g.highlight||[],find=(g.find||'').trim().toLowerCase();
 const toc=d.articles.filter(x=>!find||('pasal '+x.number+' '+x.text).toLowerCase().includes(find));
 return `<button type="button" class="lib-back text-button" data-action="lib-back">${icon('back',14)}Results</button>`+
  `<div class="gallery-reader-heading"><div><span class="eyebrow">${E(typeName(m.type))} ${E(m.number)}/${m.year}</span><h2>${E(m.title)}</h2></div><span class="tag">${E(m.version_kind==='original'?'Original text':m.version_kind)}</span></div>`+
  `<div class="gallery-reader-meta"><span>Promulgated ${E(m.promulgated_on||'unknown')}</span><span>${fmt(d.articles.length)} articles/blocks</span>${d.quality.ocr_needed_pages.length?`<span>${d.quality.ocr_needed_pages.length} pages need OCR</span>`:''}${m.amends.length?`<span>Amends ${E(m.amends.join(', '))}</span>`:''}</div>`+
  `<div class="lib-reader-bar"><div class="gallery-article-nav-row"><button type="button" class="btn icon-step-btn" data-action="gallery-step-article" data-article="${E(prevArt?.number||'')}" ${prevArt?'':'disabled'} aria-label="Previous article" title="Previous article (←)">${icon('back',14)}</button><label for="gallery-article" class="ps-sr">Read article</label><select id="gallery-article">${d.articles.map(x=>`<option value="${E(x.number)}" ${x.number===n?'selected':''}>Pasal ${E(x.number)}</option>`).join('')}</select><button type="button" class="btn icon-step-btn" data-action="gallery-step-article" data-article="${E(nextArt?.number||'')}" ${nextArt?'':'disabled'} aria-label="Next article" title="Next article (→)">${icon('arrow',14)}</button><span class="lib-pos">${idx+1} of ${fmt(d.articles.length)}</span></div>`+
  `<details class="lib-toc" ${g.tocOpen?'open':''}><summary>${icon('tree',14)}Contents</summary><div class="lib-toc-panel"><input type="search" id="lib-find" placeholder="Find in this document…" aria-label="Find in this document" value="${E(g.find||'')}"><div class="lib-toc-list">${toc.slice(0,400).map(x=>`<button type="button" data-action="gallery-step-article" data-article="${E(x.number)}" class="${x.number===n?'active':''}"><b>Pasal ${E(x.number)}</b><span>${E(x.text.replace(/\s+/g,' ').slice(0,80))}</span></button>`).join('')||'<p class="micro">No article contains that text.</p>'}</div></div></details>`+
  `<div class="reader-mode-pills" role="group" aria-label="Reading mode">${[['formatted','Formatted','book'],['split','Side by side','compare'],['original','Original '+(isPdf?'PDF':'HTML'),'file']].map(([id,title,glyph])=>`<button type="button" class="reader-mode-btn ${mode===id?'active':''}" data-action="gallery-reader-mode" data-mode="${id}" aria-pressed="${mode===id}">${icon(glyph,14)}<span>${title}</span></button>`).join('')}</div></div>`+
  `<div class="gallery-reader-stage mode-${E(mode)}">${a?`<article class="gallery-article-text ${mode==='original'?'is-hidden-mode':''}"><div class="gallery-article-card-head"><span class="eyebrow">PASAL ${E(a.number)}</span><span class="article-meta-Right">${a.pages.length?'Page '+a.pages.join(', '):'HTML'}${words.length?' · highlighting “'+E(words.join(' '))+'”':''}</span></div><div class="quote legal-formatted-quote">${highlightHTML(formatLegalArticleHTML(a.text,E),words)}</div></article>`:'<p>No articles extracted yet.</p>'}${mode==='original'||mode==='split'?`<div class="gallery-raw-iframe-wrap"><div class="gallery-raw-iframe-head"><strong>${E(m.type)} ${E(m.number)}/${E(m.year)}${a?.pages?.length?` · page ${a.pages[0]}`:''}</strong><a class="btn small-btn" href="${E(rawInlineUrl)}" target="_blank" rel="noopener">Full screen ↗</a></div><iframe class="gallery-raw-iframe" src="${E(rawInlineUrl)}" title="Original document ${E(m.type)} ${E(m.number)}/${E(m.year)}" loading="lazy"></iframe></div>`:''}</div>`+
  `<div class="lib-article-actions"><button type="button" class="btn primary ask-article-btn" data-action="gallery-prompt" data-question="${E(q)}">${icon('message',15)}Ask about this article</button><button type="button" class="btn" data-action="lib-copy-citation">${icon('copy',15)}Copy citation</button><button type="button" class="btn" data-action="compare">${icon('compare',15)}Compare with…</button></div>`+
  `<div class="gallery-reader-footer"><button type="button" class="btn" data-action="raw" data-id="${E(d.id)}">${icon('download')}Original file</button><button type="button" class="btn" data-action="law-json" data-id="${E(d.id)}">${icon('download')}Structured JSON</button><a href="${E(d.provenance.source_page)}" target="_blank" rel="noopener">Official source page ↗</a></div>`+
  `<details class="gallery-provenance"><summary>Status, source & extraction trail</summary><p class="micro">${E(m.status_note)} Version ${E(d.version_id)}.</p><p class="micro">Retrieved ${E(new Date(d.provenance.retrieved_at).toLocaleDateString('en-GB'))} · SHA256 ${E(d.provenance.sha256)}</p><ul>${d.quality.limitations.map(x=>`<li>${E(x)}</li>`).join('')}</ul></details>`;
}

// ---------- assistant ----------
function turnHTML(turn,index,E,icon){
 const timeBadge=turn.time?`<time class="chat-bubble-time">${E(turn.time)}</time>`:'';
 if(turn.pending){
  return `<article class="gallery-chat-pending" aria-live="polite"><div class="gallery-msg-row user-row"><div class="gallery-question-pending"><div class="chat-bubble-meta"><span>You</span>${timeBadge}</div><p>${E(turn.question)}</p></div></div><div class="gallery-msg-row bot-row"><div class="gallery-bot-avatar pulse" aria-hidden="true">${icon('book',15)}</div><div class="gallery-bot-typing" role="status" aria-label="The assistant is searching articles"><div class="gallery-answer-label"><b>Legal assistant</b><span class="tag typing-tag">Searching articles…</span></div><div class="typing-indicator-row"><span class="typing-dots" aria-hidden="true"><span></span><span></span><span></span></span><span class="typing-status-text">Retrieving articles from the collection &amp; checking explanation quotes…</span></div></div></div></article>`;
 }
 const r=turn.answer,question=`<div class="gallery-msg-row user-row"><div class="gallery-question"><div class="chat-bubble-meta"><span>You</span>${timeBadge}</div><p>${E(turn.question)}</p></div></div>`;
 if(!r)return `<article class="gallery-chat-turn">${question}<div class="gallery-msg-row bot-row"><div class="gallery-bot-avatar error" aria-hidden="true">${icon('book',15)}</div><div class="gallery-chat-error" role="alert"><b>No answer yet</b><p>${E(turn.error||'Run not finished.')}</p><button class="text-button" data-action="gallery-retry" data-turn="${index}">Try again</button></div></div></article>`;
 const sources=new Map(r.sources.map(s=>[s.id,s]));
 return `<article class="gallery-chat-turn">${question}<div class="gallery-msg-row bot-row"><div class="gallery-bot-avatar" aria-hidden="true">${icon('book',15)}</div><div class="gallery-bot-answer"><div class="gallery-answer-label">${icon('book',14)}<b>Legal assistant</b><span class="tag">${r.provider.mode==='live'?'Gemini':r.provider.mode==='demo'?'Demo · excerpt':'Collection search'}</span></div>${r.status!=='answered'?`<p class="gallery-answer-notice">${E(r.message)}</p>`:''}${r.sections.map(section=>`<section class="gallery-answer-section"><h3>${E(section.heading)}</h3><p>${E(section.explanation)}</p>${section.quotes.map(quote=>{const a=sources.get(quote.evidence_id);if(!a)return '';return `<details class="gallery-citation"><summary>${icon('file',13)}${E(a.regulation_label)} · Article ${E(a.number)}<span>Quote</span></summary><blockquote>${E(quote.quote)}</blockquote><div class="gallery-citation-actions"><button class="text-button" data-action="gallery-read-source" data-turn="${index}" data-source="${E(a.id)}">Open in reader</button><a href="${E(a.source.url)}" target="_blank" rel="noopener">Official source ↗</a></div><p class="micro">${a.pages.length?'Page '+a.pages.join(', '):'HTML'} · SHA256 ${E(a.source.sha256.slice(0,16))}…</p></details>`;}).join('')}</section>`).join('')}<details class="gallery-answer-limits"><summary>Scope &amp; limitations</summary><ul>${r.limitations.map(x=>`<li>${E(x)}</li>`).join('')}</ul></details>${r.follow_up_questions.length?`<div class="gallery-followups"><span>Quick follow-ups</span><div class="gallery-followup-chips">${r.follow_up_questions.map(q=>`<button data-action="gallery-prompt" data-question="${E(q)}"><span>${E(q)}</span>${icon('arrow',12)}</button>`).join('')}</div></div>`:''}</div></div></article>`;
}
export function chatHTML(S,E,icon){
 const g=S.gallery,d=g.doc,m=d?.metadata,n=g.articleNumber||d?.articles[0]?.number,isPending=g.turns.some(t=>t.pending);
 const prompts=d?[`Explain ${m.type} ${m.number} year ${m.year} in plain language.`,`What does Article ${n} mean in this document?`,'Which key terms should I understand?']:['What is UU 25/2009 about?','Explain UU 8/2016 for a beginner.','What is UU 10/2018 about?'];
 if(g.chatFolded)return `<div class="gallery-chat-collapsed-dock"><button type="button" class="btn-unfold-assistant" data-action="toggle-assistant" aria-label="Open legal assistant" title="Open the legal assistant">${icon('message',20)}<span class="dock-vertical-text">Legal assistant</span></button></div>`;
 const scope=g.scopeId?`<span class="lib-scope-chip">${icon('book',13)}${E(g.scopeLabel||'1 regulation')}<button type="button" data-action="lib-scope-clear" aria-label="Ask about the entire collection instead" title="Use the entire collection">${icon('close',12)}</button></span>`:`<span class="lib-scope-all">Entire collection</span>${d?`<button type="button" class="text-button" data-action="lib-scope-doc">Use ${E(m.type)} ${E(m.number)}/${m.year}</button>`:''}`;
 return `<div class="gallery-chat-header"><div class="gallery-assistant-icon">${icon('message',18)}</div><div class="gallery-assistant-info"><h2>Legal assistant</h2><p>Answers quote the collection</p></div><span class="tag">${S.status.provider==='demo'?'Demo':'Gemini'}</span><button type="button" class="btn-fold-assistant lib-assistant-close" data-action="toggle-assistant" aria-label="Collapse legal assistant" title="Collapse the legal assistant">${icon('close',15)}</button></div>`+
  `<div class="gallery-chat-scope lib-scope"><span class="ps-label">Context</span>${scope}</div>`+
  `<div class="gallery-transcript" aria-live="polite" aria-relevant="additions text">${g.turns.length?g.turns.map((t,i)=>turnHTML(t,i,E,icon)).join(''):`<div class="gallery-chat-welcome"><p>Ask about an article’s purpose, terms, rights or obligations. Every answer includes article quotes you can check.</p><div class="gallery-suggestions">${prompts.map(q=>`<button data-action="gallery-prompt" data-question="${E(q)}"><span>${E(q)}</span>${icon('arrow',13)}</button>`).join('')}</div></div>`}</div>`+
  `<form id="gallery-chat-form" class="${isPending?'is-sending':''}"><label for="gallery-question" class="ps-sr">Message the legal assistant</label><div class="chat-composer-box"><textarea id="gallery-question" rows="2" minlength="3" maxlength="2500" required placeholder="Ask about an article or regulation…" ${isPending?'disabled':''}>${E(g.question)}</textarea><button type="submit" class="btn primary chat-send-btn" aria-label="Send message" title="Send (Enter)" ${isPending?'disabled':''}>${icon('arrow',15)}</button></div><div class="gallery-composer-actions"><span class="micro">Enter to send · Shift+Enter for a new line</span><button type="button" class="text-button" data-action="gallery-clear" ${!g.turns.length||isPending?'disabled':''}>Clear</button></div></form>`;
}

export function libraryPage(S,E,icon){
 const passages=S.libraryTab==='passages',g=S.gallery;
 return `<div class="lib" data-mode="${passages?'passages':'documents'}"><header class="lib-head"><div><h1>Legal library</h1><p class="lib-stats">${fmt(S.status.regulations)} regulations · ${fmt(S.status.articles)} articles/blocks · original snapshots; consolidation and legal status need verification</p></div><div class="lib-head-actions"><button type="button" class="btn" data-action="compare">${icon('compare')}Compare articles</button><a class="btn" href="/guide" target="_blank" rel="noopener">${icon('help')}Guide</a></div></header>`+
  `<form id="search-form" class="lib-search" role="search"><div class="library-tabs lib-mode" role="tablist" aria-label="Search in">${[['documents','Documents','book'],['passages','Articles','search']].map(([key,title,glyph])=>`<button type="button" class="library-tab" id="library-tab-${key}" data-action="library-tab" data-tab="${key}" role="tab" aria-selected="${S.libraryTab===key}" tabindex="${S.libraryTab===key?'0':'-1'}" aria-controls="library-content">${icon(glyph,15)}${title}</button>`).join('')}</div><div class="search-field">${icon('search')}<input id="search-q" type="search" maxlength="500" ${passages?'minlength="2" required':''} value="${E(S.searchQuery)}" aria-label="${passages?'Search article text':'Search regulations by title, number or year'}" placeholder="${passages?'Search article text, e.g. pengaduan…':'Title, number or year, e.g. UU 25 2009…'}"></div><button type="submit" class="btn primary">${passages?'Search articles':'Search'}</button>${passages&&S.results!==null?'<button type="button" class="btn" data-action="reset">Reset</button>':''}</form>`+
  `<div id="library-content" role="tabpanel" aria-labelledby="library-tab-${S.libraryTab}" class="lib-grid ${g.chatFolded?'assistant-folded':''} ${g.doc&&g.reading?'is-reading':''} ${g.chatSheet?'chat-open':''}"><section class="lib-results" aria-label="${passages?'Article results':'Documents'}" data-lib-results>${resultsHTML(S,E,icon)}</section><section class="panel gallery-reader lib-reader" id="gallery-reader" tabindex="-1" aria-label="Reader">${readerHTML(S,E,icon)}</section><aside class="panel gallery-chat lib-chat ${g.chatFolded?'folded':''}" aria-label="Legal assistant">${chatHTML(S,E,icon)}</aside></div><button type="button" class="lib-chat-toggle" data-action="lib-chat-sheet" aria-expanded="${Boolean(g.chatSheet)}">${icon('message',16)}<span>Ask the assistant</span></button></div>`;
}
