/**
 * value-grid — the "why" value cards (variant C). One row per card = [ <h3>, <p> ].
 * The LAST card spans the full row (closing statement). Fade-rise reveal.
 * Schema: stardust/eds-schema/redesign.json#value-grid
 */
export default function decorate(block) {
  const rows = [...block.children];
  const cards = rows.map((row, i) => {
    const cell = row.firstElementChild || row;
    const card = document.createElement('div');
    card.className = `value${i === rows.length - 1 ? ' value--wide' : ''}`;
    card.append(...cell.childNodes);
    return card;
  });
  block.replaceChildren(...cards);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  cards.forEach((c) => c.classList.add('reveal'));
  const reveal = () => {
    const vh = window.innerHeight;
    cards.forEach((c, i) => { if (c.getBoundingClientRect().top < vh * 0.88) setTimeout(() => c.classList.add('in'), (i % 3) * 90); });
  };
  window.addEventListener('scroll', reveal, { passive: true });
  window.addEventListener('resize', reveal, { passive: true });
  reveal();
}
