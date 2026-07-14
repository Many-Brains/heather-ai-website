import { SITE_URL, BRAND_FULL } from "./brand";

// Re-export so consumers may import SITE_URL from either module.
export { SITE_URL };

export interface ArticleLdInput {
  title: string;
  description: string;
  slug: string;
  pubDate: Date;
  updatedDate?: Date;
  author: string;
  image?: string;
}

function absolutize(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export function buildArticleLd(input: ArticleLdInput): Record<string, unknown> {
  const url = `${SITE_URL}/blog/${input.slug}/`;
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: input.pubDate.toISOString(),
    dateModified: (input.updatedDate ?? input.pubDate).toISOString(),
    author: { "@type": "Organization", name: input.author },
    publisher: {
      "@type": "Organization",
      name: BRAND_FULL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
    },
  };
  if (input.image) ld.image = absolutize(input.image);
  return ld;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqLd(items: FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function buildBreadcrumbLd(title: string, slug: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE_URL}/blog/` },
      { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}/blog/${slug}/` },
    ],
  };
}
