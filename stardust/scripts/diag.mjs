import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.goto('http://localhost:3000/qa/redesign.html',{waitUntil:'networkidle'});
await p.waitForTimeout(2500);
const d=await p.evaluate(()=>{
  const hero=document.querySelector('.cine-hero');
  const inner=document.querySelector('.cine-hero__inner');
  const ed=document.querySelector('.editorial');
  const val=document.querySelector('.value');
  const heroImg=document.querySelector('.cine-hero__bg img');
  return {
    heroHasIsIn: hero?.classList.contains('is-in'),
    heroClasses: hero?.className,
    innerOpacity: inner?getComputedStyle(inner).opacity:'no-inner',
    heroImgNatural: heroImg?heroImg.naturalWidth:'no-img',
    heroImgComputedH: heroImg?getComputedStyle(heroImg).height:'-',
    edClasses: ed?.className, edOpacity: ed?getComputedStyle(ed).opacity:'-',
    valClasses: val?.className, valOpacity: val?getComputedStyle(val).opacity:'-',
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
});
console.log(JSON.stringify(d,null,2));
errs.forEach(e=>console.log(e));
await b.close();
