import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(1800);
const c=await p.evaluate(()=>{const s=document.querySelector('.contact-band__inner .script');return s?{align:getComputedStyle(s).textAlign,display:getComputedStyle(s).display}:'-';});
console.log('contact script:',JSON.stringify(c));
await b.close();
