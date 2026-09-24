# EDS conversion log — variant C (cinematic) → /redesign preview

## Decisions locked (2026-09-13)
- **Variant:** C (cinematic editorial) — the user's chosen direction.
- **Target path:** `/redesign` — a NEW page; the live homepage `/` is untouched.
- **Scope:** branch preview only (`redesign-c-preview` branch). NO publish to live.
- **Chrome:** reuse the existing `header`/`footer` blocks (fetch `/nav` + `/footer`).
  The redesign's condensing nav + reading-progress bar are shared-chrome features
  NOT converted here (they'd modify the site-wide header block and risk the live
  site). Noted for a later, dedicated pass.
- **Block naming:** namespaced so nothing existing (`hero`, `cards`, `carousel`,
  `columns`, `bio`, `before-after`, `pricing`) is overwritten.

## Runtime contract (`stardust/runtime-contract.json`)
Older aem-boilerplate vintage: `decorateButtons` emits `p.button-container` (NOT
`-wrapper`), buttonizes bare links too (`a` alone → `.button`; `strong>a` →
`.button.primary`; `em>a` → `.button.secondary`); no `.accent`. blockWrapperClass
`block`. Foundation already ships Comfortaa (variable) + Sacramento self-hosted
and the brand tokens (sage #728e7f, gold #eed366/#f8e1af, cream #fdfefa).

## Section → block map (variant C)
| Prototype section | Kind | EDS |
|---|---|---|
| Hero (full-bleed cinematic) | bespoke + motion | block **`cine-hero`** (parallax/scale/word-reveal in block JS; LCP eager) |
| Intro/concept (2 alternating photo/text) | repeating (2, reversible) | block **`editorial-split`** (image parallax in block JS) |
| Why — head | prose | **default content** (script eyebrow + h2 + lead) |
| Why — 4 value cards (3 + 1 wide) | repeating | block **`value-grid`** |
| Process — head | prose | **default content** |
| Process — 3 steps + CTA | repeating + motion | block **`steps-flow`** (sequential 1-2-3 reveal in block JS) |
| Testimonials — head | prose | **default content** |
| Testimonials — 4 reviews | carousel | block **`testimonials`** (arrows/dots/swipe in block JS) |
| Contact "Et si on commençait ?" | bespoke band | block **`contact-band`** (warm gold gradient) |

Images authored as `https://www.celinek.org/media_<hash>...` source URLs (same
origin, plain-fetchable → pipeline ingests). Deferred to transport time.

## Status
- [x] branch + .gitignore(.env/qa) + runtime contract
- [ ] foundation additions (redesign section styles) — minimal, scoped
- [ ] blocks
- [ ] content/redesign.html
- [ ] local harness validation
- [ ] DA transport — BLOCKED on DA_TOKEN (see hand-off)

## Local validation (2026-09-13) — PASS
- David's Model lint: 0 🔴 (2 🟡 justified bespoke: steps-flow, contact-band).
- qa-gate: 20 ✓ — one <h1>, all 6 redesign blocks loaded + non-empty with correct
  child counts (4 value cards, 3 steps, 4 testimonials), 0 pageerrors, 0 broken
  images. The 2 ✗ are header/footer empty = harness-only (/nav + /footer 404 on
  the local static server; they load from DA on deploy).
- Token-completeness: every block var(--x) defined in :root. No absolute asset URLs.
- Reveal fix: scroll-reveals gated behind a JS-added `.anim` class (no-JS = visible)
  + safety timeouts so content can never stay hidden (#16 guard).
- Full-page render eyeballed at 1440 — faithful to variant C.

## Deferred / notes
- Condensing nav + reading-progress bar (variant C chrome) NOT converted — they
  live in the shared header block and would affect the live site. Note for a
  later dedicated chrome pass.
- Images authored as celinek.org source URLs (same origin, ingest at preview).

## BLOCKED — DA transport needs DA_TOKEN
Everything is built + validated. Remaining (one atomic step, needs the token):
  1. `git push -u origin redesign-c-preview`  → Code Sync builds the branch.
  2. sanitise + PUT content/redesign.html → DA, POST /preview (org=gknobloch, repo=www-celinek-org).
  3. Preview URL: https://redesign-c-preview--www-celinek-org--gknobloch.aem.page/redesign
  (NO /live publish — branch preview only, per the locked scope.)

## aem-up round (2026-09-13) — fixes from real-pipeline testing
The build-harness gave false confidence (it doesn't strip classes). Testing via
`aem up` (real pipeline) surfaced + fixed:
- **Author classes are stripped** in block cells AND default content → re-apply
  roles in block JS (script/eyebrow) and use POSITIONAL CSS for default-content
  heads (`.default-content-wrapper > p:first-child` = script; `h2 + p` = lead).
- **CTAs: one per paragraph** — two `<a>` in one cell fold into one `<p>` and
  neither buttonizes. Hero + contact CTAs split into separate paragraphs; phone
  un-buttonized in block JS.
- **Carousel offset** — older boilerplate ships no global `box-sizing:border-box`;
  slide padding overflowed 100% width. Added scoped border-box → slides align.
- **Footer colors** — deep-sage footer scoped to the /redesign page via
  `body:has(.cine-hero) footer` (live footer untouched).
- **Reveals** — switched from IntersectionObserver (unreliable in testing, left
  content hidden) to a scroll-driven check; fires reliably, animates, never
  leaves content invisible. Verified: editorial/values/steps all reveal; hero
  parallax + step 1-2-3 sequence fire.
- **Section anchors** — `data-anchor` on the block div is stripped too; moved to
  section-metadata (`anchor` key → `data-anchor` on the section, preserved).
  Hero CTAs now scroll to #concept / #process.
- **Header** — errors in the LOCAL aem-up context (loadFragment('/nav') returns
  null); fails identically on the homepage `/` locally. `header.js` is unchanged
  from main and the header works on live celinek.org, so this is an aem-up
  local-render artifact — the header will render on the deployed preview.

Verified on aem up: anchors resolve, parallax fires, all reveals fire, carousel
aligns, footer deep-sage, 0 non-chrome console errors, one <h1>.

## Round 3 (2026-09-13) — styling fixes + richer scroll effects
Fixed from user testing at /redesign:
- **Multi-value section style** (#120): `head-center testi-band` (space) collapsed to
  ONE class → testimonials lost centering + sage bg + Sacramento script. Fixed with
  comma: `head-center, testi-band`.
- **Head alignment**: global `p{text-align:justify}` beat the wrapper center → target
  the `p` directly.
- **"Voir mes réalisations" in script font**: the head-script `p:first-child` selector
  caught the CTA's `.button-container` paragraph → excluded `:not(.button-container)`.
- **Hero starts at top**: overlay the nav (`position:absolute`, transparent, white links)
  scoped via `body:has(.cine-hero)`, hero-bg top-aligned, empty metadata section collapsed.
- **Carousel arrows too low**: were centered on the whole carousel (incl. dots) → centered
  on the viewport/card via `top:0; bottom:57px; margin-block:auto`.
- **Footer**: 14px type; social icons → clean white monochrome (`filter:brightness(0) invert(1)`),
  no dark blob; all scoped to the redesign page.
- **Local header/footer**: added `content/nav.html` + `content/footer.html` (preview-only,
  mirror live) so aem up can serve chrome. Header still races in the aem-up warmup (fetches
  /nav before the route is ready); unchanged from main, renders on the deployed preview.

Added scroll effects: reading-progress bar (sage→gold), hero bg parallax + scale + copy
drift/fade, editorial image parallax + scale-in "settle", scroll-linked CSS head reveals
(`animation-timeline: view()`), staggered card + sequential step reveals.

## Round 3b (2026-09-13)
- **Smooth-scroll** added to the cine-hero block: self-contained mini-Lenis
  (wheel → rAF lerp, resync on keyboard/scrollbar, smooth in-page anchor jumps).
  Desktop + fine-pointer only; native scroll on touch / reduced-motion. All the
  scroll-driven effects stay in sync (it drives window.scrollTo).
- **Contact script centered** — `.contact-band__inner p { text-align: center }`
  (beat the global p justify).
- **Process CTA gap** reduced (section padding-bottom 24px → ~66px gap).
- **Footer socials** — white-circle chips (dark icon on white, like the prototype),
  right-aligned by forcing the footer content chain full-width (footer.css's nested
  `div{display:flex}` had shrink-wrapped it) + `ul { flex: 1 }`.

## Header FIXED (2026-09-13) — real bug, not the aem-up race
Root cause: the repo's refreshed header.js expects a 3-section nav
(brand/sections/tools); the site's /nav has ONE section (bare link list), so
`.nav-sections` was null and `toggleMenu` crashed (`querySelectorAll` on null).
This would fail on the deployed preview too (the live site still runs the older
deployed header.js, which is why it looked fine there).

Fix (no shared-code change, no touching the live /nav):
- `content/nav-redesign.html` — 3 sections (brand / links / tools = Contactez-moi).
- redesign page metadata `nav: /nav-redesign` (per-page nav override).
- Overlay + condensing nav styling scoped via `body:has(.cine-hero)`: transparent
  over the hero with white links + gold CTA at top; solid cream + dark links once
  scrolled (`header.scrolled`, toggled by the cine-hero scroll handler). Hidden the
  redundant nav-brand.

DEPLOY NOTE: `content/nav-redesign.html` MUST be deployed+published to DA alongside
redesign.html (it's on the publish roster now) or the header 404s the fragment.

---

# /realisations/ — variant C (uplift 2026-09-23) → EDS

Source prototype: `stardust/prototypes/realisations-C-cinematic.html` (generator
`stardust/scripts/realisations-prototypes.py`). Content page: `content/realisations/index.html`
(folder index → `/realisations/`). Schema: `stardust/eds-schema/realisations.json`.

## Section → block map
| Prototype section | Triage | EDS |
|---|---|---|
| Hero — avant→après pinned wipe | bespoke + motion | **`cine-hero`** — NEW auto-variant `wipe` (2 authored images = avant, après; optional lead `<p>` after the h1). Homepage (1 image) path unchanged. |
| Room rail (sticky, scroll-spy) | interactive widget (D1 🟡 justified) | NEW block **`room-rail`** — authored `<ul>` of `#anchor` links, moved into a `<nav>`; the SECTION is sticky (top 62px) |
| Intro "Pièce par pièce" | prose | **default content**, section style `head-center` (existing) |
| 9 room chapters | repeating, bespoke motion | NEW block **`room-stage`** ×9 — head (script / h2 / count) authored as DEFAULT CONTENT and reabsorbed; one row per pair (avant \| après). Lead pair = pinned dissolve stage; others = comparison sliders. Section-metadata `anchor` → id. |
| Contact band | existing | **`contact-band`**, copy verbatim from the homepage |

## Decisions
- **Tier:** cine-hero + room-stage template-slotted (node-moving); room-rail reconstructive (list).
- **Motion stays centralized** in `scripts/motion.js`: it now also drives `--p` for `.cine-hero.wipe.anim`
  and every `.room-stage.anim` (hold avant → feathered 16% wipe → hold après, easeInOut). Blocks only add
  `.anim` when motion is allowed; no-JS / reduced-motion = static (hero shows après, stages side by side).
- **No DOM words from JS (#100):** "Avant"/"Après" tags + state pills, chapter numbers ("02 / 09" via CSS
  counter + `data-total`), and the slider knob glyph are CSS generated content. This is why
  `block-roundtrip` reports MISSING EYEBROW for "Avant"/"Après" and MISSING BODY for "NN / 09" / "‹›" —
  by design, not drops. All headings, all 44 images, all authored texts round-trip; EW editable 36/36.
- **Deliberate drop:** the prototype's "Comment ça se passe ?" link under the contact band — the shared
  contact-band stays byte-identical to the homepage's.
- Images authored as the live `www.celinek.org/realisations/media_*` URLs (same origin as the homepage
  conversion; ingestible). og:image = chambres d'amis *après* via metadata `Image` (was a *before* photo).
- Rooms merged in first-appearance order (Cuisine/Dressing/Salle de bain/Atelier duplicates → one chapter each).
- Fixed in passing: `scripts/scripts.js` `buildHeroBlock` threw on fragments without an `<h1>` (nav/footer)
  — `h1.closest` → `h1?.closest`.

## Validation (local, aem up + qa/realisations.html)
- davids-model-lint: PASS 0 🔴 (2 🟡 justified: room-rail widget, contact-band shared).
- 1440 / 390 / 1440 reduced-motion: 1 h1, 0 overflow, 9 stages + 13 sliders, 0 broken / 0 zero-width imgs,
  0 page errors (only the known harness header/`/nav` message). Hero `--p` 0 → .70 → 1; Cuisine stage
  0 → .41 → 1 while pinned (pair top constant); rail scroll-spy tracks; slider drives `--pos`.
- Homepage regression (qa/redesign.html): unchanged — 8 blocks loaded, hero 3 children, 1 h1.

## Transport — BLOCKED (not code)
- `/realisations/` on this site is sourced from **Google Drive** (admin status `gdrive:1ioMsOvc…`), not DA,
  and the `.env` DA_TOKEN expired. Content must be authored into the Drive doc (tables per
  `content/realisations/index.html`) — or staged to DA once the content-source cutover happens.

---

# /prestations-tarifs/ — index + 4 services, variant C → EDS (2026-09-23)

Prototypes: `stardust/prototypes/prestations-{index,vivre}-C.html` (generator
`stardust/scripts/prestations-prototypes.py`). Template approved on the vivre page, rolled to the
other three directly in EDS. Content: `content/prestations-tarifs/{index,<slug>}.html`
(generator `stardust/scripts/prestations-content.py`, verbatim copy; labels listed in
`stardust/prestations-direction.md`).

## Blocks
| Block | Kind | Notes |
|---|---|---|
| `cine-hero` (ext.) | bespoke | + breadcrumb (link `<p>` before the h1, un-buttonized), + price tag (2nd text `<p>` after the h1), inner-page h1 42px via `:has(.lead)`, inner padding-top clears the overlay header. Homepage + realisations unchanged (re-verified). |
| `service-cards` NEW | repeating | image \| tag/h3/blurb/price(strong)/link; whole card = link (inner anchor unwrapped, EW6). Variant `compact` = cross-links. |
| `panels` NEW | repeating | rich prose panels; grid by `data-count` (1/2/3/2×2). Variants `concerns`, `notes`, `stats`. D1 🟡 justified: grouped card units, not a single prose run. |
| `benefit-icons` NEW | repeating | icon \| label. |
| `price-cards` NEW | repeating | h3, details, `<p><strong>amount</strong></p>`, CTA link; last card featured when >1. D1 🟡 justified for single-offer pages (card treatment). |
| `value-grid` (ext.) | repeating | + `plain` variant (no full-width last card). |
| `editorial-split` (reuse) | bespoke | bio; a `<blockquote>` renders as the scripted pull-quote. |
| `steps-flow`, `contact-band` | reuse | homepage steps reused as "Comment ça se passe ?" on index / TRO / changement. |

## Section styles (styles.css, ONE value per section)
`head-left` (plain, left head), `warm-center` (warm band, centered head), `sage-band` (sage, left head),
`statement` (centered display h2 or scripted p) — plus existing `head-center`, `why-band`.

## Decisions / fixes
- Block CSS that must beat section-style rules is scoped `main .section .<block> …` (panel h2 vs the 42px
  section h2; price-card buttons vs the head-center gold process-CTA rule).
- Images authored as fully-qualified `https://www.celinek.org/prestations-tarifs/media_…` (already ingested
  on celinek-org after the image-URL fix).

## Validation (local aem up, qa/pt-h/*)
All 5 pages @1440/390: 1 h1, 0 overflow, 0 broken / 0 zero-width images, every grid block computes
grid, counts = authored (index 4 cards; vivre 7 panels / 5 benefits / 2 prices / 3 cross-links; TRO 10
panels; changement 1; gérer 12), crumb + price tag present on the 4 service pages, 0 page errors.
davids-model-lint: 0 🔴 on all 5.

---

# /qui-suis-je + /contact — variant C → EDS (2026-09-24)

Content: `content/{qui-suis-je,contact}.html` (generator `stardust/scripts/about-content.py`).
- `cine-hero` gains variant **`split`** (authored `cine-hero (split)`): text left, framed 4:5 portrait
  right on cream; motion.js skips hero parallax/fade for it (`:not(.split)`).
- NEW block **`timeline`**: rows [year | story (+ blockquote)]; rail fills sage→gold on scroll, dots
  turn gold when reached; items fade-rise via motion.js.
- `panels` gains variant **`chips`** (list as pills; first pill highlighted).
- Blockquotes in `timeline` / `editorial-split` reset the global blockquote italics + hanging indent.
- contact: the phone is now a tel: link (primary CTA), email the secondary CTA.
Validation (local): both pages @1440/390 — 1 h1, 0 overflow, 0 broken images, grids OK, 0 errors;
davids-model-lint 0 🔴. Regression: homepage, realisations, 5 prestations pages unchanged.
