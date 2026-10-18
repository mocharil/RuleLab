/* Forum: run progress banner, issues & mitigation board, blocking progress dialog. Demo server, isolated database. */
const {chromium}=require('playwright'),{spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'rulelab-forum-')),origin='http://127.0.0.1:8064';
const server=spawn(process.env.RULELAB_PYTHON||'python3',['-m','uvicorn','app.main:app','--port','8064'],{cwd:root,env:{...process.env,RULELAB_DB:path.join(temp,'qa.sqlite3'),AI_PROVIDER:'demo',SEARCH_BACKEND:'sqlite',RULELAB_API_TOKEN:'',RULELAB_ACCESS_KEYS:'[]',DATABASE_URL:'',RULELAB_SOURCES_BUCKET:''},stdio:'ignore'});
const api=async(url,body)=>{const r=await fetch(origin+url,body?{method:'POST',headers:{'content-type':'application/json','Idempotency-Key':'k'+Math.random()},body:JSON.stringify(body)}:undefined);assert(r.ok,url+' '+r.status);return r.json();};
(async()=>{let browser;const checks=[],errors=[];try{
 for(let i=0;i<1200;i++){try{if((await fetch(origin+'/api/health')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 const draft=(await api('/api/drafts'))[0],full=await api('/api/drafts/'+draft.id);
 const alt='Pasal 1\nLayanan melalui aplikasi digital dan kanal pendampingan.\n\nPasal 2\nPetugas menyediakan bantuan langsung.';
 const job=await api('/api/drafts/'+draft.id+'/agent-jobs',{intent:'social',expected_revision:full.revision,alternative_text:alt,social_options:{persona_count:24,rounds:4,crowd_size:100}});
 for(let i=0;i<600;i++){if(!['queued','running'].includes((await api('/api/agent-jobs/'+job.id)).status))break;await new Promise(r=>setTimeout(r,300));}
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 const settled=()=>page.waitForFunction(()=>document.querySelector('#main')?.getAttribute('aria-busy')==='false');
 const url=origin+'/workspace?view=studio&stage=simulation&sub=social&draft='+draft.id;
 await page.goto(url);await page.waitForSelector('.social-summary');await settled();
 assert.equal(await page.locator('.social-progress').count(),0,'no banner once the run is finished');
 const cards=await page.locator('.issue-card').count(),items=await page.locator('.issue-item').count();assert(cards>=3&&items===24);
 for(const w of [1440,1024,390]){await page.setViewportSize({width:w,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'issues board overflow at '+w);
  const boxes=await page.locator('.issue-card').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return [r.left,r.right];}));
  assert(boxes.every(([a,b])=>a>=-1&&b<=w+1),'cards stay inside the viewport at '+w);}
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('.issue-item [data-comment]').first().click();await page.waitForSelector('.social-inspector',{state:'visible'});assert(await page.locator('.social-selected-opinion').count());
 checks.push('issues board: one card per issue, no overflow at 1440/1024/390 px, "View original comment" opens the opinion detail');
 await page.route('**/api/drafts/*/agent-jobs',async r=>{const res=await r.fetch(),jobs=await res.json(),t=jobs[0];t.events=t.events.slice(0,Math.floor(t.events.length*.4));t.status='running';t.result={};r.fulfill({response:res,json:jobs});});
 await page.goto(url);await page.waitForSelector('.social-progress');await settled();
 const label=await page.locator('.sp-label').textContent(),now=Number(await page.locator('.sp-bar').getAttribute('aria-valuenow'));
 assert(/persona responses|Round/.test(label)&&now>10&&now<97,label+' '+now);assert(await page.locator('.sp-steps li.now').count()===1);
 const t1=await page.locator('.sp-time').textContent();await page.waitForTimeout(2200);assert.notEqual(await page.locator('.sp-time').textContent(),t1,'elapsed time ticks');
 assert(await page.locator('.social-progress [data-action="cancel-agent"]').count()===1);
 checks.push('a running forum shows a progress banner with step, percentage, ticking elapsed time and Cancel');
 await page.unroute('**/api/drafts/*/agent-jobs');
 await page.goto(origin+'/workspace?view=studio&stage=simulation&draft='+draft.id);await settled();
 await page.route('**/api/drafts/*/simulate',async r=>{await new Promise(x=>setTimeout(x,2500));r.continue();});
 await page.locator('#alternative').fill(alt);await page.locator('[data-action="simulate"]').first().click();await page.waitForSelector('#progress-modal[open]');await page.waitForTimeout(1300);
 assert.match(await page.locator('#progress-elapsed').textContent(),/^\d+ s$/);assert((await page.locator('#progress-modal .progress-track').boundingBox()).height>=6);
 checks.push('A/B comparison shows a visible blocking progress bar with elapsed seconds');
 assert.deepEqual(errors,[]);console.log(JSON.stringify({status:'passed',checks},null,2));
}catch(e){console.error(e);process.exitCode=1;}finally{await browser?.close();server.kill();try{fs.rmSync(temp,{recursive:true,force:true,maxRetries:5,retryDelay:300});}catch{}}})();
