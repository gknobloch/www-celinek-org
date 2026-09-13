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
  // section anchor for in-page hero CTAs (section-metadata → data-anchor, preserved)
  const section = block.closest('.section');
  if (section && section.dataset.anchor) section.id = section.dataset.anchor;

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
    // re-apply stripped classes: p's before the heading are eyebrow then script
    const h = copy.querySelector('h2, h3');
    const before = [...copy.querySelectorAll('p')].filter((el) => h && (h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING));
    if (before[0]) before[0].classList.add('eyebrow');
    if (before[1]) before[1].classList.add('script');

    band.append(media, copy);
    bands.push(band);
  });
  block.replaceChildren(...bands);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  // fade-rise reveal — scroll-driven so it fires reliably on any real scroll
  bands.forEach((b) => b.classList.add('reveal'));
  const reveal = () => {
    const vh = window.innerHeight;
    bands.forEach((b) => { if (b.getBoundingClientRect().top < vh * 0.88) b.classList.add('in'); });
  };
  window.addEventListener('scroll', reveal, { passive: true });
  window.addEventListener('resize', reveal, { passive: true });
  reveal();

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
