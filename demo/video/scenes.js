/* RuleLab demo — scene definitions. Product screens are replicas with simulated data. */
const css = String.raw;
const sceneCSS = document.createElement('style');
document.head.appendChild(sceneCSS);
const addCSS = s => (sceneCSS.textContent += s);
const bars = (n, w = [92, 78, 88, 64, 84, 70, 90]) => Array.from({ length: n }, (_, i) => `<i style="width:${w[i % w.length]}%"></i>`).join('');
const cue = (t, k, extra = {}) => CUES.push({ t: +t.toFixed(3), k, ...extra });
const PEOPLE = [['a', 'Elderly citizens', 'elderly'], ['b', 'People with disabilities', 'disabilities'], ['c', 'Villages without signal', 'villages']];
const peopleHTML = () => PEOPLE.map(([k, l]) => `<div class="pp"><div class="pp-img"><img class="lk-img" src="assets/citizen-${k}-locked.png" alt=""><img class="sv-img" src="assets/citizen-${k}-served.png" alt=""></div><b>${l}</b><div class="pp-lock lk">${ic('lock', 30, 2.4)}</div><div class="pp-lock un">${ic('lock-open', 30, 2.4)}</div></div>`).join('');

addCSS(css`
.hk-page { left: 140px; top: 150px; width: 1640px; height: 780px; border-radius: 22px; }
.hk-page .bgp { position: absolute; inset: 0; background: #fff; border-radius: 22px; box-shadow: 0 60px 120px -40px rgba(20,22,30,.3); }
.ghost { position: absolute; left: 80px; right: 80px; display: flex; flex-direction: column; gap: 24px; }
.ghost i { display: block; height: 16px; background: #ECEDF0; border-radius: 8px; }
.hk-label { position: absolute; left: 80px; top: 286px; }
.hk-line { position: absolute; left: 80px; top: 326px; font-size: 60px; font-weight: 600; white-space: nowrap; color: var(--ink); letter-spacing: -0.01em; }
.hk-caret { display: inline-block; width: 4px; height: 58px; background: var(--red); margin-left: 4px; vertical-align: -8px; }
.hk-orig { position: absolute; left: 80px; top: 426px; font-size: 26px; color: var(--muted); font-style: italic; }
.hk-dot { left: 949px; top: 529px; width: 22px; height: 22px; border-radius: 50%; background: var(--red); }
.hk-people { left: 0; right: 0; top: 140px; display: flex; justify-content: center; gap: 44px; }
.pp { position: relative; width: 400px; height: 474px; background: #fff; border-radius: 26px; box-shadow: 0 40px 80px -30px rgba(20,22,30,.28), 0 0 0 1px rgba(20,22,30,.05); display: flex; flex-direction: column; align-items: center; }
.pp-img { position: relative; width: 400px; height: 400px; border-radius: 26px 26px 0 0; overflow: hidden; background: #F0F0F2; }
.pp-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.pp-img .sv-img { opacity: 0; }
.pp b { font-size: 25px; letter-spacing: -0.02em; height: 74px; display: flex; align-items: center; }
.pp-lock { position: absolute; right: -16px; top: -16px; width: 70px; height: 70px; border-radius: 50%; background: var(--ink); color: #fff; display: grid; place-items: center; box-shadow: 0 10px 24px rgba(0,0,0,.25); }
.pp-lock.un { background: var(--green); }
.hk-head { left: 0; right: 0; top: 660px; text-align: center; font-size: 170px; }

.pb-plane { left: 50%; top: 50%; width: 2600px; height: 1900px; margin-left: -1300px; margin-top: -950px; }
.pb-grid { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(9, 1fr); gap: 34px; }
.rg { background: #fff; border-radius: 16px; padding: 18px 20px; box-shadow: 0 0 0 1px rgba(20,22,30,.06); height: 160px; }
.rg .tg { font-size: 14px; font-weight: 800; padding: 3px 9px; border-radius: 6px; background: #F1F2F4; color: var(--ink2); }
.rg b { display: block; font-size: 18px; margin: 12px 0 14px; }
.rg i { display: block; height: 10px; border-radius: 5px; background: #EEEFF2; margin-bottom: 9px; }
.rg.hot { box-shadow: 0 0 0 3px var(--red); }
.pb-svg { position: absolute; inset: 0; overflow: visible; }
.pb-fade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(242,242,243,.97) 0%, rgba(242,242,243,.85) 38%, rgba(242,242,243,0) 70%); }
.pb-head { left: 120px; top: 330px; font-size: 118px; }
.pb-txt { left: 120px; top: 360px; font-size: 100px; width: 760px; }
.pb-vis { left: 930px; top: 190px; width: 860px; height: 640px; }
.tk { display: flex; align-items: center; gap: 14px; padding: 16px 0; border-bottom: 1px solid var(--line); font-size: 21px; font-weight: 600; }
.tk span:last-child { margin-left: auto; }
.bub { position: absolute; padding: 20px 24px; border-radius: 22px; font-size: 23px; line-height: 1.4; max-width: 600px; }
.bub.u { right: 40px; background: var(--ink); color: #fff; border-bottom-right-radius: 6px; }
.bub.b { left: 40px; background: #F1F2F4; border-bottom-left-radius: 6px; }
.stamp { position: absolute; border: 5px solid var(--red); color: var(--red); font-weight: 800; letter-spacing: .06em; padding: 10px 20px; border-radius: 12px; background: rgba(255,255,255,.92); text-align: center; }
.stamp small { display: block; font-size: 15px; letter-spacing: 0; font-weight: 700; }
.cpl { position: absolute; background: #fff; border-radius: 16px; padding: 12px 16px; font-size: 18px; font-weight: 600; box-shadow: 0 16px 34px -14px rgba(20,22,30,.35); display: flex; gap: 10px; align-items: center; color: var(--ink); }
.cpl .ic { color: var(--red); }

.rv-dot { left: 949px; top: 529px; width: 22px; height: 22px; border-radius: 50%; background: var(--red); }
.rv-lock { left: 0; right: 0; top: 380px; display: flex; justify-content: center; align-items: center; gap: 34px; }
.rv-lock .logo-ic { width: 150px; height: 150px; }
.rv-word { font-size: 150px; font-weight: 800; letter-spacing: -0.05em; color: #fff; white-space: nowrap; }
.rv-tag { left: 0; right: 0; top: 610px; text-align: center; font-size: 38px; color: #C9CBD0; font-weight: 500; letter-spacing: -0.01em; }
.rv-gem { left: 0; right: 0; top: 676px; display: flex; justify-content: center; }
.rv-gem span { color: #fff; border: 1px solid #3a3c42; background: #18191c; padding: 10px 20px; border-radius: 999px; font-size: 22px; font-weight: 700; display: flex; gap: 10px; align-items: center; }
.rv-pills { left: 0; right: 0; top: 780px; display: flex; justify-content: center; gap: 22px; }
.rv-pills span { font-size: 28px; font-weight: 700; color: #fff; padding: 14px 28px; border-radius: 999px; border: 2px solid var(--red); background: rgba(200,16,46,.12); }
.rv-pills b { color: #ff6b81; margin-right: 10px; }
.wipe { inset: 0; background: var(--bg); }

.dw { left: 160px; top: 56px; }
.prompt { left: 330px; top: 420px; width: 1260px; min-height: 124px; background: #fff; border-radius: 34px; box-shadow: 0 40px 90px -30px rgba(20,22,30,.45), 0 0 0 1px rgba(20,22,30,.06); display: flex; align-items: center; gap: 22px; padding: 22px 26px 22px 30px; }
.prompt .ptx { flex: 1; font-size: 28px; line-height: 1.45; color: var(--ink); font-weight: 500; }
.prompt .ptx em { font-style: normal; background: #F0F1F3; border-radius: 9px; padding: 1px 8px; font-weight: 700; }
.prompt .ptx .car { display: inline-block; width: 3px; height: 30px; background: var(--red); vertical-align: -5px; margin-left: 2px; }
.send { width: 64px; height: 64px; border-radius: 50%; background: var(--red); color: #fff; display: grid; place-items: center; flex: none; }
.ed-body { position: absolute; inset: 0; padding: 22px; }
.paper { position: absolute; left: 238px; top: 196px; width: 700px; height: 618px; background: #fff; border: 1px solid var(--line); border-radius: 18px; overflow: hidden; }
.outline { position: absolute; left: 22px; top: 196px; width: 200px; }
.outline .olh { font-size: 11px; font-weight: 800; letter-spacing: .12em; color: var(--muted); margin: 6px 10px 10px; }
.ol { display: flex; align-items: center; justify-content: space-between; padding: 9px 10px; border-radius: 10px; font-size: 15px; font-weight: 600; color: var(--ink2); border: 1px solid transparent; }
.ol.on { background: #fff; border-color: #F2B6C0; box-shadow: inset 3px 0 0 var(--red); color: var(--red2); }
.ol .od { width: 20px; height: 20px; border-radius: 50%; background: var(--red2); color: #fff; font-size: 11px; font-weight: 800; display: grid; place-items: center; }
.ol-add { margin-top: 8px; padding: 10px; border: 1px dashed #D5D8DE; border-radius: 10px; font-size: 14px; font-weight: 600; color: var(--muted); }
.paper-in { position: relative; padding: 30px 46px 60px; }
.p-top { display: flex; justify-content: center; gap: 10px; margin-bottom: 18px; }
.p-h { text-align: center; font-family: 'Cormorant', serif; font-weight: 700; color: var(--ink); }
.p-h1 { font-size: 30px; letter-spacing: .02em; line-height: 1.25; }
.p-h2 { font-size: 20px; margin-top: 8px; letter-spacing: .04em; }
.p-sec { font-family: 'Cormorant', serif; font-size: 21px; line-height: 1.5; color: var(--ink2); margin-top: 18px; }
.p-sec b { font-weight: 700; color: var(--ink); }
.pas { position: relative; border: 1px solid var(--line); border-radius: 14px; padding: 14px 18px; margin-top: 14px; background: #fff; }
.pas h4 { font-size: 15px; font-weight: 800; color: var(--ink); margin-bottom: 6px; display: flex; justify-content: space-between; }
.pas p { font-size: 16px; line-height: 1.5; color: var(--ink2); white-space: pre-line; }
.pas mark { background: #CFE0FF; color: inherit; border-radius: 3px; }
.pas.warn { border-color: #f2b6c0; box-shadow: inset 4px 0 0 var(--red); }
.gem { position: absolute; left: 954px; top: 196px; width: 374px; height: 618px; padding: 20px 22px; }
.gem .eyb { font-size: 11px; font-weight: 800; letter-spacing: .12em; color: var(--muted); margin-bottom: 4px; }
.gem h3 { font-size: 19px; display: flex; gap: 10px; align-items: center; }
.gstep { display: flex; gap: 12px; align-items: center; font-size: 15.5px; font-weight: 600; padding: 13px 0; border-bottom: 1px solid var(--line); color: var(--ink2); }
.gchips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.gloss { position: absolute; background: var(--ink); color: #fff; font-size: 17px; font-weight: 600; padding: 10px 16px; border-radius: 12px; white-space: nowrap; }
.keys { position: absolute; left: 0; top: 0; display: flex; gap: 8px; }
.keys span { min-width: 64px; height: 64px; padding: 0 16px; border-radius: 14px; background: #fff; border: 1px solid var(--line); border-bottom-width: 4px; display: grid; place-items: center; font-size: 22px; font-weight: 800; box-shadow: 0 14px 30px -12px rgba(0,0,0,.3); }
.toast { position: absolute; right: 420px; bottom: 24px; background: var(--ink); color: #fff; font-size: 15px; font-weight: 600; padding: 14px 20px; border-radius: 12px; display: flex; gap: 10px; align-items: center; }

.rvw-txt { left: 140px; top: 330px; font-size: 130px; }
.doc-mini { left: 1000px; top: 170px; width: 740px; height: 700px; padding: 34px; }
.dm-row { display: flex; gap: 16px; align-items: center; padding: 20px 0; border-bottom: 1px solid var(--line); }
.dm-row b { font-size: 19px; width: 90px; }
.dm-row .bb { flex: 1; } .dm-row .bb i { display: block; height: 11px; border-radius: 6px; background: #ECEDF0; margin: 6px 0; }
.dm-st { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; }
.beam { position: absolute; left: 0; right: 0; height: 4px; background: var(--red); box-shadow: 0 0 30px 8px rgba(200,16,46,.35); }
.pipe { left: 110px; top: 400px; width: 1700px; height: 300px; }
.pn { position: absolute; top: 0; width: 300px; height: 270px; background: #fff; border-radius: 22px; padding: 24px; box-shadow: 0 30px 60px -30px rgba(20,22,30,.3), 0 0 0 1px rgba(20,22,30,.05); }
.pn .pi { width: 54px; height: 54px; border-radius: 15px; background: var(--red-soft); color: var(--red2); display: grid; place-items: center; margin-bottom: 16px; }
.pn b { font-size: 22px; display: block; letter-spacing: -0.01em; }
.pn small { font-size: 16px; color: var(--muted); display: block; margin-top: 4px; }
.pn .big { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; margin-top: 4px; }
.ag { display: flex; gap: 9px; align-items: center; font-size: 15px; font-weight: 600; margin-top: 7px; }
.ag .spin, .ag .ok-ic { width: 16px; height: 16px; }
.conn { position: absolute; top: 132px; height: 4px; width: 50px; background: repeating-linear-gradient(90deg, #d4d6db 0 8px, transparent 8px 14px); }
.pkt { position: absolute; top: 127px; width: 14px; height: 14px; border-radius: 50%; background: var(--red); box-shadow: 0 0 12px rgba(200,16,46,.6); }
.pipe-k { left: 110px; top: 320px; display: flex; gap: 16px; align-items: center; }
.vsum { position: absolute; left: 22px; right: 22px; top: 196px; height: 54px; background: #fff; border: 1px solid var(--line); border-radius: 14px; display: flex; align-items: center; gap: 20px; padding: 0 18px; font-size: 15px; color: var(--ink2); }
.vsum b { color: var(--ink); font-weight: 800; }
.vsum .sp { flex: 1; }
.vsum .asof { display: flex; gap: 6px; align-items: center; border: 1px solid var(--line); border-radius: 8px; padding: 5px 10px; font-size: 13.5px; }
.vlist { position: absolute; left: 22px; top: 266px; width: 400px; }
.vchips { display: flex; gap: 6px; margin-bottom: 10px; }
.vchips span { font-size: 14px; font-weight: 600; color: var(--ink2); padding: 7px 12px; border-radius: 10px; display: flex; gap: 6px; align-items: center; border: 1px solid transparent; }
.vchips span i { font-style: normal; font-size: 11px; font-weight: 700; background: #F0F1F3; border-radius: 5px; padding: 1px 6px; }
.vchips span.on { background: #fff; border-color: var(--line); color: var(--ink); font-weight: 800; }
.fd { position: relative; border: 1px solid transparent; border-radius: 14px; padding: 13px 16px; margin-bottom: 8px; }
.fd.on { background: #fff; border-color: #F2B6C0; box-shadow: 0 10px 22px -16px rgba(180,35,56,.5); }
.fd small { font-size: 12.5px; color: var(--muted); font-weight: 600; display: block; padding-left: 18px; }
.fd h3 { font-size: 16.5px; line-height: 1.3; margin-top: 3px; padding-left: 18px; position: relative; }
.fd h3::before { content: ''; position: absolute; left: 0; top: 6px; width: 9px; height: 9px; border-radius: 50%; background: var(--amber); }
.fd.high h3::before { background: var(--red2); }
.fd.done h3 { color: var(--muted); }
.fd.done h3::before { background: var(--green); }
.vdet { position: absolute; left: 438px; top: 266px; width: 890px; height: 548px; background: #fff; border: 1px solid var(--line); border-radius: 18px; overflow: hidden; }
.vdet-in { position: absolute; left: 0; right: 0; top: 0; padding: 22px 26px 100px; }
.vtags { display: flex; gap: 8px; align-items: center; }
.vtags em { margin-left: auto; font-style: normal; font-size: 13px; color: var(--muted); }
.vdet h2 { font-size: 25px; letter-spacing: -0.02em; margin-top: 12px; }
.vdet p.rs { font-size: 15.5px; line-height: 1.55; color: var(--ink2); margin-top: 8px; }
.vleg { display: flex; gap: 18px; font-size: 12.5px; color: var(--muted); margin-top: 14px; }
.vleg i { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }
.vdiff { margin-top: 8px; border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; font-size: 15.5px; line-height: 1.7; background: #FBFBFC; white-space: pre-line; color: var(--ink2); }
.vdiff del { background: #FDE8EB; color: #9B1C31; text-decoration: line-through; text-decoration-color: #D98A98; border-radius: 3px; }
.vdiff ins { background: #E1F3E8; color: #17603F; text-decoration: none; border-radius: 3px; }
.vsrc-h { font-size: 12px; font-weight: 800; letter-spacing: .1em; color: var(--muted); margin-top: 18px; display: flex; gap: 10px; align-items: center; }
.sc { position: relative; border: 1px solid var(--line); border-radius: 14px; padding: 16px 18px; margin-top: 14px; overflow: hidden; background: #fff; }
.sc .sh { display: flex; gap: 10px; align-items: center; font-weight: 800; font-size: 16px; }
.sc .qt { font-family: 'Cormorant', serif; font-size: 19px; line-height: 1.45; color: var(--ink); margin-top: 8px; }
.sc .gl { font-size: 13.5px; color: var(--muted); margin-top: 6px; font-style: italic; }
.sc .meta { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
.sc .meta span { font-size: 12.5px; font-weight: 700; padding: 4px 8px; border-radius: 6px; background: #F3F4F6; color: var(--ink2); font-family: ui-monospace, Consolas, monospace; }
.sc .meta span.hl { background: var(--green-soft); color: var(--green); box-shadow: 0 0 0 2px #9fdcb8; }
.vstamp { position: absolute; right: 14px; top: 12px; font-size: 13px; font-weight: 800; color: var(--green); background: var(--green-soft); padding: 5px 10px; border-radius: 8px; display: flex; gap: 6px; align-items: center; }
.sc.bad { border-color: var(--red); background: #FFF6F7; }
.xstamp { position: absolute; right: 16px; top: 34px; border: 4px solid var(--red); color: var(--red); font-weight: 800; font-size: 19px; padding: 6px 14px; border-radius: 10px; background: #fff; transform: rotate(-6deg); }
.vsrcs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; align-items: start; }
.vsrcs .sc { padding-bottom: 46px; }
.vsrcs .sc { margin-top: 10px; padding: 14px 15px; }
.vsrcs .sc .sh { font-size: 13.5px; gap: 6px; }
.vsrcs .sc .qt { font-size: 16px; }
.vsrcs .sc .gl { font-size: 12px; }
.vsrcs .sc .meta span { font-size: 11px; }
.vsrcs .vstamp { top: auto; bottom: 12px; right: auto; left: 15px; }
.vsrcs .xstamp { top: 70px; right: 10px; font-size: 15px; border-width: 3px; padding: 5px 10px; }
.vact { position: absolute; left: 0; right: 0; bottom: 0; padding: 26px 26px 16px; background: linear-gradient(rgba(255,255,255,0), #fff 40%); display: flex; gap: 10px; }
.vtoast { right: 24px; bottom: 24px; }
.applied { position: absolute; left: 0; right: 0; top: 0; padding: 10px 20px; background: var(--green); color: #fff; font-weight: 700; font-size: 15px; display: flex; gap: 10px; align-items: center; }

.im-head { left: 0; right: 0; top: 330px; text-align: center; font-size: 140px; }
.pg { position: absolute; width: 540px; height: 720px; background: #fff; border-radius: 10px; padding: 50px 54px; box-shadow: 0 50px 100px -30px rgba(20,22,30,.4), 0 0 0 1px rgba(20,22,30,.06); }
.pg .ph { font-family: 'Cormorant', serif; font-weight: 700; text-align: center; font-size: 20px; line-height: 1.35; }
.pg .pl { height: 9px; border-radius: 5px; background: #ECEDF0; margin: 11px 0; }
.pg .pt { font-weight: 800; font-size: 13px; margin-top: 18px; }
.fname { position: absolute; left: 0; right: 0; bottom: -70px; display: flex; justify-content: center; }
.fname span { background: var(--ink); color: #fff; font-size: 16px; font-weight: 700; padding: 10px 16px; border-radius: 12px; display: flex; gap: 10px; align-items: center; }
.mw { position: absolute; background: #F7F8FA; border-radius: 20px; overflow: hidden; box-shadow: 0 40px 90px -36px rgba(20,22,30,.4), 0 0 0 1px rgba(20,22,30,.06); }
.mw-top { display: flex; align-items: center; gap: 10px; height: 52px; padding: 0 18px; background: #fff; border-bottom: 1px solid var(--line); font-size: 14px; color: var(--muted); }
.mw-top .logo-ic { width: 26px; height: 26px; }
.mw-top b { color: var(--ink); }
.mw-top .sp { flex: 1; }
.mw-in { position: relative; padding: 18px 20px; }
.mw h2 { font-size: 30px; font-weight: 800; letter-spacing: -0.03em; }
.mw .sub { font-size: 14px; color: var(--muted); margin-top: 2px; }
/* outcome: Activity */
.actw { left: 1080px; top: 96px; width: 780px; height: 820px; }
.actw .chips { display: flex; gap: 6px; margin-top: 12px; }
.actw .chips span { font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line); background: #fff; color: var(--muted); }
.actw .chips span.on { background: var(--ink); border-color: var(--ink); color: #fff; }
.tl { position: absolute; left: 20px; top: 214px; width: 400px; }
.tlv { font-size: 12px; font-weight: 800; letter-spacing: .1em; color: var(--muted); margin: 12px 4px 6px; display: flex; gap: 8px; align-items: center; }
.tlv i { font-style: normal; letter-spacing: 0; font-size: 11px; padding: 2px 7px; border-radius: 999px; background: var(--green-soft); color: var(--green); }
.tli { display: flex; gap: 10px; align-items: flex-start; background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 9px 11px; margin-bottom: 6px; }
.tli.ch { margin-left: 18px; }
.tli.on { border-color: var(--red2); box-shadow: 0 0 0 1px var(--red2); }
.tli .ti { width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; flex: none; }
.tli b { font-size: 14px; display: block; } .tli small { font-size: 12.5px; color: var(--ink2); }
.tli em { margin-left: auto; font-style: normal; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 999px; white-space: nowrap; }
.tli em.needs { background: var(--amber-soft); color: var(--amber); } .tli em.done { background: var(--green-soft); color: var(--green); }
.tdet { position: absolute; left: 434px; top: 222px; width: 326px; background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 16px; }
.tdet .ey { font-size: 11px; font-weight: 800; letter-spacing: .1em; color: var(--muted); }
.tdet h3 { font-size: 19px; margin-top: 4px; }
.tdec { margin-top: 12px; background: #FFFAF2; border: 1px solid #E8DCC6; border-radius: 12px; padding: 12px; }
.tdec b { font-size: 14px; } .tdec .seg { display: flex; gap: 2px; padding: 3px; background: #F1EBE0; border-radius: 9px; margin-top: 8px; }
.tdec .seg span { flex: 1; text-align: center; font-size: 12px; font-weight: 700; padding: 6px 4px; border-radius: 7px; color: var(--muted); }
.tdec .seg span.on { background: #fff; color: var(--ink); box-shadow: 0 1px 3px rgba(0,0,0,.1); }
.tdec .nt { font-size: 13px; background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 8px; margin-top: 8px; min-height: 52px; color: var(--ink2); }
.thist { margin-top: 10px; display: grid; gap: 6px; }
.thist div { font-size: 12px; color: var(--muted); background: #fff; border: 1px solid #EFE4D0; border-radius: 8px; padding: 7px 9px; }
.thist div b { color: var(--ink); font-size: 12.5px; display: block; }
/* platform: Legal library + Data dashboard */
.libw { left: 70px; top: 120px; width: 900px; height: 760px; }
.lsearch { display: flex; align-items: center; gap: 8px; margin-top: 12px; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 5px; }
.lsearch .seg { display: flex; gap: 2px; background: #F3F4F6; border-radius: 10px; padding: 3px; }
.lsearch .seg span { font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 8px; color: var(--muted); }
.lsearch .seg span.on { background: #fff; color: var(--red2); box-shadow: 0 1px 3px rgba(0,0,0,.1); }
.lsearch .q { flex: 1; font-size: 15px; color: var(--ink); }
.lsearch .btn { padding: 8px 16px; font-size: 14px; }
.lcols { display: grid; grid-template-columns: 210px 1fr 280px; gap: 12px; margin-top: 12px; height: 560px; }
.lres { display: grid; gap: 6px; align-content: start; }
.ldoc { background: #fff; border: 1px solid transparent; box-shadow: 0 1px 0 var(--line); border-radius: 12px; padding: 9px 11px; }
.ldoc.on { border-color: #F2B6C0; background: #FFF7F8; }
.ldoc small { font-size: 11.5px; font-weight: 800; color: var(--red2); display: block; }
.ldoc b { font-size: 13.5px; display: block; margin-top: 2px; line-height: 1.3; }
.ldoc em { font-style: normal; font-size: 11.5px; color: var(--muted); }
.lread { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 16px 18px; }
.lread .ey { font-size: 11.5px; font-weight: 700; color: var(--muted); letter-spacing: .04em; }
.lread h3 { font-family: 'Cormorant', serif; font-size: 25px; line-height: 1.15; margin-top: 4px; }
.lread .nav { display: flex; gap: 6px; align-items: center; margin-top: 10px; font-size: 12.5px; color: var(--muted); }
.lread .nav span { border: 1px solid var(--line); border-radius: 8px; padding: 4px 9px; color: var(--ink); font-weight: 700; }
.lread .art { margin-top: 12px; background: #FAFAFB; border-radius: 12px; padding: 14px; font-size: 14.5px; line-height: 1.65; color: var(--ink2); }
.lread .art mark { background: #FFF1C7; color: inherit; border-radius: 3px; }
.lchat { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.lchat h4 { font-size: 15px; display: flex; gap: 8px; align-items: center; }
.lchat .ctx { font-size: 12px; font-weight: 700; color: var(--red2); background: var(--red-soft); border: 1px solid #F4CCD3; border-radius: 999px; padding: 4px 10px; width: fit-content; }
.cq { margin-left: auto; width: fit-content; max-width: 230px; background: var(--ink); color: #fff; padding: 10px 13px; border-radius: 14px 14px 4px 14px; font-size: 13.5px; line-height: 1.4; }
.ca { background: #F5F6F8; border-radius: 14px 14px 14px 4px; padding: 11px 13px; font-size: 13.5px; line-height: 1.5; min-height: 120px; }
.ca .cite { display: inline-flex; gap: 6px; align-items: center; margin-top: 10px; background: #fff; border: 1px solid var(--line); border-radius: 9px; padding: 6px 9px; font-size: 12px; font-weight: 800; }
.dashw { left: 1010px; top: 120px; width: 840px; height: 760px; }
.dashw .tabs { display: flex; gap: 4px; margin-top: 12px; background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 4px; width: fit-content; }
.dashw .tabs span { font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 8px; color: var(--ink2); }
.dashw .tabs span.on { background: var(--red-soft); color: var(--red2); }
.kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 12px; }
.kpis div { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; }
.kpis small { font-size: 12px; color: var(--muted); font-weight: 600; }
.kpis b { display: block; font-size: 30px; letter-spacing: -0.03em; margin-top: 4px; }
.kpis em { font-style: normal; font-size: 11.5px; color: var(--muted); }
.mapbox { margin-top: 12px; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; }
.mapbox h4 { font-size: 15px; display: flex; justify-content: space-between; }
.mapbox h4 span { font-size: 12.5px; color: var(--muted); font-weight: 600; }

.cl-people { top: 120px; }
.cl-head { left: 0; right: 0; top: 650px; text-align: center; font-size: 150px; }
.cl-lock { left: 0; right: 0; top: 330px; display: flex; justify-content: center; align-items: center; gap: 30px; }
.cl-lock .logo-ic { width: 140px; height: 140px; }
.cl-word { font-size: 140px; font-weight: 800; letter-spacing: -0.05em; }
.cl-team { left: 0; right: 0; top: 540px; text-align: center; font-size: 34px; font-weight: 700; color: var(--ink2); }
.cl-git { left: 0; right: 0; top: 600px; text-align: center; font-size: 26px; color: var(--muted); font-family: ui-monospace, Consolas, monospace; }
.cl-built { left: 0; right: 0; top: 680px; display: flex; justify-content: center; gap: 14px; }
.cl-dot { left: 949px; top: 529px; width: 22px; height: 22px; border-radius: 50%; background: var(--red); }
`);

