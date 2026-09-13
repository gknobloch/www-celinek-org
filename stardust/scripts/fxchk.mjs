import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-cinematic.html',{waitUntil:'networkidle'});
await p.waitForTimeout(1200);
// WHY section screenshot
const whyY=await p.evaluate(()=>Math.round(document.querySelector('.why').getBoundingClientRect().top+window.__lenis.scroll));
await p.evaluate(y=>window.__lenis.scrollTo(y-20,{immediate:true}),whyY); await p.waitForTimeout(700);
await p.screenshot({path:'stardust/validation/index-C/fx-why.png'});
// PROCESS sequence
const procY=await p.evaluate(()=>Math.round(document.querySelector('#process').getBoundingClientRect().top+window.__lenis.scroll));
await p.evaluate(y=>window.__lenis.scrollTo(y-100,{immediate:true}),procY); await p.waitForTimeout(300);
const seq0=await p.evaluate(()=>[...document.querySelectorAll('.process .step')].map(s=>s.classList.contains('in')));
await p.waitForTimeout(1200); // allow 0/320/640ms sequence
const seq1=await p.evaluate(()=>[...document.querySelectorAll('.process .step')].map(s=>s.classList.contains('in')));
console.log('process steps in-class right away:',JSON.stringify(seq0),'| after 1.2s:',JSON.stringify(seq1));
await p.screenshot({path:'stardust/validation/index-C/fx-process.png'});
// CAROUSEL
const proofY=await p.evaluate(()=>Math.round(document.querySelector('#proof').getBoundingClientRect().top+window.__lenis.scroll));
await p.evaluate(y=>window.__lenis.scrollTo(y-20,{immediate:true}),proofY); await p.waitForTimeout(800);
const t0=await p.evaluate(()=>getComputedStyle(document.querySelector('.carousel__track')).transform);
const who0=await p.evaluate(()=>document.querySelector('.testi[aria-hidden="false"] .who')?.textContent||document.querySelectorAll('.testi')[0].querySelector('.who').textContent);
await p.click('.carousel__next'); await p.waitForTimeout(700);
const t1=await p.evaluate(()=>getComputedStyle(document.querySelector('.carousel__track').style?document.querySelector('.carousel__track'):document.querySelector('.carousel__track')).transform);
const active=await p.evaluate(()=>[...document.querySelectorAll('.carousel__dots .dot')].map(d=>d.classList.contains('active')));
await p.screenshot({path:'stardust/validation/index-C/fx-carousel.png'});
console.log('carousel track t0:',t0,'-> after next: transformInline=',await p.evaluate(()=>document.querySelector('.carousel__track').style.transform));
console.log('active dots after next:',JSON.stringify(active),'| overflowX:',await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),'| errors:',errs.length);
await b.close();
