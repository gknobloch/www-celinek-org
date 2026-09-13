/**
 * cine-hero — full-bleed cinematic editorial hero (variant C).
 *
 * Authoring rows (positional):
 *   1. background image (<picture>/<img>) — LCP, eager-loaded
 *   2. script eyebrow tagline (p.script)
 *   3. headline — the page <h1>
 *   4. CTAs — bare <a> (light) + <em><a> (ghost); anchor to in-page sections
 *
 * Motion (block-owned, no shared runtime): scroll parallax + scale on the bg,
 * on-load settle + copy reveal. Neutralized under prefers-reduced-motion.
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

  // reading-progress bar (fixed, spans the whole page)
  const progress = document.createElement('div');
  progress.className = 'cine-hero__progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);

  // scroll effects: bg parallax + slow scale, hero copy drift + fade, progress bar
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(sy / max, 1) : 0})`;
      if (window.innerWidth > 767 && sy > 2) {
        const p = Math.min(Math.max(sy / vh, 0), 1);
        bg.style.transform = `translateY(${-p * 12}vh) scale(${1 + p * 0.08})`;
        inner.style.transform = `translateY(${-p * 8}vh)`;
        inner.style.opacity = String(1 - Math.min(Math.max((sy - vh * 0.1) / (vh * 0.55), 0), 1));
      } else {
        // at rest / mobile: let CSS handle the intro + entrance
        bg.style.transform = '';
        inner.style.transform = '';
        inner.style.opacity = '';
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}
