import type { Portfolio } from "@/lib/portfolios";

/*
 * Preview data. These are worked examples so the site has something to
 * show before the factory contract exists — labelled "Preview" everywhere
 * they appear, and dropped the moment NEXT_PUBLIC_ALLOY_FACTORY_ADDRESS is
 * set. None of the figures are a claim about anything that has happened.
 */

const CREATOR_A = "0x7A1e00000000000000000000000000000000A110" as const;
const CREATOR_B = "0xB0b0000000000000000000000000000000000B0b" as const;
const CREATOR_C = "0xC0de0000000000000000000000000000000C0de0" as const;

export const previewPortfolios: Portfolio[] = [
  {
    slug: "mag7",
    vault: null,
    name: "Magnificent Seven",
    ticker: "MAG7",
    description:
      "The seven companies that carried the index. Equal weight, so no single name gets to decide the outcome.",
    creator: CREATOR_A,
    createdAt: "2026-09-02T10:00:00Z",
    holdings: [
      { symbol: "NVDA", weightBps: 1429 },
      { symbol: "AAPL", weightBps: 1429 },
      { symbol: "MSFT", weightBps: 1429 },
      { symbol: "GOOGL", weightBps: 1429 },
      { symbol: "AMZN", weightBps: 1428 },
      { symbol: "META", weightBps: 1428 },
      { symbol: "TSLA", weightBps: 1428 },
    ],
    entryFeeBps: 50,
    managementFeeBps: 0,
    tvlUsd: 412_380,
    supply: 3_840,
    holders: 212,
    preview: true,
  },
  {
    slug: "silicon",
    vault: null,
    name: "Silicon",
    ticker: "SILIC",
    description:
      "The chip stack end to end: the designers, the foundry and the lithography that makes the foundry possible.",
    creator: CREATOR_B,
    createdAt: "2026-09-06T14:30:00Z",
    holdings: [
      { symbol: "NVDA", weightBps: 3000 },
      { symbol: "TSM", weightBps: 2000 },
      { symbol: "AVGO", weightBps: 1500 },
      { symbol: "AMD", weightBps: 1500 },
      { symbol: "ASML", weightBps: 1200 },
      { symbol: "MU", weightBps: 800 },
    ],
    entryFeeBps: 100,
    managementFeeBps: 50,
    tvlUsd: 268_940,
    supply: 2_115,
    holders: 148,
    preview: true,
  },
  {
    slug: "steady",
    vault: null,
    name: "Steady Hands",
    ticker: "STEADY",
    description:
      "Dividends, staples and a treasury sleeve. The basket you forge for money you are not allowed to lose.",
    creator: CREATOR_C,
    createdAt: "2026-09-09T09:15:00Z",
    holdings: [
      { symbol: "SCHD", weightBps: 2500 },
      { symbol: "TLT", weightBps: 2000 },
      { symbol: "JNJ", weightBps: 1500 },
      { symbol: "PG", weightBps: 1500 },
      { symbol: "KO", weightBps: 1000 },
      { symbol: "GLD", weightBps: 1500 },
    ],
    entryFeeBps: 25,
    managementFeeBps: 25,
    tvlUsd: 189_500,
    supply: 1_860,
    holders: 97,
    preview: true,
  },
  {
    slug: "sixtyforty",
    vault: null,
    name: "Sixty Forty",
    ticker: "SIXTY",
    description:
      "The oldest allocation there is, now one token: total market and long treasuries, rebalanced on redemption.",
    creator: CREATOR_A,
    createdAt: "2026-09-12T16:45:00Z",
    holdings: [
      { symbol: "VTI", weightBps: 6000 },
      { symbol: "TLT", weightBps: 4000 },
    ],
    entryFeeBps: 0,
    managementFeeBps: 10,
    tvlUsd: 94_200,
    supply: 940,
    holders: 61,
    preview: true,
  },
  {
    slug: "rails",
    vault: null,
    name: "Payment Rails",
    ticker: "RAILS",
    description:
      "Every card swipe and every onchain trade pays somebody in this basket.",
    creator: CREATOR_B,
    createdAt: "2026-09-18T11:20:00Z",
    holdings: [
      { symbol: "V", weightBps: 2500 },
      { symbol: "MA", weightBps: 2500 },
      { symbol: "COIN", weightBps: 2000 },
      { symbol: "HOOD", weightBps: 2000 },
      { symbol: "JPM", weightBps: 1000 },
    ],
    entryFeeBps: 75,
    managementFeeBps: 0,
    tvlUsd: 57_800,
    supply: 566,
    holders: 44,
    preview: true,
  },
  {
    slug: "counter",
    vault: null,
    name: "Counter Trend",
    ticker: "CNTR",
    description:
      "Gold, bitcoin and real estate against a core of broad equities. Something in here is always going the other way.",
    creator: CREATOR_C,
    createdAt: "2026-09-24T08:05:00Z",
    holdings: [
      { symbol: "SPY", weightBps: 4000 },
      { symbol: "GLD", weightBps: 2500 },
      { symbol: "IBIT", weightBps: 2000 },
      { symbol: "VNQ", weightBps: 1500 },
    ],
    entryFeeBps: 150,
    managementFeeBps: 100,
    tvlUsd: 31_150,
    supply: 305,
    holders: 29,
    preview: true,
  },
];
