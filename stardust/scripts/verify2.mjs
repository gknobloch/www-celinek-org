import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push('PAGEERR '+e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('CON '+m.text().slice(0,70));});
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2500);
const d=await p.evaluate(()=>{
  const cs=(sel,prop)=>{const el=document.querySelector(sel);return el?getComputedStyle(el)[prop]:'no-el';};
  const hdr=document.querySelector('header .header, header nav');
  return {
    headerLinks: document.querySelectorAll('header a').length,
    headerPos: cs('header','position'),
    heroTop: Math.round(document.querySelector('.cine-hero').getBoundingClientRect().top),
    procScriptAlign: cs('.head-center .default-content-wrapper > p:first-child','textAlign'),
    testiSecClasses: document.querySelector('.testimonials')?.closest('.section').className,
    testiSecBg: cs('.testimonials','backgroundColor') /* section bg */,
    testiScriptFont: (()=>{const s=document.querySelector('.testimonials')?.closest('.section').querySelector('.default-content-wrapper > p:first-child');return s?getComputedStyle(s).fontFamily.slice(0,12):'-';})(),
    footerFont: cs('footer .footer li','fontSize'),
    progressBar: !!document.querySelector('.cine-hero__progress'),
  };
});
// testi section bg (the section, not block)
const testiBg=await p.evaluate(()=>{const s=document.querySelector('.testimonials').closest('.section');return getComputedStyle(s).backgroundColor;});
console.log(JSON.stringify({...d, testiSectionBg:testiBg},null,2));
console.log('errors:',errs.filter(e=>!e.includes('module for')).slice(0,4));
// full screenshot
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}window.scrollTo(0,0);});
await p.waitForTimeout(600);
await p.screenshot({path:'stardust/validation/eds/r2-full.png',fullPage:true});
await b.close();