/* =============================== 1 · HOOK =============================== */
scene('hook', `<div class="whip"><div class="cam">
  <div class="hk-page abs"><div class="bgp"></div>
    <div class="ghost gt" style="top:60px">${bars(5)}</div>
    <div class="kicker hk-label">Draft Government Regulation · Article 2</div>
    <div class="hk-line serif"><span class="hk-typed"></span><span class="hk-caret"></span></div>
    <div class="hk-orig">Original: “Permohonan hanya dapat diajukan melalui aplikasi digital.”</div>
    <div class="ghost gb" style="top:500px">${bars(7)}</div>
  </div>
  <div class="hk-dot abs"></div>
</div>
  <div class="hk-people abs">${peopleHTML()}</div>
  <div class="hk-head mega abs">Locked out<span class="red">.</span></div>
</div>`, ({ q, qa, sc }) => {
  const L0 = LN('hook', 0), L1 = LN('hook', 1), L2 = LN('hook', 2), L3 = LN('hook', 3);
  const words = ['elderly', 'disabilities', 'villages'].map(w => W('hook', w));
  const tLock = W('hook', 'locked');
  const line = '“Applications may only be submitted through a digital app.”';
  cue(0.15, 'pop'); cue(L1.t, 'type', { d: L1.d * 0.92 }); cue(L2.t - 0.1, 'whoosh');
  words.forEach(t => cue(t, 'pop')); cue(tLock, 'stamp'); cue(tLock + 0.3, 'impact');
  const page = q('.hk-page'), cam = q('.cam'), dot = q('.hk-dot');
  const cards = qa('.pp'), locks = qa('.pp-lock.lk'), unl = qa('.pp-lock.un');
  unl.forEach(u => st(u, { o: 0 }));
  return t => {
    whip(q('.whip'), t, sc, { enter: false });
    // red dot: pops in, pulses, then travels to the caret
    const pop = P(t, 0.15, 0.6, Ez.back), move = P(t, L1.t - 0.6, 0.55, Ez.io);
    const pulse = 1 + 0.08 * Math.sin(t * 6) * (1 - move);
    st(dot, { x: lerp(0, 80 + 140 - 949 + 2, move), y: lerp(0, 326 + 150 + 30 - 540, move), s: pop * pulse * lerp(1, 0.4, move), o: t < L1.t ? 1 : 0 });
    q('.hk-label').style.opacity = P(t, L0.t + 0.2, 0.6);
    q('.hk-typed').textContent = typed(line, P(t, L1.t, L1.d * 0.92, Ez.lin));
    q('.hk-caret').style.opacity = t >= L1.t - 0.05 && (Math.floor(t * 2.4) % 2 === 0 || t < LE('hook', 1) + 0.2) ? 1 : 0;
    q('.hk-orig').style.opacity = P(t, LE('hook', 1), 0.6);
    // pull back to reveal a full regulation page
    const pb = P(t, L2.t - 0.1, 1.5, Ez.io);
    q('.bgp').style.opacity = pb;
    qa('.ghost').forEach(g => (g.style.opacity = pb));
    const k3 = P(t, L3.t - 0.45, 0.7, Ez.io);
    st(cam, { s: lerp(1, 0.72, pb) * lerp(1, 0.94, k3), rx: lerp(0, 14, pb), rz: lerp(0, -4, pb), y: lerp(0, -10, pb), persp: 2400 });
    st(page, { o: lerp(1, 0.22, k3), blur: k3 * 6 });
    // the people this one sentence locks out
    cards.forEach((c, i) => {
      const a = P(t, words[i] - 0.15, 0.7, Ez.back), lk = P(t, tLock + i * 0.09, 0.45, Ez.back);
      st(c, { y: (1 - a) * 90, o: P(t, words[i] - 0.15, 0.35), gray: lk * 0.9, s: lerp(1, 0.96, lk) });
      st(locks[i], { s: lerp(1.8, 1, lk), o: lk });
    });
    const h = P(t, tLock + 0.25, 0.7, Ez.out5);
    st(q('.hk-head'), { y: (1 - h) * 60, o: h, blur: (1 - h) * 10 });
  };
});

