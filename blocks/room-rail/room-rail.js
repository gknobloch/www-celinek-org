/**
 * room-rail — sticky chapter index for /realisations/ (variant C).
 *
 * Authoring: one cell holding a <ul> of in-page links (`#cellier`, `#cuisine`, …)
 * — each target is a room-stage section's `anchor` section-metadata.
 * The authored <ul> is MOVED into a <nav>; scroll-spy marks the chapter in view
 * (state, not motion — runs under reduced motion too).
 * Schema: stardust/eds-schema/realisations.json#room-rail
 */
export default function decorate(block) {
  const list = block.querySelector('ul, ol');
  const nav = document.createElement('nav');
  nav.className = 'room-rail__nav';
  nav.setAttribute('aria-label', 'Pièces');
  if (list) nav.append(list);
  block.replaceChildren(nav);

  const links = [...nav.querySelectorAll('a[href^="#"]')];
  if (!links.length) return;
  const ids = links.map((a) => a.getAttribute('href').slice(1));

  let active = -1;
  const spy = () => {
    const line = window.innerHeight * 0.45;
    let k = -1;
    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < line) k = i;
    });
    if (k === active) return;
    active = k;
    links.forEach((a, i) => {
      const on = i === k;
      a.classList.toggle('active', on);
      if (on) {
        a.setAttribute('aria-current', 'true');
        const left = a.offsetLeft - list.clientWidth / 2 + a.offsetWidth / 2;
        list.scrollTo({ left, behavior: 'smooth' });
      } else {
        a.removeAttribute('aria-current');
      }
    });
  };
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('resize', spy, { passive: true });
  spy();
}
