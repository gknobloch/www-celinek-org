---
_provenance:
  writtenBy: stardust:uplift
  writtenAt: 2026-09-12T00:00:00Z
  againstInput: https://www.celinek.org
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/index.json
    - stardust/current/brand-review.html
---

# Improvements — https://www.celinek.org

1. **[dated-pattern]** Centered single-column brochure with a wide photo band and paragraph walls — the capture shows a hero photo + script overlay, then long running prose in tinted bands (tension T3, `pages/index.json.body` mainTextLen 5623 across only 10 headings) · this is the personal-service template circa 2015–2018; the design world has moved calm service brands to editorial layouts with scannable value points and generous asymmetric photography · fix: convert the "Pourquoi faire appel" prose wall into 3–4 scannable value cards and give the intro an asymmetric editorial split.

2. **[missed-opportunity]** The one identity photograph is world-class and used exactly once (tension T2) — `_brand-extraction.json.photography` has a single 2000w environmental portrait, cropped into one wide hero band and never reused across a long page · the layout treats the brand's biggest trust asset as decoration · fix: let the portrait breathe at editorial scale and reintroduce photography (or portrait crops) in the concept / process / testimonial regions.

3. **[missed-opportunity]** The signature script is spent on one line (tension T1) — `_brand-extraction.json.type.families.display` shows Sacramento with usageCount 1 (the hero tagline only), while Comfortaa carries both headings and body so the page has no display contrast · the brand's one moment of personality in type is a stapled-on flourish · fix: give Sacramento a defined repeatable role (section openers / pull-quotes) so it reads as structural voice.

4. **[ia-clutter]** The 3-step method is buried as prose (tension T3) — "Comment ça se passe ?" is a real, reassuring sequence (Faire connaissance → Envisager ensemble → Désencombrer) but rendered as running paragraphs under H3s, not as a legible numbered process · prospects can't scan "what actually happens" · fix: render it as an explicit numbered 3-step process with short summaries.

5. **[contrast-or-density]** The conversion CTA never gets the bright color (tension T6) — the vivid gold `#eed366` is spent entirely on link-hover (`--link-hover-color`) while primary CTAs sit in muted sage `#728e7f`; "Contactez-moi" is the last band before the footer · the one color that could pull the eye to contact is invisible until hover · fix: promote gold to the primary contact CTA and lift a contact affordance out of the footer into the page body.

6. **[cliché]** Social proof is a single quote behind carousel arrows at the very bottom (tension T5) — "Ils m'ont fait confiance" holds one testimonial in a carousel, the last thing seen · the strongest emotional conversion lever is hidden · fix: surface testimonial evidence higher and show more than one story at once.

7. **[contrast-or-density]** The H1 is a decorative script string with collapsed spacing (tension T4) — captured H1 innerText is `"Lerangementauservicedevotrebien-être!"`, spaces lost in the script rendering; the true value proposition (home organiser, Haut-Rhin) is not the primary heading · poor for SEO and screen readers · fix: keep the script visual but back it with a properly spaced, semantic H1 stating who / what / where.
