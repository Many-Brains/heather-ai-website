# Site Redesign v2 Implementation Plan

> **For Claude / agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild getheatherai.com around the "altitude" IA: a ~380-word show-don't-tell homepage (Concept A), new /method and /glp-1 depth pages, trimmed About with book jackets, refreshed nav, and preserved-or-improved SEO/AI discoverability.

**Architecture:** Static Astro 6 + Tailwind 4 site (no test runner; verification is `npm run build` + grep of `dist/` output + `npm run preview`). New reusable components (ChatMoment, MomentBeat, ProofStrip, CtaBlock) power a rewritten homepage and two new pages. All chat/animation content renders as static HTML; JS animation is progressive enhancement.

**Tech Stack:** Astro 6, Tailwind CSS 4 (`@theme` tokens in `src/styles/global.css`), sharp (via node script) for image processing, Vercel (deploys `main`; branches get preview URLs).

**Design Document:** `docs/plans/2026-07-12-site-redesign-v2-design.md` (READ IT FIRST — it is the spec; this plan implements it.)

## Global Constraints

- **Branch:** all work on `redesign/v2` branched from `main`. NEVER push `main` — pushing main deploys production. Push `redesign/v2` for a Vercel preview URL.
- **No em dashes** in any published copy (screenshots of product UI are exempt; `.astro` source copy is not).
- **Brand:** the product is always "HeatherAI", never "Heather". Heather Bauer is named only as the human expert.
- **Approved lines used verbatim:** one-liner "A real dietitian's 25-year method, in your pocket the moment you need it." · category "AI-powered, expert-guided nutrition coaching." · price "$39/mo" with "7-day free trial".
- **Results disclaimer** "Individual results vary. HeatherAI is nutrition coaching, not medical advice or treatment." must sit adjacent to any outcome quote/figure.
- **No marketing of:** AI + Human tier features, GLP-1 Companion, roadmap items, gamification language, internal implementation (model names etc.).
- **Node >= 22.12** (`package.json` engines). Plain `npm install` (no `--legacy-peer-deps` in this repo).
- Every page keeps/gains: unique `<title>`, meta description via `BaseLayout` props, canonical (automatic in BaseLayout).
- Analytics: preserve `data-track-event` attributes; every new CTA gets `cta_click` with a unique `cta_id`.

---

### Task 0: Branch + baseline build

**Files:** none modified.

- [ ] **Step 1:** `cd ~/projects/heather-ai-website && git checkout main && git pull && git checkout -b redesign/v2`
- [ ] **Step 2:** `npm install && npm run build`
  Expected: build succeeds, `dist/index.html` exists. This is the baseline; if it fails, stop and report.

### Task 1: Design tokens + shared CtaBlock

**Files:**
- Modify: `src/styles/global.css`
- Create: `src/components/CtaBlock.astro`

**Interfaces:**
- Produces: CSS token classes `bg-bg-raised`, `border-line`, usable in later tasks; `<CtaBlock ctaId="..." />` used by /method, /glp-1, about, index.

- [ ] **Step 1: Extend theme tokens.** In `src/styles/global.css`, replace the `@theme` block with:

```css
@theme {
  --color-bg-primary: #0a0a0a;
  --color-bg-surface: #111111;
  --color-bg-raised: #1a1a1a;
  --color-line: #262628;
  --color-accent: #E8734A;
  --color-accent-hover: #D4623C;
  --color-accent-glow: #FF8E5A;

  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
```

- [ ] **Step 2: Create `src/components/CtaBlock.astro`** (shared end-of-page CTA; App Store slot is present but hidden until iOS launch):

```astro
---
interface Props {
  headlineHtml?: string;
  ctaId: string;
}
const {
  headlineHtml = 'Meet the coach that <em class="not-italic text-accent">meets you in the moment.</em>',
  ctaId,
} = Astro.props;
---

<section class="py-28 px-6 md:px-12 border-t border-white/[0.06] text-center">
  <h2 class="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-8" set:html={headlineHtml}></h2>
  <div class="flex items-center justify-center gap-6 flex-wrap">
    <a
      href="/pricing"
      data-track-event="cta_click"
      data-track-params={JSON.stringify({ cta_id: ctaId, destination: '/pricing' })}
      class="inline-block px-10 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl text-base transition-all hover:-translate-y-0.5"
    >
      Try free for 7 days
    </a>
    <a href="/pricing" class="text-sm text-accent hover:underline">See pricing &rarr;</a>
  </div>
  <p class="text-[13px] text-white/30 mt-6">7 days free, then $39/mo. Cancel anytime. Or start free with meal logging.</p>
  <!-- Reserved: App Store badge slot. Un-hide at iOS launch. -->
  <div class="hidden mt-6" data-appstore-slot></div>
</section>
```

- [ ] **Step 3:** `npm run build` — Expected: PASS (component unused yet; build validates syntax via the page graph once imported later, so also run `npx astro check` if quick; otherwise proceed).
- [ ] **Step 4:** `git add -A && git commit -m "feat: theme tokens + shared CtaBlock"`

### Task 2: ChatMoment component (the workhorse)

**Files:**
- Create: `src/components/ChatMoment.astro`

**Interfaces:**
- Produces: `<ChatMoment messages={[{role:'user'|'ai', text:string}]} animate={boolean} label={string} />`. `text` supports plain text only (rendered as text, not HTML). When `animate` is true, bubbles reveal one-by-one when scrolled into view, with a typing indicator between AI turns; without JS or with reduced motion, all bubbles are visible statically. All message text is ALWAYS in the DOM (SEO requirement from spec).

- [ ] **Step 1: Create `src/components/ChatMoment.astro`:**

```astro
---
interface Message {
  role: 'user' | 'ai';
  text: string;
}
interface Props {
  messages: Message[];
  animate?: boolean;
  label?: string;
}
const { messages, animate = false, label = 'Example HeatherAI coaching conversation' } = Astro.props;
---

<div
  class:list={['chat-moment bg-bg-surface border border-white/[0.08] rounded-2xl p-4 md:p-5', animate && 'chat-animate']}
  role="log"
  aria-label={label}
>
  {messages.map((m) => (
    <div
      class:list={[
        'chat-bubble max-w-[85%] rounded-xl px-4 py-2.5 my-2 text-[14px] leading-relaxed',
        m.role === 'user' ? 'ml-auto bg-accent text-white' : 'mr-auto bg-bg-raised text-white/90',
      ]}
    >
      {m.text}
    </div>
  ))}
</div>

<style>
  /* Animation is opt-in and motion-safe. Bubbles are always present in the DOM;
     the reveal only toggles opacity/transform, so crawlers and no-JS render everything. */
  @media (prefers-reduced-motion: no-preference) {
    .chat-animate.js-armed .chat-bubble {
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    .chat-animate.js-armed .chat-bubble.shown {
      opacity: 1;
      transform: none;
    }
  }
</style>

<script>
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) {
    document.querySelectorAll<HTMLElement>('.chat-animate').forEach((panel) => {
      panel.classList.add('js-armed');
      const bubbles = Array.from(panel.querySelectorAll<HTMLElement>('.chat-bubble'));
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          bubbles.forEach((b, i) => setTimeout(() => b.classList.add('shown'), 500 + i * 900));
        },
        { threshold: 0.4 }
      );
      io.observe(panel);
    });
  }
</script>
```

