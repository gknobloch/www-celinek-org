/**
 * testimonials — single-card testimonial carousel (variant C).
 * One row per review = [ quote <p>, author <p><strong> ]. Renders one card at a
 * time with prev/next arrows, dots, and pointer-swipe. A generated 5-star row
 * leads each card (decorative — not authored, so not editable; @ew-exempt).
 * @ew-exempt .stars — generated decorative star row (not authored content)
 * Schema: stardust/eds-schema/redesign.json#testimonials
 */
export default function decorate(block) {
  if (block.dataset.anchor) {
    const section = block.closest('.section');
    if (section) section.id = block.dataset.anchor;
  }

  const slides = [...block.children].map((row) => {
    const cell = row.firstElementChild || row;
    const fig = document.createElement('figure');
    fig.className = 'testi';
    const stars = document.createElement('div');
    stars.className = 'stars';
    stars.setAttribute('aria-label', '5 étoiles sur 5');
    stars.textContent = '★★★★★';
    fig.append(stars, ...cell.childNodes);
    // the authored author paragraph → figcaption-styled via .who
    const ps = fig.querySelectorAll('p');
    if (ps.length) ps[ps.length - 1].classList.add('who');
    return fig;
  });

  const viewport = document.createElement('div');
  viewport.className = 'carousel__viewport';
  const track = document.createElement('div');
  track.className = 'carousel__track';
  track.append(...slides);
  viewport.append(track);

  const mkNav = (dir, label) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `carousel__nav carousel__${dir}`;
    b.setAttribute('aria-label', label);
    b.textContent = dir === 'prev' ? '‹' : '›';
    return b;
  };
  const prev = mkNav('prev', 'Témoignage précédent');
  const next = mkNav('next', 'Témoignage suivant');

  const dots = document.createElement('div');
  dots.className = 'carousel__dots';
  dots.setAttribute('aria-label', 'Choisir un témoignage');
  const dotEls = slides.map((_, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'dot';
    d.setAttribute('aria-label', `Témoignage ${i + 1}`);
    return d;
  });
  dots.append(...dotEls);

  block.replaceChildren(viewport, prev, next, dots);

  let idx = 0;
  const n = slides.length;
  const go = (k) => {
    idx = (k + n) % n;
    track.style.transform = `translateX(${-idx * 100}%)`;
    dotEls.forEach((d, j) => d.classList.toggle('active', j === idx));
    slides.forEach((s, j) => s.setAttribute('aria-hidden', j === idx ? 'false' : 'true'));
  };
  prev.addEventListener('click', () => go(idx - 1));
  next.addEventListener('click', () => go(idx + 1));
  dotEls.forEach((d, j) => d.addEventListener('click', () => go(j)));

  let x0 = null;
  block.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  block.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 40) go(dx < 0 ? idx + 1 : idx - 1);
    x0 = null;
  });
  go(0);
}
