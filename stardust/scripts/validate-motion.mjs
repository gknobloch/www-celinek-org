import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
const file = process.argv[2];
const label = process.argv[3] || 'index-C';
const outDir = '/Users/gknob/dev/github/gknobloch/www-celinek-org/stardust/validation';
const browser = await chromium.launch();
const dir = `${outDir}/${label}`; mkdirSync(dir,{recursive:true});
const errors=[];

// ── Motion pass (desktop) ──
const ctx = await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
const page = await ctx.newPage();
page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE:'+m.text());});
page.on('pageerror',e=>errors.push('PAGEERROR:'+e.message));
page.on('requestfailed',r=>{const u=r.url();if(!u.startsWith('data:'))errors.push('REQFAIL:'+u);});
await page.goto('file://'+file,{waitUntil:'networkidle',timeout:30000}).catch(e=>errors.push('GOTO:'+e.message));
await page.waitForTimeout(1000);
const lenisBooted = await page.evaluate(()=>!!window.__lenis);
const overflow = await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
await page.screenshot({path:`${dir}/cine-top.png`});
// hero photo transform at top
const heroTop = await page.evaluate(()=>{const e=document.querySelector('.hero-marquee');return e?getComputedStyle(e).transform:'none';});
// scroll to mid
await page.evaluate(()=>{ if(window.__lenis){window.__lenis.scrollTo(1400,{immediate:true});} else window.scrollTo(0,1400); });
await page.waitForTimeout(900);
await page.screenshot({path:`${dir}/cine-mid.png`});
const heroMid = await page.evaluate(()=>{const e=document.querySelector('.hero-marquee');return e?getComputedStyle(e).transform:'none';});
// count revealed anim elements (opacity>0.5)
const revealedMid = await page.evaluate(()=>{let n=0;document.querySelectorAll('[data-anim]').forEach(e=>{if(parseFloat(getComputedStyle(e).opacity)>0.5)n++;});return n;});
// scroll to bottom
await page.evaluate(()=>{ const y=document.body.scrollHeight; if(window.__lenis){window.__lenis.scrollTo(y,{immediate:true});} else window.scrollTo(0,y); });
await page.waitForTimeout(1000);
await page.screenshot({path:`${dir}/cine-bottom.png`,fullPage:false});
const revealedBottom = await page.evaluate(()=>{let n=0,t=0;document.querySelectorAll('[data-anim]').forEach(e=>{t++;if(parseFloat(getComputedStyle(e).opacity)>0.5)n++;});return `${n}/${t}`;});
console.log(`[${label}] lenisBooted=${lenisBooted} overflowX=${overflow}`);
console.log(`  heroParallax: top=${heroTop} mid=${heroMid} (changed=${heroTop!==heroMid})`);
console.log(`  revealed anim: mid=${revealedMid}  bottom=${revealedBottom}`);
await ctx.close();

// ── Reduced-motion pass ──
const rctx = await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const rpage = await rctx.newPage();
const rerr=[];
rpage.on('pageerror',e=>rerr.push('PAGEERROR:'+e.message));
await rpage.goto('file://'+file,{waitUntil:'networkidle',timeout:30000});
await rpage.waitForTimeout(800);
const rmAllVisible = await rpage.evaluate(()=>{let hidden=0;document.querySelectorAll('[data-anim]').forEach(e=>{if(parseFloat(getComputedStyle(e).opacity)<0.99)hidden++;});return hidden;});
const rmHeroTransform = await rpage.evaluate(()=>{const e=document.querySelector('.hero-marquee');return e?getComputedStyle(e).transform:'none';});
await rpage.screenshot({path:`${dir}/reduced-motion.png`});
console.log(`  reduced-motion: hiddenAnimEls=${rmAllVisible} (want 0)  heroTransform=${rmHeroTransform} errors=${rerr.length}`);
await rctx.close();

await browser.close();
const clean = errors.length===0 && lenisBooted && overflow<=0 && rmAllVisible===0;
errors.forEach(e=>console.log('  ERR '+e.slice(0,140)));
console.log(`RESULT ${label}: ${clean?'CLEAN (motion+reduced-motion pass)':'REVIEW'}`);
