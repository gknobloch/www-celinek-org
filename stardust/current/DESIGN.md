<!--
_provenance:
  writtenBy: stardust:extract (uplift Phase 1)
  writtenAt: 2026-09-12
  againstInput: https://www.celinek.org
  descriptive: true
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/index.json
-->
---
colors:
  background: "#fdfefa"   # warm cream ground
  text: "#000000"
  primary: "#728e7f"      # sage green (links, buttons)
  accent: "#eed366"       # golden yellow (link hover — reserved)
  surfaceWarm: "#f8e1af"  # soft gold band
  surfaceSage: "rgb(114 142 127 / 70%)"  # translucent sage (testimonial)
typography:
  heading: "Comfortaa"
  body: "Comfortaa"
  script: "Sacramento"    # display/script — hero tagline only
  mono: "Roboto Mono"
rounded: pill (buttons) / ~12px (cards)
spacing: aem-boilerplate modular scale
components: [header-nav, hero-photo-script, two-column-intro, tinted-band, process-steps, testimonial-carousel, footer]
---

# DESIGN — Céline Knobloch (current state)

## Palette
A two-hue warm system on cream. **Sage green `#728e7f`** is the primary
interactive color and grounds the testimonial band; **gold `#eed366` /
`#f8e1af`** is warmth — the vivid gold is reserved for link-hover only,
while the soft gold `#f8e1af` fills two large calm bands. Ground is warm
near-white `#fdfefa`, text is pure black.

## Typography
**Comfortaa** does nearly all the work — a rounded geometric sans used for
both body and headings, so hierarchy rests on size and weight rather than
family contrast. **Sacramento**, a flowing cursive script, appears in
exactly one place — the hero H1 tagline — making it a signature voice that
the rest of the page never revisits.

## Layout & motifs
Centered, single-column, generous whitespace. Pill buttons. Full-bleed
tinted bands (soft gold, sage) segment long-form reassurance copy. One
wide hero photograph with the script tagline overlaid at right. A single
rotating testimonial. Minimal shadow; flat, calm surfaces.

## Motion
Static. No signature motion captured (`heroMedium: null`).
