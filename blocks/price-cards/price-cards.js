/**
 * price-cards — Tarifs cards (variant C service pages).
 *
 * Authoring: one row per offer; the cell holds
 *   <h3> offer name, optional <p>/<ul> details, <p> "à partir de" (optional),
 *   <p><strong>350 €</strong></p> amount, <p><a href="/contact">Demander un devis</a></p>.
 * With several offers the LAST one is featured (gold border + gold CTA).
 * The paragraph whose only content is a <strong> is the amount. Nodes are MOVED (EW1).
 * Schema: stardust/eds-schema/prestations.json#price-cards
 */
export default function decorate(block) {
  const section = block.closest('.section');
  if (section && section.dataset.anchor) section.id = section.dataset.anchor;

  const rows = [...block.children];
  const cards = rows.map((row, i) => {
    const cell = row.firstElementChild || row;
    const card = document.createElement('div');
    card.className = `price${rows.length > 1 && i === rows.length - 1 ? ' price--featured' : ''}`;
    card.dataset.anim = '';
    card.append(...cell.childNodes);
    card.querySelectorAll('p').forEach((p) => {
      const only = p.children.length === 1 && p.firstElementChild.tagName === 'STRONG'
        && p.textContent.trim() === p.firstElementChild.textContent.trim();
      if (only) p.classList.add('price__amount');
    });
    return card;
  });
  block.dataset.count = String(rows.length);
  block.replaceChildren(...cards);
}
