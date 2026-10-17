/* Render the demo frame-by-frame.
 *   node render.cjs --stills 3.5,12,40      -> out/stills/*.png
 *   node render.cjs                          -> out/video.mp4 (silent), parallel workers
 * Env: PW = path to a playwright module (defaults to require('playwright')).
 */
const fs = require('node:fs'), path = require('node:path'), { spawn } = require('node:child_process');
const { chromium } = require(process.env.PW || 'playwright');
const here = __dirname, out = path.join(here, 'out');
fs.mkdirSync(out, { recursive: true });
const url = 'file:///' + path.join(here, 'index.html').replace(/\\/g, '/') + '?capture=1' + (process.env.NOSUBS ? '&nosubs=1' : '');
const FPS = +(process.env.FPS || 30), WORKERS = +(process.env.WORKERS || 4);
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('pageerror', e.message));
  page.on('console', m => m.type() === 'warning' && console.warn('warn:', m.text()));
  await page.goto(url);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
  return page;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const stills = arg('--stills');
  if (stills) {
    const dir = path.join(out, arg('--dir') || 'stills'); fs.mkdirSync(dir, { recursive: true });
    const page = await openPage(browser);
    for (const t of stills.split(',').map(Number)) {
      await page.evaluate(t => window.seek(t), t);
      await page.screenshot({ path: path.join(dir, `t${t.toFixed(2)}.png`) });
      console.log('still', t);
    }
    if (process.argv.includes('--cues')) fs.writeFileSync(path.join(out, 'cues.json'), JSON.stringify(await page.evaluate(() => window.CUES)));
    await browser.close();
    return;
  }
  const probe = await openPage(browser);
  const total = await probe.evaluate(() => window.TIMELINE.total);
  fs.writeFileSync(path.join(out, 'cues.json'), JSON.stringify(await probe.evaluate(() => window.CUES)));
  await probe.close();
  // FROM/TO (seconds) render a time range, e.g. landing-page clips; OUT names the result (default video.mp4)
  const F0 = Math.round(+(process.env.FROM || 0) * FPS), F1 = Math.min(Math.ceil(+(process.env.TO || total) * FPS), Math.ceil(total * FPS));
  const frames = Math.min(F1 - F0, +(process.env.MAXF || 1e9)), per = Math.ceil(frames / WORKERS);
  const OUT = process.env.OUT || 'video.mp4', TAG = OUT.replace(/\.mp4$/, '');
  const t0 = Date.now();
  await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const a = w * per, b = Math.min(frames, a + per);
    const wb = await chromium.launch({ headless: true, args: ['--disable-gpu-vsync', '--disable-frame-rate-limit'] });
    const page = await openPage(wb);
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', path.join(out, `${TAG}-seg${w}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = a; f < b; f++) {
      await page.evaluate(t => window.seek(t), (F0 + f) / FPS);
      const buf = await page.screenshot({ type: 'jpeg', quality: 94, timeout: 120000 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (w === 0 && f % 150 === 0) console.log(`frame ${f}/${b} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    await wb.close();
  }));
  fs.writeFileSync(path.join(out, `${TAG}-segs.txt`), Array.from({ length: WORKERS }, (_, w) => `file '${TAG}-seg${w}.mp4'`).join('\n'));
  await new Promise((res, rej) => spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(out, `${TAG}-segs.txt`), '-c', 'copy', path.join(out, OUT)], { stdio: 'inherit' }).on('close', c => (c ? rej(c) : res())));
  console.log(`video done: ${frames} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  await browser.close();
})();
