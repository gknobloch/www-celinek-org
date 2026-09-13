import { chromium } from 'playwright';
const pages=['qui-suis-je','realisations','prestations-tarifs','bienfaits','contact'];
const b=await chromium.launch();
for(const slug of pages){
  const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const p=await ctx.newPage();
  let status=0; p.on('response',r=>{if(r.url().endsWith('/'+slug)||r.url().endsWith('/'+slug+'/'))status=r.status();});
  try{ await p.goto('https://www.celinek.org/'+slug,{waitUntil:'networkidle',timeout:30000}); }catch(e){}
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=800){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,250));}window.scrollTo(0,0);});
  await p.waitForTimeout(800);
  const imgs=await p.evaluate(()=>[...document.querySelectorAll('img')].map(i=>({src:i.currentSrc||i.src,w:i.naturalWidth,h:i.naturalHeight,alt:i.alt})).filter(i=>i.w>=200));
  const h2s=await p.evaluate(()=>[...document.querySelectorAll('h1,h2,h3')].map(h=>h.textContent.trim()).filter(Boolean).slice(0,12));
  console.log(`\n=== /${slug} (title: ${await p.title()}) ===`);
  console.log('  headings:',JSON.stringify(h2s));
  console.log('  images('+imgs.length+'):');
  imgs.forEach(i=>console.log(`    ${i.w}x${i.h}  ${i.src.split('?')[0].split('/').pop()}  alt="${i.alt}"`));
  await ctx.close();
}
await b.close();
