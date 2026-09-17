/**
 * motion.js — the centralized "arrival" motion register for the redesign.
 *
 * ONE smooth-scroll + ONE rAF loop choreographs the whole page, so every section
 * shares one easing and one stagger language (the reason a per-block port feels
 * ad-hoc and a centralized one feels cohesive):
 *   - hero background: idle Ken Burns + scroll-drift + slow scale + on-load settle
 *   - hero foreground: drift + fade on scroll
 *   - reading-progress bar + header `scrolled` state
 *   - continuous image parallax on any [data-parallax]
 *   - scroll-progress reveals on any [data-anim] (stagger scoped per section)
 *   - self-contained smooth wheel (mini-Lenis), desktop + fine-pointer only
 *
 * Parity: hidden states are ONLY ever set inline by this script, so with no JS the
 * page is fully visible; under prefers-reduced-motion every animated element is
 * forced to its final state and nothing else runs. Blocks own their ENTRANCE
 * (CSS keyframes); this file owns everything SCROLL.
 */
export default function initMotion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anims = () => document.querySelectorAll('[data-anim]');
  if (reduced) {
    anims().forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  const clamp = (v, lo, hi) => (v < lo ? lo : (v > hi ? hi : v));
  const easeOut3 = (t) => 1 - (1 - t) ** 3;
  const docTop = (el) => el.getBoundingClientRect().top + window.scrollY;

  // reading-progress bar (only meaningful when the cinematic hero is on the page)
  let progress = null;
  if (document.querySelector('.cine-hero')) {
    progress = document.createElement('div');
    progress.className = 'cine-hero__progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);
  }
  const header = document.querySelector('header');
  const heroBg = document.querySelector('.cine-hero__bg');
  const heroInner = document.querySelector('.cine-hero__inner');

  const cfg = { cards: { trigger: 0.85, range: 0.34, slide: 32, stagger: 0.1 }, media: { drift: 0.12 } };

  // scroll-progress reveals — measured lazily so lazy-loaded blocks are picked up
  const list = [];
  let paras = [];
  function measure() {
    list.forEach(({ el }) => { el.style.opacity = ''; el.style.transform = ''; el.style.willChange = ''; });
    list.length = 0;
    const vh = window.innerHeight;
    const sy = window.scrollY;
    anims().forEach((el) => {
      const parent = el.closest('.section, .band, ul');
      let stagger = 0;
      if (parent) {
        const peers = parent.querySelectorAll('[data-anim]');
        stagger = (Array.prototype.indexOf.call(peers, el) % 8) * cfg.cards.stagger;
      }
      const top = docTop(el);
      // elements already inside the first viewport at boot are never hidden (no flash)
      if (top < vh * 0.85 && sy < 10) return;
      el.style.opacity = '0';
      el.style.transform = `translateY(${cfg.cards.slide}px)`;
      el.style.willChange = 'opacity, transform';
      list.push({ el, triggerTop: top, staggerDelay: stagger });
    });
    paras = [...document.querySelectorAll('[data-parallax]')].map((img) => ({ img, frame: img.parentElement }));
  }

  const t0 = performance.now();
  (function tick(now) {
    const sy = window.scrollY;
    const vh = window.innerHeight;
    const desktop = window.innerWidth > 767;
    const max = document.documentElement.scrollHeight - vh;

    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(sy / max, 1) : 0})`;
    if (header) header.classList.toggle('scrolled', sy > 40);

    // hero background: idle Ken Burns + scroll-drift + slow scale + on-load settle
    if (heroBg) {
      if (desktop) {
        const p = clamp(sy / vh, 0, 1);
        const kb = ((Math.sin(now / 9000) + 1) / 2) * 0.03;
        const intro = ((1 - Math.min((now - t0) / 1400, 1)) ** 3) * 0.1;
        heroBg.style.transform = `translateY(${-p * 12}vh) scale(${1 + p * 0.08 + kb + intro})`;
        if (heroInner) {
          if (sy > 2) {
            heroInner.style.transform = `translateY(${-p * 8}vh)`;
            heroInner.style.opacity = String(1 - clamp((sy - vh * 0.1) / (vh * 0.55), 0, 1));
          } else { heroInner.style.transform = ''; heroInner.style.opacity = ''; }
        }
      } else {
        heroBg.style.transform = '';
        if (heroInner) { heroInner.style.transform = ''; heroInner.style.opacity = ''; }
      }
    }

    // continuous image parallax (editorial photos "breathe")
    if (desktop) {
      for (let i = 0; i < paras.length; i += 1) {
        const { img, frame } = paras[i];
        const rect = frame.getBoundingClientRect();
        if (rect.bottom < -60 || rect.top > vh + 60) { img.style.transform = ''; continue; }
        const p = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
        img.style.transform = `translateY(${(0.5 - p) * 2 * rect.height * cfg.media.drift}px)`;
      }
    } else {
      for (let i = 0; i < paras.length; i += 1) paras[i].img.style.transform = '';
    }

    // scroll-progress reveals (fade + rise, eased, staggered per section)
    for (let i = 0; i < list.length; i += 1) {
      const item = list[i];
      const { trigger, range, slide } = cfg.cards;
      const raw = (sy + vh * trigger - item.triggerTop) / (vh * range);
      const p = easeOut3(clamp(raw - item.staggerDelay, 0, 1));
      item.el.style.opacity = String(p);
      item.el.style.transform = `translateY(${(1 - p) * slide}px)`;
    }

    requestAnimationFrame(tick);
  }(performance.now()));

  measure();
  window.addEventListener('load', () => requestAnimationFrame(measure), { once: true });
  window.addEventListener('resize', measure, { passive: true });
  // re-measure once lazy sections decorate (they gain data-section-status)
  const mo = new MutationObserver(() => { clearTimeout(mo.t); mo.t = setTimeout(measure, 120); });
  const main = document.querySelector('main');
  if (main) mo.observe(main, { attributes: true, attributeFilter: ['data-section-status'], subtree: true });

  // ── self-contained smooth wheel (mini-Lenis) — desktop + fine pointer only ──
  if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 767) {
    const clampY = (v) => Math.max(0, Math.min(v, document.documentElement.scrollHeight - window.innerHeight));
    let target = window.scrollY;
    let current = target;
    let running = false;
    const frame = () => {
      current += (target - current) * 0.11;
      if (Math.abs(target - current) < 0.4) { current = target; running = false; }
      window.scrollTo(0, Math.round(current));
      if (running) requestAnimationFrame(frame);
    };
    const start = () => { if (!running) { running = true; requestAnimationFrame(frame); } };
    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey) return;
      e.preventDefault();
      target = clampY(target + e.deltaY);
      start();
    }, { passive: false });
    window.addEventListener('scroll', () => { if (!running) { target = window.scrollY; current = window.scrollY; } }, { passive: true });
    window.addEventListener('resize', () => { target = clampY(target); }, { passive: true });
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
