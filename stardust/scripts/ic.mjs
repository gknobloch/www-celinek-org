import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3000/redesign',{waitUntil:'networkidle',timeout:40000});
await p.waitForTimeout(2500);
const ic=await p.evaluate(()=>{
  const icon=document.querySelector('footer .footer span.icon, footer .footer a.button img, footer img');
  const a=document.querySelector('footer .footer a.button');
  const g=el=>el?{tag:el.tagName,cls:el.className,bg:getComputedStyle(el).backgroundColor,src:el.tagName==='IMG'?el.getAttribute('src'):'-'}:'-';
  return {icon:g(icon), a:g(a), aImg:g(document.querySelector('footer a.button img'))};
});
console.log(JSON.stringify(ic,null,2));
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
await p.waitForTimeout(600);
await p.screenshot({path:'stardust/validation/eds/footer-crop.png',clip:{x:0,y:770,width:1440,height:130}});
await b.close();
