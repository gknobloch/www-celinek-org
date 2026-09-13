import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();
await p.goto('file:///Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-proposed.html',{waitUntil:'networkidle'});
await p.waitForTimeout(700);
const y2=await p.evaluate(()=>{const els=document.querySelectorAll('.editorial');return Math.round(els[1].getBoundingClientRect().top+window.scrollY);});
console.log('block2 top:',y2);
async function shot(y,n){await p.evaluate(yy=>window.scrollTo(0,yy),y);await p.waitForTimeout(300);await p.screenshot({path:`stardust/validation/index-C/m-${n}.png`});}
await shot(y2-10,'block2');
await shot(2650-10,'why');
await shot(4850-10,'process');
await b.close();console.log('done');
