"""Source-linked drafting scaffolds; placeholders never imply legal approval."""
from datetime import date
from pydantic import BaseModel, Field
from typing import Literal
from app.models import DraftInput, RegType

SOURCES = [
    {'id':'uu12', 'title':'UU 12/2011 · Lampiran II', 'url':'https://peraturan.bpk.go.id/Download/28610/UU%2012%20Tahun%202011.pdf', 'locator':'Lampiran II, angka 1, 28–40, 50–58; Bab IV bentuk rancangan'},
    {'id':'uu13', 'title':'UU 13/2022 · perubahan teknik penyusunan', 'url':'https://jdih.komdigi.go.id/produk_hukum/view/id/809/t/undangundang+nomor+13+tahun+2022', 'locator':'Pasal I angka 19 dan Lampiran II'},
    {'id':'daerah', 'title':'Permendagri 80/2015 · Lampiran III', 'url':'https://peraturan.bpk.go.id/Download/157272/Permen-No.80-TH-2015.pdf', 'locator':'Annex III, forms for regional regulations, regional head regulations and DPRD regulations; read together with Permendagri 120/2018'},
    {'id':'daerah_perubahan', 'title':'Permendagri 120/2018', 'url':'https://peraturan.bpk.go.id/Details/240988/permendagri-no-120-tahun-2018', 'locator':'Perubahan atas Permendagri 80/2015'},
    {'id':'desa', 'title':'Permendagri 111/2014 · peraturan di desa', 'url':'https://bulelengkab.go.id/informasi/detail/bank_data/peraturan-menteri-dalam-negeri-republik-indonesia-nomor-111-tahun-2014-tentang-pedoman-teknis-peratu-46', 'locator':'Pasal 4, 8, 12, 27–28, 33 dan Lampiran'},
]
# Family determines the form; authority/delegation still needs a separate review.
ROWS = [
 ('UU','Undang-Undang','Nasional','DPR bersama Presiden','Joint approval of the DPR and the President; the authority basis follows the bill’s origin.','uu12'),
 ('PERPPU','Peraturan Pemerintah Pengganti Undang-Undang','Nasional','Presiden','Issued by the President; the context of compelling urgency needs review.','uu12'),
 ('PP','Peraturan Pemerintah','Nasional','Presiden','Implements a Law; include the relevant authority basis and delegation.','uu12'),
 ('PERPRES','Peraturan Presiden','Nasional','Presiden','Mandated by a higher regulation or the exercise of government power.','uu12'),
 ('PERMEN','Peraturan Menteri','Nasional','Menteri terkait','Authority/delegation under Article 8; do not assume a separate rank under Article 7.','uu12'),
 ('PER_LEMBAGA','Peraturan Lembaga','Nasional','Pimpinan lembaga','General Article 8 framework; names and institution-specific drafting rules must be adjusted.','uu12'),
 ('PERDA_PROV','Peraturan Daerah Provinsi','Daerah','DPRD Provinsi bersama Gubernur','Joint approval; promulgated in the Provincial Gazette.','daerah'),
 ('PERDA_KAB','Peraturan Daerah Kabupaten/Kota','Daerah','DPRD bersama Bupati/Wali Kota','Choose regency or city so officials and region stay consistent.','daerah'),
 ('PERGUB','Peraturan Gubernur','Daerah','Gubernur','No DPRD approval block; promulgated in the Regional Bulletin.','daerah'),
 ('PERBUP','Peraturan Bupati','Daerah','Bupati','Exercise of authority/delegation; not the same as a Perda.','daerah'),
 ('PERWALI','Peraturan Wali Kota','Daerah','Wali Kota','Pelaksanaan kewenangan/delegasi; memakai Berita Daerah Kota.','daerah'),
 ('PERDPRD_PROV','Peraturan DPRD Provinsi','Daerah','Pimpinan DPRD Provinsi','DPRD regulation format; not the Perda format with joint approval.','daerah'),
 ('PERDPRD_KAB','Peraturan DPRD Kabupaten/Kota','Daerah','Pimpinan DPRD Kabupaten/Kota','The enacting official and region name follow the related DPRD.','daerah'),
 ('PERDES','Peraturan Desa','Desa','BPD bersama Kepala Desa','Joint agreement of the BPD and the village head; promulgated in the Village Gazette.','desa'),
 ('PERKADES','Peraturan Kepala Desa','Desa','Kepala Desa','Implementation of village regulations; promulgated in the Village Bulletin.','desa'),
]
TEMPLATES = {row[0]:dict(zip(['id','label','group','authority','note','source_id'],row)) for row in ROWS}

