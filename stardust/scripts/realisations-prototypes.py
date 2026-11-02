#!/usr/bin/env python3
"""Generate the /realisations/ uplift prototypes (A, B, C-proposed, C-cinematic).

All variants share the approved homepage canon (index-C-cinematic.html):
tokens, chrome (condensing nav, gold contact band, deep-sage footer).
Content: stardust/current/pages/realisations.json (22 real pairs, 9 rooms).
Run from the repo root:  python3 stardust/scripts/realisations-prototypes.py
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'stardust', 'prototypes')
CAP = json.load(open(os.path.join(ROOT, 'stardust', 'current', 'pages', 'realisations.json')))
ROOMS = CAP['rooms']
INTRO = CAP['intro']
TOTAL = sum(len(r['pairs']) for r in ROOMS)
IMG = 'assets/realisations/'


def plural(n):
    return f"{n} transformation{'s' if n > 1 else ''}"


def ar(p):
    return f"{p['w']}/{p['h']}"


def wide(p):
    return p['w'] > p['h'] * 1.1


# ───────────────────────── shared canon ─────────────────────────
CANON_CSS = r"""
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&family=Sacramento&display=swap');
:root{
  --heading-font-family:'Comfortaa','helvetica neue',helvetica,sans-serif;
  --body-font-family:'Comfortaa','helvetica neue',helvetica,sans-serif;
  --script-font-family:'Sacramento','Brush Script MT',cursive;
  --heading-xxl:60px; --heading-xl:42px; --heading-lg:32px; --heading-md:22px;
  --body:18px; --body-sm:15px; --line-height-heading:1.14; --line-height-body:1.75;
  --color-bg:#fdfefa; --color-surface:#ffffff; --color-fg:#1a1a17; --color-muted:#5a5a52;
  --color-accent:#728e7f; --color-accent-deep:#4a6357;
  --color-gold:#eed366; --color-gold-deep:#806515;
  --color-band-warm:#f8e1af; --color-band-sage:#e4ebe6; --color-contact:#445b4f;
  --section-padding:104px; --max-width:1120px; --radius:16px;
  --shadow-soft:0 10px 30px rgba(90,90,82,.12); --shadow-card:0 6px 20px rgba(90,90,82,.10);
  --ease-out-cubic:cubic-bezier(0.25,0.46,0.45,0.94); --ease-expo:cubic-bezier(0.16,1,0.3,1);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--color-bg);color:var(--color-fg);font-family:var(--body-font-family);
  font-size:var(--body);line-height:var(--line-height-body);-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:var(--color-accent-deep);text-decoration:none}
a:hover{color:var(--color-gold-deep)}
h1,h2,h3{font-family:var(--heading-font-family);line-height:var(--line-height-heading);font-weight:700;margin:0}
.container{max-width:var(--max-width);margin:0 auto;padding:0 24px}
.script{font-family:var(--script-font-family);color:var(--color-accent);font-weight:400}
.eyebrow{font-size:var(--body-sm);letter-spacing:.14em;text-transform:uppercase;color:var(--color-accent-deep);font-weight:600;margin:0 0 12px}
.btn{display:inline-block;border:none;cursor:pointer;font-family:var(--heading-font-family);font-weight:600;
  font-size:var(--body-sm);padding:14px 28px;border-radius:999px;transition:transform .18s ease,background .18s ease}
