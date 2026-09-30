"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { AssetTile } from "@/components/ui/AssetTile";
import { Donut } from "@/components/ui/Donut";
import { useApp } from "@/lib/appState";
import { fmtCompactUsd, fmtNumber } from "@/lib/format";
import { sortHoldings } from "@/lib/portfolios";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { portfolios, totals, isPreview } = useApp();
  const featured = portfolios[0];

  return (
    <section className="forge-glow relative overflow-hidden border-b border-rule">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pb-28 lg:pt-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <Label className="text-copper">
              Robinhood Chain · Tokenized stocks · Non-custodial
            </Label>
          </motion.div>

          <motion.h1
            className="t-hero mt-5 text-bone"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
          >
            Forge your own
            <br />
            <em>portfolio.</em>
          </motion.h1>

          <motion.p
            className="t-lead mt-6 max-w-[52ch] text-bone-soft"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
          >
            Pick real tokenized stocks, set the weights, and pour them into one
            token. Anyone can buy it with a single signature. Every token is
            backed one‑for‑one by the stocks in its vault and redeems for them
            at any time.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
          >
            <ButtonLink href="/forge" size="lg">
              Forge a portfolio
            </ButtonLink>
            <ButtonLink href="/portfolios" size="lg" variant="ghost">
              Explore portfolios
            </ButtonLink>
          </motion.div>

          <motion.dl
            className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-rule pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <HeroStat
              label={isPreview ? "Preview vaults" : "Vaults"}
              value={fmtNumber(totals.portfolios)}
            />
            <HeroStat
              label={isPreview ? "Preview value" : "Value in vaults"}
              value={fmtCompactUsd(totals.tvlUsd)}
            />
            <HeroStat label="Stock tokens" value="190+" />
          </motion.dl>
        </div>

        {featured && (
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
          >
            <IngotCard
              name={featured.name}
              ticker={featured.ticker}
              holdings={sortHoldings(featured.holdings)}
              preview={featured.preview}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="t-label text-bone-muted">{label}</dt>
      <dd className="t-figure mt-2 text-bone">{value}</dd>
    </div>
  );
}

/**
 * The hero's object: a portfolio token drawn as a card, so the thing being
 * sold is visible before a word of explanation. It is a real entry from
 * the list, not a mock-up, and says so if it is preview data.
 */
function IngotCard({
  name,
  ticker,
  holdings,
  preview,
}: {
  name: string;
  ticker: string;
  holdings: { symbol: string; weightBps: number }[];
  preview: boolean;
}) {
  return (
    <div className="card-raised grain relative mx-auto max-w-[460px] overflow-hidden p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-copper/20 blur-3xl" aria-hidden />
      <div className="relative flex items-start justify-between">
        <div>
          <Label className="text-copper">${ticker}</Label>
          <h2 className="t-title mt-1.5 text-bone">{name}</h2>
          <p className="t-small mt-1 text-bone-muted">
            {holdings.length} tokenized stocks · one token
            {preview && " · preview"}
          </p>
        </div>
        <Donut
          holdings={holdings}
          size={96}
          thickness={12}
          label={String(holdings.length)}
        />
      </div>

      <ul className="relative mt-6 flex flex-col gap-2">
        {holdings.slice(0, 5).map((h) => (
          <li key={h.symbol} className="flex items-center gap-3">
            <AssetTile symbol={h.symbol} size={28} />
            <span className="t-mono w-16 text-bone">{h.symbol}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink">
              <span
                className="block h-full rounded-full bg-copper"
                style={{ width: `${h.weightBps / 100}%` }}
              />
            </span>
            <span className="t-mono w-14 text-right text-bone-soft">
              {(h.weightBps / 100).toFixed(1)}%
            </span>
          </li>
        ))}
        {holdings.length > 5 && (
          <li className="t-small pl-10 text-bone-muted">
            and {holdings.length - 5} more
          </li>
        )}
      </ul>

      <div className="relative mt-6 flex items-center justify-between border-t border-rule pt-4">
        <span className="t-small text-bone-muted">Backed 1:1 · Redeem any time</span>
        <span className="t-label text-gain">Vault open</span>
      </div>
    </div>
  );
}
