/**
 * editorial-split — alternating photo/text editorial bands (variant C intro/concept).
 *
 * Authoring: one ROW per band; each row = [ image cell | copy cell ].
 * Copy cell: p.eyebrow, p.script, <h2>, body <p>s, CTA (<em><a>).
 * Even bands render media-left; odd bands reverse (media-right).
 * Motion: gentle image parallax drift + fade-rise reveal (block-owned).
 * Schema: stardust/eds-schema/redesign.json#editorial-split
 */
export default function decorate(block) {
  // section anchor for in-page hero CTAs
  if (block.dataset.anchor) {
    const section = block.closest('.section');
    if (section) section.id = block.dataset.anchor;
  }

  const rows = [...block.children];
  const bands = [];
  rows.forEach((row, i) => {
    const cells = [...row.children];
    const mediaCell = cells.find((c) => c.querySelector('picture, img')) || cells[0];
    const copyCell = cells.find((c) => c !== mediaCell) || cells[1];

    const band = document.createElement('div');
    band.className = `editorial${i % 2 === 1 ? ' editorial--reverse' : ''}`;

    const media = document.createElement('div');
    media.className = 'editorial__media';
    const pic = mediaCell && (mediaCell.querySelector('picture, img'));
    if (pic) { media.append(pic.closest('picture') || pic); media.querySelector('img')?.setAttribute('data-parallax', ''); }

    const copy = document.createElement('div');
    copy.className = 'editorial__copy';
    if (copyCell) copy.append(...copyCell.childNodes);

    band.append(media, copy);
    bands.push(band);
  });
  block.replaceChildren(...bands);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  // fade-rise reveal
  bands.forEach((b) => b.classList.add('reveal'));
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  bands.forEach((b) => io.observe(b));
  // safety net: never leave content hidden if the observer misses
  setTimeout(() => bands.forEach((b) => b.classList.add('in')), 1800);

  // continuous image parallax drift
  const imgs = [...block.querySelectorAll('[data-parallax]')];
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const vh = window.innerHeight;
      const desktop = window.innerWidth > 767;
      imgs.forEach((img) => {
        const frame = img.parentElement;
        const rect = frame.getBoundingClientRect();
        if (!desktop || rect.bottom < -60 || rect.top > vh + 60) { img.style.transform = ''; return; }
        const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
        img.style.transform = `translateY(${(0.5 - progress) * 2 * rect.height * 0.12}px)`;
      });
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
