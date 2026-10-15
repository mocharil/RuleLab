/* Deterministic motion engine: every frame is a pure function of time t (seconds). */
const T = window.TIMELINE;
const SC = Object.fromEntries(T.scenes.map(s => [s.id, s]));
const stage = document.getElementById('stage');
const CUES = (window.CUES = []);

// ---------- math ----------
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, x) => a + (b - a) * x;
const Ez = {
  lin: t => t,
  out: t => 1 - Math.pow(1 - t, 3),
  out5: t => 1 - Math.pow(1 - t, 5),
  in: t => t * t * t,
  io: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  back: t => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  expo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};
/** progress of an animation starting at a lasting d seconds */
const P = (t, a, d = 0.6, e = Ez.out) => e(clamp((t - a) / d));
/** window: 0 before a, ramps in, holds, ramps out after b */
const WIN = (t, a, b, din = 0.4, dout = 0.4) => Math.min(P(t, a, din), 1 - P(t, b, dout, Ez.in));
const fmt = n => Math.round(n).toLocaleString('en-US');
const rnd = seed => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// ---------- timeline lookups ----------
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
/** absolute time of the first spoken `word` in scene `id` after time `after` */
function W(id, word, after = -1) {
  for (const l of SC[id].lines) for (const w of l.words) if (w.t > after && norm(w.w) === word) return w.t;
  console.warn('word not found', id, word);
  return SC[id].start;
}
const LN = (id, i) => SC[id].lines[i];
const LE = (id, i) => SC[id].lines[i].t + SC[id].lines[i].d;

// ---------- DOM helpers ----------
function ic(n, sz = 20, sw = 2) {
  const nodes = window.ICONS[n];
  if (!nodes) { console.warn('icon', n); return ''; }
  return `<svg class="ic" width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${nodes.map(([t, a]) => `<${t} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('')}</svg>`;
}
const logo = (sz = 40) => `<div class="logo-ic" style="width:${sz}px;height:${sz}px"><img src="assets/icon.png" alt=""></div>`;
/** set transform/opacity/filter in one call */
function st(el, o = {}) {
  if (!el) return;
  const { x = 0, y = 0, z = 0, s = 1, sx, sy, rx = 0, ry = 0, rz = 0, o: op, blur, gray, persp } = o;
  let tf = persp ? `perspective(${persp}px) ` : '';
  tf += `translate3d(${x}px,${y}px,${z}px)`;
  if (rx) tf += ` rotateX(${rx}deg)`;
  if (ry) tf += ` rotateY(${ry}deg)`;
  if (rz) tf += ` rotateZ(${rz}deg)`;
  tf += sx != null || sy != null ? ` scale(${sx ?? s},${sy ?? s})` : ` scale(${s})`;
  el.style.transform = tf;
  if (op != null) { el.style.opacity = op; el.style.visibility = op <= 0.001 ? 'hidden' : 'visible'; }
  const f = [];
  if (blur) f.push(`blur(${blur.toFixed(2)}px)`);
  if (gray) f.push(`grayscale(${gray})`);
  el.style.filter = f.join(' ');
}
const show = (el, on) => el && (el.style.display = on ? '' : 'none');
/** reveal first n characters of a string (used for typing) */
const typed = (str, prog) => str.slice(0, Math.round(str.length * clamp(prog)));

// ---------- shared components ----------
const NAV = [['house', 'Overview'], ['square-pen', 'Policy Studio'], ['map', 'Data Dashboard'], ['book-open', 'Legal Library'], ['history', 'Activity']];
function appWindow({ crumb = 'Policy Studio · Draft', active = 1, body = '', cls = '' } = {}) {
  return `<div class="win ${cls}">
    <aside class="side">
      <div class="brand">${logo(40)}<div><b>RuleLab</b><small>INDONESIA</small></div></div>
      <div class="wscard"><div class="av">ID</div><div><b>Workspace Indonesia</b><small>Regulation drafting</small></div></div>
      <div class="navlbl">WORKSPACE</div>
      ${NAV.map(([i, l], k) => `<div class="nav ${k === active ? 'on' : ''}"><span class="ni">${ic(i, 17)}</span>${l}</div>`).join('')}
      <div class="navlbl" style="margin-top:22px">TRUST</div>
      <div class="nav"><span class="ni">${ic('fingerprint', 17)}</span>Source trail</div>
      <div class="nav"><span class="ni">${ic('list-checks', 17)}</span>Audit log</div>
    </aside>
    <div class="main">
      <div class="top"><span class="crumb">Workspace / <b>${crumb}</b></span><span class="sp"></span>
        <span class="chip green"><span class="dot"></span>Gemini · Vertex AI</span>
        <span class="chip">12,000+ regulations</span></div>
      <div class="body">${body}</div>
    </div></div>`;
}
function stages(active, sub = ['Draft v2', 'Not checked yet', 'No A/B projection']) {
  const S = [['square-pen', 'Draft'], ['scan-search', 'Verify sources'], ['chart-column', 'Test impact']];
  return `<div class="stages">${S.map(([i, l], k) => `<div class="stg ${k === active ? 'on' : ''} ${k < active ? 'done' : ''}"><span class="si">${ic(k < active ? 'check' : i, 20)}</span><div><b>${l}</b><small class="stg-sub-${k}">${sub[k]}</small></div><em>0${k + 1}</em></div>`).join('')}</div>`;
}
const CURSOR_SVG = `<svg width="34" height="34" viewBox="0 0 24 24"><path d="M4 2.5 19.5 12l-6.8 1.6L9.6 20z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
const cursorEl = () => `<div class="cursor">${CURSOR_SVG}<div class="ring"></div></div>`;
/** move a cursor through keyframes [{t,x,y,click?}] */
function cursorAt(el, t, keys) {
  if (!el) return;
  let x = keys[0].x, y = keys[0].y, op = 1;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t >= a.t && t <= b.t) { const k = Ez.io((t - a.t) / (b.t - a.t)); x = lerp(a.x, b.x, k); y = lerp(a.y, b.y, k); }
    else if (t > b.t) { x = b.x; y = b.y; }
  }
  const first = keys[0].t, last = keys[keys.length - 1].t;
  op = Math.min(P(t, first - 0.3, 0.3), 1 - P(t, last + 0.6, 0.3));
  let press = 1, ring = 0;
  for (const k of keys) if (k.click) {
    const d = t - k.t;
    if (d > -0.12 && d < 0.18) press = 0.82;
    if (d >= 0 && d < 0.5) ring = d / 0.5;
  }
  st(el, { x, y, s: press, o: op });
  const r = el.querySelector('.ring');
  r.style.opacity = ring ? 1 - ring : 0;
  r.style.transform = `scale(${0.5 + ring})`;
}

