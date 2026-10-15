/* Exercise the consolidated library with real local sources and the production CSP. */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'rulelab-library-'));
const out=path.join(root,'artifacts/library-qa');fs.mkdirSync(out,{recursive:true});
const origin='http://127.0.0.1:8057';
const server=spawn(process.env.RULELAB_PYTHON||'python3',['-m','uvicorn','app.main:app','--port','8057'],{
 cwd:root,env:{...process.env,RULELAB_DB:path.join(temp,'qa.sqlite3'),AI_PROVIDER:'demo',SEARCH_BACKEND:'sqlite',RULELAB_API_TOKEN:'',RULELAB_ACCESS_KEYS:'[]'},stdio:'ignore',
});
(async()=>{
 let browser,page;const checks=[],errors=[];
 try{
  let ready=false;
  for(let i=0;i<1200;i++){try{ready=(await fetch(origin+'/api/health')).ok;if(ready)break;}catch{}await new Promise(resolve=>setTimeout(resolve,100));}
  assert(ready,'Demo server must start');
  browser=await chromium.launch({headless:true,executablePath:process.env.RULELAB_CHROMIUM||undefined});
  page=await browser.newPage({viewport:{width:1440,height:1100},acceptDownloads:true,timezoneId:'Asia/Jakarta'});page.setDefaultTimeout(120000);
  page.on('pageerror',error=>errors.push(error.message));
  const settled=()=>page.locator('#main[aria-busy="false"]').waitFor({state:'attached'});
  const click=async selector=>{await page.locator(selector).first().click();await settled();};
  const shot=async name=>{await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(out,name+'.png'),animations:'disabled'});};
  const choose=async(id,name)=>{
   await page.locator('#'+id+'-trigger').click();const popup=page.locator('.rl-select-popup:popover-open');
   await popup.waitFor();if(await popup.locator('input').count())await popup.locator('input').fill(name);
   await popup.getByRole('option',{name,exact:true}).click();await settled();
  };
  const search=async query=>{await page.locator('#search-q').fill(query);await page.locator('#search-form').evaluate(form=>form.requestSubmit());await settled();};
  for(const [old,tab] of [['gallery','documents'],['corpus','passages']]){
   await page.goto(origin+'/workspace?view='+old);await page.waitForSelector('#main h1');await settled();
   assert.equal(new URL(page.url()).searchParams.get('view'),'library');
   assert.equal(await page.locator('#library-tab-'+tab).getAttribute('aria-selected'),'true');
   assert.equal(await page.locator('#nav [data-view="library"]').count(),1);
   assert.equal(await page.locator('#nav [data-view="corpus"],#nav [data-view="gallery"]').count(),0);
  }
  await click('#library-tab-documents');
  assert(await page.locator('.gallery-card').count()>0,'Gallery must list documents');
  await shot('library-documents');
  // The collection is paginated and keeps growing: search for the document before opening it.
  await page.locator('#gallery-search').fill('Pelayanan Publik');await page.waitForTimeout(500);await settled();
  await click('[data-action="gallery-open"][data-id="uu-25-2009"]');
  await choose('gallery-article','Pasal 4');
  await page.locator('#gallery-question').fill('Jelaskan Pasal 4 untuk pemula.');
  await click('#library-tab-passages');await click('#library-tab-documents');
  assert.equal(await page.locator('#gallery-article').inputValue(),'4');
  assert.equal(await page.locator('#gallery-question').inputValue(),'Jelaskan Pasal 4 untuk pemula.');
  await page.locator('#library-tab-documents').focus();await page.keyboard.press('ArrowRight');await settled();
  assert.equal(await page.locator('#library-tab-passages').getAttribute('aria-selected'),'true');
  assert.equal(await page.locator('#library-tab-passages').evaluate(el=>el===document.activeElement),true);
  await search('pengaduan');
  const hits=await (await page.request.get(origin+'/api/search?q=pengaduan')).json();
  assert(hits.results.length>0);
  const first=hits.results[0];
  assert.equal(await page.locator('.library-passage-result').count(),hits.results.length);
  await shot('library-passages');
  await click('[data-action="library-read-source"]');
  assert.equal(await page.locator('#gallery-article').inputValue(),first.number);
  assert.equal(new URL(page.url()).searchParams.get('doc'),first.regulation_id);
  await page.goBack();await settled();assert.equal(await page.locator('#library-tab-passages').getAttribute('aria-selected'),'true');
  await page.goForward();await settled();assert.equal(await page.locator('#gallery-article').inputValue(),first.number);
  await page.reload();await page.waitForSelector('#gallery-article-trigger');await settled();
  assert.equal(await page.locator('#gallery-article').inputValue(),first.number);
  checks.push('one navigation entry, legacy URL aliases, keyboard tabs, exact article context, Back/Forward and reload');
  await click('#library-tab-passages');await search('pengaduan');
  await page.route('**/api/search?*',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({detail:'Fixture: pencarian belum tersedia.'})}));
  await search('topik gagal');assert.equal(await page.locator('#search-q').inputValue(),'topik gagal');
  assert((await page.locator('.library-result-count').textContent()).includes('pengaduan'));
  await page.unroute('**/api/search?*');
  await click('[data-action="library-ask-source"]');
  assert.equal(await page.locator('#gallery-question').evaluate(el=>el===document.activeElement),true);
  assert((await page.locator('#gallery-question').inputValue()).includes('Article '+first.number));
  await page.locator('#gallery-chat-form').evaluate(form=>form.requestSubmit());await settled();
  assert.equal(await page.locator('.gallery-chat-turn').count(),1);
  await click('#library-tab-passages');await click('#library-tab-documents');
  assert.equal(await page.locator('.gallery-chat-turn').count(),1);
  await click('.page-heading [data-action="compare"]');
  assert.equal(await page.locator('#cmp-left').inputValue(),first.regulation_id);
  assert.equal(await page.locator('#art-left').inputValue(),first.number);
  assert(/(Pasal|Article) /.test(await page.locator('#art-left-trigger').textContent())&&(await page.locator('#art-left-trigger').textContent()).includes(first.number));
  await click('[data-action="run-compare"]');await page.waitForSelector('.relation');await click('#modal [data-action="close"]');
  for(const action of ['raw','law-json']){const pending=page.waitForEvent('download');await click('#gallery-reader [data-action="'+action+'"]');assert((await pending).suggestedFilename().length>0);}
  await shot('library-reader');
  checks.push('search errors retain truthful result labels; ask, chat persistence, comparison context and source downloads');
  for(const width of [360,390,768,1440]){
   await page.setViewportSize({width,height:1000});
   for(const tab of ['documents','passages']){
    await click('#library-tab-'+tab);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow at '+width+' '+tab);
    if(width===390)await shot('library-'+tab+'-mobile');
   }
  }
  await page.keyboard.press('Control+k');await page.getByRole('combobox',{name:'Search menu'}).fill('galeri');
  assert.equal(await page.getByRole('option').count(),1);await page.keyboard.press('Enter');await settled();
  checks.push('both library tabs fit 360/390/768/1440px; old menu terminology finds the single command destination');
  // A disposable fixture tests pagination at a larger collection size without modifying the corpus.
  const corpus=await (await page.request.get(origin+'/api/corpus')).json();
  const fixture=Array.from({length:13},(_,index)=>({...corpus[0],id:'fixture-'+index}));
  const fixturePage=await browser.newPage({viewport:{width:1440,height:1000}});
  await fixturePage.route('**/api/corpus',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(fixture)}));
  await fixturePage.goto(origin+'/workspace?view=library');await fixturePage.waitForSelector('.library-document-pagination');
  assert.equal(await fixturePage.locator('.gallery-card').count(),12);
  await fixturePage.locator('[data-action="library-doc-page"][data-page="2"]').click();
  assert.equal(await fixturePage.locator('.gallery-card').count(),1);await fixturePage.close();
  assert.deepEqual(errors,[]);
  checks.push('document pagination handles 13 source records in an isolated fixture');
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({status:'passed',checks,errors},null,2));
  console.log(JSON.stringify({status:'passed',checks,screenshots:out},null,2));
 }catch(error){if(page)await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});console.error(error);process.exitCode=1;}
 finally{await browser?.close();server.kill();fs.rmSync(temp,{recursive:true,force:true});}
})();
