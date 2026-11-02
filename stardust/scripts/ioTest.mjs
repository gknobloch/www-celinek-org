import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2000);
const ids=await p.evaluate(()=>({concept: !!document.getElementById('concept'), process: !!document.getElementById('process'), proof: !!document.getElementById('proof')}));
console.log('section ids present:',JSON.stringify(ids));
// find editorial Y and scroll there with real scroll
const y=await p.evaluate(()=>{const e=document.querySelector('.editorial');const r=e.getBoundingClientRect();return Math.round(r.top+window.scrollY);});
console.log('editorial docY:',y);
await p.evaluate((yy)=>window.scrollTo(0,yy-200),y);
await p.waitForTimeout(1200);
const st=await p.evaluate(()=>{const e=document.querySelector('.editorial');return {op:getComputedStyle(e).opacity, hasIn:e.classList.contains('in'), hasReveal:e.classList.contains('reveal'), rectTop:Math.round(e.getBoundingClientRect().top)};});
console.log('after real scroll:',JSON.stringify(st));
// manually test if IO fires at all in page context
const ioWorks=await p.evaluate(()=>new Promise(res=>{
  const el=document.querySelector('.value-grid .value');
  if(!el) return res('no-el');
  let fired=false;
  const o=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting)fired=true;});},{threshold:0});
  o.observe(el);
  el.scrollIntoView();
  setTimeout(()=>res('fired='+fired+' opacity='+getComputedStyle(el).opacity+' hasIn='+el.classList.contains('in')),800);
}));
console.log('manual IO test on a value card:',ioWorks);
await b.close();