- [ ] **Step 2:** `npm run build` — Expected: PASS.
- [ ] **Step 3:** `git add -A && git commit -m "feat: ChatMoment component (static-first animated chat panel)"`

### Task 3: Process iOS screenshots + book jackets

**Files:**
- Create: `scripts/process-images.mjs`
- Create (generated): `public/images/app/ios/{chat-plan,today,daily-plan,weight-chart,photo-log}.webp`, `public/images/books/{wall-street-diet,bread-is-the-devil}.webp`

**Interfaces:**
- Produces: the five webp screenshot paths above (828px wide, status bar cropped) and two book jacket webps (600px wide), referenced by Tasks 6, 7, 8.

Source screenshots (already on disk, gitignored-by-absence — do NOT commit the raw PNGs):
`docs/images/ios-inbox/qa/qa-5.png`→chat-plan, `qa-3.png`→today, `qa-2.png`→daily-plan, `qa-1.png`→weight-chart, `docs/images/ios-inbox/ios-5.png`→photo-log.

- [ ] **Step 1: Create `scripts/process-images.mjs`:**

```js
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SHOTS = [
  ['docs/images/ios-inbox/qa/qa-5.png', 'chat-plan'],
  ['docs/images/ios-inbox/qa/qa-3.png', 'today'],
  ['docs/images/ios-inbox/qa/qa-2.png', 'daily-plan'],
  ['docs/images/ios-inbox/qa/qa-1.png', 'weight-chart'],
  ['docs/images/ios-inbox/ios-5.png', 'photo-log'],
];
mkdirSync('public/images/app/ios', { recursive: true });
mkdirSync('public/images/books', { recursive: true });

for (const [src, name] of SHOTS) {
  const img = sharp(src);
  const { width, height } = await img.metadata();
  // Crop the iOS status bar (time/battery) — top ~190px at 3x scale.
  await img
    .extract({ left: 0, top: 190, width, height: height - 190 })
    .resize({ width: 828 })
    .webp({ quality: 82 })
    .toFile(`public/images/app/ios/${name}.webp`);
  console.log(`✓ ${name}.webp`);
}

const BOOKS = [
  ['wsd.jpeg', 'wall-street-diet'],
  ['bread.jpeg', 'bread-is-the-devil'],
];
for (const [src, name] of BOOKS) {
  await sharp(`docs/images/books-src/${src}`)
    .resize({ width: 600 })
    .webp({ quality: 85 })
    .toFile(`public/images/books/${name}.webp`);
  console.log(`✓ ${name}.webp`);
}
```

- [ ] **Step 2: Download the book jackets** (self-host per spec; source URLs from the design doc):

```bash
mkdir -p docs/images/books-src
curl -sL "https://images.squarespace-cdn.com/content/v1/61795eb4a68f4f574c52ff1d/1635366622974-XCKNFB4192R94Q0P8XU9/wsd.jpeg" -o docs/images/books-src/wsd.jpeg
curl -sL "https://images.squarespace-cdn.com/content/v1/61795eb4a68f4f574c52ff1d/1635366510630-8K9YYGIFLI89Y887HACB/bread+is+the+devil.jpeg" -o docs/images/books-src/bread.jpeg
file docs/images/books-src/*.jpeg
```

Expected: both files report `JPEG image data`.

- [ ] **Step 3:** `node scripts/process-images.mjs`
  Expected: seven `✓` lines. If `sharp` import fails, run `npm install --save-dev sharp` first (Astro bundles it transitively but pin it as a devDependency for the script).
- [ ] **Step 4: Verify outputs:** `ls -la public/images/app/ios/ public/images/books/` — five + two `.webp` files, each under 200KB.
- [ ] **Step 5:** Visually inspect one output (Read `public/images/app/ios/weight-chart.webp`): status bar gone, content intact.
- [ ] **Step 6:** Add `docs/images/ios-inbox/` and `docs/images/books-src/` to `.gitignore` (raw personal-account shots and un-optimized sources stay local). Commit:

```bash
git add .gitignore scripts/process-images.mjs public/images/app/ios public/images/books package.json package-lock.json
git commit -m "feat: processed iOS screenshots + self-hosted book jackets"
```

### Task 4: Homepage building blocks (ProofStrip, MomentBeat, new Hero)

**Files:**
- Create: `src/components/ProofStrip.astro`
- Create: `src/components/MomentBeat.astro`
- Modify: `src/components/Hero.astro` (full rewrite)

**Interfaces:**
- Consumes: `ChatMoment` (Task 2).
- Produces: `<ProofStrip />` (no props), `<MomentBeat line={string} accent={string} messages={Message[]} />` (line = plain-text lead, accent = the phrase inside it to accent-color; accent must be a substring of line), rewritten `<Hero />` (no props).

- [ ] **Step 1: Create `src/components/ProofStrip.astro`:**

```astro
<section class="py-16 px-6 md:px-12 border-t border-white/[0.06]">
  <div class="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
    <div><div class="text-3xl md:text-4xl font-extrabold">25</div><div class="text-[11px] uppercase tracking-[0.12em] text-white/40 mt-1">years in practice</div></div>
    <div><div class="text-3xl md:text-4xl font-extrabold">5,000+</div><div class="text-[11px] uppercase tracking-[0.12em] text-white/40 mt-1">clients coached</div></div>
    <div><div class="text-3xl md:text-4xl font-extrabold">~1M</div><div class="text-[11px] uppercase tracking-[0.12em] text-white/40 mt-1">texts answered</div></div>
  </div>
  <div class="flex justify-center flex-wrap gap-x-8 gap-y-2 mt-10 text-[13px] font-bold text-white/25">
    <span>GMA</span><span>TODAY</span><span>CNN</span><span>The View</span><span>The New York Times</span><span>WSJ</span><span>People</span>
  </div>
</section>
```

