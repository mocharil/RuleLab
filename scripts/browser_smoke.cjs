/* Run with a local Playwright installation. Starts its own temporary demo server. */
const { chromium } = require(process.env.RULELAB_PLAYWRIGHT || 'playwright');
const { spawn } = require('child_process');
const fs = require('fs'); const os = require('os'); const path = require('path');
const assert = require('assert');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rulelab-qa-'));
const port = process.env.RULELAB_TEST_PORT || '8015';
const origin = 'http://127.0.0.1:' + port;
const server = spawn(process.env.RULELAB_PYTHON || 'python3', ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', port], {
 cwd: root, env: { ...process.env, RULELAB_DB: path.join(temp, 'qa.sqlite3'), AI_PROVIDER: 'demo', SEARCH_BACKEND: 'sqlite', RULELAB_API_TOKEN: '', DATABASE_URL: '', RULELAB_SOURCES_BUCKET: '' }, stdio: 'ignore'
});
(async () => {
 let browser;
 const errors = [];
 try {
  for (let i = 0; i < 1200; i++) {
   try { if ((await fetch(origin + '/api/health')).ok) break; } catch {}
   await new Promise(r => setTimeout(r, 100));
  }
  browser = await chromium.launch({ headless:true,executablePath:process.env.RULELAB_CHROMIUM||undefined });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, acceptDownloads: true, bypassCSP: true });
  page.on('pageerror', e => errors.push(e.message));
  const choose=async(id,value)=>{
   const text=await page.locator('#'+id).evaluate((el,value)=>[...el.options].find(o=>o.value===value).text,value);
   await page.locator('#'+id+'-trigger').click();
   const popup=page.locator('.rl-select-popup:popover-open');
   if(await popup.locator('input').isVisible())await popup.locator('input').fill(text);
   await popup.getByRole('option',{name:text,exact:true}).click();
   await page.waitForFunction(()=>!document.querySelector('#main').inert);
  };

  // Activity is one timeline; "results" shows every result, "agents" opens the latest agent run.
  const activityTab=async tab=>{await page.locator('#nav [data-view="activity"]').click();await page.waitForFunction(()=>!document.querySelector('#main').inert&&document.querySelector('.act'));if(tab==='agents'){await page.goto(origin+'/workspace?view=agents');await page.waitForSelector('.act');}else if(await page.locator('.act-chip[data-status="all"]').count()){await page.locator('.act-chip[data-status="all"]').click();}await page.waitForFunction(()=>!document.querySelector('#main').inert);};
  const studioStage=async stage=>{if(!(await page.locator('#workflow-stage-'+stage).count())){await page.locator('#nav [data-view="studio"]').click();await page.waitForFunction(()=>!document.querySelector('#main').inert);}await page.locator('#workflow-stage-'+stage).click();await page.waitForFunction(()=>!document.querySelector('#main').inert);};

  await page.goto(origin); await page.waitForSelector('[data-landing-hero]');
  await page.screenshot({path:path.join(temp,'landing.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await page.setViewportSize({width:1440,height:1100});
  let releaseInit;const initGate=new Promise(resolve=>releaseInit=resolve);
  await page.route('**/api/status',async route=>{await initGate;await route.continue();});
  await page.goto(origin+'/workspace',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.workspace-skeleton');await page.waitForSelector('#progress-modal[open]');
  assert.equal(await page.locator('#main').getAttribute('aria-busy'),'true');
  await page.keyboard.press('Escape');assert(await page.locator('#progress-modal').evaluate(x=>x.open));
  await page.screenshot({path:path.join(temp,'loading.png')});
  releaseInit();await page.waitForSelector('.ov-header');await page.waitForFunction(()=>!document.querySelector('#main').inert);
  await page.unroute('**/api/status');
  await page.waitForSelector('.ov-continue .ov-stepper li');  // overview data arrives after the shell renders
  assert.equal(await page.locator('.ov-continue .ov-stepper li').count(),3);assert(await page.locator('.ov-continue .ov-btn-primary').count()===1);
  assert.equal(await page.locator('#nav .active').count(),0);
  assert.equal(await page.locator('.workspace-home-link').getAttribute('aria-current'),'page');
  for (const width of [360,390,768]) {
   await page.setViewportSize({width,height:844});
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  }
  await page.setViewportSize({width:1440,height:1100});
  await page.screenshot({path:path.join(temp,'home.png'),fullPage:true});
  await page.locator('.ov-continue [data-target="editor"]').click();await page.waitForSelector('#draft-title');
  await page.evaluate(() => document.fonts.ready);
  assert(await page.evaluate(() => document.fonts.check('500 16px Manrope') && document.fonts.check('500 40px "Cormorant Garamond"')));
  assert((await page.locator('h1').evaluate(x => getComputedStyle(x).fontFamily)).includes('Manrope'));
  assert.equal(await page.locator('.btn.primary').first().evaluate(x => getComputedStyle(x).backgroundColor),'rgb(180, 35, 56)');
  assert.equal(await page.locator('[data-article]').count(), 4);
  await page.locator('.ps-more-toggle').click();await page.locator('.ps-menu [data-action="legal-guide"]').click();
  await page.waitForSelector('dialog .source-details');
  const guide=await (await page.request.get(origin+'/api/legal/guide')).json(),changes=await (await page.request.get(origin+'/api/legal/changes')).json();
  assert.equal(await page.locator('dialog .source-details').count(), guide.rules.length+changes.candidates.length);
  assert((await page.locator('#modal').textContent()).includes('Perubahan bisa menyisipkan'));
  await page.waitForFunction(()=>!document.querySelector('#main').inert);await page.locator('#modal [data-action="close"]').first().click();await page.waitForFunction(()=>!document.querySelector('#main').inert);
  await page.waitForFunction(()=>!document.querySelector('#modal').open);await page.screenshot({ path: path.join(temp, 'editor.png'), fullPage: true });
  await page.locator('[data-article="0"]').fill('Dalam rancangan ini, layanan digital adalah layanan administrasi elektronik.');
  await page.locator('[data-action="save"]').first().click();
  await page.waitForFunction(() => document.querySelector('#save-state')?.textContent.includes('v2'));
  await studioStage('analysis');
  let releaseAnalysis;let analyzeRequests=0;const analysisGate=new Promise(resolve=>releaseAnalysis=resolve);
  await page.route('**/api/drafts/*/analyze',async route=>{analyzeRequests++;await analysisGate;await route.continue();});
  await page.locator('[data-action="analyze"]').first().click();await page.waitForSelector('#progress-modal[open]');
  assert((await page.locator('#progress-title').textContent()).includes('Reviewing draft'));
  await page.evaluate(()=>document.querySelector('[data-action="analyze"]').click());
  assert.equal(analyzeRequests,1);releaseAnalysis();await page.waitForSelector('.finding');
  await page.waitForFunction(()=>!document.querySelector('#main').inert);await page.unroute('**/api/drafts/*/analyze');
  assert.equal(await page.locator('.finding').count(), 3);
  await page.locator('#legal-date').fill('2000-01-01');
  await page.locator('[data-action="analyze"]').first().click();
  await page.waitForFunction(() => document.querySelector('.ps-limits')?.textContent.includes('Date 2000-01-01'));
  assert.equal(await page.locator('.finding-bottom[data-category="potential_vertical_conflict"]').count(),0);
  await page.locator('#legal-date').fill(new Date().toISOString().slice(0,10));
  await page.locator('[data-action="analyze"]').first().click();
  await page.waitForFunction(() => [...document.querySelectorAll('.finding-bottom')].filter(x => x.dataset.category==='potential_vertical_conflict').length===2);
  await page.locator('.source-details summary').first().click();
  assert((await page.locator('.source-details .quote').first().textContent()).includes('pelayanan'));
  await page.screenshot({ path: path.join(temp, 'analysis.png'), fullPage: true });
  await page.setViewportSize({width:390,height:844});
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await page.setViewportSize({width:1440,height:1100});
  await page.locator('[data-action="apply"]').first().click();
  await page.waitForFunction(() => document.querySelector('.ps-stale')?.textContent.includes('Draft is now v'));
  assert.equal(await page.locator('[data-action="apply"]:disabled').count(), 2);
  assert.equal(await page.locator('.ps-applied').count(), 1);
  await page.locator('[data-action="analyze"]').first().click();
  await page.waitForFunction(() => document.querySelectorAll('.finding').length === 2);
  await studioStage('simulation');
  await page.locator('#alternative').fill('Pasal 1\nLayanan hanya dapat diajukan melalui aplikasi digital.');
  await page.waitForFunction(()=>!document.querySelector('#ps-compare').disabled);
  await page.locator('#ps-compare').click(); await page.waitForSelector('.scenario');
  assert.deepEqual(await page.locator('.scenario .number').allTextContents(), ['94%', '70%']);
  await page.screenshot({ path: path.join(temp, 'simulation.png'), fullPage: true });
  await page.setViewportSize({width:390,height:844});
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await page.screenshot({path:path.join(temp,'simulation-mobile.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:1100});
  await page.locator('[data-action="apply-alt"]').first().click(); await page.locator('[data-action="confirm-alt"]').click();
  await page.waitForSelector('#draft-title'); assert.equal(await page.locator('[data-article]').count(), 1);
  const dl = page.waitForEvent('download'); await page.locator('.ps-more-toggle').click(); await page.locator('.ps-menu [data-action="export"]').click();
  const download = await dl; await download.saveAs(path.join(temp, 'export.docx'));
  assert(fs.statSync(path.join(temp, 'export.docx')).size > 10000);
  await activityTab('results'); await page.locator('#activity-timeline [data-item^="run:"]').first().click(); await page.waitForFunction(()=>!document.querySelector('#main').inert);
  await page.locator('.act-seg label',{hasText:'Reviewed with notes'}).click();
  await page.locator('#review-notes').fill('Sumber diperiksa, perlu konsultasi masyarakat.');
  await page.locator('[data-action="save-review"]').click(); await page.waitForSelector('.act-review-history li');
  assert.equal(await page.locator('input[name="review-status"]:checked').inputValue(),'reviewed_with_notes');
  assert.equal(await page.locator('#review-notes').inputValue(),'Sumber diperiksa, perlu konsultasi masyarakat.');
  assert.equal(await page.locator('.act-review-history li').count(),1);
  await page.waitForFunction(()=>document.querySelectorAll('#activity-timeline [data-item^="version:"]').length===4); assert.equal(await page.locator('#activity-timeline [data-item^="version:"]').count(), 4);
  await page.locator('#activity-timeline [data-item^="version:"]').first().click(); await page.waitForSelector('#activity-detail .act-diff');
  await page.locator('#nav [data-view="library"]').click(); await page.locator('#library-tab-passages').click();
  let releaseSearch;const searchGate=new Promise(resolve=>releaseSearch=resolve);
  await page.route('**/api/search?*',async route=>{await searchGate;await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({detail:'Pencarian uji tidak tersedia'})});});
  await page.locator('#search-q').fill('pengaduan tanggapan');await page.locator('#search-form').evaluate(f=>f.requestSubmit());
  await page.waitForSelector('#progress-modal[open]');releaseSearch();
  await page.waitForFunction(()=>!document.querySelector('#main').inert);
  assert((await page.locator('#toast').textContent()).includes('Pencarian uji tidak tersedia'));
  assert.equal(await page.locator('#search-q').inputValue(),'pengaduan tanggapan');
  assert.equal(await page.locator('#progress-modal').evaluate(x=>x.open),false);await page.unroute('**/api/search?*');
  await page.locator('#search-q').fill('pengaduan tanggapan'); await page.locator('#search-form').evaluate(f => f.requestSubmit());
  await page.waitForSelector('.lib-hit'); assert((await page.locator('.lib-hit').count()) > 0);
  await page.locator('[data-action="compare"]').click(); await page.waitForFunction(() => document.querySelector('#art-right')?.options.length > 0);
  // Pick both sources explicitly: the default right-hand document follows corpus order, which grows over time.
  await choose('cmp-left','pp-96-2012'); await choose('cmp-right','uu-25-2009');
  await page.waitForFunction(() => [...document.querySelector('#art-right').options].some(o => o.value === '4'));
  await choose('art-right','4'); await page.locator('[data-action="run-compare"]').click();
  await page.waitForSelector('.relation'); assert((await page.locator('.relation').textContent()).includes('ranks higher'));
  await page.waitForFunction(()=>!document.querySelector('#main').inert);await page.locator('#modal [data-action="close"]').first().click();await page.waitForFunction(()=>!document.querySelector('#main').inert);
  await studioStage('editor'); await page.locator('.ps-more-toggle').click(); await page.locator('.ps-menu [data-action="generate"]').click();
  await page.locator('#brief').fill('Layanan publik digital yang inklusif bagi warga tanpa internet.');
  await page.locator('[data-action="run-generate"]').click(); await page.waitForFunction(() => document.querySelectorAll('[data-article]').length === 5);
  await page.locator('.ps-more-toggle').click(); await page.locator('.ps-menu [data-action="import"]').click();
  const file = path.join(temp, 'sample.txt'); fs.writeFileSync(file, 'Pasal 1\nPenyelenggara menyediakan sarana pengaduan.');
  await page.locator('#import-file').setInputFiles(file); await page.locator('[data-action="run-import"]').click();
  await page.waitForFunction(() => document.querySelectorAll('[data-article]').length === 1);
  // User text must not execute as HTML in the UI.
  await page.locator('#draft-title').fill('<img src=x onerror="window.injected=true">');
  await page.locator('[data-action="save"]').first().click(); await activityTab('results');
  assert.equal(await page.evaluate(() => window.injected), undefined);
  await page.setViewportSize({ width: 390, height: 844 }); await studioStage('editor');
  await page.screenshot({ path: path.join(temp, 'mobile.png'), fullPage: true });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  assert.equal(await page.locator('#nav').evaluate(x => getComputedStyle(x).display),'grid');  // mobile bottom tab bar
  assert.equal(await page.locator('#nav [aria-current="page"]').count(),1);
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.loading-paper span').first().evaluate(x=>getComputedStyle(x).animationName),'none');
  for (const viewport of [{width:360,height:800},{width:768,height:1024}]) {
   await page.setViewportSize(viewport);
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  }
  await page.setViewportSize({width:1440,height:1100});
  for (const view of ['editor','analysis','simulation','library','history']) {
   if(['editor','analysis','simulation'].includes(view))await studioStage(view);else if(view==='history')await activityTab('results');else{await page.locator('#nav [data-view="'+view+'"]').click();await page.waitForFunction(()=>!document.querySelector('#main').inert);}
   assert.equal(await page.locator('body').getAttribute('data-view'),view);
   assert.equal(await page.locator('.page-heading>h1').count(),0);
   assert.equal(await page.locator('.workspace-context').count(),['editor','analysis','simulation','library','history'].includes(view)?0:1);
   if(['editor','analysis','simulation'].includes(view))assert.equal(await page.locator('.ps-bar').count(),1);
  }
  await studioStage('editor');
  await page.locator('[data-article="0"]').fill('Penyelenggara menyediakan layanan digital dan kanal pendampingan untuk warga.');
  await studioStage('simulation');
  assert((await page.locator('#save-state').textContent()).includes('Saved'));
  await page.locator('#ass-population').fill('2000');await page.locator('#ass-digital_access_pct').fill('60');
  await page.locator('#ass-staff_capacity').fill('0');
  await page.locator('#alternative').fill('Pasal 1\nLayanan hanya dapat diajukan melalui aplikasi digital.');
  await page.waitForFunction(()=>!document.querySelector('#ps-compare').disabled);
  await page.locator('#ps-compare').click();
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Check the assumption inputs'));
  await page.locator('#ass-staff_capacity').fill('50');
  await page.locator('#ps-compare').click();await page.waitForFunction(()=>document.querySelector('.scenario')&&!document.querySelector('#main').inert);
  assert.equal(await page.locator('#crumb').textContent(),'Policy Studio · Test impact');
  assert.deepEqual(await page.locator('.scenario .number').allTextContents(),['92%','60%']);
  await studioStage('editor');await studioStage('simulation');
  assert.equal(await page.locator('#ass-population').inputValue(),'2000');
  assert((await page.locator('#alternative').inputValue()).includes('hanya'));
  await page.locator('#ass-population').fill('2500');
  await studioStage('editor');
  await page.locator('[data-article="0"]').fill('Penyelenggara menyediakan layanan digital dan kanal pendampingan untuk seluruh warga.');
  await studioStage('simulation');
  assert.equal(await page.locator('[data-action="apply-alt"]').isDisabled(),true);
  assert((await page.locator('.ps-results .ps-card-head').textContent()).includes('older result'));
  await page.route('**/api/drafts/*/simulate',route=>route.fulfill({status:502,contentType:'application/json',body:JSON.stringify({detail:'Simulasi uji gagal'})}));
  await page.locator('#ps-compare').click();
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Simulasi uji gagal')&&!document.querySelector('#main').inert);
  assert.equal(await page.locator('#ass-population').inputValue(),'2500');
  assert.equal(await page.locator('#crumb').textContent(),'Policy Studio · Test impact');
  await page.unroute('**/api/drafts/*/simulate');
  await page.locator('#ps-compare').click();
  await page.waitForFunction(()=>document.querySelector('.scenario dl')?.textContent.includes('2.300'));
  await page.waitForFunction(()=>!document.querySelector('#main').inert);
  await page.screenshot({path:path.join(temp,'studio-impact.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
  await page.screenshot({path:path.join(temp,'studio-mobile.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:1100});
  await studioStage('editor');
  await page.locator('#ps-insights [data-action="analyze-inline"]').click();
  await page.waitForFunction(()=>document.querySelector('#ps-insights .ps-ins-meta')&&!document.querySelector('#main').inert);
  assert.equal(await page.locator('#crumb').textContent(),'Policy Studio · Draft');
  await page.setViewportSize({width:1440,height:1100});
  await studioStage('analysis');
  // Filters exist only when the latest check has findings; an empty check says so explicitly.
  if(await page.locator('.ps-finding-item').count()){
   await page.locator('[data-action="filter-findings"][data-filter="high"]').click();
   assert.equal(await page.locator('[data-filter="high"]').getAttribute('aria-pressed'),'true');
   await page.locator('[data-action="filter-findings"][data-filter="all"]').click();
  }else assert((await page.locator('#workflow-stage-content .note.green').textContent()).includes('No problem patterns'));
  await page.locator('#nav [data-view="library"]').click();await page.locator('#library-tab-passages').click();await page.locator('[data-action="reset"]').click();await page.locator('#library-tab-documents').click();
  await choose('library-type','PP');await page.waitForFunction(()=>{const codes=[...document.querySelectorAll('.lib-doc small')];return codes.length>0&&codes.every(x=>x.textContent.startsWith('PP '));},null,{timeout:15000});
  await choose('library-type','');await page.waitForSelector('.lib-doc');assert(await page.locator('.lib-doc').count()>0,'Library must list documents');
  await activityTab('results');await choose('activity-kind','simulation');
  await page.waitForFunction(()=>!document.querySelector('#main').inert);
  assert((await page.locator('#activity-timeline [data-item^="run:"] .act-copy b').allTextContents()).every(x=>/simulation/i.test(x)));
  await page.locator('#activity-timeline [data-item^="run:"]').first().click();await page.waitForSelector('#activity-detail .act-ab-grid');
  await choose('activity-kind','all');await page.waitForFunction(()=>!document.querySelector('#main').inert);
  await page.locator('.act-head [data-action="activity-sheet"]').click();await page.waitForSelector('.act-sheet');
  let submission;page.on('request',request=>{if(request.url().endsWith('/agent-jobs')&&request.method()==='POST')submission={url:request.url(),body:request.postDataJSON(),key:request.headers()['idempotency-key']};});
  await choose('agent-intent','full');await page.locator('#agent-alternative').fill((await page.locator('#agent-alternative').inputValue())+'\n\nPasal 9\nPetugas pendamping tersedia di setiap kantor desa.');
  await page.locator('.act-sheet [data-action="start-agent"]').click();
  await page.waitForFunction(()=>document.querySelector('#activity-detail .act-detail-head .status-badge')?.textContent==='Done',null,{timeout:60000});
  assert.equal(await page.locator('#crumb').textContent(),'Activity');
  assert.equal(await page.locator('#activity-detail .act-outputs .act-item').count(),2);
  assert((await page.locator('#activity-detail .act-trace').textContent()).includes('Search sources'));
  const repeated=await page.request.post(submission.url,{headers:{'Idempotency-Key':submission.key},data:submission.body});
  assert.equal(repeated.status(),202);
  await page.locator('[data-action="refresh-agents"]').click();await page.waitForFunction(()=>!document.querySelector('#main').inert);
  await page.locator('#activity-detail .act-outputs .act-item').first().click();await page.waitForSelector('#activity-detail .act-review');
  await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:path.join(temp,'enterprise-agents-mobile.png'),fullPage:true});
  await page.goto(origin+'/workspace?view=agents');await page.waitForSelector('#activity-detail .act-detail-head');
  assert.equal(await page.locator('#activity-detail .act-detail-head .status-badge').textContent(),'Done');
  await page.setViewportSize({width:1440,height:1100});
  await page.locator('[data-action="audit"]').click();await page.waitForSelector('#modal table');
  assert((await page.locator('#modal').textContent()).includes('agent-jobs'));
  await page.locator('#modal [data-action="close"]').first().click();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'passed', flows: ['landing/workspace navigation', 'skeleton and loading dialog', 'analysis loading/double click guard', 'search error recovery', 'all menu contexts and home responsiveness', 'reduced motion', 'local fonts and crimson theme', 'legal guide and change candidates', 'as-of date judgment', 'edit/save', 'analysis', 'source', 'revision/stale guard', 'simulation', 'apply alternative', 'DOCX download', 'review/history', 'search', 'compare', 'generate', 'import', 'XSS escaping', 'mobile/tablet navigation and layout', 'Test impact keeps B and assumptions across stages', 'check from the insights rail', 'assumption validation and persistence', 'dirty draft invalidation', 'simulation error and retry', 'menu filters and historical result details','agent execution from Activity and source trace','agent idempotency and reload persistence','agent workspace/mobile/results','audit workspace'], screenshots: temp }, null, 2));
 } catch (err) { console.error(err); process.exitCode = 1; }
 finally { if (browser) await browser.close(); server.kill(); }
})();
