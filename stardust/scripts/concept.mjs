import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('file:///Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-proposed.html',{waitUntil:'networkidle'});
await p.waitForTimeout(600);
const y=await p.evaluate(()=>Math.round(document.querySelectorAll('.editorial')[1].getBoundingClientRect().top+window.scrollY));
await p.evaluate(yy=>window.scrollTo(0,yy-30),y); await p.waitForTimeout(300);
await p.screenshot({path:'stardust/validation/index-C/fx-concept-closet.png'});
// confirm image loaded
const ok=await p.evaluate(()=>{const img=document.querySelectorAll('.editorial')[1].querySelector('img');return img.naturalWidth>0;});
console.log('concept image loaded:',ok);
await b.close();