- [ ] **Step 2: Create `src/components/MomentBeat.astro`:**

```astro
---
import ChatMoment from './ChatMoment.astro';
interface Message { role: 'user' | 'ai'; text: string }
interface Props {
  line: string;
  accent: string;
  messages: Message[];
}
const { line, accent, messages } = Astro.props;
const [before, after] = line.split(accent);
---

<div class="grid md:grid-cols-2 gap-8 md:gap-14 items-center py-12">
  <p class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
    {before}<em class="not-italic text-accent">{accent}</em>{after}
  </p>
  <ChatMoment messages={messages} animate={true} />
</div>
```

- [ ] **Step 3: Rewrite `src/components/Hero.astro`** (replaces the PhoneCarousel hero entirely):

```astro
---
import ChatMoment from './ChatMoment.astro';

const heroChat = [
  { role: 'user' as const, text: 'Just sat down at a steakhouse. Client dinner. Help.' },
  { role: 'ai' as const, text: "You've got this. Shrimp cocktail to start, then the filet with broccolini instead of the potato. Order first so the table follows you." },
  { role: 'user' as const, text: "You're a genius. Done and done." },
];
---

<section class="min-h-screen flex items-center pt-24 pb-16 px-6 md:px-12">
  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
    <div>
      <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-5">
        AI-powered, expert-guided nutrition coaching
      </div>
      <h1 class="text-[44px] md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-8">
        A real dietitian's 25-year method,
        <em class="not-italic text-accent">in your pocket the moment you need it.</em>
      </h1>
      <div class="flex items-center gap-6 flex-wrap">
        <a
          href="/pricing"
          data-track-event="cta_click"
          data-track-params='{"cta_id":"home_hero_cta","destination":"/pricing"}'
          class="inline-block px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
        >
          Try free for 7 days
        </a>
        <a href="/method" class="text-sm text-white/70 hover:text-white transition-colors">How it works &rarr;</a>
      </div>
      <p class="text-[13px] text-white/30 mt-5">
        7 days free, then $39/mo. Cancel anytime. Or start free with meal logging.
      </p>
    </div>
    <ChatMoment messages={heroChat} animate={true} label="HeatherAI answering a live restaurant question" />
  </div>
</section>
```

- [ ] **Step 4:** `npm run build` — Expected: PASS.
- [ ] **Step 5:** `git add -A && git commit -m "feat: ProofStrip, MomentBeat, conversation-first Hero"`

### Task 5: Assemble the new homepage

**Files:**
- Modify: `src/pages/index.astro` (full rewrite)

**Interfaces:**
- Consumes: `Hero`, `ProofStrip`, `MomentBeat`, `ChatMoment`, `CtaBlock`.

- [ ] **Step 1: Rewrite `src/pages/index.astro`:**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import ProofStrip from '../components/ProofStrip.astro';
import MomentBeat from '../components/MomentBeat.astro';
import CtaBlock from '../components/CtaBlock.astro';

const softwareApplicationLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'HeatherAI',
  applicationCategory: 'HealthApplication',
  applicationSubCategory: 'Nutrition coaching',
  operatingSystem: 'Web',
  description:
    "AI-powered, expert-guided nutrition coaching built on the 25-year clinical method of Heather Bauer, RD. Meal planning, photo meal logging, and coaching that answers in the moment.",
  url: 'https://getheatherai.com',
  image: 'https://getheatherai.com/images/heather-bauer.webp',
  provider: { '@type': 'Organization', name: 'Many Brains, Inc.', url: 'https://getheatherai.com' },
  offers: [
    { '@type': 'Offer', name: 'Meal Logging', price: '0', priceCurrency: 'USD',
      description: 'Free meal logging: photo and text logging, macro estimates, weight and water tracking, full history.' },
    { '@type': 'Offer', name: 'AI Coaching', price: '39', priceCurrency: 'USD',
      description: 'Full AI nutrition coaching: intake interview, personal Blueprint protocol, 72-hour meal plan, photo logging, trends, proactive check-ins, weekly videos. 7-day free trial.',
      priceSpecification: { '@type': 'UnitPriceSpecification', price: '39', priceCurrency: 'USD', billingDuration: 'P1M' } },
  ],
};
---

<BaseLayout title="HeatherAI | AI-Powered, Expert-Guided Nutrition Coaching">
  <script slot="head" type="application/ld+json" set:html={JSON.stringify(softwareApplicationLd)}></script>

  <Hero />
  <ProofStrip />

  <!-- Moments -->
  <section class="py-24 px-6 md:px-12 border-t border-white/[0.06]">
    <div class="max-w-6xl mx-auto">
      <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-3">Real moments</div>
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        Diets fail at specific moments. <em class="not-italic text-accent">Coaching should show up there.</em>
      </h2>

      <MomentBeat
        line="It's 7:40pm and the menu looks dangerous."
        accent="looks dangerous."
        messages={[
          { role: 'user', text: 'At an Italian place, menu is huge. What am I ordering?' },
          { role: 'ai', text: "Get the branzino. Double vegetables, dressing on the side. Decided before the waiter is back." },
        ]}
      />
      <MomentBeat
        line="The scale jumped two pounds overnight."
        accent="two pounds"
        messages={[
          { role: 'user', text: 'Scale says 172. Yesterday it was 170. I want to quit.' },
          { role: 'ai', text: "That's water, not fat. Sushi and popcorn last night means sodium; watch it drop by Thursday. Nothing is wrong." },
        ]}
      />
      <MomentBeat
        line="Saturday got away from you."
        accent="got away"
        messages={[
          { role: 'user', text: 'Blew the whole weekend. Pizza, cake, all of it.' },
          { role: 'ai', text: 'No lecture. Reset starts with your next meal, not next week. Want a Protein Day for tomorrow?' },
        ]}
      />

      <a href="/scenarios" class="inline-block text-sm text-accent hover:underline mt-2">See more moments &rarr;</a>
    </div>
  </section>

  <!-- Method teaser -->
  <section class="py-24 px-6 md:px-12 border-t border-white/[0.06]">
    <div class="max-w-4xl mx-auto text-center">
      <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-3">The method</div>
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        Structure does the work, <em class="not-italic text-accent">not willpower.</em>
      </h2>
      <p class="text-white/50 mb-8">
        No streaks. No badges. No macro math. A day with a shape, built by a dietitian who proved it for 25 years.
      </p>
      <div class="flex flex-wrap justify-center gap-3 mb-8">
        {['Protein at every meal', 'Finite foods', 'Kitchen closed', 'One-day resets', 'Goal ranges'].map((t) => (
          <span class="border border-white/[0.12] bg-bg-surface rounded-full px-5 py-2 text-sm text-white/80">{t}</span>
        ))}
      </div>
      <a href="/method" class="text-sm text-accent hover:underline">Explore the method &rarr;</a>
    </div>
  </section>

  <!-- Member voice -->
  <section class="py-24 px-6 md:px-12 border-t border-white/[0.06] text-center">
    <blockquote class="max-w-2xl mx-auto text-xl md:text-2xl text-white/85 italic leading-relaxed">
      "This is why this app is so fantastic. I'm asking in real time where I might have before just eaten it and said screw it."
    </blockquote>
    <p class="text-[12px] text-white/35 mt-5">
      Founding member &middot; Individual results vary. HeatherAI is nutrition coaching, not medical advice or treatment.
    </p>
  </section>

  <CtaBlock ctaId="home_bottom_cta" />
