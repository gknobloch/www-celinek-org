import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2500);
// header at top
await p.screenshot({path:'stardust/validation/eds/nav-top.png',clip:{x:0,y:0,width:1440,height:130}});
const navInfo=await p.evaluate(()=>{
  const w=document.querySelector('header .nav-wrapper');
  const links=[...document.querySelectorAll('header nav .nav-sections a')].map(a=>a.textContent.trim());
  return {navWrapperH:w?Math.round(w.getBoundingClientRect().height):'-', navWrapperBg:w?getComputedStyle(w).backgroundColor:'-', sectionLinks:links, heroTop:Math.round(document.querySelector('.cine-hero').getBoundingClientRect().top)};
});
console.log('nav:',JSON.stringify(navInfo));
// scrolled state
await p.evaluate(()=>window.scrollTo(0,300)); await p.waitForTimeout(500);
const scrolled=await p.evaluate(()=>document.querySelector('header').classList.contains('scrolled'));
await p.screenshot({path:'stardust/validation/eds/nav-scrolled.png',clip:{x:0,y:0,width:1440,height:110}});
console.log('scrolled class:',scrolled,'| errors:',errs.length);
await b.close();
