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
