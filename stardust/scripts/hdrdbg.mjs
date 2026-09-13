import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,120));});
// LOAD 1
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(3000);
const h1=await p.evaluate(()=>document.querySelectorAll('header a').length);
console.log('load1 header links:',h1);
// manual loadFragment test in-page
const manual=await p.evaluate(async()=>{
  try{
    const mod=await import('/blocks/fragment/fragment.js');
    const frag=await mod.loadFragment('/nav');
    return frag ? ('OK children='+frag.children.length+' html='+frag.innerHTML.slice(0,60)) : 'NULL';
  }catch(e){return 'THREW '+e.message;}
});
console.log('manual loadFragment(/nav):',manual);
// RELOAD
await p.reload({waitUntil:'networkidle'});
await p.waitForTimeout(3000);
const h2=await p.evaluate(()=>document.querySelectorAll('header a').length);
console.log('load2 (reload) header links:',h2);
console.log('header errors:',errs.filter(e=>e.includes('header')).slice(0,2));
await b.close();
