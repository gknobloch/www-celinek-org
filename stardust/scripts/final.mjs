import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push('PAGEERR '+e.message)); p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('module for header')&&!m.text().includes('module for footer'))errs.push('CON '+m.text().slice(0,80));});
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2000);
const ids=await p.evaluate(()=>['concept','process','proof'].map(i=>i+':'+!!document.getElementById(i)).join(' '));
console.log('anchors:',ids);
// hero parallax on scroll
const t0=await p.evaluate(()=>getComputedStyle(document.querySelector('.cine-hero__bg')).transform);
await p.evaluate(()=>window.scrollTo(0,400)); await p.waitForTimeout(300);
const t1=await p.evaluate(()=>getComputedStyle(document.querySelector('.cine-hero__bg')).transform);
console.log('hero parallax changed on scroll:', t0!==t1);
// walk down, triggering reveals + steps
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}});
await p.waitForTimeout(1000);
const rev=await p.evaluate(()=>({
  editorial:[...document.querySelectorAll('.editorial')].every(e=>e.classList.contains('in')),
  values:[...document.querySelectorAll('.value')].every(e=>e.classList.contains('in')),
  steps:[...document.querySelectorAll('.step')].every(e=>e.classList.contains('in')),
}));
console.log('reveals all fired:',JSON.stringify(rev));
// carousel
await p.evaluate(()=>document.getElementById('proof')?.scrollIntoView());
await p.waitForTimeout(400);
await p.click('.carousel__next'); await p.waitForTimeout(700);
const car=await p.evaluate(()=>({t:document.querySelector('.carousel__track').style.transform, who:document.querySelector('.testi[aria-hidden="false"] .who, .testi .who')?.textContent}));
console.log('carousel next:',JSON.stringify(car));
// footer
const foot=await p.evaluate(()=>{const f=document.querySelector('footer');return {bg:getComputedStyle(f.querySelector('.footer')||f).backgroundColor};});
console.log('footer bg:',foot.bg);
console.log('errors(non-chrome):',errs.length, errs.slice(0,5));
await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(300);
await p.screenshot({path:'stardust/validation/eds/final-full.png',fullPage:true});
await b.close();
