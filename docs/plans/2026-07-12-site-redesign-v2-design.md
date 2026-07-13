# getheatherai.com Redesign v2 Design

**Date:** 2026-07-12
**Status:** Draft
**Author:** Ross + Claude (brainstormed with visual companion)
**Source of truth for copy:** `heather-ai/docs/marketing/2026-07-10-heatherai-master-marketing-overview.md` and `heather-ai/docs/marketing/marketing-copy.md`

## Overview

The current site was written before the product, positioning, and master marketing doc matured. Its top-level pages carry too much copy (homepage ~1,700 visible words across 10 sections), the copy-heaviest page in the nav (Intelligence) is investor-facing, and several content blocks are stale. This redesign restructures the site around one principle: **every page has an altitude.** Top-of-funnel pages are headline-light and show the product; depth pages one click down carry the detail for people who want it.

## Decisions (settled during brainstorming)

| Decision | Choice |
|---|---|
| Brand | HeatherAI. No HB Method rename planning in this iteration. |
| iOS timing | Ship for web signups now; reserve an App Store badge slot in the final CTA for launch day (content swap, no layout change). |
| Page map | Core pages + ONE persona page (/glp-1). Other personas later. |
| Visual direction | Evolve the existing dark + ember identity. No clean-sheet rebrand. |
| Homepage concept | **Concept A: "The Conversation is the Hero."** Live chat exchange as the hero object; six one-idea sections; ~380 visible words. |
| Homepage hook | The approved one-liner: "A real dietitian's 25-year method, in your pocket the moment you need it." |
| Intelligence page | Leaves the top nav, replaced by new /method. Stays live at /intelligence, footer-linked, for investors/press. |
| Typography | System stack kept (no web fonts). Typography improves via scale, weight, and spacing only. |

## Information architecture

```
Nav:  Method · GLP-1 · About · Pricing          [Start free]

/            Homepage (Concept A)                     ~380 words
/method      NEW: philosophy + techniques + evidence   depth
/glp-1       NEW: persona landing page                 depth
/about       Trimmed rework (~500 words)               depth
/pricing     Light touch (tiers unchanged, FAQ links to /method)
/scenarios   Kept as-is; linked from homepage moments; out of top nav
/intelligence  Kept live; footer-only link
/responsible-ai  Kept; footer; soften compliance claim (see Content fixes)
/contact, /welcome, /privacy, /terms  unchanged
```

Footer adds Scenarios and keeps Intelligence so nothing is orphaned. Every depth page ends with the same two-CTA block (Try free for 7 days / See pricing).

## Homepage spec (Concept A)

Six sections, ~380 visible words. Near-final copy below; all copy passes Section 10 guardrails of the master doc (no em dashes, headlines tight, one pillar leads: real moments).

### 1. Hero
- Eyebrow: "AI-powered, expert-guided nutrition coaching" (approved category line)
- H1: "A real dietitian's 25-year method, in your pocket the moment you need it." (approved one-liner; second clause in accent color)
- CTA: "Try free for 7 days" → /pricing. Ghost link: "How it works →" → /method
- Fine print: "7 days free, then $39/mo. Cancel anytime. Or start free with meal logging."
- Hero object: **the chat demo** replaces the phone carousel. A styled conversation panel that auto-types through 2–3 real-moment exchanges (steakhouse menu, scale spike, 10pm) on loop. Pauses on hover/tap; static first frame when `prefers-reduced-motion` or no JS. Exchanges use master-doc-verified scenarios only.

### 2. Proof strip
- 25 years in practice · 5,000+ clients coached · ~1M texts answered
- Press wordmarks beneath (GMA, TODAY, CNN, The View, NYT, WSJ, People — carried over)
- Guardrail: verify track-record figures are documented before publish (master doc rule 12).

### 3. Moments (big-type beats)
- H2: "Diets fail at specific moments. Coaching should show up there."
- Three beats, each a giant one-liner + a mini chat answer (fade/slide in on scroll, subtle):
  1. "It's 7:40pm and the menu looks dangerous." → branzino answer
  2. "The scale jumped two pounds overnight." → water-not-fat answer
  3. "Saturday got away from you." → "Reset starts with your next meal, not next week. Want a Protein Day?"
