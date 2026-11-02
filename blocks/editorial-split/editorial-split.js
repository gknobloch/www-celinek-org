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

  // Motion is centralized in scripts/motion.js: tag the reveal targets (media +
  // copy of each band fade-rise on scroll) — the media <img> already carries
  // data-parallax for the continuous drift. No per-block scroll listener.
  bands.forEach((b) => {
    b.querySelector('.editorial__media')?.setAttribute('data-anim', '');
    b.querySelector('.editorial__copy')?.setAttribute('data-anim', '');
  });
}
