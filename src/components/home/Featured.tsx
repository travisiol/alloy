"use client";

import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { useApp } from "@/lib/appState";

export function Featured() {
  const { portfolios, isPreview } = useApp();
  const top = [...portfolios].sort((a, b) => b.tvlUsd - a.tvlUsd).slice(0, 3);

  if (top.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label className="text-copper">
            {isPreview ? "Worked examples" : "Largest vaults"}
          </Label>
          <h2 className="t-display mt-3 text-bone">
            Portfolios people <em>forged.</em>
          </h2>
        </div>
        <ButtonLink href="/portfolios" variant="ghost">
          See all
        </ButtonLink>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {top.map((p) => (
          <PortfolioCard key={p.slug} portfolio={p} />
        ))}
      </div>
    </section>
  );
}
