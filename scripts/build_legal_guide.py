"""Build a curated, source-linked rule pack. Does not certify current law."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://peraturan.go.id/files/uu12-2011bt.pdf'
ANNEX = 'https://peraturan.go.id/files/uu12-2011lmp2.pdf'
UPDATE = 'https://peraturan.go.id/files/uu13-2022.pdf'

# Paraphrases, deliberately separated from source text and doctrinal assumptions.
RULES = [
 ('hierarchy', 'Hierarki Pasal 7', 'UUD 1945 > TAP MPR > UU/Perppu > PP > Perpres > Perda Provinsi > Perda Kabupaten/Kota. UU dan Perppu setingkat. Peringkat saja belum membuktikan pertentangan norma.', BASE, 'Pasal 7', 'binding_statute'),
 ('authority', 'Peraturan Pasal 8', 'Permen dan peraturan lembaga tidak diberi peringkat numerik otomatis. Periksa pengakuan berdasarkan perintah peraturan lebih tinggi atau kewenangan, materi, wilayah, dan batas delegasinya.', BASE, 'Pasal 8', 'binding_statute'),
 ('judicial_review', 'Pengujian oleh pengadilan', 'UU terhadap UUD diuji MK; peraturan di bawah UU terhadap UU diuji MA. AI hanya memberi indikasi beserta alasan; tidak menetapkan pembatalan, pencabutan, atau amar putusan.', UPDATE, 'Pasal I angka 2: Pasal 9 ayat (1)-(2)', 'binding_statute'),
 ('effective_date', 'Tanggal berlaku', 'Mulai berlaku sejak diundangkan kecuali ditentukan lain. Bedakan tanggal penetapan, pengundangan, mulai berlaku, tenggat pelaksanaan, dan masa peralihan. Jika tanggal belum terbukti, nyatakan belum terverifikasi.', BASE, 'Pasal 87', 'binding_statute'),
 ('omnibus', 'Perubahan omnibus', 'Metode omnibus dapat memuat materi baru, mengubah atau mencabut beberapa peraturan yang jenis dan hierarkinya sama. Identifikasi target setiap operasi, bukan satu target dari judul saja.', UPDATE, 'Pasal I angka 7: Pasal 64 ayat (1a)-(1b)', 'binding_statute'),
 ('participation', 'Partisipasi masyarakat', 'Periksa kesempatan masukan pada setiap tahapan, akses rancangan, pihak terdampak, dan konsultasi. Persona AI bukan pengganti partisipasi masyarakat.', UPDATE, 'Pasal I angka 14: Pasal 96', 'binding_statute'),
 ('explanation', 'Batang tubuh dan penjelasan', 'Penjelasan tidak membuat norma baru, delegasi baru, perubahan terselubung, atau perluasan/penyempitan yang bertentangan dengan batang tubuh. Bedakan penjelasan, contoh teknik, dan norma operatif.', ANNEX, 'Lampiran II angka 177, 178, 186', 'drafting_technique'),
 ('annex', 'Lampiran sebagai bagian peraturan', 'Periksa pernyataan bahwa lampiran merupakan bagian tidak terpisahkan. Jangan mengabaikan perubahan lampiran atau menganggap semua lampiran telah berhasil di-OCR.', ANNEX, 'Lampiran II angka 192', 'drafting_technique'),
 ('delegation', 'Lingkup delegasi', 'Identifikasi materi yang didelegasikan dan jenis peraturan penerima. Jangan menyimpulkan kewenangan hanya karena penerbitnya lembaga pemerintah.', ANNEX, 'Lampiran II angka 198-200, 210-212', 'drafting_technique'),
 ('subdelegation', 'Delegasi lanjutan', 'Perhatikan rumusan diatur dengan versus diatur dengan atau berdasarkan dan larangan delegasi lanjutan tanpa dasar. Baca keseluruhan pemberian kewenangan; jangan membuat kesimpulan dari satu kata.', ANNEX, 'Lampiran II angka 201-204, 212', 'drafting_technique'),
 ('repeal_rank', 'Pencabutan dan tingkatan', 'Pencabutan dilakukan dengan peraturan setingkat atau lebih tinggi. PP tidak diberi kewenangan mencabut UU oleh mesin ini. Pastikan target seluruh peraturan atau hanya ketentuan tertentu.', ANNEX, 'Lampiran II angka 221-225', 'drafting_technique'),
 ('withdrawal', 'Penarikan sebelum berlaku', 'Bedakan pencabutan dari penarikan peraturan yang sudah diundangkan tetapi belum mulai berlaku; periksa rumusan dan waktunya.', ANNEX, 'Lampiran II angka 226', 'drafting_technique'),
 ('no_cascade', 'Tidak ada pencabutan berantai otomatis', 'Pencabutan satu peraturan tidak otomatis mengubah semua peraturan terkait. Catat dependensi dan kebutuhan review; jangan menandai semuanya tidak berlaku.', ANNEX, 'Lampiran II angka 228', 'drafting_technique'),
 ('no_revival', 'Tidak hidup kembali otomatis', 'Peraturan yang dicabut tetap tidak berlaku meskipun peraturan pencabut kemudian dicabut. Jangan menghidupkan kembali versi lama secara otomatis.', ANNEX, 'Lampiran II angka 229', 'drafting_technique'),
 ('change_unit', 'Unit perubahan', 'Perubahan bisa menyisipkan, menambah, menghapus, atau mengganti bab/pasal/ayat sampai frasa dan tanda baca. Terapkan hanya unit yang disebut; perubahan ayat tidak menghapus ayat lain.', ANNEX, 'Lampiran II angka 230-231', 'drafting_technique'),
 ('amendment_container', 'Pasal I dan Pasal II', 'Pada dasarnya Pasal I menampung instruksi perubahan dan Pasal II memuat saat berlaku serta dapat memuat peralihan. Nomor Romawi adalah wadah perubahan, bukan Pasal 1/2 dari peraturan target. Perhatikan tambahan teknik omnibus 2022.', ANNEX, 'Lampiran II angka 233; dibaca bersama tambahan 233a-233b dalam UU 13/2022', 'drafting_technique'),
 ('insert_number', 'Penyisipan pasal dan ayat', 'Pasal sisipan memakai nomor berhuruf seperti 128A; ayat sisipan seperti (1a), (1b). Pertahankan identitas unit lain. Periksa teknik khusus omnibus pada tambahan 236a-236c tahun 2022.', ANNEX, 'Lampiran II angka 234-235', 'drafting_technique'),
 ('delete_tombstone', 'Penghapusan unit', 'Unit yang dihapus tetap dicantumkan nomornya dengan keterangan Dihapus. Simpan tombstone dan sumber operasi; jangan menggeser penomoran unit berikutnya.', ANNEX, 'Lampiran II angka 236', 'drafting_technique'),
 ('norm_language', 'Operator dan modalitas norma', 'Dan kumulatif, atau alternatif, dan/atau keduanya. Berhak=hak; berwenang=kewenangan; dapat=diskresi; wajib=kewajiban; harus=syarat; dilarang=larangan. Baca konteks dan jangan mengarang sanksi.', ANNEX, 'Lampiran II angka 262-270; tambahan 270a-270c tahun 2022 perlu dibaca untuk konteks terkait', 'drafting_technique'),
 ('references', 'Rujukan presisi', 'Resolusi rujukan harus memuat peraturan, pasal, ayat, huruf, dan versi yang tepat. Rujukan yang belum terselesaikan menjadi kebutuhan pencarian, bukan bukti konflik.', ANNEX, 'Lampiran II angka 271-275', 'drafting_technique'),
 ('conflict_test', 'Uji pertentangan substantif', 'Bandingkan norma pada subjek, objek, wilayah, waktu, kondisi pemicu yang beririsan; periksa definisi, pengecualian, delegasi, peralihan dan interpretasi yang dapat menyelaraskan. Sebutkan dua kewajiban/larangan yang tidak dapat dipenuhi bersama.', None, 'Protokol analisis RuleLab, bukan norma peraturan', 'engineering_guardrail'),
 ('same_level', 'Lex specialis dan lex posterior', 'Asas ini adalah alat penalaran, bukan algoritme pembatalan. Kebaruan tanggal tidak otomatis mencabut aturan lama; kesamaan tingkat dan irisan materi harus diuji. Aturan umum baru tidak otomatis menyingkirkan aturan khusus lama.', None, 'Heuristik penalaran yang wajib ditinjau ahli; bukan kewenangan membatalkan', 'engineering_guardrail'),
 ('version_integrity', 'Keutuhan versi', 'Naskah asli, instruksi perubahan, dan naskah konsolidasi berbeda. Konsolidasi mesin hanya boleh memakai operasi dengan kutipan, target, tanggal berlaku dan review eksplisit. Putusan bersyarat dan perubahan yang belum terambil membuat status hukum belum terverifikasi.', None, 'Protokol provenance RuleLab', 'engineering_guardrail'),
 ('source_versions', 'Versi pedoman teknik', 'UU 13/2022 mengubah dan menambah sejumlah angka Lampiran II, antara lain angka 176, 180, 188, 190. Jangan memakai seluruh Lampiran II tahun 2011 seolah seluruhnya merupakan teknik terkini. Halaman scan belum dibaca tetap menjadi gap.', UPDATE, 'Pasal I angka 19 dan Lampiran II perubahan', 'binding_statute'),
]

def build():
 previous_path=ROOT/'data/legal/rulebook.json'
 approved={r['id']:r['source']['sha256'] for r in json.loads(previous_path.read_text())['rules'] if r['source']} if previous_path.exists() else {}
 rules=[]
 for rid,title,instruction,url,locator,kind in RULES:
  src=None
  if url:
   raw=ROOT/'data/raw'/url.rsplit('/',1)[1]
   src={'url':url,'locator':locator,'raw_file':str(raw.relative_to(ROOT)),
        'sha256':hashlib.sha256(raw.read_bytes()).hexdigest(),
        'source_version':'2022' if url==UPDATE else '2011',
        'version_note':'Baca bersama UU 15/2019 dan UU 13/2022; bukan sertifikasi lengkap hukum terkini.'}
   if rid in approved and approved[rid]!=src['sha256']:
    raise ValueError('Sumber pedoman berubah: '+rid+'. Tinjau kembali ringkasan dan versi sebelum memperbarui rulebook.')
  rules.append({'id':rid,'title':title,'instruction':instruction,'classification':kind,'source':src,'review_required':True})
 pack={'schema_version':'1.0','version':'id-legal-2026-10-11.1','researched_on':'2026-10-11',
       'current_law_certified':False,'basis':['UU 12/2011','UU 15/2019','UU 13/2022'],
       'coverage_note':'Pedoman terkurasi. Tidak mencakup semua perubahan, putusan, bidang hukum, atau lampiran scan. Ringkasan bukan kutipan resmi.',
       'hierarchy':['UUD','TAP_MPR',['UU','PERPPU'],'PP','PERPRES','PERDA_PROV','PERDA_KAB'],
       'rules':rules}
 folder=ROOT/'data/legal';folder.mkdir(exist_ok=True)
 (folder/'rulebook.json').write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
 guide=['# Pedoman legal RuleLab', '', pack['coverage_note'], '', 'Versi: '+pack['version'], '',
        'Pedoman disisipkan ke semua panggilan Gemini/Vertex: analisis, pembuatan draft dan simulasi. Validator memeriksa kutipan, identitas aturan, dan kedudukan sumber. Kualitas penalaran LLM masih perlu evaluasi dengan ahli.', '']
 for r in rules:
  guide.extend(['## '+r['title']+' (`'+r['id']+'`)','',r['instruction'],'','Klasifikasi: '+r['classification']])
  if r['source']:guide.append('Sumber: '+r['source']['locator']+' — '+r['source']['url'])
  guide.append('')
 (ROOT/'docs/LEGAL_GUIDE.md').write_text('\n'.join(guide))

if __name__=='__main__':build()
