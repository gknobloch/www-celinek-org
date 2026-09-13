import { chromium } from 'playwright';
const file = process.argv[2];
const label = process.argv[3] || 'artifact';
const outDir = process.argv[4] || '/Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/validation';
import { mkdirSync } from 'fs';
const vps = [['desktop',1440,900],['tablet',768,1024],['mobile',390,844]];
const browser = await chromium.launch();
let allErrors = [];
for (const [name,w,h] of vps){
  const ctx = await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const page = await ctx.newPage();
  const errors=[];
  page.on('console',m=>{ if(m.type()==='error') errors.push('CONSOLE:'+m.text()); });
  page.on('pageerror',e=>errors.push('PAGEERROR:'+e.message));
  page.on('requestfailed',r=>{ const u=r.url(); if(!u.startsWith('data:')) errors.push('REQFAIL:'+u+' '+(r.failure()&&r.failure().errorText)); });
  await page.goto('file://'+file,{waitUntil:'networkidle',timeout:30000}).catch(e=>errors.push('GOTO:'+e.message));
  await page.waitForTimeout(1200);
  // scroll to trigger any lazy/motion
  await page.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=window.innerHeight){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,200));} window.scrollTo(0,0); });
  await page.waitForTimeout(500);
  const overflow = await page.evaluate(()=>document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const dir = `${outDir}/${label}`; mkdirSync(dir,{recursive:true});
  await page.screenshot({path:`${dir}/${name}.png`,fullPage:true});
  console.log(`[${label}/${name}] overflowX=${overflow}px errors=${errors.length}`);
  errors.forEach(e=>console.log('   '+e.slice(0,160)));
  allErrors=allErrors.concat(errors.map(e=>`${name}:${e}`));
  await ctx.close();
}
await browser.close();
console.log(`RESULT ${label}: ${allErrors.length===0?'CLEAN':'HAS_ISSUES('+allErrors.length+')'}`);
