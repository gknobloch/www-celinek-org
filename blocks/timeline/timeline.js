/**
 * timeline — "Mon histoire" chronology (variant C, qui-suis-je).
 *
 * Authoring: one row per moment = [ year | story ].
 *   year: a short <p> ("2010", "2020 – 2021", "Aujourd'hui")
 *   story: <p>s, optionally a <blockquote> (rendered as the scripted pull-quote)
 * A vertical rail fills sage→gold as the reader scrolls through (state, so it also
 * runs under reduced motion — it simply jumps). Items fade-rise via scripts/motion.js.
 * Authored nodes are MOVED (EW1).
 * Schema: stardust/eds-schema/about.json#timeline
 */
export default function decorate(block) {
  const items = [...block.children].map((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'timeline__item';
    item.dataset.anim = '';
    const year = document.createElement('div');
    year.className = 'timeline__year';
    const body = document.createElement('div');
    body.className = 'timeline__body';
    if (cells[0]) year.append(...cells[0].childNodes);
    cells.slice(1).forEach((c) => body.append(...c.childNodes));
    item.append(year, body);
    return item;
  });
  block.replaceChildren(...items);

  const fill = () => {
    const r = block.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (window.innerHeight * 0.6 - r.top) / Math.max(1, r.height)));
    block.style.setProperty('--tl-p', p.toFixed(3));
    items.forEach((it) => it.classList.toggle('reached', it.getBoundingClientRect().top < window.innerHeight * 0.6));
  };
  window.addEventListener('scroll', fill, { passive: true });
  window.addEventListener('resize', fill, { passive: true });
  fill();
}
