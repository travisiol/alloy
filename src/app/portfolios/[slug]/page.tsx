import type { Metadata } from "next";
import { Detail } from "@/components/portfolio/Detail";
import { previewPortfolios } from "@/lib/preview";
import { isLive, siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: PageProps<"/portfolios/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const preview = previewPortfolios.find((p) => p.slug === slug);
  if (preview) {
    return {
      title: `${preview.name} ($${preview.ticker})`,
      description: preview.description,
    };
  }
  return {
    title: "Portfolio",
    description: `A portfolio token on ${siteConfig.name}.`,
  };
}

/**
 * Preview slugs are known at build time and prerendered. On chain the slug
 * is a vault address, which nothing can know ahead of time, so those render
 * on demand.
 */
export function generateStaticParams() {
  return isLive ? [] : previewPortfolios.map((p) => ({ slug: p.slug }));
}

export default async function PortfolioPage({
  params,
}: PageProps<"/portfolios/[slug]">) {
  const { slug } = await params;
  return <Detail slug={slug} />;
}
