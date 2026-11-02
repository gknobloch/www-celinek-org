#!/usr/bin/env python3
"""Generate the /prestations-tarifs/ variant-C prototypes (index + one service template).

Canon (tokens, chrome, contact band, footer, comparison-slider-free) is imported from
realisations-prototypes.py so the section stays byte-aligned with the redesign.
Content is VERBATIM from https://www.celinek.org/prestations-tarifs/** — the only new
words are structural labels (eyebrows / section names), listed in the direction file.
Run from the repo root:  python3 stardust/scripts/prestations-prototypes.py
"""
import importlib.util
import os

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('canon', os.path.join(HERE, 'realisations-prototypes.py'))
canon = importlib.util.module_from_spec(spec)
spec.loader.exec_module(canon)

OUT = canon.OUT
IMG = 'assets/prestations/'

SERVICES = [
    {
        'slug': 'tri-rangement-et-optimisation', 'img': 'service-tro',
        'alt': 'Céline Knobloch aide une cliente à trier ses vêtements',
        'title': 'Mission Tri, Rangement et Optimisation',
        'for': 'Une ou plusieurs pièces en désordre',
        'blurb': 'Aide au désencombrement, au tri et à l’organisation de vos espaces.',
        'price': 'Sur devis', 'price_note': 'chez le client',
    },
    {
        'slug': 'vivre-et-vieillir-chez-soi', 'img': 'service-vivre',
        'alt': 'Une femme âgée souriante, assise dans son salon',
        'title': 'Vivre et vieillir chez soi',
        'for': 'Séniors · maintien à domicile',
        'blurb': 'Une prestation adaptée aux besoins spécifiques des personnes âgées ou en situation de handicap.',
        'price': 'À partir de 350 €', 'price_note': 'Pack Tranquillité, 2 pièces',
    },
    {
        'slug': 'changement-de-vie', 'img': 'service-changement',
        'alt': 'Une femme souriante portant un carton de déménagement',
        'title': 'Mission Changement de vie',
        'for': 'Déménagement · naissance · séparation',
        'blurb': 'Une formule sur mesure en tri, rangement et organisation pour accompagner un changement de vie personnel ou professionnel.',
        'price': 'Sur devis', 'price_note': 'chez le client',
    },
    {
        'slug': 'gerer-sa-maison-pas-a-pas', 'img': 'service-gerer',
        'alt': 'Une femme heureuse dans un salon lumineux et rangé',
        'title': 'Gérer sa maison pas à pas',
        'for': 'En autonomie, avec un coaching',
        'blurb': 'Un coaching personnalisé pour se lancer dans le rangement de son intérieur en autonomie.',
        'price': '99 €', 'price_note': '1h30 de coaching + guide',
    },
]

