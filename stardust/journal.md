# stardust journal — celinek.org

## 2026-09-12 · uplift (one-shot presales, 3 variants)

**Prompt:** `/stardust:uplift https://www.celinek.org`

**Extract (Phase 1).** Single-page live Playwright capture of the homepage
(HTTP 200, waitMs 2500). Brand: Céline Knobloch, a Home Organiser / "coach en
rangement" in the Haut-Rhin — warm, human, care-led personal-service brand on an
AEM Edge Delivery boilerplate. Captured surface: cream `#fdfefa` ground, sage
`#728e7f` + gold `#eed366`/`#f8e1af`, Comfortaa (body+headings), Sacramento
(script, used ONCE), one identity-quality portrait. Authored the brand-surface
artifacts (`_brand-extraction.json`, current PRODUCT/DESIGN, `brand-review.html`
with 6 tensions).

**Tensions/traits (Phase 2).** 7 improvements (dated brochure layout, photo
under-shared, script under-used, prose walls, CTA never gets the bright color,
buried proof, decorative H1). What-if catalog walked; C = photography
re-foregrounding, B = display-typography amplification; disqualified: live-data,
audience-routing. Register (Phase 3a) = **editorial** (slow-paced, warm,
photography-led; runner-up arrival).

**Variants (Phases 4–5).** Mode A (palette + type pinned). Softened captured
pure `#000` → warm near-black `#1a1a17`; added deeper sage/gold tokens for AA.
- **A** faithful + improvements (static) — split hero, warm value grid, numbered
  3-step process, surfaced testimonial, gold conversion CTA, deep-sage contact band.
- **B** Sacramento amplified (static) — script becomes structural voice (giant
  script hero, scripted section openers, scripted step words un/deux/trois,
  scripted pull-quote).
- **C** editorial cinematic — full-bleed parallax portrait hero, alternating
  photo/text blocks, slow fade-and-rise reveals (Lenis + canonical runtime,
  editorial tuning). Emits both `-proposed` (static) and `-cinematic`.

**Validation.** All three clean at 1440/768/390 (no overflow, no console/network
errors). C motion validated: Lenis boots, hero parallax fires (0→90px),
reveals trigger (31/32 by bottom), reduced-motion neutralizes all (0 hidden,
hero transform none). Differentiation ≥2 structural changes per pair (A/B, A/C,
B/C). Sanctioned design-hook suppressions (scoped): brand-review renders the
brand's own low-contrast palette (documented as tension T6); C hero white text
over the photographic hero + parallax clip.

**Next:** iterate any variant via chat, or approve via the prototype approval flow.

## 2026-09-13 · C iteration — amplified motion/parallax

**Prompt:** "iterate on C, more animation/parallax effect"

Pushed variant C's editorial motion into richer scroll cinema, in-register (no
counters/tickers/hard clip reveals): (1) layered hero — photo now drifts 18vh
**and** scales 1→1.12 while the foreground text drifts up 12vh and fades, giving
depth between fore/background; (2) continuous parallax drift on the editorial
photos (±14% of frame — the "photos breathe" move); (3) fade-rise reveals gain a
soft scale-in on photo blocks. Static `-proposed` regenerated in sync.
Re-validated: Lenis boots, hero mid-scroll = scale(1.12)+162px, photos drift
(+31→−38 / +50→−23px), reveals fire, reduced-motion neutralizes everything, no
overflow.

## 2026-09-13 · C iteration — cinematic showpiece

**Prompt:** "menu could become smaller on scroll / more visual effects / be creative, show me something really cool"

