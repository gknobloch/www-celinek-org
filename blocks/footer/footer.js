import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // icon-only links (social icons) get an accessible name from their icon
  footer.querySelectorAll('a').forEach((a) => {
    const icon = a.querySelector('.icon');
    if (!icon || a.textContent.trim() || a.getAttribute('aria-label')) return;
    const name = [...icon.classList].find((c) => c.startsWith('icon-'))?.slice(5);
    if (name) a.setAttribute('aria-label', name.charAt(0).toUpperCase() + name.slice(1));
  });

  block.append(footer);
}
