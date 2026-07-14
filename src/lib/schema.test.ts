import { describe, it, expect } from "vitest";
import { buildArticleLd, buildFaqLd, buildBreadcrumbLd, SITE_URL } from "./schema";

describe("buildArticleLd", () => {
  const base = {
    title: "How Meal Logging Supports Sustainable Weight Loss",
    description: "What the research says about self-monitoring.",
    slug: "meal-logging-sustainable-weight-loss",
    pubDate: new Date("2026-07-14T00:00:00Z"),
    author: "Heather Bauer Nutrition",
  };

  it("emits an Article with a canonical url and page-relative slug", () => {
    const ld = buildArticleLd(base) as any;
    expect(ld["@type"]).toBe("Article");
    expect(ld.headline).toBe(base.title);
    expect(ld.url).toBe(`${SITE_URL}/blog/${base.slug}/`);
    expect(ld.mainEntityOfPage["@id"]).toBe(`${SITE_URL}/blog/${base.slug}/`);
  });

  it("defaults dateModified to pubDate when no updatedDate", () => {
    const ld = buildArticleLd(base) as any;
    expect(ld.datePublished).toBe("2026-07-14T00:00:00.000Z");
    expect(ld.dateModified).toBe("2026-07-14T00:00:00.000Z");
  });

  it("uses updatedDate for dateModified when provided", () => {
    const ld = buildArticleLd({ ...base, updatedDate: new Date("2026-08-01T00:00:00Z") }) as any;
    expect(ld.dateModified).toBe("2026-08-01T00:00:00.000Z");
  });

  it("absolutizes a site-relative image and omits image when absent", () => {
    expect((buildArticleLd(base) as any).image).toBeUndefined();
    const withImg = buildArticleLd({ ...base, image: "/images/x.webp" }) as any;
    expect(withImg.image).toBe(`${SITE_URL}/images/x.webp`);
    const withAbs = buildArticleLd({ ...base, image: "https://cdn.test/x.webp" }) as any;
    expect(withAbs.image).toBe("https://cdn.test/x.webp");
  });

  it("names the brand as publisher and the byline as author", () => {
    const ld = buildArticleLd(base) as any;
    expect(ld.publisher.name).toBe("Range by Heather Bauer, RD");
    expect(ld.author.name).toBe("Heather Bauer Nutrition");
  });
});

describe("buildFaqLd", () => {
  it("maps items to a FAQPage with Question/Answer nodes", () => {
    const ld = buildFaqLd([
      { question: "Does logging help?", answer: "Yes, studies show it does." },
    ]) as any;
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toHaveLength(1);
    expect(ld.mainEntity[0]["@type"]).toBe("Question");
    expect(ld.mainEntity[0].name).toBe("Does logging help?");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("Yes, studies show it does.");
  });
});

describe("buildBreadcrumbLd", () => {
  it("emits a two-level Blog -> article breadcrumb", () => {
    const ld = buildBreadcrumbLd("My Post", "my-post") as any;
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement[0].item).toBe(`${SITE_URL}/blog/`);
    expect(ld.itemListElement[1].item).toBe(`${SITE_URL}/blog/my-post/`);
  });
});