</BaseLayout>
```

- [ ] **Step 2:** `npm run build` — Expected: PASS.
- [ ] **Step 3: Verify SEO-critical static text** (chat content must be in HTML):

```bash
grep -o "Reset starts with your next meal" dist/index.html
grep -o "in your pocket the moment you need it" dist/index.html
grep -c "application/ld+json" dist/index.html   # expect 2 (Organization + SoftwareApplication)
```

- [ ] **Step 4: Word-count sanity:** `npx --yes html-to-text --ignore-href < dist/index.html | wc -w` — Expected: under ~550 (nav/footer included; body target ~380). If wildly over, copy crept in; trim to spec.
- [ ] **Step 5:** `git add -A && git commit -m "feat: rebuild homepage as Concept A (~380 words, conversation-first)"`

### Task 6: /method page

**Files:**
- Create: `src/pages/method.astro`

**Interfaces:**
- Consumes: `ChatMoment`, `CtaBlock`, screenshots `public/images/app/ios/{daily-plan,today,weight-chart,chat-plan}.webp`.

- [ ] **Step 1: Create `src/pages/method.astro`.** Structure per spec section "/method spec" — hero, evidence, philosophy accordions (native `<details>`), 8 technique cards, how-you-get-it steps with screenshots, oversight, CtaBlock:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CtaBlock from '../components/CtaBlock.astro';

const techniques = [
  ['Protein at every meal', 'The single most protective lever. A real breakfast and a real lunch prevent the 9pm unraveling.'],
  ['Finite foods', 'Choose foods with a natural stopping point. One portioned yogurt, never the open bag.'],
  ['Kitchen closed', 'A defined end to the eating day. After dinner, the kitchen is done.'],
  ['The turkey test', "Late-night craving check: if plain turkey slices don't sound good, it's habit, not hunger."],
  ['Liter by Lunch', 'A liter of water before lunch, every day.'],
  ['Goal ranges', 'A target range instead of one number, because bodies fluctuate and single numbers manufacture failure.'],
  ['One-day resets', 'On-demand recovery days: ask for a Protein Day and get one instantly. A reset, never a punishment.'],
  ['Kitchen vs. quality control', 'Food moves the scale. Exercise protects the muscle so the weight you lose is the right weight.'],
];

const steps = [
  ['A real intake interview', 'It starts like a first appointment, not an app install. One question at a time: what brings you here, when is eating hardest, which foods can you not live without. Nothing is prescribed until the interview is done.', null],
  ['Your Blueprint', 'A personal clinical protocol, not a settings page. Layered by goal, GLP-1 status, life stage, and medical conditions, and reconciled into one coherent plan. Not three toggles: one stacked protocol.', '/images/app/ios/daily-plan.webp'],
  ['The 72-Hour Reality Plan', 'A rolling three-day meal plan built around your actual life, because real life changes faster than meal plan PDFs. Swap a dinner, plan around a restaurant, rebuild after travel.', '/images/app/ios/today.webp'],
  ['Logging without the misery', "Snap the plate and it's logged. No search, no fields, no barcode. Or just say what you ate, even days later.", null],
  ['Coaching that remembers you', 'Your patterns, your travel week, what you said three weeks ago. It never re-asks, never resets, and connects today to your history.', '/images/app/ios/chat-plan.webp'],
  ['Progress against a range', 'Weight, water, and movement log in seconds and flow into the coaching, plotted against your goal range, never a single make-or-break number.', '/images/app/ios/weight-chart.webp'],
];
---

<BaseLayout
  title="The Method | HeatherAI"
  description="The 25-year clinical method behind HeatherAI: structure over willpower, protein anchors, finite foods, one-day resets, and the three behaviors research links to lasting weight loss."
>
  <!-- Hero -->
  <section class="pt-40 pb-16 px-6 md:px-12 text-center">
    <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-4">The Method</div>
    <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight mb-5">
      A method, <em class="not-italic text-accent">not an app.</em>
    </h1>
    <p class="text-lg text-white/50 max-w-xl mx-auto">
      Built in 25 years of practice. Proven one client at a time, about 5,000 times.
    </p>
  </section>

  <!-- Evidence -->
  <section class="py-20 px-6 md:px-12 border-t border-white/[0.06]">
    <div class="max-w-5xl mx-auto">
      <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-3">Why it works</div>
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-10">
        Three behaviors. <em class="not-italic text-accent">Decades of evidence.</em>
      </h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-bg-surface border border-white/[0.08] rounded-2xl p-7">
          <h3 class="font-bold mb-2">Log it</h3>
          <p class="text-sm text-white/50 leading-relaxed">In a landmark 1,700-person study, people who kept daily food logs lost twice as much weight as those who kept none.<sup>1</sup></p>
        </div>
        <div class="bg-bg-surface border border-white/[0.08] rounded-2xl p-7">
          <h3 class="font-bold mb-2">Plan it</h3>
          <p class="text-sm text-white/50 leading-relaxed">Planning ahead beats deciding hungry. Heather's reverse journal applied this decades before the apps did.</p>
        </div>
        <div class="bg-bg-surface border border-white/[0.08] rounded-2xl p-7">
          <h3 class="font-bold mb-2">Keep a coach</h3>
          <p class="text-sm text-white/50 leading-relaxed">Ongoing coaching contact is one of the best-documented predictors of keeping weight off. Regain starts when the coaching stops.<sup>2</sup> This coach never does.</p>
        </div>
      </div>
      <p class="text-[11px] text-white/25 mt-6">
        1. Kaiser Permanente study, American Journal of Preventive Medicine, 2008. 2. Meta-analysis of 11 randomized trials, Obesity Reviews, 2012. Individual results vary. HeatherAI is nutrition coaching, not medical advice or treatment.
      </p>
    </div>
  </section>

  <!-- Philosophy -->
  <section class="py-20 px-6 md:px-12 border-t border-white/[0.06]">
    <div class="max-w-3xl mx-auto">
      <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-3">The philosophy</div>
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-8">
        Structure does the work, <em class="not-italic text-accent">not willpower.</em>
      </h2>
      <details class="group border-b border-white/[0.08] py-4">
        <summary class="cursor-pointer font-semibold list-none flex justify-between items-center">Food first, numbers second <span class="text-accent group-open:rotate-45 transition-transform">+</span></summary>
        <p class="text-sm text-white/50 pt-3 leading-relaxed">This is not a macro-tracking program. The numbers exist for anyone who wants them, but they never lead. When the structure of the day is right, the willpower question mostly disappears.</p>
      </details>
      <details class="group border-b border-white/[0.08] py-4">
        <summary class="cursor-pointer font-semibold list-none flex justify-between items-center">Goal ranges, not a magic number <span class="text-accent group-open:rotate-45 transition-transform">+</span></summary>
        <p class="text-sm text-white/50 pt-3 leading-relaxed">Members work toward ranges, because bodies fluctuate and single numbers manufacture failure. You hit a first goal range and build from there.</p>
      </details>
      <details class="group border-b border-white/[0.08] py-4">
        <summary class="cursor-pointer font-semibold list-none flex justify-between items-center">Recovery is the skill <span class="text-accent group-open:rotate-45 transition-transform">+</span></summary>
        <p class="text-sm text-white/50 pt-3 leading-relaxed">Everyone slips. A blown day is a data point, not a verdict, and the answer is always a next action: reset starts with your next meal, not next week.</p>
      </details>
      <details class="group border-b border-white/[0.08] py-4">
        <summary class="cursor-pointer font-semibold list-none flex justify-between items-center">If you bite it, write it <span class="text-accent group-open:rotate-45 transition-transform">+</span></summary>
        <p class="text-sm text-white/50 pt-3 leading-relaxed">Logging is the habit everything else hangs on, so it has to be effortless. Snap a photo, or just say what you ate.</p>
      </details>
    </div>
  </section>

  <!-- Techniques -->
  <section class="py-20 px-6 md:px-12 border-t border-white/[0.06]">
    <div class="max-w-5xl mx-auto">
      <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-3">Signature techniques</div>
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-10">
        Named. Learnable. <em class="not-italic text-accent">Yours in week one.</em>
      </h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {techniques.map(([name, desc]) => (
          <div class="bg-bg-surface border border-white/[0.08] rounded-2xl p-6">
            <h3 class="font-bold text-[15px] mb-2">{name}</h3>
            <p class="text-[13px] text-white/50 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- How you get it -->
  <section class="py-20 px-6 md:px-12 border-t border-white/[0.06]">
    <div class="max-w-5xl mx-auto">
      <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-3">How you get it</div>
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-12">
        From first interview <em class="not-italic text-accent">to every meal.</em>
      </h2>
      <div class="space-y-16">
        {steps.map(([title, desc, img], i) => (
          <div class="grid md:grid-cols-2 gap-10 items-center">
            <div class:list={[i % 2 === 1 && img ? 'md:order-2' : '']}>
              <h3 class="text-xl font-bold mb-3">{title}</h3>
              <p class="text-white/50 leading-relaxed">{desc}</p>
            </div>
            {img && (
              <div class:list={['flex justify-center', i % 2 === 1 ? 'md:order-1' : '']}>
                <img
                  src={img}
                  alt={`HeatherAI app: ${title}`}
                  width="280"
                  loading="lazy"
                  class="rounded-[2rem] border-4 border-white/[0.08] shadow-2xl shadow-accent/10 max-w-[280px] w-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- Oversight -->
  <section class="py-20 px-6 md:px-12 border-t border-white/[0.06]">
    <div class="max-w-3xl mx-auto text-center">
      <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-3">Behind it all</div>
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-5">
        Expert oversight <em class="not-italic text-accent">built in, not bolted on.</em>
      </h2>
      <p class="text-white/50 leading-relaxed max-w-2xl mx-auto">
        Heather Bauer, RD reviews real coaching sessions and tunes how HeatherAI coaches. If a member reports concerning symptoms, the case is flagged for her clinical review immediately. The coaching stays in its lane: nutrition, never medical advice.
      </p>
    </div>
  </section>

  <CtaBlock ctaId="method_bottom_cta" />
</BaseLayout>
```

