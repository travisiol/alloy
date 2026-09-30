import type { MetadataRoute } from "next";
import { previewPortfolios } from "@/lib/preview";
import { isLive, siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/portfolios`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/forge`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
  if (!isLive) {
    for (const p of previewPortfolios) {
      pages.push({
        url: `${siteConfig.url}/portfolios/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }
  return pages;
}
