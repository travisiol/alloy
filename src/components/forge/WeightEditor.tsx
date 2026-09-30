"use client";

import { Button } from "@/components/ui/Button";
import { AssetTile } from "@/components/ui/AssetTile";
import { Slider } from "@/components/ui/Field";
import { assetFor } from "@/lib/assets";
import { equalWeights, normalizeWeights, type Holding } from "@/lib/portfolios";

/*
 * One row per holding: a slider and a number, both in percent with two
 * decimals, both writing the same basis points. The total is shown in red
 * until it is 100, and two buttons fix it — equalise everything, or scale
 * what is there to fit.
 */
export function WeightEditor({
  holdings,
  onChange,
  onRemove,
}: {
  holdings: Holding[];
  onChange: (holdings: Holding[]) => void;
  onRemove: (symbol: string) => void;
}) {
  const total = holdings.reduce((sum, h) => sum + h.weightBps, 0);
  const balanced = total === 10_000;

  const set = (symbol: string, weightBps: number) =>
    onChange(
      holdings.map((h) =>
        h.symbol === symbol
          ? { ...h, weightBps: Math.max(0, Math.min(10_000, Math.round(weightBps))) }
          : h,
      ),
    );

  if (holdings.length === 0) {
    return (
      <p className="t-small rounded-xl border border-dashed border-rule-strong px-4 py-8 text-center text-bone-muted">
        Pick assets above and they show up here with equal weights.
      </p>
    );
  }

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {holdings.map((h) => {
          const asset = assetFor(h.symbol);
          return (
            <li
              key={h.symbol}
              className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 sm:grid-cols-[auto_120px_1fr_96px_auto]"
            >
              <AssetTile symbol={h.symbol} size={32} />
              <span className="min-w-0 sm:block">
                <span className="t-mono block text-bone">{h.symbol}</span>
                <span className="t-small hidden truncate text-bone-muted sm:block">
                  {asset.name}
                </span>
              </span>
              <span className="col-span-4 sm:col-span-1 sm:col-start-3">
                <Slider
                  ariaLabel={`${h.symbol} weight`}
                  min={0}
                  max={10_000}
                  step={25}
                  value={h.weightBps}
                  onChange={(v) => set(h.symbol, v)}
                />
              </span>
              <span className="relative col-start-3 row-start-1 sm:col-start-4">
                <input
                  type="number"
                  aria-label={`${h.symbol} weight in percent`}
                  inputMode="decimal"
                  min={0}
                  max={100}
                  step={0.25}
                  value={(h.weightBps / 100).toFixed(2).replace(/\.?0+$/, "")}
                  onChange={(e) => set(h.symbol, Number(e.target.value) * 100)}
                  className="h-9 w-24 rounded-lg border border-rule-strong bg-ink pl-3 pr-7 text-right font-mono text-[13px] text-bone focus:border-copper focus:outline-none"
                />
                <span className="t-small pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-bone-muted">
                  %
                </span>
              </span>
              <button
                type="button"
                aria-label={`Remove ${h.symbol}`}
                onClick={() => onRemove(h.symbol)}
                className="col-start-4 row-start-1 flex h-8 w-8 items-center justify-center rounded-full text-bone-muted hover:bg-ink-3 hover:text-loss sm:col-start-5"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.6" fill="none">
                  <path d="M2 2l8 8M10 2l-8 8" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
        <span className="flex items-baseline gap-2">
          <span className="t-label text-bone-muted">Total</span>
          <span className={balanced ? "t-figure-sm text-gain" : "t-figure-sm text-loss"}>
            {(total / 100).toFixed(2)}%
          </span>
          {!balanced && (
            <span className="t-small text-bone-muted">
              {total > 10_000 ? "over" : "under"} by {(Math.abs(10_000 - total) / 100).toFixed(2)}%
            </span>
          )}
        </span>
        <span className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onChange(equalWeights(holdings.map((h) => h.symbol)))}
          >
            Equal weights
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={balanced}
            onClick={() => onChange(normalizeWeights(holdings))}
          >
            Scale to 100%
          </Button>
        </span>
      </div>
    </div>
  );
}
