import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2000);
// footer crop
await p.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
await p.waitForTimeout(700);
const fy=await p.evaluate(()=>Math.round(document.querySelector('footer').getBoundingClientRect().top));
await p.screenshot({path:'stardust/validation/eds/footer-final.png',clip:{x:0,y:Math.max(0,fy-6),width:1440,height:Math.min(110,899-Math.max(0,fy-6))}});
console.log('footer top in viewport:',fy,'errors:',errs.length);
await b.close();
