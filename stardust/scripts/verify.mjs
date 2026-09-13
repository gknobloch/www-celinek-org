import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2000);
// hero: script text + CTA buttons
const hero=await p.evaluate(()=>{
  const s=document.querySelector('.cine-hero__panel .script');
  const btns=[...document.querySelectorAll('.cine-hero__cta a')].map(a=>({t:a.textContent.trim().slice(0,22),cls:a.className}));
  const scriptFont=s?getComputedStyle(s).fontFamily:'-';
  return {scriptText:s?s.textContent.trim().slice(0,40):'MISSING', scriptFont, scriptSize:s?getComputedStyle(s).fontSize:'-', btns};
});
console.log('HERO script:',hero.scriptText);
console.log('HERO script font:',hero.scriptFont,'size:',hero.scriptSize);
console.log('HERO CTAs:',JSON.stringify(hero.btns));
// screenshot hero
await p.screenshot({path:'stardust/validation/eds/hero2.png'});
// animation check: reveal editorial on scroll
const before=await p.evaluate(()=>{const e=document.querySelector('.editorial');return e?getComputedStyle(e).opacity:'-';});
await p.evaluate(()=>document.querySelector('#concept')?.scrollIntoView({behavior:'instant'}));
await p.waitForTimeout(900);
const after=await p.evaluate(()=>{const e=document.querySelector('.editorial');return {op:getComputedStyle(e).opacity, hasIn:e.classList.contains('in')};});
console.log('editorial reveal: before-scroll opacity='+before+' | after-scroll='+JSON.stringify(after));
// steps sequence
await p.evaluate(()=>document.querySelector('#process')?.scrollIntoView({behavior:'instant'}));
await p.waitForTimeout(1400);
const steps=await p.evaluate(()=>[...document.querySelectorAll('.steps-flow .step')].map(s=>s.classList.contains('in')));
console.log('steps sequence in:',JSON.stringify(steps));
// default-content head script styling
const whyScript=await p.evaluate(()=>{const el=document.querySelector('.why-band .default-content-wrapper > p:first-child');return el?{t:el.textContent.slice(0,20),font:getComputedStyle(el).fontFamily,size:getComputedStyle(el).fontSize}:'-';});
console.log('why head script:',JSON.stringify(whyScript));
await b.close();
