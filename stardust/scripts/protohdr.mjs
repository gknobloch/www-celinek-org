import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('file://'+process.cwd()+'/stardust/prototypes/index-C-cinematic.html',{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
const g=()=>{const q=s=>document.querySelector(s);const cs=(s,pr)=>{const e=q(s);return e?getComputedStyle(e)[pr]:'-';};return {
  name_color:cs('.brand .name','color'), name_size:cs('.brand .name','fontSize'), name_weight:cs('.brand .name','fontWeight'), name_family:cs('.brand .name','fontFamily').slice(0,12),
  tag_color:cs('.brand .tag','color'), tag_size:cs('.brand .tag','fontSize'), tag_transform:cs('.brand .tag','textTransform'), tag_spacing:cs('.brand .tag','letterSpacing'),
  navlink_color:cs('.nav a','color'), navlink_size:cs('.nav a','fontSize'), navlink_weight:cs('.nav a','fontWeight'),
  logoImgH:Math.round(q('.brand img').getBoundingClientRect().height),
  headerH:Math.round(q('.site-header .container').getBoundingClientRect().height),
};};
console.log('PROTO TOP:',JSON.stringify(await p.evaluate(g),null,1));
await p.screenshot({path:'stardust/validation/eds/proto-hdr-top.png',clip:{x:0,y:0,width:900,height:110}});
await p.evaluate(()=>window.__lenis?window.__lenis.scrollTo(400,{immediate:true}):window.scrollTo(0,400)); await p.waitForTimeout(700);
await p.screenshot({path:'stardust/validation/eds/proto-hdr-scrolled.png',clip:{x:0,y:0,width:900,height:80}});
await b.close();
