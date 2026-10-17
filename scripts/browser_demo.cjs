/* Actual browser regression for the hackathon journey and dropdown contract. */
const { chromium } = require(process.env.RULELAB_PLAYWRIGHT || 'playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rulelab-demo-'));
const output = path.join(root, 'artifacts', 'demo-qa');
fs.mkdirSync(output, { recursive: true });
const origin = 'http://127.0.0.1:8055';
const server = spawn(process.env.RULELAB_PYTHON || 'python3', ['-m', 'uvicorn', 'app.main:app', '--port', '8055'], {
  cwd: root, env: { ...process.env, RULELAB_DB: path.join(temp, 'qa.sqlite'), AI_PROVIDER: 'demo', SEARCH_BACKEND: 'sqlite', RULELAB_API_TOKEN: '', RULELAB_ACCESS_KEYS: '[]', DATABASE_URL: '', RULELAB_SOURCES_BUCKET: '' }, stdio: 'ignore',
});
(async () => {
  let browser, page;
  const checks = [], errors = [];
  try {
    let ready = false;
    for (let i = 0; i < 1200; i++) {
      try { ready = (await fetch(origin + '/api/health')).ok; if (ready) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert(ready, 'Demo server must start');
    browser = await chromium.launch({ headless: true, executablePath: process.env.RULELAB_CHROMIUM || undefined });
    page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true, bypassCSP: true, timezoneId: 'Asia/Jakarta' });
    page.on('pageerror', error => errors.push(error.message));
    const settled = () => page.waitForFunction(() => document.querySelector('#main')?.getAttribute('aria-busy') === 'false');
    const click = async selector => { if(selector.startsWith('#workflow-stage-')&&!(await page.locator(selector).count())){await page.locator('#nav [data-view="studio"]').click();await settled();}if(!selector.startsWith('.ps-menu')&&await page.locator('.ps-menu '+selector).count()&&!(await page.locator(selector).first().isVisible()))await page.locator('.ps-more-toggle').click();await page.locator(selector).first().click(); await settled();if(selector.includes('[data-action="close"]'))assert.equal(await page.locator('#modal').isVisible(),false,'Closed dialog must not intercept the next click'); };
    const screenshot = async name => {
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(output, name + '.png'), animations: 'disabled' });
    };
    const select = async (id, label) => {
      await page.locator('#' + id + '-trigger').click();
      const popup = page.locator('.rl-select-popup:popover-open');
      await popup.waitFor();
      if (await popup.locator('.rl-select-search').isVisible()) await popup.locator('input').fill(label);
      await popup.getByRole('option', { name: label, exact: true }).click();
      await settled();
    };
    // Enter through the landing page, using the actual app link.
    await page.goto(origin);
    await page.waitForSelector('[data-landing-hero]');
    await screenshot('landing');
    await page.goto(origin + '/workspace');
    await page.waitForSelector('.ov-header'); await settled();
    await screenshot('home'); checks.push('landing and dashboard');
    await click('#workflow-stage-simulation');
    await click('[data-section="unified"]');
    assert.equal(await page.locator('.sim-result-empty').count(), 2);
    assert.equal(await page.locator('[data-action="review"]').count(), 0);
    assert(!(await page.locator('#simulation-content').textContent()).includes('94%'));
    await screenshot('unified-empty'); checks.push('synthesis requires actual results');
    // B starts as the draft itself, so the comparison stays disabled until B differs.
    await click('[data-section="projection"]');
    assert.equal(await page.locator('#ps-compare').isDisabled(), true);
    assert((await page.locator('#ps-alt-status').textContent()).includes('identical'));
    const assisted='Pasal 2\n(1) Permohonan dapat diajukan melalui aplikasi digital atau kanal pendampingan.\n(2) Penyelenggara menyediakan bantuan dan akomodasi yang layak bagi pemohon yang mengalami hambatan akses.';
    await page.locator('#alternative').fill((await page.locator('#alternative').inputValue()).replace(/Pasal 2\n[\s\S]*?(?=\n\nPasal 3)/, assisted));
    await page.waitForFunction(() => !document.querySelector('#ps-compare').disabled);
    await click('#ps-compare');
    assert.deepEqual(await page.locator('.scenario .number').allTextContents(), ['70%', '94%']);
    await click('[data-section="unified"]');
    assert.equal(await page.locator('.synthesis-stats .stat-box').count(), 3);
    await click('[data-section="projection"]');
    await screenshot('simulation-projection');
    await page.locator('#ass-population').fill('2500');
    await click('#ps-compare');
    await click('[data-section="unified"]');
    assert((await page.locator('.synthesis-stats').textContent()).includes('2.500'));
    checks.push('A/B comparison needs a different B, unified synthesis and assumption persistence');
    await click('#workflow-stage-editor');
    await screenshot('editor');
    await page.locator('#reg-type-trigger').click();
    const popup = page.locator('.rl-select-popup:popover-open');
    await popup.waitFor(); await screenshot('editor-dropdown');
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
    assert.equal(await page.locator('#reg-type').inputValue(), 'PERPRES');
    assert((await page.locator('#save-state').textContent()).includes('Not saved'));
    await page.locator('#reg-type-trigger').click();await page.keyboard.press('Escape');
    assert.equal(await popup.count(), 0);
    assert.equal(await page.locator('#reg-type-trigger').evaluate(el => el === document.activeElement), true);
    await select('reg-type', 'PP');
    checks.push('dropdown keyboard, selection, Escape and focus');
    await page.locator('#draft-title').fill('Demo layanan inklusif');
    await page.keyboard.press('Control+s');await settled();
    assert((await page.locator('#save-state').textContent()).includes('Saved'));
    await click('#ps-insights [data-action="analyze-inline"]');
    assert(await page.locator('.ps-outline .ps-count').count() > 0);
    await screenshot('editor-review');
    await click('#workflow-stage-analysis');
    assert(await page.locator('.finding').count() > 0);
    await click('[data-filter="high"]');
    assert.equal(await page.locator('[data-filter="high"]').getAttribute('aria-pressed'), 'true');
    await click('[data-filter="all"]');
    // "Review in Activity" opens this result in the Activity timeline, where the decision is recorded.
    await click('[data-action="review"]');
    assert.equal(new URL(page.url()).searchParams.get('view'),'activity');assert((await page.locator('#activity-timeline [aria-current="true"]').getAttribute('data-item')).startsWith('run:'));
    await page.locator('.act-seg label',{hasText:'Reviewed with notes'}).click();
    await page.locator('#review-notes').fill('Rujukan diperiksa untuk demonstrasi.');
    await click('[data-action="save-review"]');
    assert.equal(await page.locator('.act-review-history li').count(),1);
    const download = page.waitForEvent('download');await click('[data-action="report"]');
    assert((await download).suggestedFilename().endsWith('.docx'));
    await screenshot('analysis');checks.push('save shortcut, check from the insights rail, filters and review DOCX');
    await click('#nav [data-view="activity"]');await click('.act-chip[data-status="all"]');
    await select('activity-kind', 'Source checks');
    await click('#activity-timeline [data-item^="run:"]');
    await page.waitForSelector('#activity-detail .act-findings');
    await select('activity-kind', 'All types');
    assert(await page.locator('#activity-timeline [data-item^="version:"]').count() >= 2);
    await click('#activity-timeline [data-item^="version:"]');await page.waitForFunction(()=>/Changes from version|First version/.test(document.querySelector('#activity-detail')?.textContent||''));
    await screenshot('history');checks.push('historical results, review status and draft versions');
    await click('#nav [data-view="library"]');
    assert.equal(await page.locator('#nav [data-view="gallery"],#nav [data-view="corpus"]').count(),0);
    await page.waitForSelector('.lib-doc');assert(await page.locator('.lib-doc').count()>0,'Library must list documents');
    await screenshot('library');
    await click('#library-tab-passages');
    await screenshot('corpus');
    await click('[data-action="compare"]');
    await select('cmp-right', (await page.locator('#cmp-right option[value="uu-8-2016"]').textContent()).trim());
    assert(await page.locator('#art-right option').count() > 20);
    await select('art-right', 'Pasal 4');
    await click('[data-action="run-compare"]');
    await page.waitForSelector('.relation'); await screenshot('compare');
    await click('#modal [data-action="close"]');
    await page.locator('#search-q').fill('pengaduan');await page.locator('#search-form').evaluate(f => f.requestSubmit());await settled();
    assert(await page.locator('#main .lib-hit mark').count() > 0);
    checks.push('unified library, article search and dependent comparison dropdowns');
    await click('#nav [data-view="library"]');await click('#library-tab-documents');
    // One search box serves both modes: clear the article query before filtering documents by type.
    await page.locator('#search-q').fill('');await page.waitForFunction(()=>/^[\d.]+ documents$/.test(document.querySelector('.library-result-count')?.textContent||''));
    await select('library-type', 'Peraturan Pemerintah');await page.waitForFunction(()=>document.querySelector('.lib-doc')&&[...document.querySelectorAll('.lib-doc small')].every(el=>el.textContent.startsWith('PP ')));
    await select('library-type', 'All types');await page.waitForSelector('.lib-doc');
    await page.locator('#search-q').fill('Pelayanan Publik');await page.waitForSelector('.lib-doc[data-id="uu-25-2009"]');
    await click('[data-action="gallery-open"][data-id="uu-25-2009"]');
    await page.locator('#gallery-article-trigger').click();
    await page.locator('.rl-select-popup:popover-open input').fill('Pasal 4');
    await page.locator('.rl-select-popup:popover-open').getByRole('option', { name: 'Pasal 4', exact: true }).click();await settled();
    assert.equal(await page.locator('#gallery-article').inputValue(), '4');
    assert((await page.locator('.lib-scope-chip').textContent()).includes('UU 25/2009'));
    await click('[data-action="lib-scope-clear"]');
    assert((await page.locator('.lib-scope').textContent()).includes('Entire collection'));
    await page.locator('#gallery-question').fill('What is UU 25/2009 about?');
    await page.locator('#gallery-chat-form').evaluate(f => f.requestSubmit());await settled();
    assert.equal(await page.locator('.gallery-chat-turn').count(), 1);
    await screenshot('gallery-chat');
    await page.locator('.gallery-citation summary').first().click();await click('[data-action="gallery-read-source"]');await page.locator('#gallery-reader').waitFor();assert.equal(await page.locator('#modal[open]').count(), 0);
    await click('[data-action="toggle-assistant"]');await click('[data-action="toggle-assistant"]');
    await click('[data-action="gallery-clear"]');
    assert.equal(await page.locator('.gallery-chat-turn').count(), 0);
    checks.push('gallery filters, searchable article picker, context, chat citations and folding');
    await click('#workflow-stage-simulation');await click('[data-section="social"]');
    await click('.social-launch [data-action="start-agent"]');
    await page.waitForSelector('.social-network', { state: 'attached', timeout: 60000 });
    await page.waitForFunction(() => document.querySelectorAll('.social-post').length > 0, { timeout: 60000 });
    await page.waitForFunction(() => !document.querySelector('.social-launch [data-action="start-agent"]').disabled, null, { timeout: 60000 });
    await click('[data-scenario="B"]');
    // A finished run opens on the knowledge graph; the persona network is the third view.
    assert(await page.locator('#graph-pane-kg .kg-node').count() > 10);
    await click('#graph-tab-persona');
    await page.locator('.social-node').first().click();
    await screenshot('social');
    await click('[data-section="unified"]');
    assert(await page.locator('.synthesis-persona-summary .persona-row').count() > 0);
    for (const width of [360, 390, 768]) {
      await page.setViewportSize({width,height:900});
      for (const section of ['projection','social','unified']) {
        await click('[data-section="'+section+'"]');
        await page.waitForTimeout(250);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1), section+' results overflow at '+width);
        if(width===390)await screenshot('mobile-result-'+section);
      }
    }
    await page.setViewportSize({width:1440,height:1000});
    checks.push('populated simulation, social graph and synthesis at mobile/tablet sizes');
    await click('#nav [data-view="activity"]');await click('.act-head [data-action="activity-sheet"]');
    await select('agent-intent', 'Legal review');
    await click('.act-sheet [data-action="start-agent"]');
    await page.waitForFunction(() => document.querySelector('#activity-detail .act-detail-head .status-badge')?.textContent === 'Done', null, { timeout: 60000 });
    assert(await page.locator('#activity-detail .act-trace li').count() >= 4);
    await screenshot('agents');checks.push('social multi-persona run, graph, synthesis and legal agent trace');
    await click('#settings-btn');
    await screenshot('integration');
    await click('[data-action="probe-ai"]');
    await page.waitForSelector('#modal .integration-checks');await click('#modal [data-action="close"]');
    await click('[data-action="legal-guide"]');await click('#modal [data-action="close"]');
    await click('[data-action="audit"]');assert(await page.locator('#modal tbody tr').count() > 0);
    await click('#modal [data-action="close"]');
    await click('#menu-help');await page.locator('[data-ux="next"]').click();await page.keyboard.press('Escape');
    checks.push('integration probe, audit and interactive guide');
    await page.keyboard.press('Control+k');
    await page.getByRole('combobox',{name:'Search menu'}).fill('gallery');
    await page.keyboard.press('Enter');await settled();
    await page.waitForFunction(()=>document.body.dataset.view==='library');
    checks.push('keyboard command menu navigation');
    await click('.workspace-home-link');
    await click('.ov-new-toggle');
    await click('.ov-menu [data-action="new"]');
    await page.locator('#new-title').fill('Rancangan kedua');await select('new-type', 'PERMEN');
    await click('[data-action="create"]');
    const currentDraft = new URL(page.url()).searchParams.get('draft');
    await page.reload();await page.waitForSelector('#draft-title');await settled();
    assert.equal(new URL(page.url()).searchParams.get('draft'), currentDraft);
    assert.equal(await page.locator('#draft-title').inputValue(), 'Rancangan kedua');
    await select('draft-select', 'Demo layanan inklusif');
    await click('#nav [data-view="activity"]');await click('#nav [data-view="library"]');await click('#library-tab-documents');
    await page.goBack();await settled();assert.equal(await page.locator('body').getAttribute('data-view'), 'history');
    await page.goForward();await settled();assert.equal(await page.locator('body').getAttribute('data-view'), 'library');
    checks.push('new draft, draft switching, reload, browser Back and Forward');
    await click('#workflow-stage-editor');
    const exportDownload = page.waitForEvent('download');await click('[data-action="export"]');
    assert((await exportDownload).suggestedFilename().endsWith('.docx'));
    await click('[data-action="generate"]');await page.locator('#brief').fill('Pelayanan publik digital yang inklusif dan menyediakan kanal bantuan.');
    await click('[data-action="run-generate"]');assert.equal(await page.locator('[data-article]').count(), 5);
    await click('[data-action="import"]');
    await page.locator('#import-file').setInputFiles({name:'demo.txt',mimeType:'text/plain',buffer:Buffer.from('Pasal 1\nPenyelenggara menyediakan pelayanan dan sarana pengaduan yang dapat diakses oleh warga.')});
    await click('[data-action="run-import"]');assert.equal(await page.locator('[data-article]').count(), 1);
    await click('[data-action="add"]');assert.equal(await page.locator('[data-article]').count(), 2);
    await click('[data-action="remove"][data-index="1"]');assert.equal(await page.locator('[data-article]').count(), 1);
    await click('[data-action="save"]');checks.push('DOCX export, generation, import, add and remove article');
    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({width,height:900});
      for (const view of ['home','editor','analysis','simulation','library','history','agents']) {
        await click(view === 'home' ? '.workspace-home-link' : ['editor','analysis','simulation'].includes(view)?'#workflow-stage-'+view:['history','agents'].includes(view)?'#nav [data-view="activity"]':'#nav [data-view="'+view+'"]');
        await page.waitForTimeout(250);
        const overflow = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth}));
        assert(overflow.scroll <= overflow.width + 1, JSON.stringify({view,...overflow}));
        if (width === 390) await screenshot('mobile-'+view);
      }
    }
    await page.setViewportSize({width:390,height:900});
    await click('.menu-settings');await page.waitForSelector('#modal .integration-checks');await click('#modal [data-action="close"]');
    checks.push('all menus at 360/390/768/1024/1440px and mobile integration settings');
    await page.emulateMedia({reducedMotion:'reduce'});
    await click('#workflow-stage-editor');await page.locator('#reg-type-trigger').click();
    assert.equal(await page.locator('.rl-select-popup:popover-open').evaluate(el=>getComputedStyle(el).animationName), 'none');
    await page.keyboard.press('Escape');checks.push('reduced motion');
    // Check the new shared surfaces with the production CSP, including the guide's TOC.
    const cspPage=await browser.newPage({viewport:{width:1440,height:1000}});
    const cspErrors=[];cspPage.on('pageerror',error=>cspErrors.push(error.message));
    for(const view of ['home','data','editor','analysis','simulation','library','history','agents']){
      await cspPage.goto(origin+'/workspace?view='+view);
      await cspPage.waitForSelector('#main h1');
      await cspPage.waitForFunction(()=>document.querySelector('#main')?.getAttribute('aria-busy')==='false');
      assert.equal(await cspPage.locator('#main h1').count(),1);
      assert(await cspPage.locator('#main h1').isVisible());
      assert(await cspPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
    await cspPage.goto(origin+'/guide');await cspPage.waitForSelector('.guide-visual-hero');
    assert.equal(await cspPage.locator('main h2').count(),11);
    assert(await cspPage.locator('nav a[href^="#section-"]').evaluateAll(links=>links.every(link=>document.querySelector(link.getAttribute('href')))));
    await cspPage.screenshot({path:path.join(output,'guide.png'),animations:'disabled'});
    await cspPage.setViewportSize({width:390,height:900});
    assert(await cspPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await cspPage.screenshot({path:path.join(output,'mobile-guide.png'),animations:'disabled'});
    assert.deepEqual(cspErrors,[]);await cspPage.close();
    checks.push('five workspace menus, all studio stages and guide TOC render under production CSP');
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(output,'report.json'),JSON.stringify({status:'passed',checks,errors},null,2));
    console.log(JSON.stringify({status:'passed',checks,screenshots:output},null,2));
  } catch(error) {
    if(page) console.error('layout',await page.evaluate(()=>[...document.querySelectorAll('#main *')].filter(el=>el.getBoundingClientRect().right>innerWidth+1&&!el.closest('.sim-unified-nav')).map(el=>({class:el.className,width:el.getBoundingClientRect().width,right:el.getBoundingClientRect().right})).slice(0,25)));
    if(page) await page.screenshot({path:path.join(output,'failure.png')}).catch(()=>{});
    console.error(error);process.exitCode=1;
  } finally { await browser?.close();server.kill(); }
})();
