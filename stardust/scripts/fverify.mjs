import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2000);
const socialX=await p.evaluate(()=>{const a=document.querySelector('footer .footer a.button');return a?Math.round(a.getBoundingClientRect().left):'-';});
console.log('social icon left X (viewport 1440):',socialX,'(right-aligned if >1200)');
// process spacing: gap between Voir button bottom and testi section top
const gap=await p.evaluate(()=>{const btn=[...document.querySelectorAll('a')].find(x=>x.textContent.includes('Voir mes'));const testi=document.querySelector('.testimonials').closest('.section');if(!btn||!testi)return '-';const bb=btn.getBoundingClientRect().bottom+window.scrollY;const tt=testi.getBoundingClientRect().top+window.scrollY;return Math.round(tt-bb);});
console.log('gap after Voir button → testi band:',gap,'px');
// footer screenshot
const fbot=await p.evaluate(()=>{const f=document.querySelector('footer');window.scrollTo(0,f.getBoundingClientRect().top+window.scrollY-770);return true;});
await p.waitForTimeout(600);
await p.screenshot({path:'stardust/validation/eds/footer3.png'});
await b.close();
