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
