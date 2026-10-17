/* Activity: real agent runs and API, production CSP, timeline + detail, review history, versions, routes and responsive layout. */
const {chromium}=require('playwright'),{spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'rulelab-activity-')),out=path.join(root,'artifacts/activity-qa'),origin='http://127.0.0.1:8062';fs.mkdirSync(out,{recursive:true});
const server=spawn(process.env.RULELAB_PYTHON||'python3',['-m','uvicorn','app.main:app','--port','8062'],{cwd:root,env:{...process.env,RULELAB_DB:path.join(temp,'qa.sqlite3'),AI_PROVIDER:'demo',SEARCH_BACKEND:'sqlite',RULELAB_API_TOKEN:'',RULELAB_ACCESS_KEYS:'[]',DATABASE_URL:'',RULELAB_SOURCES_BUCKET:''},stdio:'ignore'});
(async()=>{let browser,page;const checks=[],errors=[];try{
 let ready=false;for(let i=0;i<1200;i++){try{ready=(await fetch(origin+'/api/health')).ok;if(ready)break;}catch{}await new Promise(r=>setTimeout(r,100));}assert(ready);
 browser=await chromium.launch({headless:true});page=await browser.newPage({viewport:{width:1440,height:1100},timezoneId:'Asia/Jakarta',acceptDownloads:true});page.on('pageerror',e=>errors.push(e.message));
 const settled=()=>page.locator('#main[aria-busy="false"]').waitFor({state:'attached'}),click=async s=>{await page.locator(s).first().click();await settled();};
 const param=k=>new URL(page.url()).searchParams.get(k),selected=()=>page.locator('#activity-timeline [aria-current="true"]').getAttribute('data-item');
 const chips=async()=>Object.fromEntries(await page.locator('.act-chip').evaluateAll(els=>els.map(e=>[e.dataset.status,Number(e.querySelector('span').textContent)])));
 const finished=()=>page.waitForFunction(()=>document.querySelector('#activity-detail .act-detail-head .status-badge')?.textContent==='Done',null,{timeout:60000});
 const shot=async name=>{await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(out,name+'.png'),animations:'disabled'});};
 for(const route of ['history','agents','activity','activity&tab=agents']){
  await page.goto(origin+'/workspace?view='+route);await page.waitForSelector('.act');await settled();
  assert.equal(param('view'),'activity');assert.equal(param('tab'),null);assert.equal(await page.locator('#nav [data-view="activity"]').getAttribute('aria-current'),'page');assert.equal(await page.locator('#main h1').textContent(),'Activity');
 }
 assert.deepEqual(await chips(),{needs:0,reviewed:0,outdated:0,all:0});assert.equal(await page.locator('.act-empty').count(),1);await shot('activity-empty');
 checks.push('old history/agents URLs land on one Activity page with an empty-state call to action');
 await click('.act-head [data-action="activity-sheet"]');await page.locator('#agent-intent').selectOption('full',{force:true});await click('.act-sheet [data-action="start-agent"]');
 assert((await page.locator('#toast').textContent()).includes('identical'));
 await page.locator('#agent-intent').selectOption('legal',{force:true});await click('.act-sheet [data-action="start-agent"]');await finished();
 assert((await selected()).startsWith('job:'));assert.equal(param('item'),await selected());assert.equal(await page.locator('#activity-detail .act-outputs .act-item').count(),1);
 assert.deepEqual(await chips(),{needs:1,reviewed:0,outdated:0,all:1});await shot('activity-agent-run');
 checks.push('run sheet refuses an identical B, starts a legal run, selects it and nests its result');
 await click('#activity-detail .act-outputs .act-item');assert((await page.locator('#activity-detail h2').textContent()).match(/finding/));
 await page.locator('.act-seg label',{hasText:'Reviewed with notes'}).click();await page.locator('#review-notes').fill('Verifikasi sumber dan konsultasi dengan warga diperlukan.');await click('[data-action="save-review"]');
 assert.deepEqual(await chips(),{needs:0,reviewed:1,outdated:0,all:1});assert.equal(await page.locator('.act-review-history li').count(),1);
 await page.locator('.act-seg label',{hasText:'Still needs review'}).click();await page.locator('#review-notes').fill('Dibuka kembali: perlu cek PP 96/2012.');await click('[data-action="save-review"]');
 await page.locator('.act-review-history summary').click();assert.deepEqual(await page.locator('.act-review-history li b').allTextContents(),['Needs review','Reviewed with notes']);
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('.act-head [data-action="report"]').click()]);assert.equal(download.suggestedFilename(),'rulelab-review.docx');await settled();
 checks.push('review decisions are appended with reviewer and time; report downloads from the header');
 const draft=(await (await page.request.get(origin+'/api/drafts')).json())[0],full=await (await page.request.get(origin+'/api/drafts/'+draft.id)).json();
 await page.request.put(origin+'/api/drafts/'+draft.id,{data:{...full,articles:full.articles.map((a,i)=>i===0?{...a,text:a.text+' Layanan pendampingan tersedia.'}:a),expected_revision:full.revision}});
 await page.goto(origin+'/workspace?view=activity&status=all');await page.waitForSelector('.act-item');await settled();
 assert.equal((await chips()).outdated,1);await click('#activity-timeline [data-item="version:2"]');assert(await page.locator('#activity-detail .act-diff ins').count());
 await page.reload();await page.waitForSelector('.act-item');await settled();assert.equal(await selected(),'version:2');
 await page.locator('body').click({position:{x:5,y:600}});await page.keyboard.press('j');await settled();assert.notEqual(await selected(),'version:2');
 checks.push('draft edits mark results Outdated, versions show a word diff, deep links survive reload, J moves the selection');
 await page.keyboard.press('Control+k');await page.getByRole('combobox',{name:'Search menu'}).fill('agents');await page.keyboard.press('Enter');await settled();await page.waitForTimeout(300);
 assert.equal(param('view'),'activity');assert((await selected()).startsWith('job:'));
 checks.push('command menu “agents” opens the latest agent run');
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:1000});await page.goto(origin+'/workspace?view=activity&status=all');await page.waitForSelector('.act-item');await settled();
  for(const key of await page.locator('#activity-timeline [data-item]').evaluateAll(els=>els.map(e=>e.dataset.item))){
   await click(`#activity-timeline [data-item="${key}"]`);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),key+' overflow '+width);
   if(width<=760){assert(await page.locator('#activity-detail').isVisible());if(width===390&&key.startsWith('run:'))await shot('activity-detail-mobile');await click('[data-action="activity-back"]');}
  }
  if(width===390){const nav=await page.locator('#nav').boundingBox(),active=await page.locator('#nav [aria-current=page]').boundingBox();assert(active.x>=nav.x-1&&active.x+active.width<=nav.x+nav.width+1,'active mobile menu is visible');await shot('activity-mobile');}
 }
 checks.push('timeline and every detail fit 360/390/768/1440px; mobile moves timeline → detail → back');
 await page.setViewportSize({width:1440,height:1100});
 const status=await (await page.request.get(origin+'/api/status')).json(),viewer=await browser.newPage();await viewer.route('**/api/status',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({...status,principal:{id:'fixture-viewer',role:'viewer'}})}));
 await viewer.goto(origin+'/workspace?view=activity&status=all');await viewer.waitForSelector('.act-item');await viewer.locator('#main[aria-busy="false"]').waitFor({state:'attached'});
 await viewer.locator('#activity-timeline [data-item^="run:"]').first().click();await viewer.locator('#main[aria-busy="false"]').waitFor({state:'attached'});
 assert(await viewer.locator('[data-action="save-review"]').isDisabled());assert(await viewer.locator('#review-notes').isDisabled());assert(await viewer.locator('.act-head [data-action="activity-sheet"]').isDisabled());
 await viewer.locator('#activity-timeline [data-item^="job:"]').first().click();await viewer.locator('#main[aria-busy="false"]').waitFor({state:'attached'});await viewer.locator('[data-action="refresh-agents"]').click();await viewer.locator('#main[aria-busy="false"]').waitFor({state:'attached'});
 await viewer.close();assert.deepEqual(errors,[]);
 checks.push('viewer can read results and refresh a run trace while review and execution stay disabled; no production-CSP page errors');
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({status:'passed',checks,errors},null,2));console.log(JSON.stringify({status:'passed',checks,screenshots:out},null,2));
}catch(e){if(page)await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});console.error(e);process.exitCode=1;}finally{await browser?.close();server.kill();fs.rmSync(temp,{recursive:true,force:true});}})();
