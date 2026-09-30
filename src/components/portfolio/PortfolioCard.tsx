"use client";

import Link from "next/link";
import { AssetTile } from "@/components/ui/AssetTile";
import { Donut } from "@/components/ui/Donut";
import { PreviewTag } from "@/components/ui/Label";
import { fmtBps, fmtCompactUsd, fmtNumber, fmtUsd } from "@/lib/format";
import { sharePrice, sortHoldings, type Portfolio } from "@/lib/portfolios";

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const top = sortHoldings(portfolio.holdings);
  const shown = top.slice(0, 4);
  const rest = top.length - shown.length;

  return (
    <Link
      href={`/portfolios/${portfolio.slug}`}
      className="card group flex flex-col gap-5 p-5 transition-colors hover:border-copper/40 hover:bg-ink-3"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="t-label text-copper">${portfolio.ticker}</span>
            {portfolio.preview && <PreviewTag />}
          </div>
          <h3 className="t-title mt-1.5 truncate text-bone group-hover:text-copper-bright">
            {portfolio.name}
          </h3>
        </div>
        <Donut holdings={portfolio.holdings} size={64} thickness={9} />
      </div>

      <div className="flex items-center gap-1.5">
        {shown.map((h) => (
          <span key={h.symbol} className="flex items-center gap-1.5 rounded-full bg-ink px-1.5 py-1 pr-2.5">
            <AssetTile symbol={h.symbol} size={20} />
            <span className="t-mono text-bone-soft">{h.symbol}</span>
          </span>
        ))}
        {rest > 0 && (
          <span className="t-mono rounded-full bg-ink px-2.5 py-1.5 text-bone-muted">
            +{rest}
          </span>
        )}
      </div>

      <dl className="grid grid-cols-3 gap-3 border-t border-rule pt-4">
        <Stat label="Value" value={fmtCompactUsd(portfolio.tvlUsd)} />
        <Stat label="Price" value={fmtUsd(sharePrice(portfolio), true)} />
        <Stat label="Holders" value={fmtNumber(portfolio.holders)} />
      </dl>

      <div className="flex items-center justify-between">
        <span className="t-small text-bone-muted">
          {portfolio.holdings.length} assets · entry {fmtBps(portfolio.entryFeeBps)}
          {portfolio.managementFeeBps > 0 && ` · ${fmtBps(portfolio.managementFeeBps)}/yr`}
        </span>
        <span className="t-label text-bone-muted transition-colors group-hover:text-copper">
          Open →
        </span>
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="t-label text-bone-muted">{label}</dt>
      <dd className="t-figure-sm mt-1.5 text-bone">{value}</dd>
    </div>
  );
}
