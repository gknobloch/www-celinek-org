/**
 * value-grid — the "why" value cards (variant C). One row per card = [ <h3>, <p> ].
 * The LAST card spans the full row (closing statement) — except in the `plain`
 * variant (e.g. the 3-up "Bon à savoir" band). Fade-rise reveal.
 * Schema: stardust/eds-schema/redesign.json#value-grid
 */
export default function decorate(block) {
  const rows = [...block.children];
  const plain = block.classList.contains('plain');
  const cards = rows.map((row, i) => {
    const cell = row.firstElementChild || row;
    const card = document.createElement('div');
    card.className = `value${!plain && i === rows.length - 1 ? ' value--wide' : ''}`;
    card.append(...cell.childNodes);
    return card;
  });
  block.replaceChildren(...cards);

  // Motion is centralized in scripts/motion.js: tag each card as a reveal target;
  // it applies the eased, per-section-staggered fade-rise on scroll.
  cards.forEach((c) => c.setAttribute('data-anim', ''));
}
