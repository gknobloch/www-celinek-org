import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://www.celinek.org/',{waitUntil:'networkidle',timeout:30000});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,200));}});
await p.waitForTimeout(600);
const items=await p.evaluate(()=>[...document.querySelectorAll('.carousel-item-body')].map(c=>c.textContent.trim().replace(/\s+/g,' ')));
items.forEach((t,i)=>console.log(`\n--- #${i+1} ---\n${t}`));
await b.close();