Made variant C's hero a showpiece, all in-register (no counters/tickers/hard
clip reveals): (1) **condensing nav** — header shrinks 92→62px on scroll, logo
scales down, "Trier · Ranger · Optimiser" tagline collapses, solidifies with a
soft shadow; (2) **reading-progress bar** — thin sage→gold gradient fills with
scroll (updates even under reduced motion — it's state); (3) **cinematic hero** —
on-load word-by-word Sacramento reveal + photo scale-settle intro, slow idle
Ken Burns drift/zoom so the hero is alive at rest, and subtle pointer-parallax
(photo and text counter-move for depth). Pointer/idle effects gated to
fine-pointer desktop; everything neutralized under prefers-reduced-motion.
Validated: Lenis boots, hero words 8/8 reveal, nav 92→62px on scroll, progress
fills, reduced-motion clean (0 hidden, hero transform none, 0 errors), no overflow.

## 2026-09-13 · C iteration — content variety, testimonials, CTAs, recolor

**Prompt:** image repetition / testimonial carousel lost / hero CTA duplication / duplicate "Comment ça se passe" headline / contact CTA placement / new contact-footer colors.

- **Image variety**: harvested real assets from other pages (Playwright render) — a 2nd Céline portrait (/qui-suis-je), a 3rd (/contact), the 34-image /realisations gallery, and /prestations-tarifs. C now uses: hero portrait; a *different* portrait in "Je suis Céline"; the labeled spice-drawer réalisation in "Revenir à l'essentiel". No more repeats.
- **Testimonials**: recovered all 4 real reviews from the home carousel (Madame F, Agathe, Alban, Joëlle) — earlier capture only got 1. Rendered as a 2×2 card grid (all visible at once), smaller font (15.5px).
- **Hero CTAs**: dropped the contact repeat (already in nav); now section anchors — Découvrir le concept (#concept), Comment ça se passe ? (#process), Témoignages (#proof).
- **"Comment ça se passe ?"**: fixed the identical headline/subheadline → script "Pas à pas, à votre rythme" + h2 "Comment ça se passe ?"; also de-duped the "why" opener. Section CTA → "Voir mes réalisations" (/realisations/).
- **Contact**: "Contactez-moi" CTA lives here (the conversion moment).
- **Recolor**: swapped the contact/footer pairing — contact = warm gold gradient (dark text, deep-sage CTA), footer = deep sage (white text, light social chips).
- **Bug fixed**: staggered reveal couldn't fully fire on the last section (page can't scroll past it) → contact CTA stayed at ~0 opacity. Added a smooth nearBottom guarantee so the final section always fully reveals.
Validated: motion + reduced-motion clean (0 hidden, hero transform none, 0 errors), reveals 35/36+guard, contact CTA opacity 1 at rest, static clean at all viewports.

## 2026-09-13 · C — hero copy right + mobile polish

- Hero: reverted the mirror (looked unnatural); moved the copy into a right-aligned panel so it clears Céline on the left. Removed the "Témoignages" hero CTA (was wrapping to 2 lines) — hero now has 2 CTAs on one line.
- Mobile: portrait-orientation editorial photos were cropped to a short 3:2 slice → now 4:3 (≤900) and 4:5 (≤560) so the spice drawer / closets / portrait show fully; reduced section heading sizes on phones (--heading-xl 42→30, --heading-lg 32→27), trimmed section-script and testimonial sizes, tightened section padding. No overflow at 390/768/1440; motion + reduced-motion clean.

## 2026-09-13 · C — desktop feedback round 2

1. **Hero drift removed** — dropped the mouse-parallax and Ken-Burns horizontal translate (the "moves left/right" that felt disturbing). Hero now only drifts vertically on scroll + a very subtle scale breathe; removed the pointermove listener and lerp entirely.
2. **Concept image** — swapped the busy spice-drawer for the organized dressing (realisation-closet); better illustrates "Le home organising / Revenir à l'essentiel".
3. **"Pour une maison agréable, désencombrée, sereine"** — moved into the same card grid as a full-width closing card (`.value--wide`, grid-column:1/-1), same style as the 3 cards, so it reads as part of the set.
4. **Process tempo** — the 3 steps now reveal sequentially (1-2-3, 0/320/640ms) via an IntersectionObserver when the section enters view, with a small badge scale-pop; removed their generic data-anim. Static/reduced-motion keep them visible.
5. **Testimonials** — reverted the 2×2 grid to a single-card carousel (all 4 real reviews) with prev/next arrows, dots, and pointer-swipe; content vertically centered so short quotes stay balanced. Carousel JS lives outside the motion runtime so it works in the static reference too.

Validated: hero matrix X-translate = 0 (no h-drift); carousel advances (translateX + active dot); steps sequence 1→2→3; motion + reduced-motion clean (0 errors, hero neutralizes); no overflow at 390/768/1440.

## 2026-09-23 · uplift /realisations/ (aligned with the redesign)

**Prompt:** `/stardust:uplift` of the preview /realisations/, aligned with the redesigned homepage (preview `/`), content from www.celinek.org/realisations/.

**Deviation (intentional):** brand surface = the approved homepage canon (variant C), not a fresh
extract of the legacy site; register inherited (editorial). Root DESIGN-A/B/C.json (homepage) left
untouched — page direction lives in `stardust/realisations-direction.md`.

**Capture.** 22 before/after pairs, 14 h3 for 9 rooms, 44/44 `alt=""`, fixed-500px slider, no CTA,
og:image = a *before* photo, legacy `/nav`. 44 images pulled to `prototypes/assets/realisations/`.

**Variants** (generator: `stardust/scripts/realisations-prototypes.py`):
- **A** — canon chrome + room chapters (merged, counted), chip index, sticky room heads, responsive labeled comparison slider, contact band.
- **B** — "start from your room": sticky filter chips, après-first cards with avant flip, dialog comparison with prev/next, two real review interludes.
- **C** — "the scroll turns avant into après": pinned hero feathered wipe (chambres d'amis), pinned per-room dissolve stages, room rail scroll-spy, canon word-reveal + progress + condensing nav. `-proposed` = side-by-side static (also the reduced-motion path).

**Validation.** 390/768/1440: no overflow, 1 h1, 22 items, 0 empty alts, 0 errors on all four files.
B: filter/flip/dialog/prev-next/slider verified. C: stage p 0→.17→.56→.9→1 across the pin, rail
active tracks, hero wipe fires. Fixed during validation: mobile stage overflow (grid min-content), hero scrim contrast.
