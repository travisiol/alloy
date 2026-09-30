"use client";

import { Button } from "@/components/ui/Button";
import { Donut } from "@/components/ui/Donut";
import { AssetTile } from "@/components/ui/AssetTile";
import { Label, PreviewTag } from "@/components/ui/Label";
import { fmtBps, fmtUsd } from "@/lib/format";
import { sortHoldings, type Draft, type ValidationIssue } from "@/lib/portfolios";
import { isLive, limits } from "@/lib/site-config";

/*
 * The token, as it will look on its own page, redrawn from the draft on
 * every keystroke. Under it: the terms in plain numbers, and the button.
 */
export function Summary({
  draft,
  issues,
  onForge,
  busy,
  disabledReason,
  error,
}: {
  draft: Draft;
  issues: ValidationIssue[];
  onForge: () => void;
  busy: boolean;
  disabledReason: string | null;
  error: string | null;
}) {
  const holdings = sortHoldings(draft.holdings);
  const name = draft.name.trim() || "Untitled";
  const ticker = draft.ticker || "TICKR";
  const keep = 1 - limits.protocolFeeShareBps / 10_000;

  return (
    <div className="card-raised grain relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-copper/15 blur-3xl" aria-hidden />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Label className="text-copper">${ticker}</Label>
            {!isLive && <PreviewTag />}
          </div>
          <h2 className="t-title mt-1.5 truncate text-bone">{name}</h2>
          <p className="t-small mt-1 text-bone-muted">
            {holdings.length} asset{holdings.length === 1 ? "" : "s"}
          </p>
        </div>
        <Donut
          holdings={holdings}
          size={96}
          thickness={12}
          label={holdings.length ? String(holdings.length) : undefined}
        />
      </div>

      {holdings.length > 0 && (
        <ul className="relative mt-5 flex flex-col gap-1.5">
          {holdings.slice(0, 6).map((h) => (
            <li key={h.symbol} className="flex items-center gap-2.5">
              <AssetTile symbol={h.symbol} size={20} />
              <span className="t-mono flex-1 text-bone-soft">{h.symbol}</span>
              <span className="t-mono text-bone">{(h.weightBps / 100).toFixed(1)}%</span>
            </li>
          ))}
          {holdings.length > 6 && (
            <li className="t-small pl-8 text-bone-muted">
              and {holdings.length - 6} more
            </li>
          )}
        </ul>
      )}

      <dl className="relative mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-rule pt-5">
        <Term k="Entry fee" v={fmtBps(draft.entryFeeBps)} />
        <Term k="Management" v={`${fmtBps(draft.managementFeeBps)}/yr`} />
        <Term k="Seed" v={fmtUsd(draft.seedUsd || 0)} />
        <Term k="You keep of fees" v={`${(keep * 100).toFixed(0)}%`} />
      </dl>

      {issues.length > 0 && (
        <ul className="relative mt-5 flex flex-col gap-1.5">
          {issues.map((i) => (
            <li key={i.field + i.message} className="t-small text-loss">
              {i.message}
            </li>
          ))}
        </ul>
      )}

      <div className="relative mt-6">
        <Button
          size="lg"
          className="w-full"
          onClick={onForge}
          disabled={busy || (!!disabledReason && disabledReason !== issues[0]?.message && !isLive)}
        >
          {busy ? "Waiting for signature…" : "Forge it"}
        </Button>
        {disabledReason && (
          <p className="t-small mt-3 text-center text-bone-muted">{disabledReason}</p>
        )}
        {error && <p className="t-small mt-3 text-center text-loss">{error}</p>}
        <p className="t-small mt-4 text-center text-bone-muted">
          One signature. Weights and fees are fixed forever once forged.
        </p>
      </div>
    </div>
  );
}

function Term({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="t-small text-bone-muted">{k}</dt>
      <dd className="t-mono text-bone">{v}</dd>
    </div>
  );
}