# ───────────────────────── shared C additions ─────────────────────────
C_CSS = r"""
/* Hero — full-bleed editorial photo (canon), shorter for inner pages */
.hero{position:relative;min-height:max(560px,78vh);padding-top:128px;overflow:hidden;display:flex;align-items:flex-end}
.hero__bg{position:absolute;top:-12vh;left:0;right:0;bottom:0;will-change:transform}
.hero__bg img{width:100%;height:100%;object-fit:cover;object-position:center 35%}
.hero__bg::after{content:"";position:absolute;inset:0;background:
  radial-gradient(ellipse 60% 64% at 78% 86%,rgba(26,26,23,.62) 0%,rgba(26,26,23,.26) 55%,rgba(26,26,23,0) 100%),
  linear-gradient(180deg,rgba(26,26,23,.34) 0%,rgba(26,26,23,.06) 26%,rgba(26,26,23,.5) 100%)}
.hero__inner{position:relative;z-index:1;width:100%;padding-bottom:64px;will-change:transform,opacity}
.hero__panel{max-width:600px;margin-left:auto}
.crumb{display:inline-block;color:rgba(255,255,255,.85);font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;margin:0 0 10px}
.crumb:hover{color:var(--color-gold)}
.hero__script{font-family:var(--script-font-family);color:#fff;font-size:64px;line-height:.95;margin:0 0 6px;text-shadow:0 2px 20px rgba(26,26,23,.35)}
.hero__script .w{display:inline-block}
.hero h1{font-size:var(--heading-xl);color:#fff;margin:0 0 12px;text-shadow:0 2px 16px rgba(26,26,23,.4)}
.hero .lead{color:rgba(255,255,255,.92);font-size:18px;margin:0 0 22px;max-width:48ch;text-shadow:0 1px 10px rgba(26,26,23,.45)}
.hero__cta{display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.btn--light{background:#fff;color:#1a1a17;box-shadow:0 6px 18px rgba(26,26,23,.18)}
.btn--light:hover{background:#f4f1e8;color:#1a1a17}
.btn--ghost-light{background:rgba(255,255,255,.10);color:#fff;border:1.5px solid rgba(255,255,255,.72)}
.btn--ghost-light:hover{background:rgba(255,255,255,.22);color:#fff}
.price-chip{display:inline-flex;align-items:baseline;gap:8px;background:rgba(26,26,23,.45);backdrop-filter:blur(4px);color:#fff;border-radius:999px;padding:8px 16px;font-size:14px;margin:0 0 20px}
.price-chip strong{color:var(--color-gold);font-size:17px}
.read-progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:60;pointer-events:none}
.read-progress i{display:block;height:100%;transform:scaleX(0);transform-origin:left;background:linear-gradient(90deg,var(--color-accent),var(--color-gold))}

section.band{padding:var(--section-padding) 0}
.band--warm{background:var(--color-band-warm)}
.band--sage{background:var(--color-band-sage)}
.head{max-width:760px;margin:0 0 40px}
.head--center{text-align:center;margin:0 auto 44px}
.head .script{font-size:40px;display:block;line-height:1;margin-bottom:2px}
.head h2{font-size:var(--heading-xl)}
.head p{color:var(--color-muted);margin:12px 0 0}
.head--center p{margin-left:auto;margin-right:auto;max-width:56ch}

/* steps (canon) */
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;counter-reset:step}
.step{background:var(--color-surface);border-radius:var(--radius);padding:32px;box-shadow:var(--shadow-card)}
.step__num{counter-increment:step;font-weight:700;font-size:20px;width:48px;height:48px;border-radius:999px;background:var(--color-band-sage);color:var(--color-accent-deep);display:flex;align-items:center;justify-content:center;margin-bottom:18px}
.step__num::before{content:counter(step)}
.step h3{font-size:var(--heading-md);margin-bottom:10px}
.step p{color:var(--color-muted);font-size:var(--body-sm);margin:0}

/* benefits (icons) */
.benefits{display:grid;grid-template-columns:repeat(5,1fr);gap:18px}
.benefit{background:rgba(255,255,255,.7);border-radius:var(--radius);padding:26px 18px;text-align:center}
.benefit img{width:52px;height:52px;margin:0 auto 14px;object-fit:contain}
.benefit h3{font-size:16px;line-height:1.35;color:var(--color-accent-deep);font-weight:700}

@media (max-width:900px){
  .hero{min-height:max(520px,70vh);padding-top:112px}
  .hero__script{font-size:50px}
  .steps{grid-template-columns:1fr}
  .benefits{grid-template-columns:repeat(2,1fr)}
}
@media (max-width:560px){
  .hero__script{font-size:42px}
  .head .script{font-size:32px}
  .benefits{grid-template-columns:1fr 1fr;gap:12px}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
  [data-anim]{opacity:1!important;transform:none!important}
  .hero__bg,.hero__inner{transform:none!important;opacity:1!important}
}
"""

