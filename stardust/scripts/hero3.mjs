import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('file:///Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-cinematic.html',{waitUntil:'networkidle'});
await p.waitForTimeout(1700);
// check the two buttons are on one line (same offsetTop)
const rows=await p.evaluate(()=>[...document.querySelectorAll('.hero__cta .btn')].map(b=>({t:b.textContent.trim(),top:Math.round(b.getBoundingClientRect().top)})));
console.log('hero CTAs:',JSON.stringify(rows));
console.log('same line:',rows.every(r=>r.top===rows[0].top));
await p.screenshot({path:'stardust/validation/index-C/hero-two-cta.png'});
await b.close();
