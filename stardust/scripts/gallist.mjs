import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://www.celinek.org/realisations/',{waitUntil:'networkidle',timeout:30000}).catch(()=>{});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,200));}});
await p.waitForTimeout(600);
const imgs=await p.evaluate(()=>[...document.querySelectorAll('img')].map(i=>(i.currentSrc||i.src).split('?')[0]).filter(u=>u.includes('/media_')));
console.log(imgs.join('\n'));
await b.close();
