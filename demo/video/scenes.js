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
.paper { position: absolute; left: 22px; top: 116px; width: 880px; height: 700px; background: #fff; border: 1px solid var(--line); border-radius: 18px; overflow: hidden; }
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
.gem { position: absolute; left: 924px; top: 116px; width: 404px; height: 700px; padding: 22px; }
.gem h3 { font-size: 19px; display: flex; gap: 10px; align-items: center; }
.gstep { display: flex; gap: 12px; align-items: center; font-size: 15.5px; font-weight: 600; padding: 13px 0; border-bottom: 1px solid var(--line); color: var(--ink2); }
.gchips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.gloss { position: absolute; background: var(--ink); color: #fff; font-size: 17px; font-weight: 600; padding: 10px 16px; border-radius: 12px; white-space: nowrap; }
.keys { position: absolute; left: 0; top: 0; display: flex; gap: 8px; }
.keys span { min-width: 64px; height: 64px; padding: 0 16px; border-radius: 14px; background: #fff; border: 1px solid var(--line); border-bottom-width: 4px; display: grid; place-items: center; font-size: 22px; font-weight: 800; box-shadow: 0 14px 30px -12px rgba(0,0,0,.3); }
.toast { position: absolute; right: 24px; bottom: 24px; background: var(--ink); color: #fff; font-size: 15px; font-weight: 600; padding: 14px 20px; border-radius: 12px; display: flex; gap: 10px; align-items: center; }

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
.met { display: flex; gap: 14px; margin-top: 14px; }
.met > div { flex: 1; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 14px 18px; }
.met small { font-size: 11px; font-weight: 800; letter-spacing: .1em; color: var(--muted); display: flex; justify-content: space-between; }
.met .v { font-size: 34px; font-weight: 800; letter-spacing: -0.03em; margin: 4px 0 0; }
.met em { font-style: normal; font-size: 12.5px; color: var(--muted); }
.fd { position: absolute; left: 22px; right: 22px; background: #fff; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; }
.fd-h { display: flex; gap: 14px; align-items: center; padding: 18px 20px; }
.fd-h h3 { font-size: 18px; letter-spacing: -0.01em; flex: 1; }
.fd-b { padding: 0 20px 18px; }
.fd-b p { font-size: 15.5px; line-height: 1.55; color: var(--ink2); }
.cols { display: flex; gap: 14px; margin-top: 14px; }
.cols > div { flex: 1; border-radius: 12px; padding: 12px 14px; font-size: 15px; line-height: 1.5; }
.cols small { display: block; font-size: 11px; font-weight: 800; letter-spacing: .1em; margin-bottom: 6px; }
.q-old { background: #FFF3F4; border: 1px solid #f6cfd5; } .q-old small { color: var(--red2); }
.q-new { background: #EFF9F3; border: 1px solid #c9ebd7; } .q-new small { color: var(--green); }
.srcs { display: flex; gap: 8px; margin-top: 14px; align-items: center; }
.drawer { position: absolute; top: 0; right: 0; bottom: 0; width: 610px; background: #fff; border-left: 1px solid var(--line); box-shadow: -40px 0 80px -40px rgba(20,22,30,.35); padding: 24px; }
.drawer h3 { font-size: 20px; display: flex; gap: 10px; align-items: center; }
.sc { position: relative; border: 1px solid var(--line); border-radius: 14px; padding: 16px 18px; margin-top: 14px; overflow: hidden; }
.sc .sh { display: flex; gap: 10px; align-items: center; font-weight: 800; font-size: 16px; }
.sc .qt { font-family: 'Cormorant', serif; font-size: 19px; line-height: 1.45; color: var(--ink); margin-top: 8px; }
.sc .gl { font-size: 13.5px; color: var(--muted); margin-top: 6px; font-style: italic; }
.sc .meta { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
.sc .meta span { font-size: 12.5px; font-weight: 700; padding: 4px 9px; border-radius: 6px; background: #F3F4F6; color: var(--ink2); font-family: ui-monospace, Consolas, monospace; }
.sc .meta span.hl { background: var(--green-soft); color: var(--green); box-shadow: 0 0 0 2px #9fdcb8; }
.vstamp { position: absolute; right: 14px; top: 12px; font-size: 13px; font-weight: 800; color: var(--green); background: var(--green-soft); padding: 5px 10px; border-radius: 8px; display: flex; gap: 6px; align-items: center; }
.sc.bad { border-color: var(--red); background: #FFF6F7; }
.xstamp { position: absolute; right: 16px; top: 34px; border: 4px solid var(--red); color: var(--red); font-weight: 800; font-size: 19px; padding: 6px 14px; border-radius: 10px; background: #fff; transform: rotate(-6deg); }
.note { position: absolute; left: 0; top: 0; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 16px 18px; box-shadow: 0 24px 50px -20px rgba(20,22,30,.35); width: 520px; }
.note .nt { font-size: 15px; margin-top: 10px; color: var(--ink2); min-height: 22px; }
.applied { position: absolute; left: 0; right: 0; top: 0; padding: 10px 20px; background: var(--green); color: #fff; font-weight: 700; font-size: 15px; display: flex; gap: 10px; align-items: center; }

.im-head { left: 0; right: 0; top: 330px; text-align: center; font-size: 140px; }
.asm { position: absolute; left: 22px; top: 116px; width: 380px; height: 700px; padding: 22px; }
.asm h3 { font-size: 19px; margin-bottom: 10px; }
.fld { margin-top: 12px; } .fld small { font-size: 13px; color: var(--muted); font-weight: 600; }
.fld div { border: 1px solid var(--line); border-radius: 11px; padding: 11px 14px; font-size: 19px; font-weight: 700; display: flex; justify-content: space-between; margin-top: 5px; }
.fld div span { font-size: 13px; color: var(--muted); font-weight: 600; }
.scn { position: absolute; top: 116px; width: 446px; height: 330px; padding: 24px; }
.scn .lbl { display: flex; gap: 10px; align-items: center; font-size: 16px; font-weight: 800; }
.scn .pct { font-size: 104px; font-weight: 800; letter-spacing: -0.05em; line-height: 1; margin-top: 18px; }
.scn .pct small { font-size: 26px; color: var(--muted); letter-spacing: 0; font-weight: 700; margin-left: 8px; }
.scn .bar { height: 14px; border-radius: 7px; background: #F0F1F3; margin-top: 18px; overflow: hidden; }
.scn .bar i { display: block; height: 100%; border-radius: 7px; }
.scn .ft { font-size: 17px; margin-top: 16px; font-weight: 600; color: var(--ink2); }
.mini { position: absolute; top: 466px; width: 290px; height: 150px; padding: 18px 20px; }
.mini small { font-size: 12px; font-weight: 800; letter-spacing: .1em; color: var(--muted); }
.mini .v { font-size: 30px; font-weight: 800; letter-spacing: -0.03em; margin-top: 8px; }
.mini em { font-style: normal; font-size: 14px; color: var(--muted); display: block; margin-top: 4px; }
.formula { position: absolute; left: 424px; top: 640px; width: 904px; padding: 16px 20px; display: flex; gap: 14px; align-items: center; font-size: 16px; font-weight: 600; }
.formula code { font-family: ui-monospace, Consolas, monospace; font-size: 16px; background: #F3F4F6; padding: 4px 10px; border-radius: 7px; }
.boom { position: absolute; left: 0; top: 0; font-size: 22px; font-weight: 800; color: #fff; background: var(--green); padding: 10px 18px; border-radius: 999px; box-shadow: 0 14px 30px -10px rgba(30,142,79,.6); }
.nw-k { left: 70px; top: 70px; display: flex; gap: 14px; align-items: center; }
.nw-cnt { right: 70px; top: 62px; display: flex; gap: 14px; }
.nw-cnt div { background: #fff; border-radius: 14px; padding: 10px 18px; box-shadow: 0 0 0 1px rgba(20,22,30,.06); }
.nw-cnt small { font-size: 12px; font-weight: 800; letter-spacing: .1em; color: var(--muted); display: block; }
.nw-cnt b { font-size: 30px; letter-spacing: -0.03em; }
.nw-svg { position: absolute; left: 30px; top: 140px; overflow: visible; }
.nw-svg text { font-family: Manrope; }
.insp { left: 1400px; top: 150px; width: 460px; }
.qc { position: absolute; left: 0; top: 0; width: 460px; background: #fff; border-radius: 20px; padding: 22px; box-shadow: 0 30px 60px -30px rgba(20,22,30,.35), 0 0 0 1px rgba(20,22,30,.05); }
.qc .who { display: flex; gap: 12px; align-items: center; }
.qc .av { width: 50px; height: 50px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; color: #fff; font-size: 18px; }
.qc b { font-size: 19px; display: block; } .qc small { font-size: 14px; color: var(--muted); }
.qc p { font-size: 19px; line-height: 1.5; margin-top: 14px; color: var(--ink); }
.qc .rt { margin-top: 12px; display: flex; gap: 8px; }
.stance { position: absolute; left: 0; top: 330px; width: 460px; background: #fff; border-radius: 20px; padding: 20px 22px; box-shadow: 0 30px 60px -30px rgba(20,22,30,.35), 0 0 0 1px rgba(20,22,30,.05); }
.stance h4 { font-size: 15px; letter-spacing: .08em; color: var(--muted); }
.srow { margin-top: 14px; } .srow b { font-size: 15px; }
.sbar { display: flex; height: 22px; border-radius: 6px; overflow: hidden; margin-top: 6px; background: #F0F1F3; }
.sbar i { display: block; height: 100%; }
.slg { display: flex; gap: 14px; font-size: 12.5px; color: var(--muted); margin-top: 12px; font-weight: 600; }
.slg span::before { content: ''; display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; background: var(--c); }
.disc { left: 1400px; top: 735px; width: 460px; font-size: 20px; line-height: 1.35; align-items: flex-start; color: var(--ink2); font-weight: 700; display: flex; gap: 10px; align-items: center; background: #fff; padding: 10px 20px; border-radius: 18px; box-shadow: 0 0 0 1px rgba(20,22,30,.1), 0 10px 24px -12px rgba(0,0,0,.25); }

.pg { position: absolute; width: 540px; height: 720px; background: #fff; border-radius: 10px; padding: 50px 54px; box-shadow: 0 50px 100px -30px rgba(20,22,30,.4), 0 0 0 1px rgba(20,22,30,.06); }
.pg .ph { font-family: 'Cormorant', serif; font-weight: 700; text-align: center; font-size: 20px; line-height: 1.35; }
.pg .pl { height: 9px; border-radius: 5px; background: #ECEDF0; margin: 11px 0; }
.pg .pt { font-weight: 800; font-size: 13px; margin-top: 18px; }
.fname { position: absolute; left: 0; right: 0; bottom: -70px; display: flex; justify-content: center; }
.fname span { background: var(--ink); color: #fff; font-size: 16px; font-weight: 700; padding: 10px 16px; border-radius: 12px; display: flex; gap: 10px; align-items: center; }
.audit { left: 1220px; top: 130px; width: 580px; padding: 28px; }
.audit h3 { font-size: 24px; display: flex; gap: 12px; align-items: center; margin-bottom: 10px; }
.ae { display: flex; gap: 16px; align-items: flex-start; padding: 13px 0; border-bottom: 1px solid var(--line); }
.ae time { font-family: ui-monospace, Consolas, monospace; font-size: 15px; color: var(--muted); width: 50px; padding-top: 2px; }
.ae b { font-size: 17px; display: block; } .ae small { font-size: 14px; color: var(--muted); }
.ae .ok-ic { margin-top: 2px; }

.chat { left: 110px; top: 170px; width: 780px; height: 600px; padding: 28px; }
.chat h3, .mapc h3 { font-size: 22px; display: flex; gap: 12px; align-items: center; }
.cq { margin: 26px 0 0 auto; width: fit-content; max-width: 560px; background: var(--ink); color: #fff; padding: 16px 20px; border-radius: 18px 18px 6px 18px; font-size: 20px; line-height: 1.4; }
.ca { margin-top: 20px; background: #F5F6F8; border-radius: 18px 18px 18px 6px; padding: 18px 20px; font-size: 20px; line-height: 1.5; min-height: 150px; }
.ca .cite { display: inline-flex; gap: 8px; align-items: center; margin-top: 14px; background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 8px 12px; font-size: 15px; font-weight: 700; }
.mapc { left: 930px; top: 170px; width: 880px; height: 600px; padding: 28px; }
.mapc .stats { display: flex; gap: 14px; margin-top: 16px; }
.mapc .stats div { flex: 1; border: 1px solid var(--line); border-radius: 14px; padding: 12px 16px; }
.mapc .stats small { font-size: 12px; font-weight: 800; letter-spacing: .1em; color: var(--muted); }
.mapc .stats b { display: block; font-size: 32px; letter-spacing: -0.03em; }

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
  <div class="dw abs">${appWindow({ crumb: 'Policy Studio · Draft', body: `<div class="ed-body">${stages(0, ['Drafting with Gemini…', 'Not checked yet', 'No A/B projection'])}
    <div class="paper"><div class="paper-in">
      <div class="p-top"><span class="chip red">DRAFT FOR REVIEW</span><span class="chip ptype">${ic('landmark', 15)}<span class="ptn">Peraturan Pemerintah</span></span><span class="chip pver">v1</span></div>
      <div class="p-h p-h1 ph1">RANCANGAN<br>PERATURAN PEMERINTAH REPUBLIK INDONESIA<br>NOMOR … TAHUN 2026</div>
      <div class="p-h p-h2 ph2">TENTANG<br>LAYANAN PUBLIK DIGITAL ADMINISTRASI KEPENDUDUKAN YANG INKLUSIF</div>
      <div class="p-sec ps1"><b>Menimbang:</b> a. bahwa negara berkewajiban melayani setiap warga negara dalam memenuhi hak administrasi kependudukan; b. bahwa pemanfaatan aplikasi digital harus menjamin aksesibilitas bagi seluruh warga;</div>
      <div class="p-sec ps2"><b>Mengingat:</b> 1. Pasal 5 ayat (2) UUD 1945; 2. Undang-Undang Nomor 25 Tahun 2009 tentang Pelayanan Publik; 3. Undang-Undang Nomor 8 Tahun 2016 tentang Penyandang Disabilitas;</div>
      ${PASAL.map((p, i) => `<div class="pas pas${i}"><h4><span>Pasal ${i + 1}</span><span class="pst"></span></h4><p>${p}</p></div>`).join('')}
    </div></div>
    <div class="gem panel"><h3>${ic('sparkles', 20)} Gemini drafting</h3>
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
  const p2 = q('.pas1'), p2t = q('.pas1 p');
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
    const cx = 160 + 250 + 22 + 1 + p2.offsetLeft + p2.offsetWidth / 2;
    const cy = 56 + 64 + 116 + 1 + p2.offsetTop - scroll + p2.offsetHeight / 2;
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
    [[tSend + 0.4, tOff], [tOff, tCon], [tCon, tGr]].forEach(([a, b], i) => {
      gsteps[i].innerHTML = t < a ? '<span style="width:20px;height:20px;border-radius:50%;border:2px solid #e5e7eb;display:inline-block"></span>' : t < b ? '<span class="spin"></span>' : `<span class="ok-ic">${ic('check', 13, 3)}</span>`;
    });
    st(q('.gk'), { o: P(t, tGr - 0.1, 0.4) });
    gchips.forEach((c, i) => { const a = P(t, tGr + i * 0.12, 0.45, Ez.back); st(c, { s: a, o: a }); });
    q('.stg-sub-0').textContent = t < tGr + 0.4 ? 'Drafting with Gemini…' : t < tSave + 0.3 ? 'Draft v1' : 'Draft v2 · saved';
    // the edit: select, retype as "digital only"
    if (t < tSel) { p2t.textContent = PASAL[1]; p2.classList.remove('warn'); }
    else if (t < tRe) p2t.innerHTML = `<mark>${PASAL[1]}</mark>`;
    else { p2t.textContent = typed(PASAL2_NEW, P(t, tRe, 1.3, Ez.lin)) || ' '; p2.classList.add('warn'); }
    const gl = Math.min(P(t, tRe + 0.4, 0.5, Ez.back), 1 - P(t, tSave + 0.8, 0.3));
    st(q('.gl2w'), { y: 368, s: lerp(0.9, 1, gl), o: gl });
    const kk = Math.min(P(t, tSave, 0.35, Ez.back), 1 - P(t, tSave + 0.8, 0.3));
    st(q('.keys'), { x: 1580, y: 190, s: kk, o: kk });
    q('.pver').textContent = t < tSave + 0.3 ? 'v1' : 'v2';
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
      <div class="pn n2" style="left:700px"><div class="pi">${ic('landmark', 26)}</div><b>Legal corpus</b><small>JDIH · official sources</small><div class="big c12k">0</div><small>regulations indexed</small></div>
      <div class="pn n3" style="left:1050px"><div class="pi">${ic('users', 26)}</div><b>Specialist agents</b>${['Hierarchy', 'Rights & access', 'Procedure', 'Drafting technique'].map(a => `<div class="ag"><span class="ags"></span>${a}</div>`).join('')}</div>
      <div class="pn n4" style="left:1400px"><div class="pi">${ic('shield-check', 26)}</div><b>Citation guard</b><small>Every quote matched to source text</small><div class="big"><span class="cg">0</span><small style="display:inline"> / 12 checked</small></div></div>
      ${[0, 1, 2, 3].map(i => `<div class="conn" style="left:${300 + i * 350}px"></div><div class="pkt pk${i}" style="left:${300 + i * 350}px"></div>`).join('')}
    </div></div>
  <div class="ph-c"><div class="dw abs">${appWindow({ crumb: 'Policy Studio · Verify sources', body: `<div class="ed-body">${stages(1, ['Draft v2', 'Analyzing…', 'No A/B projection'])}
    <div class="met">${[['circle-alert', 'Potential issues', '3', 'Needs review, not a verdict', 'm0'], ['book-open', 'Sources reviewed', '27', 'Articles + related context', 'm1'], ['file-check', 'Draft version', 'v2', 'Matches current draft', 'm2']].map(([i, k, v, e, c]) => `<div><small>${k.toUpperCase()}${ic(i, 16)}</small><div class="v ${c}">${v}</div><em>${e}</em></div>`).join('')}</div>
    <div class="flist" style="position:absolute;left:0;right:0;top:250px">
      ${FINDINGS.map(([c, l, a, h], i) => `<div class="fd f${i}"><div class="fd-h"><span class="tag ${c}">${l}</span><h3>${h}</h3><span class="chip">Pasal ${a}</span></div>
      ${i === 0 ? `<div class="fd-b"><p>A single digital channel denies service to applicants without connectivity or digital skills. UU 25/2009 requires special treatment for certain groups; UU 8/2016 guarantees reasonable accommodation.</p>
        <div class="cols"><div class="q-old"><small>DRAFT · V2</small>${PASAL2_NEW.replace('\n', '<br>')}</div><div class="q-new"><small>PROPOSED FOR REVIEW</small>(1) Permohonan dapat diajukan melalui aplikasi digital atau kanal pendampingan.<br>(2) Penyelenggara menyediakan bantuan dan akomodasi yang layak bagi pemohon yang mengalami hambatan akses.</div></div>
        <div class="srcs"><span class="chip blue">${ic('book-open', 14)}UU 25/2009 · Pasal 29</span><span class="chip blue">${ic('book-open', 14)}UU 8/2016 · Pasal 19</span><span style="flex:1"></span><span class="btn pri apb">${ic('check', 16, 3)}Apply proposal to draft</span></div></div>` : ''}</div>`).join('')}
    </div>
    <div class="drawer"><h3>${ic('fingerprint', 22)} Source evidence <span style="flex:1"></span><span class="chip green gchip">${ic('shield-check', 14)}<span class="gtx">Citation guard</span></span></h3>
      <div class="sc s0"><div class="sh">${ic('scale', 18)} UU 25/2009 · Pasal 29 ayat (1)</div><div class="qt">“Penyelenggara berkewajiban memberikan pelayanan dengan perlakuan khusus kepada anggota masyarakat tertentu sesuai dengan peraturan perundang-undangan.”</div><div class="gl">Providers must give special treatment to certain members of the public.</div><div class="meta"><span>HTML · peraturan.go.id</span><span class="sha">SHA256 244cbe9a0ae056d2…</span></div><div class="vstamp">${ic('check', 13, 3)}Verified</div></div>
      <div class="sc s1"><div class="sh">${ic('scale', 18)} UU 8/2016 · Pasal 19</div><div class="qt">“…memperoleh Akomodasi yang Layak dalam Pelayanan Publik secara optimal, wajar, bermartabat tanpa Diskriminasi…”</div><div class="gl">Right to reasonable accommodation in public services, without discrimination.</div><div class="meta"><span>PDF · page 14</span><span class="sha">SHA256 cae383fd43c9f313…</span></div><div class="vstamp">${ic('check', 13, 3)}Verified</div></div>
      <div class="sc s2"><div class="sh">${ic('scale', 18)} UU 25/2009 · Pasal 87 ayat (4)</div><div class="qt">“Setiap penyelenggara wajib menyediakan kanal luring…”</div><div class="meta"><span>cited by model</span></div><div class="xstamp">✕ NOT IN EVIDENCE · REJECTED</div></div>
    </div>
    <div class="note"><div style="display:flex;gap:10px;align-items:center"><b style="font-size:15px">Reviewer</b><span class="chip amber">Reviewed with notes</span></div><div class="nt"></div></div>
  </div>` })}</div></div>
  ${cursorEl()}
</div></div>`, ({ q, qa, sc }) => {
  const V = [0, 1, 2, 3, 4, 5, 6].map(i => LN('review', i));
  const tHyb = W('review', 'hybrid'), tEF = W('review', 'twelve'), tSpec = W('review', 'specialist'), tEach = W('review', 'each');
  const tThree = W('review', 'three'), tFind = W('review', 'findings'), tFp = W('review', 'fingerprint'), tRej = W('review', 'rejected'), tClick = W('review', 'click'), tVer = W('review', 'version', tClick);
  const A0 = sc.start, B0 = V[1].t - 0.3, C0 = V[2].t - 0.45;
  cue(sc.start, 'whoosh'); cue(V[0].t, 'scan', { d: 1.6 }); cue(B0, 'whoosh'); [tHyb, tEF, tSpec, tEach].forEach(t => cue(t, 'tick'));
  cue(C0, 'whoosh'); cue(tThree, 'pop'); [0, 1, 2].forEach(i => cue(tFind + i * 0.15, 'tick')); cue(V[3].t - 0.2, 'whoosh'); cue(V[4].t - 0.2, 'whoosh');
  cue(tFp, 'pop'); cue(V[5].t, 'pop'); cue(tRej, 'stamp'); cue(V[6].t - 0.3, 'whoosh'); cue(tClick, 'click'); cue(tVer, 'pop');
  const pa = q('.ph-a'), pb = q('.ph-b'), pc = q('.ph-c'), win = q('.ph-c .dw');
  const rows = qa('.dm-row'), sts = qa('.dm-st'), beam = q('.beam');
  const nodes = qa('.pn'), conns = qa('.conn'), pkts = qa('.pkt'), ags = qa('.ags');
  const fds = [q('.f0'), q('.f1'), q('.f2')], fb = q('.f0 .fd-b');
  const drawer = q('.drawer'), scs = [q('.s0'), q('.s1'), q('.s2')], note = q('.note'), cur = q('.cursor');
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
    q('.c12k').textContent = fmt(12000 * k12) + (k12 >= 1 ? '+' : '');
    ags.forEach((a, i) => { const s0 = tSpec + 0.1 + i * 0.12, s1 = tEach + 0.2 + i * 0.25; a.innerHTML = t < s0 ? '<span style="width:16px;height:16px;border-radius:50%;border:2px solid #e5e7eb;display:inline-block"></span>' : t < s1 ? '<span class="spin"></span>' : `<span class="ok-ic">${ic('check', 11, 3)}</span>`; });
    q('.cg').textContent = fmt(12 * P(t, tEach + 0.3, C0 - tEach - 0.3, Ez.lin));
    q('.tmr').textContent = '00:' + String(Math.round(47 * P(t, B0, C0 - B0, Ez.lin))).padStart(2, '0');
    // C — results in the app
    const cin = P(t, C0, 0.7, Ez.out5);
    st(pc, { o: cin, y: (1 - cin) * 140, blur: (1 - cin) * 16 });
    q('.stg-sub-1').textContent = t < tThree ? 'Analyzing…' : '3 findings · v2';
    q('.m0').textContent = fmt(3 * P(t, tThree - 0.1, 0.5));
    q('.m1').textContent = fmt(27 * P(t, tThree - 0.1, 0.8));
    // findings: drop in, then #1 expands
    const ex = P(t, V[3].t - 0.25, 0.7, Ez.io);
    const h0 = 66 + ex * (fb.scrollHeight + 4);
    fds[0].style.height = h0 + 'px';
    let y = 0;
    fds.forEach((f, i) => {
      const a = P(t, tFind - 0.05 + i * 0.15, 0.5, Ez.back);
      st(f, { y: y + (1 - a) * 40, o: P(t, tFind - 0.05 + i * 0.15, 0.3) * (i ? lerp(1, 0.5, ex) : 1) });
      f.style.top = '0px';
      y += (i === 0 ? h0 : 66) + 12;
      if (i) f.style.height = '66px';
    });
    // drawer with verified sources, then a rejected citation
    const dr = Math.min(P(t, V[4].t - 0.25, 0.6, Ez.out5), 1 - P(t, V[6].t - 0.3, 0.5, Ez.in));
    st(drawer, { x: (1 - dr) * 640, o: dr > 0 ? 1 : 0 });
    scs.forEach((s, i) => { const a = P(t, (i < 2 ? V[4].t + i * 0.25 : V[5].t - 0.1), 0.5, Ez.out5); st(s, { x: (1 - a) * 60, o: a }); });
    const fp = P(t, tFp - 0.05, 0.4, Ez.back);
    qa('.sha').forEach(s => s.classList.toggle('hl', fp > 0));
    qa('.vstamp').forEach(v => st(v, { s: fp, o: fp }));
    const rj = P(t, tRej - 0.1, 0.35, Ez.back);
    scs[2].classList.toggle('bad', rj > 0);
    st(q('.xstamp'), { s: lerp(1.6, 1, rj), o: rj, rz: -6 });
    const col = P(t, tRej + 0.9, 0.5, Ez.io);
    scs[2].style.maxHeight = (1 - col) * 220 + 'px';
    scs[2].style.marginTop = (1 - col) * 14 + 'px';
    if (col >= 1) scs[2].style.opacity = 0;
    q('.gtx').textContent = t < V[4].t ? 'Citation guard' : t < tRej ? `${fmt(2 + 9 * P(t, V[4].t, 1.5, Ez.lin))} verified` : '11 verified · 1 rejected';
    // reviewer applies the fix
    const nIn = Math.min(P(t, V[6].t - 0.1, 0.5, Ez.out5), 1);
    st(note, { x: 700, y: 676 + (1 - nIn) * 30, o: nIn });
    q('.nt').textContent = typed('Keep an assisted channel; align with UU 8/2016 Art. 19.', P(t, V[6].t + 0.1, 1.3, Ez.lin));
    cursorAt(cur, t, [{ t: V[6].t + 0.2, x: 1450, y: 820 }, { t: tClick, x: 1600, y: 645, click: true }]);
    camFrame(q('.cam'), t, [{ t: 0, x: 960, y: 540, z: 1 }, { t: tFind - 0.2, x: 1085, y: 520, z: 1.25 }, { t: V[3].t - 0.25, x: 1085, y: 585, z: 1.45 }, { t: V[4].t - 0.3, x: 1300, y: 540, z: 1.38 }, { t: V[6].t - 0.3, x: 1300, y: 640, z: 1.4 }, { t: sc.end - 1.2, x: 1085, y: 540, z: 1.15 }]);
    const ap = P(t, tClick + 0.1, 0.4, Ez.out5);
    const oldQ = q('.q-old');
    oldQ.style.textDecoration = ap > 0 ? 'line-through' : 'none';
    oldQ.style.opacity = lerp(1, 0.55, ap);
    st(q('.apb'), { s: Math.abs(t - tClick) < 0.12 ? 0.92 : 1 });
    q('.apb').innerHTML = ap > 0 ? `${ic('check', 16, 3)}Applied · v3` : `${ic('check', 16, 3)}Apply proposal to draft`;
    q('.apb').style.background = ap > 0 ? 'var(--green)' : '';
    q('.apb').style.borderColor = ap > 0 ? 'var(--green)' : '';
    q('.m2').textContent = t < tVer - 0.1 ? 'v2' : 'v3';
    st(q('.m2'), { s: t > tVer - 0.1 && t < tVer + 0.25 ? 1.2 : 1 });
  };
});

/* =============================== 6 · IMPACT =============================== */
const ASM = [['Applicants', '2,500', 'people'], ['Digital access', '70', '%'], ['Assisted success', '80', '%'], ['Digital cost', '20,000', 'Rp / case'], ['Assisted cost', '50,000', 'Rp / case'], ['Staff capacity', '40', 'cases / day']];
const CL = [['Access', '#C8102E'], ['Accommodation', '#6D4AD6'], ['Cost', '#B7791F'], ['Capacity', '#2F5BD3'], ['Implementation', '#1E8E4F'], ['Accountability', '#0E7490']];
const FEAT = { 0: ['Sari', 'Village resident (3T)', 'SA'], 1: ['Nadia', 'Blind citizen', 'NA'], 2: ['Dewi', 'Budget analyst', 'DE'], 3: ['Bima', 'Counter officer', 'BI'] };
const QUOTES = [
  ['NA', 'Nadia', 'Blind citizen · Accommodation', '#6D4AD6', '“If the app fails my screen reader, Draft A means I can’t renew my ID. Draft B keeps a door open.”', 'blind'],
  ['BI', 'Bima', 'Counter officer · Capacity', '#2F5BD3', '“B is workable, if we get about 15 extra staff-days a month at the counter.”', 'counter'],
  ['DE', 'Dewi', 'Budget analyst · Cost', '#B7791F', '“B costs Rp30M more. Still cheaper than a wave of appeals and complaints.”', 'budget'],
  ['SA', 'Sari', 'Village resident · Access', '#C8102E', '“There’s no signal in my village. Draft A is a wall; Draft B is a path.”', 'clustered']];
scene('impact', `<div class="whip"><div class="cam">
  <div class="im-a"><div class="im-head mega abs"><div class="l1">Test it on people<span class="red">.</span></div><div class="l2" style="color:var(--muted)">Before they meet it.</div></div></div>
  <div class="im-b"><div class="dw abs">${appWindow({ crumb: 'Policy Studio · Test impact', body: `<div class="ed-body">${stages(2, ['Draft v3', '3 findings · resolved', 'A/B projection'])}
    <div class="asm panel"><h3>Scenario assumptions</h3>${ASM.map(([l, v, u], i) => `<div class="fld f${i}"><small>${l}</small><div><b class="av">${v}</b><span>${u}</span></div></div>`).join('')}</div>
    <div class="scn panel sa" style="left:424px"><div class="lbl"><span class="tag high">A</span>Digital only · v2</div><div class="pct"><span class="pa">0</span>%<small>served</small></div><div class="bar"><i class="ba" style="background:var(--red)"></i></div><div class="ft fa">1,750 served · <b style="color:var(--red2)">750 left out</b></div></div>
    <div class="scn panel sb" style="left:882px"><div class="lbl"><span class="tag ok">B</span>Digital + assisted channel</div><div class="pct"><span class="pb">0</span>%<small>served</small></div><div class="bar"><i class="bbb" style="background:var(--green)"></i></div><div class="ft fb">2,350 served · <b style="color:var(--green)">150 left out</b></div></div>
    <div class="mini panel mi0" style="left:424px"><small>VARIABLE COST</small><div class="v">Rp 35.0M → 65.0M</div><em>A → B, per intake cycle</em></div>
    <div class="mini panel mi1" style="left:731px"><small>ASSISTED WORKLOAD</small><div class="v">15 staff-days</div><em>600 cases ÷ 40 per day</em></div>
    <div class="mini panel mi2" style="left:1038px"><small>SENSITIVITY ±10 PTS</small><div class="v" style="font-size:22px">A 60–80% · B 92–96%</div><em>Digital access 60% / 80%</em></div>
    <div class="formula panel">${ic('shield-check', 20)}<span>Assumption-based model</span><code>served = N·p + N·(1−p)·q</code><span style="color:var(--muted)">no LLM arithmetic</span></div>
    <div class="boom">+600 people served</div>
  </div>` })}</div></div>
  <div class="im-c">
    <div class="nw-k abs"><span class="kicker">Public forum simulation</span><span class="chip dark">${ic('users', 15)}32 synthetic personas × 5 rounds</span><span class="chip">Draft A / B</span></div>
    <div class="nw-cnt abs"><div><small>ROUND</small><b class="rnd">1 / 5</b></div><div><small>RESPONSES</small><b class="rsp">0</b></div></div>
    <svg class="nw-svg" width="1360" height="800" viewBox="0 0 1360 800"></svg>
    <div class="insp abs">${QUOTES.map(([a, n, r, c, tx]) => `<div class="qc"><div class="who"><div class="av" style="background:${c}">${a}</div><div><b>${n}</b><small>${r}</small></div></div><p>${tx}</p><div class="rt"><span class="chip">${ic('message-square', 14)}Round ${3 + (a.length % 2)}</span><span class="chip blue">${ic('book-open', 14)}Cites UU 25/2009</span></div></div>`).join('')}
      <div class="stance"><h4>STANCE AFTER ROUND 5</h4>
        <div class="srow"><b>Draft A · digital only</b><div class="sbar"><i class="sA0" style="background:var(--green)"></i><i class="sA1" style="background:#E3B341"></i><i class="sA2" style="background:var(--red)"></i></div></div>
        <div class="srow"><b>Draft B · assisted channel</b><div class="sbar"><i class="sB0" style="background:var(--green)"></i><i class="sB1" style="background:#E3B341"></i><i class="sB2" style="background:var(--red)"></i></div></div>
        <div class="slg"><span style="--c:var(--green)">Support</span><span style="--c:#E3B341">Conditional</span><span style="--c:var(--red)">Object</span></div></div></div>
    <div class="disc abs">${ic('circle-alert', 16)} Synthetic personas: not a survey, and not a substitute for public consultation.</div>
  </div>
</div></div>`, ({ q, qa, sc }) => {
  const I = [0, 1, 2, 3, 4, 5, 6].map(i => LN('impact', i));
  const tSev = W('impact', 'seventy'), tNin = W('impact', 'ninetyfour'), tSix = W('impact', 'six'), tCost = W('impact', 'cost'), tStaff = W('impact', 'staff');
  const tBlind = W('impact', 'blind'), tCounter = W('impact', 'counter'), tBudget = W('impact', 'budget'), tFive = W('impact', 'five'), tClus = W('impact', 'clustered');
  const B0 = I[1].t - 0.35, C0 = I[5].t - 0.45;
  cue(sc.start, 'whoosh'); cue(B0, 'whoosh'); cue(tSev, 'count', { d: 1.1 }); cue(tNin, 'count', { d: 1.1 }); cue(tSix, 'pop'); cue(C0, 'whoosh');
  [tBlind, tCounter, tBudget, tClus].forEach(t => cue(t, 'pop')); cue(I[6].t, 'swell');
  // network geometry (deterministic)
  const R = rnd(7), svg = q('.nw-svg');
  const cx = 690, cy = 400;
  const hubs = CL.map((c, i) => { const a = -Math.PI / 2 + (i / 6) * Math.PI * 2; return { x: cx + Math.cos(a) * 430, y: cy + Math.sin(a) * 285, c: c[1], name: c[0] }; });
  const persons = [];
  for (let i = 0; i < 32; i++) {
    const h = i % 6, hub = hubs[h], k = Math.floor(i / 6), n = Math.ceil((32 - h) / 6);
    const a = -Math.PI / 2 + (h / 6) * Math.PI * 2 + (k - (n - 1) / 2) * 0.62;
    persons.push({ i, h, x: hub.x + Math.cos(a) * 112 + (R() - 0.5) * 16, y: hub.y + Math.sin(a) * 92 + (R() - 0.5) * 16, c: hub.c, t: 0 });
  }
  const feat = { 0: 0, 1: 1, 2: 2, 3: 3 };
  const replies = Array.from({ length: 46 }, (_, k) => { const a = Math.floor(R() * 32); let b = Math.floor(R() * 32); if (b === a) b = (b + 7) % 32; return [a, b, k]; });
  const sats = [];
  persons.forEach(p => { for (let r = 0; r < 5; r++) { const a = R() * Math.PI * 2; sats.push({ p, r, x: p.x + Math.cos(a) * 30, y: p.y + Math.sin(a) * 30 }); } });
  svg.innerHTML = `
    <g class="halos">${hubs.map(h => `<circle cx="${h.x}" cy="${h.y}" r="150" fill="${h.c}" fill-opacity=".05" stroke="${h.c}" stroke-opacity=".18" stroke-dasharray="4 8"/>`).join('')}</g>
    <g class="spokes">${hubs.map(h => `<line x1="${cx}" y1="${cy}" x2="${h.x}" y2="${h.y}" stroke="#D5D7DC" stroke-width="2"/>`).join('')}</g>
    <g class="links">${persons.map(p => `<line x1="${hubs[p.h].x}" y1="${hubs[p.h].y}" x2="${p.x}" y2="${p.y}" stroke="${p.c}" stroke-opacity=".35" stroke-width="1.5"/>`).join('')}</g>
    <g class="replies">${replies.map(([a, b]) => { const A = persons[a], B = persons[b], mx = (A.x + B.x) / 2 + (cy - (A.y + B.y) / 2) * 0.25, my = (A.y + B.y) / 2 + ((A.x + B.x) / 2 - cx) * 0.25; return `<path d="M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}" fill="none" stroke="${A.c}" stroke-opacity=".45" stroke-width="1.6"/>`; }).join('')}</g>
    <g class="sats">${sats.map(s => `<circle cx="${s.x}" cy="${s.y}" r="5" fill="${s.p.c}" fill-opacity=".55"/>`).join('')}</g>
    <g class="hubs">${hubs.map(h => `<g><circle cx="${h.x}" cy="${h.y}" r="30" fill="#fff" stroke="${h.c}" stroke-width="3"/><text x="${h.x + (h.x >= cx ? 150 : -150)}" y="${h.y + 7}" text-anchor="${h.x >= cx ? 'start' : 'end'}" font-size="19" font-weight="800" fill="${h.c}">${h.name}</text></g>`).join('')}</g>
    <g class="pers">${persons.map(p => `<g><circle cx="${p.x}" cy="${p.y}" r="19" fill="${p.c}"/><text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fff">${FEAT[p.i] ? FEAT[p.i][2] : String.fromCharCode(65 + (p.i * 7) % 26) + String.fromCharCode(65 + (p.i * 11) % 26)}</text>${FEAT[p.i] ? `<text x="${p.x}" y="${p.y + 40}" text-anchor="middle" font-size="15" font-weight="800" fill="#111">${FEAT[p.i][0]}</text>` : ''}</g>`).join('')}</g>
    <g class="center"><circle cx="${cx}" cy="${cy}" r="62" fill="#111"/><text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="19" font-weight="800" fill="#fff">Draft</text><text x="${cx}" y="${cy + 22}" text-anchor="middle" font-size="15" font-weight="700" fill="#ff8a9b">A / B</text></g>
    <g class="ring"><circle cx="${cx}" cy="${cy}" r="30" fill="none" stroke="#111" stroke-width="2"/></g>
    <g class="focus"><circle r="34" fill="none" stroke="#111" stroke-width="3"/></g>`;
  const gHub = [...svg.querySelectorAll('.hubs > g')], gPer = [...svg.querySelectorAll('.pers > g')], gLink = [...svg.querySelectorAll('.links line')];
  const gRep = [...svg.querySelectorAll('.replies path')], gSat = [...svg.querySelectorAll('.sats circle')], gHalo = [...svg.querySelectorAll('.halos circle')];
  const ring = svg.querySelector('.ring circle'), focus = svg.querySelector('.focus circle');
  const roundT = r => lerp(I[5].t + 2.6, sc.end - 2.4, r / 5);
  persons.forEach((p, k) => (p.t = I[5].t + 0.2 + k * 0.07));
  const qcs = qa('.qc'), qTimes = QUOTES.map(qq => W('impact', qq[5]) - 0.2);
  const fe = { blind: 1, counter: 3, budget: 2, clustered: 0 };
  return t => {
    whip(q('.whip'), t, sc, { enter: true });
    const ab = P(t, B0, 0.45, Ez.in);
    const ain = P(t, sc.start + 0.05, 0.6, Ez.out5);
    st(q('.im-a'), { o: Math.min(ain, 1 - ab), y: -ab * 120, blur: ab * 14 });
    st(q('.im-head .l1'), { y: (1 - ain) * 50 });
    const l2 = P(t, I[0].t + 0.8, 0.6, Ez.out5); st(q('.im-head .l2'), { y: (1 - l2) * 40, o: l2 });
    // B — A/B projection
    const bin = P(t, B0, 0.6, Ez.out5), bout = P(t, C0, 0.45, Ez.in);
    st(q('.im-b'), { o: Math.min(bin, 1 - bout), y: (1 - bin) * 130 - bout * 130, blur: (1 - bin) * 16 + bout * 16 });
    qa('.asm .fld').forEach((f, i) => { const a = P(t, I[1].t + i * 0.12, 0.4, Ez.out5); st(f, { o: a, x: (1 - a) * 20 }); });
    const pa = P(t, tSev - 0.2, 1.1, Ez.out), pb = P(t, tNin - 0.2, 1.1, Ez.out);
    q('.pa').textContent = Math.round(70 * pa); q('.ba').style.width = 70 * pa + '%';
    q('.pb').textContent = Math.round(94 * pb); q('.bbb').style.width = 94 * pb + '%';
    st(q('.sa'), { o: P(t, I[1].t + 0.3, 0.4), y: (1 - P(t, I[1].t + 0.3, 0.6, Ez.out5)) * 30 });
    st(q('.sb'), { o: P(t, I[1].t + 0.45, 0.4), y: (1 - P(t, I[1].t + 0.45, 0.6, Ez.out5)) * 30 });
    q('.fa').style.opacity = P(t, tSev + 0.7, 0.4); q('.fb').style.opacity = P(t, tNin + 0.7, 0.4);
    const bm = P(t, tSix - 0.15, 0.5, Ez.back); st(q('.boom'), { x: 1050, y: 128, s: bm, o: bm });
    st(q('.mi0'), { o: P(t, tCost - 0.1, 0.4), y: (1 - P(t, tCost - 0.1, 0.5, Ez.out5)) * 20 });
    st(q('.mi1'), { o: P(t, tStaff - 0.1, 0.4), y: (1 - P(t, tStaff - 0.1, 0.5, Ez.out5)) * 20 });
    st(q('.mi2'), { o: P(t, tStaff + 0.4, 0.4) });
    st(q('.formula'), { o: P(t, tStaff + 0.7, 0.5) });
    camFrame(q('.cam'), t, [{ t: 0, x: 960, y: 540, z: 1 }, { t: I[1].t - 0.1, x: 900, y: 520, z: 1.28 }, { t: tSev - 0.45, x: 1240, y: 470, z: 1.32 }, { t: tCost - 0.35, x: 1240, y: 590, z: 1.3 }, { t: C0 - 0.15, x: 960, y: 540, z: 1, d: 0.5 }]);
    // C — forum network
    const cin = P(t, C0, 0.7, Ez.out5);
    st(q('.im-c'), { o: cin, y: (1 - cin) * 130, blur: (1 - cin) * 16 });
    const hubIn = P(t, I[5].t - 0.2, 0.6, Ez.out5);
    gHub.forEach((g, i) => { const a = P(t, I[5].t - 0.2 + i * 0.08, 0.5, Ez.back); g.style.opacity = a; g.setAttribute('transform', `translate(${hubs[i].x * (1 - a)} ${hubs[i].y * (1 - a)}) scale(${a})`); });
    svg.querySelector('.spokes').style.opacity = hubIn;
    persons.forEach((p, k) => { const a = P(t, p.t, 0.45, Ez.back); gPer[k].style.opacity = P(t, p.t, 0.2); gPer[k].setAttribute('transform', `translate(${p.x * (1 - a)} ${p.y * (1 - a)}) scale(${a})`); gLink[k].style.opacity = P(t, p.t, 0.4); });
    let round = 0; for (let r = 1; r <= 5; r++) if (t >= roundT(r - 1)) round = r;
    q('.rnd').textContent = `${Math.max(1, round)} / 5`;
    const respP = P(t, roundT(0), roundT(5) - roundT(0), Ez.lin);
    q('.rsp').textContent = fmt(320 * respP);
    gSat.forEach((s, i) => { const sat = sats[i]; s.style.opacity = P(t, roundT(sat.r) + (sat.p.i / 32) * (roundT(1) - roundT(0)) * 0.9, 0.3); });
    gRep.forEach((r, i) => (r.style.opacity = P(t, roundT(0) + (i / gRep.length) * (roundT(5) - roundT(0)), 0.4)));
    const pulse = P(t, tClus - 0.2, 0.8);
    gHalo.forEach(h => h.setAttribute('r', 150 + 14 * Math.sin(pulse * Math.PI)));
    const rp = ((t - I[5].t) * 0.7) % 1; ring.setAttribute('r', 62 + rp * 70); ring.style.opacity = t > I[5].t ? (1 - rp) * 0.5 : 0;
    // quote cards + focus ring on the speaking persona
    let active = -1; qTimes.forEach((qt, i) => { if (t >= qt) active = i; });
    qcs.forEach((c, i) => { const a = i === active ? P(t, qTimes[i], 0.5, Ez.out5) : 0; const prev = i === active - 1 ? 1 - P(t, qTimes[active], 0.35, Ez.in) : 0; const v = Math.max(a, prev); st(c, { y: (1 - a) * 30 - prev * 30, o: v, blur: (1 - v) * 8 }); });
    if (active >= 0) { const p = persons[fe[QUOTES[active][5]]]; focus.setAttribute('cx', p.x); focus.setAttribute('cy', p.y); focus.style.opacity = P(t, qTimes[active], 0.3); focus.setAttribute('r', 30 + 4 * Math.sin(t * 6)); } else focus.style.opacity = 0;
    const sb = P(t, I[6].t + 1.2, 0.8, Ez.out5);
    st(q('.stance'), { o: sb, y: (1 - sb) * 30 });
    [['A', [18, 46, 36]], ['B', [64, 31, 5]]].forEach(([k, v]) => v.forEach((x, i) => (q(`.s${k}${i}`).style.width = x * P(t, I[6].t + 1.4 + i * 0.1, 0.9) + '%')));
    q('.disc').style.opacity = P(t, I[6].t, 0.6);
  };
});

/* =============================== 7 · OUTCOME =============================== */
const AUDIT = [['09:02', 'Brief → Draft v1', 'Gemini · 6 articles'], ['09:04', 'Article 2 edited → v2', 'Drafter'], ['09:05', 'Source review · 3 findings', '4 agents · 11 citations verified'], ['09:06', 'Proposal applied → v3', 'Reviewer note attached'], ['09:08', 'A/B projection', '70% → 94% served'], ['09:11', 'Public forum', '32 personas · 320 responses'], ['09:12', 'Exported', '2 DOCX files']];
scene('outcome', `<div class="whip"><div class="cam">
  <div class="kicker abs" style="left:150px;top:70px">Output</div>
  <div class="pg pgA" style="left:150px;top:150px"><div class="ph">RANCANGAN<br>PERATURAN PEMERINTAH<br>REPUBLIK INDONESIA</div><div class="ph" style="font-size:15px;margin-top:10px">TENTANG LAYANAN PUBLIK DIGITAL<br>ADMINISTRASI KEPENDUDUKAN YANG INKLUSIF</div>
    <div class="pt">Menimbang</div><div class="pl"></div><div class="pl" style="width:80%"></div><div class="pt">Pasal 1</div><div class="pl"></div><div class="pl" style="width:70%"></div><div class="pt">Pasal 2</div><div class="pl" style="background:#d6efdf"></div><div class="pl" style="width:86%;background:#d6efdf"></div><div class="pt">Pasal 3</div><div class="pl" style="width:76%"></div>
    <div class="fname"><span>${ic('download', 18)}RPP_Digital_Services_v3.docx</span></div></div>
  <div class="pg pgB" style="left:560px;top:190px"><div style="font-weight:800;font-size:22px">Review Report</div><div style="font-size:14px;color:var(--muted);margin-top:4px">Draft v3 · 3 findings · 11 verified citations</div>
    ${FINDINGS.map(([c, l, a, h]) => `<div style="display:flex;gap:10px;align-items:center;margin-top:18px"><span class="tag ${c}">${l}</span><b style="font-size:14px">Pasal ${a}</b></div><div style="font-size:14px;margin-top:6px">${h}</div><div class="pl" style="width:90%"></div>`).join('')}
    <div class="pt">Sources</div><div class="pl" style="width:70%"></div><div class="pl" style="width:60%"></div>
    <div class="fname"><span>${ic('download', 18)}Review_Report_v3.docx</span></div></div>
  <div class="audit card"><h3>${ic('list-checks', 24)} Audit trail</h3>${AUDIT.map(([tm, b, s]) => `<div class="ae"><time>${tm}</time><div style="flex:1"><b>${b}</b><small>${s}</small></div><span class="ok-ic">${ic('check', 12, 3)}</span></div>`).join('')}</div>
</div></div>`, ({ q, qa, sc }) => {
  const O0 = LN('outcome', 0), O1 = LN('outcome', 1);
  const tDraft = W('outcome', 'formatted'), tRep = W('outcome', 'review'), tWord = W('outcome', 'word');
  cue(sc.start, 'whoosh'); cue(tDraft, 'pop'); cue(tRep, 'pop'); cue(tWord, 'tick'); qa('.ae').forEach((_, i) => cue(O1.t + i * 0.16, 'tick'));
  const ents = qa('.ae');
  return t => {
    whip(q('.whip'), t, sc);
    const a = P(t, tDraft - 0.25, 0.8, Ez.out5), b = P(t, tRep - 0.25, 0.8, Ez.out5);
    st(q('.pgA'), { y: (1 - a) * 160, o: a, rz: lerp(-12, -5, a), ry: 14, persp: 2200 });
    st(q('.pgB'), { y: (1 - b) * 160, o: b, rz: lerp(10, 4, b), ry: -10, persp: 2200 });
    qa('.fname').forEach(f => (f.style.opacity = P(t, tWord - 0.1, 0.4)));
    const au = P(t, O0.t + 0.6, 0.7, Ez.out5);
    st(q('.audit'), { x: (1 - au) * 120, o: au });
    ents.forEach((e, i) => { const k = P(t, O1.t - 0.4 + i * 0.16, 0.4, Ez.out5); st(e, { o: k, x: (1 - k) * 24 }); });
  };
});

/* =============================== 8 · PLATFORM =============================== */
scene('platform', `<div class="whip"><div class="cam">
  <div class="chat card"><h3><span class="ni" style="width:42px;height:42px;border-radius:12px;background:var(--violet);color:#fff;display:grid;place-items:center">${ic('book-open', 22)}</span>Legal Library · Assistant</h3>
    <div class="cq">What must agencies provide for people with disabilities?</div>
    <div class="ca"><span class="ans"></span><div class="cite">${ic('scale', 16)}UU 8/2016 · Pasal 19 <span class="chip green" style="padding:3px 8px">${ic('check', 12, 3)}source-verified</span></div></div></div>
  <div class="mapc card"><h3><span class="ni" style="width:42px;height:42px;border-radius:12px;background:var(--blue);color:#fff;display:grid;place-items:center">${ic('map', 22)}</span>Regulation map · Indonesia</h3>
    <svg class="map" width="824" height="${Math.round(824 * GEO.h / GEO.w)}" viewBox="0 0 ${GEO.w} ${GEO.h}" style="margin-top:22px">${GEO.p.map(p => `<path d="${p.d}" fill="#E5E7EB" stroke="#fff" stroke-width="0.8"/>`).join('')}</svg>
    <div class="stats"><div><small>PROVINCES</small><b class="pv">0</b></div><div><small>REGULATIONS</small><b>12,000+</b></div><div><small>SEARCH</small><b>Hybrid RAG</b></div></div></div>
</div></div>`, ({ q, qa, sc }) => {
  const L0 = LN('platform', 0), L1 = LN('platform', 1);
  cue(sc.start, 'whoosh'); cue(L0.t + 0.6, 'type', { d: 1.6 }); cue(L1.t, 'swell');
  const paths = qa('.map path'), order = GEO.p.map((p, i) => [p.cx, i]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  const rank = []; order.forEach((idx, r) => (rank[idx] = r));
  const ans = 'Under UU 8/2016, people with disabilities have the right to reasonable accommodation in public services, plus assistance and accessible facilities at no extra cost.';
  const shades = ['#F6C9D0', '#EE9AA8', '#E2697F', '#C8102E'];
  return t => {
    whip(q('.whip'), t, sc);
    const a = P(t, sc.start + 0.1, 0.7, Ez.out5), b = P(t, L1.t - 0.6, 0.7, Ez.out5);
    st(q('.chat'), { x: (1 - a) * -120, o: a });
    st(q('.mapc'), { x: (1 - b) * 120, o: Math.max(P(t, sc.start + 0.3, 0.6) * 0.0, b) });
    q('.ans').textContent = typed(ans, P(t, L0.t + 0.6, 1.8, Ez.lin));
    q('.cite').style.opacity = P(t, L0.t + 2.4, 0.4);
    const sweep = P(t, L1.t - 0.1, 1.8, Ez.io);
    paths.forEach((p, i) => { const on = sweep * 38 > rank[i]; p.setAttribute('fill', on ? shades[(i * 5) % 4] : '#E5E7EB'); });
    q('.pv').textContent = `${Math.round(38 * sweep)} / 38`;
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
