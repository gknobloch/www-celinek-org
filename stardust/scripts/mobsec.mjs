import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();
await p.goto('file:///Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/prototypes/index-C-proposed.html',{waitUntil:'networkidle'});
await p.waitForTimeout(700);
// section tops
const tops=await p.evaluate(()=>{
  const q=s=>document.querySelector(s);
  return {
    concept: Math.round(q('#concept').getBoundingClientRect().top+window.scrollY),
    why: Math.round(q('.why').getBoundingClientRect().top+window.scrollY),
    process: Math.round(q('#process').getBoundingClientRect().top+window.scrollY),
    proof: Math.round(q('#proof').getBoundingClientRect().top+window.scrollY),
  };
});
console.log('tops:',JSON.stringify(tops));
async function shot(y,name){await p.evaluate(yy=>window.scrollTo(0,yy),y);await p.waitForTimeout(300);await p.screenshot({path:`stardust/validation/index-C/m-${name}.png`});}
await shot(tops.concept-10,'concept');
await shot(tops.proof-10,'proof');
await b.close(); console.log('done');
