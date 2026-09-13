import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2500);
// scroll so header is over the editorial (cream) section
await p.evaluate(()=>window.scrollTo(0,1100)); await p.waitForTimeout(600);
// sample: header bar center, and just below the header
const samp=await p.evaluate(()=>{
  const w=document.querySelector('header .nav-wrapper');
  const n=document.querySelector('header nav');
  const body=getComputedStyle(document.body).backgroundColor;
  const wrapRect=w.getBoundingClientRect();
  const navRect=n.getBoundingClientRect();
  return {
    wrapBg:getComputedStyle(w).backgroundColor, navBg:getComputedStyle(n).backgroundColor, bodyBg:body,
    wrapWidth:Math.round(wrapRect.width), navWidth:Math.round(navRect.width),
    wrapLeft:Math.round(wrapRect.left), navLeft:Math.round(navRect.left),
    headerBlockBg: getComputedStyle(document.querySelector('header .header')||document.querySelector('header')).backgroundColor,
  };
});
console.log(JSON.stringify(samp,null,2));
await p.screenshot({path:'stardust/validation/eds/bg-scrolled.png',clip:{x:0,y:0,width:1440,height:120}});
await b.close();