- Link: "See more moments →" → /scenarios

### 4. Method teaser
- H2: "Structure does the work, not willpower."
- One line: "No streaks. No badges. No macro math. A day with a shape, built by a dietitian who proved it for 25 years."
- Technique chips (Protein at every meal · Finite foods · Kitchen closed · One-day resets · Goal ranges) → /method

### 5. Proof / member voice
- One rotating quote from the cleared anonymized set (initial: "This is why this app is so fantastic. I'm asking in real time where I might have before just eaten it and said screw it.")
- Attribution: "Founding member" + adjacent disclaimer: "Individual results vary. HeatherAI is nutrition coaching, not medical advice or treatment."

### 6. CTA
- H2: "Meet the coach that meets you in the moment."
- Buttons: Try free for 7 days / See pricing →
- Reserved slot beneath buttons for the App Store badge (hidden until iOS launch).

### What leaves the homepage (and where it goes)
| Current component | Destination |
|---|---|
| PhoneCarousel | Retired as hero; screenshots reusable on /method |
| Scenarios cards | /scenarios (already exists) |
| Features "Is this you?" | /method + /glp-1 |
| Stats narrative + $1,500/mo framing | /about |
| BetaResults block | Stats refresh; one number may join proof strip; quotes rotate in section 5 |
| NeutralityCallout | Quote joins section 5 rotation |
| DataStory / Pattern Library | Stays on /intelligence |
| AlwaysOn narrative | /about |
| Showcase feature rows | /method ("How you get it") |

## /method spec

Nav label: "Method". The depth page for how and why it works. Sections:

1. **Hero.** "A method, not an app." / "Built in 25 years of practice. Proven one client at a time, about 5,000 times."
2. **Evidence.** "Three behaviors. Decades of evidence." Three cards: Log it (1,700-person study, logs doubled weight loss), Plan it (planning beats deciding hungry; the reverse journal), Keep a coach (regain starts when the coaching stops). Approved phrasings from `marketing-evidence-citations.md` only, citations footnoted.
3. **Philosophy.** "Structure does the work, not willpower." Four principles as accordions (one short paragraph each): Food first, numbers second · Goal ranges, not a magic number · Recovery is the skill · If you bite it, write it.
4. **Signature techniques.** All 8 named techniques as cards with one-line explanations (from master doc Section 3 table).
5. **How you get it.** One-line-each walk: intake interview → Blueprint protocol (layered: GLP-1, life stage, medical conditions) → 72-hour plan → photo logging → coaching that remembers everything. Small visual per step (reuse existing app screenshots where fitting). Explicitly say the personalization-engine story ("not three toggles; a coherent stacked protocol").
6. **Oversight.** Heather reviews real coaching sessions; concerning symptoms escalate to her in real time. Framed "expert oversight built in, not bolted on." No AI+Human tier marketing.
7. **CTA block.**

## /glp-1 spec

Nav label: "GLP-1". Persona page per master doc 6.1. Sections:

