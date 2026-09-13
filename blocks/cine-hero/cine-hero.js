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
  const media = block.querySelector('picture, img');
  const script = block.querySelector('p.script') || block.querySelector('p');
  const heading = block.querySelector('h1, h2');
  const ctas = [...block.querySelectorAll('a')].map((a) => a.closest('p') || a);

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

  // scroll parallax + slow scale on the bg (desktop only)
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = block.getBoundingClientRect();
      const vh = window.innerHeight;
      if (window.innerWidth > 767 && rect.bottom > 0 && rect.top < vh) {
        const p = Math.min(Math.max(-rect.top / vh, 0), 1);
        bg.style.transform = `translateY(${p * 14}vh) scale(${1 + p * 0.1})`;
      } else {
        bg.style.transform = '';
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
