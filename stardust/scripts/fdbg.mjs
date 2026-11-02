import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2000);
const d=await p.evaluate(()=>{
  const dcw=document.querySelector('footer .default-content-wrapper');
  const ul=dcw?.querySelector(':scope > ul');
  const g=el=>el?{disp:getComputedStyle(el).display, w:Math.round(el.getBoundingClientRect().width), flexGrow:getComputedStyle(el).flexGrow, marginRight:getComputedStyle(el).marginRight}:'-';
  // full selector match test
  const matchTest = dcw ? dcw.matches('body:has(.cine-hero) footer .default-content-wrapper') : 'no-dcw';
  return {dcw:g(dcw), ul:g(ul), dcwFlexWrap: dcw?getComputedStyle(dcw).flexWrap:'-', dcwJustify: dcw?getComputedStyle(dcw).justifyContent:'-', matchTest, parentChain: dcw?[dcw.parentElement.className, dcw.parentElement.parentElement.className]:'-'};
});
console.log(JSON.stringify(d,null,2));
await b.close();
