"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Molten } from "@/components/home/Molten";
import { ButtonLink } from "@/components/ui/Button";
import { useApp } from "@/lib/appState";
import { fmtCompactUsd, fmtNumber } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { portfolios, totals, isPreview } = useApp();
  const featured = portfolios[0];

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-24 lg:pt-14">
        {/* The object. First on small screens, right on large. */}
        <motion.div
          className="relative order-first h-[300px] sm:h-[380px] lg:order-last lg:h-[600px]"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease }}
        >
          <Molten className="absolute inset-0 lg:-inset-x-16 lg:-inset-y-10" />

          {featured && (
            <motion.div
              className="absolute bottom-2 left-2 sm:bottom-6 sm:left-6 lg:bottom-10 lg:left-0"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease }}
            >
              <Link
                href={`/portfolios/${featured.slug}`}
                className="glass glass-hover flex items-center gap-3 rounded-full py-2 pl-3 pr-4"
              >
                <span className="live-dot h-2 w-2 rounded-full bg-gain" />
                <span className="t-mono text-bone">${featured.ticker}</span>
                <span className="t-small text-bone-soft">
                  {featured.holdings.length} stocks · one token
                </span>
                <span className="t-label text-copper">Open</span>
              </Link>
            </motion.div>
          )}
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2.5 pr-3.5">
              <span className="h-1.5 w-1.5 rounded-full bg-copper shadow-[0_0_10px_2px_rgba(255,156,85,0.6)]" />
              <span className="t-label text-bone-soft">
                Robinhood Chain · Tokenized stocks
              </span>
            </span>
          </motion.div>

          <motion.h1
            className="t-hero mt-6 text-bone"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease }}
          >
            Forge your own
            <br />
            <em>portfolio.</em>
          </motion.h1>

          <motion.p
            className="t-lead mt-6 max-w-[50ch] text-bone-soft"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease }}
          >
            Pick real tokenized stocks, set the weights, and pour them into one
            token anyone can buy with a single signature. Every token is backed
            one‑for‑one by the stocks in its vault and redeems for them at any
            time.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            <ButtonLink href="/forge" size="lg">
              Forge a portfolio
            </ButtonLink>
            <ButtonLink href="/portfolios" size="lg" variant="ghost">
              Explore portfolios
            </ButtonLink>
          </motion.div>

          <motion.dl
            className="glass mt-10 grid max-w-xl grid-cols-3 divide-x divide-rule px-2 py-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32, ease }}
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
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4">
      <dt className="t-label text-bone-muted">{label}</dt>
      <dd className="t-figure mt-2 text-bone">{value}</dd>
    </div>
  );
}
