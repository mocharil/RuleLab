/* Capture the actual local app, using its production CSP and a disposable demo database. */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'rulelab-visual-'));
const out=path.join(root,'artifacts/workspace-visual');
fs.mkdirSync(out,{recursive:true});
const origin='http://127.0.0.1:8058';
const server=spawn(process.env.RULELAB_PYTHON||'python3',['-m','uvicorn','app.main:app','--port','8058'],{
 cwd:root,env:{...process.env,RULELAB_DB:path.join(temp,'qa.sqlite3'),AI_PROVIDER:'demo',SEARCH_BACKEND:'sqlite',RULELAB_API_TOKEN:'',RULELAB_ACCESS_KEYS:'[]',DATABASE_URL:'',RULELAB_SOURCES_BUCKET:''},stdio:'ignore',
});
(async()=>{
 let browser;
 try{
  let ready=false;
  for(let i=0;i<100;i++){
   try{ready=(await fetch(origin+'/api/health')).ok;if(ready)break;}catch{}
   await new Promise(resolve=>setTimeout(resolve,100));
  }
  assert(ready,'Demo server must start');
  browser=await chromium.launch({headless:true,executablePath:process.env.RULELAB_CHROMIUM||undefined});
  const page=await browser.newPage({viewport:{width:1440,height:1100},timezoneId:'Asia/Jakarta'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const views=['home','data','editor','analysis','simulation','library','history','agents'];
  const capture=async name=>{
   await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' exceeds the viewport');
   await page.screenshot({path:path.join(out,name+'.png'),animations:'disabled'});
  };
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:width===1440?1100:1000});
   for(const view of views){
    await page.goto(origin+'/workspace?view='+view);
    await page.waitForSelector('#main h1');
    await page.waitForFunction(()=>document.querySelector('#main')?.getAttribute('aria-busy')==='false');
    if(view==='data')await page.waitForSelector('.province-shape');
    await capture(view+'-'+width);
   }
   await page.goto(origin+'/workspace?view=library&tab=passages');
   await page.waitForSelector('#search-form');await capture('library-passages-'+width);
   await page.goto(origin+'/workspace?view=simulation&sub=social');
   await page.waitForSelector('.preview-persona');
   await capture('social-'+width);
   await page.goto(origin+'/guide');
   await page.waitForSelector('.guide-visual-hero');
   await capture('guide-'+width);
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({status:'passed',screens:22,widths:[390,1440],productionCSP:true,errors,output:out},null,2));
 }catch(error){console.error(error);process.exitCode=1;}
 finally{await browser?.close();server.kill();fs.rmSync(temp,{recursive:true,force:true});}
})();
