/**
 * service-cards — prestations comparison cards (variant C).
 *
 * Authoring: one row per service = [ image | copy ].
 *   copy: <p> "for whom" tag, <h3> title, <p> blurb, <p><strong>price</strong> note</p>,
 *         <p><a href="/prestations-tarifs/…">Plus d'informations</a></p>
 * The whole card is the link (the authored anchor is unwrapped into the card — EW6).
 * Variant `compact` (cross-links on service pages): image | <h3> + price + link.
 * Schema: stardust/eds-schema/prestations.json#service-cards
 */
export default function decorate(block) {
  const section = block.closest('.section');
  if (section && section.dataset.anchor) section.id = section.dataset.anchor;
  const compact = block.classList.contains('compact');

  const cards = [...block.children].map((row) => {
    const img = row.querySelector('img');
    const pic = img ? (img.closest('picture') || img) : null;
    const heading = row.querySelector('h2, h3, h4');
    const ps = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
    const linkP = ps.find((p) => p.querySelector('a'));
    const link = linkP?.querySelector('a');
    const texts = ps.filter((p) => p !== linkP && p.textContent.trim());
    const precedes = (p) => heading
      && (p.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING);
    const tag = texts.find(precedes) || null;
    const priceP = texts.find((p) => !precedes(p) && p.querySelector('strong')) || null;
    const blurb = texts.find((p) => p !== tag && p !== priceP && !precedes(p)) || null;

    const card = document.createElement('a');
    card.className = 'svc';
    card.href = link ? link.href : '#';
    card.dataset.anim = '';

    const media = document.createElement('div');
    media.className = 'svc__media';
    if (pic) media.append(pic);
    if (tag && !compact) { tag.classList.add('svc__for'); media.append(tag); }

    const body = document.createElement('div');
    body.className = 'svc__body';
    if (heading) body.append(heading);
    if (blurb && !compact) { blurb.classList.add('svc__blurb'); body.append(blurb); }
    const foot = document.createElement('div');
    foot.className = 'svc__foot';
    if (priceP) { priceP.classList.add('svc__price'); foot.append(priceP); }
    if (linkP) {
      // keep the authored paragraph (editor index) as the "more" label; drop the inner
      // anchor so the card is the single link
      linkP.classList.add('svc__more');
      linkP.classList.remove('button-container');
      link.replaceWith(...link.childNodes);
      foot.append(linkP);
    }
    body.append(foot);
    card.append(media, body);
    return card;
  });
  block.replaceChildren(...cards);
}
