/**
 * steps-flow — the 3-step "Comment ça se passe ?" process (variant C).
 * One row per step = [ <h3>, <p>, <p> ]. A numbered badge is generated per step
 * (CSS counter). Steps reveal sequentially (1-2-3) when the grid enters view.
 * Schema: stardust/eds-schema/redesign.json#steps-flow
 */
export default function decorate(block) {
  const sec = block.closest('.section');
  if (sec && sec.dataset.anchor) sec.id = sec.dataset.anchor;

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
  // Fire the 1-2-3 sequence ONLY when the grid genuinely scrolls into view.
  // An IntersectionObserver (not a decorate-time getBoundingClientRect check) is
  // required: at decorate the sections above haven't laid out, so the block's top
  // is briefly near 0 and a scroll-position check fires + latches immediately —
  // the sequence would finish off-screen before the user ever reaches it.
  const io = new IntersectionObserver((entries, obs) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    steps.forEach((s, i) => setTimeout(() => s.classList.add('in'), i * 320)); // 0 · 320 · 640ms
    obs.disconnect();
  }, { threshold: 0.3 });
  io.observe(block);
}
