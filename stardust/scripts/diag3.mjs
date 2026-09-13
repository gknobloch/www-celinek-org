import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:45000});
await p.waitForTimeout(2000);
const d=await p.evaluate(()=>{
  const heroPs=[...document.querySelectorAll('.cine-hero p, .cine-hero__panel p, .cine-hero__panel .script')].map(x=>({cls:x.className, t:x.textContent.slice(0,30)}));
  const whyHead=[...document.querySelectorAll('.why-band .default-content-wrapper *')].map(x=>({tag:x.tagName, cls:x.className, t:x.textContent.slice(0,25)}));
  const heroCta=[...document.querySelectorAll('.cine-hero__cta *')].map(x=>({tag:x.tagName,cls:x.className,t:x.textContent.slice(0,20)}));
  return {heroPs, whyHead, heroCta};
});
console.log('HERO panel elements:',JSON.stringify(d.heroPs,null,1));
console.log('HERO cta elements:',JSON.stringify(d.heroCta,null,1));
console.log('WHY head elements:',JSON.stringify(d.whyHead,null,1));
await b.close();
