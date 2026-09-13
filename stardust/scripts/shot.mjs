import { chromium } from 'playwright';
const file='/Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-cinematic.html';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('file://'+file,{waitUntil:'networkidle'}); await p.waitForTimeout(1600);
await p.evaluate(()=>{window.__lenis.scrollTo(360,{immediate:true});}); await p.waitForTimeout(700);
await p.screenshot({path:'stardust/validation/index-C/fx-condensed-nav.png'});
await b.close(); console.log('shot saved');
