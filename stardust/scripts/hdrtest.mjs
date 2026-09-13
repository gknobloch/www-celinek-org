import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,80));});
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(3000);
const d=await p.evaluate(()=>{
  const navMeta=document.querySelector('meta[name="nav"]')?.content;
  const links=[...document.querySelectorAll('header nav a')].map(a=>a.textContent.trim()).filter(Boolean);
  const logo=!!document.querySelector('header .nav-logo');
  return {navMeta, headerLinks:links, hasLogo:logo, headerHeight:Math.round(document.querySelector('header').getBoundingClientRect().height)};
});
console.log('nav meta:',d.navMeta);
console.log('header links:',JSON.stringify(d.headerLinks));
console.log('has logo:',d.hasLogo,'| header height:',d.headerHeight);
console.log('errors:',errs.filter(e=>e.includes('header')).slice(0,2));
await b.close();
