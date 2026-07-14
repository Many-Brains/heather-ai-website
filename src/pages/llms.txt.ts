import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE_URL, BRAND_FULL, BRAND_SHORT } from "../lib/brand";

export const GET: APIRoute = async () => {
  const posts = (await getCollection("blog"))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const lines = [
    `# ${BRAND_FULL}`,
    "",
    `> AI-powered, expert-guided nutrition coaching built on the 25-year clinical method of registered dietitian Heather Bauer. A real intake interview, a personalized clinical protocol (the Blueprint), a rolling 72-hour meal plan, photo meal logging, and coaching that answers in the moment, with Heather Bauer's human oversight built in. Not a calorie counter: no streaks, badges, or macro-first scoreboards.`,
    "",
    `${BRAND_SHORT} (formerly HeatherAI) is operated by Many Brains, Inc. The AI coach inside ${BRAND_SHORT} is named HeatherAI. (Westport, CT). The methodology is the work of Heather Bauer, RD: 25 years in practice, 5,000+ clients, author of "The Wall Street Diet" (2008) and "Bread Is the Devil" (2012), national press regular (GMA, Today, CNN, The View, NYT, WSJ, People).`,
    "",
    "## Core pages",
    `- [Homepage](${SITE_URL}/): What ${BRAND_SHORT} is: a real dietitian's 25-year method, in your pocket the moment you need it.`,
    `- [The Method](${SITE_URL}/method): The philosophy (structure over willpower, food first), the eight signature techniques, and the evidence behind logging, planning, and coaching.`,
    `- [GLP-1 Coaching](${SITE_URL}/glp-1): Nutrition coaching built for GLP-1 medications: protein-first, side-effect-aware, and habits that outlast the prescription. ${BRAND_SHORT} never sells or recommends GLP-1s.`,
    `- [About Heather Bauer](${SITE_URL}/about): Founder profile, credentials, books, and the story behind ${BRAND_SHORT}.`,
    `- [Scenarios](${SITE_URL}/scenarios): Concrete in-the-moment coaching examples: restaurants, scale panic, late-night cravings, travel.`,
    `- [Pricing](${SITE_URL}/pricing): Free meal logging tier; AI Coaching $39/month with a 7-day free trial.`,
    "",
    "## Deeper material",
    `- [Intelligence](${SITE_URL}/intelligence): How the coaching intelligence was built: pattern library and research context.`,
    `- [Responsible AI](${SITE_URL}/responsible-ai): Domain-scoped AI, medical safety boundaries, expert-in-the-loop review, de-identification.`,
    `- [Privacy Policy](${SITE_URL}/privacy) · [Terms of Service](${SITE_URL}/terms)`,
    "",
    "## Blog articles",
    ...posts.map((p) => `- [${p.data.title}](${SITE_URL}/blog/${p.id}/): ${p.data.description}`),
    "",
    "## Contact",
    `- [Contact](${SITE_URL}/contact): General inquiries, press, partnerships, support.`,
    "- Email: support@heatherbauer.com",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
