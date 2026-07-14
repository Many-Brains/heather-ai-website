import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { BRAND_FULL, BRAND_SHORT } from "../lib/brand";

export async function GET(context) {
  const posts = (await getCollection("blog"))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: BRAND_FULL,
    description: `Evidence-based nutrition guidance: sustainable weight loss, GLP-1 coaching, meal planning, and the method behind ${BRAND_SHORT}.`,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
