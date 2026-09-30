/**
 * Everything that names the product lives here. Swap `name` and the
 * `NEXT_PUBLIC_ALLOY_*` env prefix and the site is renamed everywhere:
 * metadata, nav, OG image, footer, FAQ.
 */
export const siteConfig = {
  name: "Alloy",
  wordmark: "ALLOY",
  tagline: "Forge your own portfolio.",
  description:
    "Pick real tokenized stocks, set the weights, forge one token. Every Alloy is backed one-for-one by the stocks in its vault, redeemable at any time, and never custodied by us.",
  seoDescription:
    "Forge a basket of tokenized stocks into a single token anyone can buy with one signature. Backed one-for-one, redeemable any time, non-custodial.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://alloy.example",
  x: envOrNull(process.env.NEXT_PUBLIC_ALLOY_X),
  discord: envOrNull(process.env.NEXT_PUBLIC_ALLOY_DISCORD),
  docs: envOrNull(process.env.NEXT_PUBLIC_ALLOY_DOCS),
} as const;

function envOrNull(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

/** Hard limits the builder enforces. Mirrors what the factory contract checks. */
export const limits = {
  minAssets: 2,
  maxAssets: 20,
  /** Entry fee taken on every mint, kept by the creator (minus protocol cut). */
  maxEntryFeeBps: 300,
  /** Annualised management fee streamed from the vault to the creator. */
  maxManagementFeeBps: 200,
  /** Protocol share of every fee the creator earns, in basis points. */
  protocolFeeShareBps: 1000,
  /** Minimum seed at creation, in USDG. */
  minSeedUsd: 100,
  tickerMin: 3,
  tickerMax: 6,
} as const;

/**
 * The contracts. Both addresses are env-driven so no placeholder can ship
 * hardcoded; with the factory unset the whole site runs on preview data
 * and every write button is disabled and says why.
 */
export const contracts = {
  factory: envOrNull(process.env.NEXT_PUBLIC_ALLOY_FACTORY_ADDRESS) as
    | `0x${string}`
    | null,
  usdg: envOrNull(process.env.NEXT_PUBLIC_ALLOY_USDG_ADDRESS) as
    | `0x${string}`
    | null,
  isLive: process.env.NEXT_PUBLIC_ALLOY_LIVE === "true",
} as const;

export const isLive =
  contracts.isLive && contracts.factory !== null && contracts.usdg !== null;
