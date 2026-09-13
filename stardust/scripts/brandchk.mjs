import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2500);
const d=await p.evaluate(()=>{
  const nav=document.querySelector('header nav');
  return [...nav.children].map(c=>({cls:c.className, disp:getComputedStyle(c).display, txt:c.textContent.trim().slice(0,25)}));
});
console.log(JSON.stringify(d,null,2));
await b.close();
