/**
 * benefit-icons — "Les bienfaits" icon grid (variant C service pages).
 * Authoring: one row per benefit = [ icon image | label ].
 * The label paragraph is MOVED (EW1); icons are decorative (alt="").
 * Schema: stardust/eds-schema/prestations.json#benefit-icons
 */
export default function decorate(block) {
  const items = [...block.children].map((row) => {
    const item = document.createElement('div');
    item.className = 'benefit';
    item.dataset.anim = '';
    const img = row.querySelector('img');
    if (img) {
      img.alt = '';
      const icon = document.createElement('div');
      icon.className = 'benefit__icon';
      icon.append(img.closest('picture') || img);
      item.append(icon);
    }
    const label = [...row.querySelectorAll('p, h3, h4')].find((el) => el.textContent.trim());
    if (label) {
      label.classList.add('benefit__label');
      item.append(label);
    } else {
      // harness-only fallback: a bare-text cell (DA always delivers a <p>)
      const cell = [...row.children].find((c) => !c.querySelector('img') && c.textContent.trim());
      if (cell) { const p = document.createElement('p'); p.className = 'benefit__label'; p.append(...cell.childNodes); item.append(p); }
    }
    return item;
  });
  block.replaceChildren(...items);
}