- [ ] **Step 2:** `npm run build && grep -o "A method, not an app" dist/method/index.html | head -1` — Expected: build PASS, grep match.
- [ ] **Step 3:** `git add -A && git commit -m "feat: /method depth page"`

### Task 7: /glp-1 page

**Files:**
- Create: `src/pages/glp-1.astro`

**Interfaces:**
- Consumes: `ChatMoment`, `CtaBlock`.

- [ ] **Step 1: Create `src/pages/glp-1.astro`:**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ChatMoment from '../components/ChatMoment.astro';
import CtaBlock from '../components/CtaBlock.astro';

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Will HeatherAI tell me to stop my GLP-1 medication?',
      acceptedAnswer: { '@type': 'Answer', text: 'Never. HeatherAI coaches through the medication and never gives medical advice about it. Medication decisions stay between you and your prescriber.' },
    },
    {
      '@type': 'Question',
      name: 'Does HeatherAI prescribe or recommend GLP-1s?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. HeatherAI never sells, prescribes, or recommends GLP-1 medications. It provides nutrition coaching for people who are on them, and the same method works without them.' },
    },
    {
      '@type': 'Question',
      name: 'What happens when I stop the medication?',
      acceptedAnswer: { '@type': 'Answer', text: "That is exactly what the coaching prepares you for. The method worked for 25 years before GLP-1s existed: structure, protein anchors, planning, and logging habits that outlast the prescription." },
    },
  ],
};
---

<BaseLayout
  title="GLP-1 Nutrition Coaching | HeatherAI"
  description="Nutrition coaching built for GLP-1 medications: protein-first meals, muscle protection, side-effect-aware hydration, and an off-ramp plan, from a real dietitian's 25-year method. We never sell or recommend GLP-1s."