C_JS = r"""
/* editorial motion runtime (canon, trimmed): hero parallax + word reveal,
   fade-rise reveals, reading progress. Hidden states are set by JS only. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var prog=document.querySelector('.read-progress i');
  var clamp=function(v,a,b){return v<a?a:v>b?b:v;},e3=function(t){return 1-Math.pow(1-t,3);};
  if(reduce){addEventListener('scroll',function(){var m=document.documentElement.scrollHeight-innerHeight;prog.style.transform='scaleX('+(m>0?scrollY/m:0)+')';},{passive:true});return;}
  var hs=document.querySelector('.hero__script');
  if(hs){hs.innerHTML=hs.textContent.split(/(\s+)/).map(function(t){return /^\s+$/.test(t)?t:'<span class="w">'+t+'</span>';}).join('');
    var ws=hs.querySelectorAll('.w');ws.forEach(function(w,i){w.style.opacity=0;w.style.transform='translateY(26px)';w.style.transition='opacity .8s ease '+(150+i*110)+'ms, transform .8s cubic-bezier(.16,1,.3,1) '+(150+i*110)+'ms';});
    requestAnimationFrame(function(){requestAnimationFrame(function(){ws.forEach(function(w){w.style.opacity=1;w.style.transform='none';});});});}
  var anims=[].slice.call(document.querySelectorAll('[data-anim]'));
  anims.forEach(function(el){if(el.getBoundingClientRect().top>innerHeight*.9){el.style.opacity=0;el.style.transform='translateY(28px)';}});
  var bg=document.querySelector('.hero__bg'),inner=document.querySelector('.hero__inner'),t0=performance.now();
  (function tick(now){
    var sy=scrollY,vh=innerHeight,max=document.documentElement.scrollHeight-vh;
    prog.style.transform='scaleX('+(max>0?clamp(sy/max,0,1):0)+')';
    if(bg&&innerWidth>767){var p=clamp(sy/vh,0,1),intro=Math.pow(1-Math.min((now-t0)/1400,1),3)*.08;
      bg.style.transform='translateY('+(p*14)+'vh) scale('+(1.02+p*.08+intro)+')';
      inner.style.transform='translateY('+(-p*8)+'vh)';inner.style.opacity=String(1-clamp((sy-vh*.12)/(vh*.5),0,1));}
    var nb=clamp((sy-(max-vh*.6))/(vh*.6),0,1);
    anims.forEach(function(el){if(el.style.opacity==='')return;var r=el.getBoundingClientRect();
      var k=e3(Math.max(clamp((vh*.92-r.top)/(vh*.3),0,1),nb));el.style.opacity=k;el.style.transform='translateY('+((1-k)*28)+'px)';
      if(k>=1){el.style.opacity='';el.style.transform='';}});
    requestAnimationFrame(tick);
  })(performance.now());
})();
"""

STEPS_HOME = [
    ('Faire connaissance', 'Dans un premier temps, nous faisons connaissance par email ou téléphone et nous convenons ensemble d’une date pour la visite diagnostic.'),
    ('Envisager ensemble de trier, ranger, optimiser', 'Ensemble, nous discutons de vos besoins et de vos attentes. Cette visite me permet de voir la/les pièce(s) concernée(s) et de cibler au mieux ma future mission.'),
    ('Désencombrer : mes astuces et conseils', 'Le grand jour : j’arrive pour la mission à domicile. Ensemble, nous trions, désencombrons, rangeons et optimisons vos espaces. Vous avez le verdict final sur ce que vous gardez.'),
]


def hero(img, alt, script, h1, lead, crumb=None, price=None, ctas=''):
    crumb_html = f'<a class="crumb" href="/prestations-tarifs/">← {crumb}</a>' if crumb else ''
    price_html = f'<p class="price-chip">{price}</p>' if price else ''
    return f"""<section class="hero" data-section="hero" data-intent="orient" data-layout="full-bleed" data-media="image">
  <div class="hero__bg"><img src="{IMG}{img}.webp" alt="{alt}" fetchpriority="high"></div>
  <div class="hero__inner"><div class="container"><div class="hero__panel">
    {crumb_html}
    <p class="hero__script">{script}</p>
    <h1>{h1}</h1>
    <p class="lead">{lead}</p>
    {price_html}
    <div class="hero__cta">{ctas}</div>
  </div></div></div>
</section>"""


def steps_html(steps, cta=''):
    items = '\n'.join(f'<div class="step" data-anim><div class="step__num"></div><h3>{t}</h3><p>{d}</p></div>' for t, d in steps)
    return f'<div class="steps">\n{items}\n</div>{cta}'


def page(title, desc, prov, css, body):
    return f"""<!DOCTYPE html>
<!--
  _provenance:
{prov}
    brandSurface: approved homepage canon (index-C-cinematic.html, DESIGN-C.json) — register editorial
    contentSource: https://www.celinek.org/prestations-tarifs/** (verbatim fr-FR)
    generatedBy: stardust/scripts/prestations-prototypes.py
-->
<html lang="fr">
<head>
<meta charset="utf-8">
<title>{title}</title>
<link rel="icon" href="assets/favicon.ico">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{desc}">
<style>{canon.CANON_CSS}{C_CSS}{css}</style>
</head>
<body>
<div class="read-progress" aria-hidden="true"><i></i></div>
{body}
<script>{canon.CANON_JS}{C_JS}</script>
</body>
</html>
"""