// ---------- scene registry ----------
const SCENES = [];
function scene(id, html, setup) {
  const el = document.createElement('section');
  el.className = 'scene';
  el.id = 's-' + id;
  el.innerHTML = html;
  stage.insertBefore(el, document.getElementById('subs'));
  const q = s => el.querySelector(s), qa = s => [...el.querySelectorAll(s)];
  const sc = SC[id];
  SCENES.push({ id, el, start: sc.start, end: sc.end, update: setup({ el, q, qa, sc }) });
}
/** standard enter/exit: motion-blur whip from below, out upwards */
function whip(el, t, sc, { inD = 0.55, outD = 0.45, dist = 140, enter = true, exit = true } = {}) {
  const a = enter ? P(t, sc.start, inD, Ez.out5) : 1;
  const b = exit ? P(t, sc.end - outD, outD, Ez.in) : 0;
  const y = (1 - a) * dist - b * dist;
  const blur = (1 - a) * 18 + b * 18;
  st(el, { y, o: Math.min(a * 1.4, 1 - b * 0.9), blur });
}

// ---------- subtitles ----------
const SUBS = [];
(function buildSubs() {
  for (const s of T.scenes) for (const line of s.lines) {
    // time each written word from the TTS word boundaries (a boundary may span several words)
    const words = line.text.replace(/["“”]/g, '').split(/\s+/).filter(Boolean);
    const toks = line.words.map(w => ({ ...w, n: norm(w.w) }));
    let k = 0, acc = 0;
    const timed = words.map(word => {
      const n = norm(word);
      const tok = toks[Math.min(k, toks.length - 1)] || { t: line.t, d: 0, n: '' };
      const t = tok.t + (tok.n.length ? (tok.d * acc) / tok.n.length : 0);
      acc += n.length;
      if (acc >= tok.n.length) { acc = 0; k++; }
      return { word, t };
    });
    let chunk = [];
    const flush = endT => { if (chunk.length) SUBS.push({ t0: chunk[0].t - 0.05, t1: endT, text: chunk.map(c => c.word).join(' ').replace(/\.\.\.$/, '…') }); chunk = []; };
    timed.forEach((w, i) => {
      chunk.push(w);
      const next = timed[i + 1];
      if (!next) flush(line.t + line.d + 0.15);
      else if ((/[.,:;!?…]$/.test(w.word) && chunk.length >= 3) || (chunk.length >= 8 && timed.length - i - 1 > 3)) flush(Math.max(next.t - 0.02, w.t + 0.3));
    });
  }
})();
const subsEl = document.querySelector('#subs span');
function renderSubs(t) {
  const s = SUBS.find(x => t >= x.t0 && t < x.t1);
  const txt = s ? s.text : '';
  if (subsEl.textContent !== txt) subsEl.textContent = txt;
}

// ---------- render loop ----------
function render(t) {
  for (const s of SCENES) {
    const on = t >= s.start && t < s.end;
    if (on !== s.el.classList.contains('on')) s.el.classList.toggle('on', on);
    if (on) s.update(t);
  }
  stage.style.background = SCENES.find(s => t >= s.start && t < s.end)?.el.dataset.bg || '';
  renderSubs(t);
}

window.addEventListener('load', async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map(i => (i.complete ? 1 : new Promise(r => (i.onload = i.onerror = r)))));
  const capture = new URLSearchParams(location.search).has('capture');
  window.seek = t => { render(t); return true; };
  window.__ready = true;
  if (capture) { document.body.classList.add('capture'); render(0); return; }
  // ----- preview player -----
  const vp = document.getElementById('viewport');
  const fit = () => { const k = Math.min(innerWidth / 1920, (innerHeight - 70) / 1080); stage.style.transform = `scale(${k})`; stage.style.marginBottom = `${-1080 * (1 - k)}px`; stage.style.marginRight = `${-1920 * (1 - k)}px`; };
  fit(); addEventListener('resize', fit);
  const bar = document.createElement('div');
  bar.id = 'bar';
  bar.innerHTML = `<button id="pp">Play</button><input id="scrub" type="range" min="0" max="${T.total}" step="0.01" value="0"><span id="tc"></span>${T.scenes.map(s => `<button data-t="${s.start}">${s.id}</button>`).join('')}`;
  document.body.appendChild(bar);
  const audio = new Audio('out/mix.m4a');
  let t0 = 0, playing = false, startAt = 0;
  const now = () => (playing ? (audio.readyState > 1 && !audio.paused ? audio.currentTime : t0 + (performance.now() - startAt) / 1000) : t0);
  const loop = () => { const t = now(); render(t); bar.querySelector('#scrub').value = t; bar.querySelector('#tc').textContent = t.toFixed(2) + 's'; requestAnimationFrame(loop); };
  const seekTo = t => { t0 = t; startAt = performance.now(); audio.currentTime = t; };
  bar.querySelector('#pp').onclick = () => { playing = !playing; if (playing) { seekTo(t0); audio.play().catch(() => {}); } else { t0 = now(); audio.pause(); } };
  bar.querySelector('#scrub').oninput = e => { const t = +e.target.value; seekTo(t); if (!playing) t0 = t; };
  bar.querySelectorAll('[data-t]').forEach(b => (b.onclick = () => { const t = +b.dataset.t; seekTo(t); if (!playing) t0 = t; }));
  const h = +location.hash.slice(1); if (h) t0 = h;
  loop();
});

/** camera that frames stage point (x,y) at zoom z; keys [{t,x,y,z,d}] ease from the previous state */
function camState(t, keys) {
  let j = 0;
  for (let i = 1; i < keys.length; i++) if (t >= keys[i].t) j = i;
  if (j === 0) return keys[0];
  const prev = camState(t, keys.slice(0, j)), b = keys[j], k = P(t, b.t, b.d || 0.9, Ez.io);
  return { x: lerp(prev.x, b.x, k), y: lerp(prev.y, b.y, k), z: lerp(prev.z, b.z, k) };
}
function camFrame(cam, t, keys) {
  const { x, y, z } = camState(t, keys);
  cam.style.transformOrigin = '0 0';
  st(cam, { x: 960 - x * z, y: 540 - y * z, s: z });
}
