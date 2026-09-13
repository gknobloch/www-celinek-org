/**
 * contact-band — "Et si on commençait ?" conversion band (variant C).
 * Cell: script <p>, <h2>, body <p>, CTA <p><strong><a></strong>, phone <p><a tel></p>.
 * The pipeline strips classes → re-apply the script role; group the CTA + phone
 * into a centered row; un-buttonize the phone (a bare link becomes .button here).
 * Schema: stardust/eds-schema/redesign.json#contact-band
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block.firstElementChild;
  const inner = document.createElement('div');
  inner.className = 'contact-band__inner';
  if (cell) inner.append(...cell.childNodes);

  // re-apply the stripped script class to the first text paragraph
  const script = [...inner.querySelectorAll('p')].find((p) => !p.querySelector('a') && p.textContent.trim());
  if (script) script.classList.add('script');

  // group the link-bearing paragraphs into one centered row
  const linkPs = [...inner.querySelectorAll('p')].filter((p) => p.querySelector('a'));
  if (linkPs.length) {
    const row = document.createElement('div');
    row.className = 'contact-band__row';
    row.append(...linkPs);
    inner.append(row);
  }
  // the phone (bare link) gets buttonized by decorateButtons — undo it, keep it a plain link
  inner.querySelectorAll('a[href^="tel:"]').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary');
    a.closest('.button-container')?.classList.remove('button-container');
  });

  block.replaceChildren(inner);
}