# ───────────────────────── index ─────────────────────────
def index_page():
    css = r"""
.services{display:grid;grid-template-columns:repeat(2,1fr);gap:28px}
.svc{display:flex;flex-direction:column;background:var(--color-surface);border-radius:20px;overflow:hidden;box-shadow:var(--shadow-soft);transition:transform .35s var(--ease-expo),box-shadow .35s ease;color:inherit}
.svc:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(90,90,82,.18);color:inherit}
.svc__media{position:relative;aspect-ratio:16/10;overflow:hidden}
.svc__media img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--ease-expo)}
.svc:hover .svc__media img{transform:scale(1.04)}
.svc__for{position:absolute;left:16px;bottom:16px;background:rgba(253,254,250,.94);color:var(--color-accent-deep);font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:7px 12px;border-radius:999px}
.svc__body{padding:26px 28px 28px;display:flex;flex-direction:column;flex:1}
.svc__body h2{font-size:24px;margin:0 0 10px}
.svc__body p{color:var(--color-muted);font-size:16px;margin:0 0 20px;flex:1}
.svc__foot{display:flex;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid #eceee6;padding-top:18px}
.svc__price{display:flex;flex-direction:column;line-height:1.2}
.svc__price strong{font-size:20px;color:#1a1a17}
.svc__price small{font-size:13px;color:var(--color-muted)}
.svc__more{font-weight:700;font-size:15px;color:var(--color-accent-deep);white-space:nowrap}
.svc__more::after{content:" →";transition:margin .2s ease}
.svc:hover .svc__more::after{margin-left:4px}
.good{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.good div{background:rgba(255,255,255,.65);border-radius:var(--radius);padding:24px 26px}
.good h3{font-size:18px;color:var(--color-accent-deep);margin:0 0 6px}
.good p{margin:0;color:#4a4433;font-size:var(--body-sm)}
.process__cta{text-align:center;margin-top:40px}
@media (max-width:900px){.services{grid-template-columns:1fr}.good{grid-template-columns:1fr}}
"""
    cards = '\n'.join(f"""<a class="svc" href="/prestations-tarifs/{s['slug']}" data-anim>
  <div class="svc__media"><img src="{IMG}{s['img']}.webp" alt="{s['alt']}" loading="lazy"><span class="svc__for">{s['for']}</span></div>
  <div class="svc__body">
    <h2>{s['title']}</h2>
    <p>{s['blurb']}</p>
    <div class="svc__foot"><span class="svc__price"><strong>{s['price']}</strong><small>{s['price_note']}</small></span><span class="svc__more">Plus d’informations</span></div>
  </div>
</a>""" for s in SERVICES)
    body = f"""{canon.header('over').replace('aria-current="page">Mes Réalisations', '>Mes Réalisations').replace('href="/prestations-tarifs/">', 'href="/prestations-tarifs/" aria-current="page">')}
<main>
{hero('service-tro', 'Céline Knobloch aide une cliente à trier ses vêtements', 'Trier, ranger, optimiser', 'Prestations et tarifs',
      'Prêt à démarrer cette transformation de votre intérieur ? Envie de vous faire accompagner ?',
      ctas='<a class="btn btn--light" href="#services">Voir les prestations</a><a class="btn btn--ghost-light" href="/contact">Contactez-moi</a>')}
  <section class="band" id="services" data-section="services" data-intent="compare" data-layout="grid" data-items="4">
    <div class="container">
      <div class="head head--center" data-anim><span class="script">Quelle prestation pour vous ?</span><h2>Mes prestations</h2></div>
      <div class="services">
{cards}
      </div>
    </div>
  </section>
  <section class="band band--warm" data-section="good-to-know" data-intent="reassure" data-layout="grid" data-items="3">
    <div class="container">
      <div class="head" data-anim><span class="script">Bon à savoir</span><h2>Sans engagement, chez vous</h2></div>
      <div class="good">
        <div data-anim><h3>1er entretien gratuit</h3><p>N’hésitez pas à me contacter pour un 1er entretien téléphonique gratuit.</p></div>
        <div data-anim><h3>Devis gratuit</h3><p>Frais de déplacements en fonction de la localisation.</p></div>
        <div data-anim><h3>Chez le client</h3><p>Mulhouse et son agglomération, Bâle / Saint-Louis, Altkirch, Belfort, Thann, Guebwiller, Colmar.</p></div>
      </div>
    </div>
  </section>
  <section class="band" data-section="process" data-intent="explain how" data-layout="grid" data-items="3">
    <div class="container">
      <div class="head head--center" data-anim><span class="script">Pas à pas, à votre rythme</span><h2>Comment ça se passe ?</h2></div>
      {steps_html(STEPS_HOME, '<p class="process__cta" data-anim><a class="btn btn--gold" href="/realisations/">Voir mes réalisations</a></p>')}
    </div>
  </section>
{canon.CONTACT}
</main>
{canon.FOOTER}"""
    prov = """    writtenBy: stardust:prototype (variant C canon) — prestations index
    writtenAt: 2026-09-23"""
    return page('Prestations et tarifs — Céline Knobloch, Home Organiser',
                'Tri et rangement, séniors, changement de vie, coaching : les prestations et tarifs de Céline Knobloch, home organiser dans le Haut-Rhin.',
                prov, css, body)


