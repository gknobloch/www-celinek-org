<!--
_provenance:
  writtenBy: stardust:uplift (Phase 3)
  writtenAt: 2026-09-12T00:00:00Z
  againstInput: https://www.celinek.org
  mode: Mode A (brand-faithful — palette + typography pinned to captured surface)
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/brand-review.html
    - stardust/uplift-improvements.md
    - stardust/uplift-questions.md
-->

# Direction — uplift presales redesign, https://www.celinek.org

Three variants, Mode A (brand-faithful). Palette pinned: cream `#fdfefa`,
sage `#728e7f`, gold `#eed366` / soft gold `#f8e1af`, deep sage `#6b8a7c`,
black text. Type pinned: Comfortaa (body + headings), Sacramento (script),
Roboto Mono (fixed). Language: fr-FR. Captured hero portrait
(`hero-celine.webp`) reused in semantic hero position in all three. Favicon
inlined in every variant head.

## Variant A — Faithful + improvements

Role: risk-averse green-light. "Yes, that's us, with the obvious fixes."
Composition: same IA as captured (hero → intro/concept → why → how → proof →
contact/footer).
Motion: static (no cinematic layer).
Improvements applied (from uplift-improvements.md):
1. Convert the "Pourquoi faire appel" prose wall into scannable value points.
2. Reuse the portrait beyond the single hero band.
3. Give Sacramento a light repeatable role (kept restrained in A).
4. Render "Comment ça se passe ?" as an explicit numbered 3-step process.
5. Promote gold `#eed366` to the primary contact CTA; lift a contact
   affordance out of the footer into the page body.
6. Surface a testimonial higher and show it without hiding behind arrows.
7. Back the script hero with a properly spaced, semantic H1 (who/what/where:
   home organiser, Haut-Rhin).

## Variant B — What if we amplified the signature script (Sacramento)?

Role: design-team motivator. The brand's underused capability foregrounded.
What if: "What if Sacramento stopped being a one-line flourish and became the page's structural voice?"
Captured trait amplified: the signature script (Sacramento), `usageCount: 1` in
the capture (tension T1).
Evidence: `_brand-extraction.json.type.families.display` — Sacramento used only
in the hero tagline; Comfortaa does all other type work.
Composition: scripted section openers throughout (each section led by a large
Sacramento phrase), a scannable value grid replacing the prose "why" band, and
the warm-gold accent lifted to carry the scripted moments. The bet is
typography + composition, not motion.
Motion: static (no cinematic layer).

## Variant C — What if motion was part of the identity?

Role: visionary pitch. The brand's third dimension — kinetic, editorial.
What if: "What if Céline's portrait breathed at editorial scale and the page unfolded slowly around her presence?"
Cinematic register: **editorial** (auto-picked from PRODUCT.md Brand
Personality — slow-paced, warm, photography-led; runner-up `arrival`).
Captured trait amplified: the identity photography (the trait editorial
naturally amplifies) — single 2000w portrait, shown once (tension T2).
Evidence: `_brand-extraction.json.photography` — one identity-quality
environmental portrait, never reused.
Composition: identical IA to A; the bet is motion, not layout — hero photo
leads, editorial photo/text blocks alternate.
Motion: cinematic, register editorial — hero-photo micro-parallax (8–12vh),
slow fade-and-rise reveals on section entry, soft image scale-ins; NO
count-ups, tickers, or hard kinetic reveals (editorial refuses those).
Reduced-motion fallback neutralizes every motion element.

## Differentiation contract

- A vs B: B rebuilds the type system (scripted section openers + value grid) —
  ≥ 2 structural changes vs A's same-IA fixes.
- A vs C: C adds the editorial motion layer + editorial photo/text composition —
  ≥ 2 changes.
- B vs C: B's axis is typography/composition (static); C's axis is
  photography + motion. Different traits, different axes — ≥ 2 changes.
