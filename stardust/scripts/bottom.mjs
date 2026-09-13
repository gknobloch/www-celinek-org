import { chromium } from 'playwright';
const file='/Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-cinematic.html';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('file://'+file,{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
await p.evaluate(()=>window.__lenis.scrollTo(document.body.scrollHeight,{immediate:true}));
await p.waitForTimeout(900);
await p.screenshot({path:'stardust/validation/index-C/fx-contact-footer.png'});
await b.close(); console.log('bottom shot saved');
