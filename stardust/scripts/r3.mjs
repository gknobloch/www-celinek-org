import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2000);
const d=await p.evaluate(()=>{
  const cs=(sel,prop)=>{const el=document.querySelector(sel);return el?getComputedStyle(el)[prop]:'no-el';};
  const socialA=document.querySelector('footer .footer a.button');
  const firstSocialP=document.querySelector('footer .default-content-wrapper > p:first-of-type');
  return {
    contactScriptAlign: cs('.contact-band__inner .script','textAlign'),
    footerIconCircleBg: cs('footer .footer a.button','backgroundColor'),
    footerIconRadius: cs('footer .footer a.button','borderRadius'),
    footerIconFilter: cs('footer span.icon img','filter'),
    socialPushRight: firstSocialP?getComputedStyle(firstSocialP).marginLeft:'-',
    socialLeftX: socialA?Math.round(socialA.getBoundingClientRect().left):'-',
  };
});
console.log(JSON.stringify(d,null,2));
// smooth-scroll: dispatch wheel, check scroll lerps
const beforeY=await p.evaluate(()=>window.scrollY);
await p.mouse.move(700,400);
await p.mouse.wheel(0,600);
await p.waitForTimeout(500);
const afterY=await p.evaluate(()=>window.scrollY);
console.log('smooth-scroll: wheel 600 → scrollY', beforeY, '→', afterY, '(moved:', afterY-beforeY, ')');
console.log('errors:',errs.slice(0,3));
// footer crop
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
await p.waitForTimeout(800);
const fy=await p.evaluate(()=>document.querySelector('footer').getBoundingClientRect().top);
await p.screenshot({path:'stardust/validation/eds/footer2.png',clip:{x:0,y:Math.max(0,fy),width:1440,height:Math.min(120,900-fy)}});
await b.close();
