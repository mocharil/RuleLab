/* Verify the drafting workflow as one menu, including persistence and save failure recovery. */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'rulelab-studio-'));
const out=path.join(root,'artifacts/studio-qa');fs.mkdirSync(out,{recursive:true});
const origin='http://127.0.0.1:8061';
const server=spawn(process.env.RULELAB_PYTHON||'python3',['-m','uvicorn','app.main:app','--port','8061'],{
 cwd:root,env:{...process.env,RULELAB_DB:path.join(temp,'qa.sqlite3'),AI_PROVIDER:'demo',SEARCH_BACKEND:'sqlite',RULELAB_API_TOKEN:'',RULELAB_ACCESS_KEYS:'[]'},stdio:'ignore',
});
(async()=>{
 let browser,page;const errors=[],checks=[];
 try{
  let ready=false;for(let i=0;i<1200;i++){try{ready=(await fetch(origin+'/api/health')).ok;if(ready)break;}catch{}await new Promise(resolve=>setTimeout(resolve,100));}assert(ready);
  browser=await chromium.launch({headless:true,executablePath:process.env.RULELAB_CHROMIUM||undefined});
  page=await browser.newPage({viewport:{width:1440,height:1100},acceptDownloads:true,timezoneId:'Asia/Jakarta'});
  page.on('pageerror',error=>errors.push(error.message));
  const settled=()=>page.locator('#main[aria-busy="false"]').waitFor({state:'attached'});
  const click=async selector=>{await page.locator(selector).first().click();await settled();};
  const shot=async name=>{await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(out,name+'.png'),animations:'disabled'});};
  for(const [old,stage] of [['editor','editor'],['analysis','analysis'],['simulation','simulation'],['social','simulation']]){
   await page.goto(origin+'/workspace?view='+old);await page.waitForSelector('.ps-steps');await settled();
   assert.equal(new URL(page.url()).searchParams.get('view'),'studio');
   assert.equal(new URL(page.url()).searchParams.get('stage'),stage);
   assert.equal(await page.locator('#nav [data-view="studio"]').count(),1);
   assert.equal(await page.locator('#nav [data-view="editor"],#nav [data-view="analysis"],#nav [data-view="simulation"]').count(),0);
   assert.equal(await page.locator('#workflow-stage-'+stage).getAttribute('aria-selected'),'true');
   assert.equal(await page.locator('#workflow-stage-content').getAttribute('aria-labelledby'),'workflow-stage-'+stage);
  }
  await click('#workflow-stage-editor');
  const draftId=new URL(page.url()).searchParams.get('draft');
  const before=await (await page.request.get(origin+'/api/drafts/'+draftId)).json();
  await page.locator('#draft-title').fill('Studio layanan inklusif');
  await page.locator('[data-article="0"]').fill('Penyelenggara menyediakan pelayanan digital dan kanal pendampingan bagi warga.');
  assert((await page.locator('#workflow-stage-editor').textContent()).includes('Not saved'));
  await page.locator('#workflow-stage-editor').focus();await page.keyboard.press('ArrowRight');await settled();
  assert.equal(await page.locator('#workflow-stage-analysis').getAttribute('aria-selected'),'true');
  assert.equal(await page.locator('#workflow-stage-analysis').evaluate(el=>el===document.activeElement),true);
  const saved=await (await page.request.get(origin+'/api/drafts/'+draftId)).json();
  assert.equal(saved.title,'Studio layanan inklusif');assert.equal(saved.revision,before.revision+1);
  await click('.ps-bar [data-action="analyze"]');assert(await page.locator('.finding').count()>0);
  assert((await page.locator('#workflow-stage-analysis').textContent()).includes('findings'));
  await shot('studio-review');
  await click('#workflow-stage-simulation');await click('[data-section="projection"]');
  await page.locator('#ass-population').fill('2500');
  const alternative=await page.locator('#alternative').inputValue();
  await page.locator('#alternative').fill(alternative+'\nPendampingan disediakan untuk warga yang menghadapi hambatan akses.');
  await click('#workflow-stage-editor');assert.equal(await page.locator('#draft-title').inputValue(),'Studio layanan inklusif');
  await shot('studio-draft');
  await click('#workflow-stage-simulation');
  assert.equal(await page.locator('#ass-population').inputValue(),'2500');
  assert((await page.locator('#alternative').inputValue()).includes('Pendampingan disediakan'));
  await click('#ps-compare');assert.equal(await page.locator('.scenario').count(),2);
  assert((await page.locator('#workflow-stage-simulation').textContent()).includes('A/B v'));
  await shot('studio-impact');
  await click('#workflow-stage-analysis');await page.goBack();await settled();
  assert.equal(await page.locator('#workflow-stage-simulation').getAttribute('aria-selected'),'true');
  await page.goForward();await settled();assert.equal(await page.locator('#workflow-stage-analysis').getAttribute('aria-selected'),'true');
  await page.reload();await page.waitForSelector('.finding');await settled();
  assert.equal(await page.locator('#workflow-stage-analysis').getAttribute('aria-selected'),'true');
  checks.push('one Studio menu, legacy aliases, keyboard focus, autosave, bound review/simulation, preserved assumptions and Back/Forward/reload');
  await click('#workflow-stage-editor');await page.locator('#draft-title').fill('Perubahan yang belum berhasil disimpan');
  await page.route('**/api/drafts/'+draftId,route=>route.request().method()==='PUT'?route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({detail:'Fixture: penyimpanan belum tersedia.'})}):route.continue());
  await click('#workflow-stage-analysis');
  assert.equal(await page.locator('#workflow-stage-editor').getAttribute('aria-selected'),'true');
  assert.equal(await page.locator('#draft-title').inputValue(),'Perubahan yang belum berhasil disimpan');
  assert((await page.locator('#save-state').textContent()).includes('Not saved'));
  await page.unroute('**/api/drafts/'+draftId);await click('#workflow-stage-analysis');
  assert.equal(await page.locator('#workflow-stage-analysis').getAttribute('aria-selected'),'true');
  assert((await page.locator('#workflow-stage-analysis').textContent()).includes('older result'));
  await click('#nav [data-view="library"]');await click('#nav [data-view="studio"]');
  assert.equal(await page.locator('#workflow-stage-analysis').getAttribute('aria-selected'),'true');
  checks.push('failed save retains the draft/stage; retry saves safely, marks old results and resumes the last Studio stage');
  await page.keyboard.press('Control+k');await page.getByRole('combobox',{name:'Search menu'}).fill('netizen');
  assert.equal(await page.getByRole('option').count(),1);await page.keyboard.press('Enter');await settled();
  await page.waitForURL(/sub=social/);assert.equal(new URL(page.url()).searchParams.get('sub'),'social');
  assert.equal(await page.locator('#workflow-stage-simulation').getAttribute('aria-selected'),'true');
  await click('[data-section="unified"]');assert.equal(await page.locator('.synthesis-stats .stat-box').count(),3);
  for(const width of [360,390,768,1440]){
   await page.setViewportSize({width,height:1000});
   for(const stage of ['editor','analysis','simulation']){
    await click('#workflow-stage-'+stage);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),stage+' overflows at '+width);
    if(width===390)await shot('studio-'+stage+'-mobile');
   }
  }
  checks.push('one command destination opens the requested forum stage; all stages fit 360/390/768/1440px');
  const viewer=await browser.newPage({viewport:{width:1440,height:1000}});
  const status=await (await page.request.get(origin+'/api/status')).json();
  await viewer.route('**/api/status',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({...status,principal:{id:'fixture-viewer',role:'viewer'}})}));
  await viewer.goto(origin+'/workspace?view=studio');await viewer.waitForSelector('#draft-title');
  assert(await viewer.locator('#draft-title').isDisabled());
  await viewer.locator('#workflow-stage-analysis').click();await viewer.locator('#main[aria-busy="false"]').waitFor({state:'attached'});
  assert(await viewer.locator('.ps-bar [data-action="analyze"]').isDisabled());
  await viewer.locator('#workflow-stage-simulation').click();await viewer.locator('#main[aria-busy="false"]').waitFor({state:'attached'});
  assert(await viewer.locator('#ps-compare').isDisabled());await viewer.close();
  assert.deepEqual(errors,[]);checks.push('viewer navigation remains available while draft editing, review and simulation actions stay disabled');
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({status:'passed',checks,errors},null,2));
  console.log(JSON.stringify({status:'passed',checks,screenshots:out},null,2));
 }catch(error){if(page)await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});console.error(error);process.exitCode=1;}
 finally{await browser?.close();server.kill();fs.rmSync(temp,{recursive:true,force:true});}
})();