>
  <script slot="head" type="application/ld+json" set:html={JSON.stringify(faqLd)}></script>

  <!-- Hero -->
  <section class="pt-40 pb-16 px-6 md:px-12 text-center">
    <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-4">On a GLP-1?</div>
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto">
      The medication quiets appetite. <em class="not-italic text-accent">It doesn't teach you how to eat.</em>
    </h1>
    <p class="text-lg text-white/50 max-w-2xl mx-auto mb-8">
      Coaching built for the medication, from a dietitian who coaches through it every day. We never sell or recommend GLP-1s. We make them work better.
    </p>
    <a
      href="/pricing"
      data-track-event="cta_click"
      data-track-params='{"cta_id":"glp1_hero_cta","destination":"/pricing"}'
      class="inline-block px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
    >
      Try free for 7 days
    </a>
  </section>

  <!-- What changes -->
  <section class="py-20 px-6 md:px-12 border-t border-white/[0.06]">
    <div class="max-w-5xl mx-auto">
      <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-8">What changes on the medication</div>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-bg-surface border border-white/[0.08] rounded-2xl p-7">
          <h3 class="font-bold mb-2">Protein first</h3>
          <p class="text-sm text-white/50 leading-relaxed">A smaller appetite means every bite counts for more. Meals get smaller and protein-forward, and muscle is protected on purpose.</p>
        </div>
        <div class="bg-bg-surface border border-white/[0.08] rounded-2xl p-7">
          <h3 class="font-bold mb-2">Side effects, handled</h3>
          <p class="text-sm text-white/50 leading-relaxed">Liter by Lunch, aimed straight at the hard parts: nausea, constipation, and fatigue respond to front-loaded hydration.</p>
        </div>
        <div class="bg-bg-surface border border-white/[0.08] rounded-2xl p-7">
          <h3 class="font-bold mb-2">The off-ramp</h3>
          <p class="text-sm text-white/50 leading-relaxed">The method worked for 25 years before GLP-1s existed. The habits you build now are the reason the loss survives the prescription.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- What coaching looks like -->
  <section class="py-20 px-6 md:px-12 border-t border-white/[0.06]">
    <div class="max-w-2xl mx-auto">
      <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-3">What coaching looks like</div>
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-8">
        In its lane, <em class="not-italic text-accent">on purpose.</em>
      </h2>
      <ChatMoment
        animate={true}
        label="HeatherAI coaching a member through a GLP-1 dose change"
        messages={[
          { role: 'user', text: 'Moved up to 5mg yesterday. Barely hungry and kind of queasy.' },
          { role: 'ai', text: "I can't give medical advice, but nutrition-wise we'll keep it simple and gentle. Small, protein-first meals today. And get your water in early: Liter by Lunch helps with exactly this." },
        ]}
      />
      <p class="text-[12px] text-white/30 mt-4">Language from a real coaching exchange. If a member reports concerning symptoms, the case is flagged for Heather Bauer's clinical review immediately.</p>
    </div>
  </section>

  <!-- Proof (generic quote until GLP-1-specific consent lands; see design doc) -->
  <section class="py-20 px-6 md:px-12 border-t border-white/[0.06] text-center">
    <blockquote class="max-w-2xl mx-auto text-xl md:text-2xl text-white/85 italic leading-relaxed">
      "This is really working for me having instant feedback. And knowing I can plan for treats."
    </blockquote>
    <p class="text-[12px] text-white/35 mt-5">
      Founding member &middot; Individual results vary. HeatherAI is nutrition coaching, not medical advice or treatment.
    </p>
  </section>

  <!-- Straight answers -->
  <section class="py-20 px-6 md:px-12 border-t border-white/[0.06]">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold tracking-tight mb-8">Straight answers</h2>
      <div class="space-y-6">
        <div>
          <h3 class="font-semibold mb-1">Will you tell me to stop my medication?</h3>
          <p class="text-sm text-white/50">Never. Medication decisions stay between you and your prescriber.</p>
        </div>
        <div>
          <h3 class="font-semibold mb-1">Do you prescribe or recommend GLP-1s?</h3>
          <p class="text-sm text-white/50">No. We coach through them. The same method works without them.</p>
        </div>
        <div>
          <h3 class="font-semibold mb-1">What happens when I stop?</h3>
          <p class="text-sm text-white/50">That's exactly what we prepare you for. The habits are the point; the prescription is temporary.</p>
        </div>
      </div>
    </div>
  </section>

  <CtaBlock ctaId="glp1_bottom_cta" />
</BaseLayout>
```

- [ ] **Step 2:** `npm run build && grep -c "FAQPage" dist/glp-1/index.html` — Expected: build PASS, count ≥ 1.
- [ ] **Step 3:** `git add -A && git commit -m "feat: /glp-1 persona landing page"`

### Task 8: Nav + Footer restructure

**Files:**
- Modify: `src/components/Nav.astro`
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Nav links.** In `src/components/Nav.astro`, replace the four desktop link blocks (About/Intelligence/Scenarios/Pricing) with Method/GLP-1/About/Pricing, same classes and active-state pattern. Desktop block becomes (Get Started button unchanged):

```astro
<a href="/method" class:list={["text-[13px] transition-colors", currentPath === '/method/' || currentPath === '/method' ? 'text-white' : 'text-white/55 hover:text-white']}>Method</a>
<a href="/glp-1" class:list={["text-[13px] transition-colors", currentPath === '/glp-1/' || currentPath === '/glp-1' ? 'text-white' : 'text-white/55 hover:text-white']}>GLP-1</a>
<a href="/about" class:list={["text-[13px] transition-colors", currentPath === '/about/' || currentPath === '/about' ? 'text-white' : 'text-white/55 hover:text-white']}>About</a>
<a href="/pricing" class:list={["text-[13px] transition-colors", currentPath === '/pricing/' || currentPath === '/pricing' ? 'text-white' : 'text-white/55 hover:text-white']}>Pricing</a>
```

Mirror the same four links in the mobile dropdown (replace the existing four `<a>` tags there, keeping the `pt-4` on the first).

- [ ] **Step 2: Footer links.** In `src/components/Footer.astro`, replace the link row with (adds Method, GLP-1, Scenarios; keeps Intelligence per spec "footer-only"):

```astro
<a href="/method" class="hover:text-white/50 transition-colors">Method</a>
<span>&middot;</span>
<a href="/glp-1" class="hover:text-white/50 transition-colors">GLP-1</a>
<span>&middot;</span>
<a href="/about" class="hover:text-white/50 transition-colors">About</a>
<span>&middot;</span>
<a href="/scenarios" class="hover:text-white/50 transition-colors">Scenarios</a>
<span>&middot;</span>
<a href="/intelligence" class="hover:text-white/50 transition-colors">Intelligence</a>
<span>&middot;</span>
<a href="/pricing" class="hover:text-white/50 transition-colors">Pricing</a>
<span>&middot;</span>
<a href="/contact" class="hover:text-white/50 transition-colors">Contact</a>
<span>&middot;</span>
<a href="/responsible-ai" class="hover:text-white/50 transition-colors">Responsible AI</a>
<span>&middot;</span>
<a href="/privacy" class="hover:text-white/50 transition-colors">Privacy</a>
<span>&middot;</span>
<a href="/terms" class="hover:text-white/50 transition-colors">Terms</a>
```

- [ ] **Step 3:** `npm run build && grep -o 'href="/glp-1"' dist/index.html | wc -l` — Expected: ≥ 2 (nav + footer).
- [ ] **Step 4:** `git add -A && git commit -m "feat: nav (Method/GLP-1) + footer restructure"`

### Task 9: /about rework (trim + books block)

**Files:**
- Modify: `src/pages/about.astro`

**Interfaces:**
- Consumes: `public/images/books/{wall-street-diet,bread-is-the-devil}.webp` (Task 3), `CtaBlock`.

- [ ] **Step 1: Trim copy to ~500 words.** Read the current `src/pages/about.astro` first. Keep: H1 "The coach behind the code.", the Heather photo block, the named testimonials grid, press list. Delete: the "$950–$3,750" pricing sentence wherever it appears. Replace the story section's paragraphs with exactly these three (this absorbs the old homepage AlwaysOn narrative and keeps the single legacy-price framing):

```
For 25 years, Heather Bauer ran one of New York's most sought-after private nutrition practices: around 5,000 clients, roughly 30,000 appointments, and by her own count about a million text messages. Her method never lived in the appointment. It lived in the moments between: the client in front of a menu, the 3pm vending machine pull, the morning the scale jumped and panic set in. She answered those texts. That is why her clients succeeded.

