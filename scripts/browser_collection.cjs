const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'rulelab-collection-'));
const out=path.join(root,'artifacts','collection-qa');fs.mkdirSync(out,{recursive:true});
const origin='http://127.0.0.1:8059';
const server=spawn(process.env.RULELAB_PYTHON||'python3',['-m','uvicorn','app.main:app','--port','8059'],{cwd:root,env:{...process.env,DATABASE_URL:'',RULELAB_SOURCES_BUCKET:'',AI_PROVIDER:'demo',SEARCH_BACKEND:'sqlite',RULELAB_DB:path.join(tmp,'db.sqlite'),RULELAB_API_TOKEN:'',RULELAB_ACCESS_KEYS:'[]'},stdio:'ignore'});
(async()=>{let browser,page;const errors=[],checks=[],network=[];
 try{
  for(let i=0;i<1200;i++){try{if((await fetch(origin+'/api/health')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({headless:true});page=await browser.newPage({viewport:{width:1600,height:1100},acceptDownloads:true,bypassCSP:true});page.setDefaultTimeout(120000);
  page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>network.push(request.url()));
  const settled=()=>page.waitForFunction(()=>document.querySelector('#main')?.getAttribute('aria-busy')==='false');
  const loaded=selector=>page.waitForFunction(selector=>document.querySelector(selector)?.getAttribute('aria-busy')==='false',selector);
  const click=async selector=>{await page.locator(selector).first().click();if(await page.locator('#main').count())await settled();};
  const choose=async(id,value)=>{
   const select=page.locator('#'+id);const trigger=page.locator('#'+id+'-trigger');
   if(await trigger.count()){
    const label=await select.evaluate((el,value)=>[...el.options].find(option=>option.value===value).text,value);
    await trigger.click();const popup=page.locator('.rl-select-popup:popover-open');if(await popup.locator('input').isVisible())await popup.locator('input').fill(label);await popup.getByRole('option',{name:label,exact:true}).click();
   }else await select.selectOption(value);
  };
  const screenshot=async name=>{await page.evaluate(()=>document.fonts.ready);if(name==='source-channels')await page.locator('.collection-intake').screenshot({path:path.join(out,name+'.png'),animations:'disabled',timeout:120000});else if(name==='landing-map'){await page.locator('#koleksi').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,name+'.png'),animations:'disabled',timeout:120000});}else await page.screenshot({path:path.join(out,name+'.png'),animations:'disabled',timeout:120000});};
  const fit=async name=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow');
  await page.goto(origin+'/#koleksi');await loaded('#landing-collection');
  assert.equal(await page.locator('#landing-collection .province-shape').count(),38);
  const summary=(await (await fetch(origin+'/api/public/collection')).json()).summary,digits=t=>t.replace(/[^0-9/]/g,'');
  // Counts follow the live corpus (it grows as JDIH sources are ingested), not fixed numbers.
  assert.deepEqual((await page.locator('#landing-collection .collection-stats strong').allTextContents()).map(digits),[String(summary.unique_regulations),String(summary.documents),String(summary.articles),`${summary.mapped_provinces}/${summary.province_total}`]);
  assert.equal(await page.locator('#landing-collection .province-shape[data-count="0"]').count(),summary.province_total-summary.mapped_provinces);
  assert(await page.locator('#landing-collection .collection-map').evaluate(svg=>{const group=svg.querySelector('g').getBBox();return group.width>svg.viewBox.baseVal.width*.8&&group.height>svg.viewBox.baseVal.height*.7;}),'Map must fit Indonesia, not a world-sized polygon complement');
  await page.locator('#landing-collection .province-shape[data-province="32"]').focus();await page.keyboard.press('Enter');
  assert((await page.locator('#landing-collection [data-region-content]').textContent()).includes('Jawa Barat'));
  await choose('landing-collection-province','');await screenshot('landing-map');
  await choose('landing-collection-kind','PP');await loaded('#landing-collection');{const pp=(await (await fetch(origin+'/api/public/collection?kind=PP')).json()).summary.unique_regulations;assert.equal((await page.locator('#landing-collection .collection-stats strong').first().textContent()).replace(/[^0-9]/g,''),String(pp));}
  await choose('landing-collection-kind','');await loaded('#landing-collection');
  await choose('landing-collection-mode','mentions');await loaded('#landing-collection');await choose('landing-collection-province','unmapped');assert(/^\d/.test((await page.locator('#landing-collection .collection-region-number').textContent()).trim()),'Unmapped count must be a number');
  await choose('landing-collection-mode','issuer');await loaded('#landing-collection');await choose('landing-collection-province','');
  const map=page.locator('#landing-collection .collection-map-land');const before=await map.getAttribute('transform');await click('#landing-collection [data-map-zoom="in"]');assert.notEqual(await map.getAttribute('transform'),before);await click('#landing-collection [data-map-zoom="reset"]');assert.equal(await map.getAttribute('transform'),before);
  for(const width of [360,390,768,1440]){await page.setViewportSize({width,height:1100});await fit('landing '+width);await page.locator('#koleksi').scrollIntoViewIfNeeded();if(width===390)await screenshot('landing-map-mobile');}
  checks.push('38 published province shapes, live corpus counts, keyboard province selection, filters, unmapped metadata, zoom/reset and responsive landing');
  await page.setViewportSize({width:1600,height:1100});await click('.collection-dashboard-link');await loaded('#collection-dashboard');
  assert.equal(await page.locator('#nav [data-view="data"]').getAttribute('aria-current'),'page');
  {const s=(await (await fetch(origin+'/api/public/collection')).json()).summary;assert.equal(await page.locator('.dd-kpis strong').first().getAttribute('data-value'),String(s.unique_regulations));
   await click('#dd-tab-explore');await page.waitForSelector('.dd-table .dd-row');assert.equal(await page.locator('.dd-row').count(),Math.min(25,s.documents));assert((await page.locator('.dd-count').textContent()).startsWith(new Intl.NumberFormat('id-ID').format(s.documents)+' documents'));}
  await screenshot('dashboard-collection');
  await click('.dd-row');assert.equal(await page.locator('.gallery-reader').count(),1);assert((await page.locator('#crumb').textContent()).includes('Legal library'));
  await click('#nav [data-view="data"]');await loaded('#collection-dashboard');
  await click('#dd-tab-overview');await click('[data-dd-add]');await click('.dd-menu [data-action="collection-upload"]');
  await choose('intake-kind','PERDA_KAB');await page.locator('#intake-title').fill('Pengelolaan Perikanan Kota Bandung');await page.locator('#intake-number').fill('3');await choose('intake-province','32');await choose('intake-scope','district');await page.locator('#intake-district').fill('Kota Bandung');
  const source='Pasal 1\nNelayan dapat memperoleh pendampingan.\n\nPasal 2\nPemerintah menyediakan informasi.';
  await page.locator('#intake-file').setInputFiles({name:'perda-bandung.txt',mimeType:'text/plain',buffer:Buffer.from(source)});await click('[data-action="collection-submit"]');await loaded('#collection-dashboard');
  assert.equal(await page.locator('[data-dd-tab-count="queue"]').textContent(),'1');
  await click('#dd-tab-queue');assert.equal(await page.locator('.collection-intake-row').count(),1);await screenshot('source-channels');
  await click('.collection-intake-row');assert((await page.locator('.intake-preview').textContent()).includes('Nelayan dapat memperoleh pendampingan'));
  const download=page.waitForEvent('download');await click('[data-action="collection-raw"]');const file=await download;assert.equal(file.suggestedFilename(),'perda-bandung.txt');const downloaded=path.join(out,'uploaded-source.txt');await file.saveAs(downloaded);assert.equal(fs.readFileSync(downloaded,'utf8'),source);await click('[data-action="close"]');
  await click('.collection-source-card[data-action="collection-jdih"]');await choose('intake-kind','PERDA_KAB');await page.locator('#intake-title').fill('Sumber JDIH untuk pemeriksaan');await page.locator('#intake-number').fill('4');await choose('intake-province','32');await choose('intake-scope','district');await page.locator('#intake-district').fill('Kota Bandung');await page.locator('#intake-url').fill('https://jdih.bandung.go.id/dokumen/perda.pdf');await click('[data-action="collection-submit"]');await loaded('#collection-dashboard');
  assert.equal(await page.locator('.collection-intake-row').count(),2);
  assert((await page.locator('.collection-intake-list').textContent()).includes('Waiting for retrieval'));
  await click('#dd-tab-overview');await choose('data-collection-layer','intake');await choose('data-collection-province','32');
  assert((await page.locator('[data-region-content]').textContent()).includes('2 queued sources'));
  assert.equal(await page.locator('.province-shape[data-province="32"]').getAttribute('data-count'),'2');
  await click('[data-district="Kota Bandung"]');assert.equal(await page.locator('[data-district="Kota Bandung"]').getAttribute('aria-pressed'),'true');
  await page.locator('.collection-map-panel').scrollIntoViewIfNeeded();await screenshot('dashboard-intake-map');
  await page.reload();await loaded('#collection-dashboard');assert.equal(await page.locator('[data-dd-tab-count="queue"]').textContent(),'2');assert.equal(await page.locator('#data-collection-layer').inputValue(),'intake');assert.equal(await page.locator('#data-collection-province').inputValue(),'32');assert((await page.locator('[data-region-content]').textContent()).includes('2 queued sources'));await choose('data-collection-layer','corpus');await choose('data-collection-province','');assert.equal(await page.locator('.dd-rank-national strong').textContent(),new Intl.NumberFormat('id-ID').format((await (await fetch(origin+'/api/public/collection')).json()).summary.national));
  const publicResponse=await page.request.get(origin+'/api/public/collection');const publicData=await publicResponse.json();assert.equal(publicData.summary.documents,summary.documents);assert(!('intake' in publicData));{const raw=JSON.stringify(publicData);assert(!raw.includes('Pengelolaan Perikanan Kota Bandung')&&!raw.includes('Sumber JDIH untuk pemeriksaan')&&!raw.includes('jdih.bandung.go.id'),'Queued intake data must not appear in public data');}
  assert(!network.some(url=>url.startsWith('https://jdih.bandung.go.id')),'Queued JDIH link must not trigger an unrequested fetch');
  checks.push('dashboard navigation, actual gallery documents, source upload/extraction/download, JDIH queue, province/district drill-down, persistence and public/private separation');
  for(const width of [360,390,768,1440]){await page.setViewportSize({width,height:1100});await fit('dashboard '+width);if(width===390){await page.locator('.collection-map-panel').scrollIntoViewIfNeeded();await screenshot('dashboard-mobile');}}
  const cspPage=await browser.newPage({viewport:{width:1440,height:1000}});const cspErrors=[];cspPage.on('pageerror',error=>cspErrors.push(error.message));await cspPage.goto(origin+'/#koleksi');await cspPage.waitForSelector('#landing-collection .province-shape');assert.equal(await cspPage.locator('#landing-collection .province-shape').count(),38);assert.deepEqual(cspErrors,[]);await cspPage.close();checks.push('landing modules and local map assets run under the production CSP without bypass');
  assert.deepEqual(errors,[]);console.log(JSON.stringify({status:'passed',checks,screenshots:out},null,2));
 }catch(error){console.error('Page errors:',errors);if(page)console.error('Collection:',await page.locator('#landing-collection').getAttribute('aria-busy').catch(()=>null),await page.locator('#landing-collection').textContent().catch(()=>''));if(page)await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});console.error(error);process.exitCode=1;}
 finally{await browser?.close();server.kill();}
})();
