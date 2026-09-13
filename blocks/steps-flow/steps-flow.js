/**
 * steps-flow — the 3-step "Comment ça se passe ?" process (variant C).
 * One row per step = [ <h3>, <p>, <p> ]. A numbered badge is generated per step
 * (CSS counter). Steps reveal sequentially (1-2-3) when the grid enters view.
 * Schema: stardust/eds-schema/redesign.json#steps-flow
 */
export default function decorate(block) {
  if (block.dataset.anchor) {
    const section = block.closest('.section');
    if (section) section.id = block.dataset.anchor;
  }

  const steps = [...block.children].map((row) => {
    const cell = row.firstElementChild || row;
    const step = document.createElement('div');
    step.className = 'step';
    const num = document.createElement('div');
    num.className = 'step__num';
    num.setAttribute('aria-hidden', 'true');
    step.append(num, ...cell.childNodes);
    return step;
  });
  block.replaceChildren(...steps);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  steps.forEach((s) => s.classList.add('seq'));
  let fired = false;
  const run = () => { if (fired) return; fired = true; steps.forEach((s, i) => setTimeout(() => s.classList.add('in'), i * 320)); };
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(); obs.disconnect(); } });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  io.observe(block);
  setTimeout(run, 2200); // safety net: reveal even if the observer misses
}
