import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-proposed.html',{waitUntil:'networkidle'});
await p.waitForTimeout(700);
const of=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
const y2=await p.evaluate(()=>Math.round(document.querySelectorAll('.editorial')[1].getBoundingClientRect().top+window.scrollY));
const yp=await p.evaluate(()=>Math.round(document.querySelector('#process').getBoundingClientRect().top+window.scrollY));
async function shot(y,n){await p.evaluate(yy=>window.scrollTo(0,yy),y);await p.waitForTimeout(300);await p.screenshot({path:`stardust/validation/index-C/m2-${n}.png`});}
await shot(y2-10,'block2');
await shot(yp-10,'process');
console.log('overflowX:',of,'errors:',errs.length);
await b.close();
