import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('file://'+process.cwd()+'/stardust/prototypes/index-C-cinematic.html',{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
const m = () => {
  const c = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return Math.round(r.top + r.height / 2); };
  const bar = document.querySelector('.site-header .container').getBoundingClientRect();
  return { barCenter: Math.round(bar.top + bar.height / 2), mark: c('.brand img'), name: c('.brand .name'), tag: c('.brand .tag'), link: c('.nav a'), cta: c('.nav .btn--gold') };
};
console.log('PROTO TOP     :', JSON.stringify(await p.evaluate(m)));
await p.evaluate(() => window.__lenis ? window.__lenis.scrollTo(400,{immediate:true}) : window.scrollTo(0,400)); await p.waitForTimeout(700);
console.log('PROTO SCROLLED :', JSON.stringify(await p.evaluate(m)));
await b.close();
