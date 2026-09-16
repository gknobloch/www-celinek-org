/**
 * cine-hero — full-bleed cinematic editorial hero (variant C).
 *
 * Authoring rows (positional):
 *   1. background image (<picture>/<img>) — LCP, eager-loaded
 *   2. script eyebrow tagline (p.script)
 *   3. headline — the page <h1>
 *   4. CTAs — bare <a> (light) + <em><a> (ghost); anchor to in-page sections
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
  const media = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2');
  const ps = [...block.querySelectorAll('p')];
  const ctas = ps.filter((p) => p.querySelector('a'));
  const script = ps.find((p) => !p.querySelector('a') && p.textContent.trim());
  if (script) script.classList.add('script'); // re-apply (class was stripped)

  const bg = document.createElement('div');
  bg.className = 'cine-hero__bg';
  if (media) {
    const pic = media.closest('picture') || media;
    bg.append(pic);
    const img = bg.querySelector('img');
    if (img) { img.loading = 'eager'; img.setAttribute('fetchpriority', 'high'); }
  }

  const inner = document.createElement('div');
  inner.className = 'cine-hero__inner';
  const panel = document.createElement('div');
  panel.className = 'cine-hero__panel';
  if (script) panel.append(script);
  if (heading) panel.append(heading);
  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'cine-hero__cta';
    actions.append(...ctas);
    panel.append(actions);
  }
  inner.append(panel);

  const cue = document.createElement('div');
  cue.className = 'cine-hero__cue';
  cue.setAttribute('aria-hidden', 'true');
  cue.textContent = '↓';

  block.replaceChildren(bg, inner, cue);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  // on-load settle + reveal (gated behind .anim so no-JS renders visible)
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

  // reading-progress bar (fixed, spans the whole page)
  const progress = document.createElement('div');
  progress.className = 'cine-hero__progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);

  const header = document.querySelector('header');

  // Continuous rAF (always on, like the prototype): bg gets scroll-drift + slow
  // scale + idle Ken Burns breathe + on-load settle — the breathe animates AT
  // REST, which a scroll-only handler can't do. Hero copy drift + fade only
  // takes over once scrolled (sy>2) so the CSS intro/word reveal plays at rest;
  // progress bar + header condense update every frame.
  const t0 = performance.now();
  const tick = (now) => {
    const sy = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(sy / max, 1) : 0})`;
    if (header) header.classList.toggle('scrolled', sy > 40);
    if (window.innerWidth > 767) {
      const p = Math.min(Math.max(sy / vh, 0), 1);
      const kb = ((Math.sin(now / 9000) + 1) / 2) * 0.03;    // idle Ken Burns (scale only)
      const intro = ((1 - Math.min((now - t0) / 1400, 1)) ** 3) * 0.1; // settle from +0.10
      bg.style.transform = `translateY(${-p * 12}vh) scale(${1 + p * 0.08 + kb + intro})`;
      if (sy > 2) {
        inner.style.transform = `translateY(${-p * 8}vh)`;
        inner.style.opacity = String(1 - Math.min(Math.max((sy - vh * 0.1) / (vh * 0.55), 0), 1));
      } else {
        inner.style.transform = '';   // at rest: let the CSS intro + word reveal play
        inner.style.opacity = '';
      }
    } else {
      bg.style.transform = '';
      inner.style.transform = '';
      inner.style.opacity = '';
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // ── self-contained smooth-scroll (mini-Lenis) ───────────────────────────
  // desktop + fine pointer only; native scroll everywhere else. All the
  // scroll-driven effects above stay in sync because it drives window.scrollTo.
  if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 767) {
    const clampY = (v) => Math.max(0, Math.min(v, document.documentElement.scrollHeight - window.innerHeight));
    let target = window.scrollY;
    let current = target;
    let running = false;
    const lerp = 0.11;
    const frame = () => {
      current += (target - current) * lerp;
      if (Math.abs(target - current) < 0.4) { current = target; running = false; }
      window.scrollTo(0, Math.round(current));
      if (running) requestAnimationFrame(frame);
    };
    const start = () => { if (!running) { running = true; requestAnimationFrame(frame); } };
    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey) return; // let pinch-zoom through
      e.preventDefault();
      target = clampY(target + e.deltaY);
      start();
    }, { passive: false });
    // resync when scroll comes from elsewhere (keyboard, scrollbar, anchor)
    window.addEventListener('scroll', () => { if (!running) { target = window.scrollY; current = window.scrollY; } }, { passive: true });
    window.addEventListener('resize', () => { target = clampY(target); }, { passive: true });
    // smooth in-page anchor jumps (hero CTAs → #concept / #process)
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const el = document.getElementById(a.getAttribute('href').slice(1));
        if (!el) return;
        e.preventDefault();
        target = clampY(el.getBoundingClientRect().top + window.scrollY);
        start();
      });
    });
  }
}
