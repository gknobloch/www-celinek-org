import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2500);
await p.screenshot({path:'stardust/validation/eds/final-hdr-top.png',clip:{x:0,y:0,width:1200,height:100}});
await p.evaluate(()=>window.scrollTo(0,400)); await p.waitForTimeout(700);
await p.screenshot({path:'stardust/validation/eds/final-hdr-scr.png',clip:{x:0,y:0,width:1200,height:72}});
await b.close();
