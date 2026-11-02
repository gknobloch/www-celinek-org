import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://www.celinek.org/',{waitUntil:'networkidle',timeout:30000});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,200));}});
await p.waitForTimeout(800);
// Find the testimonial section and dump all text blocks that look like quotes
const data=await p.evaluate(()=>{
  const out={carouselItems:[],rawBlocks:[]};
  // look for common carousel/slide structures
  const cands=[...document.querySelectorAll('[class*="carousel"],[class*="slide"],[class*="testimonial"],[class*="quote"],blockquote,figure')];
  cands.forEach(c=>{const t=c.textContent.trim().replace(/\s+/g,' ');if(t.length>60&&t.length<1200)out.rawBlocks.push({cls:c.className,len:t.length,txt:t.slice(0,400)});});
  return out;
});
console.log('=== testimonial-like blocks on home ===');
const seen=new Set();
data.rawBlocks.forEach(bl=>{const k=bl.txt.slice(0,50);if(seen.has(k))return;seen.add(k);console.log(`[${bl.cls}] (${bl.len})`);console.log('  '+bl.txt);console.log('');});
await b.close();
