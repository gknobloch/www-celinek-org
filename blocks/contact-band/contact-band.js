/**
 * contact-band — "Et si on commençait ?" conversion band (variant C).
 * One cell: script <p>, <h2>, body <p>, CTA row (primary <strong><a> + tel link).
 * Warm gold gradient ground; deep-sage primary CTA (styled in CSS).
 * Schema: stardust/eds-schema/redesign.json#contact-band
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block.firstElementChild;
  const inner = document.createElement('div');
  inner.className = 'contact-band__inner';
  if (cell) inner.append(...cell.childNodes);
  // group the CTA row (last paragraph carrying links)
  const ctaP = [...inner.querySelectorAll('p')].reverse().find((p) => p.querySelector('a'));
  if (ctaP) ctaP.classList.add('contact-band__row');
  block.replaceChildren(inner);
}