.btn:hover{transform:translateY(-2px)}
.btn--gold{background:var(--color-gold);color:#1a1a17;box-shadow:0 6px 18px rgba(90,90,82,.20)}
.btn--gold:hover{background:#f2dd80;color:#1a1a17}
.btn--ghost{background:transparent;color:var(--color-accent-deep);border:1.5px solid var(--color-accent)}
.btn--ghost:hover{background:#eef3ef;color:var(--color-accent-deep)}
.btn--deep{background:#445b4f;color:#fff}
.btn--deep:hover{background:#374b40;color:#fff}
:focus-visible{outline:3px solid var(--color-gold-deep);outline-offset:3px}

/* Header — canon condensing nav */
.site-header{position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(253,254,250,0);border-bottom:1px solid transparent;transition:background .3s ease,border-color .3s ease,box-shadow .3s ease}
.site-header.solid,.site-header.scrolled{background:rgba(253,254,250,.94);backdrop-filter:blur(8px);border-bottom-color:#eceee6}
.site-header.scrolled{box-shadow:0 6px 24px rgba(90,90,82,.10)}
.site-header .container{display:flex;align-items:center;justify-content:space-between;height:92px;transition:height .38s var(--ease-out-cubic)}
.site-header.scrolled .container{height:62px}
.brand{display:flex;align-items:center;gap:12px;color:var(--color-fg)}
.brand img{height:56px;width:auto;transform-origin:left center;transition:transform .38s var(--ease-out-cubic)}
.site-header.scrolled .brand img{transform:scale(.68)}
.brand .name{font-family:var(--heading-font-family);font-weight:700;font-size:16px;line-height:1.1}
.brand .tagwrap{display:grid;grid-template-rows:1fr;transition:grid-template-rows .38s var(--ease-out-cubic)}
.site-header.scrolled .brand .tagwrap{grid-template-rows:0fr}
.brand .tag{display:block;min-height:0;overflow:hidden;font-size:11px;letter-spacing:.12em;color:var(--color-accent-deep);text-transform:uppercase;font-weight:600;transition:opacity .3s ease}
.site-header.scrolled .brand .tag{opacity:0}
.nav{display:flex;gap:26px;align-items:center}
.nav a{font-size:15px;color:var(--color-fg);font-weight:500}
.nav a[aria-current]{color:var(--color-accent-deep);font-weight:700;box-shadow:inset 0 -2px 0 var(--color-gold)}
.nav a:hover{color:var(--color-accent-deep)}
.nav .btn{padding:10px 20px}
.nav-toggle{display:none;background:none;border:none;font-size:26px;color:var(--color-fg);cursor:pointer}
/* over-photo state (C hero) */
.site-header.over:not(.scrolled) .brand,.site-header.over:not(.scrolled) .nav a:not(.btn),
.site-header.over:not(.scrolled) .brand .tag,.site-header.over:not(.scrolled) .nav-toggle{color:#fff}
.site-header.over:not(.scrolled) .nav a[aria-current]{box-shadow:inset 0 -2px 0 var(--color-gold)}
.site-header.over:not(.scrolled) .brand img{filter:brightness(0) invert(1)}

/* Before / after comparison — responsive, labeled, keyboard-operable */
.ba{margin:0}
.ba__frame{--pos:50%;position:relative;aspect-ratio:var(--ar,3/4);border-radius:var(--radius);overflow:hidden;
  box-shadow:var(--shadow-card);background:#eceee6;isolation:isolate}
.ba__frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ba__before{clip-path:inset(0 calc(100% - var(--pos)) 0 0);z-index:1}
.ba__line{position:absolute;z-index:2;top:0;bottom:0;left:var(--pos);width:2px;margin-left:-1px;background:#fff;
  box-shadow:0 0 14px rgba(26,26,23,.35);pointer-events:none}
.ba__knob{position:absolute;z-index:3;top:50%;left:var(--pos);width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:999px;
  background:#fff;color:var(--color-accent-deep);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;
  letter-spacing:-2px;box-shadow:0 6px 18px rgba(26,26,23,.25);pointer-events:none;transition:transform .2s ease}
.ba__frame:hover .ba__knob{transform:scale(1.08)}
.ba__tag{position:absolute;z-index:3;top:12px;padding:5px 12px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.1em;
  text-transform:uppercase;pointer-events:none;line-height:1.2}
.ba__tag--before{left:12px;background:rgba(26,26,23,.64);color:#fff}
.ba__tag--after{right:12px;background:var(--color-gold);color:#1a1a17}
.ba__range{position:absolute;z-index:4;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:ew-resize;-webkit-appearance:none;appearance:none}
.ba__frame:has(.ba__range:focus-visible){outline:3px solid var(--color-gold-deep);outline-offset:3px}
.ba figcaption{font-size:var(--body-sm);color:var(--color-muted);margin-top:10px}

/* Contact — canon warm gold band */
.contact{background:linear-gradient(135deg,#f8e1af 0%,#eecb7f 100%);color:#1a1a17;text-align:center;padding:var(--section-padding) 0}
.contact .script{font-size:46px;color:var(--color-accent-deep);display:block;line-height:1;margin-bottom:6px}
.contact h2{font-size:var(--heading-xl);color:#1a1a17;margin-bottom:14px}
.contact p{color:#4a4433;max-width:52ch;margin:0 auto 30px}
.contact__row{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;align-items:center}
.contact__phone{color:#3f574a;font-weight:700;font-size:var(--body)}
.contact__more{margin-top:22px;font-size:var(--body-sm)}
.contact__more a{color:#3f574a;font-weight:700;text-decoration:underline;text-underline-offset:4px}

/* Footer — canon deep sage */
.site-footer{background:#445b4f;color:rgba(255,255,255,.82)}
.site-footer .container{display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between;padding-top:32px;padding-bottom:32px}
.site-footer .fcontact{display:flex;gap:22px;flex-wrap:wrap;align-items:center;font-size:var(--body-sm)}
.site-footer a{color:#fff;font-weight:600}
.site-footer a:hover{color:var(--color-gold)}
.socials{display:flex;gap:12px;align-items:center}
.socials a{width:34px;height:34px;border-radius:999px;background:rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center}
.socials img{width:18px;height:18px}

@media (max-width:900px){
  :root{--section-padding:64px}
  .nav{display:none}
  .nav-toggle{display:block}
  .site-header.open .nav{display:flex;position:absolute;top:100%;left:0;right:0;flex-direction:column;background:var(--color-bg);padding:20px 24px;gap:16px;border-bottom:1px solid #eceee6}
  .site-header.open .nav a:not(.btn){color:var(--color-fg)!important}
  .site-header.open{background:rgba(253,254,250,.98)}
}
@media (max-width:560px){
  :root{--heading-xl:30px;--heading-lg:27px;--section-padding:56px}
  .contact .script{font-size:36px}
  .brand .name{font-size:14px}
  .brand img{height:46px}
}
"""

def header(extra=''):
    return f"""<header class="site-header {extra}" id="nav">
  <div class="container">
    <a class="brand" href="/" aria-label="Céline Knobloch — accueil">
      <img src="assets/logo.svg" alt="Logo Céline Knobloch">
      <span class="name">CÉLINE KNOBLOCH<span class="tagwrap"><span class="tag">Trier · Ranger · Optimiser</span></span></span>
    </a>
    <button class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="primary-nav">☰</button>
    <nav class="nav" id="primary-nav" aria-label="Navigation principale">
      <a href="/">Accueil</a>
      <a href="/qui-suis-je">Qui suis-je ?</a>
      <a href="/prestations-tarifs/">Prestations et Tarifs</a>
      <a href="/realisations/" aria-current="page">Mes Réalisations</a>
      <a class="btn btn--gold" href="/contact">Contactez-moi</a>
    </nav>
  </div>
</header>"""

CONTACT = """<section class="contact" data-section="contact-cta" data-intent="drive action" data-layout="full-bleed" data-interactive="link">
  <div class="container">
    <span class="script" data-anim>Et si on commençait&nbsp;?</span>
    <h2 data-anim>Prêt(e) pour une maison plus sereine&nbsp;?</h2>
    <p data-anim>Parlons de votre projet, sans engagement. Le premier échange se fait par email ou téléphone, en toute simplicité.</p>
    <div class="contact__row" data-anim>
      <a class="btn btn--deep" href="mailto:contact@celinek.org">Contactez-moi</a>
      <a class="contact__phone" href="tel:+33632731898">📞 06 32 73 18 98</a>
    </div>
    <p class="contact__more" data-anim><a href="/#process">Comment ça se passe&nbsp;?</a></p>
  </div>
</section>"""

FOOTER = """<footer class="site-footer" data-section="footer" data-intent="wayfinding" data-layout="edge-to-edge">
  <div class="container">
    <div class="fcontact">
      <span>© Céline Knobloch, 2025</span>
      <a href="tel:+33632731898">Tél : 06 32 73 18 98</a>
      <a href="mailto:contact@celinek.org">contact@celinek.org</a>
    </div>
    <div class="socials">
      <a href="/" aria-label="Instagram"><img src="assets/instagram.svg" alt="Instagram"></a>
      <a href="/" aria-label="Facebook"><img src="assets/facebook.svg" alt="Facebook"></a>
    </div>
  </div>
</footer>"""

CANON_JS = r"""
/* mobile nav + condensing header (canon) */
(function(){
  var h=document.getElementById('nav'),b=h.querySelector('.nav-toggle');
  b.addEventListener('click',function(){var o=h.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&h.classList.contains('open')){h.classList.remove('open');b.setAttribute('aria-expanded','false');b.focus();}});
  function s(){h.classList.toggle('scrolled',window.scrollY>40);} s(); window.addEventListener('scroll',s,{passive:true});
})();
/* before/after comparison: range drives --pos */
document.querySelectorAll('.ba__frame').forEach(function(f){
  var r=f.querySelector('.ba__range'); if(!r) return;
  function u(){f.style.setProperty('--pos',r.value+'%');} r.addEventListener('input',u); u();
});
"""


def ba(room, p, i, n, cls='', eager=False):
    load = '' if eager else ' loading="lazy"'
    label = f"{room['name']}" + (f" — {i}/{n}" if n > 1 else '')
    return f"""<figure class="ba {cls}" data-room="{room['id']}">
  <div class="ba__frame" style="--ar:{ar(p)}">
    <img class="ba__after" src="{IMG}{p['slug']}-after.webp" alt="{room['name']} — après le rangement"{load}>
    <img class="ba__before" src="{IMG}{p['slug']}-before.webp" alt="{room['name']} — avant le rangement"{load}>
    <span class="ba__line" aria-hidden="true"></span><span class="ba__knob" aria-hidden="true">‹›</span>
    <span class="ba__tag ba__tag--before" aria-hidden="true">Avant</span><span class="ba__tag ba__tag--after" aria-hidden="true">Après</span>
    <input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Comparer avant / après — {label}">
  </div>
</figure>"""


def page(title_suffix, prov, css, body, js, lenis=False):
    return f"""<!DOCTYPE html>
<!--
  _provenance:
{prov}
    againstInput: https://redesign-c-preview--celinek-org--gknobloch.aem.page/realisations/
    brandSurface: approved homepage canon (stardust/prototypes/index-C-cinematic.html, DESIGN-C.json)
    mode: A (brand-faithful — palette + type pinned to the redesign)
    contentSource: stardust/current/pages/realisations.json (verbatim fr-FR; 22 real pairs)
    generatedBy: stardust/scripts/realisations-prototypes.py
-->
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Mes Réalisations — Céline Knobloch, Home Organiser{title_suffix}</title>
<link rel="icon" href="assets/favicon.ico">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{INTRO}">
<meta property="og:image" content="{IMG}chambres-damis-1-after.webp">
{'<link rel="stylesheet" href="lenis.min.css">' if lenis else ''}
<style>{CANON_CSS}{css}</style>
</head>
<body>
{body}
{'<script src="lenis.min.js"></script>' if lenis else ''}
<script>{CANON_JS}{js}</script>
</body>
</html>
"""


# ───────────────────────── Variant A ─────────────────────────
def variant_a():
    css = r"""
.page-head{padding:164px 0 56px}
.page-head .script{font-size:48px;display:block;line-height:1;margin-bottom:4px}
.page-head h1{font-size:var(--heading-xl);margin-bottom:16px}
.page-head .lead{font-size:20px;color:var(--color-muted);max-width:56ch;margin:0 0 8px}
.page-head .meta{font-size:var(--body-sm);color:var(--color-accent-deep);font-weight:600;letter-spacing:.04em;margin:0 0 32px}
.room-index{display:flex;flex-wrap:wrap;gap:10px;margin:0;padding:0;list-style:none}
.room-index a{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:999px;background:var(--color-surface);
  border:1.5px solid #dfe5e1;color:var(--color-fg);font-size:var(--body-sm);font-weight:600;transition:border-color .2s ease,background .2s ease}
.room-index a:hover{border-color:var(--color-accent);background:#f3f6f4;color:var(--color-fg)}
.room-index .n{font-size:12px;min-width:22px;height:22px;border-radius:999px;background:var(--color-band-sage);color:var(--color-accent-deep);display:inline-flex;align-items:center;justify-content:center}
.rooms{padding:24px 0 var(--section-padding)}
.room{display:grid;grid-template-columns:250px 1fr;gap:48px;padding:56px 0;border-top:1px solid #eceee6;scroll-margin-top:72px}
.room__head{position:sticky;top:96px;align-self:start}
.room__num{font-size:var(--body-sm);font-weight:700;color:var(--color-gold-deep);letter-spacing:.1em;margin:0 0 6px}
.room__head h2{font-size:var(--heading-lg);margin-bottom:6px}
.room__count{font-size:var(--body-sm);color:var(--color-muted);margin:0 0 14px}
.room__top{font-size:14px;font-weight:600}
.ba-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start}
.ba--wide{grid-column:1/-1}
.hint{font-size:14px;color:var(--color-muted);margin:14px 0 0;display:flex;gap:8px;align-items:center}
@media (max-width:900px){
  .page-head{padding:128px 0 40px}
  .room{grid-template-columns:1fr;gap:20px;padding:40px 0}
  .room__head{position:static}
}
@media (max-width:560px){
  .page-head .script{font-size:38px}
  .ba-grid{grid-template-columns:1fr}
}
"""
    chips = '\n'.join(f'<li><a href="#{r["id"]}">{r["name"]} <span class="n">{len(r["pairs"])}</span></a></li>' for r in ROOMS)
    rooms_html = []
    for k, r in enumerate(ROOMS, 1):
        n = len(r['pairs'])
        figs = '\n'.join(ba(r, p, i, n, 'ba--wide' if wide(p) else '', eager=(k == 1)) for i, p in enumerate(r['pairs'], 1))
        rooms_html.append(f"""<section class="room" id="{r['id']}" data-section="room-{r['id']}" data-intent="proof" data-layout="split" data-items="{n}">
  <div class="room__head">
    <p class="room__num">{k:02d} / {len(ROOMS):02d}</p>
    <h2>{r['name']}</h2>
    <p class="room__count">{plural(n)}</p>
    <a class="room__top" href="#pieces">↑ Toutes les pièces</a>
  </div>
  <div class="ba-grid">
{figs}
  </div>
</section>""")
    body = f"""{header('solid')}
<main>
  <section class="page-head" id="pieces" data-section="page-head" data-intent="orient" data-layout="stacked">
    <div class="container">
      <span class="script">Avant, après</span>
      <h1>Mes Réalisations</h1>
      <p class="lead">{INTRO}</p>
      <p class="meta">{TOTAL} transformations · {len(ROOMS)} pièces</p>
      <nav aria-label="Pièces">
        <ul class="room-index">
{chips}
        </ul>
      </nav>
      <p class="hint">↔ Faites glisser sur chaque photo pour comparer avant et après.</p>
    </div>
  </section>
  <div class="rooms"><div class="container">
{chr(10).join(rooms_html)}
  </div></div>
{CONTACT}
</main>
{FOOTER}"""
    prov = """    writtenBy: stardust:uplift (Phase 5 / prototype — variant A)
    writtenAt: 2026-09-23
    variant: A — faithful + improvements (static)
    improvementsApplied: [1,2,3,4,5,6,7]"""
    return page('', prov, css, body, '')


# ───────────────────────── Variant B ─────────────────────────
QUOTES = [
    ("Grâce à son intervention, mon quotidien a changé : moins de superflu, juste l'essentiel et un réel gain de temps.", "Agathe"),
    ("N'hésitez pas à l'appeler pour faire entrer la lumière dans votre chez-vous !", "Alban"),
]


def variant_b():
    css = r"""
.page-head{padding:150px 0 36px;text-align:center}
.page-head .script{font-size:48px;display:block;line-height:1;margin-bottom:4px}
.page-head h1{font-size:var(--heading-xl);margin-bottom:14px}
.page-head .lead{font-size:19px;color:var(--color-muted);max-width:52ch;margin:0 auto}
.filter{position:sticky;top:62px;z-index:20;background:rgba(253,254,250,.95);backdrop-filter:blur(8px);border-bottom:1px solid #eceee6;padding:14px 0}
.filter .container{display:flex;align-items:center;gap:18px}
@media (min-width:901px){.chips{flex-wrap:wrap;overflow:visible}}
.filter__label{font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--color-accent-deep);white-space:nowrap}
.chips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:2px}
.chips::-webkit-scrollbar{display:none}
.chip{flex:0 0 auto;font:600 var(--body-sm)/1 var(--body-font-family);padding:10px 16px;border-radius:999px;border:1.5px solid #dfe5e1;
  background:var(--color-surface);color:var(--color-fg);cursor:pointer;display:inline-flex;gap:8px;align-items:center;transition:all .2s ease}
.chip .n{font-size:12px;color:var(--color-accent-deep)}
.chip:hover{border-color:var(--color-accent)}
.chip[aria-pressed="true"]{background:var(--color-accent-deep);border-color:var(--color-accent-deep);color:#fff}
.chip[aria-pressed="true"] .n{color:var(--color-gold)}
.results{padding:40px 0 var(--section-padding)}
.results__status{font-size:var(--body-sm);color:var(--color-muted);margin:0 0 22px}
.results__status strong{color:var(--color-fg)}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
.card{margin:0;position:relative}
.card[hidden]{display:none}
.card__media{position:relative;display:block;width:100%;aspect-ratio:4/5;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-card);
  border:0;padding:0;cursor:zoom-in;background:#eceee6}
.card__media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .5s ease,transform .8s var(--ease-expo)}
.card__media .before{opacity:0}
.card.show-before .card__media .before{opacity:1}
.card__media:hover img{transform:scale(1.03)}
.card__state{position:absolute;top:12px;left:12px;padding:5px 12px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  background:var(--color-gold);color:#1a1a17;transition:background .3s ease,color .3s ease}
.card.show-before .card__state{background:rgba(26,26,23,.64);color:#fff}
.card figcaption{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:12px}
.card__room{font-weight:700;font-size:16px}
.card__room small{font-weight:500;color:var(--color-muted);font-size:13px;margin-left:6px}
.card__toggle{font:600 13px/1 var(--body-font-family);border:1.5px solid var(--color-accent);color:var(--color-accent-deep);background:transparent;
  padding:8px 13px;border-radius:999px;cursor:pointer;white-space:nowrap}
.card__toggle:hover{background:#eef3ef}
.interlude{grid-column:1/-1;background:var(--color-band-warm);border-radius:var(--radius);padding:40px 48px;display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center;margin:8px 0}
.interlude[hidden]{display:none}
.interlude .mark{font-family:var(--script-font-family);font-size:120px;line-height:.6;color:var(--color-accent-deep)}
.interlude blockquote{margin:0;font-size:22px;line-height:1.5;font-style:italic;color:#3d3829}
.interlude cite{display:block;margin-top:10px;font-style:normal;font-weight:700;font-size:var(--body-sm);color:var(--color-accent-deep);letter-spacing:.04em}
dialog.viewer{border:0;padding:0;border-radius:20px;width:min(92vw,980px);max-height:94vh;background:var(--color-bg);box-shadow:0 30px 80px rgba(26,26,23,.35);overflow:auto}
dialog.viewer::backdrop{background:rgba(26,26,23,.72);backdrop-filter:blur(3px)}
.viewer__bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 22px}
.viewer__title{font-weight:700;font-size:20px}
.viewer__title small{font-weight:500;color:var(--color-muted);font-size:14px;margin-left:8px}
.viewer__btns{display:flex;gap:8px}
.viewer__btns button{width:42px;height:42px;border-radius:999px;border:0;background:var(--color-surface);box-shadow:var(--shadow-card);color:var(--color-accent-deep);font-size:20px;cursor:pointer}
.viewer__btns button:hover{background:#eef3ef}
.viewer__stage{padding:0 22px 22px;display:flex;justify-content:center}
.viewer__stage .ba{width:100%}
.viewer__stage .ba__frame{max-height:74vh;margin:0 auto}
@media (max-width:900px){
  .cards{grid-template-columns:1fr 1fr;gap:18px}
  .filter__label{display:none}
  .interlude{padding:28px;grid-template-columns:1fr;gap:6px}
  .interlude .mark{font-size:80px}
}
@media (max-width:560px){
  .page-head{padding:120px 0 28px}
  .page-head .script{font-size:38px}
  .cards{grid-template-columns:1fr 1fr;gap:14px}
  .card figcaption{flex-direction:column;align-items:flex-start;gap:8px}
  .card__room{font-size:14px}
  .interlude blockquote{font-size:18px}
}
"""
    chips = [f'<button class="chip" type="button" data-filter="all" aria-pressed="true">Toutes <span class="n">{TOTAL}</span></button>']
    chips += [f'<button class="chip" type="button" data-filter="{r["id"]}" aria-pressed="false">{r["name"]} <span class="n">{len(r["pairs"])}</span></button>' for r in ROOMS]
    cards = []
    idx = 0
    for r in ROOMS:
        n = len(r['pairs'])
        for i, p in enumerate(r['pairs'], 1):
            idx += 1
            num = f"<small>{i}/{n}</small>" if n > 1 else ''
            load = '' if idx <= 3 else ' loading="lazy"'
            cards.append(f"""<figure class="card" data-room="{r['id']}" data-slug="{p['slug']}" data-ar="{ar(p)}" data-name="{r['name']}" data-i="{i}" data-n="{n}">
  <button class="card__media" type="button" aria-label="Agrandir et comparer — {r['name']}{' ' + str(i) + '/' + str(n) if n > 1 else ''}">
    <img class="after" src="{IMG}{p['slug']}-after.webp" alt="{r['name']} — après le rangement"{load}>
    <img class="before" src="{IMG}{p['slug']}-before.webp" alt="{r['name']} — avant le rangement"{load}>
    <span class="card__state" aria-hidden="true">Après</span>
  </button>
  <figcaption><span class="card__room">{r['name']}{num}</span><button class="card__toggle" type="button" aria-pressed="false">Voir l'avant</button></figcaption>
</figure>""")
            if idx in (6, 15):
                q, who = QUOTES[0 if idx == 6 else 1]
                cards.append(f"""<aside class="interlude" data-interlude>
  <span class="mark" aria-hidden="true">“</span>
  <div><blockquote>{q}</blockquote><cite>— {who}</cite></div>
</aside>""")
    body = f"""{header('solid')}
<main>
  <section class="page-head" data-section="page-head" data-intent="orient" data-layout="centered">
    <div class="container">
      <span class="script">Pièce par pièce</span>
      <h1>Mes Réalisations</h1>
      <p class="lead">{INTRO}</p>
    </div>
  </section>
  <div class="filter" data-section="room-filter" data-intent="route" data-layout="sticky-bar" data-interactive="filter">
    <div class="container">
      <span class="filter__label" id="flabel">Choisissez une pièce</span>
      <div class="chips" role="group" aria-labelledby="flabel">
        {chr(10).join(chips)}
      </div>
    </div>
  </div>
  <section class="results" data-section="gallery" data-intent="proof" data-layout="grid" data-items="{TOTAL}">
    <div class="container">
      <p class="results__status" aria-live="polite"><strong>{TOTAL} transformations</strong> · toutes les pièces</p>
      <div class="cards">
{chr(10).join(cards)}
      </div>
    </div>
  </section>
{CONTACT}
</main>
{FOOTER}
<dialog class="viewer" aria-labelledby="vtitle">
  <div class="viewer__bar">
    <span class="viewer__title" id="vtitle"></span>
    <div class="viewer__btns">
      <button type="button" data-step="-1" aria-label="Précédente">‹</button>
      <button type="button" data-step="1" aria-label="Suivante">›</button>
      <button type="button" data-close aria-label="Fermer">✕</button>
    </div>
  </div>
  <div class="viewer__stage"></div>
</dialog>"""
    js = r"""
(function(){
  var chips=[].slice.call(document.querySelectorAll('.chip'));
  var cards=[].slice.call(document.querySelectorAll('.card'));
  var inter=[].slice.call(document.querySelectorAll('[data-interlude]'));
  var status=document.querySelector('.results__status');
  function apply(f){
    chips.forEach(function(c){c.setAttribute('aria-pressed',c.dataset.filter===f?'true':'false');});
    var n=0,name='';
    cards.forEach(function(c){var on=f==='all'||c.dataset.room===f;c.hidden=!on;if(on){n++;name=c.dataset.name;}});
    inter.forEach(function(q){q.hidden=f!=='all';});
    status.innerHTML='<strong>'+n+' transformation'+(n>1?'s':'')+'</strong> · '+(f==='all'?'toutes les pièces':name);
  }
  chips.forEach(function(c){c.addEventListener('click',function(){apply(c.dataset.filter);
    var top=document.querySelector('.results').getBoundingClientRect().top+window.scrollY-140;
    if(window.scrollY>top) window.scrollTo({top:top,behavior:'smooth'});});});
  cards.forEach(function(c){
    var t=c.querySelector('.card__toggle'),s=c.querySelector('.card__state');
    t.addEventListener('click',function(){var b=c.classList.toggle('show-before');t.setAttribute('aria-pressed',b?'true':'false');
      t.textContent=b?"Voir l'après":"Voir l'avant";s.textContent=b?'Avant':'Après';});
  });
  /* viewer dialog with a large comparison, prev/next within the current filter */
  var dlg=document.querySelector('dialog.viewer'),stage=dlg.querySelector('.viewer__stage'),title=dlg.querySelector('#vtitle'),cur=null;
  function show(c){
    cur=c; var d=c.dataset;
    title.innerHTML=d.name+(d.n>1?'<small>'+d.i+'/'+d.n+'</small>':'');
    stage.innerHTML='<figure class="ba"><div class="ba__frame" style="--ar:'+d.ar+';width:min(100%,calc(74vh*('+d.ar+')))">'+
      '<img class="ba__after" src="assets/realisations/'+d.slug+'-after.webp" alt="'+d.name+' — après le rangement">'+
      '<img class="ba__before" src="assets/realisations/'+d.slug+'-before.webp" alt="'+d.name+' — avant le rangement">'+
      '<span class="ba__line" aria-hidden="true"></span><span class="ba__knob" aria-hidden="true">‹›</span>'+
      '<span class="ba__tag ba__tag--before" aria-hidden="true">Avant</span><span class="ba__tag ba__tag--after" aria-hidden="true">Après</span>'+
      '<input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Comparer avant / après — '+d.name+'"></div></figure>';
    var f=stage.querySelector('.ba__frame'),r=f.querySelector('.ba__range');
    r.addEventListener('input',function(){f.style.setProperty('--pos',r.value+'%');});
  }
  cards.forEach(function(c){c.querySelector('.card__media').addEventListener('click',function(){show(c);dlg.showModal();stage.querySelector('.ba__range').focus();});});
  dlg.querySelectorAll('[data-step]').forEach(function(b){b.addEventListener('click',function(){
    var vis=cards.filter(function(c){return !c.hidden;}),k=vis.indexOf(cur);
    show(vis[(k+Number(b.dataset.step)+vis.length)%vis.length]);});});
  dlg.querySelector('[data-close]').addEventListener('click',function(){dlg.close();});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close();});
})();
"""
    prov = """    writtenBy: stardust:uplift (Phase 5 / prototype — variant B)
    writtenAt: 2026-09-23
    variant: B — "what if visitors started from their own room?" (catalog #7 audience-routing + derived D1 testimony interludes)
    motion: static
    quotes: verbatim excerpts from homepage reviews (Agathe, Alban) — never attributed to a room"""
    return page('', prov, css, body, js)


# ───────────────────────── Variant C ─────────────────────────
def variant_c(cinematic):
    hero_pair = next(p for r in ROOMS for p in r['pairs'] if p['slug'] == 'chambres-damis-1')
    css = r"""
/* Hero — before dissolves into after as you scroll (pinned) */
.hero{position:relative;height:100vh;min-height:600px}
.hero__stage{position:relative;height:100vh;min-height:600px;overflow:hidden}
.hero__img{position:absolute;inset:-6% 0 -6% 0;will-change:transform}
.hero__img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 40%}
.hero__img .after{-webkit-mask-image:linear-gradient(90deg,#000 0,#000 calc(var(--p,1)*116% - 16%),transparent calc(var(--p,1)*116%));
  mask-image:linear-gradient(90deg,#000 0,#000 calc(var(--p,1)*116% - 16%),transparent calc(var(--p,1)*116%))}
.hero__shade{position:absolute;inset:0;background:
  radial-gradient(ellipse 58% 62% at 80% 86%,rgba(26,26,23,.62) 0%,rgba(26,26,23,.28) 55%,rgba(26,26,23,0) 100%),
  linear-gradient(180deg,rgba(26,26,23,.52) 0%,rgba(26,26,23,.08) 22%,rgba(26,26,23,.06) 55%,rgba(26,26,23,.5) 100%)}
.hero__inner{position:absolute;left:0;right:0;bottom:0;padding-bottom:72px;z-index:2}
.hero__panel{max-width:560px;margin-left:auto}
.hero__script{font-family:var(--script-font-family);color:#fff;font-size:80px;line-height:.95;margin:0 0 8px;text-shadow:0 2px 20px rgba(26,26,23,.35)}
.hero__script .w{display:inline-block}
.hero h1{font-size:var(--heading-xl);color:#fff;margin:0 0 14px;text-shadow:0 2px 16px rgba(26,26,23,.4)}
.hero .lead{color:rgba(255,255,255,.92);font-size:18px;margin:0 0 22px;text-shadow:0 1px 10px rgba(26,26,23,.45);max-width:46ch}
.state{display:inline-flex;gap:0;border-radius:999px;overflow:hidden;background:rgba(26,26,23,.45);backdrop-filter:blur(4px);font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
.state span{padding:7px 14px;color:rgba(255,255,255,.7);transition:background .35s ease,color .35s ease}
.state .on-b{background:rgba(255,255,255,.18);color:#fff}
.state .on-a{background:var(--color-gold);color:#1a1a17}
.scroll-cue{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);z-index:2;color:#fff;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;opacity:.9;text-align:center}
.scroll-cue::after{content:"↓";display:block;font-size:20px;animation:bob 2.4s ease-in-out infinite}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(7px)}}
.read-progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:60;pointer-events:none}
.read-progress i{display:block;height:100%;transform:scaleX(0);transform-origin:left;background:linear-gradient(90deg,var(--color-accent),var(--color-gold))}

/* Room rail — sticky chapter index with scroll-spy */
.rail{position:sticky;top:62px;z-index:20;background:rgba(253,254,250,.95);backdrop-filter:blur(8px);border-bottom:1px solid #eceee6}
.rail ol{list-style:none;margin:0 auto;padding:12px 24px;max-width:var(--max-width);display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;counter-reset:r}
.rail ol::-webkit-scrollbar{display:none}
.rail a{display:block;white-space:nowrap;padding:8px 14px;border-radius:999px;font-size:14px;font-weight:600;color:var(--color-muted);transition:background .3s ease,color .3s ease}
.rail a:hover{color:var(--color-fg)}
.rail a.active{background:var(--color-band-sage);color:var(--color-accent-deep)}

/* Chapters */
.intro{padding:88px 0 24px;text-align:center}
.intro .script{font-size:44px;display:block;line-height:1}
.intro h2{font-size:var(--heading-xl);margin:2px 0 12px}
.intro p{color:var(--color-muted);max-width:54ch;margin:0 auto}
.chapter{scroll-margin-top:114px}
.stage{position:relative}
.stage__sticky{display:grid;grid-template-columns:300px minmax(0,1fr);gap:56px;align-items:center;padding-top:48px;padding-bottom:48px}
.stage__copy .num{font-size:var(--body-sm);font-weight:700;color:var(--color-gold-deep);letter-spacing:.1em;margin:0 0 6px}
.stage__copy .script{font-size:40px;display:block;line-height:1;margin-bottom:2px}
.stage__copy h2{font-size:var(--heading-lg);margin:0 0 8px}
.stage__copy p{color:var(--color-muted);font-size:var(--body-sm);margin:0 0 18px}
.stage__copy .state{background:#e9ede9}
.stage__copy .state span{color:var(--color-muted)}
.stage__copy .state .on-b{background:#5a5a52;color:#fff}
.stage__frame{position:relative;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-soft);background:#eceee6;justify-self:center;width:100%}
.stage__frame img{width:100%;height:100%;object-fit:cover}
/* static (proposed / no-JS / reduced motion): side by side */
.stage__pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.stage__pair figure{margin:0;position:relative}
.stage__pair figure .stage__frame{aspect-ratio:var(--ar)}
.stage__pair .ba__tag{position:absolute}
.more{padding:0 0 72px}
.more .ba-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;align-items:start}
.more .ba--wide{grid-column:span 2}
.chapter + .chapter{border-top:1px solid #eceee6}

/* ── Cinematic mode (html.motion) ── */
html.motion .hero{height:210vh}
html.motion .hero__stage{position:sticky;top:0}
html.motion .stage{height:170vh}
html.motion .stage__sticky{position:sticky;top:114px;height:calc(100vh - 114px);padding-top:24px;padding-bottom:24px}
html.motion .stage__pair{display:block;position:relative;height:calc(100vh - 170px);aspect-ratio:var(--ar);max-width:100%;margin:0 auto}
html.motion .stage__pair figure{position:absolute;inset:0}
html.motion .stage__pair figure .stage__frame{height:100%;aspect-ratio:auto}
html.motion .stage__pair .is-before .ba__tag,html.motion .stage__pair .is-after .ba__tag{display:none}
html.motion .stage__pair .is-after{-webkit-mask-image:linear-gradient(90deg,#000 0,#000 calc(var(--p,0)*116% - 16%),transparent calc(var(--p,0)*116%));
  mask-image:linear-gradient(90deg,#000 0,#000 calc(var(--p,0)*116% - 16%),transparent calc(var(--p,0)*116%))}
html.motion .stage__pair .is-after img{transform:scale(calc(1.06 - var(--p,0)*.06))}
html.motion [data-anim]{opacity:0;transform:translateY(30px)}
html:not(.motion) .state{display:none}

@media (max-width:900px){
  .stage__sticky{grid-template-columns:minmax(0,1fr);gap:18px}
  html.motion .stage__sticky{grid-template-rows:auto minmax(0,1fr);align-items:start;gap:14px}
  html.motion .stage__pair{height:auto;width:100%;max-height:calc(100vh - 300px)}
  .stage__copy .num{display:none}
  .stage__copy p{display:none}
  .more .ba-grid{grid-template-columns:1fr 1fr}
  .hero__script{font-size:56px}
}
@media (max-width:560px){
  .hero__script{font-size:46px}
  .hero .lead{font-size:16px}
  .more .ba-grid{grid-template-columns:1fr}
  .more .ba--wide{grid-column:auto}
  .stage__copy .script{font-size:32px}
  .stage__pair{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
  html{scroll-behavior:auto}
}
"""
    rail = '\n'.join(f'<li><a href="#{r["id"]}">{r["name"]}</a></li>' for r in ROOMS)
    chapters = []
    for k, r in enumerate(ROOMS, 1):
        n = len(r['pairs'])
        lead, rest = r['pairs'][0], r['pairs'][1:]
        more = ''
        if rest:
            figs = '\n'.join(ba(r, p, i, n, ('ba--wide ' if wide(p) else ''), False).replace('<figure class="ba', '<figure data-anim class="ba', 1)
                             for i, p in enumerate(rest, 2))
            more = f'<div class="more"><div class="container"><div class="ba-grid">\n{figs}\n</div></div></div>'
        chapters.append(f"""<section class="chapter" id="{r['id']}" data-section="room-{r['id']}" data-intent="proof" data-layout="pinned-stage" data-items="{n}">
  <div class="stage">
    <div class="container stage__sticky">
      <div class="stage__copy">
        <p class="num">{k:02d} / {len(ROOMS):02d}</p>
        <span class="script">avant, après</span>
        <h2>{r['name']}</h2>
        <p>{plural(n)}</p>
        <div class="state" aria-hidden="true"><span class="b">Avant</span><span class="a">Après</span></div>
      </div>
      <div class="stage__pair" style="--ar:{ar(lead)}">
        <figure class="is-before"><div class="stage__frame"><img src="{IMG}{lead['slug']}-before.webp" alt="{r['name']} — avant le rangement" loading="lazy"></div><span class="ba__tag ba__tag--before">Avant</span></figure>
        <figure class="is-after"><div class="stage__frame"><img src="{IMG}{lead['slug']}-after.webp" alt="{r['name']} — après le rangement" loading="lazy"></div><span class="ba__tag ba__tag--after">Après</span></figure>
      </div>
    </div>
  </div>
  {more}
</section>""")
    body = f"""<div class="read-progress" aria-hidden="true"><i></i></div>
{header('over')}
<main>
  <section class="hero" data-section="hero" data-intent="emotional hook" data-layout="full-bleed" data-media="image">
    <div class="hero__stage">
      <div class="hero__img" data-hero-img>
        <img class="before" src="{IMG}chambres-damis-1-before.webp" alt="Chambre d'amis — avant le rangement" fetchpriority="high">
        <img class="after" src="{IMG}chambres-damis-1-after.webp" alt="Chambre d'amis — après le rangement" fetchpriority="high">
      </div>
      <div class="hero__shade"></div>
      <div class="hero__inner"><div class="container"><div class="hero__panel">
        <p class="hero__script">Avant, après</p>
        <h1>Mes Réalisations</h1>
        <p class="lead">{INTRO}</p>
        <div class="state" aria-hidden="true"><span class="b">Avant</span><span class="a">Après</span></div>
      </div></div></div>
      <div class="scroll-cue" aria-hidden="true">Faites défiler</div>
    </div>
  </section>
  <nav class="rail" aria-label="Pièces"><ol>
{rail}
  </ol></nav>
  <div class="intro">
    <div class="container">
      <span class="script" data-anim>Pièce par pièce</span>
      <h2 data-anim>{TOTAL} transformations, {len(ROOMS)} pièces</h2>
      <p data-anim>Faites défiler : chaque pièce passe de l'avant à l'après. Faites ensuite glisser sur les autres photos pour comparer.</p>
    </div>
  </div>
{chr(10).join(chapters)}
{CONTACT}
</main>
{FOOTER}"""
    js_common = r"""
/* scroll-spy for the room rail (state, not motion — runs in both modes) */
(function(){
  var links=[].slice.call(document.querySelectorAll('.rail a')),chs=links.map(function(a){return document.querySelector(a.getAttribute('href'));});
  function spy(){var y=window.innerHeight*.45,k=-1;chs.forEach(function(c,i){if(c.getBoundingClientRect().top<y)k=i;});
    links.forEach(function(a,i){var on=i===k;a.classList.toggle('active',on);if(on&&a.getAttribute('aria-current')!=='true'){a.setAttribute('aria-current','true');
      var r=a.parentElement.parentElement;r.scrollTo({left:a.offsetLeft-r.clientWidth/2+a.offsetWidth/2,behavior:'smooth'});}
      if(!on)a.removeAttribute('aria-current');});}
  window.addEventListener('scroll',spy,{passive:true});spy();
})();
"""
    js_motion = r"""
/* ── Editorial cinematic runtime — "the scroll turns avant into après" ── */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var progressEl=document.querySelector('.read-progress i');
  if(reduce){ /* static side-by-side stays; progress bar is state, keep it */
    window.addEventListener('scroll',function(){var m=document.documentElement.scrollHeight-innerHeight;progressEl.style.transform='scaleX('+(m>0?scrollY/m:0)+')';},{passive:true});
    return;
  }
  document.documentElement.classList.add('motion');
  var lenis=new Lenis({lerp:0.1,smoothWheel:true}); window.__lenis=lenis;
  (function raf(t){lenis.raf(t);requestAnimationFrame(raf);})(performance.now());
  document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();lenis.scrollTo(t,{offset:-114,duration:1.4});});});
  var clamp=function(v,a,b){return v<a?a:v>b?b:v;}, ease=function(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;};
  /* hero script word reveal (canon signature entrance) */
  var hs=document.querySelector('.hero__script');
  hs.innerHTML=hs.textContent.split(/(\s+)/).map(function(t){return /^\s+$/.test(t)?t:'<span class="w">'+t+'</span>';}).join('');
  var words=hs.querySelectorAll('.w');
  words.forEach(function(w,i){w.style.opacity=0;w.style.transform='translateY(30px)';w.style.transition='opacity .9s ease '+(200+i*140)+'ms, transform .9s cubic-bezier(.16,1,.3,1) '+(200+i*140)+'ms';});
  requestAnimationFrame(function(){requestAnimationFrame(function(){words.forEach(function(w){w.style.opacity=1;w.style.transform='none';});});});
  var hero=document.querySelector('.hero'),heroImg=document.querySelector('[data-hero-img]'),heroInner=document.querySelector('.hero__inner');
  var heroState=hero.querySelector('.state');
  var stages=[].slice.call(document.querySelectorAll('.stage')).map(function(s){return{el:s,pair:s.querySelector('.stage__pair'),state:s.querySelector('.state')};});
  var anims=[].slice.call(document.querySelectorAll('[data-anim]'));
  function setState(st,p){if(!st)return;st.children[0].className='b'+(p<.5?' on-b':'');st.children[1].className='a'+(p>=.5?' on-a':'');}
  var t0=performance.now();
  (function tick(now){
    var vh=innerHeight,sy=lenis.scroll;
    var max=document.documentElement.scrollHeight-vh; progressEl.style.transform='scaleX('+(max>0?clamp(sy/max,0,1):0)+')';
    /* hero: hold on avant, feathered wipe to après over the pinned stretch, then drift out */
    var hr=hero.getBoundingClientRect(), span=hr.height-vh;
    var hp=clamp(-hr.top/span,0,1), p=ease(clamp((hp-.1)/.7,0,1));
    heroImg.style.setProperty('--p',p);
    var intro=1-ease(clamp((now-t0)/1600,0,1));
    heroImg.style.transform='scale('+(1.02+intro*.08+hp*.05)+') translateY('+(hp*3)+'vh)';
    heroInner.style.transform='translateY('+(-hp*6)+'vh)';
    setState(heroState,p);
    /* chapter stages: pinned dissolve avant → après */
    stages.forEach(function(s){var r=s.el.getBoundingClientRect(),sp=r.height-(vh-114);
      if(r.bottom<0||r.top>vh)return;
      var q=ease(clamp((clamp((114-r.top)/sp,0,1)-.12)/.62,0,1));
      s.pair.style.setProperty('--p',q); setState(s.state,q);});
    /* fade-rise reveals (canon) with bottom guarantee */
    var nb=clamp((sy-(max-vh*.6))/(vh*.6),0,1);
    anims.forEach(function(el,i){var r=el.getBoundingClientRect();var k=Math.max(clamp((vh*.92-r.top)/(vh*.3),0,1),nb);
      k=1-Math.pow(1-k,3); el.style.opacity=k; el.style.transform='translateY('+((1-k)*30)+'px)';});
    requestAnimationFrame(tick);
  })(performance.now());
  var nav=document.getElementById('nav'); lenis.on('scroll',function(e){nav.classList.toggle('scrolled',e.scroll>40);});
})();
"""
    prov = f"""    writtenBy: stardust:uplift (Phase 5 / prototype — variant C, {'cinematic' if cinematic else 'static reference'})
    writtenAt: 2026-09-23
    variant: C — "what if the scroll turned avant into après?" (catalog #2 photography re-foregrounding)
    motion:
      register: editorial (inherited from homepage DESIGN-C.json — registerSource: inherited-canon)
      behaviors: [pinned hero feathered wipe avant→après, pinned per-room dissolve stages, hero script word reveal, fade-rise reveals, reading-progress, condensing nav, rail scroll-spy]
      refuses: [hard clip reveals (wipe feathered 16%), count-ups, tickers]
      reducedMotion: stages render side-by-side avant/après, no pinning, no smooth scroll"""
    if cinematic:
        return page('', prov, css, body, js_common + js_motion, lenis=True)
    # static reference: after-state hero, side-by-side stages, reveals visible
    static_js = js_common + "document.querySelector('.hero__img').style.setProperty('--p',1);\n"
    return page(' (static)', prov, css, body, static_js)


if __name__ == '__main__':
  FILES = {
    'realisations-A-proposed.html': variant_a(),
    'realisations-B-proposed.html': variant_b(),
    'realisations-C-proposed.html': variant_c(False),
    'realisations-C-cinematic.html': variant_c(True),
  }
  for name, html in FILES.items():
    with open(os.path.join(OUT, name), 'w') as fh:
        fh.write(html)
    print(name, len(html))