class TemplateRequest(BaseModel):
    title: str = Field(min_length=3, max_length=300)
    regulation_type: RegType = 'PP'
    form: Literal['new','amendment'] = 'new'
    region: str = Field(default='', max_length=100)
    local_level: Literal['kabupaten','kota'] = 'kabupaten'
    institution: str = Field(default='', max_length=140)
    legislative_origin: Literal['DPR','PRESIDEN','DPD'] = 'DPR'
    year: int = Field(default_factory=lambda:date.today().year, ge=1945, le=2100)
    number: str = Field(default='', max_length=40)
    place: str = Field(default='', max_length=100)
    considering: str = Field(default='', max_length=3000)
    legal_bases: str = Field(default='', max_length=4000)
    scope: str = Field(default='', max_length=1000)
    include_transition: bool = False
    include_explanation: bool = False
    include_attachment: bool = False


def catalog():
    return {'version':'id-drafting-2026-10-13','templates':list(TEMPLATES.values()),'sources':SOURCES,
            'framework':['Title','Pembukaan','Body (batang tubuh)','Penutup','Explanation (if needed)','Annex (if needed)'],
            'reference_only':[{'label':'UUD 1945','note':'Constitutional amendments follow their own procedure, not a regular draft template.'},
                              {'label':'Ketetapan MPR','note':'MPR form and authority need a separate procedure; not generated from an executive regulation scaffold.'}],
            'notice':'The template helps with the document form. Substance, authority, delegation, legal basis and the formation process must still be reviewed. Some institutions have additional drafting rules.'}


