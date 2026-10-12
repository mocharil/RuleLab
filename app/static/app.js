import {icon,enhanceDesign} from '/static/design.js';
import {galleryPage,galleryCards} from '/static/gallery.js';
import {initializeFrameworkShell,renderFrameworkComponents,disposePageComponents,refreshFrameworkStatus} from '/static/framework/framework.js';
import {initializeWorkspaceUX,enhanceWorkspace} from '/static/workspace-ux.js';
import {socialShell,updateSocial} from '/static/social.js';
import {agentWorkspace,agentPanel,agentActivity} from '/static/agents.js';
import {studioPanel,defaultAssumptions,assumptionInputs,readAssumptions} from '/static/studio.js';
import {skeleton,withLoading,isBusy} from '/static/ui.js';
initializeFrameworkShell();
const $=s=>document.querySelector(s), E=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={high:'Tinggi',medium:'Sedang',low:'Rendah',potential_vertical_conflict:'Potensi konflik vertikal',potential_horizontal_conflict:'Potensi konflik setara',ambiguity:'Ambiguitas',implementation_risk:'Risiko pelaksanaan',coverage_gap:'Konteks belum lengkap',potential_only:'Indikasi awal',requires_review:'Perlu review',temporal:'Waktu dan versi',scope:'Ruang lingkup',authority:'Kewenangan',exceptions:'Pengecualian',alternative_interpretation:'Interpretasi alternatif',binding_statute:'Norma undang-undang',drafting_technique:'Teknik penyusunan',engineering_guardrail:'Protokol aplikasi',needs_review:'Perlu review',reviewed_with_notes:'Direview dengan catatan'};
const label=v=>labels[v]||v;
const fmt=n=>new Intl.NumberFormat('id-ID').format(n), rup=n=>'Rp '+fmt(n);
const names={home:'Ringkasan workspace',editor:'Editor rancangan',analysis:'Pemeriksaan konflik',simulation:'Simulasi dampak',corpus:'Pustaka regulasi',gallery:'Galeri dokumen',history:'Riwayat & review',social:'Forum netizen AI',agents:'Operasi agen'};
let S={view:new URLSearchParams(location.search).get('view')||'home',draft:null,drafts:[],runs:[],corpus:[],status:{},gallery:{query:'',type:'all',doc:null,articleNumber:null,scopeId:'',question:'',turns:[]},dirty:false,alt:'',simAss:null,studioTab:'impact',results:null,searchQuery:'',findingFilter:'all',lawFilter:'all',historyFilter:'all',jobs:[],asOf:new Date().toISOString().slice(0,10)},timer,agentTimer;
const actionIcons={new:'plus',add:'plus',generate:'file',import:'upload',export:'download',report:'download',save:'save',analyze:'shield','analyze-inline':'shield',simulate:'chart','open-studio':'chart','go-social':'network','start-agent':'network',compare:'compare',copy:'copy','back-editor':'back',close:'close','legal-guide':'book','refresh-agents':'refresh',raw:'download','law-json':'download',versions:'clock',review:'shield','run-detail':'file'};
const btn=(text,action,extra='',primary=false)=>`<button class="btn ${primary?'primary':''}" data-action="${action}" ${extra}>${actionIcons[action]?icon(actionIcons[action]):''}${text.replace(/[◎✧↑↗↓→✕+]/g,'').trim()}</button>`;
function toast(text,error=false){$('#toast').textContent=text;$('#toast').className=error?'error':'';$('#toast').style.display='block';clearTimeout(timer);timer=setTimeout(()=>$('#toast').style.display='none',7000);}
function requestError(detail){
 if(typeof detail==='string')return Error(detail);
 if(!Array.isArray(detail))return Error('Permintaan belum dapat diproses. Periksa input dan coba kembali.');
 const issue=detail[0]||{},parts=(issue.loc||[]).filter(x=>x!=='body'&&x!=='query'),field=parts.at(-1);
 const fields={question:['Pertanyaan',['gallery-question']],title:['Judul rancangan',['new-title','draft-title']],brief:['Brief kebijakan',['brief']],regulation_type:['Jenis peraturan',['new-type','generate-type','reg-type']],alternative_text:['Alternatif B',['alternative','agent-alternative']],q:['Kata kunci',['search-q']],as_of_date:['Tanggal analisis',['legal-date']],notes:['Catatan reviewer',['review-notes']],filename:['File impor',['import-file']],population:['Jumlah pemohon',['ass-population']],digital_access_pct:['Akses digital',['ass-digital_access_pct']],assisted_success_pct:['Keberhasilan bantuan',['ass-assisted_success_pct']],digital_cost:['Biaya digital',['ass-digital_cost']],assisted_cost:['Biaya bantuan',['ass-assisted_cost']],staff_capacity:['Kapasitas petugas',['ass-staff_capacity']]};
 let [label,ids]=fields[field]||['Input',[]];
 if(parts.includes('articles')){const index=parts[parts.indexOf('articles')+1];label=(field==='number'?'Nomor':'Isi')+' pasal '+(Number(index)+1);const control=document.querySelector('[data-'+(field==='number'?'number':'article')+'="'+index+'"]');if(control)control.id=control.id||'validation-article-'+index;ids=control?[control.id]:[];}
 const messages={string_too_short:'minimal '+issue.ctx?.min_length+' karakter.',string_too_long:'maksimal '+issue.ctx?.max_length+' karakter.',missing:'wajib diisi.',greater_than_equal:'minimal '+issue.ctx?.ge+'.',less_than_equal:'maksimal '+issue.ctx?.le+'.',int_parsing:'isi dengan bilangan bulat.',float_parsing:'isi dengan angka.',literal_error:'pilihan belum valid.',date_from_datetime_parsing:'masukkan tanggal yang valid.',date_parsing:'masukkan tanggal yang valid.',value_error:'periksa kelengkapan dan konsistensi input.'};
 const error=Error(label+': '+(messages[issue.type]||'format belum valid. Periksa input tersebut.'));
 error.fieldId=ids.find(id=>document.getElementById(id));return error;
}
function clearFieldError(control){
 if(!control?.id)return;
 const id='rulelab-field-error-'+control.id;document.getElementById(id)?.remove();
 if(control.classList.contains('field-error-control')){control.classList.remove('field-error-control');control.removeAttribute('aria-invalid');const described=(control.getAttribute('aria-describedby')||'').split(' ').filter(x=>x&&x!==id).join(' ');if(described)control.setAttribute('aria-describedby',described);else control.removeAttribute('aria-describedby');}
}
function displayError(error){
 const control=error.fieldId?document.getElementById(error.fieldId):null;
 if(control){clearFieldError(control);const message=document.createElement('p');message.id='rulelab-field-error-'+control.id;message.className='field-error';message.setAttribute('role','alert');message.textContent=error.message;control.after(message);control.setAttribute('aria-invalid','true');control.classList.add('field-error-control');control.setAttribute('aria-describedby',[control.getAttribute('aria-describedby'),message.id].filter(Boolean).join(' '));control.focus();return;}
 const surface=$('#modal').open?$('#modal'):$('#main');surface.querySelector('.workflow-error')?.remove();const alert=document.createElement('div');alert.className='workflow-error';alert.setAttribute('role','alert');alert.innerHTML='<p>'+E(error.message)+'</p><button type="button" data-error-dismiss>Tutup</button>';surface.prepend(alert);
}
document.addEventListener('input',e=>clearFieldError(e.target));
document.addEventListener('change',e=>clearFieldError(e.target));
document.addEventListener('click',e=>{if(e.target.closest('[data-error-dismiss]'))e.target.closest('.workflow-error')?.remove();});
async function api(path,method='GET',body,extraHeaders={}){
 const token=sessionStorage.getItem('rulelab_token'),controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),method==='GET'?45000:180000);
 try{
  const r=await fetch('/api'+path,{method,signal:controller.signal,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...extraHeaders},...(body?{body:JSON.stringify(body)}:{})});
  if(!r.ok){const x=await r.json().catch(()=>({detail:'Server tidak dapat dihubungi'}));if(r.status===401)tokenModal();throw requestError(x.detail);}
  return await r.json();
 }catch(err){if(err.name==='AbortError')throw Error('Waktu tunggu habis. Permintaan mungkin masih diproses server. Periksa riwayat sebelum mengulangi tindakan.');throw err;}
 finally{clearTimeout(timer);}
}
const last=kind=>S.runs.find(r=>r.kind===kind), stale=r=>r?.revision!==S.draft.revision;
const limitations=items=>`<ul class="limitations">${items.map(x=>`<li>${E(x)}</li>`).join('')}</ul>`;
function head(k,title,desc,buttons=''){return `<div class="page-heading"><div><div class="eyebrow">${k}</div><h1>${E(title)}</h1><div class="subtitle">${E(desc)}</div></div><div class="actions">${buttons}</div></div>`;}
function steps(){return '';}
function demoNote(){return S.status.provider==='demo'?'<div class="note demo-note"><span class="tag">Demo</span><span>Hasil memakai aturan dan template lokal. Simulasi angka dihitung dari asumsi Anda.</span></div>':'';}
function source(a){return `<details class="source-details"><summary>${E(a.regulation_label)} · Pasal ${E(a.number)} <span class="tag">Snapshot sumber</span></summary><p class="micro" style="margin-top:8px">${E(a.hierarchy_relation||a.legal_status)}</p><div class="quote">${E(a.text)}</div><a href="${E(a.source.url)}" target="_blank" rel="noopener">Sumber resmi ↗</a><div class="micro">${a.pages.length?'Halaman '+a.pages.join(', '):'HTML'} · SHA256 ${E(a.source.sha256.slice(0,16))}…</div></details>`;}
function render(){document.body.classList.toggle('control-room',S.view==='social');const views={home,editor,analysis,simulation,corpus,gallery:()=>galleryPage(S,E,icon),history,social:()=>socialPage(),agents:()=>agentWorkspace(S,E,btn)};$('#crumb').textContent=names[S.view];document.querySelectorAll('#nav button,.workspace-home-link').forEach(x=>{const active=x.dataset.view===S.view;x.classList.toggle('active',active);if(active)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current');});disposePageComponents();$('#main').innerHTML=(views[S.view]||home)();renderFrameworkComponents(S);enhanceWorkspace(S);enhanceDesign(S);updateSocial(S);agentControls();
 const role=S.status.principal?.role;
 if(role==='viewer'||role==='reviewer'){
  const blocked=new Set(['new','create','generate','run-generate','save','add','remove','analyze','analyze-inline','simulate','apply','apply-alt','confirm-alt','import','run-import','start-agent','cancel-agent']);
  document.querySelectorAll('#main [data-action]').forEach(el=>{if(blocked.has(el.dataset.action)){el.disabled=true;el.title='Tindakan ini memerlukan role editor atau admin';}});
  if(S.view==='editor')document.querySelectorAll('#draft-title,#reg-type,#scope,#preamble,[data-number],[data-article]').forEach(el=>el.disabled=true);
  if(role==='viewer')document.querySelectorAll('#main [data-action=review]').forEach(el=>el.disabled=true);
 }
}
function editor(){
 const d=S.draft,r=last('analysis'),warn=new Set(r&&!stale(r)?r.payload.findings.map(f=>f.article_number):[]);
 return head('PERANCANGAN','Editor rancangan','Sunting naskah dan tinjau sumber, dampak, serta reaksi persona di panel asisten.',`<button class="btn" data-ux="focus-editor" aria-pressed="false">${icon('focus')}Fokus menulis</button>`+btn('Impor','import')+btn('Ekspor DOCX','export')+btn('Simpan','save','',true))+`
 <div class="editor-layout"><section class="panel document-panel"><div class="panel-head"><select id="draft-select" class="draft-selector" aria-label="Pilih rancangan">${S.drafts.map(x=>`<option value="${E(x.id)}" ${x.id===d.id?'selected':''}>${E(x.title)}</option>`).join('')}</select><span id="save-state" class="draft-status ${S.dirty?'dirty':''}">${S.dirty?'Belum disimpan':'Tersimpan · v'+d.revision}</span></div>
 <div class="document-header"><span class="pill">DRAF UNTUK REVIEW</span><div class="doc-type">RANCANGAN <select id="reg-type" aria-label="Jenis peraturan">${['UU','PP','PERPRES','PERDA_PROV','PERDA_KAB','PERMEN'].map(t=>`<option ${t===d.regulation_type?'selected':''}>${t}</option>`).join('')}</select></div><input id="draft-title" aria-label="Judul rancangan" value="${E(d.title)}"><div class="micro">Indonesia · ${d.articles.length} pasal · Versi ${d.revision}</div></div>
 <div class="document-outline" aria-label="Navigasi pasal"><span class="micro">DAFTAR PASAL</span>${d.articles.map((a,i)=>`<button data-action="jump-article" data-index="${i}">Pasal ${E(a.number)}</button>`).join('')}</div>
 <div class="article-list">${d.articles.map((a,i)=>`<article id="article-${i}" class="article-card ${warn.has(a.number)?'warn':''}"><div class="article-top"><div class="article-number">Pasal <input data-number="${i}" value="${E(a.number)}" aria-label="Nomor pasal ${i+1}"></div><div class="actions">${warn.has(a.number)?'<span class="tag medium">Perlu review</span>':''}<button class="text-button" data-action="remove" data-index="${i}">Hapus pasal</button></div></div><textarea data-article="${i}" aria-label="Isi pasal ${E(a.number)}">${E(a.text)}</textarea></article>`).join('')}<div class="actions">${btn('Tambah pasal','add')}${btn('Simpan naskah','save','',true)}</div></div>
 <div class="scope-fields"><div><label for="scope">Ruang lingkup</label><input id="scope" value="${E(d.scope)}"></div><details><summary>Konsiderans & catatan perancangan</summary><textarea id="preamble" aria-label="Konsiderans">${E(d.preamble)}</textarea></details></div></section>
 ${studioPanel({state:S,analysis:r,simulation:last('simulation'),alternative:S.alt||defaultAlt(),escape:E,button:btn,source,legalValidation,socialPanel:()=>socialShell(true),agentPanel:()=>agentPanel(S,E,btn)})}</div>`;
}
function analysis(){const r=last('analysis'),p=r?.payload;return head('PEMERIKSAAN BERBASIS SUMBER','Pemeriksaan konflik','Tinjau hierarki, kutipan sumber, dan interpretasi alternatif pada setiap temuan.',btn('Periksa ulang ✧','analyze','',true)+btn('Laporan DOCX ↗','report'))+steps(1)+`<div class="note analysis-settings"><label for="legal-date">Analisis pada tanggal</label> <input id="legal-date" type="date" value="${E(S.asOf)}" style="width:170px;display:inline-block"> <span class="micro">Versi & status sumber diperiksa terhadap tanggal ini.</span></div>`+demoNote()+(!r?`<section class="panel empty"><h2>Mulai dari satu pemeriksaan.</h2><p>Ambil sumber terkait dan tinjau setiap temuan beserta interpretasi alternatif.</p>${btn('Periksa rancangan','analyze','',true)}</section>`:`${stale(r)?`<div class="note">Draft berubah ke v${S.draft.revision}. Hasil ini dari v${r.revision}. Periksa ulang sebelum menerapkan usulan.</div>`:''}<div class="metrics">${[['POTENSI MASALAH',p.findings.length,'Perlu review, bukan putusan'],['SUMBER DITINJAU',p.coverage.retrieved_articles,'Pasal dan konteks terkait'],['VERSI RANCANGAN',r.revision,stale(r)?'Hasil lama':'Sesuai draft']].map(([k,v,t])=>`<div class="metric"><small>${k}</small><div class="value">${v}</div><small>${t}</small></div>`).join('')}</div><p class="help-text">${E(p.summary)}</p>${p.legal_context?`<div class="note">Pedoman ${E(p.legal_context.rulebook_version)} · Tanggal ${E(p.legal_context.as_of_date)} · ${p.legal_context.pending_changes.length} kandidat perubahan terkait, belum diterapkan. ${E(p.legal_context.notice)}</div>`:""}${findingFilters(p)}${p.findings.length?p.findings.map((f,i)=>({f,i})).filter(({f})=>S.findingFilter==='all'||f.severity===S.findingFilter).map(({f,i})=>`<article class="finding"><div class="finding-head"><span class="tag ${f.severity}">${E(label(f.severity))}</span><h2>${E(f.title)}</h2><span class="pill">Pasal ${E(f.article_number)}</span></div><div class="finding-body"><p>${E(f.reasoning)}</p><div class="two-cols"><div><div class="quote-label">RANCANGAN · V${r.revision}</div><div class="quote">${E(f.original_text)}</div></div><div><div class="quote-label">USULAN UNTUK DITINJAU</div><div class="quote">${E(f.proposed_text)}</div></div></div>${f.evidence.map(source).join('')}${legalValidation(f)}<details style="margin-top:15px"><summary>Interpretasi alternatif & pertanyaan review</summary><p style="margin-top:10px">${E(f.counterargument)}</p>${limitations(f.review_questions)}</details><div class="finding-bottom" data-category="${E(f.category)}"><span class="micro">${E(label(f.category))} · Perlu review ahli</span>${btn('Terapkan usulan ke draft','apply',`data-index="${i}" ${stale(r)?'disabled':''}`,true)}</div></div></article>`).join(''):'<div class="note green">Tidak ada pola masalah terdeteksi. Ini tidak membuktikan draft bebas konflik.</div>'}<section class="panel"><div class="panel-body"><h3>Batasan pemeriksaan</h3>${limitations(p.limitations)}<div class="actions">${btn('Catatan reviewer','review',`data-run="${r.id}"`)}${btn('Lanjut ke simulasi →','go-sim','',true)}<span class="micro">${E(label(r.review_status))}</span></div>${r.review_notes?`<p class="help-text">${E(r.review_notes)}</p>`:''}</div></section>`);}
function draftText(){return S.draft.articles.map(a=>'Pasal '+a.number+'\n'+a.text).join('\n\n');}
function defaultAlt(){return S.draft.articles.map(a=>'Pasal '+a.number+'\n'+(a.number==='2'?'(1) Permohonan dapat diajukan melalui aplikasi digital atau kanal pendampingan.\n(2) Penyelenggara menyediakan bantuan dan akomodasi yang layak bagi pemohon yang mengalami hambatan akses.':a.text)).join('\n\n');}
function simulation(){const r=last('simulation'),p=r?.payload,ass=S.simAss||p?.assumptions||defaultAssumptions;if(!S.alt)S.alt=defaultAlt();const fields=[['population','Jumlah pemohon','orang'],['digital_access_pct','Mampu mengakses digital','%'],['assisted_success_pct','Keberhasilan bantuan','%'],['digital_cost','Biaya layanan digital','Rp / layanan berhasil'],['assisted_cost','Biaya layanan bantuan','Rp / layanan berhasil'],['staff_capacity','Kapasitas pendampingan','pemohon / hari petugas']];return head('LAB DAMPAK KEBIJAKAN','Simulasi dampak','Bandingkan akses dan biaya pada dua rancangan dengan asumsi yang Anda tentukan.',btn('Forum netizen ↗','go-social')+btn('Jalankan simulasi ◎','simulate','',true))+steps(2)+demoNote()+`${r&&stale(r)?'<div class="note">Hasil ini berasal dari versi lama. Jalankan simulasi ulang.</div>':''}<div class="sim-layout"><section class="panel assumptions"><div class="panel-head"><h2>Asumsi skenario</h2><span class="tag">Input pengguna</span></div><div class="panel-body">${assumptionInputs(ass)}<p class="help-text">Angka awal adalah asumsi contoh. Ganti dengan data lapangan untuk evaluasi kebijakan.</p></div></section><div><section class="panel"><div class="panel-head"><h2>Alternatif B · Rancangan pembanding</h2>${btn('Salin draft saat ini','copy')}</div><div class="panel-body"><textarea id="alternative" rows="9" aria-label="Teks alternatif B">${E(S.alt)}</textarea><p class="micro">Alternatif A menggunakan draft tersimpan. B dapat diedit sebelum simulasi.</p></div></section>${!p?`<section class="panel empty" style="margin-top:18px"><h2>Pahami pilihan dan dampaknya.</h2><p>Hitung akses dan biaya dari asumsi, lalu tinjau empat perspektif pemangku kepentingan.</p>${btn('Bandingkan skenario','simulate','',true)}</section>`:`<div class="scenario-grid" style="margin-top:18px">${['A','B'].map(k=>`<section class="scenario ${k==='B'?'b':''}"><div class="eyebrow">ALTERNATIF ${k}</div><h3>${k==='A'?'Draft saat simulasi':'Teks pembanding'}</h3><div class="number">${p[k].access_pct}%</div><div class="micro">Akses dalam model asumsi</div><div class="bar"><span style="width:${p[k].access_pct}%"></span></div><dl>${[['Pemohon terlayani',fmt(p[k].served)],['Belum terlayani',fmt(p[k].unserved)],['Biaya variabel',rup(p[k].cost)],['Hari kerja petugas',fmt(p[k].staff_days)],['Kanal bantuan terdeteksi',p.assistance_detection[k]?'Ya':'Tidak']].map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl></section>`).join('')}</div><div class="delta-banner"><div><b>${p.delta.served>=0?'+':''}${fmt(p.delta.served)}</b><small>PEMOHON TERLAYANI</small></div><div><b>${p.delta.access_points} poin</b><small>PERUBAHAN AKSES</small></div><div><b>${rup(p.delta.cost)}</b><small>PERUBAHAN BIAYA</small></div></div><div class="persona-grid">${p.stakeholders.map(s=>`<section class="persona"><h3>${E(s.stakeholder)}</h3>${[['MANFAAT',s.benefits],['RISIKO',s.risks],['MITIGASI',s.mitigations]].map(([k,v])=>`<strong>${k}</strong><ul>${v.map(x=>`<li>${E(x)}</li>`).join('')}</ul>`).join('')}<details><summary>Validasi & sumber</summary>${limitations(s.questions_to_validate)}${p.evidence.filter(a=>s.evidence_ids.includes(a.id)).map(source).join('')}</details></section>`).join('')}</div><section class="panel"><div class="panel-head"><h2>Sensitivitas akses digital</h2><span class="micro">Asumsi ±10 poin</span></div><table><thead><tr><th>Akses digital input</th><th>Akses A</th><th>Akses B</th></tr></thead><tbody>${p.sensitivity.map(x=>`<tr><td>${x.digital_access_pct}%</td><td>${x.A}%</td><td>${x.B}%</td></tr>`).join('')}</tbody></table><div class="panel-body"><p class="inline-code">${E(p.A.formula)}</p>${limitations(p.limitations)}<div class="actions">${btn('Tinjau & terapkan alternatif B','apply-alt',stale(r)?'disabled':'',true)}${btn('Catatan reviewer','review',`data-run="${r.id}"`)}</div></div></section>`}</div></div>`;}
function corpus(){
  const allFiltered = S.corpus.filter(d => S.lawFilter === 'all' || d.metadata.type === S.lawFilter);
  const perPage = 5;
  const total = allFiltered.length;
  const totalPages = Math.ceil(total / perPage) || 1;
  const page = Math.min(Math.max(1, S.corpusPage || 1), totalPages);
  const start = (page - 1) * perPage;
  const paginated = allFiltered.slice(start, start + perPage);

  const paginationHTML = total > perPage ? `
    <div class="library-pagination">
      <span class="pagination-info">Menampilkan <strong>${start + 1}–${Math.min(start + perPage, total)}</strong> dari <strong>${total}</strong> regulasi</span>
      <div class="pagination-controls">
        <button type="button" class="btn-page-nav" data-action="corpus-page" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>
          ← Sebelumnya
        </button>
        <div class="page-numbers">
          ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
            <button type="button" class="btn-page-num ${p === page ? 'active' : ''}" data-action="corpus-page" data-page="${p}">${p}</button>
          `).join('')}
        </div>
        <button type="button" class="btn-page-nav" data-action="corpus-page" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''}>
          Berikutnya →
        </button>
      </div>
    </div>` : '';

  return head('SUMBER HUKUM','Pustaka regulasi','Cari pasal, periksa naskah resmi, atau bandingkan dua sumber hukum.',btn('Bandingkan pasal','compare','',true))
  + `${corpusOverview()}<div class="note demo-note"><span class="tag">Snapshot</span><span>Naskah asli dan perubahan disimpan terpisah. Status hukum terkonsolidasi masih perlu diverifikasi.</span></div><form id="search-form" class="searchbar"><div class="search-field">${icon('search')}<input id="search-q" value="${E(S.searchQuery)}" aria-label="Cari pasal" placeholder="Cari isi pasal, topik, atau frasa hukum…"></div><button type="submit" class="btn primary">Cari sumber</button>${S.results!==null?btn('Reset','reset'):''}</form>`
  + (S.results!==null
      ? `<p class="micro">${S.results.length} hasil untuk “${E(S.searchQuery)}”</p>${S.results.length?S.results.map(source).join(''):'<div class="panel empty"><h2>Belum menemukan pasal yang sesuai</h2><p>Coba frasa yang lebih singkat atau topik terkait.</p></div>'}`
      : `<div class="library-grid">${paginated.map(d=>`<article class="law-card"><div class="law-document" aria-hidden="true">${icon('file')}</div><div class="law-main"><div class="law-type"><b class="law-code">${E(d.metadata.type)} ${d.metadata.number}/${d.metadata.year}</b><span class="tag ${d.metadata.version_kind==='original'?'tag-original':'tag-amend'}">${E(d.metadata.version_kind==='original'?'Naskah Asli':d.metadata.version_kind)}</span></div><h2 class="law-title">${E(d.metadata.title)}</h2><div class="law-meta"><span><strong>${d.quality.article_count}</strong> pasal/blok</span><span>·</span><span>${d.quality.ocr_needed_pages.length?d.quality.ocr_needed_pages.length+' halaman perlu OCR':'Format digital bersih'}</span></div><p class="micro">Versi ${E(d.version_id)} · Diambil ${new Date(d.provenance.retrieved_at).toLocaleDateString('id-ID')}</p></div><div class="actions law-card-actions"><button type="button" class="btn-law-primary" data-action="law" data-id="${E(d.id)}"><span class="btn-icon">${icon('book',14)}</span><span>Lihat pasal</span><span class="btn-arrow">↗</span></button><div class="law-util-group"><button type="button" class="btn-law-secondary" data-action="law-json" data-id="${E(d.id)}" title="Unduh JSON metadata dan pasal"><span class="btn-icon">${icon('download',12)}</span><span>JSON</span></button><button type="button" class="btn-law-secondary" data-action="raw" data-id="${E(d.id)}" title="Unduh naskah asli PDF/HTML"><span class="btn-icon">${icon('file',12)}</span><span>Naskah asli</span></button></div></div></article>`).join('')}</div>${paginationHTML}`);
}
function history(){const rows=S.runs.filter(r=>S.historyFilter==='all'||r.kind===S.historyFilter);return head('KEPUTUSAN YANG DAPAT DITELUSURI','Riwayat & review','Telusuri versi naskah, hasil analisis, dan catatan keputusan reviewer.',btn('Lihat versi draft','versions'))+`${historyOverview()}<section class="panel history-timeline"><div class="panel-head"><h2>Analisis & simulasi</h2><span class="pill">Draft v${S.draft.revision}</span></div>${rows.length?rows.map(r=>`<div class="history-row"><span class="timeline-dot" aria-hidden="true">${icon(r.kind==='analysis'?'shield':r.kind==='social'?'network':'chart')}</span><div><h3>${r.kind==='analysis'?'Pemeriksaan konflik':r.kind==='social'?'Forum netizen sintetis':'Simulasi dampak'} · v${r.revision}</h3><div class="micro">${new Date(r.created_at).toLocaleString('id-ID')} · ${E(r.payload.provider.mode)} · ${E(label(r.review_status))}</div><p class="help-text">${E(r.review_notes)}</p></div><div class="actions"><span class="pill ${stale(r)?'amber':'green'}">${stale(r)?'Draft berubah':'Versi sesuai'}</span>${btn('Lihat hasil','run-detail',`data-run="${r.id}"`)}${btn('Review','review',`data-run="${r.id}"`)}</div></div>`).join(''):'<div class="empty">Belum ada hasil untuk pilihan ini. Mulai dengan pemeriksaan atau simulasi rancangan.</div>'}</section>`;}
function modal(title,body,footer=''){
  const foot = footer || btn('Tutup','close');
  $('#modal-content').innerHTML = `
    <div class="modal-head">
      <h2>${title}</h2>
      ${btn('✕','close','aria-label="Tutup" class="modal-close-btn"')}
    </div>
    <div class="modal-body-scroll">
      ${body}
    </div>
    <div class="modal-foot">
      ${foot}
    </div>`;
  if(!$('#modal').open)$('#modal').showModal();
}
const close=()=>$('#modal').close();
function tokenModal(){modal('Akses workspace','<label for="token">Token server</label><input id="token" type="password" autocomplete="off">',btn('Masuk','token','',true));}
async function settings(){
 const readiness=await api('/readiness');
 const isAdmin=S.status.principal?.role==='admin';
 const latest=readiness.last_probe;
 modal('Pengaturan integrasi',`<div class="integration-summary"><div><span class="micro">PROVIDER</span><h3>${E(readiness.provider==='vertex'?'Gemini melalui Vertex AI':readiness.provider==='gemini'?'Gemini API':'Demo lokal')}</h3><p>${E(readiness.model||'Template tanpa LLM')}</p></div><span class="pill ${latest?.ready?'green':'amber'}">${latest?latest.ready?latest.live?'Uji berhasil':'Demo siap':'Uji belum berhasil':readiness.provider==='demo'?'Mode demo':'Belum diuji live'}</span></div>
 <div class="integration-checks">${readiness.checks.map(check=>`<div><span class="check-state ${E(check.status)}">${check.status==='passed'?'✓':check.status==='failed'?'!':'·'}</span><div><b>${E(check.label)}</b><p>${E(check.detail)}</p></div></div>`).join('')}</div>
 ${latest?`<div class="note ${latest.ready?'green':''}">${E(latest.detail)}<br><span class="micro">Diperiksa ${new Date(latest.checked_at).toLocaleString('id-ID')}${latest.live?' · Provider live':''}</span></div>`:''}
 <div class="integration-setup"><h3>Hubungkan service account lokal</h3><p>Gunakan file SA JSON di komputer Anda. Project akan dibaca otomatis; key tidak dikirim ke browser.</p><div class="inline-code">./start.sh --sa "/lokasi/service-account.json"</div><p class="micro">Windows: start.bat "C:/lokasi/service-account.json". Setelah mengubah konfigurasi, restart server.</p></div>
 <details class="source-details"><summary>Konfigurasi lanjutan</summary><p class="micro">Project ${E(readiness.project||'Belum ditentukan')} · Model ${E(readiness.model||'Demo')} · Lokasi ${E(readiness.location)} · Retrieval ${E(readiness.search_backend)}.</p><p class="micro">Embedding memakai ${E(readiness.embedding_location)} ketika Elasticsearch aktif. Ubah model, lokasi atau search backend melalui .env.</p><label for="token">Token akses workspace (opsional)</label><input id="token" type="password" autocomplete="off"><p class="micro">Token workspace berbeda dari key Google. Diperlukan hanya bila server mengaktifkan akses terbatas.</p>${btn('Simpan token','token')}</details>
 <p class="micro integration-notice">Uji koneksi mengirim satu permintaan model. Jika Elasticsearch aktif, query embedding juga dikirim. Pemakaian mengikuti kuota dan billing project.</p>`,btn('Segarkan status','open-settings')+btn(readiness.provider==='demo'?'Periksa mode demo':'Uji koneksi Gemini','probe-ai',isAdmin?'':'disabled',true)+btn('Tutup','close'));
}
function collect(){if(S.view!=='editor')return;Object.assign(S.draft,{title:$('#draft-title').value,regulation_type:$('#reg-type').value,scope:$('#scope').value,preamble:$('#preamble').value,articles:S.draft.articles.map((a,i)=>({number:$(`[data-number="${i}"]`).value,text:$(`[data-article="${i}"]`).value}))});}
async function save(){collect();if(!S.dirty)return;S.draft=await api('/drafts/'+S.draft.id,'PUT',{...S.draft,expected_revision:S.draft.revision});S.dirty=false;const status=$('#save-state');if(status){status.textContent='Tersimpan · v'+S.draft.revision;status.classList.remove('dirty');}S.drafts=await api('/drafts');}
async function refresh(){S.drafts=await api('/drafts');S.jobs=await api('/drafts/'+S.draft.id+'/agent-jobs');S.runs=await api('/drafts/'+S.draft.id+'/runs');}
async function select(id){await save();S.draft=await api('/drafts/'+id);S.alt='';S.simAss=null;S.runs=await api('/drafts/'+id+'/runs');S.dirty=false;S.jobs=await api('/drafts/'+id+'/agent-jobs');render();watchAgents();}
async function view(v){await save();S.view=v;render();}
async function download(path,name){const t=sessionStorage.getItem('rulelab_token');const r=await fetch('/api'+path,{headers:t?{Authorization:'Bearer '+t}:{}});if(!r.ok)throw Error('Download gagal. Periksa token dan dokumen.');const u=URL.createObjectURL(await r.blob()),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);}
async function compareSelectors(k){const d=await api('/corpus/'+$('#cmp-'+k).value);$('#art-'+k).innerHTML=d.articles.map(a=>`<option value="${E(a.number)}">Pasal ${E(a.number)}</option>`).join('');}
const actions={close,'open-settings':settings,'retry-init':()=>{disposePageComponents();$('#main').innerHTML=skeleton();return init();},'legal-guide':showLegalGuide,token:async()=>{sessionStorage.setItem('rulelab_token',$('#token').value);close();await init();},
new:async()=>{await save();modal('Rancangan baru','<label for="new-title">Judul</label><input id="new-title" placeholder="Layanan Publik Digital"><label for="new-type" style="margin-top:15px">Jenis</label><select id="new-type"><option>PP</option><option>UU</option><option>PERPRES</option><option>PERMEN</option></select>',btn('Buat rancangan','create','',true));},
create:async()=>{const d=await api('/drafts','POST',{title:$('#new-title').value,regulation_type:$('#new-type').value,scope:'',preamble:'Rancangan untuk review.',articles:[{number:'1',text:'Tuliskan ketentuan di sini.'}]});close();S.drafts=await api('/drafts');await select(d.id);S.view='editor';render();},
generate:()=>modal('Dari brief menjadi draft',`<p class="help-text">Jelaskan tujuan, kelompok sasaran, ruang lingkup dan kendala.</p><label for="brief">Brief kebijakan</label><textarea id="brief" rows="6" placeholder="Buat layanan digital yang tetap dapat diakses warga tanpa internet…"></textarea><label for="generate-type">Jenis peraturan</label><select id="generate-type"><option>PP</option><option>UU</option><option>PERPRES</option><option>PERMEN</option></select>${demoNote()}`,btn('Buat draft ✧','run-generate','',true)),
'run-generate':async()=>{await save();toast('Mengambil konteks dan menyusun rancangan…');const r=await api('/generate','POST',{brief:$('#brief').value,regulation_type:$('#generate-type').value});close();S.drafts=await api('/drafts');await select(r.draft.id);S.view='editor';render();toast('Draft awal tersedia. Tinjau dan lengkapi landasan hukumnya.');},
save:async()=>{await save();render();toast('Draft tersimpan.');},add:()=>{collect();S.draft.articles.push({number:String(Math.max(...S.draft.articles.map(a=>parseInt(a.number)))+1),text:''});S.dirty=true;render();},remove:el=>{if(S.draft.articles.length===1)throw Error('Minimal satu pasal diperlukan.');collect();S.draft.articles.splice(Number(el.dataset.index),1);S.dirty=true;render();},
analyze:async()=>{await save();toast('Memeriksa draft dan mengambil sumber terkait…');await api('/drafts/'+S.draft.id+'/analyze','POST',{as_of_date:$('#legal-date')?.value||S.asOf});await refresh();S.view='analysis';render();toast('Pemeriksaan selesai. Tinjau sumber dan usulan.');},
apply:async el=>{if(S.dirty)throw Error('Draft berubah. Periksa ulang sebelum menerapkan usulan.');S.draft=await api('/drafts/'+S.draft.id+'/apply-revision','POST',{run_id:last('analysis').id,finding_index:Number(el.dataset.index),expected_revision:S.draft.revision});await refresh();S.alt='';render();toast('Usulan diterapkan sebagai versi baru. Periksa ulang sebelum revisi berikutnya.');},
'go-sim':()=>view('simulation'),copy:()=>{S.alt=draftText();$('#alternative').value=S.alt;},
simulate:async()=>{const assumptions=readAssumptions();const alternative=$('#alternative').value;if(alternative.trim().length<10)throw Error('Isi alternatif B minimal 10 karakter sebelum menjalankan simulasi.');await save();S.alt=alternative;S.simAss=assumptions;toast('Membandingkan skenario dan perspektif pemangku kepentingan…');await api('/drafts/'+S.draft.id+'/simulate','POST',{alternative_text:S.alt,assumptions});await refresh();render();toast('Simulasi selesai. Hasil bergantung pada asumsi.');},
'apply-alt':()=>{const r=last('simulation');if(S.dirty||stale(r))throw Error('Simulasi berasal dari versi lama.');modal('Tinjau alternatif B',`<div class="note">Teks yang diterapkan adalah alternatif B yang telah disimulasikan. Lakukan pemeriksaan konflik setelah revisi.</div><div class="quote" style="max-height:400px">${E(r.payload.alternative_text)}</div>`,btn('Batal','close')+btn('Terapkan versi baru','confirm-alt','',true));},
'confirm-alt':async()=>{if(S.dirty||stale(last('simulation')))throw Error('Draft berubah. Jalankan simulasi ulang.');const text=last('simulation').payload.alternative_text,m=[...text.matchAll(/^[ \t]*Pasal[ \t]+(\d+[A-Z]?)[ \t]*$/gm)];if(!m.length)throw Error('Gunakan heading Pasal 1, Pasal 2 pada baris tersendiri.');const articles=m.map((x,i)=>({number:x[1],text:text.slice(x.index+x[0].length,i+1<m.length?m[i+1].index:text.length).trim()}));S.draft=await api('/drafts/'+S.draft.id,'PUT',{...S.draft,articles,expected_revision:S.draft.revision});close();S.dirty=false;await refresh();S.alt='';S.view='editor';render();toast('Alternatif diterapkan. Jalankan pemeriksaan kembali.');},
export:async()=>{await save();await download('/drafts/'+S.draft.id+'/export','rulelab-draft.docx');render();},report:()=>download('/drafts/'+S.draft.id+'/export?format=report','rulelab-review.docx'),
law:async el=>{
  const d=await api('/corpus/'+el.dataset.id);
  modal(E(d.metadata.type)+' '+d.metadata.number+'/'+d.metadata.year,
    `<div class="modal-law-doc-header">
       <div class="modal-law-badge"><span class="tag ${d.metadata.version_kind==='original'?'tag-original':'tag-amend'}">${E(d.metadata.version_kind==='original'?'Naskah Asli':d.metadata.version_kind)}</span></div>
       <h3 class="modal-law-title">${E(d.metadata.title)}</h3>
       <div class="note ${d.metadata.status_note?.includes('Perlu')?'amber':'green'}">${E(d.metadata.status_note)}</div>
       ${d.metadata.source_issues?limitations(d.metadata.source_issues):''}
       <p class="micro">Versi ${E(d.version_id)} · SHA256 ${E(d.provenance.sha256)} · Diambil ${new Date(d.provenance.retrieved_at).toLocaleDateString('id-ID')}</p>
     </div>
     <div class="modal-law-articles">
       <div class="modal-articles-header">
         <strong>Daftar Pasal & Ketentuan (${d.articles.length} Pasal/Blok)</strong>
         <span class="micro">Ketentuan terstruktur hasil ekstraksi</span>
       </div>
       <div class="modal-articles-list">
         ${d.articles.map(a=>`
           <details class="source-details modal-article-card" open>
             <summary>
               <span class="modal-article-num">Pasal ${E(a.number)}</span>
               <span class="modal-article-topics">${a.enrichment.topics.map(t=>`<span class="tag">${E(t)}</span>`).join(' ')}</span>
             </summary>
             <div class="quote">${E(a.text)}</div>
             <p class="micro">${a.pages.length?'Halaman '+a.pages.join(', '):'Format HTML'} · ${a.paragraphs.length} ayat/definisi terdeteksi</p>
           </details>
         `).join('')}
       </div>
     </div>`,
    btn('Tutup','close')
  );
},
'law-json':el=>download('/corpus/'+el.dataset.id+'/json',el.dataset.id+'.json'),raw:el=>download('/corpus/'+el.dataset.id+'/raw',S.corpus.find(d=>d.id===el.dataset.id).provenance.raw_file.split('/').at(-1)),reset:()=>{S.results=null;S.searchQuery='';S.corpusPage=1;render();},
compare:async()=>{modal('Bandingkan dua pasal',`<div class="note">Demo menyediakan perbandingan sumber dan hierarki. Gemini menganalisis potensi konflik pada dua pasal yang dipilih.</div><div class="form-grid">${['left','right'].map(k=>`<div><label>Sumber ${k==='left'?'A':'B'}</label><select id="cmp-${k}" data-cmp="${k}">${S.corpus.map(d=>`<option value="${d.id}">${E(d.metadata.type)} ${d.metadata.number}/${d.metadata.year}</option>`).join('')}</select><label style="margin-top:10px">Pasal</label><select id="art-${k}"></select></div>`).join('')}</div><div id="compare-result"></div>`,btn('Bandingkan','run-compare','',true));$('#cmp-left').value='pp-96-2012';$('#cmp-right').value='uu-25-2009';await Promise.all(['left','right'].map(compareSelectors));},
'run-compare':async()=>{const r=await api('/compare','POST',{left_id:$('#cmp-left').value,right_id:$('#cmp-right').value,left_article:$('#art-left').value,right_article:$('#art-right').value});$('#compare-result').innerHTML=`<div class="relation">${E(r.hierarchy_relation)}</div><div class="comparison">${[r.left,r.right].map(a=>`<div><h3>${E(a.regulation_label)} · Pasal ${E(a.number)}</h3><div class="quote">${E(a.text)}</div><a class="micro" href="${E(a.source.url)}" target="_blank" rel="noopener">Sumber resmi ↗</a></div>`).join('')}</div><p class="help-text">${E(r.summary)}</p>${r.findings.map(f=>`<div class="note"><b>${E(f.title)}</b><br>${E(f.reasoning)}<br>${E(f.counterargument)}</div>`).join('')}${limitations(r.limitations)}`;},
review:el=>modal('Catatan reviewer',`<p class="help-text">Review manusia dicatat untuk tindak lanjut, bukan penetapan keabsahan hukum.</p><label for="review-status">Status</label><select id="review-status"><option value="needs_review" ${S.runs.find(r=>r.id===el.dataset.run)?.review_status==='needs_review'?'selected':''}>Masih perlu review</option><option value="reviewed_with_notes" ${S.runs.find(r=>r.id===el.dataset.run)?.review_status==='reviewed_with_notes'?'selected':''}>Ditinjau dengan catatan</option></select><label for="review-notes" style="margin-top:15px">Catatan</label><textarea id="review-notes" rows="5" placeholder="Sumber yang diverifikasi, interpretasi dan tindak lanjut…">${E(S.runs.find(r=>r.id===el.dataset.run)?.review_notes||'')}</textarea>`,btn('Simpan catatan','save-review',`data-run="${el.dataset.run}"`,true)),
'save-review':async el=>{await api('/runs/'+el.dataset.run+'/review','POST',{status:$('#review-status').value,notes:$('#review-notes').value});close();await refresh();render();toast('Catatan review disimpan.');},
versions:async()=>{const rows=await api('/drafts/'+S.draft.id+'/history');modal('Versi rancangan',rows.map(r=>`<details class="source-details"><summary>Versi ${r.revision} · ${new Date(r.created_at).toLocaleString('id-ID')}</summary><h3>${E(r.payload.title)}</h3><div class="quote">${E(r.payload.articles.map(a=>'Pasal '+a.number+'\n'+a.text).join('\n\n'))}</div></details>`).join(''));},
import:()=>modal('Impor rancangan','<p class="help-text">TXT, JSON DraftInput, DOCX, atau PDF berteks. Heading “Pasal 1” harus pada baris tersendiri. Maksimal 10MB. PDF scan membutuhkan OCR terlebih dahulu.</p><input id="import-file" type="file" accept=".txt,.json,.docx,.pdf">',btn('Impor','run-import','',true)),
'run-import':async()=>{await save();const f=$('#import-file').files[0];if(!f)throw Error('Pilih file.');if(f.size>10*1024*1024)throw Error('Maksimal 10MB.');const b64=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(',')[1]);r.onerror=reject;r.readAsDataURL(f);});const d=await api('/import','POST',{filename:f.name,content_base64:b64});close();S.drafts=await api('/drafts');await select(d.id);S.view='editor';render();toast('Rancangan diimpor.');}
};
document.addEventListener('click',async e=>{
 const el=e.target.closest('[data-action],[data-view]');if(!el||el.disabled||isBusy())return;
 const kind=el.dataset.view?'navigate':el.dataset.action;
 try{el.disabled=true;await withLoading(kind,()=>el.dataset.view?view(el.dataset.view):actions[el.dataset.action]?.(el));}
 catch(err){toast(err.message,true);displayError(err);}
 finally{if(el.isConnected)el.disabled=false;
  if(['gallery-prompt','gallery-retry','gallery-clear'].includes(el.dataset.action))$('#gallery-question')?.focus();
  if(el.dataset.action==='studio-tab'||el.dataset.action==='open-studio')document.querySelector('#tab-'+S.studioTab)?.focus({preventScroll:true});
  if(el.dataset.action==='jump-article')document.querySelector('[data-article="'+el.dataset.index+'"]').focus({preventScroll:true});
 }
});
document.addEventListener('input',e=>{if(e.target.id.startsWith('ass-')){S.simAss={...(S.simAss||last('simulation')?.payload.assumptions||defaultAssumptions),[e.target.id.slice(4)]:Number(e.target.value)};}if(e.target.id==='search-q')S.searchQuery=e.target.value;if(e.target.id==='legal-date')S.asOf=e.target.value;if(e.target.id==='alternative'||e.target.id==='agent-alternative')S.alt=e.target.value;if(S.view==='editor'&&e.target.closest('#main')&&e.target.matches('#draft-title,#reg-type,#scope,#preamble,[data-number],[data-article]')){S.dirty=true;const x=$('#save-state');if(x){x.textContent='Belum disimpan';x.classList.add('dirty');}const context=$('.context-saved');if(context){context.className='context-dirty';context.textContent='Belum disimpan';}document.querySelectorAll('.studio-freshness,.studio-analysis-freshness').forEach(x=>x.textContent='Draft berubah · jalankan ulang');document.querySelectorAll('.studio-panel [data-action=apply],.studio-panel [data-action=apply-alt]').forEach(x=>x.disabled=true);}});
document.addEventListener('change',async e=>{if(isBusy())return;try{
 if(e.target.id==='draft-select')await withLoading('navigate',()=>select(e.target.value));
 if(e.target.dataset.cmp)await withLoading('navigate',()=>compareSelectors(e.target.dataset.cmp));
 if(e.target.id==='reg-type')S.dirty=true;
}catch(err){toast(err.message,true);}});
 document.addEventListener('submit',async e=>{if(e.target.id!=='search-form')return;e.preventDefault();if(isBusy())return;const q=$('#search-q').value;
 try{await withLoading('search',async()=>{S.results=(await api('/search?q='+encodeURIComponent(q))).results;render();$('#search-q').value=q;});}
 catch(err){toast(err.message,true);}});

$('#settings-btn').addEventListener('click',async()=>{if(isBusy())return;try{await withLoading('open-settings',settings);}catch(err){toast(err.message,true);}});$('#progress-modal').addEventListener('cancel',e=>e.preventDefault());window.addEventListener('beforeunload',e=>{if(S.dirty){e.preventDefault();e.returnValue='';}});
async function init(){try{[S.status,S.drafts,S.corpus]=await Promise.all([api('/status'),api('/drafts'),api('/corpus')]);if(!S.drafts.length)throw Error('Draft awal belum tersedia.');S.draft=S.drafts[0];S.runs=await api('/drafts/'+S.draft.id+'/runs');S.jobs=await api('/drafts/'+S.draft.id+'/agent-jobs');watchAgents();$('#provider-pill').textContent=S.status.provider==='demo'?'Mode demo · tanpa LLM':'Gemini · '+S.status.provider;$('#provider-pill').className='pill '+(S.status.provider==='demo'?'amber':'green');$('#corpus-pill').textContent=S.status.regulations+' regulasi · '+S.status.articles+' pasal/blok';render();}catch(err){disposePageComponents();$('#main').innerHTML=`<div class="error-state"><h2>Workspace belum dapat dimuat</h2><p>${E(err.message)}</p><p>Periksa server dan konfigurasi, lalu coba lagi.</p>${btn('Coba lagi','retry-init')}${btn('Pengaturan','open-settings')}</div>`;toast(err.message,true);}}
initializeWorkspaceUX();if(!names[S.view])S.view='home';$('#main').innerHTML=skeleton();withLoading('init',init);

function legalValidation(f){const v=f.validation;if(!v)return '';return `<details style="margin-top:14px"><summary>Validasi legal · ${E(label(v.verdict))}</summary><p class="micro">${v.source_quotes_checked} kutipan terverifikasi · ${E((f.legal_rule_ids||[]).join(', '))}</p>${Object.entries(v.checks||{}).map(([k,x])=>`<p><b>${E(label(k))}</b>: ${E(x)}</p>`).join('')}${limitations(v.warnings||[])}</details>`;}
async function showLegalGuide(){const [g,c]=await Promise.all([api('/legal/guide'),api('/legal/changes')]);modal('Pedoman legal Indonesia',`<div class="stack"><div class="note">${E(g.version)} · ${E(g.coverage_note)}</div><h3>Hierarki Pasal 7</h3><p>UUD 1945 → TAP MPR → UU / Perppu → PP → Perpres → Perda Provinsi → Perda Kabupaten/Kota</p><div class="note">Permen/peraturan lembaga: tinjau kewenangan dan delegasi Pasal 8.</div>${g.rules.map(r=>`<details class="source-details"><summary>${E(r.title)} <span class="tag">${E(label(r.classification))}</span></summary><p>${E(r.instruction)}</p>${r.source?`<p class="micro">${E(r.source.locator)} · Versi sumber ${E(r.source.source_version)}</p><a href="${E(r.source.url)}" target="_blank" rel="noopener">Sumber resmi ↗</a>`:'<p class="micro">Protokol aplikasi; bukan norma hukum.</p>'}</details>`).join('')}<h3>${c.candidates.length} kandidat instruksi perubahan</h3><p class="micro">Belum direview, tidak otomatis diterapkan. Parser masih terbatas.</p>${c.candidates.map(x=>`<details class="source-details"><summary>${E(x.source_regulation_id)} · instruksi ${E(x.instruction_number)} · ${E(x.operation)}</summary><div class="quote">${E(x.source_quote)}</div><p class="micro">Target: ${E(x.target_regulation_id)} · Pasal ${E(x.target_articles.join(', ')||'perlu review')} · Halaman ${E(x.pages.join(', '))}</p></details>`).join('')}</div>`);}

function home(){return '<div id="framework-home"></div>';}
actions['open-draft']=async el=>{await select(el.dataset.id);S.view='editor';render();};

actions['studio-tab']=el=>{collect();S.studioTab=el.dataset.tab;render();document.querySelector('#tab-'+S.studioTab)?.focus({preventScroll:true});};
actions['jump-article']=el=>{document.querySelector('#article-'+el.dataset.index)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'});document.querySelector('[data-article="'+el.dataset.index+'"]').focus({preventScroll:true});};
actions['analyze-inline']=async()=>{await save();await api('/drafts/'+S.draft.id+'/analyze','POST',{as_of_date:S.asOf});await refresh();S.studioTab='review';render();toast('Pemeriksaan tersedia di samping rancangan.');};
document.addEventListener('keydown',e=>{if(!e.target.matches('.studio-tabs [role=tab]')||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)||isBusy())return;e.preventDefault();const tabs=[...document.querySelectorAll('.studio-tabs [role=tab]')],i=tabs.indexOf(e.target),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].click();});

function filterBar(kind,options,current){return `<div class="filter-bar" aria-label="Filter ${E(kind)}">${options.map(([key,title,count])=>`<button data-action="filter-${kind}" data-filter="${E(key)}" aria-pressed="${current===key}">${E(title)}${count!==undefined?`<span>${count}</span>`:''}</button>`).join('')}</div>`;}
function findingFilters(p){return `<div class="section-toolbar"><div><h2>Temuan untuk ditinjau</h2><p class="micro">Buka kutipan sumber dan interpretasi sebelum menerapkan usulan.</p></div>${filterBar('findings',[['all','Semua',p.findings.length],['high','Tinggi',p.findings.filter(f=>f.severity==='high').length],['medium','Sedang',p.findings.filter(f=>f.severity==='medium').length],['low','Rendah',p.findings.filter(f=>f.severity==='low').length]],S.findingFilter)}</div>${S.findingFilter!=='all'&&!p.findings.some(f=>f.severity===S.findingFilter)?'<div class="filter-empty">Tidak ada temuan dengan tingkat ini. Pilih Semua untuk melihat temuan lain.</div>':''}`;}
function corpusOverview(){return `<div class="collection-overview"><div><span class="eyebrow">KOLEKSI SUMBER</span><strong>${S.status.regulations}<small>regulasi resmi</small></strong></div><div><strong>${S.status.articles}<small>pasal / blok terstruktur</small></strong></div><div><strong>${S.corpus.reduce((n,d)=>n+d.quality.ocr_needed_pages.length,0)}<small>halaman perlu OCR</small></strong></div></div>${S.results===null?filterBar('laws',[['all','Semua sumber',S.corpus.length],...Array.from(new Set(S.corpus.map(d=>d.metadata.type))).map(t=>[t,t,S.corpus.filter(d=>d.metadata.type===t).length])],S.lawFilter):''}`;}
function historyOverview(){return `<div class="review-overview"><div><span class="eyebrow">JEJAK KEPUTUSAN</span><h2>${S.runs.length} proses tersimpan</h2><p>Setiap hasil terikat pada versi draft saat dijalankan.</p></div><div class="review-count"><b>${S.runs.filter(r=>r.review_status==='reviewed_with_notes').length}</b><span>dengan catatan review</span></div><div class="review-count"><b>${S.runs.filter(r=>r.review_status==='needs_review').length}</b><span>menunggu review</span></div></div>${filterBar('history',[['all','Semua',S.runs.length],['analysis','Pemeriksaan',S.runs.filter(r=>r.kind==='analysis').length],['simulation','Simulasi',S.runs.filter(r=>r.kind==='simulation').length],['social','Forum netizen',S.runs.filter(r=>r.kind==='social').length]],S.historyFilter)}`;}
actions['filter-findings']=el=>{S.findingFilter=el.dataset.filter;render();};
actions['filter-laws']=el=>{S.lawFilter=el.dataset.filter;S.corpusPage=1;render();};
actions['corpus-page']=el=>{S.corpusPage=Number(el.dataset.page);render();document.querySelector('.library-grid')?.scrollIntoView({behavior:'smooth',block:'start'});};
actions['toggle-assistant']=()=>{S.gallery.chatFolded=!S.gallery.chatFolded;render();};
actions['filter-history']=el=>{S.historyFilter=el.dataset.filter;render();};
actions['open-studio']=()=>{collect();S.studioTab='impact';render();document.querySelector('.studio-panel').scrollIntoView({behavior:'instant',block:'start'});document.querySelector('#tab-impact').focus({preventScroll:true});};
function renderSocialModalBody(r, p) {
  const personas = {
    sari: { name: 'Sari', role: 'Warga Pedesaan', issue: 'Akses & Jaringan', avatar: 'SA', cls: 'persona-sari' },
    nadia: { name: 'Nadia', role: 'Kelompok Rentan', issue: 'Aksesibilitas Digital', avatar: 'NA', cls: 'persona-nadia' },
    bima: { name: 'Bima', role: 'Petugas Layanan', issue: 'Kapasitas Operasional', avatar: 'BI', cls: 'persona-bima' },
    raka: { name: 'Raka', role: 'Pelaku Usaha UMKM', issue: 'Kejelasan Regulasi', avatar: 'RA', cls: 'persona-raka' },
    dewi: { name: 'Dewi', role: 'Pemerhati Anggaran', issue: 'Efisiensi Biaya', avatar: 'DE', cls: 'persona-dewi' }
  };
  const stances = {
    concern: { label: 'Keberatan', icon: '⚠️', cls: 'stance-concern' },
    conditional: { label: 'Bersyarat', icon: '⚡', cls: 'stance-conditional' },
    support: { label: 'Mendukung', icon: '✓', cls: 'stance-support' },
    uncertain: { label: 'Belum pasti', icon: '·', cls: 'stance-uncertain' }
  };

  const getStats = k => {
    const list = p.scenarios[k]?.comments || [];
    const conc = list.filter(c => c.stance === 'concern').length;
    const cond = list.filter(c => c.stance === 'conditional').length;
    const supp = list.filter(c => c.stance === 'support').length;
    return { conc, cond, supp, total: list.length };
  };

  const statsA = getStats('A');
  const statsB = getStats('B');

  const renderScenarioContent = (k, active) => {
    const comments = p.scenarios[k]?.comments || [];
    return `<div class="modal-scenario-content" data-scenario="${k}" style="display:${active ? 'block' : 'none'}">
      <div class="modal-scenario-toolbar">
        <div class="round-filters">
          <span class="filter-label">Filter Putaran:</span>
          <button type="button" class="round-pill active" data-modal-round="all">Semua (${comments.length})</button>
          <button type="button" class="round-pill" data-modal-round="1">Putaran 1 · Reaksi Awal (${comments.filter(c => c.round === 1).length})</button>
          <button type="button" class="round-pill" data-modal-round="2">Putaran 2 · Respons (${comments.filter(c => c.round === 2).length})</button>
          <button type="button" class="round-pill" data-modal-round="3">Putaran 3 · Refleksi (${comments.filter(c => c.round === 3).length})</button>
        </div>
      </div>
      <div class="persona-cards-list">
        ${comments.map(c => {
          const meta = personas[c.persona_id] || { name: c.name, role: 'Persona Sintetis', issue: c.issue || 'Umum', avatar: c.name.slice(0, 2).toUpperCase(), cls: 'persona-default' };
          const st = stances[c.stance] || { label: c.stance, icon: '·', cls: 'stance-neutral' };
          const targetComment = c.reply_to ? comments.find(x => x.id === c.reply_to) : null;
          return `<div class="persona-card" data-round="${c.round}">
            <div class="persona-card-header">
              <div class="persona-info">
                <span class="persona-avatar-badge ${meta.cls}">${meta.avatar}</span>
                <div>
                  <div class="persona-name-row">
                    <strong class="persona-name">${E(c.name)}</strong>
                    <span class="persona-issue-tag">${E(meta.role)} · ${E(meta.issue)}</span>
                  </div>
                  <span class="persona-round-label">Putaran ${c.round} · ${c.round === 1 ? 'Reaksi Pertama' : c.round === 2 ? 'Tanggapan & Diskusi' : 'Refleksi Akhir'}</span>
                </div>
              </div>
              <div class="persona-stance-badge ${st.cls}">
                <span class="stance-icon">${st.icon}</span>
                <span>${st.label}</span>
              </div>
            </div>
            <div class="persona-card-body">
              <div class="persona-comment-box">
                <span class="quote-symbol">“</span>
                <p class="persona-comment-text">${E(c.comment)}</p>
              </div>
              ${c.rationale ? `<div class="persona-rationale-row">
                <span class="row-label">Alasan & Pertimbangan:</span>
                <p>${E(c.rationale)}</p>
              </div>` : ''}
              ${c.proposal ? `<div class="persona-proposal-row">
                <span class="proposal-icon">💡</span>
                <div>
                  <span class="proposal-label">Usulan Solusi:</span>
                  <p>${E(c.proposal)}</p>
                </div>
              </div>` : ''}
              ${targetComment ? `<div class="persona-reply-row">
                <span class="reply-arrow">↳</span>
                <span>Menanggapi <strong>${E(targetComment.name)}</strong> (Putaran ${targetComment.round}): “${E(targetComment.comment.slice(0, 110))}…”</span>
              </div>` : ''}
              ${(c.evidence_ids && c.evidence_ids.length) ? `<div class="persona-evidence-row">
                <span class="evidence-icon">📜</span>
                <span class="evidence-text">Rujukan hukum: ${c.evidence_ids.map(id => `<code class="evidence-chip">${E(id.split('@')[0])}</code>`).join(' ')}</span>
              </div>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  };

  return `<div class="social-modal-container">
    <div class="social-modal-banner">
      <div class="social-modal-meta">
        <span class="pill ${stale(r) ? 'amber' : 'green'}">${stale(r) ? 'Versi Lama' : 'Sesuai Draft v' + r.revision}</span>
        <span class="pill">${p.provider.mode === 'live' ? '⚡ AI Live (Gemini)' : '⚙️ Template Demo'}</span>
        <span class="social-modal-count">5 Persona Sintetis · 3 Putaran Evaluasi</span>
      </div>
      <p class="social-modal-disclaimer">Snapshot rekaman reaksi persona sintetis untuk menguji alternatif naskah kebijakan. Reaksi adalah inferensi model AI, bukan survei empiris opini masyarakat nyata.</p>
    </div>

    <div class="modal-scenario-switcher" role="tablist">
      <button type="button" class="scenario-tab-btn active" data-modal-scenario="A">
        <span class="tab-title">Skenario A · Draft Awal (v${r.revision})</span>
        <span class="tab-counts">
          ${statsA.conc ? `<span class="count-tag concern">${statsA.conc} Keberatan</span>` : ''}
          ${statsA.cond ? `<span class="count-tag conditional">${statsA.cond} Bersyarat</span>` : ''}
          ${statsA.supp ? `<span class="count-tag support">${statsA.supp} Mendukung</span>` : ''}
        </span>
      </button>
      <button type="button" class="scenario-tab-btn" data-modal-scenario="B">
        <span class="tab-title">Skenario B · Alternatif Pembanding</span>
        <span class="tab-counts">
          ${statsB.conc ? `<span class="count-tag concern">${statsB.conc} Keberatan</span>` : ''}
          ${statsB.cond ? `<span class="count-tag conditional">${statsB.cond} Bersyarat</span>` : ''}
          ${statsB.supp ? `<span class="count-tag support">${statsB.supp} Mendukung</span>` : ''}
        </span>
      </button>
    </div>

    ${renderScenarioContent('A', true)}
    ${renderScenarioContent('B', false)}

    <details class="social-modal-limitations">
      <summary>Batasan & Catatan Metodologi Simulasi</summary>
      ${limitations(p.limitations || [])}
    </details>
  </div>`;
}

function renderAnalysisModalBody(r, p) {
  const sevMeta = {
    high: { label: 'Tinggi', icon: '⛔', cls: 'sev-high' },
    medium: { label: 'Sedang', icon: '⚠️', cls: 'sev-medium' },
    low: { label: 'Rendah', icon: 'ℹ️', cls: 'sev-low' }
  };
  return `<div class="analysis-modal-container">
    <div class="modal-status-banner">
      <span class="pill ${stale(r) ? 'amber' : 'green'}">${stale(r) ? 'Versi Lama' : 'Sesuai Draft Tersimpan'}</span>
      <span class="pill">${E(label(r.review_status))}</span>
    </div>
    <div class="analysis-summary-card">
      <span class="analysis-summary-icon">📋</span>
      <p>${E(p.summary)}</p>
    </div>
    <div class="analysis-findings-list">
      ${p.findings.map(f => {
        const sm = sevMeta[f.severity] || { label: f.severity || 'Temuan', icon: '•', cls: 'sev-medium' };
        return `<div class="finding-modal-card">
          <div class="finding-modal-head">
            <div>
              <strong class="finding-pasal">Pasal ${E(f.article_number)}</strong>
              <span class="finding-title">${E(f.title)}</span>
            </div>
            <span class="severity-pill ${sm.cls}">${sm.icon} ${sm.label}</span>
          </div>
          <p class="finding-reasoning">${E(f.reasoning)}</p>
          ${f.proposed_text ? `<div class="finding-proposed-box">
            <span class="box-label">Usulan Redaksional:</span>
            <div class="quote">${E(f.proposed_text)}</div>
          </div>` : ''}
          ${(f.evidence && f.evidence.length) ? `<details class="finding-evidence-disclosure">
            <summary>Rujukan Regulasi (${f.evidence.length} Sumber)</summary>
            ${f.evidence.map(source).join('')}
          </details>` : ''}
        </div>`;
      }).join('')}
    </div>
    <div class="reviewer-notes-section">
      <h3>Catatan Reviewer</h3>
      <p>${E(r.review_notes || 'Belum ada catatan.')}</p>
    </div>
    ${limitations(p.limitations || [])}
  </div>`;
}

actions['run-detail']=el=>{
  const r=S.runs.find(x=>x.id===el.dataset.run),p=r.payload;
  if(r.kind==='social'){
    modal('Forum sintetis · v'+r.revision, renderSocialModalBody(r, p), btn('Tutup','close'));
    return;
  }
  if(r.kind==='analysis'){
    modal('Hasil pemeriksaan · v'+r.revision, renderAnalysisModalBody(r, p), btn('Tutup','close'));
    return;
  }
  modal('Hasil simulasi · v'+r.revision,
    `<div class="note">${stale(r)?'Hasil dari versi lama.':'Versi sesuai draft tersimpan.'} ${E(label(r.review_status))}</div><div class="impact-mini-grid">${['A','B'].map(k=>`<div class="impact-mini"><small>ALTERNATIF ${k}</small><strong>${p[k].access_pct}%</strong><span>${p[k].served} terlayani</span><span>${rup(p[k].cost)}</span></div>`).join('')}</div><p class="micro">Hasil model berdasarkan asumsi saat proses dijalankan.</p>${p.stakeholders.map(x=>`<details class="source-details"><summary>${E(x.stakeholder)}</summary>${limitations(x.risks)}${limitations(x.mitigations)}</details>`).join('')}<h3>Catatan reviewer</h3><p>${E(r.review_notes||'Belum ada catatan.')}</p>${limitations(p.limitations)}`,
    btn('Tutup','close')
  );
};

document.addEventListener('click', e => {
  const scTab = e.target.closest('[data-modal-scenario]');
  if (scTab) {
    const sc = scTab.dataset.modalScenario;
    document.querySelectorAll('[data-modal-scenario]').forEach(b => b.classList.toggle('active', b === scTab));
    document.querySelectorAll('.modal-scenario-content').forEach(panel => {
      panel.style.display = panel.dataset.scenario === sc ? 'block' : 'none';
    });
    return;
  }
  const roundPill = e.target.closest('[data-modal-round]');
  if (roundPill) {
    const r = roundPill.dataset.modalRound;
    const parent = roundPill.closest('.modal-scenario-content');
    parent.querySelectorAll('[data-modal-round]').forEach(b => b.classList.toggle('active', b === roundPill));
    parent.querySelectorAll('.persona-card').forEach(card => {
      card.style.display = (r === 'all' || card.dataset.round === r) ? 'block' : 'none';
    });
    return;
  }
});

async function watchAgents(){
 clearTimeout(agentTimer);
 if(!S.jobs.some(j=>['queued','running','cancelling'].includes(j.status)))return;
 const draftId=S.draft.id;
 agentTimer=setTimeout(async()=>{try{
  const jobs=await api('/drafts/'+draftId+'/agent-jobs');if(S.draft.id!==draftId)return;S.jobs=jobs;
  if(!jobs.some(j=>['queued','running','cancelling'].includes(j.status)))S.runs=await api('/drafts/'+draftId+'/runs');
  const live=$('#agent-live');if(live)live.innerHTML=agentActivity(S,E,btn);refreshFrameworkStatus(S);updateSocial(S);agentControls();
  watchAgents();
 }catch(err){toast('Aktivitas agent belum dapat dimuat. Gunakan Segarkan untuk mencoba ulang.',true);}},1200);
}
actions['start-agent']=async el=>{
 const intent=el.dataset.intent||$('#agent-intent')?.value||'full';
 const alternative=$('#alternative')?.value||$('#agent-alternative')?.value||S.alt||defaultAlt();
 const assumptions=$('#ass-population')?readAssumptions():S.simAss||last('simulation')?.payload.assumptions||defaultAssumptions;
 if(intent!=='legal'&&alternative.trim().length<10)throw Error('Isi alternatif B minimal 10 karakter.');
 await save();S.alt=alternative;S.simAss=assumptions;
 await api('/drafts/'+S.draft.id+'/agent-jobs','POST',{intent,expected_revision:S.draft.revision,alternative_text:intent==='legal'?null:alternative,assumptions,as_of_date:S.asOf},{'Idempotency-Key':crypto.randomUUID()});
 await refresh();if(S.view==='editor')S.studioTab=intent==='social'?'social':'agents';render();watchAgents();
};
actions['cancel-agent']=async el=>{await api('/agent-jobs/'+el.dataset.job+'/cancel','POST',{});S.jobs=await api('/drafts/'+S.draft.id+'/agent-jobs');const live=$('#agent-live');if(live)live.innerHTML=agentActivity(S,E,btn);refreshFrameworkStatus(S);updateSocial(S);agentControls();watchAgents();};
actions['refresh-agents']=async()=>{await refresh();const live=$('#agent-live');if(live)live.innerHTML=agentActivity(S,E,btn);refreshFrameworkStatus(S);updateSocial(S);agentControls();watchAgents();};
actions['inspect-job']=async el=>{const job=await api('/agent-jobs/'+el.dataset.job);modal('Jejak proses · v'+job.revision,agentActivity({...S,jobs:[job]},E,btn));};
actions['audit']=async()=>{const data=await api('/audit');modal('Audit workspace',`<p class="micro">Metadata permintaan; isi dokumen dan kredensial tidak dicatat.</p><table><thead><tr><th>Waktu</th><th>Aktor</th><th>Tindakan</th><th>Status</th></tr></thead><tbody>${data.events.map(e=>`<tr><td>${E(new Date(e.created_at).toLocaleString('id-ID'))}</td><td>${E(e.actor)}<br>${E(e.role)}</td><td>${E(e.action)}</td><td>${e.status}</td></tr>`).join('')}</tbody></table>`);};

function agentControls(){
 const active=S.jobs.some(j=>['queued','running','cancelling'].includes(j.status));
 const role=S.status.principal?.role;
 document.querySelectorAll('#main [data-action=start-agent]').forEach(el=>{el.disabled=active||role==='viewer'||role==='reviewer';if(active)el.title='Tunggu atau batalkan proses aktif sebelum memulai proses baru.';});
}

function socialPage(){if(!S.alt)S.alt=defaultAlt();return head('RULELAB / POLICY INTELLIGENCE','Forum netizen AI','Jelajahi reaksi lima persona sintetis terhadap rancangan A dan alternatif B.',btn('Kembali ke editor','back-editor'))+socialShell()+`<details class="panel social-data"><summary>Siapkan rancangan B & data asumsi</summary><label for="alternative">Alternatif B</label><textarea id="alternative" rows="6">${E(S.alt)}</textarea>${assumptionInputs(S.simAss||defaultAssumptions)}<p class="micro">A memakai seluruh pasal draft tersimpan. B memakai teks di atas. Angka adalah input skenario pengguna.</p></details>`;}
actions['go-social']=()=>view('social');
actions['back-editor']=()=>view('editor');

actions['probe-ai']=async()=>{const result=await api('/readiness/probe','POST',{});await settings();toast(result.detail,!result.ready);};

// Chat state lives in memory for this page session; corpus remains the only legal evidence.
async function askGallery(question){
 const g=S.gallery,q=question.trim();
 if(q.length<3){const error=Error('Pertanyaan: minimal 3 karakter.');error.fieldId='gallery-question';throw error;}
 if(q.length>2500)throw Error('Pertanyaan: maksimal 2500 karakter.');
 const history=g.turns.filter(t=>t.answer).slice(-3).flatMap(t=>[{role:'user',content:t.question},{role:'assistant',content:(t.answer.sections.map(s=>s.heading+': '+s.explanation).join('\n')||t.answer.message).slice(0,4000)}]);
 const turn={question:q,answer:null,error:null};g.turns.push(turn);g.turns=g.turns.slice(-20);g.question=q;
 try{turn.answer=await api('/gallery/chat','POST',{question:q,document_id:g.scopeId||null,history});if(turn.answer.status==='answered'&&turn.answer.documents.length===1)g.scopeId=turn.answer.documents[0].id;g.question='';}
 catch(error){turn.error=error.message;throw error;}
 finally{render();document.querySelector('.gallery-transcript')?.lastElementChild?.scrollIntoView({behavior:'instant',block:'nearest'});}
}
actions['gallery-open']=async el=>{const doc=await api('/corpus/'+encodeURIComponent(el.dataset.id));S.gallery.doc=doc;S.gallery.articleNumber=doc.articles[0]?.number;S.gallery.scopeId=doc.id;render();$('#gallery-reader').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});};
actions['gallery-prompt']=el=>{S.gallery.question=el.dataset.question;render();$('#gallery-question').focus();};
actions['gallery-clear']=()=>{S.gallery.turns=[];S.gallery.question='';render();$('#gallery-question').focus();};
actions['gallery-retry']=el=>{S.gallery.question=S.gallery.turns[Number(el.dataset.turn)]?.question||'';render();$('#gallery-question').focus();};
actions['gallery-read-source']=el=>{const a=S.gallery.turns[Number(el.dataset.turn)]?.answer?.sources.find(a=>a.id===el.dataset.source);if(a)modal('Konteks kutipan · '+a.regulation_label+' Pasal '+a.number,source(a));};
document.addEventListener('input',e=>{
 if(e.target.id==='gallery-question')S.gallery.question=e.target.value;
 if(e.target.id==='gallery-search'){S.gallery.query=e.target.value;$('#gallery-card-results').innerHTML=galleryCards(S,E,icon);}
});
document.addEventListener('change',e=>{
 if(isBusy())return;
 if(e.target.id==='gallery-type'){S.gallery.type=e.target.value;$('#gallery-card-results').innerHTML=galleryCards(S,E,icon);}
 if(e.target.id==='gallery-article'){S.gallery.articleNumber=e.target.value;render();$('#gallery-article').focus();}
 if(e.target.id==='gallery-scope'){S.gallery.scopeId=e.target.value;}
});
document.addEventListener('submit',async e=>{
 if(e.target.id!=='gallery-chat-form')return;e.preventDefault();if(isBusy())return;
 try{await withLoading('gallery-ask',()=>askGallery($('#gallery-question').value));}
 catch(error){toast(error.message,true);}
 finally{$('#gallery-question')?.focus();}
});
