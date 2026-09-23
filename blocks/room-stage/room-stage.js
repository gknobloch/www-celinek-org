/**
 * room-stage — one room chapter of /realisations/ (variant C, editorial register).
 *
 * Authoring:
 *   section head (DEFAULT CONTENT before the block): optional script <p>
 *     ("avant, après"), <h2> room name, <p> count ("5 transformations") —
 *     reabsorbed into the pinned copy column (children MOVED, wrapper removed);
 *   block rows: one row per transformation — cell 1 = avant image, cell 2 = après image
 *   (an in-block copy row is still accepted as a decode fallback).
 * Section-metadata `anchor` → section id (room-rail target).
 *
 * Render: the FIRST pair is the stage — pinned while scripts/motion.js drives
 * `--p` 0→1 (feathered avant → après wipe). Every other pair becomes a
 * labeled, keyboard-operable comparison slider. No-JS / reduced motion: the
 * stage shows avant | après side by side, nothing pins.
 * Authored nodes are MOVED (EW1); "Avant"/"Après" labels and the chapter number
 * are CSS generated content (no DOM words).
 * Schema: stardust/eds-schema/realisations.json#room-stage
 */
function ratio(img) {
  const w = Number(img.getAttribute('width')) || img.naturalWidth;
  const h = Number(img.getAttribute('height')) || img.naturalHeight;
  return w && h ? w / h : 0.75;
}

// keep --ar (and the `wide` flag) true to the photo once it has loaded — the
// pipeline emits width/height, raw <img> (harness, pasted URLs) does not
function trackRatio(img, el, flagEl) {
  const apply = () => {
    const r = ratio(img);
    el.style.setProperty('--ar', r.toFixed(4));
    if (flagEl) flagEl.classList.toggle('wide', r > 1.1);
  };
  apply();
  if (!img.getAttribute('width') && !img.complete) img.addEventListener('load', apply, { once: true });
}

function frame(pic, className) {
  const f = document.createElement('div');
  f.className = className;
  f.append(pic);
  return f;
}

function slider(before, after, label) {
  const fig = document.createElement('figure');
  fig.className = 'room-stage__ba';
  fig.dataset.anim = '';
  const box = document.createElement('div');
  box.className = 'room-stage__frame';
  trackRatio(after.querySelector('img') || after, box, fig);
  const line = document.createElement('span');
  line.className = 'room-stage__line';
  line.setAttribute('aria-hidden', 'true');
  const range = document.createElement('input');
  range.type = 'range';
  range.min = '0';
  range.max = '100';
  range.value = '50';
  range.className = 'room-stage__range';
  range.setAttribute('aria-label', `Comparer avant / après — ${label}`);
  range.addEventListener('input', () => box.style.setProperty('--pos', `${range.value}%`));
  box.append(frame(after, 'room-stage__after'), frame(before, 'room-stage__before'), line, range);
  fig.append(box);
  return fig;
}

export default function decorate(block) {
  const section = block.closest('.section');
  if (section && section.dataset.anchor) section.id = section.dataset.anchor;

  // reabsorb the section head (default content just before the block wrapper)
  const headWrap = block.parentElement?.previousElementSibling;
  const head = headWrap?.classList.contains('default-content-wrapper') ? headWrap : null;
  const scope = [head, block].filter(Boolean);
  const all = (sel) => scope.flatMap((el) => [...el.querySelectorAll(sel)]);

  const pics = [...block.querySelectorAll('img')].map((img) => img.closest('picture') || img);
  const heading = all('h1, h2, h3')[0] || null;
  const texts = all('p')
    .filter((p) => !p.querySelector('picture, img') && p.textContent.trim());
  const precedes = (p) => heading
    && (p.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING);
  const script = heading ? texts.find(precedes) : null;
  const rest = texts.filter((p) => p !== script);

  const pairs = [];
  for (let i = 0; i + 1 < pics.length; i += 2) pairs.push([pics[i], pics[i + 1]]);

  // copy column
  const copy = document.createElement('div');
  copy.className = 'room-stage__copy';
  const num = document.createElement('span');
  num.className = 'room-stage__num';
  num.setAttribute('aria-hidden', 'true');
  copy.append(num);
  if (script) { script.classList.add('script'); copy.append(script); }
  if (heading) copy.append(heading);
  rest.forEach((p) => { p.classList.add('count'); copy.append(p); });
  const state = document.createElement('div');
  state.className = 'room-stage__state';
  state.setAttribute('aria-hidden', 'true');
  state.append(document.createElement('i'), document.createElement('i'));
  copy.append(state);

  // stage: lead pair
  const sticky = document.createElement('div');
  sticky.className = 'room-stage__sticky';
  sticky.append(copy);
  if (pairs[0]) {
    const [b, a] = pairs[0];
    const pair = document.createElement('div');
    pair.className = 'room-stage__pair';
    trackRatio(a.querySelector('img') || a, pair);
    pair.append(frame(b, 'room-stage__side is-before'), frame(a, 'room-stage__side is-after'));
    sticky.append(pair);
  }
  const stage = document.createElement('div');
  stage.className = 'room-stage__stage';
  stage.append(sticky);

  const out = [stage];
  if (pairs.length > 1) {
    const label = heading ? heading.textContent : '';
    const more = document.createElement('div');
    more.className = 'room-stage__more';
    pairs.slice(1).forEach(([b, a]) => more.append(slider(b, a, label)));
    out.push(more);
  }
  block.replaceChildren(...out);
  if (head && !head.children.length) head.remove();

  // chapter number: CSS counter + total (generated content, no DOM words)
  num.dataset.total = String(document.querySelectorAll('.room-stage').length).padStart(2, '0');

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) block.classList.add('anim');
}
