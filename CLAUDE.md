# CLAUDE.md — HeatherAI Marketing Website

## Project Overview

Marketing website for HeatherAI — a consumer-facing landing site that drives signups for the app.

- **Stack:** Astro + Tailwind CSS (static site)
- **Live URL:** getheatherai.com
- **App URL:** ai.heatherbauer.com (the product this site markets)

## Related Projects

The HeatherAI app lives at `~/projects/heather-ai/`. See that repo's CLAUDE.md for product details, architecture, features, and brand rules.

Heather Bauer Nutrition (the business behind HeatherAI) lives at `~/projects/heather-bauer-nutrition/`. See that repo for Heather's history, background, bio, client types, and business context — useful for writing About page copy and ensuring brand accuracy.

**Key brand rule:** Always "HeatherAI" (the AI product), never "Heather" (the real person, Heather Bauer, RDN).

## Commands

```bash
npm run dev      # Start dev server (http://localhost:4321)
npm run build    # Build static site to dist/
npm run preview  # Preview built site locally
```

## Design Tokens

- **Background:** #0a0a0a (primary), #111111 (surface/cards)
- **Accent:** #E8734A (Burnt Coral) — CTAs, highlights
- **Typography:** System font stack, no web fonts
- **Style:** Dark & Bold, Apple-inspired, generous whitespace

## Pages

| Page | Path | Purpose |
|------|------|---------|
| Home | `/` | Hero carousel + stats + features + AlwaysOn + pattern library + showcase + testimonials + CTA |
| About | `/about` | Heather's personal story, career timeline, client testimonials, why HeatherAI |
| How It Works | `/how-it-works` | Data, intelligence, frameworks, peer-reviewed science deep dive |
| Pricing | `/pricing` | 3 tiers (Free / $39 / $299) + FAQ |
| Contact | `/contact` | Typeform embed for inquiries |
| Privacy | `/privacy` | Privacy policy (operated by Many Brains, Inc.) |
| Terms | `/terms` | Terms of service (operated by Many Brains, Inc.) |

## Deployment

- **Host:** Vercel (free tier)
- **Domain:** getheatherai.com (Namecheap)
- **Auto-deploy:** Every push to `main` triggers a build
- **SSL:** Auto-provisioned by Vercel
- Static site, no server-side rendering.
