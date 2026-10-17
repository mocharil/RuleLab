/* Capture actual v1.3 screens with a fresh demo DB; no API credentials needed. */
const { chromium } = require(process.env.RULELAB_PLAYWRIGHT || 'playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rulelab-design-'));
const output = path.join(root, 'screenshots', 'v1.3');
fs.mkdirSync(output, { recursive: true });
const origin = 'http://127.0.0.1:8051';
const server = spawn(process.env.RULELAB_PYTHON || 'python3', ['-m', 'uvicorn', 'app.main:app', '--port', '8051'], {
  cwd: root, env: { ...process.env, RULELAB_DB: path.join(temp, 'qa.sqlite3'), AI_PROVIDER: 'demo', SEARCH_BACKEND: 'sqlite', RULELAB_API_TOKEN: '', RULELAB_ACCESS_KEYS: '[]', DATABASE_URL: '', RULELAB_SOURCES_BUCKET: '' }, stdio: 'ignore',
});
(async () => {
  let browser;
  const checks = [];
  try {
    let healthy = false;
    for (let i = 0; i < 100; i++) {
      try { healthy = (await fetch(origin + '/api/health')).ok; if (healthy) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert(healthy, 'Demo server failed to start');
    const request = async (route, body) => {
      const response = await fetch(origin + '/api' + route, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {});
      assert(response.ok, `${route}: ${response.status}`); return response.json();
    };
    const draft = (await request('/drafts'))[0];
    const alternative = draft.articles.map(article => 'Pasal ' + article.number + '\n' + (article.number === '2' ? '(1) Permohonan dapat diajukan melalui aplikasi digital atau kanal pendampingan.\n(2) Penyelenggara menyediakan bantuan dan akomodasi yang layak.' : article.text)).join('\n\n');
    const assumptions = { population: 1000, digital_access_pct: 70, assisted_success_pct: 80, digital_cost: 20000, assisted_cost: 50000, staff_capacity: 40 };
    await request('/drafts/' + draft.id + '/analyze', { as_of_date: new Date().toISOString().slice(0, 10) });
    await request('/drafts/' + draft.id + '/simulate', { alternative_text: alternative, assumptions });
    const job = await request('/drafts/' + draft.id + '/agent-jobs', { intent: 'social', expected_revision: draft.revision, alternative_text: alternative, assumptions });
    let finished;
    for (let i = 0; i < 200; i++) {
      finished = await request('/agent-jobs/' + job.id);
      if (finished.status === 'completed') break;
      assert(!['failed', 'cancelled', 'interrupted'].includes(finished.status), finished.error || finished.status);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.equal(finished.status, 'completed');
    browser = await chromium.launch({ headless: true, executablePath: process.env.RULELAB_CHROMIUM || undefined });
    const page = await browser.newPage({ viewport: { width: 1520, height: 1080 }, timezoneId: 'Asia/Jakarta' });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    const capture = async (name, fullPage = false) => {
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(output, name + '.png'), fullPage, animations: 'disabled' });
    };
    const navigate = async view => {
      await page.goto(origin + '/workspace?view=' + view);
      await page.waitForSelector('#main h1');
      await page.waitForFunction(() => !document.querySelector('#main').inert);
      assert.equal(await page.locator('body').getAttribute('data-view'), view === 'agents' ? 'history' : view);
    };
    await page.goto(origin); await page.waitForSelector('[data-landing-hero]'); await capture('landing-desktop', true);
    const views = ['home', 'data', 'editor', 'analysis', 'simulation', 'library', 'history', 'agents'];
    for (const view of views) { await navigate(view); await capture(view + '-desktop'); checks.push(view + ' desktop capture'); }
    await navigate('library');
    await page.locator('[data-action="gallery-open"][data-id="uu-25-2009"]').click();
    await page.waitForFunction(()=>!document.querySelector('#main').inert&&document.querySelector('#gallery-article'));
    await page.locator('#gallery-article').selectOption('4');
    await page.locator('#gallery-question').fill('Jelaskan Pasal 4 UU 25/2009 untuk pemula.');
    await page.locator('#gallery-chat-form button[type="submit"]').click();
    await page.waitForSelector('.gallery-citation');await page.waitForFunction(()=>!document.querySelector('#main').inert);
    await capture('gallery-reader-and-bot',true);checks.push('gallery reader and source-bound demo chat');
    await navigate('editor');
    await page.locator('#sidebar-toggle').click();
    await page.waitForFunction(() => document.querySelector('.sidebar').getBoundingClientRect().width < 90);
    await capture('editor-folded');
    await page.locator('.ps-more-toggle').click(); await page.locator('.ps-menu [data-ux="focus-editor"]').click();
    assert.equal(await page.locator('.ps-insights').isVisible(), false); await capture('editor-focus');
    await page.locator('.ps-focus-chip').click(); await page.locator('#sidebar-toggle').click();
    await page.locator('[aria-label="Quick navigation"]').click(); await page.waitForSelector('.fx-command-content'); await capture('command-menu'); await page.keyboard.press('Escape');
    await page.locator('#menu-help').click(); await page.waitForSelector('#guide-dialog[open]'); await capture('menu-guide'); await page.keyboard.press('Escape');
    await navigate('social');
    assert.equal(await page.locator('.social-node').count(), 5); assert.equal(await page.locator('.social-post').count(), 15);
    await page.locator('#graph-tab-persona').click();
    await page.locator('.social-opinion-node[data-comment="A-1-sari"]').click();
    assert.equal(await page.locator('.social-selected-opinion').getAttribute('data-opinion-id'), 'A-1-sari'); await capture('social-opinion');
    await page.locator('.social-law-node').first().click(); assert((await page.locator('.social-inspector').textContent()).includes('SHA256')); await capture('social-source');
    await page.locator('[data-scenario="B"]').click(); await capture('social-alternative-B');
    checks.push('exact opinion and legal source inspectors');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin); await page.waitForSelector('[data-landing-hero]');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)); await capture('landing-mobile', true);
    for (const view of views) {
      await navigate(view); assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), view + ' mobile overflow');
      await capture(view + '-mobile', true); checks.push(view + ' mobile overflow and capture');
    }
    await page.setViewportSize({ width: 1520, height: 1080 });
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await page.route('**/api/status', async route => { await gate; await route.continue(); });
    await page.goto(origin + '/workspace', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#progress-modal[open]'); await capture('loading'); release();
    await page.waitForSelector('.ov-header'); await page.unroute('**/api/status');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('.loading-spinner').evaluate(element => getComputedStyle(element).animationName), 'none');
    assert.deepEqual(errors, []);
    checks.push('loading, reduced motion and no JavaScript errors');
    fs.writeFileSync(path.join(output, 'capture-report.json'), JSON.stringify({ version: '1.0', mode: 'demo', checks, screenshots: fs.readdirSync(output).filter(file => file.endsWith('.png')) }, null, 2));
    console.log(JSON.stringify({ checks: checks.length, output }, null, 2));
  } finally { if (browser) await browser.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
