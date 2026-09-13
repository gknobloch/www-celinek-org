import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2500);
const g=()=>{const cs=(s,pr)=>{const e=document.querySelector(s);return e?getComputedStyle(e)[pr]:'-';};return {
  name:cs('header .nav-logo p.name','color')+' '+cs('header .nav-logo p.name','fontSize')+' w'+cs('header .nav-logo p.name','fontWeight'),
  tag:cs('header .nav-logo p.baseline span','color')+' '+cs('header .nav-logo p.baseline','fontSize'),
  navlink:cs('header .nav-sections a','color')+' '+cs('header .nav-sections a','fontSize')+' w'+cs('header .nav-sections a','fontWeight'),
  cta:cs('header .nav-tools a','padding')+' '+cs('header .nav-tools a','fontSize'),
  logoImg:Math.round(document.querySelector('header .nav-logo img').getBoundingClientRect().height),
  navH:Math.round(document.querySelector('header nav').getBoundingClientRect().height),
};};
console.log('EDS TOP     :',JSON.stringify(await p.evaluate(g)));
console.log('PROTO TARGET: name=rgb(74,99,87) 16px w700 | tag=rgb(74,99,87) 11px | navlink=rgb(26,26,23) 15px w500 | cta=10px 20px 15px | logo56 navH92');
await p.screenshot({path:'stardust/validation/eds/hdr-match-top.png',clip:{x:0,y:0,width:900,height:100}});
await p.evaluate(()=>window.scrollTo(0,400)); await p.waitForTimeout(700);
const sc=await p.evaluate(g);
console.log('EDS SCROLLED:',JSON.stringify({logoImg:sc.logoImg,navH:sc.navH,navlink:sc.navlink}));
await p.screenshot({path:'stardust/validation/eds/hdr-match-scrolled.png',clip:{x:0,y:0,width:900,height:78}});
await b.close();