1. **Hero.** "The medication quiets appetite. It doesn't teach you how to eat." Sub: coaching built for the medication + explicit "We never sell or recommend GLP-1s. We make them work better." (guardrail 6 shown as copy).
2. **What changes on the med.** Three cards: Protein first (every bite counts for more; muscle protected on purpose) · Side effects, handled (Liter by Lunch framed straight at nausea/constipation/fatigue) · The off-ramp (the method worked for 25 years before GLP-1s; it keeps working when the prescription ends).
3. **What coaching looks like.** Chat exchange using the real-transcript language: "I can't give medical advice, but nutrition-wise we'll keep it simple and gentle..." Shows the stays-in-its-lane guardrail as a feature.
4. **Proof.** Marie's story slot is **HELD until written consent** (health details require explicit consent even anonymized). Ships with a cleared generic quote until consent lands. Build the slot so the swap is copy-only.
5. **Straight answers mini-FAQ.** Will you tell me to stop my medication? (Never.) · Do you prescribe or recommend GLP-1s? (No. We coach through them.) · What happens when I stop? (That's exactly what we prepare you for.)
6. **CTA block.**

Do NOT market the GLP-1 Companion (roadmap). Page describes today's coaching only.

## /about rework

Trim ~950 → ~500 words. Keep: Heather photo, story arc (practice → why HeatherAI), press list, existing named 1:1-practice testimonials. Absorb the AlwaysOn "couldn't scale, now it can" narrative. Settle on ONE legacy-price framing: "$1,500+/month" (drop the "$950–$3,750" range). Keep Person JSON-LD.

**Books block (upgraded):** show both book jackets as images, not just text mentions. Source jackets from heatherbauer.com/books (The Wall Street Diet: `images.squarespace-cdn.com/.../wsd.jpeg`; Bread Is the Devil: `.../bread+is+the+devil.jpeg`), downloaded and self-hosted as optimized WebP in `public/images/books/`. Each jacket links to its Amazon page (outbound, `rel="noopener"`). One-line description per book drawn from master-doc-consistent framing (Wall Street Diet = the method for busy professionals; Bread Is the Devil = the diet-saboteur habits book). Add `Book` JSON-LD entries under Heather's Person schema.

## /pricing light touch

Tiers, Stripe links, Typeforms, GA4 events unchanged. FAQ answers link into /method where relevant ("Is this just another tracker?" → method evidence). Verify $39 against Stripe before ship (standing rule).

## Content fixes riding along

1. **BetaResults staleness:** replace "Beta · Week 5 / 22 Paying Members / 0 Cancellations" with evergreen framing. Before writing the copy, pull the current member/churn numbers (master doc Section 7 process: say "beta members," give real current numbers, keep the disclaimer adjacent). No hardcoded week counts or "0 cancellations"-style fragile absolutes anywhere.
2. **Responsible AI compliance line:** soften "pursuing HIPAA compliance and FDA SaMD designation" to describe actual practices (encryption, de-identification, expert review, escalation) without implying pending designations. (Also consistent with the settled legal position that HBN is likely not a covered entity.)
3. **AI + Human tier:** body-copy mentions on about/intelligence/responsible-ai reduced to waitlist framing consistent with pricing page; no feature marketing (guardrail 3).
4. **JSON-LD:** homepage SoftwareApplication schema retained and updated; FAQPage schema on pricing retained.
5. **Showcase mockup dates** ("Fri, Apr 11") refreshed or made relative-generic.

## Design system notes

- **Palette/identity unchanged:** void #0a0a0a canvas, surface ladder, ember accent #E8734A family, existing semantic colors. ~75% near-black / ~18% orange / ~7% other.
- **Typography:** system stack kept sitewide. Display scale increases (hero ~clamp(44px, 7vw, 72px), tighter tracking, weight 800); consistent eyebrow style; body stays 16px.
- **Chat component:** one reusable Astro component (`ChatMoment.astro`) renders all conversation panels (hero demo, moments beats, /glp-1, /scenarios formats) so bubbles look identical sitewide. Typing animation is CSS/JS-light, IntersectionObserver-triggered, `prefers-reduced-motion` safe, no layout shift.
- **Motion budget:** typing loop in hero + fade/slide on moments beats. Nothing else animates.
- **Images:** existing app screenshots and Heather photo reused; no new photography required this iteration.

## iOS screenshot integration

Real iOS app screenshots replace web-app screenshots as the product imagery, sourced from fresh captures (no suitable set exists on disk as of 2026-07-12).

- **Needed captures (4):** a coaching conversation, photo meal logging, the Blueprint, the 72-hour meal plan. Raw PNGs from a physical iPhone or simulator; drop in `heather-ai/docs/screenshots/inbox/` or the website repo.
- **Treatment:** screenshots are framed in a CSS/SVG iPhone bezel at render time (no baked-in frames), cropped/cleaned (status-bar hygiene), exported as optimized WebP with `srcset`.
- **Placement:** /method "How you get it" step visuals (primary); optionally one framed shot on the homepage moments/method-teaser sections if it earns its place; hero remains the chat demo.
- **Reuse:** same assets accompany the App Store badge at iOS launch (the reserved CTA slot).
- **Guardrail:** until the app is live, screenshots are product shots only; no "App Store" / "download" / "install" language (master doc claims register: no PWA/install phrasing for web).

## Guardrails checklist (applies to every page)

- No em dashes anywhere in published copy.
- HeatherAI never "Heather" for the product; Heather Bauer named only as the human expert.
- One pillar leads per page (home: real moments; /glp-1: real dietitian; /about: real dietitian; /method: the method itself).
- "Individual results vary. HeatherAI is nutrition coaching, not medical advice or treatment." adjacent to any results figure or outcome quote.
- No clinical claims about HeatherAI itself; evidence claims describe the methods, approved phrasings only.
- No AI + Human tier marketing; no roadmap features marketed as shipped; no gamification language; no internal implementation details.
- Health-detail testimonials (GLP-1 etc.) held until written consent.
- Verify 25 years / 5,000 clients / ~1M texts documentation and $39 Stripe price before publish.

## Implementation notes

- **New components:** `ChatMoment.astro`, `MomentBeat.astro`, `ProofStrip.astro`, `TechniqueChips.astro`, `CtaBlock.astro` (shared depth-page CTA).
- **New pages:** `method.astro`, `glp-1.astro`.
- **Modified:** `index.astro` (new section order), `Nav.astro`, `Footer.astro`, `about.astro`, `pricing.astro` (FAQ links), `responsible-ai.astro` (compliance line), `Hero.astro` (or replaced), `BetaResults.astro` (refresh or fold in).
- **Retired from homepage** (files can remain for reuse): `PhoneCarousel`, `Scenarios` (page keeps its own), `Stats`, `Features`, `DataStory`, `AlwaysOn`, `Showcase`, `NeutralityCallout`.
- **Redirects:** none needed (no URLs removed).
- **Analytics:** preserve GA4 events (`cta_click`, `view_pricing`, `purchase`) and add `cta_id`s for new CTAs; keep Clarity.

## SEO and AI discoverability (maintain or improve, never regress)

The site already has deliberate AI/search infrastructure; the redesign must carry all of it forward and extend it to the new pages:

- **Keep as-is:** `robots.txt` with explicit AI-crawler allows (GPTBot, ClaudeBot, PerplexityBot, et al.); `@astrojs/sitemap` integration + sitemap reference in robots.txt; OG/Twitter/canonical/description tags in `BaseLayout`.
- **Update:** `public/llms.txt` rewritten for the new IA (page list, one-line purpose each, pull positioning language from the master doc's Section 1).
- **Extend to new pages:** /method and /glp-1 get unique titles, meta descriptions, OG images, and canonical URLs; /glp-1 title/description target "GLP-1 nutrition coaching" search intent; /method targets method/dietitian intent.
- **Structured data:** homepage SoftwareApplication (updated), pricing FAQPage (kept), about Person + new Book entries, /glp-1 gets its own FAQPage schema from the mini-FAQ.
- **Content integrity for crawlers:** hero chat demo and moments beats render full text without JS (animation is progressive enhancement), so the page's story is fully visible to crawlers and LLMs. Heading hierarchy stays semantic (one h1/page, h2 sections).
- **Acceptance:** post-build check that sitemap includes new pages, no page lost its meta description, and JSON-LD validates (Rich Results test or schema linting).

## Testing / acceptance

- `npm run build` clean; Lighthouse a11y + perf spot-check (hero animation must not tank LCP; static first frame renders without JS).
- Reduced-motion verification on hero and beats.
- Copy QA pass against the guardrails checklist above before merge.
- Deploy is Vercel-on-main as today; no infra changes.

## Out of scope (explicitly)

- HB Method rename readiness work.
- Other persona pages (no-med, peri/menopause, postpartum, structure).
- iOS launch content swap (slot reserved only).
- New photography/illustration, light mode, /intelligence rework.
