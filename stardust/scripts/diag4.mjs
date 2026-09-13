import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2500);
const frag=await p.evaluate(async()=>{
  const r=async u=>{try{const x=await fetch(u);return x.status+'/'+x.ok;}catch(e){return 'ERR '+e.message;}};
  return {nav:await r('/nav.plain.html'), footer:await r('/footer.plain.html')};
});
console.log('in-page fetch nav:',frag.nav,'| footer:',frag.footer);
const info=await p.evaluate(()=>{
  const q=s=>document.querySelector(s);
  const cs=(el,prop)=>el?getComputedStyle(el)[prop]:'-';
  // testi section classes
  const testiSec=q('.testimonials')?.closest('.section');
  const procSec=q('.steps-flow')?.closest('.section');
  const procScript=procSec?.querySelector('.default-content-wrapper > p:first-child');
  const voir=q('.head-center .button-container a, .button-container a[href*="realisations"]');
  const testiScript=testiSec?.querySelector('.default-content-wrapper > p:first-child');
  const contactScript=q('.contact-band__inner .script');
  const arrow=q('.carousel__prev');
  const carousel=q('.testimonials.block');
  const footerP=q('footer .footer p, footer p');
  return {
    procSecClasses: procSec?.className,
    procScriptAlign: cs(procScript,'textAlign'), procScriptFont: cs(procScript,'fontFamily').slice(0,20),
    testiSecClasses: testiSec?.className,
    testiSecBg: cs(testiSec,'backgroundColor'),
    testiScriptFont: cs(testiScript,'fontFamily').slice(0,20), testiScriptAlign: cs(testiScript,'textAlign'),
    voirBg: cs(voir,'backgroundColor'), voirRadius: cs(voir,'borderRadius'), voirText: voir?.textContent,
    contactScriptFont: cs(contactScript,'fontFamily').slice(0,20), contactScriptSize: cs(contactScript,'fontSize'),
    arrowTop: arrow?Math.round(arrow.getBoundingClientRect().top):'-', carouselTop: carousel?Math.round(carousel.getBoundingClientRect().top):'-', carouselH: carousel?Math.round(carousel.getBoundingClientRect().height):'-',
    footerFontSize: cs(footerP,'fontSize'),
    footerHTML: q('footer .footer')?.innerHTML.replace(/\s+/g,' ').slice(0,400),
  };
});
console.log(JSON.stringify(info,null,2));
await b.close();
