---
name: heather-ai-website-design
description: Use when editing, adding pages, or extending components on the HeatherAI marketing website (getheatherai.com) to stay consistent with its dark/bold design system, voice, and Astro+Tailwind conventions
---

# HeatherAI Website Design System

Reference for extending `~/projects/heather-ai-website` without drifting on visuals, voice, or structure. Design tokens live in `src/styles/global.css` — this skill captures the patterns tokens alone don't encode.

## Design Tokens (source of truth)

| Token | Value | Use |
|-------|-------|-----|
| `bg-bg-primary` | `#0a0a0a` | Page background |
| `bg-bg-surface` | `#111111` | Cards, elevated surfaces |
| `text-accent` / `bg-accent` | `#E8734A` (Burnt Coral) | CTAs, em-highlights, badge text |
| `accent-hover` | `#D4623C` | Button hover |
| Font | System stack (no web fonts) | Apple-inspired feel, fast load |

Body text defaults to white. All muted text uses `text-white/45` or `text-white/50` — do not invent gray ramps.

## Section Pattern

Every section follows this skeleton:

```astro
<section class="py-28 px-6 md:px-12 border-t border-white/[0.06]">
  <div class="max-w-[1000px] mx-auto">
    <h2 class="text-4xl md:text-5xl font-bold text-center tracking-tight mb-6">
      [Headline]
    </h2>
    <p class="text-lg text-white/45 text-center mb-16 max-w-[520px] mx-auto">
      [One-sentence subline]
    </p>
    <!-- content -->
  </div>
</section>
```

- Vertical rhythm: `py-28` standard, `py-36` for CTA sections, hero is `min-h-screen` centered
- Top border `border-white/[0.06]` separates sections (not horizontal rules)
- Max content width: `1000px`; sublines/intros cap at `~520-640px`

## Component Patterns

**Cards:** `p-8 bg-bg-surface border border-white/[0.06] rounded-2xl transition-colors hover:border-accent/30`

**Primary CTA:** `px-10 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5`

**Secondary link:** `text-[13px] text-white/35 hover:text-white/60` with `&rarr;`

**Badge (eyebrow):** `px-4 py-1.5 rounded-full border border-accent/30 bg-accent/[0.08] text-[12px] text-accent tracking-[1px] uppercase`

**Accent word in headline:** wrap in `<em class="not-italic text-accent">word</em>` — never change color inline.

## Typography Scale

- H1 (hero): `text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight`
- H2 (section): `text-4xl md:text-5xl font-bold tracking-tight`
- H3 (card): `text-lg font-semibold`
- Body: `text-lg` lead, `text-sm text-white/45 leading-relaxed` inside cards

## Voice Rules

- **HeatherAI ≠ Heather.** Never refer to the AI as "Heather." Heather Bauer, RD is the real person.
- Second person. Short sentences. Em dashes welcome.
- Name the resistance, then resolve it ("You've tried every program… you need a coach who understands why you fall off.")
- No marketing puffery: avoid "revolutionary," "game-changing," "cutting-edge."
- Specifics beat adjectives: "20 years," "GLP-1," "40-60% less food" — not "proven" or "powerful."

## Pages

Home, about, how-it-works, pricing, contact, privacy, terms, coming-soon. Reuse `CtaSection.astro` (props: `headline`, `subline`, `ctaText`, `ctaHref`) at the bottom of content pages rather than hand-rolling CTAs.

## Pre-Ship Checklist

- [ ] `npm run build` clean
- [ ] Check mobile (375px) and desktop in `npm run dev` — hero, nav, any new section
- [ ] No new web font, no new gray shade, no new radius
- [ ] "HeatherAI" used everywhere (grep for stray "Heather " in new copy)
- [ ] Commit + push to `main` → Vercel auto-deploys to getheatherai.com

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Inventing a new gray (`text-gray-400`) | Use `text-white/45` or `text-white/50` |
| New rounded value (`rounded-lg`) | Cards `rounded-2xl`, buttons `rounded-xl`, badges `rounded-full` |
| Centered text + left-aligned siblings | Pick one axis per section and commit |
| Writing "Heather will…" about the AI | "HeatherAI will…" |
| Long paragraph subline | One sentence, ≤520px wide |