def build(request: TemplateRequest):
    r=request;kind=r.regulation_type;template=TEMPLATES[kind]
    region=r.region.strip().upper() or '[NAMA WILAYAH]'
    institution=r.institution.strip().upper() or '[NAMA KEMENTERIAN/LEMBAGA]'
    local='KOTA' if r.local_level=='kota' else 'KABUPATEN'
    leader='WALI KOTA' if r.local_level=='kota' else 'BUPATI'
    full={'UU':'UNDANG-UNDANG REPUBLIK INDONESIA','PERPPU':'PERATURAN PEMERINTAH PENGGANTI UNDANG-UNDANG REPUBLIK INDONESIA',
          'PP':'PERATURAN PEMERINTAH REPUBLIK INDONESIA','PERPRES':'PERATURAN PRESIDEN REPUBLIK INDONESIA',
          'PERMEN':f'PERATURAN MENTERI {institution} REPUBLIK INDONESIA','PER_LEMBAGA':f'PERATURAN {institution}',
          'PERDA_PROV':f'PERATURAN DAERAH PROVINSI {region}','PERDA_KAB':f'PERATURAN DAERAH {local} {region}',
          'PERGUB':f'PERATURAN GUBERNUR {region}','PERBUP':f'PERATURAN BUPATI {region}','PERWALI':f'PERATURAN WALI KOTA {region}',
          'PERDPRD_PROV':f'PERATURAN DPRD PROVINSI {region}','PERDPRD_KAB':f'PERATURAN DPRD {local} {region}',
          'PERDES':f'PERATURAN DESA {region}','PERKADES':f'PERATURAN KEPALA DESA {region}'}[kind]
    issuer= ('PRESIDEN REPUBLIK INDONESIA' if kind in {'UU','PERPPU','PP','PERPRES'} else
             f'MENTERI {institution} REPUBLIK INDONESIA' if kind=='PERMEN' else
             f'[JABATAN PIMPINAN] {institution}' if kind=='PER_LEMBAGA' else
             f'GUBERNUR {region}' if kind in {'PERDA_PROV','PERGUB'} else
             f'{leader} {region}' if kind=='PERDA_KAB' else
             f'BUPATI {region}' if kind=='PERBUP' else f'WALI KOTA {region}' if kind=='PERWALI' else
             f'KETUA DPRD {"PROVINSI" if kind=="PERDPRD_PROV" else local} {region}' if kind.startswith('PERDPRD') else f'KEPALA DESA {region}')
    agreement=''
    if kind=='UU': agreement='Dengan Persetujuan Bersama\nDEWAN PERWAKILAN RAKYAT REPUBLIK INDONESIA\ndan\nPRESIDEN REPUBLIK INDONESIA\n\n'
    if kind.startswith('PERDA_'): agreement=f'Dengan Persetujuan Bersama\nDEWAN PERWAKILAN RAKYAT DAERAH {"PROVINSI" if kind=="PERDA_PROV" else local} {region}\ndan\n{issuer}\n\n'
    if kind=='PERDES': agreement=f'Dengan Kesepakatan Bersama\nBADAN PERMUSYAWARATAN DESA {region}\ndan\n{issuer}\n\n'
    constitutional={'UU':{'DPR':'Pasal 20 dan Pasal 21','PRESIDEN':'Pasal 5 ayat (1) dan Pasal 20','DPD':'Pasal 20 dan Pasal 22D ayat (1)'}[r.legislative_origin],
                    'PERPPU':'Pasal 22 ayat (1)','PP':'Pasal 5 ayat (2)','PERPRES':'Pasal 4 ayat (1)',
                    'PERDA_PROV':'Pasal 18 ayat (6)','PERDA_KAB':'Pasal 18 ayat (6)'}.get(kind)
    defaults=[]
    if constitutional: defaults.append(constitutional+' Undang-Undang Dasar Negara Republik Indonesia Tahun 1945')
    defaults.append('[Cantumkan dasar kewenangan dan/atau pasal delegasi yang relevan; verifikasi versi berlaku]')
    bases=r.legal_bases.splitlines() if r.legal_bases.strip() else defaults
    considering=r.considering.splitlines() if r.considering.strip() else ['[Uraikan alasan filosofis, sosiologis dan/atau yuridis sesuai jenis peraturan]','[Uraikan kebutuhan pengaturan atau ketentuan yang memerintahkan pembentukan]']
    considering=[x.strip().rstrip('; .') for x in considering if x.strip()]
    bases=[x.strip().rstrip('; .') for x in bases if x.strip()]
    # Region/RI belong to the heading, not the Perda enactment clause (Annex II 58).
    enacted=full.replace(' REPUBLIK INDONESIA','')
    if kind.startswith('PERDA_'): enacted='PERATURAN DAERAH'
    preamble=f'DENGAN RAHMAT TUHAN YANG MAHA ESA\n\n{issuer},\n\nMenimbang:\n'+ '\n'.join(f'{chr(97+i)}. {x};' for i,x in enumerate(considering[:10]))
    preamble+='\n\nMengingat:\n'+'\n'.join(f'{i+1}. {x};' for i,x in enumerate(bases[:20]))
    preamble+='\n\n'+agreement+f'MEMUTUSKAN:\nMenetapkan: {enacted} TENTANG {r.title.upper()}.'
    local_group=template['group']=='Daerah'
    gazette=(f'LEMBARAN DAERAH {"PROVINSI" if kind=="PERDA_PROV" else local} {region}' if kind.startswith('PERDA_') else
             f'BERITA DAERAH {"PROVINSI" if kind in {"PERGUB","PERDPRD_PROV"} else "KOTA" if kind=="PERWALI" else local if kind=="PERDPRD_KAB" else "KABUPATEN"} {region}' if local_group else
             f'{"LEMBARAN" if kind=="PERDES" else "BERITA"} DESA {region}' if template['group']=='Desa' else
             'LEMBARAN NEGARA REPUBLIK INDONESIA' if kind in {'UU','PERPPU','PP','PERPRES'} else 'BERITA NEGARA REPUBLIK INDONESIA')
    # National promulgation authority is left explicit for verification (UU 13/2022).
    promulgator=(f'SEKRETARIS DAERAH {"PROVINSI" if kind in {"PERDA_PROV","PERGUB","PERDPRD_PROV"} else "KOTA" if kind=="PERWALI" else "KABUPATEN" if kind=="PERBUP" else local} {region}' if local_group else
                 f'SEKRETARIS DESA {region}' if template['group']=='Desa' else '[JABATAN PEJABAT PENGUNDANG SESUAI KETENTUAN BERLAKU]')
    place=r.place.strip() or '[TEMPAT PENETAPAN]'
    closing=f'Ditetapkan di {place}\npada tanggal [TANGGAL PENETAPAN]\n{issuer},\n\n[NAMA PEJABAT PENETAP]\n\nDiundangkan di [TEMPAT PENGUNDANGAN]\npada tanggal [TANGGAL PENGUNDANGAN]\n{promulgator},\n\n[NAMA PEJABAT PENGUNDANG]\n\n{gazette} TAHUN {r.year} NOMOR [NOMOR PENGUNDANGAN]'
    if kind.startswith('PERDA_'): closing+='\nNOREG PERATURAN DAERAH: [NOMOR REGISTER]'
    short_name={'UU':'Undang-Undang','PERPPU':'Peraturan Pemerintah Pengganti Undang-Undang',
                'PP':'Peraturan Pemerintah','PERPRES':'Peraturan Presiden','PERMEN':'Peraturan Menteri',
                'PER_LEMBAGA':f'Peraturan {institution.title()}', 'PERDA_PROV':'Peraturan Daerah','PERDA_KAB':'Peraturan Daerah',
                'PERGUB':'Peraturan Gubernur','PERBUP':'Peraturan Bupati','PERWALI':'Peraturan Wali Kota',
                'PERDPRD_PROV':'Peraturan DPRD','PERDPRD_KAB':'Peraturan DPRD','PERDES':'Peraturan Desa',
                'PERKADES':'Peraturan Kepala Desa'}[kind]
    final=f'{short_name} ini mulai berlaku pada tanggal diundangkan.\nAgar setiap orang mengetahuinya, memerintahkan pengundangan {short_name} ini dengan penempatannya dalam '+gazette.title()+'.'
    if r.form=='amendment':
        articles=[{'number':'I','text':'Beberapa ketentuan dalam [JENIS, NOMOR, TAHUN DAN NAMA PERATURAN YANG DIUBAH] diubah sebagai berikut:\n1. Ketentuan Pasal [NOMOR PASAL] diubah sehingga berbunyi sebagai berikut:\nPasal [NOMOR PASAL]\n[RUMUSAN PASAL PENGGANTI]'}, {'number':'II','text':final}]
    else:
        articles=[{'number':'1','chapter':'BAB I\nKETENTUAN UMUM','text':f'Dalam {short_name} ini yang dimaksud dengan:\n1. [Istilah] adalah [definisi yang relevan dengan materi pengaturan].'},
                  {'number':'2','chapter':'BAB II\nMATERI POKOK','text':'(1) [Rumuskan subjek, hak/kewajiban, tindakan dan objek pengaturan].\n(2) [Rumuskan prosedur atau pelaksanaan yang diperlukan].'}]
        if r.include_transition: articles.append({'number':'3','chapter':'BAB III\nKETENTUAN PERALIHAN','text':'[Atur penyesuaian bagi keadaan, hak, kewajiban atau proses yang sudah berlangsung bila diperlukan].'})
        articles.append({'number':str(len(articles)+1),'chapter':f'BAB {"IV" if r.include_transition else "III"}\nKETENTUAN PENUTUP','text':final})
    payload={'title':r.title,'regulation_type':kind,'scope':r.scope,'preamble':preamble,'articles':articles,
             'document_heading':f'RANCANGAN\n{full}\nNOMOR {r.number.strip() or "[BELUM DITETAPKAN]"} TAHUN {r.year}\nTENTANG\n{r.title.upper()}',
             'closing':closing,'explanation':'I. UMUM\n[Penjelasan umum]\n\nII. PASAL DEMI PASAL\n[Penjelasan per pasal; tidak memuat norma baru]' if r.include_explanation else '',
             'attachments':'[Judul dan isi lampiran yang dirujuk dalam batang tubuh]' if r.include_attachment else '',
             'drafting':r.model_dump(exclude={'title','regulation_type','considering','legal_bases','scope'}),
             'template_source_ids':['uu12','uu13',template['source_id']]}
    draft=DraftInput.model_validate(payload).model_dump()
    checks=[{'title':'Type and issuing official','detail':template['authority']}, {'title':'Legal basis and delegation','detail':'Check all placeholders, the issuing authority and the relevant sources.'},
            {'title':'Considerations and dictum','detail':'Considerations must match the substance; do not copy the legal basis from another topic.'},
            {'title':'Body (batang tubuh)','detail':'Pasal I/II for amendments; Chapter/Article/Paragraph for new texts. Transitional, criminal and annex provisions only when needed.'},
            {'title':'Closing and promulgation','detail':'Official, place, date, medium and promulgation number must be verified before finalizing.'}]
    return {'draft':draft,'template':template,'checklist':checks,'sources':[s for s in SOURCES if s['id'] in set(payload['template_source_ids'])], 'notice':catalog()['notice']}
