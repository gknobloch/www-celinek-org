import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push('PAGEERR:'+e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE:'+m.text());});
p.on('requestfailed',r=>{const u=r.url();if(!u.startsWith('data:')&&!u.includes('favicon'))errs.push('REQFAIL:'+u.slice(0,80));});
await p.goto('http://localhost:3000/qa/redesign.html',{waitUntil:'networkidle',timeout:30000}).catch(e=>errs.push('GOTO:'+e.message));
await p.waitForTimeout(2500);
const appeared=await p.evaluate(()=>document.body.classList.contains('appear'));
const h1=await p.evaluate(()=>document.querySelectorAll('h1').length);
const blocks=await p.evaluate(()=>[...document.querySelectorAll('[data-block-name]')].map(x=>({n:x.dataset.blockName,st:x.dataset.blockStatus,kids:x.children.length,h:Math.round(x.getBoundingClientRect().height)})));
const overflow=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
// scroll to trigger reveals
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,180));}window.scrollTo(0,0);});
await p.waitForTimeout(500);
await p.screenshot({path:'stardust/validation/eds/redesign-full.png',fullPage:true});
console.log('appeared:',appeared,'| h1 count:',h1,'| overflowX:',overflow);
console.log('blocks:'); blocks.forEach(x=>console.log('  ',x.n,'status='+x.st,'kids='+x.kids,'h='+x.h));
console.log('errors('+errs.length+'):'); errs.slice(0,12).forEach(e=>console.log('  '+e));
await b.close();
