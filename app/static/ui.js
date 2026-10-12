const operationCopy={
 'gallery-ask':['Menelusuri jawaban','Mengambil pasal dari koleksi dan memeriksa kutipan penjelasan.'],
 'gallery-open':['Membuka dokumen','Memuat metadata dan pasal dari naskah sumber.'],
 'probe-ai':['Menguji koneksi Gemini','Memeriksa autentikasi, output JSON dan retrieval sumber.'],
 'open-settings':['Memeriksa integrasi','Memuat kesiapan lokal tanpa mengirim dokumen ke model.'],
 'start-agent':['Menyiapkan agen','Menyimpan snapshot dan memulai proses. Aktivitas berikutnya tampil di workspace.'],
 init:['Menyiapkan workspace','Memuat rancangan, sumber regulasi, dan riwayat.'],
 'analyze-inline':['Meninjau rancangan','Mengambil sumber dan memeriksa konteks setiap pasal.'],
 analyze:['Meninjau rancangan','Mengambil sumber dan memeriksa konteks setiap pasal.'],
 simulate:['Membandingkan skenario','Menghitung asumsi dan meninjau perspektif pemangku kepentingan.'],
 'run-generate':['Menyusun draft awal','Mengambil konteks sumber dan menyusun usulan pasal.'],
 search:['Menelusuri sumber','Mencari pasal yang relevan dalam corpus.'],
 'run-import':['Membaca dokumen','Mengekstrak pasal dan menyimpan rancangan.'],
 'run-compare':['Membandingkan pasal','Meninjau hierarki, konteks, dan sumber yang dipilih.'],
 export:['Menyiapkan DOCX','Menyusun dokumen dari versi rancangan tersimpan.'],
 report:['Menyiapkan laporan','Menggabungkan temuan, sumber, dan catatan review.'],
 save:['Menyimpan rancangan','Mencatat perubahan sebagai versi baru.'],
 apply:['Menyimpan revisi','Menerapkan usulan pada versi rancangan yang sesuai.'],
 'legal-guide':['Memuat pedoman legal','Menyiapkan aturan dan kandidat perubahan terkait.']
};
let pending=false;
export const isBusy=()=>pending;
export const illustration=(view,cls='')=>`<img class="menu-art ${cls}" src="/static/art/${view}.svg" alt="" aria-hidden="true" loading="lazy" width="240" height="210">`;
export function skeleton(){return `<div class="workspace-skeleton" aria-hidden="true"><div class="skeleton-line short"></div><div class="skeleton-line title"></div><div class="skeleton-line"></div><div class="skeleton-cards">${[1,2,3].map(()=>'<div class="skeleton-card"><div class="skeleton-orb"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>').join('')}</div><div class="skeleton-document"></div></div><p class="micro" role="status">Menyiapkan workspace…</p>`;}
export async function withLoading(kind,task){
 if(pending)return;
 pending=true;
 const [title,description]=operationCopy[kind]||['Menyiapkan tampilan','Memuat data dan menyimpan perubahan bila diperlukan.'];
 const dialog=document.querySelector('#progress-modal');
 const main=document.querySelector('#main');
 const active=document.activeElement;
 const surfaces=[...document.querySelectorAll('#main,.sidebar,#modal')].map(el=>[el,el.inert]);
 surfaces.forEach(([el])=>el.inert=true);
 main.setAttribute('aria-busy','true');
 document.body.dataset.busyAction=kind;
 document.querySelector('#progress-title').textContent=title;
 document.querySelector('#progress-copy').textContent=description;
 const timer=setTimeout(()=>{if(pending&&!dialog.open)dialog.showModal();},180);
 try{return await task();}
 finally{
  clearTimeout(timer);if(dialog.open)dialog.close();
  surfaces.forEach(([el,value])=>el.inert=value);
  main.setAttribute('aria-busy','false');delete document.body.dataset.busyAction;
  pending=false;
  if(active?.isConnected&&!active.inert)active.focus({preventScroll:true});
 }
}
