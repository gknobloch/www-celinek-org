import { chromium } from 'playwright';
const b=await chromium.launch();
const f='file:///Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-cinematic.html';
// desktop
let p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto(f,{waitUntil:'networkidle'}); await p.waitForTimeout(1700);
await p.screenshot({path:'stardust/validation/index-C/hero-text-right.png'});
// mobile
let m=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await m.goto(f,{waitUntil:'networkidle'}); await m.waitForTimeout(1700);
await m.screenshot({path:'stardust/validation/index-C/hero-mobile.png'});
const of=await m.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
console.log('mobile overflowX:',of);
await b.close();
