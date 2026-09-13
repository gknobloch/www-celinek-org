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
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('in'), (Array.prototype.indexOf.call(cards, e.target) % 4) * 90);
      obs.unobserve(e.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  cards.forEach((c) => io.observe(c));
  setTimeout(() => cards.forEach((c) => c.classList.add('in')), 1800);
}
