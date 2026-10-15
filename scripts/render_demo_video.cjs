/* Render RuleLab 16:9 1080p motion graphics demo video (MP4 + WebM) and storyboard keyframes. */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const demoDir = path.join(root, 'demo');
const storyboardDir = path.join(demoDir, 'storyboard');
fs.mkdirSync(storyboardDir, { recursive: true });

// Locate Playwright and Chromium from local npx/ms-playwright cache if not in local node_modules
function loadPlaywright() {
  try {
    return require('playwright');
  } catch (_) {
    const npxRoot = path.join(process.env.LOCALAPPDATA || '', 'npm-cache', '_npx');
    if (fs.existsSync(npxRoot)) {
      for (const dir of fs.readdirSync(npxRoot)) {
        const candidate = path.join(npxRoot, dir, 'node_modules', 'playwright');
        if (fs.existsSync(candidate)) {
          return require(candidate);
        }
      }
    }
    throw new Error('Playwright module not found');
  }
}

function findChromiumExecutable() {
  if (process.env.RULELAB_CHROMIUM && fs.existsSync(process.env.RULELAB_CHROMIUM)) {
    return process.env.RULELAB_CHROMIUM;
  }
  const msPlaywright = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
  if (fs.existsSync(msPlaywright)) {
    const dirs = fs.readdirSync(msPlaywright)
      .filter(d => d.startsWith('chromium-'))
      .sort()
      .reverse();
    for (const d of dirs) {
      const exe64 = path.join(msPlaywright, d, 'chrome-win64', 'chrome.exe');
      if (fs.existsSync(exe64)) return exe64;
      const exe = path.join(msPlaywright, d, 'chrome-win', 'chrome.exe');
      if (fs.existsSync(exe)) return exe;
    }
  }
  return undefined;
}

(async () => {
  const { chromium } = loadPlaywright();
  const executablePath = findChromiumExecutable();
  console.log('Using Chromium:', executablePath || 'default');

  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--autoplay-policy=no-user-gesture-required'],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  const demoUrl = 'file:///' + path.join(demoDir, 'index.html').replace(/\\/g, '/') + '?capture=1';
  console.log('Opening:', demoUrl);

  await page.goto(demoUrl);
  await page.waitForFunction(() => window.__RULELAB_DEMO__ && window.__RULELAB_DEMO__.ready === true, { timeout: 30000 });

  // 1. Capture storyboard keyframes first
  const keyframes = [
    { time: 0.8, name: '01a-hook-problem.png' },
    { time: 1.9, name: '01b-hook-citizen-impact.png' },
    { time: 3.0, name: '01c-hook-converge.png' },
    { time: 5.1, name: '02a-reveal-home.png' },
    { time: 7.9, name: '02b-reveal-studio-stages.png' },
    { time: 8.9, name: '03a0-workflow-guided-builder.png' },
    { time: 11.0, name: '03a-workflow-draft-pasal2.png' },
    { time: 13.6, name: '03b-workflow-review-sources.png' },
    { time: 15.5, name: '03c1-network-spreading-clusters.png' },
    { time: 16.8, name: '03c-workflow-network-32-agents.png' },
    { time: 18.5, name: '03c-workflow-impact-simulation.png' },
    { time: 20.6, name: '04-outcome-package.png' },
    { time: 22.8, name: '05-closing-brand.png' },
  ];

  for (const kf of keyframes) {
    await page.evaluate((t) => window.__RULELAB_DEMO__.seekTo(t), kf.time);
    await page.waitForTimeout(40);
    const outPath = path.join(storyboardDir, kf.name);
    await page.screenshot({ path: outPath });
    console.log(`Captured keyframe [${kf.time.toFixed(1)}s]:`, kf.name);
  }

  // 2. Capture player UI preview screenshot (without ?capture=1)
  const playerPage = await context.newPage();
  const playerUrl = 'file:///' + path.join(demoDir, 'index.html').replace(/\\/g, '/');
  await playerPage.goto(playerUrl);
  await playerPage.waitForFunction(() => window.__RULELAB_DEMO__ && window.__RULELAB_DEMO__.ready === true, { timeout: 30000 });
  await playerPage.evaluate(() => window.__RULELAB_DEMO__.seekTo(16.0));
  await playerPage.waitForTimeout(50);
  await playerPage.screenshot({ path: path.join(storyboardDir, 'player-ui-preview.png') });
  await playerPage.close();
  console.log('Captured interactive player UI preview: player-ui-preview.png');

  if (process.argv.includes('--keyframes-only')) {
    await browser.close();
    return;
  }

  // 3. Record 1920x1080 60fps MP4 (H.264 + AAC)
  console.log('Recording 24.0s 1080p MP4 (video/mp4;codecs=avc1,mp4a.40.2)...');
  const mp4Base64 = await page.evaluate(() => window.__RULELAB_DEMO__.recordVideoBlob('video/mp4;codecs=avc1,mp4a.40.2'));
  const mp4Path = path.join(demoDir, 'rulelab-motion-demo-1080p.mp4');
  fs.writeFileSync(mp4Path, Buffer.from(mp4Base64, 'base64'));
  console.log('Saved MP4:', mp4Path, `(${(fs.statSync(mp4Path).size / 1024 / 1024).toFixed(2)} MB)`);

  // 4. Record 1920x1080 60fps WebM (VP9 + Opus)
  console.log('Recording 24.0s 1080p WebM (video/webm;codecs=vp9,opus)...');
  const webmBase64 = await page.evaluate(() => window.__RULELAB_DEMO__.recordVideoBlob('video/webm;codecs=vp9,opus'));
  const webmPath = path.join(demoDir, 'rulelab-motion-demo-1080p.webm');
  fs.writeFileSync(webmPath, Buffer.from(webmBase64, 'base64'));
  console.log('Saved WebM:', webmPath, `(${(fs.statSync(webmPath).size / 1024 / 1024).toFixed(2)} MB)`);

  await browser.close();
  console.log('All video deliverables rendered successfully.');
})();
