/**
 * panels — rich text panels for service pages (variant C).
 *
 * Authoring: one row per panel; the cell holds any prose (h2/h3, p, ul).
 * Grid adapts to the panel count (1 → full width, 3 → thirds, else halves: 2, 2×2 …).
 * Variants (block class): `concerns` (short "vous vous reconnaissez ?" cards with a
 * gold rule), `notes` (dashed "bon à savoir" notes), `stats` (large figure in <strong>).
 * Authored nodes are MOVED into the panel (EW1). Fade-rise reveal via scripts/motion.js.
 * Schema: stardust/eds-schema/prestations.json#panels
 */
export default function decorate(block) {
  const section = block.closest('.section');
  if (section && section.dataset.anchor) section.id = section.dataset.anchor;

  const rows = [...block.children];
  const panels = rows.map((row) => {
    const cell = row.firstElementChild || row;
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.dataset.anim = '';
    panel.append(...cell.childNodes);
    return panel;
  });
  block.dataset.count = String(panels.length);
  block.replaceChildren(...panels);
}
