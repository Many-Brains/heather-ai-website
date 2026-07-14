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
    `> AI-powered, expert-guided nutrition coaching built on 25 years of methodology from Heather Bauer, RD. The AI coach inside ${BRAND_SHORT} is HeatherAI. ${BRAND_SHORT} helps GLP-1 users and anyone who struggles to stick to a plan lose weight sustainably through meal logging, meal planning, and expert coaching.`,
    "",
    "## Blog articles",
    ...posts.map((p) => `- [${p.data.title}](${SITE_URL}/blog/${p.id}/): ${p.data.description}`),
    "",
    "## Key pages",
    `- [Method](${SITE_URL}/method): The coaching methodology behind ${BRAND_SHORT}.`,
    `- [GLP-1 coaching](${SITE_URL}/glp-1): How ${BRAND_SHORT} supports GLP-1 users.`,
    `- [Pricing](${SITE_URL}/pricing): Plans and tiers.`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
