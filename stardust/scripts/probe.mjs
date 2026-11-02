import { chromium } from 'playwright';
const slugs=['realisations/','prestations-tarifs/','mes-realisations','realisation','galerie','avant-apres','temoignages'];
const b=await chromium.launch();
for(const s of slugs){
  const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  try{await p.goto('https://www.celinek.org/'+s,{waitUntil:'networkidle',timeout:20000});}catch(e){}
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=800){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,200));}});
  await p.waitForTimeout(500);
  const t=await p.title();
  const imgs=await p.evaluate(()=>[...document.querySelectorAll('img')].map(i=>({s:(i.currentSrc||i.src).split('?')[0].split('/').pop(),w:i.naturalWidth})).filter(i=>i.w>=200));
  console.log(`/${s} → "${t}" imgs=${imgs.length}`, imgs.map(i=>i.s+'('+i.w+')').join(', '));
  await p.context().close();
}
await b.close();
