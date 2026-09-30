import type { Address } from "viem";
import { limits } from "@/lib/site-config";

export interface Holding {
  symbol: string;
  /** Target weight in basis points. All holdings sum to 10,000. */
  weightBps: number;
}

export interface Portfolio {
  /** URL slug. Ticker lower-cased for previews; vault address on chain. */
  slug: string;
  /** Vault contract address, or null for a preview entry. */
  vault: Address | null;
  name: string;
  ticker: string;
  description: string;
  creator: Address;
  createdAt: string;
  holdings: Holding[];
  entryFeeBps: number;
  managementFeeBps: number;
  /** Value of the stocks in the vault, USD. */
  tvlUsd: number;
  /** Portfolio tokens in circulation. */
  supply: number;
  holders: number;
  /** True while the entry comes from preview data rather than the chain. */
  preview: boolean;
}

export function sharePrice(portfolio: Portfolio): number {
  if (portfolio.supply <= 0) return 0;
  return portfolio.tvlUsd / portfolio.supply;
}

export function isBalanced(holdings: Holding[]): boolean {
  return holdings.reduce((sum, h) => sum + h.weightBps, 0) === 10_000;
}

export function sortHoldings(holdings: Holding[]): Holding[] {
  return [...holdings].sort((a, b) => b.weightBps - a.weightBps);
}

/**
 * Equal weights that sum to exactly 10,000 bps. The remainder from integer
 * division goes to the first holdings one basis point at a time, so ten
 * assets get 1000 each and three get 3334 / 3333 / 3333.
 */
export function equalWeights(symbols: string[]): Holding[] {
  const n = symbols.length;
  if (n === 0) return [];
  const base = Math.floor(10_000 / n);
  const extra = 10_000 - base * n;
  return symbols.map((symbol, i) => ({
    symbol,
    weightBps: base + (i < extra ? 1 : 0),
  }));
}

/**
 * Scale a set of weights so they sum to 10,000 while keeping their ratios.
 * Rounding error is absorbed by the largest holding, which is the one
 * where a basis point matters least.
 */
export function normalizeWeights(holdings: Holding[]): Holding[] {
  const total = holdings.reduce((sum, h) => sum + h.weightBps, 0);
  if (total <= 0) return equalWeights(holdings.map((h) => h.symbol));
  const scaled = holdings.map((h) => ({
    symbol: h.symbol,
    weightBps: Math.round((h.weightBps / total) * 10_000),
  }));
  const drift = 10_000 - scaled.reduce((sum, h) => sum + h.weightBps, 0);
  if (drift !== 0) {
    const largest = scaled.reduce(
      (best, h, i) => (h.weightBps > scaled[best].weightBps ? i : best),
      0,
    );
    scaled[largest].weightBps += drift;
  }
  return scaled;
}

export interface ValidationIssue {
  field: "assets" | "weights" | "name" | "ticker" | "seed" | "fees";
  message: string;
}

export interface Draft {
  name: string;
  ticker: string;
  description: string;
  holdings: Holding[];
  entryFeeBps: number;
  managementFeeBps: number;
  seedUsd: number;
}

export const emptyDraft: Draft = {
  name: "",
  ticker: "",
  description: "",
  holdings: [],
  entryFeeBps: 100,
  managementFeeBps: 0,
  seedUsd: 250,
};

export function validateDraft(draft: Draft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const n = draft.holdings.length;
  if (n < limits.minAssets)
    issues.push({
      field: "assets",
      message: `Pick at least ${limits.minAssets} assets.`,
    });
  if (n > limits.maxAssets)
    issues.push({
      field: "assets",
      message: `At most ${limits.maxAssets} assets.`,
    });
  if (n > 0 && !isBalanced(draft.holdings))
    issues.push({ field: "weights", message: "Weights must add up to 100%." });
  if (draft.holdings.some((h) => h.weightBps <= 0))
    issues.push({
      field: "weights",
      message: "Every asset needs a weight above 0%.",
    });
  if (draft.name.trim().length < 3)
    issues.push({ field: "name", message: "Give it a name (3+ characters)." });
  if (
    !/^[A-Z0-9]+$/.test(draft.ticker) ||
    draft.ticker.length < limits.tickerMin ||
    draft.ticker.length > limits.tickerMax
  )
    issues.push({
      field: "ticker",
      message: `Ticker: ${limits.tickerMin}–${limits.tickerMax} letters or digits.`,
    });
  if (draft.entryFeeBps < 0 || draft.entryFeeBps > limits.maxEntryFeeBps)
    issues.push({ field: "fees", message: "Entry fee out of range." });
  if (
    draft.managementFeeBps < 0 ||
    draft.managementFeeBps > limits.maxManagementFeeBps
  )
    issues.push({ field: "fees", message: "Management fee out of range." });
  if (!Number.isFinite(draft.seedUsd) || draft.seedUsd < limits.minSeedUsd)
    issues.push({
      field: "seed",
      message: `Seed with at least ${limits.minSeedUsd} USDG.`,
    });
  return issues;
}

/** What a buyer gets for `usd` after the entry fee, at the current NAV. */
export function quoteMint(portfolio: Portfolio, usd: number) {
  const fee = (usd * portfolio.entryFeeBps) / 10_000;
  const net = usd - fee;
  const price = sharePrice(portfolio);
  const shares = price > 0 ? net / price : net;
  return { fee, net, shares, price };
}

/** What `shares` redeem into: a slice of every stock in the vault. */
export function quoteRedeem(portfolio: Portfolio, shares: number) {
  const fraction = portfolio.supply > 0 ? shares / portfolio.supply : 0;
  const usd = fraction * portfolio.tvlUsd;
  return {
    usd,
    fraction,
    legs: portfolio.holdings.map((h) => ({
      symbol: h.symbol,
      usd: (usd * h.weightBps) / 10_000,
    })),
  };
}
