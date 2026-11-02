import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2500);
const m = () => {
  const c = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return Math.round(r.top + r.height / 2); };
  const nav = document.querySelector('header nav').getBoundingClientRect();
  return { navCenter: Math.round(nav.top + nav.height / 2), mark: c('header .nav-logo img'), name: c('header .nav-logo p.name'), link: c('header .nav-sections a'), cta: c('header .nav-tools a') };
};
console.log('TOP     :', JSON.stringify(await p.evaluate(m)));
await p.evaluate(() => window.scrollTo(0, 400)); await p.waitForTimeout(700);
console.log('SCROLLED :', JSON.stringify(await p.evaluate(m)));
await b.close();
