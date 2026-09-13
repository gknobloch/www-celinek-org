import { chromium } from 'playwright';
const b=await chromium.launch();
// full-page static mobile
const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-proposed.html',{waitUntil:'networkidle'});
await p.waitForTimeout(700);
const of=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
await p.screenshot({path:'stardust/validation/index-C/mobile-full.png',fullPage:true});
// measure a few things
const info=await p.evaluate(()=>{
  const g=getComputedStyle(document.querySelector('.testi-grid')).gridTemplateColumns;
  const heroCta=[...document.querySelectorAll('.hero__cta .btn')].map(x=>Math.round(x.getBoundingClientRect().width));
  const navToggle=getComputedStyle(document.querySelector('.nav-toggle')).display;
  return {testiCols:g, heroCtaWidths:heroCta, navToggle};
});
console.log('static mobile overflowX:',of,'| info:',JSON.stringify(info),'| errors:',errs.length);

// cinematic: test hamburger open
const c=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await c.goto('file:///Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-cinematic.html',{waitUntil:'networkidle'});
await c.waitForTimeout(1000);
await c.click('.nav-toggle');
await c.waitForTimeout(500);
const navOpen=await c.evaluate(()=>{const h=document.getElementById('nav');const nav=document.querySelector('.nav');return {open:h.classList.contains('open'),navDisplay:getComputedStyle(nav).display,aria:document.querySelector('.nav-toggle').getAttribute('aria-expanded')};});
console.log('hamburger:',JSON.stringify(navOpen));
await c.screenshot({path:'stardust/validation/index-C/mobile-nav-open.png'});
await b.close();
