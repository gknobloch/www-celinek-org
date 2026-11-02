import { chromium } from 'playwright';
const file='/Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-cinematic.html';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('file://'+file,{waitUntil:'networkidle'});
await p.waitForTimeout(700);
async function paraAt(y){
  await p.evaluate(yy=>{window.__lenis?window.__lenis.scrollTo(yy,{immediate:true}):window.scrollTo(0,yy);},y);
  await p.waitForTimeout(500);
  return await p.evaluate(()=>[...document.querySelectorAll('[data-parallax]')].map(i=>getComputedStyle(i).transform));
}
console.log('at 600:',await paraAt(600));
console.log('at 1200:',await paraAt(1200));
console.log('at 1800:',await paraAt(1800));
await p.screenshot({path:'/Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/validation/index-C/cine-editorial.png'});
const of=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
console.log('overflowX at editorial:',of);
await b.close();
