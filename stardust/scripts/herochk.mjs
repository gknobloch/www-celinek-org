import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('file://'+'/Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-cinematic.html',{waitUntil:'networkidle'});
await p.waitForTimeout(1700);
await p.screenshot({path:'stardust/validation/index-C/fx-hero-flipped.png'});
await b.close(); console.log('hero shot saved');