It is also why her practice could never grow. Her product was her attention, and there is only so much of it. Her concierge 1:1 practice runs $1,500+ per month, which puts her out of reach of almost everyone who needs her.

HeatherAI exists to break that constraint. Not by replacing Heather Bauer, but by packaging what she knows, how she coaches, and when she pushes versus when she comforts, and making it available to everyone, instantly, at a price regular people can afford.
```

Replace the page-bottom CTA section with `<CtaBlock ctaId="about_bottom_cta" />`. Also sweep the remaining about copy: any sentence marketing the AI + Human tier as a feature gets reduced to at most "A dedicated human-coach tier is waitlist-only." or deleted.

- [ ] **Step 2: Add the books block** after the story section:

```astro
<section class="py-20 px-6 md:px-12 border-t border-white/[0.06]">
  <div class="max-w-4xl mx-auto">
    <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-8">The books</div>
    <div class="grid sm:grid-cols-2 gap-10">
      <a href="https://www.amazon.com/Wall-Street-Diet-Surprisingly-Effortless/dp/1401309194" target="_blank" rel="noopener" class="flex gap-6 items-start group">
        <img src="/images/books/wall-street-diet.webp" alt="The Wall Street Diet book cover" width="120" loading="lazy" class="rounded-lg shadow-xl shrink-0 group-hover:-translate-y-1 transition-transform" />
        <div>
          <h3 class="font-bold group-hover:text-accent transition-colors">The Wall Street Diet</h3>
          <p class="text-sm text-white/50 mt-2 leading-relaxed">The method for busy professionals: lose the weight and keep up with a life that never slows down.</p>
        </div>
      </a>
      <a href="https://www.amazon.com/Bread-Devil-Weight-Loss-Sabotage/dp/1250004195" target="_blank" rel="noopener" class="flex gap-6 items-start group">
        <img src="/images/books/bread-is-the-devil.webp" alt="Bread Is the Devil book cover" width="120" loading="lazy" class="rounded-lg shadow-xl shrink-0 group-hover:-translate-y-1 transition-transform" />
        <div>
          <h3 class="font-bold group-hover:text-accent transition-colors">Bread Is the Devil</h3>
          <p class="text-sm text-white/50 mt-2 leading-relaxed">The diet-saboteur habits book: why we know what to eat and do the opposite, and how to stop.</p>
        </div>
      </a>
    </div>
  </div>
</section>
```

Verify the Amazon URLs resolve before shipping (`curl -s -o /dev/null -w "%{http_code}" <url>` — expect 200 or 301; if dead, link to `https://www.amazon.com/s?k=<title>+heather+bauer` instead).

- [ ] **Step 3: Extend the Person JSON-LD** in the about frontmatter: find the existing `Person` schema object and add:

```js
subjectOf: [
  { '@type': 'Book', name: 'The Wall Street Diet', author: { '@type': 'Person', name: 'Heather Bauer' }, datePublished: '2008' },
  { '@type': 'Book', name: 'Bread Is the Devil', author: { '@type': 'Person', name: 'Heather Bauer' }, datePublished: '2012' },
],
```

- [ ] **Step 4:** `npm run build`, then:

```bash
grep -c "wall-street-diet.webp" dist/about/index.html      # expect 1
grep -c "950" dist/about/index.html                         # expect 0 (old price range gone)
npx --yes html-to-text --ignore-href < dist/about/index.html | wc -w   # target ≤ ~700 incl. nav/footer
```

- [ ] **Step 5:** `git add -A && git commit -m "feat: about rework (trim, books block, single price framing)"`

### Task 10: Pricing links + Responsible AI compliance line

**Files:**
- Modify: `src/pages/pricing.astro`
- Modify: `src/pages/responsible-ai.astro`

- [ ] **Step 1: Pricing FAQ cross-links.** Read `src/pages/pricing.astro`. In the FAQ item answering "Is this just another tracker?" (or nearest equivalent, e.g. the ChatGPT-difference item), append to the answer text:

```
Read about the method behind the coaching at <a href="/method" class="text-accent hover:underline">/method</a>.
```

In the GLP-1 FAQ item, append:

```
More at <a href="/glp-1" class="text-accent hover:underline">GLP-1 coaching</a>.
```

