import raw from "@/data/assets.json";

export type AssetKind = "stock" | "etf";

export interface Asset {
  symbol: string;
  name: string;
  sector: string;
  kind: AssetKind;
}

/**
 * The universe an Alloy can be forged from. Each entry is a real tokenized
 * asset — a Robinhood Stock Token on Robinhood Chain — and nothing else
 * can go in a vault. The list is a curated subset of the 190+ tokens on
 * chain; it is data, not code, so extending it is a JSON edit.
 */
export const assets: Asset[] = raw as Asset[];

const bySymbol = new Map(assets.map((asset) => [asset.symbol, asset]));

export function assetFor(symbol: string): Asset {
  return (
    bySymbol.get(symbol) ?? {
      symbol,
      name: symbol,
      sector: "Other",
      kind: "stock",
    }
  );
}

export const sectors: string[] = Array.from(
  new Set(assets.map((asset) => asset.sector)),
).sort();

/** Two-letter mark drawn in the asset's tile. */
export function assetMark(symbol: string): string {
  return symbol.replace(/[^A-Z]/g, "").slice(0, 2) || symbol.slice(0, 2);
}

/** Stable colour per symbol so a stock is the same shade on every chart. */
export function assetHue(symbol: string): number {
  let h = 0;
  for (const ch of symbol) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}
