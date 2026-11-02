---
_provenance:
  writtenBy: stardust:uplift (Phase 2a)
  writtenAt: 2026-09-23T00:00:00Z
  againstInput: https://redesign-c-preview--celinek-org--gknobloch.aem.page/realisations/
  contentSource: https://www.celinek.org/realisations/ (identical content, re-ingested media hashes)
  brandSurface: approved redesign canon — https://redesign-c-preview--celinek-org--gknobloch.aem.page/ (variant C, editorial register; stardust/prototypes/index-C-cinematic.html, DESIGN-C.json)
  readArtifacts:
    - stardust/current/pages/realisations.json
    - stardust/current/_brand-extraction.json
    - stardust/prototypes/index-C-cinematic.html
    - DESIGN-C.json
  referencesUsed: []   # reference research unavailable this run — Phase 2.5 skipped
---

# Improvements — /realisations/

1. **[missed-opportunity]** The page looks like a different site from the redesigned homepage — the preview renders the legacy `/nav` (no gold CTA, no condensing header, no reading-progress bar), no Sacramento anywhere, no sage/gold bands, no reveals, and no footer recolor · the redesign canon stops at the homepage, and the homepage's own "Voir mes réalisations" CTA (process section) lands on the old design · fix: carry the canon chrome (nav-redesign, deep-sage footer, contact band) and the section grammar (script eyebrow + Comfortaa h2) into this page.
2. **[ia-clutter]** 14 `<h3>` headings for 9 distinct rooms — Cuisine ×2, Dressing ×2, Salle de Bain ×2, Atelier ×2 (the Atelier groups are split by "Placard mural") · repeated-heading gallery with no grouping logic the visitor can see · fix: one chapter per room, in first-appearance order, with a count ("Cuisine — 5 transformations") and no duplicate headings.
3. **[ia-clutter]** 22 before/after pairs with no wayfinding — no room index, no anchors, one ~15 000 px column (22 × ~667 px portrait sliders at the fixed 500 px width) · long undifferentiated gallery scroll · fix: a room index (chips with counts) at the top linking to anchors, plus a multi-column grid on desktop.
4. **[contrast-or-density]** Accessibility gaps in the slider — 44/44 images have `alt=""`, the comparison is an unlabeled `<input type="range">`, and nothing tells the visitor which side is "avant" and which is "après"; heading outline jumps h1 → h3 (no h2) · unlabeled comparison widget · fix: "Avant"/"Après" tags on each frame, `aria-label` on the range ("Comparer avant / après — Cuisine"), room-based alt text, rooms as h2.
5. **[dated-pattern]** `before-after.js` hard-codes `row.style.width = 500px` and `slider.style.width = 540px` inline; the handle is the bare browser range thumb below the photo, not on the image · 2015-era jQuery-plugin comparison slider · fix: responsive frame (aspect-ratio from the source image), full-frame drag surface, visible vertical handle on the photo, keyboard-operable.
6. **[missed-opportunity]** The page dead-ends — no CTA, no contact, no link to the process; the last element is the Bureau photo · proof page without a conversion moment · fix: end on the canon's gold contact band ("Et si on commençait ?" — verbatim from the homepage) and link to "Comment ça se passe ?".
7. **[missed-opportunity]** The share image (`og:image`) is `cellier-1` **before** — the messiest photo on the page is what a shared link shows · first-image default · fix: set og:image to a strong "après" (e.g. chambres d'amis 1 — skylight, calm) in page metadata.
