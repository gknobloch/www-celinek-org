import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2500);
const g=()=>{return {
  name:getComputedStyle(document.querySelector('header .nav-logo p.name')).color,
  baseline:getComputedStyle(document.querySelector('header .nav-logo p.baseline span')).color,
  nameSize:getComputedStyle(document.querySelector('header .nav-logo p.name')).fontSize,
  logoImg:Math.round(document.querySelector('header .nav-logo img').getBoundingClientRect().height),
  navLink:getComputedStyle(document.querySelector('header .nav-sections a')).color,
  navH:Math.round(document.querySelector('header nav').getBoundingClientRect().height),
};};
const top=await p.evaluate(g);
console.log('TOP:',JSON.stringify(top));
await p.screenshot({path:'stardust/validation/eds/logo-top.png',clip:{x:0,y:0,width:520,height:110}});
await p.evaluate(()=>window.scrollTo(0,400)); await p.waitForTimeout(600);
const sc=await p.evaluate(g);
console.log('SCROLLED:',JSON.stringify(sc));
await p.screenshot({path:'stardust/validation/eds/logo-scrolled.png',clip:{x:0,y:0,width:520,height:80}});
await b.close();
