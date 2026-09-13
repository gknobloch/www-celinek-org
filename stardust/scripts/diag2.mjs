import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push('PAGEERR '+e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('CON '+m.text().slice(0,90));});
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:45000}).catch(e=>errs.push('GOTO '+e.message));
await p.waitForTimeout(3000);
const info=await p.evaluate(()=>{
  const header=document.querySelector('header');
  const hdrBlock=document.querySelector('header .header, header [data-block-name]');
  const hero=document.querySelector('.cine-hero');
  const heroImg=document.querySelector('.cine-hero__bg img');
  const inner=document.querySelector('.cine-hero__inner');
  const track=document.querySelector('.carousel__track');
  const slide=document.querySelector('.testi');
  const vp=document.querySelector('.carousel__viewport');
  const footer=document.querySelector('footer');
  return {
    headerHeight: header?Math.round(header.getBoundingClientRect().height):'no-header',
    headerHTML: header?header.innerHTML.slice(0,80):'-',
    heroH: hero?Math.round(hero.getBoundingClientRect().height):'-',
    heroImgNatural: heroImg?heroImg.naturalWidth+'x'+heroImg.naturalHeight:'no-img',
    heroImgBox: heroImg?Math.round(heroImg.getBoundingClientRect().width)+'x'+Math.round(heroImg.getBoundingClientRect().height):'-',
    heroImgSrc: heroImg?heroImg.currentSrc.slice(0,70):'-',
    innerOpacity: inner?getComputedStyle(inner).opacity:'-',
    slideBox: slide?Math.round(slide.getBoundingClientRect().width):'-',
    vpBox: vp?Math.round(vp.getBoundingClientRect().width):'-',
    slideBoxSizing: slide?getComputedStyle(slide).boxSizing:'-',
    footerBg: footer?getComputedStyle(footer.querySelector('.footer')||footer).backgroundColor:'-',
  };
});
console.log(JSON.stringify(info,null,2));
console.log('errors:'); errs.slice(0,10).forEach(e=>console.log('  '+e));
await p.screenshot({path:'stardust/validation/eds/live-hero.png'});
// test carousel next offset
await p.evaluate(()=>{const s=document.querySelector('#proof');s&&s.scrollIntoView();});
await p.waitForTimeout(600);
const next=await p.$('.carousel__next');
if(next){await next.click();await p.waitForTimeout(700);
  const t=await p.evaluate(()=>({transform:document.querySelector('.carousel__track').style.transform, slideW:Math.round(document.querySelector('.testi').getBoundingClientRect().width), trackW:Math.round(document.querySelector('.carousel__track').getBoundingClientRect().width)}));
  console.log('after next:',JSON.stringify(t));
  await p.screenshot({path:'stardust/validation/eds/live-carousel-next.png'});
}
await b.close();
