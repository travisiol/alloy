"use client";

import Link from "next/link";
import { TradePanel } from "@/components/portfolio/TradePanel";
import { AssetTile } from "@/components/ui/AssetTile";
import { ButtonLink } from "@/components/ui/Button";
import { Donut } from "@/components/ui/Donut";
import { Label, PreviewTag } from "@/components/ui/Label";
import { useApp } from "@/lib/appState";
import { assetFor } from "@/lib/assets";
import { robinhoodChain } from "@/lib/chain";
import {
  fmtBps,
  fmtDate,
  fmtNumber,
  fmtUsd,
  shortAddress,
} from "@/lib/format";
import { sharePrice, sortHoldings } from "@/lib/portfolios";

export function Detail({ slug }: { slug: string }) {
  const { bySlug, isLoading } = useApp();
  const portfolio = bySlug(slug);

  if (!portfolio) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
        <p className="t-title text-bone">
          {isLoading ? "Reading the factory…" : "No vault at this address."}
        </p>
        {!isLoading && (
          <ButtonLink href="/portfolios" variant="ghost" className="mt-6">
            Back to explore
          </ButtonLink>
        )}
      </div>
    );
  }

  const holdings = sortHoldings(portfolio.holdings);
  const price = sharePrice(portfolio);
  const explorer = robinhoodChain.blockExplorers.default.url;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link href="/portfolios" className="t-label text-bone-muted transition-colors hover:text-copper">
        ← Explore
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
        <div className="flex flex-col gap-8">
          <header className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Label className="text-copper">${portfolio.ticker}</Label>
                {portfolio.preview && <PreviewTag />}
              </div>
              <h1 className="t-display mt-2 text-bone">{portfolio.name}</h1>
              {portfolio.description && (
                <p className="t-lead mt-3 max-w-[52ch] text-bone-soft">
                  {portfolio.description}
                </p>
              )}
              <p className="t-small mt-4 text-bone-muted">
                Forged {fmtDate(portfolio.createdAt)} by{" "}
                <span className="font-mono text-bone-soft">
                  {shortAddress(portfolio.creator)}
                </span>
                {portfolio.vault && (
                  <>
                    {" · "}
                    <a
                      href={`${explorer}/address/${portfolio.vault}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-bone-soft underline-offset-4 hover:text-copper hover:underline"
                    >
                      vault {shortAddress(portfolio.vault)}
                    </a>
                  </>
                )}
              </p>
            </div>
            <Donut
              holdings={holdings}
              size={140}
              thickness={16}
              label={String(holdings.length)}
              sublabel="assets"
            />
          </header>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-rule bg-rule sm:grid-cols-4">
            <Stat label="Token price" value={fmtUsd(price, true)} />
            <Stat label="Value in vault" value={fmtUsd(portfolio.tvlUsd)} />
            <Stat label="Holders" value={fmtNumber(portfolio.holders)} />
            <Stat label="Supply" value={fmtNumber(portfolio.supply, 0)} />
          </dl>

          <section className="card overflow-hidden">
            <div className="flex items-baseline justify-between px-6 pt-6">
              <h2 className="t-title text-bone">What is in the vault</h2>
              <span className="t-small text-bone-muted">Target weights</span>
            </div>
            <table className="mt-4 w-full">
              <thead>
                <tr className="t-label text-bone-muted">
                  <th className="px-6 py-2 text-left font-medium">Asset</th>
                  <th className="hidden px-6 py-2 text-left font-medium sm:table-cell">Sector</th>
                  <th className="px-6 py-2 text-right font-medium">Weight</th>
                  <th className="px-6 py-2 text-right font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const asset = assetFor(h.symbol);
                  return (
                    <tr key={h.symbol} className="border-t border-rule">
                      <td className="px-6 py-3">
                        <span className="flex items-center gap-3">
                          <AssetTile symbol={h.symbol} size={30} />
                          <span>
                            <span className="t-mono block text-bone">{h.symbol}</span>
                            <span className="t-small block text-bone-muted">{asset.name}</span>
                          </span>
                        </span>
                      </td>
                      <td className="t-small hidden px-6 py-3 text-bone-soft sm:table-cell">
                        {asset.sector}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className="flex items-center justify-end gap-3">
                          <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-ink sm:block">
                            <span
                              className="block h-full rounded-full bg-copper"
                              style={{ width: `${h.weightBps / 100}%` }}
                            />
                          </span>
                          <span className="t-mono text-bone">{(h.weightBps / 100).toFixed(2)}%</span>
                        </span>
                      </td>
                      <td className="t-mono px-6 py-3 text-right text-bone-soft">
                        {fmtUsd((portfolio.tvlUsd * h.weightBps) / 10_000)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <Term
              k="Entry fee"
              v={fmtBps(portfolio.entryFeeBps)}
              note="On every mint, to the creator."
            />
            <Term
              k="Management fee"
              v={`${fmtBps(portfolio.managementFeeBps)} / yr`}
              note="Streamed from the vault's holdings."
            />
            <Term k="Exit" v="Free" note="Burn and receive the stocks. Always open." />
          </section>
        </div>

        <div className="lg:sticky lg:top-24">
          <TradePanel portfolio={portfolio} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-2 px-5 py-4">
      <dt className="t-label text-bone-muted">{label}</dt>
      <dd className="t-figure mt-2 text-bone">{value}</dd>
    </div>
  );
}

function Term({ k, v, note }: { k: string; v: string; note: string }) {
  return (
    <div className="card p-5">
      <span className="t-label text-bone-muted">{k}</span>
      <p className="t-figure-sm mt-2 text-bone">{v}</p>
      <p className="t-small mt-2 text-bone-muted">{note}</p>
    </div>
  );
}
