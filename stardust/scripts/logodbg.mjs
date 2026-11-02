import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2500);
const d=await p.evaluate(()=>{
  const logo=document.querySelector('header .nav-logo');
  const desc=document.querySelector('header .nav-logo .logo-description');
  const base=document.querySelector('header .nav-logo p.baseline');
  const cs=(e)=>e?getComputedStyle(e):{};
  return {
    navLogoFlex:cs(logo).flexBasis+' w='+Math.round(logo.getBoundingClientRect().width),
    descW:Math.round(desc.getBoundingClientRect().width), descOverflow:cs(desc).overflow,
    baseW:Math.round(base.getBoundingClientRect().width), baseScrollW:base.scrollWidth, baseWhiteSpace:cs(base).whiteSpace, baseLineH:cs(base).lineHeight, baseMaxH:cs(base).maxHeight, baseText:base.textContent.trim(),
  };
});
console.log('TOP logo:',JSON.stringify(d,null,1));
await p.screenshot({path:'stardust/validation/eds/logo-tight-top.png',clip:{x:150,y:0,width:420,height:100}});
// scrolled
await p.evaluate(()=>window.scrollTo(0,400)); await p.waitForTimeout(700);
const sc=await p.evaluate(()=>{
  const img=document.querySelector('header .nav-logo img').getBoundingClientRect();
  const name=document.querySelector('header .nav-logo p.name').getBoundingClientRect();
  return {imgCenterY:Math.round(img.top+img.height/2), imgTop:Math.round(img.top), imgBot:Math.round(img.bottom), nameCenterY:Math.round(name.top+name.height/2), nameTop:Math.round(name.top), delta:Math.round((name.top+name.height/2)-(img.top+img.height/2))};
});
console.log('SCROLLED align:',JSON.stringify(sc));
await p.screenshot({path:'stardust/validation/eds/logo-tight-scrolled.png',clip:{x:150,y:0,width:420,height:78}});
await b.close();