(Adjust to the file's existing answer format — if answers are plain strings in frontmatter, add `set:html` handling consistent with how FaqItem renders; read FaqItem.astro first and follow its pattern.)

- [ ] **Step 2: Soften the compliance claim.** In `src/pages/responsible-ai.astro`, find the sentence containing "pursuing HIPAA compliance and FDA SaMD designation" and replace that sentence with:

```
We hold ourselves to clinical-grade standards for privacy and safety: encryption in transit and at rest, de-identification of coaching material, expert review of real sessions, and immediate escalation of medical concerns to a registered dietitian.
```

- [ ] **Step 3: AI + Human tier sweep (spec content fix #3).** Check `src/pages/intelligence.astro` and `src/pages/responsible-ai.astro` for body copy that markets the AI + Human tier as a live feature (e.g. "gives you that too"). Reduce each mention to waitlist framing ("A dedicated human-coach tier is waitlist-only.") or delete the sentence. The pricing page's waitlist card is already correct; leave it.
- [ ] **Step 4:** `npm run build && grep -c "SaMD" dist/responsible-ai/index.html` — Expected: 0.
- [ ] **Step 5:** `git add -A && git commit -m "fix: pricing cross-links, responsible-ai claim softening, AI+Human waitlist framing"`

### Task 11: llms.txt rewrite + SEO acceptance sweep

**Files:**
- Modify: `public/llms.txt`

- [ ] **Step 1: Rewrite `public/llms.txt`** (fixes stale $29 price, adds new pages):

```
# HeatherAI

> AI-powered, expert-guided nutrition coaching built on the 25-year clinical method of registered dietitian Heather Bauer. A real intake interview, a personalized clinical protocol (the Blueprint), a rolling 72-hour meal plan, photo meal logging, and coaching that answers in the moment, with Heather Bauer's human oversight built in. Not a calorie counter: no streaks, badges, or macro-first scoreboards.

HeatherAI is operated by Many Brains, Inc. (Westport, CT). The methodology is the work of Heather Bauer, RD: 25 years in practice, 5,000+ clients, author of "The Wall Street Diet" (2008) and "Bread Is the Devil" (2012), national press regular (GMA, Today, CNN, The View, NYT, WSJ, People).

## Core pages
- [Homepage](https://getheatherai.com/): What HeatherAI is: a real dietitian's 25-year method, in your pocket the moment you need it.
- [The Method](https://getheatherai.com/method): The philosophy (structure over willpower, food first), the eight signature techniques, and the evidence behind logging, planning, and coaching.
- [GLP-1 Coaching](https://getheatherai.com/glp-1): Nutrition coaching built for GLP-1 medications: protein-first, side-effect-aware, with an off-ramp plan. HeatherAI never sells or recommends GLP-1s.
- [About Heather Bauer](https://getheatherai.com/about): Founder profile, credentials, books, and the story behind HeatherAI.
- [Scenarios](https://getheatherai.com/scenarios): Concrete in-the-moment coaching examples: restaurants, scale panic, late-night cravings, travel.
- [Pricing](https://getheatherai.com/pricing): Free meal logging tier; AI Coaching $39/month with a 7-day free trial.

## Deeper material
- [Intelligence](https://getheatherai.com/intelligence): How the coaching intelligence was built: pattern library and research context.
- [Responsible AI](https://getheatherai.com/responsible-ai): Domain-scoped AI, medical safety boundaries, expert-in-the-loop review, de-identification.
- [Privacy Policy](https://getheatherai.com/privacy) · [Terms of Service](https://getheatherai.com/terms)

## Contact
- [Contact](https://getheatherai.com/contact): General inquiries, press, partnerships, support.
- Email: support@heatherbauer.com
```

- [ ] **Step 2: SEO acceptance sweep** (spec's acceptance list):

```bash
npm run build
grep -o "glp-1" dist/sitemap-0.xml | head -1          # new pages in sitemap
grep -o "method" dist/sitemap-0.xml | head -1
for f in dist/index.html dist/method/index.html dist/glp-1/index.html dist/about/index.html dist/pricing/index.html; do
  grep -c 'name="description"' $f
done                                                   # expect 1 per page
node -e '
const fs = require("fs");
for (const f of ["dist/index.html","dist/glp-1/index.html","dist/about/index.html","dist/pricing/index.html"]) {
  const html = fs.readFileSync(f, "utf8");
  const blocks = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/gs) || [];
  blocks.forEach((b) => JSON.parse(b.replace(/<\/?script[^>]*>/g, "")));
  console.log(f, blocks.length, "JSON-LD blocks valid");
}'
```

Expected: sitemap contains both new URLs, every page has one meta description, every JSON-LD block parses.

- [ ] **Step 3:** `git add -A && git commit -m "feat: llms.txt rewrite for new IA (fixes stale pricing)"`

### Task 12: Guardrail QA + preview handoff

**Files:** none new; fixes only.

- [ ] **Step 1: Em-dash sweep over new/modified copy:**

```bash
grep -rn "—" src/pages/index.astro src/pages/method.astro src/pages/glp-1.astro src/pages/about.astro src/components/{Hero,ProofStrip,MomentBeat,ChatMoment,CtaBlock}.astro public/llms.txt || echo CLEAN
```

Expected: `CLEAN`. Fix any hits (rewrite the sentence; do not substitute a hyphen mid-sentence).

- [ ] **Step 2: Brand sweep:** `grep -rn "with Heather\b\|from Heather\b" src/pages/{index,method,glp-1}.astro | grep -v "Heather Bauer\|HeatherAI" || echo CLEAN` — the product must never be bare "Heather". Expected: `CLEAN`.
- [ ] **Step 3: Stale-content sweep:** `grep -rn "22 Paying\|Week 5\|0 Cancellations\|\$29\|\$950" src/ public/llms.txt || echo CLEAN` — Expected: `CLEAN` (BetaResults.astro may still contain these if the file survives unused; if it is no longer imported anywhere, `git rm src/components/BetaResults.astro` along with other now-unused homepage components: `Stats.astro`, `Features.astro`, `DataStory.astro`, `AlwaysOn.astro`, `NeutralityCallout.astro`, `Showcase.astro`, `PhoneCarousel.astro`, `Scenarios.astro` — CHECK each with `grep -rn "ComponentName" src/pages src/components` first; `Scenarios.astro` in particular may be used by `scenarios.astro` page — if a component is still imported anywhere, keep it).
- [ ] **Step 4: Reduced-motion + no-JS check:** `npm run preview`, open the local URL; in devtools emulate `prefers-reduced-motion: reduce` → hero chat bubbles all visible immediately; disable JS → all chat text visible.
- [ ] **Step 5: Final build + push branch:**

```bash
npm run build
git push -u origin redesign/v2
```

Expected: Vercel produces a preview deployment for the branch (check the Vercel dashboard or the GitHub commit status for the preview URL).

- [ ] **Step 6: Report to Ross:** preview URL, summary of what changed, and the two follow-ups explicitly deferred: (a) optional weight-chart backfill + retake, (b) App Store badge un-hide at iOS launch. Do NOT merge to main; Ross reviews the preview and gives the ship call.
