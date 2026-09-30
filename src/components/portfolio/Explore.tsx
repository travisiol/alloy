"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { ButtonLink } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Field";
import { Label } from "@/components/ui/Label";
import { useApp } from "@/lib/appState";
import { fmtCompactUsd, fmtNumber } from "@/lib/format";

type Sort = "value" | "newest" | "cheapest" | "holders";

const sorts: { key: Sort; label: string }[] = [
  { key: "value", label: "Largest" },
  { key: "newest", label: "Newest" },
  { key: "cheapest", label: "Lowest fee" },
  { key: "holders", label: "Most held" },
];

export function Explore() {
  const { portfolios, totals, isPreview, isLoading } = useApp();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("value");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = portfolios.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.ticker.toLowerCase().includes(q) ||
        p.holdings.some((h) => h.symbol.toLowerCase().includes(q)),
    );
    const sorted = [...filtered];
    switch (sort) {
      case "value":
        sorted.sort((a, b) => b.tvlUsd - a.tvlUsd);
        break;
      case "newest":
        sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "cheapest":
        sorted.sort(
          (a, b) =>
            a.entryFeeBps + a.managementFeeBps - (b.entryFeeBps + b.managementFeeBps),
        );
        break;
      case "holders":
        sorted.sort((a, b) => b.holders - a.holders);
        break;
    }
    return sorted;
  }, [portfolios, query, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Label className="text-copper">{isPreview ? "Preview vaults" : "Every vault"}</Label>
          <h1 className="t-display mt-3 text-bone">
            Explore <em>portfolios.</em>
          </h1>
        </div>
        <dl className="flex gap-8">
          <div>
            <dt className="t-label text-bone-muted">Vaults</dt>
            <dd className="t-figure-sm mt-1.5 text-bone">{fmtNumber(totals.portfolios)}</dd>
          </div>
          <div>
            <dt className="t-label text-bone-muted">Value</dt>
            <dd className="t-figure-sm mt-1.5 text-bone">{fmtCompactUsd(totals.tvlUsd)}</dd>
          </div>
          <div>
            <dt className="t-label text-bone-muted">Holders</dt>
            <dd className="t-figure-sm mt-1.5 text-bone">{fmtNumber(totals.holders)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <TextInput
          placeholder="Search by name, ticker or a stock inside"
          aria-label="Search portfolios"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-1.5 sm:ml-auto">
          {sorts.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSort(s.key)}
              className={clsx(
                "rounded-full px-3.5 py-2 text-[13px] transition-colors",
                sort === s.key ? "bg-bone text-ink" : "bg-ink-2 text-bone-soft hover:text-bone",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="t-small mt-16 text-center text-bone-muted">Reading the factory…</p>
      ) : list.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center gap-4 px-6 py-16 text-center">
          <p className="t-title text-bone">
            {query ? "Nothing matches." : "No vault has been forged yet."}
          </p>
          <p className="t-small max-w-[40ch] text-bone-muted">
            {query
              ? "Try a ticker of a stock you would expect inside."
              : "The first one gets to set the tone."}
          </p>
          <ButtonLink href="/forge">Forge the first</ButtonLink>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <li key={p.slug}>
              <PortfolioCard portfolio={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
