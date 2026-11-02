import { chromium } from 'playwright';
const b=await chromium.launch();
for (const path of ['/','/redesign']){
  const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,70));});
  await p.goto('http://localhost:3000'+path,{waitUntil:'networkidle',timeout:40000}).catch(()=>{});
  await p.waitForTimeout(2500);
  const h=await p.evaluate(()=>{const hb=document.querySelector('header .header, header > div');return {kids: hb?hb.children.length:'no-block', navLinks: document.querySelectorAll('header nav a, header a').length};});
  console.log(path, JSON.stringify(h), 'errs:', errs.slice(0,3).join(' | '));
  await p.context().close();
}
await b.close();
