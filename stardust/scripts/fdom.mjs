import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2000);
const f=await p.evaluate(()=>{
  const w=document.querySelector('footer .default-content-wrapper');
  const walk=(el,d=0)=>{let s=`${' '.repeat(d)}${el.tagName}.${el.className||''}[disp=${getComputedStyle(el).display}]`;return s;};
  const dcw=w?{display:getComputedStyle(w).display, children:[...w.children].map(c=>walk(c,0))}:'no-dcw';
  // is the flex parent the dcw or a nested div?
  const firstP=document.querySelector('footer .default-content-wrapper > p');
  return {dcw, firstPParent: firstP?firstP.parentElement.className+' disp='+getComputedStyle(firstP.parentElement).display:'-', firstPMarginLeft: firstP?getComputedStyle(firstP).marginLeft:'-'};
});
console.log(JSON.stringify(f,null,2));
await b.close();
