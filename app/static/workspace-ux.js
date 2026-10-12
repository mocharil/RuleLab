import {icon} from '/static/design.js';
const E=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const GUIDES={
 home:{title:'Mulai dari tujuan kebijakan',intro:'Pilih rancangan atau mulai dari brief. Setiap hasil tetap terikat pada versi naskah.',steps:[
  ['Pilih pekerjaan','Buka rancangan yang sudah ada atau buat rancangan baru.','.home-grid'],
  ['Kenali alurnya','Susun naskah, review legal, lalu uji dampak dan reaksi persona.','.home-banner'],
  ['Lanjutkan rancangan','Daftar ini membuka naskah tersimpan, bukan salinan baru.','.home-bottom']]},
 editor:{title:'Susun, review, dan simulasi dalam satu layar',intro:'Tulis pasal di kiri. Gunakan tab asisten di kanan untuk review dan uji dampak.',steps:[
  ['Pilih naskah','Pilih rancangan yang ingin dikerjakan. Judul dan jenis peraturan dapat diedit.','.document-header'],
  ['Edit pasal','Setiap perubahan ditandai belum disimpan. Simpan sebelum membagikan atau meninjau versi terbaru.','.article-list'],
  ['Gunakan asisten','Tab Simulasi, Review, Sumber, Netizen dan Agents tetap berada di samping naskah.','.studio-tabs'],
  ['Simpan dan ekspor','Simpan perubahan atau ekspor DOCX untuk review manusia.','.page-heading .actions']]},
 analysis:{title:'Telusuri temuan sampai ke sumbernya',intro:'Potensi konflik perlu ditinjau bersama kutipan, versi hukum, dan interpretasi alternatif.',steps:[
  ['Tetapkan tanggal','Tanggal analisis memengaruhi konteks versi dan perubahan peraturan.','#legal-date'],
  ['Jalankan pemeriksaan','Ambil sumber terkait untuk naskah tersimpan melalui tombol pemeriksaan.','.page-heading .actions'],
  ['Tinjau alasan','Buka kutipan sumber, validasi dan interpretasi alternatif pada temuan. Jika belum ada hasil, jalankan pemeriksaan dahulu.','.finding'],
  ['Terapkan dengan review','Usulan hanya dapat diterapkan bila versi analisis sesuai dengan draft. Simpan catatan reviewer setelah meninjau.','.finding-bottom']]},
 simulation:{title:'Pisahkan asumsi dari hasil model',intro:'Bandingkan A dan B dengan jumlah pemohon, biaya, dan kapasitas yang Anda tentukan.',steps:[
  ['Isi asumsi','Nilai awal adalah contoh. Gunakan data wilayah sasaran untuk evaluasi yang lebih relevan.','.assumptions'],
  ['Siapkan pembanding','A memakai draft tersimpan. Tulis alternatif B yang ingin dibandingkan.','#alternative'],
  ['Bandingkan','Jalankan simulasi untuk melihat akses, biaya dan perspektif stakeholder.','.page-heading .actions'],
  ['Uji sensitivitas','Tinjau sensitivitas dan batasan hasil. Forum netizen menyediakan interaksi persona yang terpisah dari model angka.','.scenario-grid']]},
 social:{title:'Eksplorasi opini, balasan, dan mitigasi',intro:'Persona sintetis membaca naskah, saling menanggapi, dan menghasilkan opini yang bisa ditelusuri.',steps:[
  ['Kumpulkan opini','Siapkan B dan klik Kumpulkan opini agen. Demo memakai template; live memakai Gemini/Vertex.','.social-launch'],
  ['Jelajahi node','Klik persona untuk opini terbaru, satelit 1/2/3 untuk komentar spesifik, atau node hukum untuk sumber.','.social-network'],
  ['Baca konteks','Inspector memperlihatkan opini, alasan, balasan dan usulan. Tidak ada klaim mewakili opini publik nyata.','.social-inspector'],
  ['Bandingkan dan replay','Pilih A/B, putaran atau replay. Replay tidak memanggil AI lagi; jeda visual tidak membatalkan proses server.','.social-toolbar']]},
 gallery:{title:'Baca, tanyakan, dan telusuri sumber',intro:'Galeri menampilkan koleksi nyata. Bot memakai pasal hasil retrieval dan tidak menjelaskan dokumen yang belum tersedia.',steps:[
  ['Temukan dokumen','Cari judul, nomor atau tahun dan gunakan filter jenis.','#gallery-search'],
  ['Baca pasal','Pilih kartu, kemudian pilih pasal. Naskah asli dan JSON tersedia di reader.','#gallery-reader'],
  ['Tanyakan maknanya','Pilih konteks dokumen atau seluruh koleksi, lalu tulis pertanyaan. Demo hanya cuplikan; live memberikan penjelasan Gemini.','#gallery-chat-form'],
  ['Periksa rujukan','Buka kutipan dan konteks pasal. Percakapan disimpan hanya pada sesi halaman dan bisa dihapus.','.gallery-chat']]},
 corpus:{title:'Dari pasal ke dokumen resmi',intro:'Cari dan bandingkan sumber. Corpus contoh belum memastikan status hukum terkonsolidasi.',steps:[
  ['Cari konteks','Gunakan kata kunci topik atau isi pasal untuk menemukan sumber terkait.','#search-form'],
  ['Buka regulasi','Kartu regulasi memuat sumber, jumlah pasal dan catatan ekstraksi.','.library-grid'],
  ['Periksa dokumen asli','Buka naskah asli atau JSON hasil enrichment untuk memverifikasi kutipan dan provenance.','.law-card .actions'],
  ['Bandingkan pasal','Pilih dua pasal untuk meninjau hubungan hierarki dan potensi konflik dengan konteksnya.','.page-heading .actions']]},
 history:{title:'Jejak keputusan yang dapat diperiksa',intro:'Riwayat menyimpan hasil pada versi saat dijalankan beserta catatan reviewer.',steps:[
  ['Pilih hasil','Filter pemeriksaan, simulasi dan forum netizen untuk menemukan proses yang dibutuhkan.','.filter-bar'],
  ['Periksa versinya','Status versi menunjukkan apakah draft sudah berubah setelah hasil dibuat.','.history-timeline'],
  ['Tinjau dan catat','Lihat hasil proses atau tambahkan catatan review. Catatan tidak mengesahkan suatu hukum.','.history-row .actions'],
  ['Buka versi naskah','Lihat versi draft untuk menelusuri perubahan pasal.','.page-heading .actions']]},
 agents:{title:'Ikuti eksekusi, sumber, dan hasilnya',intro:'Koordinator menjalankan tool terbatas. Aktivitas tersimpan tanpa menerapkan perubahan naskah otomatis.',steps:[
  ['Pilih cakupan','Pilih review legal, dampak atau keduanya. Isi pembanding dan asumsi yang diperlukan.','.mission-panel'],
  ['Mulai proses','Jalankan agen pada snapshot versi draft. Hindari membuat proses lain ketika tugas masih aktif.','[data-action="start-agent"]'],
  ['Telusuri aktivitas','Jejak proses memuat langkah, sumber, status dan hasil. Gagal atau terinterupsi tidak diganti hasil demo.','#agent-live'],
  ['Tinjau hasil','Buka keluaran dan riwayat proses. Pembatalan tersedia bagi pemilik atau admin.','.agent-job-history']]}
};
let context,step=0,trigger,lastView,highlight;
const storage={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
function applySidebar(folded){
 document.body.classList.toggle('sidebar-folded',folded);
 const toggle=document.querySelector('#sidebar-toggle');if(!toggle)return;
 toggle.setAttribute('aria-expanded',String(!folded));toggle.setAttribute('aria-label',folded?'Perluas sidebar':'Lipat sidebar');toggle.title=folded?'Perluas sidebar':'Lipat sidebar';
 storage.set('rulelab.sidebarFolded',folded?'1':'0');
}
export function enhanceWorkspace(state){
 context=state;const guide=GUIDES[state.view]||GUIDES.home,main=document.querySelector('#main');
 const intro=document.createElement('details');intro.className='menu-guide';intro.id='page-guide';
 intro.innerHTML='<summary><span class="guide-symbol" aria-hidden="true">'+icon('book')+'</span><span><b>'+E(guide.title)+'</b><small>Panduan cepat untuk menu ini</small></span><span class="guide-expand" aria-hidden="true">⌄</span></summary><div class="guide-content"><p>'+E(guide.intro)+'</p><div class="guide-flow">'+guide.steps.map(([title],i)=>'<span><em>0'+(i+1)+'</em>'+E(title)+'</span>').join('')+'</div><button class="btn" data-ux="tour">Mulai panduan interaktif ↗</button></div>';
 main.append(intro);
 if(lastView!==state.view){main.classList.remove('ux-enter');void main.offsetWidth;main.classList.add('ux-enter');lastView=state.view;}
 document.querySelectorAll('#nav [data-view]').forEach(el=>{const name=el.querySelector('.nav-title')?.textContent;el.setAttribute('aria-label',name);if(document.body.classList.contains('framework-ready'))el.removeAttribute('title');else el.title=name;});
 const topHelp=document.querySelector('#menu-help');if(topHelp){topHelp.title='Panduan '+guide.title;topHelp.setAttribute('aria-label','Buka panduan menu '+guide.title);}
 if(document.querySelector('#guide-dialog')?.open)showStep();
}
function clearHighlight(){highlight?.classList.remove('guide-highlight');highlight=null;}
function showStep(){
 clearHighlight();const g=GUIDES[context.view]||GUIDES.home;let [title,copy,selector]=g.steps[step];
 if(context.view==='editor'&&document.body.classList.contains('editor-focus')&&selector==='.studio-tabs'){selector='[data-ux="focus-editor"]';title='Tampilkan asisten saat diperlukan';copy='Mode fokus menyembunyikan asisten. Tutup panduan lalu klik Tampilkan asisten untuk membuka review, simulasi dan opini persona di samping naskah.';}
 highlight=document.querySelector('#main '+selector)||document.querySelector('#main .page-heading,#main .home-banner');
 highlight?.classList.add('guide-highlight');
 if(highlight)highlight.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 const dialog=document.querySelector('#guide-dialog');dialog.innerHTML='<div class="coach-top"><span class="eyebrow">PANDUAN · '+(step+1)+' / '+g.steps.length+'</span><button data-ux="end-tour" aria-label="Tutup panduan">×</button></div><div class="coach-illustration" aria-hidden="true"><span>0'+(step+1)+'</span><i></i><i></i><i></i></div><h2 id="coach-title">'+E(title)+'</h2><p>'+E(copy)+'</p><div class="coach-dots">'+g.steps.map((_,i)=>'<span class="'+(i===step?'current':'')+'"></span>').join('')+'</div><div class="coach-actions"><button class="btn" data-ux="previous" '+(step===0?'disabled':'')+'>← Sebelumnya</button><button class="btn primary" data-ux="next">'+(step===g.steps.length-1?'Selesai':'Selanjutnya →')+'</button></div>';
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
