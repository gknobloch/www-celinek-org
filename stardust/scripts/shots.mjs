import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2000);
async function shot(sel,name,offset=-120){
  await p.evaluate(([s,o])=>{const el=document.querySelector(s);if(el){const y=el.getBoundingClientRect().top+window.scrollY+o;window.scrollTo(0,y);}},[sel,offset]);
  await p.waitForTimeout(700);
  await p.screenshot({path:`stardust/validation/eds/s-${name}.png`});
}
// Voir button present?
const voir=await p.evaluate(()=>{const a=[...document.querySelectorAll('a')].find(x=>x.textContent.includes('Voir mes'));return a?{text:a.textContent,bg:getComputedStyle(a).backgroundColor,vis:getComputedStyle(a.closest('*')).opacity}:'MISSING';});
console.log('Voir button:',JSON.stringify(voir));
// footer icon after filter
const ic=await p.evaluate(()=>{const img=document.querySelector('footer span.icon img');return img?{filter:getComputedStyle(img).filter,w:getComputedStyle(img).width}:'no-icon';});
console.log('footer icon:',JSON.stringify(ic));
await shot('.steps-flow','process',-40);
await shot('#proof','testi',-40);
await shot('.contact-band','contact',-40);
await shot('footer','footer',-500);
await b.close();
