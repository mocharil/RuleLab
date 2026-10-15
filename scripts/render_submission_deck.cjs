/* Render all 15 uniform 1920x1080 PNG slide images from deck/index.html using Playwright Chromium. */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const deckDir = path.join(root, 'deck');
const slidesDir = path.join(deckDir, 'slides');
fs.mkdirSync(slidesDir, { recursive: true });

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
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  const deckUrl = 'file:///' + path.join(deckDir, 'index.html').replace(/\\/g, '/');
  console.log('Opening deck:', deckUrl);

  await page.goto(deckUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  const slideInfos = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section.slide'));
    return sections.map((sec, idx) => ({
      id: sec.id,
      name: sec.getAttribute('data-name') || `slide-${String(idx + 1).padStart(2, '0')}.png`,
    }));
  });

  for (const s of slideInfos) {
    const loc = page.locator(`#${s.id}`);
    const outPath = path.join(slidesDir, s.name);
    await loc.screenshot({ path: outPath });
    console.log('Rendered slide:', s.name);
  }

  await browser.close();
  console.log(`Successfully rendered ${slideInfos.length} uniform 1920x1080 slides in ${slidesDir}`);
})();
