/**
 * cine-hero — full-bleed cinematic editorial hero (variant C).
 *
 * Authoring rows (positional):
 *   1. background image (<picture>/<img>) — LCP, eager-loaded
 *   2. script eyebrow tagline (p.script)
 *   3. headline — the page <h1>
 *   4. CTAs — bare <a> (light) + <em><a> (ghost); anchor to in-page sections
 *   (optional) a lead paragraph after the headline, then a price-tag paragraph
 *   (`Pack … <strong>à partir de 350 €</strong>`); a link paragraph BEFORE the
 *   headline is a breadcrumb (un-buttonized).
 *
 * Variant `split` (authored `cine-hero (split)` — qui-suis-je / contact): text left,
 * framed portrait right on the cream ground; no scroll parallax (motion.js skips it).
 *
 * Variant `wipe` (auto, when TWO images are authored — /realisations/): image 1 =
 * "avant", image 2 = "après". The hero pins for a scroll stretch while scripts/motion.js
 * drives `--p` 0→1, dissolving avant into après with a feathered wipe. No-JS /
 * reduced-motion: static, après shown.
 *
 * Motion (block-owned, no shared runtime): bg scroll-drift + slow scale + idle
 * Ken Burns breathe + on-load settle; hero copy drift + fade on scroll;
 * word-by-word script reveal; reading-progress bar; header condense; mini-Lenis
 * smooth-scroll. All neutralized under prefers-reduced-motion.
 * @ew-exempt .script words — presentational .w spans (the <p> keeps its identity)
 * Schema: stardust/eds-schema/redesign.json#cine-hero
 */
export default function decorate(block) {
  // pipeline strips author classes + unwraps cells → classify by role, not class
  const media = [...block.querySelectorAll('img')].map((img) => img.closest('picture') || img);
  const heading = block.querySelector('h1, h2');
  const ps = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const before = (p) => heading
    && (p.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING);
  const links = ps.filter((p) => p.querySelector('a'));
  // a link paragraph BEFORE the headline is a breadcrumb (e.g. "← Prestations et tarifs")
  const crumb = links.find(before) || null;
  const ctas = links.filter((p) => p !== crumb);
  const texts = ps.filter((p) => !p.querySelector('a') && p.textContent.trim());
  const script = heading ? texts.find(before) : texts[0];
  const after = texts.filter((p) => p !== script && !before(p));
  const lead = after[0];
  const price = after[1] || null; // optional price tag ("Pack … <strong>à partir de 350 €</strong>")
  if (crumb) {
    crumb.classList.add('crumb');
    crumb.querySelectorAll('a').forEach((a) => a.classList.remove('button', 'primary', 'secondary'));
    crumb.classList.remove('button-container');
  }
  if (script) script.classList.add('script'); // re-apply (class was stripped)
  const wipe = media.length >= 2;

  const bg = document.createElement('div');
  bg.className = 'cine-hero__bg';
  if (wipe) {
    block.classList.add('wipe');
    ['before', 'after'].forEach((k, i) => {
      const layer = document.createElement('div');
      layer.className = `cine-hero__layer cine-hero__layer--${k}`;
      layer.append(media[i]);
      bg.append(layer);
    });
  } else if (media[0]) {
    bg.append(media[0]);
  }
  bg.querySelectorAll('img').forEach((img, i) => {
    img.loading = 'eager';
    if (i === 0) img.setAttribute('fetchpriority', 'high');
  });

  const inner = document.createElement('div');
  inner.className = 'cine-hero__inner';
  const panel = document.createElement('div');
  panel.className = 'cine-hero__panel';
  if (crumb) { crumb.dataset.enter = '2'; panel.append(crumb); }
  if (script) panel.append(script);           // enters via its word-by-word reveal
  if (heading) { heading.dataset.enter = '2'; panel.append(heading); }
  if (lead) { lead.classList.add('lead'); lead.dataset.enter = '3'; panel.append(lead); }
  if (price) { price.classList.add('price'); price.dataset.enter = '3'; panel.append(price); }
  if (wipe) {
    // avant / après state pill — labels are CSS generated content (no DOM words)
    const state = document.createElement('div');
    state.className = 'cine-hero__state';
    state.dataset.enter = '3';
    state.setAttribute('aria-hidden', 'true');
    state.append(document.createElement('i'), document.createElement('i'));
    panel.append(state);
  }
  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'cine-hero__cta';
    actions.dataset.enter = '3';
    actions.append(...ctas);
    panel.append(actions);
  }
  inner.append(panel);

  const cue = document.createElement('div');
  cue.className = 'cine-hero__cue';
  cue.setAttribute('aria-hidden', 'true');
  cue.textContent = '↓';

  if (block.classList.contains('split')) {
    const grid = document.createElement('div');
    grid.className = 'cine-hero__split';
    grid.append(inner, bg);
    block.replaceChildren(grid);
  } else if (wipe) {
    const stage = document.createElement('div');
    stage.className = 'cine-hero__stage';
    stage.append(bg, inner, cue);
    block.replaceChildren(stage);
  } else {
    block.replaceChildren(bg, inner, cue);
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  // ENTRANCE only (CSS-driven, gated behind .anim so no-JS renders visible):
  // the signature letterbox-open on the photo + a staggered panel entrance
  // ([data-enter]) fire on .is-in. All SCROLL motion (bg Ken Burns/parallax,
  // reading-progress, header condense, smooth-scroll) is owned centrally by
  // scripts/motion.js — this block no longer runs its own rAF loop.
  block.classList.add('anim');
  requestAnimationFrame(() => block.classList.add('is-in'));

  // hero script: word-by-word staggered reveal (matches prototype .hero__script,
  // 95ms per word). The <p> element itself is preserved — only its text run is
  // re-wrapped in .w spans — so it keeps its authored identity / prose-index;
  // the spans are presentational and collapse harmlessly in the editor.
  if (script) {
    const frag = document.createDocumentFragment();
    [...script.childNodes].forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((tok) => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.append(tok); return; }
          const s = document.createElement('span');
          s.className = 'w';
          s.textContent = tok;
          frag.append(s);
        });
      } else { frag.append(node); }
    });
    script.replaceChildren(frag);
    const words = [...script.querySelectorAll('.w')];
    block.classList.add('pre-reveal');                       // words hidden, no transition
    words.forEach((w, i) => { w.style.transitionDelay = `${i * 95}ms`; });
    requestAnimationFrame(() => requestAnimationFrame(() => block.classList.remove('pre-reveal')));
  }
}