/* =============================== 2 · PROBLEM =============================== */
const REGS = [['UU', 'UU 25/2009', 'Public Services'], ['PP', 'PP 96/2012', 'Public Service Implementation'], ['UU', 'UU 8/2016', 'Persons with Disabilities'], ['UU', 'UU 12/2011', 'Law-making'], ['PERPRES', 'Perpres 95/2018', 'E-Government'], ['PERMEN', 'Permen PANRB 17/2017', 'Service Standards'], ['UU', 'UU 23/2014', 'Regional Government'], ['PERDA', 'Perda 4/2019', 'Population Admin.'], ['UU', 'UU 24/2013', 'Population Admin.'], ['PP', 'PP 71/2019', 'Electronic Systems'], ['UU', 'UU 27/2022', 'Personal Data'], ['PERMEN', 'Permendagri 7/2019', 'Online Services']];
const GRIDN = 63;
scene('problem', `<div class="whip"><div class="cam">
  <div class="pb-plane abs"><div class="pb-grid">${Array.from({ length: GRIDN }, (_, i) => { const r = REGS[(i * 7) % REGS.length]; return `<div class="rg"><span class="tg">${r[0]}</span><b>${r[1]}</b><i style="width:90%"></i><i style="width:66%"></i></div>`; }).join('')}</div>
    <svg class="pb-svg" viewBox="0 0 2600 1900"></svg></div>
  <div class="pb-fade abs"></div>
  <div class="pb-head mega abs"><div class="l1">Thousands of rules.</div><div class="l2">They don’t fit<span class="red">.</span></div></div>
  <div class="pnl p1"><div class="pb-txt mega abs">By hand.<br>Under deadline<span class="red">.</span></div>
    <div class="pb-vis card" style="overflow:hidden;height:645px"><img class="drimg" src="assets/drafter.png" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
      <span class="chip amber" style="position:absolute;right:24px;top:24px;font-size:20px;padding:10px 16px">${ic('timer', 20)}<span class="dayc">Deadline in 6 days</span></span>
      <span class="chip" style="position:absolute;left:24px;top:24px;font-size:17px;padding:9px 14px">${ic('scale', 17)}Manual harmonization</span></div></div>
  <div class="pnl p2"><div class="pb-txt mega abs">AI that makes things up<span class="red">.</span></div>
    <div class="pb-vis card"><div style="padding:30px 40px;border-bottom:1px solid var(--line);display:flex;gap:12px;align-items:center;font-weight:800;font-size:20px;color:var(--muted)">${ic('bot', 24)} Generic AI chatbot</div>
      <div class="bub u" style="top:120px">Which law requires an offline channel for public services?</div>
      <div class="bub b" style="top:280px"><span class="bt"></span></div>
      <div class="stamp" style="left:300px;top:450px;font-size:34px;transform:rotate(-7deg)">NOT IN THE LAW<small>UU 25/2009 has only 62 articles</small></div></div></div>
  <div class="pnl p3"><div class="pb-txt mega abs">Impact shows up after signing<span class="red">.</span></div>
    <div class="pb-vis card"><div style="padding:30px 40px;font-weight:800;font-size:20px;color:var(--muted)" class="kicker">Public complaints after enactment</div>
      <svg width="860" height="520" style="position:absolute;left:0;top:90px"><line x1="60" y1="440" x2="820" y2="440" stroke="#E4E6EA" stroke-width="2"/><line x1="330" y1="60" x2="330" y2="440" stroke="#111" stroke-width="2" stroke-dasharray="6 6"/>
        <text x="342" y="80" font-size="20" font-weight="800" fill="#111">Law signed</text><text x="60" y="476" font-size="17" fill="#6E7279">Draft</text><text x="720" y="476" font-size="17" fill="#6E7279">+6 months</text>
        <path class="cplot" d="M60 420 L200 418 L330 414 L420 360 L500 290 L590 200 L680 140 L800 90" fill="none" stroke="#C8102E" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div class="cpl c0" style="left:420px;top:330px">${ic('wifi-off', 20)}No signal to apply.</div>
      <div class="cpl c1" style="left:470px;top:230px">${ic('accessibility', 20)}App fails my screen reader.</div>
      <div class="cpl c2" style="left:380px;top:130px">${ic('smartphone', 20)}My mother has no smartphone.</div></div></div>
</div></div>`, ({ q, qa, sc }) => {
  const L = [0, 1, 2, 3].map(i => LN('problem', i));
  const tFit = W('problem', 'fit'), tExist = W('problem', 'exist'), tSigned = W('problem', 'signed');
  cue(sc.start, 'whoosh'); cue(tFit, 'stamp'); L.slice(1).forEach(l => cue(l.t - 0.35, 'whoosh')); cue(tExist + 0.1, 'stamp'); cue(tSigned, 'impact');
  // conflict links between highlighted cards
  const svg = q('.pb-svg'), plane = q('.pb-plane');
  const cw = (2600 - 8 * 34) / 9, ch = 160, rows = Math.ceil(GRIDN / 9), rh = (1900 - (rows - 1) * 34) / rows;
  const center = i => [(i % 9) * (cw + 34) + cw / 2, Math.floor(i / 9) * (rh + 34) + ch / 2];
  const PAIRS = [[21, 31], [31, 41], [22, 40], [30, 32], [12, 31], [40, 50], [23, 33]];
  const hot = new Set(PAIRS.flat());
  qa('.rg').forEach((r, i) => hot.has(i) && r.classList.add('hotc'));
  svg.innerHTML = PAIRS.map(([a, b]) => { const [x1, y1] = center(a), [x2, y2] = center(b); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#C8102E" stroke-width="6" stroke-linecap="round" stroke-dasharray="1400" stroke-dashoffset="1400"/>`; }).join('');
  const lines = qa('.pb-svg line'), hots = qa('.rg.hotc');
  const panels = [q('.p1'), q('.p2'), q('.p3')];
  const bt = 'Article 87(4) of Law 25/2009 requires every agency to provide an offline channel.';
  return t => {
    whip(q('.whip'), t, sc);
    const p1start = L[1].t - 0.35;
    const g = P(t, p1start, 0.7, Ez.io);
    st(plane, { rx: 52, rz: -24, x: -t * 9 + 120, y: -40, s: 1.05, persp: 2200, blur: g * 9, o: 1 - g * 0.55 });
    const fit = P(t, tFit - 0.1, 0.9, Ez.out);
    lines.forEach((l, i) => l.setAttribute('stroke-dashoffset', 1400 * (1 - P(t, tFit - 0.1 + i * 0.07, 0.8))));
    hots.forEach(h => (h.style.boxShadow = fit > 0 ? `0 0 0 ${3 * fit}px #C8102E` : ''));
    const head = q('.pb-head');
    st(head, { o: Math.min(P(t, L[0].t - 0.1, 0.5), 1 - g), x: -g * 80, blur: g * 12 });
    st(q('.pb-head .l1'), { y: (1 - P(t, L[0].t - 0.1, 0.7, Ez.out5)) * 50 });
    const l2 = P(t, W('problem', 'dont') - 0.15, 0.6, Ez.out5);
    st(q('.pb-head .l2'), { y: (1 - l2) * 50, o: l2 });
    q('.pb-fade').style.opacity = 1;
    panels.forEach((p, k) => {
      const a = L[k + 1].t - 0.35, b = k < 2 ? L[k + 2].t - 0.35 : sc.end + 1;
      const inn = P(t, a + 0.25, 0.6, Ez.out5), out = P(t, b - 0.05, 0.3, Ez.in);
      st(p.querySelector('.pb-txt'), { x: (1 - inn) * 70 - out * 70, o: Math.min(inn, 1 - out), blur: (1 - inn) * 10 + out * 10 });
      st(p.querySelector('.pb-vis'), { x: (1 - inn) * 140 - out * 70, o: Math.min(inn, 1 - out), blur: (1 - inn) * 10 + out * 10, ry: (1 - inn) * -12, persp: 2000 });
    });
    // panel 1: days crawl by
    const d = P(t, L[1].t, L[2].t - L[1].t, Ez.lin);
    q('.dayc').textContent = 'Deadline in ' + Math.max(1, 6 - Math.round(d * 5)) + ' days';
    st(q('.drimg'), { s: 1.04 + 0.05 * P(t, L[1].t - 0.4, L[2].t - L[1].t + 0.5, Ez.lin), x: -14 * d });
    // panel 2: confident hallucination
    q('.p2 .bt').textContent = typed(bt, P(t, L[2].t + 0.3, 1.4, Ez.lin));
    const s = P(t, tExist + 0.1, 0.35, Ez.back);
    st(q('.p2 .stamp'), { s: lerp(1.8, 1, s), o: s, rz: -7 });
    // panel 3: complaints after signing
    const cp = q('.cplot'); const len = 920; cp.setAttribute('stroke-dasharray', len); cp.setAttribute('stroke-dashoffset', len * (1 - P(t, L[3].t, L[3].d + 0.6, Ez.io)));
    [0, 1, 2].forEach(i => { const a = P(t, tSigned + 0.15 + i * 0.3, 0.5, Ez.back); st(q('.p3 .c' + i), { s: a, o: a }); });
  };
});

/* =============================== 3 · REVEAL =============================== */
scene('reveal', `<div class="whip"><div class="cam">
  <div class="rv-dot abs"></div>
  <div class="rv-lock abs"><div class="logo-ic">${'<img src="assets/icon.png" alt="">'}</div><div class="rv-word">RuleLab</div></div>
  <div class="rv-tag abs">An AI workspace for Indonesian lawmaking</div>
  <div class="rv-gem abs"><span>${ic('sparkles', 22)} Built on Gemini</span></div>
  <div class="rv-pills abs"><span><b>01</b>Draft</span><span><b>02</b>Verify</span><span><b>03</b>Test impact</span></div>
  <div class="rv-comp abs"><em>Complements</em><span>e-Harmonisasi</span><span>Allex</span><span>Partisipasiku</span></div>
  <div class="wipe abs"></div>
</div></div>`, ({ q, qa, sc, el }) => {
  el.dataset.bg = '#0B0B0C';
  const R0 = LN('reveal', 0), R1 = LN('reveal', 1);
  const pw = ['draft', 'verify', 'test'].map(w => W('reveal', w));
  cue(sc.start, 'whoosh'); cue(R0.t - 0.3, 'swell'); cue(R0.t - 0.05, 'impact'); pw.forEach(t => cue(t, 'tick')); cue(sc.end - 0.75, 'whoosh');
  const icon = q('.rv-lock .logo-ic'), word = q('.rv-word'), lock = q('.rv-lock'), pills = qa('.rv-pills span');
  return t => {
    st(q('.whip'), { o: 1 });
    const d = P(t, sc.start + 0.2, 0.5, Ez.back);
    const m = P(t, R0.t - 0.35, 0.55, Ez.out5);
    st(q('.rv-dot'), { s: d * (1 + 0.1 * Math.sin(t * 7)) * (1 + m * 3), o: 1 - m });
    st(icon, { s: lerp(0.15, 1, P(t, R0.t - 0.3, 0.7, Ez.back)), o: m });
    const wr = P(t, R0.t + 0.45, 0.8, Ez.out5);
    word.style.clipPath = `inset(0 ${100 - wr * 100}% 0 0)`;
    st(lock, { x: (1 - wr) * ((word.offsetWidth + 34) / 2) });
    const tg = P(t, R1.t - 0.1, 0.7, Ez.out5);
    const cp = P(t, W('reveal', 'complement') - 0.1, 0.6, Ez.out5);
    st(q('.rv-comp'), { y: (1 - cp) * 24, o: cp });
    st(q('.rv-tag'), { y: (1 - tg) * 30, o: tg });
    const gm = P(t, W('reveal', 'gemini') - 0.1, 0.6, Ez.back);
    st(q('.rv-gem'), { s: lerp(0.8, 1, gm), o: gm });
    pills.forEach((p, i) => { const a = P(t, pw[i] - 0.1, 0.5, Ez.back); st(p, { y: (1 - a) * 30, o: a }); });
    const wp = P(t, sc.end - 0.75, 0.75, Ez.io);
    const wipe = q('.wipe');
    wipe.style.clipPath = `circle(${wp * 1150}px at 50% 50%)`;
    wipe.style.opacity = wp > 0 ? 1 : 0;
  };
});

/* =============================== 4 · DRAFT =============================== */
const TYPES = ['Undang-Undang', 'Perppu', 'Peraturan Pemerintah', 'Peraturan Presiden', 'Peraturan Menteri', 'Peraturan Lembaga', 'Perda Provinsi', 'Perda Kab/Kota', 'Peraturan Gubernur', 'Peraturan Bupati', 'Peraturan Wali Kota', 'Peraturan DPRD Prov.', 'Peraturan DPRD Kab.', 'Peraturan Desa', 'Peraturan Kepala Desa'];
const PASAL = [
  'Dalam Peraturan Pemerintah ini yang dimaksud dengan layanan digital adalah layanan administrasi kependudukan melalui aplikasi elektronik.',
  '(1) Permohonan dapat diajukan melalui aplikasi digital atau kanal pendampingan.\n(2) Penyelenggara menyediakan bantuan bagi pemohon yang mengalami hambatan akses.',
  'Penyelenggara wajib memenuhi standar aksesibilitas bagi kelompok rentan.',
  'Penyelenggara menerapkan prinsip efisiensi anggaran dalam pengembangan dan pemeliharaan aplikasi.',
  'Penyelenggara menyediakan sarana pengaduan atas layanan digital.',
  'Peraturan Pemerintah ini mulai berlaku pada tanggal diundangkan.'];
const PASAL2_NEW = '(1) Permohonan hanya dapat diajukan melalui aplikasi digital.\n(2) Pemohon tanpa akses internet tidak dapat mengajukan permohonan.';
const BRIEF = [['Draft a '], ['Government Regulation', 1], [' on inclusive digital services for '], ['population administration', 1], ['. Users include '], ['elderly citizens', 1], [', '], ['people with disabilities', 1], [' and '], ['remote villages', 1], ['. Keep costs low.']];
const BRIEF_LEN = BRIEF.reduce((n, [s]) => n + s.length, 0);
scene('draft', `<div class="whip"><div class="cam">
  <div class="dw abs">${appWindow({ crumb: 'Policy Studio · Draft', body: `<div class="ed-body">${stages(0, ['Drafting with Gemini…', 'Not checked yet', 'No A/B projection'], { primary: 'Save version', icon: 'save', ver: 'v1' })}
    <div class="outline"><div class="olh">OUTLINE</div><div class="ol ol-o">Opening</div>${PASAL.map((_, i) => `<div class="ol ol${i}">Pasal ${i + 1}<span class="od">1</span></div>`).join('')}<div class="ol-add">+ Add article</div></div>
    <div class="paper"><div class="paper-in">
      <div class="p-top"><span class="chip red">DRAFT FOR REVIEW</span><span class="chip ptype">${ic('landmark', 15)}<span class="ptn">Peraturan Pemerintah</span></span><span class="chip pver">v1</span></div>
      <div class="p-h p-h1 ph1">RANCANGAN<br>PERATURAN PEMERINTAH REPUBLIK INDONESIA<br>NOMOR … TAHUN 2026</div>
      <div class="p-h p-h2 ph2">TENTANG<br>LAYANAN PUBLIK DIGITAL ADMINISTRASI KEPENDUDUKAN YANG INKLUSIF</div>
      <div class="p-sec ps1"><b>Menimbang:</b> a. bahwa negara berkewajiban melayani setiap warga negara dalam memenuhi hak administrasi kependudukan; b. bahwa pemanfaatan aplikasi digital harus menjamin aksesibilitas bagi seluruh warga;</div>
      <div class="p-sec ps2"><b>Mengingat:</b> 1. Pasal 5 ayat (2) UUD 1945; 2. Undang-Undang Nomor 25 Tahun 2009 tentang Pelayanan Publik; 3. Undang-Undang Nomor 8 Tahun 2016 tentang Penyandang Disabilitas;</div>
      ${PASAL.map((p, i) => `<div class="pas pas${i}"><h4><span>Pasal ${i + 1}</span><span class="pst"></span></h4><p>${p}</p></div>`).join('')}
    </div></div>
    <div class="gem panel"><div class="eyb">INSIGHTS</div><h3>${ic('sparkles', 20)} Drafting with Gemini</h3>
      <div style="margin-top:10px">
        <div class="gstep g0"><span class="gs"></span>Retrieved 24 related clauses</div>
        <div class="gstep g1"><span class="gs"></span>Applied UU 12/2011 drafting structure</div>
        <div class="gstep g2"><span class="gs"></span>Wrote 6 articles + legal basis</div></div>
      <div class="kicker gk" style="font-size:12px;margin-top:22px;color:var(--muted)">Grounded in</div>
      <div class="gchips">${['UU 25/2009 · Pasal 29', 'UU 8/2016 · Pasal 19', 'UU 12/2011 · Lampiran II', 'PP 96/2012 · Pasal 6'].map(c => `<span class="chip blue gc">${ic('book-open', 14)}${c}</span>`).join('')}</div>
      <div class="gfoot" style="position:absolute;left:22px;right:22px;bottom:22px"><span class="chip green">${ic('shield-check', 15)}Schema-valid JSON output</span></div>
    </div>
    <div class="toast">${ic('check', 16, 3)} Draft saved · version 2</div>
  </div>` })}</div>
  <div class="prompt abs">${logo(46)}<div class="ptx"></div><div class="send">${ic('arrow-up', 30, 2.6)}</div></div>
  ${cursorEl()}
</div>
  <div class="abs gl2w" style="left:0;right:0;top:0;display:flex;justify-content:center"><div class="gloss" style="position:static;font-size:24px;padding:12px 22px">“Applications may only be submitted through a digital app.”</div></div>
  <div class="keys abs"><span>Ctrl</span><span>S</span></div>
</div>`, ({ q, qa, sc }) => {
  const D = [0, 1, 2, 3, 4].map(i => LN('draft', i));
  const tOff = W('draft', 'official'), tFif = W('draft', 'fifteen'), tCon = W('draft', 'considerations'), tLeg = W('draft', 'legal', tCon), tNum = W('draft', 'numbered'), tGr = W('draft', 'grounded');
  const tSend = D[1].t - 0.35, tType0 = D[0].t + 0.2, tType1 = D[1].t - 0.9;
  const tSel = D[2].t + 1.0, tRe = D[3].t - 0.05, tSave = D[4].t - 0.1;
  cue(sc.start, 'whoosh'); cue(tType0, 'type', { d: tType1 - tType0 }); cue(tSend, 'click'); cue(tSend + 0.15, 'whoosh');
  [tOff, tCon, tGr].forEach(t => cue(t, 'tick')); for (let i = 0; i < 6; i++) cue(tNum + i * 0.12, 'tick');
  cue(tSel, 'click'); cue(tRe, 'type', { d: 1.3 }); cue(tSave, 'click'); cue(tSave + 0.35, 'pop');
  const win = q('.dw'), cam = q('.cam'), paperIn = q('.paper-in'), cur = q('.cursor');
  const pas = qa('.pas'), gsteps = qa('.gs'), gchips = qa('.gc');
  const p2 = q('.pas1'), p2t = q('.pas1 p'), ols = qa('.ol');
  return t => {
    whip(q('.whip'), t, sc, { enter: false });
    // brief typed into the prompt bar
    const n = Math.round(BRIEF_LEN * P(t, tType0, tType1 - tType0, Ez.lin));
    let left = n, html = '';
    for (const [s, chip] of BRIEF) { if (left <= 0) break; const part = s.slice(0, left); left -= s.length; html += chip ? `<em>${part}</em>` : part; }
    q('.ptx').innerHTML = html + (t < tSend ? '<span class="car"></span>' : '');
    const sent = P(t, tSend + 0.05, 0.6, Ez.in);
    st(q('.prompt'), { y: (1 - P(t, sc.start + 0.1, 0.6, Ez.out5)) * 60 - sent * 260, s: 1 - sent * 0.25, o: Math.min(P(t, sc.start + 0.1, 0.4), 1 - sent), blur: sent * 12 });
    st(q('.send'), { s: Math.abs(t - tSend) < 0.12 ? 0.86 : 1 });
    cursorAt(cur, t, [{ t: tType1 - 0.3, x: 1200, y: 760 }, { t: tSend, x: 1530, y: 482, click: true }]);
    // window: blurred backdrop → straightens into focus as Gemini drafts
    const f = P(t, tSend + 0.1, 1.1, Ez.out5);
    // zoom into Article 2 for the edit, then back out
    const scroll = lerp(0, 520, P(t, tNum - 0.5, 1.2, Ez.io));
    paperIn.style.transform = `translateY(${-scroll}px)`;
    const cx = 160 + 250 + 238 + 1 + p2.offsetLeft + p2.offsetWidth / 2;
    const cy = 56 + 64 + 196 + 1 + p2.offsetTop - scroll + p2.offsetHeight / 2;
    camFrame(cam, t, [{ t: 0, x: 960, y: 540, z: 1 }, { t: tOff - 0.4, x: 1150, y: 500, z: 1.3, d: 1.1 }, { t: D[2].t - 0.2, x: cx, y: cy, z: 1.85, d: 1.0 }, { t: tSave + 0.9, x: 1150, y: 520, z: 1.25, d: 0.9 }]);
    st(win, { rx: lerp(16, 0, f), y: lerp(40, 0, f), s: lerp(0.92, 1, f), blur: lerp(9, 0, f), o: lerp(0.75, 1, f), persp: 2600 });
    // document builds in sync with narration
    st(q('.ph1'), { o: P(t, tOff - 0.1, 0.5), y: (1 - P(t, tOff - 0.1, 0.6)) * 14 });
    st(q('.ph2'), { o: P(t, tOff + 0.2, 0.5) });
    const cyc = P(t, tFif - 0.1, 1.3, Ez.out);
    q('.ptn').textContent = t < tFif - 0.1 ? 'Jenis peraturan' : TYPES[Math.min(14, Math.floor(cyc * 17)) % 15 === 14 && cyc >= 1 ? 2 : (cyc >= 1 ? 2 : Math.floor(cyc * 17) % 15)];
    st(q('.ptype'), { s: cyc > 0 && cyc < 1 ? 1.06 : 1 });
    st(q('.ps1'), { o: P(t, tCon - 0.1, 0.5) });
    st(q('.ps2'), { o: P(t, tLeg - 0.1, 0.5) });
    pas.forEach((p, i) => { const a = P(t, tNum + i * 0.12, 0.5, Ez.out5); st(p, { o: a, y: (1 - a) * 20 }); });
    ols.forEach((o, i) => { const a = i ? P(t, tNum + (i - 1) * 0.12, 0.5, Ez.out5) : P(t, tCon - 0.1, 0.5); st(o, { o: a, x: (1 - a) * -16 }); });
    q('.ol1').classList.toggle('on', t >= tSel); qa('.od').forEach(d => (d.style.display = 'none'));
    [[tSend + 0.4, tOff], [tOff, tCon], [tCon, tGr]].forEach(([a, b], i) => {
      gsteps[i].innerHTML = t < a ? '<span style="width:20px;height:20px;border-radius:50%;border:2px solid #e5e7eb;display:inline-block"></span>' : t < b ? '<span class="spin"></span>' : `<span class="ok-ic">${ic('check', 13, 3)}</span>`;
    });
    st(q('.gk'), { o: P(t, tGr - 0.1, 0.4) });
    gchips.forEach((c, i) => { const a = P(t, tGr + i * 0.12, 0.45, Ez.back); st(c, { s: a, o: a }); });
    q('.stg-sub-0').textContent = t < tGr + 0.4 ? 'Drafting with Gemini…' : t < tSel ? 'Saved · v1' : t < tSave + 0.3 ? 'Not saved' : 'Saved · v2';
    st(q('.psp'), { s: Math.abs(t - tSave) < 0.12 ? 0.92 : 1 });
    // the edit: select, retype as "digital only"
    if (t < tSel) { p2t.textContent = PASAL[1]; p2.classList.remove('warn'); }
    else if (t < tRe) p2t.innerHTML = `<mark>${PASAL[1]}</mark>`;
    else { p2t.textContent = typed(PASAL2_NEW, P(t, tRe, 1.3, Ez.lin)) || ' '; p2.classList.add('warn'); }
    const gl = Math.min(P(t, tRe + 0.4, 0.5, Ez.back), 1 - P(t, tSave + 0.8, 0.3));
    st(q('.gl2w'), { y: 368, s: lerp(0.9, 1, gl), o: gl });
    const kk = Math.min(P(t, tSave, 0.35, Ez.back), 1 - P(t, tSave + 0.8, 0.3));
    st(q('.keys'), { x: 1580, y: 190, s: kk, o: kk });
    q('.pver').textContent = q('.bar-ver').textContent = t < tSave + 0.3 ? 'v1' : 'v2';
    st(q('.pver'), { s: t > tSave + 0.3 && t < tSave + 0.6 ? 1.25 : 1 });
    const ts = Math.min(P(t, tSave + 0.3, 0.4, Ez.out5), 1 - P(t, sc.end - 0.9, 0.3));
    st(q('.toast'), { y: (1 - ts) * 30, o: ts });
  };
});

/* =============================== 5 · REVIEW =============================== */
const FINDINGS = [
  ['high', 'High', '2', 'Digital-only access excludes applicants without internet'],
  ['med', 'Medium', '5', 'Complaint channel lacks a duty to respond'],
  ['med', 'Medium', '6', 'No transition period before enforcement']];
scene('review', `<div class="whip"><div class="cam">
  <div class="ph-a">
    <div class="rvw-txt mega abs">Check every<br>clause<span class="red">.</span></div>
    <div class="doc-mini card"><div class="kicker" style="color:var(--muted);font-size:15px;margin-bottom:6px">Draft v2 · 6 articles</div>
      ${[1, 2, 3, 4, 5, 6].map(i => `<div class="dm-row"><b>Pasal ${i}</b><div class="bb"><i style="width:${[92, 80, 86, 70, 88, 60][i - 1]}%"></i><i style="width:${[60, 74, 40, 66, 52, 30][i - 1]}%"></i></div><span class="dm-st"></span></div>`).join('')}
      <div class="beam"></div></div></div>
  <div class="ph-b">
    <div class="pipe-k abs"><span class="kicker">Agent pipeline</span><span class="chip">${ic('timer', 15)}<span class="tmr">00:00</span></span><span class="chip green">${ic('sparkles', 15)}Gemini</span></div>
    <div class="pipe abs">
      <div class="pn n0" style="left:0"><div class="pi">${ic('file-text', 26)}</div><b>Draft v2</b><small>6 articles · PP</small><div class="big">6</div></div>
      <div class="pn n1" style="left:350px"><div class="pi">${ic('search', 26)}</div><b>Hybrid retrieval</b><small>BM25 + vector search</small><div class="big"><span class="c27">0</span> <small style="display:inline">clauses</small></div></div>
      <div class="pn n2" style="left:700px"><div class="pi">${ic('landmark', 26)}</div><b>Legal corpus</b><small>JDIH · 838 official regulations</small><div class="big c12k">0</div><small>articles indexed</small></div>
      <div class="pn n3" style="left:1050px"><div class="pi">${ic('users', 26)}</div><b>Specialist agents</b>${['Hierarchy', 'Rights & access', 'Procedure', 'Drafting technique'].map(a => `<div class="ag"><span class="ags"></span>${a}</div>`).join('')}</div>
      <div class="pn n4" style="left:1400px"><div class="pi">${ic('shield-check', 26)}</div><b>Citation guard</b><small>Every quote matched to source text</small><div class="big"><span class="cg">0</span><small style="display:inline"> / 12 checked</small></div></div>
      ${[0, 1, 2, 3].map(i => `<div class="conn" style="left:${300 + i * 350}px"></div><div class="pkt pk${i}" style="left:${300 + i * 350}px"></div>`).join('')}
    </div></div>
  <div class="ph-c"><div class="dw abs">${appWindow({ crumb: 'Policy Studio · Verify sources', body: `<div class="ed-body">${stages(1, ['Saved · v2', 'Checking…', 'No A/B projection'], { primary: 'Re-check', icon: 'scan-search' })}
    <div class="vsum">Checked <b class="m2">v2</b><span class="asof">${ic('clock', 14)}As of 17/10/2026</span><span><b class="m1">0</b> sources</span><span><b class="m0">0</b> findings (1 high, 2 medium)</span><span class="sp"></span><span class="chip amber">Needs review</span><span class="chip">${ic('user', 14)}Review in Activity</span></div>
    <div class="vlist"><div class="vchips"><span class="on">All <i>3</i></span><span>High <i>1</i></span><span>Medium <i>2</i></span><span>Low <i>0</i></span></div>
      ${FINDINGS.map(([c, l, a, h], i) => `<div class="fd f${i} ${c === 'high' ? 'high' : ''} ${i === 0 ? 'on' : ''}"><small>${l} · Pasal ${a}</small><h3>${h}</h3></div>`).join('')}</div>
    <div class="vdet"><div class="vdet-in">
      <div class="vtags"><span class="tag high">High</span><span class="chip">Pasal 2</span><em>1 of 3</em></div>
      <h2>${FINDINGS[0][3]}</h2>
      <p class="rs">A single digital channel denies service to applicants without connectivity or digital skills. UU 25/2009 requires special treatment for certain groups; UU 8/2016 guarantees reasonable accommodation.</p>
      <div class="vleg"><span><i style="background:#FDE8EB;border:1px solid #f6cfd5"></i>Draft v2</span><span><i style="background:#E1F3E8;border:1px solid #c9ebd7"></i>Proposed for review</span></div>
      <div class="vdiff">(1) Permohonan <del>hanya </del>dapat diajukan melalui aplikasi digital<ins> atau kanal pendampingan</ins>.
(2) <del>Pemohon tanpa akses internet tidak dapat mengajukan permohonan.</del><ins>Penyelenggara menyediakan bantuan dan akomodasi yang layak bagi pemohon yang mengalami hambatan akses.</ins></div>
      <div class="vsrc-h">${ic('fingerprint', 16)}SOURCES · EVERY QUOTE MATCHED TO ITS TEXT<span class="chip green gchip">${ic('shield-check', 14)}<span class="gtx">Citation guard</span></span></div>
      <div class="vsrcs">
        <div class="sc s0"><div class="sh">${ic('scale', 16)} UU 25/2009 · Pasal 29 (1)</div><div class="qt">“Penyelenggara berkewajiban memberikan pelayanan dengan perlakuan khusus kepada anggota masyarakat tertentu…”</div><div class="gl">Special treatment for certain members of the public.</div><div class="meta"><span>HTML · peraturan.go.id</span><span class="sha">SHA256 244cbe9a…</span></div><div class="vstamp">${ic('check', 13, 3)}Verified</div></div>
        <div class="sc s1"><div class="sh">${ic('scale', 16)} UU 8/2016 · Pasal 19</div><div class="qt">“…memperoleh Akomodasi yang Layak dalam Pelayanan Publik secara optimal, wajar, bermartabat tanpa Diskriminasi…”</div><div class="gl">Reasonable accommodation, without discrimination.</div><div class="meta"><span>PDF · page 14</span><span class="sha">SHA256 cae383fd…</span></div><div class="vstamp">${ic('check', 13, 3)}Verified</div></div>
        <div class="sc s2"><div class="sh">${ic('scale', 16)} UU 25/2009 · Pasal 87 (4)</div><div class="qt">“Setiap penyelenggara wajib menyediakan kanal luring…”</div><div class="meta"><span>cited by model</span></div><div class="xstamp">✕ NOT IN EVIDENCE</div></div>
      </div></div>
      <div class="vact"><span class="btn pri apb">${ic('check', 16, 3)}Apply proposal to draft</span><span class="btn">${ic('user', 15)}Review in Activity</span></div></div>
    <div class="toast vtoast">${ic('check', 16, 3)} Saved as version 3 · re-check suggested</div>
  </div>` })}</div></div>
  ${cursorEl()}
</div></div>`, ({ q, qa, sc }) => {
  const V = [0, 1, 2, 3, 4, 5, 6].map(i => LN('review', i));
  const tHyb = W('review', 'hybrid'), tEF = W('review', 'twentyfive'), tSpec = W('review', 'specialist'), tEach = W('review', 'each');
  const tThree = W('review', 'three'), tFind = W('review', 'findings'), tFp = W('review', 'fingerprint'), tRej = W('review', 'rejected'), tClick = W('review', 'click'), tVer = W('review', 'version', tClick);
  const A0 = sc.start, B0 = V[1].t - 0.3, C0 = V[2].t - 0.45;
  cue(sc.start, 'whoosh'); cue(V[0].t, 'scan', { d: 1.6 }); cue(B0, 'whoosh'); [tHyb, tEF, tSpec, tEach].forEach(t => cue(t, 'tick'));
  cue(C0, 'whoosh'); cue(tThree, 'pop'); [0, 1, 2].forEach(i => cue(tFind + i * 0.15, 'tick')); cue(V[3].t - 0.2, 'whoosh'); cue(V[4].t - 0.2, 'whoosh');
  cue(tFp, 'pop'); cue(V[5].t, 'pop'); cue(tRej, 'stamp'); cue(V[6].t - 0.3, 'whoosh'); cue(tClick, 'click'); cue(tVer, 'pop');
  const pa = q('.ph-a'), pb = q('.ph-b'), pc = q('.ph-c'), win = q('.ph-c .dw');
  const rows = qa('.dm-row'), sts = qa('.dm-st'), beam = q('.beam');
  const nodes = qa('.pn'), conns = qa('.conn'), pkts = qa('.pkt'), ags = qa('.ags');
  const fds = [q('.f0'), q('.f1'), q('.f2')], det = q('.vdet'), detIn = q('.vdet-in');
  const scs = [q('.s0'), q('.s1'), q('.s2')], cur = q('.cursor'), dels = qa('.vdiff del'), inss = qa('.vdiff ins');
  const BAD = new Set([1, 4, 5]);
  return t => {
    whip(q('.whip'), t, sc, { enter: false });
    // A — scan
    const ab = P(t, B0, 0.5, Ez.in);
    st(pa, { o: 1 - ab, y: -ab * 120, blur: ab * 16 });
    const ain = P(t, A0, 0.6, Ez.out5);
    st(q('.rvw-txt'), { y: (1 - ain) * 70, o: ain, blur: (1 - ain) * 10 });
    st(q('.doc-mini'), { x: (1 - ain) * 120, o: ain, ry: (1 - ain) * -14, persp: 2000 });
    const bp = P(t, V[0].t, 1.6, Ez.io);
    beam.style.top = `${70 + bp * 600}px`; beam.style.opacity = bp > 0 && bp < 1 ? 1 : 0;
    sts.forEach((s, i) => { const done = bp > (i + 1) / 6.3; s.style.background = done ? (BAD.has(i) ? 'var(--red-soft)' : 'var(--green-soft)') : 'transparent'; s.style.color = BAD.has(i) ? 'var(--red2)' : 'var(--green)'; s.innerHTML = done ? ic(BAD.has(i) ? 'circle-alert' : 'check', 18, 2.6) : ''; });
    // B — pipeline
    const bin = P(t, B0, 0.6, Ez.out5), bout = P(t, C0, 0.45, Ez.in);
    st(pb, { o: Math.min(bin, 1 - bout), y: (1 - bin) * 120 - bout * 120, blur: (1 - bin) * 16 + bout * 16 });
    const nt = [B0 + 0.1, tHyb - 0.1, tEF - 0.15, tSpec - 0.1, tEach + 0.2];
    nodes.forEach((n, i) => { const a = P(t, nt[i], 0.5, Ez.back); st(n, { y: (1 - a) * 50, o: P(t, nt[i], 0.3) }); });
    conns.forEach((c, i) => { c.style.opacity = P(t, nt[i + 1], 0.3); c.style.backgroundPosition = `${t * 60}px 0`; });
    pkts.forEach((k, i) => { const ph = ((t - nt[i + 1]) * 0.9) % 1; st(k, { x: ph * 36, o: t > nt[i + 1] && t < C0 ? 1 : 0 }); });
    q('.c27').textContent = fmt(27 * P(t, tHyb, 0.9));
    const k12 = P(t, tEF - 0.1, 1.2);
    q('.c12k').textContent = fmt(25310 * k12);
    ags.forEach((a, i) => { const s0 = tSpec + 0.1 + i * 0.12, s1 = tEach + 0.2 + i * 0.25; a.innerHTML = t < s0 ? '<span style="width:16px;height:16px;border-radius:50%;border:2px solid #e5e7eb;display:inline-block"></span>' : t < s1 ? '<span class="spin"></span>' : `<span class="ok-ic">${ic('check', 11, 3)}</span>`; });
    q('.cg').textContent = fmt(12 * P(t, tEach + 0.3, C0 - tEach - 0.3, Ez.lin));
    q('.tmr').textContent = '00:' + String(Math.round(47 * P(t, B0, C0 - B0, Ez.lin))).padStart(2, '0');
    // C — Verify sources: findings on the left, the selected finding with its diff and sources on the right
    const cin = P(t, C0, 0.7, Ez.out5);
    st(pc, { o: cin, y: (1 - cin) * 140, blur: (1 - cin) * 16 });
    q('.stg-sub-1').textContent = t < tThree ? 'Checking…' : '3 findings · v2';
    q('.m0').textContent = fmt(3 * P(t, tThree - 0.1, 0.5));
    q('.m1').textContent = fmt(27 * P(t, tThree - 0.1, 0.8));
    fds.forEach((f, i) => { const a = P(t, tFind - 0.05 + i * 0.15, 0.5, Ez.back); st(f, { y: (1 - a) * 30, o: P(t, tFind - 0.05 + i * 0.15, 0.3) }); });
    const dt = P(t, V[3].t - 0.35, 0.6, Ez.out5);
    st(det, { o: dt, x: (1 - dt) * 50 });
    // sources scroll into view: fingerprints light up, then one model citation is rejected
    const down = P(t, V[4].t - 0.35, 0.7, Ez.io), back = P(t, V[6].t - 0.35, 0.6, Ez.io);
    detIn.style.transform = `translateY(${-down * 190 + back * 110}px)`;
    scs.forEach((s, i) => { const a = P(t, (i < 2 ? V[4].t + i * 0.25 : V[5].t - 0.1), 0.5, Ez.out5); st(s, { y: (1 - a) * 30, o: i < 2 ? a : a * lerp(1, 0.45, P(t, tRej + 0.9, 0.5)) }); });
    const fp = P(t, tFp - 0.05, 0.4, Ez.back);
    qa('.sha').forEach(s => s.classList.toggle('hl', fp > 0));
    qa('.vstamp').forEach(v => st(v, { s: fp, o: fp }));
    const rj = P(t, tRej - 0.1, 0.35, Ez.back);
    scs[2].classList.toggle('bad', rj > 0);
    st(q('.xstamp'), { s: lerp(1.6, 1, rj), o: rj, rz: -6 });
    q('.gtx').textContent = t < V[4].t ? 'Citation guard' : t < tRej ? `${fmt(2 + 9 * P(t, V[4].t, 1.5, Ez.lin))} verified` : '11 verified · 1 rejected';
    // the reviewer applies the proposal: the wording becomes the new text of version 3
    cursorAt(cur, t, [{ t: V[6].t + 0.2, x: 1250, y: 980 }, { t: tClick, x: 1000, y: 898, click: true }]);
    const ap = P(t, tClick + 0.1, 0.4, Ez.out5);
    dels.forEach(d => { d.style.opacity = lerp(1, 0, ap); d.style.display = ap >= 0.98 ? 'none' : ''; });
    inss.forEach(n => { n.style.background = ap > 0.5 ? 'transparent' : ''; n.style.color = ap > 0.5 ? 'var(--ink)' : ''; });
    st(q('.apb'), { s: Math.abs(t - tClick) < 0.12 ? 0.92 : 1 });
    q('.apb').innerHTML = ap > 0 ? `${ic('check', 16, 3)}Applied · v3` : `${ic('check', 16, 3)}Apply proposal to draft`;
    q('.apb').style.background = ap > 0 ? 'var(--green)' : '';
    q('.apb').style.borderColor = ap > 0 ? 'var(--green)' : '';
    fds[0].classList.toggle('done', ap > 0);
    q('.m2').textContent = q('.bar-ver').textContent = t < tVer - 0.1 ? 'v2' : 'v3';
    q('.stg-sub-0').textContent = t < tVer - 0.1 ? 'Saved · v2' : 'Saved · v3';
    st(q('.m2'), { s: t > tVer - 0.1 && t < tVer + 0.25 ? 1.2 : 1 });
    const ts = Math.min(P(t, tVer, 0.4, Ez.out5), 1 - P(t, sc.end - 0.8, 0.3));
    st(q('.vtoast'), { y: (1 - ts) * 30, o: ts });
    camFrame(q('.cam'), t, [{ t: 0, x: 960, y: 540, z: 1 }, { t: tFind - 0.3, x: 820, y: 560, z: 1.2 }, { t: V[3].t - 0.3, x: 1290, y: 600, z: 1.32 }, { t: V[4].t - 0.3, x: 1290, y: 690, z: 1.32 }, { t: V[6].t - 0.3, x: 1120, y: 760, z: 1.28 }, { t: sc.end - 1.2, x: 960, y: 560, z: 1.08 }]);
  };
});

/* =============================== 6 · IMPACT =============================== */
const ASM = [['Applicants', '2,500', 'people'], ['Digital access', '70', '%'], ['Assisted success', '80', '%'], ['Digital cost', '20,000', 'Rp / case'], ['Assisted cost', '50,000', 'Rp / case'], ['Staff capacity', '40', 'cases / day']];
const ISSUES = [['Access', '#C8102E'], ['Accommodation', '#6D4AD6'], ['Cost', '#B7791F'], ['Capacity', '#2F5BD3'], ['Implementation', '#1E8E4F'], ['Accountability', '#0E7490']];
const KG_C = { policy: '#C8102E', article: '#2F5BD3', source: '#6D4AD6', issue: '#D69E2E', persona: '#1E8E4F' };
const ST_C = { support: '#1E8E4F', conditional: '#D69E2E', oppose: '#C8102E' };
const FEAT = { 0: ['Sari', 'Village resident (3T)', 'SA'], 1: ['Nadia', 'Blind citizen', 'NA'], 2: ['Dewi', 'Budget analyst', 'DE'], 3: ['Bima', 'Counter officer', 'BI'] };
const QUOTES = [
  [1, 'Accommodation', '“If the app fails my screen reader, Draft A means I can’t renew my ID. Draft B keeps a door open.”', 'blind'],
  [3, 'Capacity', '“B is workable, if we get about 15 extra staff-days a month at the counter.”', 'counter'],
  [2, 'Cost', '“B costs Rp30M more. Still cheaper than a wave of appeals and complaints.”', 'budget'],
  [0, 'Access', '“There’s no signal in my village. Draft A is a wall; Draft B is a path.”', 'debate']];
addCSS(css`
.im-b .tabs3 { position: absolute; left: 22px; top: 196px; display: flex; gap: 4px; padding: 4px; background: #EEF0F3; border-radius: 14px; }
.tabs3 span { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 11px; font-size: 15px; font-weight: 600; color: var(--ink2); }
.tabs3 span.on { background: #fff; color: var(--ink); font-weight: 800; box-shadow: 0 1px 4px rgba(20,22,30,.1); }
.tabs3 em { font-style: normal; font-size: 11px; font-weight: 800; letter-spacing: .06em; padding: 3px 7px; border-radius: 6px; background: #E3E5E9; color: var(--muted); }
.tabs3 span.on em { background: var(--red-soft); color: var(--red2); }
.stp { position: absolute; background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 18px 20px; }
.stp h3 { display: flex; align-items: center; gap: 10px; font-size: 18px; }
.stp h3 i { width: 26px; height: 26px; border-radius: 50%; background: var(--red-soft); color: var(--red2); font-style: normal; font-size: 13px; font-weight: 800; display: grid; place-items: center; }
.stp1 { left: 22px; top: 262px; width: 380px; height: 150px; }
.stp1 p { font-size: 14px; color: var(--muted); margin-top: 6px; line-height: 1.45; }
.stp1 .bd { margin-top: 10px; font-size: 14.5px; line-height: 1.55; background: #FBFBFC; border: 1px solid var(--line); border-radius: 10px; padding: 8px 10px; color: var(--ink2); }
.stp1 ins { background: #E1F3E8; color: #17603F; text-decoration: none; border-radius: 3px; }
.stp2 { left: 22px; top: 424px; width: 380px; height: 390px; }
.stp2 .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
.fld { margin-top: 10px; } .fld small { font-size: 12.5px; color: var(--muted); font-weight: 600; }
.fld div { border: 1px solid var(--line); border-radius: 10px; padding: 8px 11px; font-size: 17px; font-weight: 700; display: flex; justify-content: space-between; align-items: baseline; margin-top: 4px; }
.fld div span { font-size: 11.5px; color: var(--muted); font-weight: 600; }
.stp3 { left: 418px; top: 262px; width: 910px; height: 552px; }
.scn { position: absolute; top: 62px; width: 425px; height: 268px; padding: 20px 22px; border: 1px solid var(--line); border-radius: 14px; }
.scn .lbl { display: flex; gap: 10px; align-items: center; font-size: 15.5px; font-weight: 800; }
.scn .pct { font-size: 92px; font-weight: 800; letter-spacing: -0.05em; line-height: 1; margin-top: 14px; }
.scn .pct small { font-size: 24px; color: var(--muted); letter-spacing: 0; font-weight: 700; margin-left: 8px; }
.scn .bar { height: 13px; border-radius: 7px; background: #F0F1F3; margin-top: 16px; overflow: hidden; }
.scn .bar i { display: block; height: 100%; border-radius: 7px; }
.scn .ft { font-size: 16px; margin-top: 14px; font-weight: 600; color: var(--ink2); }
.mini { position: absolute; top: 344px; width: 280px; height: 120px; padding: 14px 18px; border: 1px solid var(--line); border-radius: 14px; }
.mini small { font-size: 11.5px; font-weight: 800; letter-spacing: .1em; color: var(--muted); }
.mini .v { font-size: 26px; font-weight: 800; letter-spacing: -0.03em; margin-top: 8px; }
.mini em { font-style: normal; font-size: 13px; color: var(--muted); display: block; margin-top: 4px; }
.formula { position: absolute; left: 20px; right: 20px; top: 480px; padding: 12px 16px; display: flex; gap: 14px; align-items: center; font-size: 15px; font-weight: 600; background: #FBFBFC; border: 1px solid var(--line); border-radius: 12px; }
.formula code { font-family: ui-monospace, Consolas, monospace; font-size: 15px; background: #F0F1F3; padding: 3px 9px; border-radius: 7px; }
.boom { position: absolute; left: 0; top: 0; font-size: 22px; font-weight: 800; color: #fff; background: var(--green); padding: 10px 18px; border-radius: 999px; box-shadow: 0 14px 30px -10px rgba(30,142,79,.6); }
/* public forum: knowledge graph → crowd diffusion → issue clusters */
.nw-k { left: 54px; top: 50px; display: flex; gap: 14px; align-items: center; }
.gp { position: absolute; left: 50px; top: 110px; width: 1352px; height: 870px; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 40px 90px -40px rgba(20,22,30,.35), 0 0 0 1px rgba(20,22,30,.05); }
.gp-tabs { position: relative; z-index: 2; display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--line); background: #FBFBFC; }
.gtab { padding: 8px 16px; border-radius: 12px; border: 1px solid transparent; }
.gtab b { display: block; font-size: 16px; color: var(--ink2); } .gtab small { font-size: 12.5px; color: var(--muted); }
.gtab.on { background: #fff; border-color: #F2B6C0; box-shadow: 0 6px 16px -12px rgba(180,35,56,.5); } .gtab.on b { color: var(--red2); }
.gp-cnt { margin-left: auto; display: flex; gap: 10px; }
.gp-cnt div { border: 1px solid var(--line); border-radius: 12px; padding: 5px 14px; background: #fff; min-width: 104px; }
.gp-cnt small { display: block; font-size: 10.5px; font-weight: 800; letter-spacing: .1em; color: var(--muted); }
.gp-cnt b { font-size: 23px; letter-spacing: -0.02em; }
.gsvg { position: absolute; left: 6px; top: 78px; overflow: visible; }
.gsvg text { font-family: Manrope; }
.glegend { position: absolute; left: 22px; bottom: 16px; display: flex; gap: 16px; font-size: 13.5px; font-weight: 700; color: var(--ink2); background: rgba(255,255,255,.9); padding: 6px 10px; border-radius: 10px; }
.glegend span::before { content: ''; display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; background: var(--c); vertical-align: -1px; }
.gscn { position: absolute; right: 18px; bottom: 14px; }
.insp { left: 1428px; top: 110px; width: 450px; height: 870px; }
.qc { position: absolute; left: 0; top: 0; width: 450px; background: #fff; border-radius: 18px; padding: 16px 18px; box-shadow: 0 24px 50px -28px rgba(20,22,30,.35), 0 0 0 1px rgba(20,22,30,.05); }
.qc .who { display: flex; gap: 12px; align-items: center; }
.qc .av { width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; color: #fff; font-size: 15px; }
.qc b { font-size: 17px; display: block; } .qc small { font-size: 13px; color: var(--muted); }
.qc p { font-size: 16.5px; line-height: 1.45; margin-top: 10px; color: var(--ink); }
.crowdc, .stance { position: absolute; left: 0; top: 0; width: 450px; background: #fff; border-radius: 18px; padding: 20px 22px; box-shadow: 0 24px 50px -28px rgba(20,22,30,.35), 0 0 0 1px rgba(20,22,30,.05); }
.crowdc h4, .stance h4 { font-size: 13px; letter-spacing: .1em; color: var(--muted); }
.crowdc .big { font-size: 54px; font-weight: 800; letter-spacing: -0.04em; line-height: 1.05; margin-top: 8px; }
.crowdc .big small { font-size: 18px; color: var(--muted); letter-spacing: 0; margin-left: 6px; }
.crowdc .rows { margin-top: 14px; display: grid; gap: 8px; }
.crowdc .rows div { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 700; }
.crowdc .rows i { width: 12px; height: 12px; border-radius: 50%; }
.crowdc .rows b { margin-left: auto; font-size: 17px; }
.crowdc p { font-size: 13.5px; color: var(--muted); margin-top: 12px; line-height: 1.45; }
.srow { margin-top: 14px; } .srow b { font-size: 15px; }
.sbar { display: flex; height: 22px; border-radius: 6px; overflow: hidden; margin-top: 6px; background: #F0F1F3; }
.sbar i { display: block; height: 100%; }
.slg { display: flex; gap: 14px; font-size: 12.5px; color: var(--muted); margin-top: 12px; font-weight: 600; }
.slg span::before { content: ''; display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; background: var(--c); }
.disc { left: 1428px; top: 892px; width: 450px; font-size: 17px; line-height: 1.35; color: var(--ink2); font-weight: 700; display: flex; gap: 10px; align-items: center; background: #fff; padding: 12px 16px; border-radius: 14px; box-shadow: 0 0 0 1px rgba(20,22,30,.06); }
`);
scene('impact', `<div class="whip"><div class="cam">
  <div class="im-a"><div class="im-head mega abs"><div class="l1">Test it on people<span class="red">.</span></div><div class="l2" style="color:var(--muted)">Before they meet it.</div></div></div>
  <div class="im-b"><div class="dw abs">${appWindow({ crumb: 'Policy Studio · Test impact', body: `<div class="ed-body">${stages(2, ['Saved · v3', '3 findings · resolved', 'Comparing A/B…'], { primary: 'Compare A/B', icon: 'chart-column', ver: 'v3' })}
    <div class="tabs3"><span class="on">${ic('chart-column', 16)}A/B Scenario Projection<em>QUANTITATIVE</em></span><span>${ic('network', 16)}AI Persona Public Forum<em>QUALITATIVE</em></span><span>${ic('scan-search', 16)}Unified Review<em>SYNTHESIS</em></span></div>
    <div class="stp stp1"><h3><i>1</i>Alternative B</h3><p>A is the saved draft (v3). B adds an assisted channel.</p><div class="bd">Pasal 2 (1) … melalui aplikasi digital<ins> atau kanal pendampingan</ins> …</div></div>
    <div class="stp stp2 asm"><h3><i>2</i>Assumptions</h3><div class="grid">${ASM.map(([l, v, u], i) => `<div class="fld f${i}"><small>${l}</small><div><b class="av">${v}</b><span>${u}</span></div></div>`).join('')}</div></div>
    <div class="stp stp3"><h3><i>3</i>Compare</h3>
      <div class="scn sa" style="left:20px"><div class="lbl"><span class="tag high">A</span>Digital only · v3</div><div class="pct"><span class="pa">0</span>%<small>served</small></div><div class="bar"><i class="ba" style="background:var(--red)"></i></div><div class="ft fa">1,750 served · <b style="color:var(--red2)">750 left out</b></div></div>
      <div class="scn sb" style="left:463px"><div class="lbl"><span class="tag ok">B</span>Digital + assisted channel</div><div class="pct"><span class="pb">0</span>%<small>served</small></div><div class="bar"><i class="bbb" style="background:var(--green)"></i></div><div class="ft fb">2,350 served · <b style="color:var(--green)">150 left out</b></div></div>
      <div class="mini mi0" style="left:20px"><small>VARIABLE COST</small><div class="v">Rp 35.0M → 65.0M</div><em>A → B, per intake cycle</em></div>
      <div class="mini mi1" style="left:314px"><small>ASSISTED WORKLOAD</small><div class="v">15 staff-days</div><em>600 cases ÷ 40 per day</em></div>
      <div class="mini mi2" style="left:608px"><small>SENSITIVITY ±10 PTS</small><div class="v" style="font-size:21px">A 60–80% · B 92–96%</div><em>Digital access 60% / 80%</em></div>
      <div class="formula">${ic('shield-check', 20)}<span>Assumption-based model</span><code>served = N·p + N·(1−p)·q</code><span style="color:var(--muted)">no LLM arithmetic</span></div>
      <div class="boom">+600 people served</div></div>
  </div>` })}</div></div>
  <div class="im-c">
    <div class="nw-k abs"><span class="kicker">AI persona public forum</span><span class="chip dark">${ic('users', 15)}32 synthetic personas × 5 rounds</span><span class="chip">${ic('network', 15)}200 crowd agents</span></div>
    <div class="gp">
      <div class="gp-tabs"><div class="gtab gt0 on"><b>Knowledge graph</b><small class="kgsum"></small></div><div class="gtab gt1"><b>Crowd network</b><small>232 agents</small></div><div class="gtab gt2"><b>Persona network</b><small>32 agents</small></div>
        <div class="gp-cnt"><div><small class="rlab">ROUND</small><b class="rnd">–</b></div><div><small>AI RESPONSES</small><b class="rsp">0</b></div></div></div>
      <svg class="gsvg" width="1340" height="790" viewBox="0 0 1340 800"></svg>
      <div class="glegend lg-kg">${Object.entries({ Policy: KG_C.policy, Article: KG_C.article, 'Legal source': KG_C.source, Issue: KG_C.issue, Stakeholder: KG_C.persona }).map(([l, c]) => `<span style="--c:${c}">${l}</span>`).join('')}</div>
      <div class="glegend lg-st">${Object.entries({ Support: ST_C.support, Conditional: ST_C.conditional, Oppose: ST_C.oppose, 'Not reached': '#C9CDD3' }).map(([l, c]) => `<span style="--c:${c}">${l}</span>`).join('')}</div>
      <span class="chip gscn">Scenario B · assisted channel</span>
    </div>
    <div class="insp abs">${QUOTES.map(([p, issue, tx]) => `<div class="qc"><div class="who"><div class="av" style="background:${ISSUES[p][1]}">${FEAT[p][2]}</div><div><b>${FEAT[p][0]}</b><small>${FEAT[p][1]} · ${issue}</small></div></div><p>${tx}</p></div>`).join('')}
      <div class="crowdc"><h4>CROWD SPREAD · SCENARIO B</h4><div class="big"><span class="reach">0</span><small>/ 232 reached</small></div>
        <div class="rows">${Object.entries(ST_C).map(([k, c]) => `<div><i style="background:${c}"></i>${k[0].toUpperCase() + k.slice(1)}<b class="cnt-${k}">0</b></div>`).join('')}</div>
        <p>Each agent adopts a view from the agents it follows. Rule-based diffusion: the crowd adds no AI calls.</p></div>
      <div class="stance"><h4>STANCE AFTER ROUND 5</h4>
        <div class="srow"><b>Draft A · digital only</b><div class="sbar"><i class="sA0" style="background:var(--green)"></i><i class="sA1" style="background:#D69E2E"></i><i class="sA2" style="background:var(--red)"></i></div></div>
        <div class="srow"><b>Draft B · assisted channel</b><div class="sbar"><i class="sB0" style="background:var(--green)"></i><i class="sB1" style="background:#D69E2E"></i><i class="sB2" style="background:var(--red)"></i></div></div>
        <div class="slg"><span style="--c:var(--green)">Support</span><span style="--c:#D69E2E">Conditional</span><span style="--c:var(--red)">Oppose</span></div></div></div>
    <div class="disc abs">${ic('circle-alert', 16)} Synthetic personas: not a survey, and not a substitute for public consultation.</div>
  </div>
</div></div>`, ({ q, qa, sc }) => {
  const I = [0, 1, 2, 3, 4, 5, 6, 7].map(i => LN('impact', i));
  const tSev = W('impact', 'seventy'), tNin = W('impact', 'ninetyfour'), tSix = W('impact', 'six'), tCost = W('impact', 'cost'), tStaff = W('impact', 'staff');
  const tDeb = W('impact', 'debate'), tRip = W('impact', 'ripple'), tClus = W('impact', 'clustered'), tNot = W('impact', 'not');
  const B0 = I[1].t - 0.35, C0 = I[5].t - 0.45;
  const qTimes = QUOTES.map(qq => W('impact', qq[3]) - 0.2);
  // phases of the forum: knowledge graph (K) → persona debate → crowd spread (TD0..TD1) → issue clusters (TS)
  const TT0 = I[6].t - 0.55, TD0 = tRip - 0.1, TD1 = I[7].t + 1.2, TS = tClus - 0.15;
  cue(sc.start, 'whoosh'); cue(B0, 'whoosh'); cue(tSev, 'count', { d: 1.1 }); cue(tNin, 'count', { d: 1.1 }); cue(tSix, 'pop'); cue(C0, 'whoosh');
  qTimes.forEach(t => cue(t, 'pop')); cue(TT0, 'whoosh'); cue(TS, 'swell');
  for (let r = 0; r < 5; r++) cue(lerp(TD0, TD1, r / 5), 'impact');

  // ---------- geometry (deterministic) ----------
  const R = rnd(11), cx = 670, cy = 400, EX = 1.42, EY = 0.84;
  const at = (a, r) => ({ x: cx + Math.cos(a) * r * EX, y: cy + Math.sin(a) * r * EY });
  const deg = d => d * Math.PI / 180;
  const K = [], KE = [];
  const node = (type, label, p, extra = {}) => (K.push({ type, label, x: p.x, y: p.y, c: KG_C[type], r: { policy: 30, article: 13, source: 13, issue: 16, persona: 11 }[type], ...extra }), K.length - 1);
  const link = (a, b) => KE.push([a, b]);
  const pol = node('policy', '§', { x: cx, y: cy });
  const arts = [0, 1, 2, 3, 4, 5].map(i => node('article', 'Pasal ' + (i + 1), at(deg(-75 + i * 60), 112)));
  const srcs = ['UU 25/2009', 'UU 8/2016', 'PP 96/2012', 'UU 12/2011'].map((l, i) => node('source', l, at(deg(-132 + i * 30), 236)));
  const issueAng = ISSUES.map((_, i) => deg(-14 + i * 42));
  const iss = ISSUES.map(([l], i) => node('issue', l, at(issueAng[i], 262)));
  const pers = [];
  for (let i = 0; i < 32; i++) {
    const h = i % 6, k = Math.floor(i / 6), n = Math.ceil((32 - h) / 6);
    pers.push(node('persona', FEAT[i] ? FEAT[i][0] : '', at(issueAng[h] + (k - (n - 1) / 2) * deg(8.5), 392 + (k % 2) * 46 + (R() - 0.5) * 10), { issue: h, feat: !!FEAT[i] }));
  }
  arts.forEach(a => link(pol, a));
  arts.forEach((a, i) => { link(a, srcs[i % 4]); if (i % 2) link(a, srcs[(i + 1) % 4]); });
  iss.forEach((s, j) => { link(s, arts[j]); link(s, arts[(j + 2) % 6]); });
  pers.forEach((p, i) => { link(p, iss[K[p].issue]); if (i % 3 === 0) link(p, arts[(i + K[p].issue) % 6]); });
  const replies = Array.from({ length: 30 }, () => { const a = pers[Math.floor(R() * 32)]; let b = pers[Math.floor(R() * 32)]; if (a === b) b = pers[(pers.indexOf(a) + 9) % 32]; return [a, b]; });
  const adj = K.map(() => []); KE.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  q('.kgsum').textContent = `${K.length} entities · ${KE.length + replies.length} relations`;
  // when a featured persona speaks, its view ripples two hops through the knowledge graph
  const kgWaves = QUOTES.map(([p], i) => {
    const src = pers[p], t0 = qTimes[i] + 0.1, hops = new Map([[src, { h: 0, from: -1 }]]);
    let frontier = [src];
    for (let h = 1; h <= 2; h++) { const next = []; frontier.forEach(n => adj[n].forEach(m => { if (!hops.has(m)) { hops.set(m, { h, from: n }); next.push(m); } })); frontier = next; }
    return { t0, hops };
  });

  // crowd: 232 agents on a phyllotaxis disk; the 32 personas are the seeds; each agent follows its 2 nearest neighbours
  const N = 232, C = [];
  for (let i = 0; i < N; i++) { const p = at(i * 2.399963, Math.sqrt((i + 4) / (N + 4)) * 452 + (R() - 0.5) * 16); C.push({ x: p.x, y: p.y, core: -1 }); }
  for (let k = 0; k < 32; k++) C[k * 7 + 3].core = k;
  const CE = [], cadj = C.map(() => []), dist = (a, b) => Math.hypot(C[a].x - C[b].x, C[a].y - C[b].y);
  C.forEach((_, i) => { C.map((_, j) => j).filter(j => j !== i).sort((a, b) => dist(i, a) - dist(i, b)).slice(0, 2).forEach(j => { if (!cadj[i].includes(j)) { cadj[i].push(j); cadj[j].push(i); CE.push([i, j]); } }); });
  const STANCES = ['support', 'conditional', 'oppose'];
  // Draft B adds an assisted channel: access and accommodation personas back it; cost and capacity want conditions
  const ISSUE_STANCE = [['support', 'support', 'support', 'conditional', 'support', 'support'], ['support', 'support', 'support', 'support', 'conditional', 'support'], ['conditional', 'oppose', 'conditional', 'support', 'conditional', 'conditional'], ['conditional', 'conditional', 'oppose', 'conditional', 'support', 'conditional'], ['conditional', 'support', 'conditional', 'oppose', 'conditional', 'support'], ['support', 'conditional', 'support', 'conditional', 'support', 'conditional']];
  const coreStance = k => ISSUE_STANCE[k % 6][Math.floor(k / 6)];
  const hop = Array(N).fill(-1), parent = Array(N).fill(-1);
  let queue = C.map((c, i) => (c.core >= 0 ? i : -1)).filter(i => i >= 0);
  queue.forEach(i => { hop[i] = 0; C[i].stance = coreStance(C[i].core); C[i].root = C[i].core; });
  while (queue.length) { const next = []; queue.forEach(i => cadj[i].forEach(j => { if (hop[j] < 0) { hop[j] = hop[i] + 1; parent[j] = i; next.push(j); } })); queue = next; }
  C.forEach((_, i) => { if (hop[i] < 0) { const j = C.map((_, k) => k).filter(k => hop[k] >= 0).sort((a, b) => dist(i, a) - dist(i, b))[0]; hop[i] = hop[j] + 1; parent[i] = j; CE.push([i, j]); } });
  const order = C.map((_, i) => i).sort((a, b) => hop[a] - hop[b]);
  order.forEach(i => { if (parent[i] < 0) return; const p = C[parent[i]]; C[i].root = p.root; C[i].stance = R() < 0.8 ? p.stance : STANCES[R() < 0.5 ? 0 : R() < 0.7 ? 1 : 2]; });
  const maxHop = Math.max(...hop), span = (TD1 - TD0) / maxHop;
  C.forEach((c, i) => (c.t = hop[i] === 0 ? TD0 - 0.25 + (c.core % 8) * 0.03 : TD0 + (hop[i] - 1 + 0.15 + 0.7 * (dist(i, parent[i]) / 70 % 1)) * span));
  const final = Object.fromEntries(STANCES.map(s => [s, C.filter(c => c.stance === s).length]));
  // issue clusters: every agent joins the issue of the persona its view came from
  const members = ISSUES.map(() => []); C.forEach((c, i) => members[K[pers[c.root]].issue].push(i));
  const clCtr = ISSUES.map((_, j) => ({ x: 260 + (j % 3) * 410, y: j < 3 ? 250 : 600 }));
  members.forEach((m, j) => { const ctr = clCtr[j]; m.sort((a, b) => STANCES.indexOf(C[a].stance) - STANCES.indexOf(C[b].stance)).forEach((i, n) => { const a = n * 2.399963, r = Math.sqrt(n + 0.5) * 11; C[i].cx = ctr.x + Math.cos(a) * r; C[i].cy = ctr.y + Math.sin(a) * r * 0.9; }); });

  // ---------- SVG ----------
  const svg = q('.gsvg');
  svg.innerHTML = `<defs><radialGradient id="glow"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <g class="zoom"><g class="kg">
      <g class="ke">${KE.map(([a, b]) => `<line x1="${K[a].x}" y1="${K[a].y}" x2="${K[b].x}" y2="${K[b].y}" stroke="#C9CDD6" stroke-width="1.4" pathLength="1" stroke-dasharray="1"/>`).join('')}</g>
      <g class="kr">${replies.map(([a, b]) => { const A = K[a], B = K[b], mx = (A.x + B.x) / 2 + (cy - (A.y + B.y) / 2) * 0.35, my = (A.y + B.y) / 2 + ((A.x + B.x) / 2 - cx) * 0.2; return `<path d="M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}" fill="none" stroke="#1E8E4F" stroke-opacity=".35" stroke-width="1.4" pathLength="1" stroke-dasharray="1"/>`; }).join('')}</g>
      <g class="kp">${K.map(() => '<circle r="3" fill="#fff"/>').join('')}</g>
      <g class="kw">${K.map(n => `<circle fill="none" stroke="${n.c}" stroke-width="2.5"/>`).join('')}</g>
      <g class="kn">${K.map(n => `<g><circle r="${n.r}" fill="${n.type === 'policy' ? n.c : '#fff'}" stroke="${n.c}" stroke-width="${n.type === 'persona' ? 0 : 3}"/>${n.type === 'persona' ? `<circle r="${n.r}" fill="${n.c}"/>` : ''}${n.type === 'policy' ? `<text y="8" text-anchor="middle" font-size="24" font-weight="800" fill="#fff">§</text>` : ''}</g>`).join('')}</g>
      <g class="kl">${K.map(n => n.type === 'persona' && !n.feat ? '<text></text>' : `<text text-anchor="middle" font-size="${n.type === 'policy' ? 16 : n.feat ? 15 : 13.5}" font-weight="${n.feat || n.type !== 'article' ? 800 : 700}" fill="${n.type === 'issue' ? '#8A5A0B' : n.type === 'source' ? '#4B2FA6' : '#1F2329'}">${n.type === 'policy' ? 'PP Layanan Publik Digital' : n.label}</text>`).join('')}</g>
    </g>
    <g class="cw">
      <circle class="shock" cx="${cx}" cy="${cy}" fill="none" stroke="#C8102E" stroke-width="3"/>
      <g class="ce">${CE.map(() => '<line stroke-width="1.3"/>').join('')}</g>
      <g class="cp">${C.map(() => '<circle r="3.4" fill="#fff"/>').join('')}</g>
      <g class="cr">${C.map(() => '<circle fill="none" stroke-width="2.4"/>').join('')}</g>
      <g class="cn">${C.map(c => `<circle r="${c.core >= 0 ? 10 : 5.2}"/>`).join('')}</g>
      <g class="cl">${ISSUES.map(([l]) => `<g><text text-anchor="middle" font-size="19" font-weight="800" fill="#1F2329">${l}</text><text class="cc" text-anchor="middle" font-size="14" font-weight="700" fill="#6E7279"></text></g>`).join('')}</g>
    </g></g>`;
  const $ = s => [...svg.querySelectorAll(s)];
  const gKE = $('.ke line'), gKR = $('.kr path'), gKP = $('.kp circle'), gKW = $('.kw circle'), gKN = $('.kn > g'), gKL = $('.kl text');
  const zoom = svg.querySelector('.zoom'), gCE = $('.ce line'), gCP = $('.cp circle'), gCR = $('.cr circle'), gCN = $('.cn circle'), gCL = $('.cl > g'), shock = svg.querySelector('.shock');
  const kIn = K.map((n, i) => ({ policy: C0 + 0.2, article: C0 + 0.45, source: C0 + 0.8, issue: C0 + 1.05, persona: C0 + 1.3 }[n.type] + (n.type === 'persona' ? (i % 32) * 0.035 : (i % 6) * 0.06)));
  const qcs = qa('.qc');
  return t => {
    whip(q('.whip'), t, sc, { enter: true });
    const ab = P(t, B0, 0.45, Ez.in);
    const ain = P(t, sc.start + 0.05, 0.6, Ez.out5);
    st(q('.im-a'), { o: Math.min(ain, 1 - ab), y: -ab * 120, blur: ab * 14 });
    st(q('.im-head .l1'), { y: (1 - ain) * 50 });
    const l2 = P(t, I[0].t + 0.8, 0.6, Ez.out5); st(q('.im-head .l2'), { y: (1 - l2) * 40, o: l2 });
    // B — A/B projection in Test impact
    const bin = P(t, B0, 0.6, Ez.out5), bout = P(t, C0, 0.45, Ez.in);
    st(q('.im-b'), { o: Math.min(bin, 1 - bout), y: (1 - bin) * 130 - bout * 130, blur: (1 - bin) * 16 + bout * 16 });
    qa('.asm .fld').forEach((f, i) => { const a = P(t, I[1].t + i * 0.12, 0.4, Ez.out5); st(f, { o: a, x: (1 - a) * 20 }); });
    const pa = P(t, tSev - 0.2, 1.1, Ez.out), pb = P(t, tNin - 0.2, 1.1, Ez.out);
    q('.pa').textContent = Math.round(70 * pa); q('.ba').style.width = 70 * pa + '%';
    q('.pb').textContent = Math.round(94 * pb); q('.bbb').style.width = 94 * pb + '%';
    st(q('.sa'), { o: P(t, I[1].t + 0.3, 0.4), y: (1 - P(t, I[1].t + 0.3, 0.6, Ez.out5)) * 30 });
    st(q('.sb'), { o: P(t, I[1].t + 0.45, 0.4), y: (1 - P(t, I[1].t + 0.45, 0.6, Ez.out5)) * 30 });
    q('.fa').style.opacity = P(t, tSev + 0.7, 0.4); q('.fb').style.opacity = P(t, tNin + 0.7, 0.4);
    const bm = P(t, tSix - 0.15, 0.5, Ez.back); st(q('.boom'), { x: 640, y: 14, s: bm, o: bm });
    st(q('.mi0'), { o: P(t, tCost - 0.1, 0.4), y: (1 - P(t, tCost - 0.1, 0.5, Ez.out5)) * 20 });
    st(q('.mi1'), { o: P(t, tStaff - 0.1, 0.4), y: (1 - P(t, tStaff - 0.1, 0.5, Ez.out5)) * 20 });
    st(q('.mi2'), { o: P(t, tStaff + 0.4, 0.4) });
    st(q('.formula'), { o: P(t, tStaff + 0.7, 0.5) });
    q('.stg-sub-2').textContent = t < tNin + 0.6 ? 'Comparing A/B…' : 'A/B · v3';
    camFrame(q('.cam'), t, [{ t: 0, x: 960, y: 540, z: 1 }, { t: I[1].t - 0.1, x: 900, y: 620, z: 1.12 }, { t: tSev - 0.45, x: 1230, y: 590, z: 1.24 }, { t: tCost - 0.35, x: 1230, y: 740, z: 1.22 }, { t: C0 - 0.15, x: 960, y: 540, z: 1, d: 0.5 }]);

    // C — public forum
    const cin = P(t, C0, 0.7, Ez.out5);
    st(q('.im-c'), { o: cin, y: (1 - cin) * 130, blur: (1 - cin) * 16 });
    const toCrowd = P(t, TT0, 0.9, Ez.io), toCl = P(t, TS, 1.2, Ez.io);
    // knowledge graph: nodes pop in by type, edges draw, everything breathes like a live force layout
    const kgFade = 1 - toCrowd;
    svg.querySelector('.kg').style.opacity = kgFade;
    const drift = i => [Math.sin(t * 0.7 + i * 1.7) * 3.2, Math.cos(t * 0.6 + i * 2.3) * 3.2];
    const KP = K.map((n, i) => { const [dx, dy] = drift(i); return { x: n.x + dx, y: n.y + dy }; });
    gKN.forEach((g, i) => { const a = P(t, kIn[i], 0.5, Ez.back); g.setAttribute('transform', `translate(${KP[i].x} ${KP[i].y}) scale(${a})`); g.style.opacity = P(t, kIn[i], 0.15); });
    gKL.forEach((l, i) => { const n = K[i]; l.setAttribute('x', KP[i].x); l.setAttribute('y', KP[i].y + (n.type === 'policy' ? 54 : n.r + 18)); l.style.opacity = P(t, kIn[i] + 0.2, 0.4); });
    KE.forEach(([a, b], i) => { const e = gKE[i]; e.setAttribute('x1', KP[a].x); e.setAttribute('y1', KP[a].y); e.setAttribute('x2', KP[b].x); e.setAttribute('y2', KP[b].y); e.setAttribute('stroke-dashoffset', 1 - P(t, Math.max(kIn[a], kIn[b]), 0.6, Ez.out)); });
    // persona debate: reply arcs light up round by round
    const roundK = r => lerp(tDeb - 0.3, TT0, r / 5);
    gKR.forEach((p, i) => p.setAttribute('stroke-dashoffset', 1 - P(t, lerp(roundK(0), roundK(5), i / gKR.length), 0.45, Ez.out)));
    // ripples: a speaking persona's view travels hop by hop through the graph
    const kRip = K.map(() => null), kPulse = K.map(() => null);
    kgWaves.forEach(w => w.hops.forEach(({ h, from }, n) => {
      const tn = w.t0 + h * 0.34;
      if (t >= tn && t < tn + 1) kRip[n] = t - tn;
      if (from >= 0 && t >= tn - 0.34 && t < tn) kPulse[n] = { from, k: (t - (tn - 0.34)) / 0.34 };
    }));
    gKW.forEach((c, i) => { const e = kRip[i]; if (e === null) { c.style.opacity = 0; return; } c.setAttribute('cx', KP[i].x); c.setAttribute('cy', KP[i].y); c.setAttribute('r', K[i].r + 6 + 34 * Ez.out(e)); c.style.opacity = (1 - e) * 0.85; });
    gKP.forEach((c, i) => { const p = kPulse[i]; if (!p) { c.style.opacity = 0; return; } const A = KP[p.from], B = KP[i]; c.setAttribute('cx', lerp(A.x, B.x, p.k)); c.setAttribute('cy', lerp(A.y, B.y, p.k)); c.setAttribute('fill', K[p.from].c); c.setAttribute('r', 5); c.style.opacity = 1; });
    // tabs, counters and legend follow the phase
    q('.gt0').classList.toggle('on', t < TT0 + 0.45); q('.gt1').classList.toggle('on', t >= TT0 + 0.45);
    const round = t < tDeb - 0.3 ? 0 : t < TT0 ? Math.min(5, 1 + Math.floor(5 * (t - roundK(0)) / (roundK(5) - roundK(0)))) : t < TD0 ? 0 : Math.min(5, 1 + Math.floor(5 * (t - TD0) / (TD1 - TD0)));
    q('.rlab').textContent = t < TT0 ? 'DEBATE ROUND' : 'SPREAD ROUND';
    q('.rnd').textContent = round ? `${round} / 5` : '–';
    q('.rsp').textContent = fmt(320 * P(t, I[5].t + 0.6, TT0 - I[5].t - 0.6, Ez.lin));
    q('.lg-kg').style.opacity = 1 - toCrowd; q('.lg-st').style.opacity = toCrowd;
    q('.gscn').style.opacity = toCrowd;

    // crowd network: personas become seeds, the view spreads agent by agent
    svg.querySelector('.cw').style.opacity = toCrowd;
    const CP = C.map((c, i) => {
      let x = c.x, y = c.y;
      if (c.core >= 0) { const kp = KP[pers[c.core]]; x = lerp(kp.x, c.x, toCrowd); y = lerp(kp.y, c.y, toCrowd); }
      return { x: lerp(x, c.cx, toCl), y: lerp(y, c.cy, toCl) };
    });
    const reached = { support: 0, conditional: 0, oppose: 0 };
    gCN.forEach((g, i) => {
      const c = C[i], on = t >= c.t, e = t - c.t;
      if (on) reached[c.stance]++;
      const pop = on && e < 0.35 ? 1 + 0.9 * Math.sin(Math.PI * e / 0.35) : 1;
      const appear = c.core >= 0 ? 1 : P(t, TT0 + 0.25 + (i % 40) * 0.012, 0.4);
      g.setAttribute('cx', CP[i].x); g.setAttribute('cy', CP[i].y);
      g.setAttribute('r', (c.core >= 0 ? 10 : 5.2) * pop * appear);
      g.setAttribute('fill', on ? ST_C[c.stance] : '#C9CDD3');
      g.setAttribute('stroke', '#fff'); g.setAttribute('stroke-width', c.core >= 0 ? 2.5 : 1);
      const rp = gCR[i];
      if (on && e < 1.1) { rp.setAttribute('cx', CP[i].x); rp.setAttribute('cy', CP[i].y); rp.setAttribute('r', (c.core >= 0 ? 12 : 6) + (c.core >= 0 ? 46 : 30) * Ez.out(e / 1.1)); rp.setAttribute('stroke', ST_C[c.stance]); rp.setAttribute('fill', ST_C[c.stance]); rp.setAttribute('fill-opacity', 0.14 * (1 - e / 1.1)); rp.setAttribute('stroke-width', 3.2 - 2 * (e / 1.1)); rp.style.opacity = (1 - e / 1.1) * 0.9; }
      else rp.style.opacity = 0;
      const pu = gCP[i];
      if (parent[i] >= 0 && t >= c.t - 0.42 && t < c.t) { const k = (t - (c.t - 0.42)) / 0.42, A = CP[parent[i]]; pu.setAttribute('cx', lerp(A.x, CP[i].x, k)); pu.setAttribute('cy', lerp(A.y, CP[i].y, k)); pu.setAttribute('fill', ST_C[C[parent[i]].stance]); pu.style.opacity = 1; }
      else pu.style.opacity = 0;
    });
    CE.forEach(([a, b], i) => {
      const l = gCE[i], child = parent[a] === b ? a : parent[b] === a ? b : -1;
      l.setAttribute('x1', CP[a].x); l.setAttribute('y1', CP[a].y); l.setAttribute('x2', CP[b].x); l.setAttribute('y2', CP[b].y);
      let col = '#D5D8DE', op = 0.55 * P(t, TT0 + 0.3, 0.6);
      if (child >= 0 && t >= C[child].t - 0.42) { const e = t - C[child].t; col = ST_C[C[child].stance]; op = e < 0 ? 0.9 : lerp(0.9, 0.32, P(t, C[child].t, 1.2)); }
      l.setAttribute('stroke', col); l.style.opacity = op * (1 - toCl);
    });
    // a shock ring sweeps the network at every spread round
    let sh = -1; for (let r = 0; r < 5; r++) { const tr = lerp(TD0, TD1, r / 5); if (t >= tr && t < tr + 1.1) sh = (t - tr) / 1.1; }
    if (sh >= 0) { shock.setAttribute('r', 40 + 620 * Ez.out(sh)); shock.style.opacity = (1 - sh) * 0.35; } else shock.style.opacity = 0;
    gCL.forEach((g, j) => { const ctr = clCtr[j], a = P(t, TS + 0.8 + j * 0.08, 0.5, Ez.out5), m = members[j]; const ty = ctr.y - Math.sqrt(m.length) * 11 - 18; g.querySelector('text').setAttribute('x', ctr.x); g.querySelector('text').setAttribute('y', ty); const cc = g.querySelector('.cc'); cc.setAttribute('x', ctr.x); cc.setAttribute('y', ctr.y + Math.sqrt(m.length) * 11 + 28); cc.textContent = `${m.length} agents · ${Math.round(100 * m.filter(i => C[i].stance === 'support').length / m.length)}% support`; g.style.opacity = a; });
    // camera inside the panel: push in while the view spreads, settle back for the clusters
    const zc = camState(t, [{ t: 0, x: cx, y: cy, z: 1 }, { t: TD0 - 0.2, x: cx, y: cy + 10, z: 1.13, d: 2.4 }, { t: TS - 0.3, x: cx, y: cy, z: 1, d: 1 }]);
    zoom.setAttribute('transform', `translate(${cx - zc.x * zc.z} ${cy - zc.y * zc.z}) scale(${zc.z})`);
    // inspector: quotes stack while personas speak → crowd counters → stance per draft
    const qOut = P(t, TT0 - 0.2, 0.4, Ez.in);
    let y = 0;
    for (let i = qcs.length - 1; i >= 0; i--) { const a = P(t, qTimes[i], 0.5, Ez.out5); if (a <= 0) { st(qcs[i], { o: 0 }); continue; } st(qcs[i], { y: y + (1 - a) * -24, o: a * (1 - qOut), s: 1 }); y += a * (qcs[i].offsetHeight + 12); }
    const cr = Math.min(P(t, TT0 + 0.2, 0.5, Ez.out5), 1 - P(t, TS + 0.6, 0.4, Ez.in));
    st(q('.crowdc'), { o: cr, y: (1 - cr) * 20 });
    q('.reach').textContent = reached.support + reached.conditional + reached.oppose;
    STANCES.forEach(s => (q('.cnt-' + s).textContent = reached[s]));
    const sb = P(t, TS + 0.8, 0.7, Ez.out5);
    st(q('.stance'), { o: sb, y: (1 - sb) * 30 });
    const pct = s => Math.round(100 * final[s] / N);
    [['A', [18, 46, 36]], ['B', [pct('support'), pct('conditional'), 100 - pct('support') - pct('conditional')]]].forEach(([k, v]) => v.forEach((x, i) => (q(`.s${k}${i}`).style.width = x * P(t, TS + 1 + i * 0.1, 0.9) + '%')));
    q('.disc').style.opacity = P(t, tNot - 0.6, 0.6);
  };
});

/* =============================== 7 · OUTCOME =============================== */
// Activity: one decision trail per draft — versions, agent runs, their results and review decisions
const TL = [['v', 'VERSION 3', 'Proposal applied', 'Current'], ['j', 'Agent run · Legal review + impact', '09:08 · 6 steps', 'Done'], ['r', 'Source check', '0 open findings', 'Reviewed'], ['r', 'Impact simulation', 'Access 70% → 94% · +600 served', 'Reviewed'],
  ['j', 'Agent run · Public forum', '09:11 · 32 personas · 200 crowd', 'Done'], ['r', 'Public forum', '320 responses · clustered by issue', 'Needs review'], ['v', 'VERSION 2', 'Article 2 edited', ''], ['r', 'Source check', '3 findings · 1 high', 'Reviewed'], ['v', 'VERSION 1', 'Drafted with Gemini', '']];
scene('outcome', `<div class="whip"><div class="cam">
  <div class="kicker abs" style="left:80px;top:80px">Output</div>
  <div class="pg pgA" style="left:80px;top:170px"><div class="ph">RANCANGAN<br>PERATURAN PEMERINTAH<br>REPUBLIK INDONESIA</div><div class="ph" style="font-size:15px;margin-top:10px">TENTANG LAYANAN PUBLIK DIGITAL<br>ADMINISTRASI KEPENDUDUKAN YANG INKLUSIF</div>
    <div class="pt">Menimbang</div><div class="pl"></div><div class="pl" style="width:80%"></div><div class="pt">Pasal 1</div><div class="pl"></div><div class="pl" style="width:70%"></div><div class="pt">Pasal 2</div><div class="pl" style="background:#d6efdf"></div><div class="pl" style="width:86%;background:#d6efdf"></div><div class="pt">Pasal 3</div><div class="pl" style="width:76%"></div>
    <div class="fname"><span>${ic('download', 18)}RPP_Digital_Services_v3.docx</span></div></div>
  <div class="pg pgB" style="left:480px;top:200px"><div style="font-weight:800;font-size:22px">Review Report</div><div style="font-size:14px;color:var(--muted);margin-top:4px">Draft v3 · 3 findings · 11 verified citations</div>
    ${FINDINGS.map(([c, l, a, h]) => `<div style="display:flex;gap:10px;align-items:center;margin-top:18px"><span class="tag ${c}">${l}</span><b style="font-size:14px">Pasal ${a}</b></div><div style="font-size:14px;margin-top:6px">${h}</div><div class="pl" style="width:90%"></div>`).join('')}
    <div class="pt">Sources</div><div class="pl" style="width:70%"></div><div class="pl" style="width:60%"></div>
    <div class="fname"><span>${ic('download', 18)}Review_Report_v3.docx</span></div></div>
  <div class="mw actw"><div class="mw-top">${logo(26)}Workspace / <b>Activity</b><span class="sp"></span><span class="chip">${CORPUS}</span></div>
    <div class="mw-in"><h2>Activity</h2><div class="sub">Layanan Publik Digital yang Inklusif · Version 3 · 4 results · 2 agent runs</div>
      <div class="chips"><span>Needs review 2</span><span>Reviewed 2</span><span>Outdated 1</span><span class="on">All 4</span></div></div>
    <div class="tl">${TL.map(([k, a, b, s], i) => k === 'v' ? `<div class="tlv tl${i}">${a}${s ? `<i>${s}</i>` : ''}<span style="font-weight:600;letter-spacing:0;text-transform:none">${b}</span></div>` : `<div class="tli tl${i} ${k === 'r' ? 'ch' : ''} ${i === 3 ? 'on' : ''}"><span class="ti" style="background:${k === 'j' ? '#F1EDFB' : '#FCF0F2'};color:${k === 'j' ? 'var(--violet)' : 'var(--red2)'}">${ic(k === 'j' ? 'network' : a.startsWith('Source') ? 'shield-check' : a.startsWith('Impact') ? 'chart-column' : 'users', 15)}</span><div><b>${a}</b><small>${b}</small></div>${s ? `<em class="${s === 'Reviewed' ? 'done' : s === 'Done' ? 'done' : 'needs'}">${s}</em>` : ''}</div>`).join('')}</div>
    <div class="tdet"><div class="ey">IMPACT SIMULATION · VERSION 3</div><h3>Access 70% → 94%</h3>
      <div class="tdec"><b>Review decision</b><div class="seg"><span>Still needs review</span><span class="on">Reviewed with notes</span></div><div class="nt"></div>
        <div class="thist"><div><b>Reviewed with notes</b>reviewer · 09:13</div><div><b>Needs review</b>drafter · 09:09</div></div></div>
      <span class="btn" style="margin-top:12px;font-size:13px;padding:8px 12px">${ic('download', 15)}Review report</span></div>
  </div>
</div></div>`, ({ q, qa, sc }) => {
  const O0 = LN('outcome', 0), O1 = LN('outcome', 1);
  const tDraft = W('outcome', 'formatted'), tRep = W('outcome', 'review'), tWord = W('outcome', 'word');
  cue(sc.start, 'whoosh'); cue(tDraft, 'pop'); cue(tRep, 'pop'); cue(tWord, 'tick'); TL.forEach((_, i) => cue(O1.t - 0.5 + i * 0.12, 'tick'));
  const rows = TL.map((_, i) => q('.tl' + i));
  return t => {
    whip(q('.whip'), t, sc);
    const a = P(t, tDraft - 0.25, 0.8, Ez.out5), b = P(t, tRep - 0.25, 0.8, Ez.out5);
    st(q('.pgA'), { y: (1 - a) * 160, o: a, rz: lerp(-12, -5, a), ry: 14, persp: 2200 });
    st(q('.pgB'), { y: (1 - b) * 160, o: b, rz: lerp(10, 4, b), ry: -10, persp: 2200 });
    qa('.fname').forEach(f => (f.style.opacity = P(t, tWord - 0.1, 0.4)));
    const au = P(t, O0.t + 0.6, 0.7, Ez.out5);
    st(q('.actw'), { x: (1 - au) * 120, o: au });
    rows.forEach((e, i) => { const k = P(t, O1.t - 0.6 + i * 0.12, 0.4, Ez.out5); st(e, { o: k, x: (1 - k) * 24 }); });
    st(q('.tdet'), { o: P(t, O1.t + 0.3, 0.5), y: (1 - P(t, O1.t + 0.3, 0.6, Ez.out5)) * 20 });
    q('.tdet .nt').textContent = typed('Model output from assumptions; confirm the assisted-channel staffing with the regional office.', P(t, O1.t + 0.6, 1.4, Ez.lin));
  };
});

/* =============================== 8 · PLATFORM =============================== */
scene('platform', `<div class="whip"><div class="cam">
  <div class="mw libw"><div class="mw-top">${logo(26)}Workspace / <b>Legal library</b><span class="sp"></span><span class="chip">${CORPUS}</span></div>
    <div class="mw-in"><h2>Legal library</h2><div class="sub">838 regulations · 25,310 articles/blocks · original snapshots</div>
      <div class="lsearch"><div class="seg"><span>Documents</span><span class="on">Articles</span></div><span class="q">akomodasi yang layak disabilitas</span><span class="btn pri">Search</span></div>
      <div class="lcols">
        <div class="lres">${[['UU 8/2016 · Pasal 19', 'Penyandang Disabilitas', 'Page 14 · 3 matches', 1], ['UU 25/2009 · Pasal 29', 'Pelayanan Publik', 'HTML · 2 matches'], ['PP 70/2019 · Pasal 4', 'Perencanaan, Penyelenggaraan…', 'Page 6 · 1 match'], ['UU 8/2016 · Pasal 105', 'Penyandang Disabilitas', 'Page 52 · 1 match']].map(([a, b, c, on]) => `<div class="ldoc ${on ? 'on' : ''}"><small>${a}</small><b>${b}</b><em>${c}</em></div>`).join('')}</div>
        <div class="lread"><div class="ey">UNDANG-UNDANG 8/2016</div><h3>Penyandang Disabilitas</h3><div class="nav"><span>‹</span><span>Pasal 19</span><span>›</span>19 of 153 · Contents</div>
          <div class="art">Hak Pelayanan Publik untuk Penyandang Disabilitas meliputi hak: a. memperoleh <mark>Akomodasi yang Layak</mark> dalam Pelayanan Publik secara optimal, wajar, bermartabat tanpa Diskriminasi; dan b. pendampingan, penerjemahan, dan penyediaan fasilitas yang mudah diakses di tempat layanan publik tanpa tambahan biaya.</div></div>
        <div class="lchat"><h4>${ic('message-square', 16)}Legal assistant</h4><span class="ctx">UU 8/2016 · Pasal 19 ×</span>
          <div class="cq">What must agencies provide for people with disabilities?</div>
          <div class="ca"><span class="ans"></span><div class="cite">${ic('scale', 14)}UU 8/2016 · Pasal 19 <span class="chip green" style="padding:2px 7px;font-size:11px">${ic('check', 11, 3)}verified</span></div></div></div>
      </div></div></div>
  <div class="mw dashw"><div class="mw-top">${logo(26)}Workspace / <b>Data dashboard</b><span class="sp"></span><span class="chip">${CORPUS}</span></div>
    <div class="mw-in"><h2>Data dashboard</h2><div class="sub">838 documents · 2 source sites · live collection</div>
      <div class="tabs"><span class="on">Overview</span><span>Explore documents</span><span>Data quality</span><span>Source queue</span></div>
      <div class="kpis"><div><small>Regulations</small><b>838</b><em>incl. versions</em></div><div><small>Articles / blocks</small><b>25,310</b><em>search + analysis</em></div><div><small>Provinces</small><b class="pv">0 / 38</b><em>with regional documents</em></div><div><small>National</small><b>658</b><em>not split by province</em></div></div>
      <div class="mapbox"><h4>Collection by province<span>issuing region</span></h4>
        <svg class="map" width="768" height="${Math.round(768 * GEO.h / GEO.w)}" viewBox="0 0 ${GEO.w} ${GEO.h}" style="margin-top:8px">${GEO.p.map(p => `<path d="${p.d}" fill="#E5E7EB" stroke="#fff" stroke-width="0.8"/>`).join('')}</svg></div></div></div>
</div></div>`, ({ q, qa, sc }) => {
  const L0 = LN('platform', 0), L1 = LN('platform', 1);
  cue(sc.start, 'whoosh'); cue(L0.t + 0.6, 'type', { d: 1.6 }); cue(L1.t, 'swell');
  const paths = qa('.map path'), order = GEO.p.map((p, i) => [p.cx, i]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  const rank = []; order.forEach((idx, r) => (rank[idx] = r));
  const ans = 'Under UU 8/2016, people with disabilities have the right to reasonable accommodation in public services, plus assistance and accessible facilities at no extra cost.';
  // documents per issuing province: snapshot of the live collection (GET /api/data/overview, 17 Oct 2026)
  const DOCS = { 'Bali': 7, 'Banten': 3, 'Bengkulu': 1, 'DKI Jakarta': 1, 'Daerah Istimewa Yogyakarta': 11, 'Jawa Barat': 40, 'Jawa Tengah': 44, 'Jawa Timur': 40, 'Kalimantan Barat': 2, 'Kalimantan Selatan': 1, 'Kalimantan Timur': 2, 'Kepulauan Bangka Belitung': 1, 'Kepulauan Riau': 1, 'Lampung': 4, 'Papua Tengah': 2, 'Riau': 1, 'Sulawesi Barat': 6, 'Sulawesi Tengah': 5, 'Sumatera Barat': 5, 'Sumatera Selatan': 1, 'Sumatera Utara': 2 };
  const shade = n => (n >= 30 ? '#C8102E' : n >= 8 ? '#E2697F' : n >= 3 ? '#EE9AA8' : '#F6C9D0');
  return t => {
    whip(q('.whip'), t, sc);
    const a = P(t, sc.start + 0.1, 0.7, Ez.out5), b = P(t, L1.t - 0.6, 0.7, Ez.out5);
    st(q('.libw'), { x: (1 - a) * -120, o: a });
    st(q('.dashw'), { x: (1 - b) * 120, o: b });
    q('.ans').textContent = typed(ans, P(t, L0.t + 0.6, 1.8, Ez.lin));
    q('.cite').style.opacity = P(t, L0.t + 2.4, 0.4);
    const sweep = P(t, L1.t - 0.1, 1.8, Ez.io);
    // the sweep outlines all 38 provinces; only provinces with regional documents take a colour
    let shown = 0;
    paths.forEach((p, i) => { const on = sweep * 38 > rank[i], n = DOCS[GEO.p[i].n] || 0; if (on && n) shown++; p.setAttribute('fill', on ? (n ? shade(n) : '#D9DCE1') : '#EEF0F2'); });
    q('.pv').textContent = `${shown} / 38`;
  };
});

/* =============================== 9 · CLOSE =============================== */
scene('close', `<div class="whip"><div class="cam">
  <div class="cl-a">
    <div class="hk-people cl-people abs">${peopleHTML()}</div>
    <div class="cl-head mega abs"><div class="l1">Laws that fit<span class="red">.</span></div></div>
  </div>
  <div class="cl-b">
    <div class="cl-lock abs">${logo(140)}<div class="cl-word">RuleLab</div></div>
    <div class="cl-team abs">Team RuleLab</div>
    <div class="cl-git abs">github.com/mocharil/RuleLab</div>
    <div class="cl-prod abs"></div>
    <div class="cl-next abs"><em>NEXT</em><span>Practitioner validation</span><span>Real public-input module</span></div>
    <div class="cl-built abs"><span class="chip" style="font-size:20px;padding:10px 18px">${ic('sparkles', 20)}Built with Gemini</span><span class="chip" style="font-size:20px;padding:10px 18px">${ic('building-2', 20)}Google Cloud</span></div>
  </div>
  <div class="cl-dot abs"></div>
</div></div>`, ({ q, qa, sc }) => {
  const C0 = LN('close', 0), C1 = LN('close', 1), C2 = LN('close', 2);
  const PRODUCT_URL = 'rulelab-627843549213.asia-southeast2.run.app';
  q('.cl-prod').textContent = PRODUCT_URL ? 'Live demo · ' + PRODUCT_URL : '';
  const tLaws = W('close', 'laws'), tPeople = W('close', 'people');
  cue(sc.start, 'whoosh'); [0, 1, 2].forEach(i => cue(C0.t + 0.1 + i * 0.12, 'pop')); cue(tLaws, 'tick'); cue(C2.t - 0.5, 'whoosh'); cue(C2.t - 0.2, 'swell');
  const cards = qa('.pp'), lk = qa('.pp-lock.lk'), un = qa('.pp-lock.un'), sv = qa('.sv-img');
  return t => {
    whip(q('.whip'), t, sc, { exit: false });
    const toB = P(t, C2.t - 0.5, 0.6, Ez.io);
    st(q('.cl-a'), { o: 1 - toB, y: -toB * 100, blur: toB * 14 });
    cards.forEach((c, i) => {
      const a = P(t, sc.start + 0.1 + i * 0.1, 0.6, Ez.out5), u = P(t, C0.t + 0.1 + i * 0.12, 0.45, Ez.back);
      st(c, { y: (1 - a) * 60, o: a, gray: 0.9 * (1 - u) });
      st(lk[i], { o: 1 - u, s: 1 - u * 0.4 });
      st(un[i], { o: u, s: lerp(1.6, 1, u) });
      sv[i].style.opacity = u;
      st(sv[i], { s: lerp(1.06, 1, u) });
    });
    const h1 = P(t, tLaws - 0.1, 0.6, Ez.out5);
    st(q('.cl-head .l1'), { y: (1 - h1) * 50, o: h1 });
    q('.cl-head .l1').innerHTML = t < tPeople - 0.1 ? 'Laws that fit<span class="red">.</span>' : 'People included<span class="red">.</span>';
    st(q('.cl-head'), { s: t > tPeople - 0.1 && t < tPeople + 0.15 ? 1.03 : 1 });
    const b = P(t, C2.t - 0.3, 0.8, Ez.out5);
    st(q('.cl-lock'), { y: (1 - b) * 40, o: b });
    st(q('.cl-team'), { o: P(t, W('close', 'team') - 0.2, 0.5) });
    st(q('.cl-git'), { o: P(t, W('close', 'team') + 0.2, 0.5) });
    st(q('.cl-prod'), { o: P(t, W('close', 'team') + 0.35, 0.5) });
    const nx = P(t, W('close', 'next') - 0.1, 0.6, Ez.out5);
    st(q('.cl-next'), { y: (1 - nx) * 24, o: nx });
    const bu = P(t, W('close', 'gemini') - 0.2, 0.5, Ez.back);
    st(q('.cl-built'), { o: bu, s: lerp(0.9, 1, bu) });
    // final beat: everything clears to the red dot
    const fin = P(t, sc.end - 1.6, 0.6, Ez.in);
    st(q('.cl-b'), { o: 1 - fin, blur: fin * 10 });
    const d = Math.min(P(t, sc.end - 1.3, 0.4, Ez.back), 1 - P(t, sc.end - 0.35, 0.3, Ez.in));
    st(q('.cl-dot'), { s: d, o: d });
  };
});

addCSS(css`
.rv-comp { left: 0; right: 0; top: 905px; display: flex; justify-content: center; align-items: center; gap: 18px; }
.rv-comp em { font-style: normal; font-size: 22px; color: #8f929a; font-weight: 600; margin-right: 6px; }
.rv-comp span { font-size: 22px; font-weight: 700; color: #d9dbe0; padding: 9px 20px; border-radius: 999px; border: 1px solid #3a3c42; background: #18191c; }
.cl-prod { left: 0; right: 0; top: 748px; text-align: center; font-size: 30px; font-weight: 600; color: var(--ink2); }
.cl-next { left: 0; right: 0; top: 880px; display: flex; justify-content: center; align-items: center; gap: 14px; }
.cl-next em { font-style: normal; font-size: 18px; font-weight: 800; letter-spacing: .12em; color: var(--red); margin-right: 6px; }
.cl-next span { font-size: 22px; font-weight: 600; color: var(--ink2); padding: 9px 20px; border-radius: 999px; background: #fff; box-shadow: 0 0 0 1px rgba(20,22,30,.1); }
`);
