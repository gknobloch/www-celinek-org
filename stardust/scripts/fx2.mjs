import { chromium } from 'playwright';
const b=await chromium.launch();
// static for full why (all revealed)
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('file:///Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-proposed.html',{waitUntil:'networkidle'});
await p.waitForTimeout(600);
const wc=await p.evaluate(()=>{const w=document.querySelector('.value--wide');const r=w.getBoundingClientRect();return {top:Math.round(r.top+window.scrollY),full:Math.round(r.width)>800};});
await p.evaluate(y=>window.scrollTo(0,y-260),wc.top); await p.waitForTimeout(300);
await p.screenshot({path:'stardust/validation/index-C/fx-why-wide.png'});
console.log('wide card spans full row:',wc.full);
// carousel short slide (Joëlle = index 3) on cinematic
const c=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await c.goto('file:///Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-cinematic.html',{waitUntil:'networkidle'});
await c.waitForTimeout(1000);
const py=await c.evaluate(()=>Math.round(document.querySelector('#proof').getBoundingClientRect().top+window.__lenis.scroll));
await c.evaluate(y=>window.__lenis.scrollTo(y-20,{immediate:true}),py); await c.waitForTimeout(600);
await c.click('.carousel__dots .dot:nth-child(4)'); await c.waitForTimeout(700);
await c.screenshot({path:'stardust/validation/index-C/fx-carousel-short.png'});
await b.close();
