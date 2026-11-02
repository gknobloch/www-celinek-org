import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2500);
await p.evaluate(()=>window.scrollTo(0,1100)); await p.waitForTimeout(600);
const d=await p.evaluate(()=>{
  const baseline=document.querySelector('header .nav-logo .logo-description p.baseline');
  const nav=document.querySelector('header nav');
  return {baselineDisp:baseline?getComputedStyle(baseline).maxHeight+' opacity='+getComputedStyle(baseline).opacity:'-', navBg:getComputedStyle(nav).backgroundColor, navShadow:getComputedStyle(nav).boxShadow.slice(0,20)};
});
console.log(JSON.stringify(d));
await p.screenshot({path:'stardust/validation/eds/bg-fixed.png',clip:{x:0,y:0,width:1440,height:90}});
await b.close();