# ───────────────────────── service: vivre et vieillir chez soi ─────────────────────────
def vivre_page():
    css = r"""
.concerns{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.concern{background:var(--color-surface);border-radius:var(--radius);padding:28px;box-shadow:var(--shadow-card);position:relative}
.concern::before{content:"";display:block;width:36px;height:3px;border-radius:3px;background:var(--color-gold);margin-bottom:16px}
.concern p{margin:0;color:var(--color-muted);font-size:16px}
.concern strong{color:#1a1a17}
.pillars{display:grid;grid-template-columns:repeat(2,1fr);gap:28px}
.pillar{background:rgba(255,255,255,.7);border-radius:var(--radius);padding:34px}
.pillar h2{font-size:26px;margin:0 0 14px}
.pillar p{color:#4a4433;font-size:16px;margin:0 0 12px}
.statement{padding:88px 0;text-align:center}
.statement h2{font-size:34px;line-height:1.3;max-width:24ch;margin:0 auto;color:var(--color-accent-deep)}
.bio{display:grid;grid-template-columns:.8fr 1.2fr;gap:64px;align-items:center}
.bio__media{border-radius:var(--radius);overflow:hidden;aspect-ratio:4/5;box-shadow:var(--shadow-soft)}
.bio__media img{width:100%;height:100%;object-fit:cover;object-position:center 20%}
.bio .eyebrow{margin-bottom:10px}
.bio blockquote{margin:0 0 22px;font-size:19px;line-height:1.7;font-style:italic;color:#3d3829}
.bio .script{font-size:34px;line-height:1.15;display:block;color:var(--color-accent-deep)}
.notes{display:grid;grid-template-columns:repeat(2,1fr);gap:22px;margin-top:28px}
.note{border:1.5px dashed #c9d3cd;border-radius:var(--radius);padding:20px 22px;font-size:15px;color:var(--color-muted)}
.note strong{display:block;color:var(--color-accent-deep);font-size:13px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}
.prices{display:grid;grid-template-columns:repeat(2,1fr);gap:28px;max-width:860px;margin:0 auto}
.price{background:var(--color-surface);border-radius:20px;padding:34px 34px 30px;box-shadow:var(--shadow-soft);text-align:center;border:2px solid transparent}
.price--featured{border-color:var(--color-gold)}
.price h3{font-size:22px;margin:0 0 4px}
.price .rooms{color:var(--color-muted);font-size:15px;margin:0 0 18px}
.price .from{font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--color-accent-deep);font-weight:700;margin:0}
.price .amount{font-size:46px;font-weight:700;line-height:1.1;margin:2px 0 22px;color:#1a1a17}
.price-foot{text-align:center;color:var(--color-muted);font-size:15px;margin:22px 0 0}
.others{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.other{display:flex;gap:16px;align-items:center;background:var(--color-surface);border-radius:var(--radius);padding:14px;box-shadow:var(--shadow-card);color:inherit;transition:transform .3s var(--ease-expo)}
.other:hover{transform:translateY(-3px);color:inherit}
.other img{width:84px;height:84px;border-radius:12px;object-fit:cover;flex:0 0 auto}
.other h3{font-size:16px;margin:0 0 4px}
.other span{font-size:14px;color:var(--color-accent-deep);font-weight:700}
@media (max-width:900px){
  .concerns,.pillars,.bio,.notes,.prices,.others{grid-template-columns:1fr}
  .bio{gap:28px}.bio__media{aspect-ratio:4/3}
  .statement h2{font-size:26px}
}
"""
    s = SERVICES[1]
    concerns = [
        'Vous éprouvez des <strong>difficultés à gérer le ménage et le rangement</strong> de votre lieu de vie à cause de problèmes de santé.',
        'Votre souhait est de <strong>rester dans votre maison</strong> ou votre appartement le plus longtemps possible sans pour autant vous mettre en danger.',
        'Vos proches ressentent de l’inquiétude par rapport aux <strong>problématiques de maintien à domicile</strong> ce qui crée certaines fois des tensions au sein de votre entourage.',
    ]
    benefits = [('ic-quotidien', 'Faciliter le quotidien'), ('ic-deplacements', 'Sécuriser les déplacements'),
                ('ic-tete', 'Décharger les proches'), ('ic-domicile', 'Favoriser le maintien à domicile'),
                ('ic-economies', 'Faire des économies')]
    steps = [
        ('Prise de contact', 'Une prise de contact et une 1ère rencontre à votre domicile'),
        ('Sessions de rangement', 'Plusieurs sessions de rangement et de réorganisation planifiées en fonction de vos besoins et de vos contraintes de santé (en moyenne créneaux de 2h pour respecter la fatigabilité du bénéficiaire)'),
        ('Suivi', 'Une visite de suivi et de réajustement quelques temps après les sessions de rangement.'),
    ]
    others = [x for x in SERVICES if x['slug'] != s['slug']]
    body = f"""{canon.header('over').replace('aria-current="page">Mes Réalisations', '>Mes Réalisations').replace('href="/prestations-tarifs/">', 'href="/prestations-tarifs/" aria-current="page">')}
<main>
{hero(s['img'], s['alt'], 'En toute sérénité', s['title'],
      'Une prestation en rangement et en organisation d’intérieurs spécifiquement adaptée aux séniors.',
      crumb='Prestations et tarifs', price='<span>Pack Tranquillité</span> <strong>à partir de 350 €</strong>',
      ctas='<a class="btn btn--light" href="#tarifs">Voir les tarifs</a><a class="btn btn--ghost-light" href="/contact">Contactez-moi</a>')}
  <section class="band" data-section="concerns" data-intent="recognise" data-layout="grid" data-items="3">
    <div class="container">
      <div class="head" data-anim><span class="script">Vous vous reconnaissez ?</span><h2>Pour qui ?</h2></div>
      <div class="concerns">
{chr(10).join(f'        <div class="concern" data-anim><p>{c}</p></div>' for c in concerns)}
      </div>
    </div>
  </section>
  <section class="band band--warm" data-section="pillars" data-intent="explain value" data-layout="two-column" data-items="2">
    <div class="container">
      <div class="pillars">
        <div class="pillar" data-anim>
          <h2>Rester chez soi dans de bonnes conditions</h2>
          <p>Imaginez que chaque objet dont vous avez besoin trouve sa place chez vous suivant des critères d’ergonomie, de fonctionnalité et de confort. Votre bien-être s’en retrouverait rapidement augmenté !</p>
          <p>En faisant appel à une professionnelle de l’organisation, <strong>vos affaires seront triées, rangées, et vos espaces de vie réorganisés</strong> en fonction de vos capacités physiques et psychiques actuelles.</p>
          <p>Le rangement de vos placards sera repensé en fonction de ce qui est existant, il n’y a pas de travaux à prévoir. Le but est de faire <strong>simple</strong> et <strong>efficace</strong> pour que vous puissiez rapidement vous sentir bien chez vous tout en respectant votre confort.</p>
        </div>
        <div class="pillar" data-anim>
          <h2>Éviter au maximum les risques de chutes</h2>
          <p>Fluidifier la circulation dans votre logement, améliorer l’accessibilité aux objets dont vous avez besoin, trier ce dont vous ne vous servez plus a un impact direct sur vos déplacements chez vous.</p>
          <p>En repensant vos rangements et en vous libérant du superflu, vos gestes du quotidien et l’entretien au sein de votre domicile seront facilités. L’objectif est de sécuriser vos déplacements pour réduire au maximum les risques de chute.</p>
        </div>
      </div>
    </div>
  </section>
  <section class="statement" data-section="statement" data-intent="promise" data-layout="centered">
    <div class="container"><h2 data-anim>Une organisation efficace de votre intérieur vous permettra de rester chez vous plus longtemps en toute sérénité !</h2></div>
  </section>
  <section class="band band--sage" data-section="bio" data-intent="build trust" data-layout="two-column" data-media="image">
    <div class="container">
      <div class="bio">
        <div class="bio__media" data-anim><img src="{IMG}bio-vivre.webp" alt="Céline Knobloch, home organiser" loading="lazy"></div>
        <div data-anim>
          <p class="eyebrow">Une approche de soignante</p>
          <blockquote>Infirmière pendant 14 ans en milieu hospitalier avant de créer mon entreprise en organisation d’intérieurs, mon accompagnement se veut avant tout personnalisé et adaptable à vos problématiques physiques et/ou psychologiques actuelles. Mon expérience en tant que soignante me permet une approche douce et respectueuse tout en garantissant discrétion et neutralité.</blockquote>
          <span class="script">Respecter votre choix et votre envie de rester chez vous est capital, faisons-le dans les meilleures conditions possibles !</span>
        </div>
      </div>
    </div>
  </section>
  <section class="band" data-section="benefits" data-intent="build desire" data-layout="grid" data-items="5">
    <div class="container">
      <div class="head head--center" data-anim><span class="script">Pour vous et vos proches</span><h2>Les bienfaits</h2></div>
      <div class="benefits">
{chr(10).join(f'        <div class="benefit" data-anim><img src="{IMG}{i}.webp" alt=""><h3>{t}</h3></div>' for i, t in benefits)}
      </div>
    </div>
  </section>
  <section class="band band--warm" data-section="process" data-intent="explain how" data-layout="grid" data-items="3">
    <div class="container">
      <div class="head head--center" data-anim><span class="script">La prestation se décompose en plusieurs étapes</span><h2>Déroulement de la prestation</h2></div>
      {steps_html(steps)}
      <div class="notes">
        <p class="note" data-anim><strong>Une personne de confiance</strong>Cette prestation peut être sollicitée par une personne de confiance. Dans tous les cas, le consentement du bénéficiaire sera indispensable pour garantir la réussite de l’accompagnement.</p>
        <p class="note" data-anim><strong>Bon à savoir</strong>Je n’ai pas les équipements nécessaires pour intervenir au domicile de personnes atteintes de Syndrome de Diogène.</p>
      </div>
    </div>
  </section>
  <section class="band" id="tarifs" data-section="pricing" data-intent="convert" data-layout="grid" data-items="2">
    <div class="container">
      <div class="head head--center" data-anim><span class="script">Des packs clairs</span><h2>Tarifs</h2></div>
      <div class="prices">
        <div class="price" data-anim><h3>Pack Tranquillité</h3><p class="rooms">2 pièces</p><p class="from">à partir de</p><p class="amount">350 €</p><a class="btn btn--ghost" href="/contact">Demander un devis</a></div>
        <div class="price price--featured" data-anim><h3>Pack Sérénité</h3><p class="rooms">4 pièces</p><p class="from">à partir de</p><p class="amount">550 €</p><a class="btn btn--gold" href="/contact">Demander un devis</a></div>
      </div>
      <p class="price-foot" data-anim>Devis gratuit, frais de déplacements en fonction de la localisation</p>
    </div>
  </section>
  <section class="band band--sage" data-section="other-services" data-intent="route" data-layout="grid" data-items="3">
    <div class="container">
      <div class="head" data-anim><span class="script">Et aussi</span><h2>Les autres prestations</h2></div>
      <div class="others">
{chr(10).join(f'''        <a class="other" href="/prestations-tarifs/{o['slug']}" data-anim><img src="{IMG}{o['img']}.webp" alt="" loading="lazy"><div><h3>{o['title']}</h3><span>{o['price']}</span></div></a>''' for o in others)}
      </div>
    </div>
  </section>
{canon.CONTACT}
</main>
{canon.FOOTER}"""
    prov = """    writtenBy: stardust:prototype (variant C canon) — service template, instance: vivre-et-vieillir-chez-soi
    writtenAt: 2026-09-23"""
    return page('Vivre et vieillir chez soi — Céline Knobloch, Home Organiser',
                'Rangement et organisation d’intérieurs adaptés aux séniors pour rester chez soi en sécurité : Pack Tranquillité dès 350 €, Pack Sérénité dès 550 €.',
                prov, css, body)


if __name__ == '__main__':
    for name, html in {'prestations-index-C.html': index_page(),
                       'prestations-vivre-C.html': vivre_page()}.items():
        with open(os.path.join(OUT, name), 'w') as fh:
            fh.write(html)
        print(name, len(html))
