"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { useConnection, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { WalletConnect } from "@/components/WalletConnect";
import { Button } from "@/components/ui/Button";
import { AssetTile } from "@/components/ui/AssetTile";
import { TextInput } from "@/components/ui/Field";
import { Label } from "@/components/ui/Label";
import { SHARE_DECIMALS, USDG_DECIMALS, vaultAbi } from "@/lib/alloyAbi";
import { robinhoodChain } from "@/lib/chain";
import { fmtBps, fmtNumber, fmtUsd } from "@/lib/format";
import { quoteMint, quoteRedeem, type Portfolio } from "@/lib/portfolios";
import { isLive } from "@/lib/site-config";

/*
 * Buy and redeem, side by side, with the arithmetic shown before the
 * signature. A buyer sees the fee in dollars and the tokens they get; a
 * redeemer sees the exact slice of each stock coming back.
 */
export function TradePanel({ portfolio }: { portfolio: Portfolio }) {
  const [tab, setTab] = useState<"buy" | "redeem">("buy");
  const [buyUsd, setBuyUsd] = useState("500");
  const [redeemShares, setRedeemShares] = useState("10");
  const [error, setError] = useState<string | null>(null);

  const { isConnected, chainId } = useConnection();
  const { writeContractAsync, isPending } = useWriteContract();
  const onChain = chainId === robinhoodChain.id;

  const usd = Math.max(0, Number(buyUsd) || 0);
  const shares = Math.max(0, Number(redeemShares) || 0);
  const mint = quoteMint(portfolio, usd);
  const redeem = quoteRedeem(portfolio, shares);

  const canWrite = isLive && portfolio.vault !== null && isConnected && onChain;

  const submit = async () => {
    setError(null);
    if (!canWrite || !portfolio.vault) return;
    try {
      if (tab === "buy") {
        const minShares = (mint.shares * 0.995).toFixed(SHARE_DECIMALS);
        await writeContractAsync({
          abi: vaultAbi,
          address: portfolio.vault,
          functionName: "mint",
          args: [
            parseUnits(usd.toFixed(USDG_DECIMALS), USDG_DECIMALS),
            parseUnits(minShares, SHARE_DECIMALS),
          ],
          chainId: robinhoodChain.id,
        });
      } else {
        await writeContractAsync({
          abi: vaultAbi,
          address: portfolio.vault,
          functionName: "redeem",
          args: [parseUnits(shares.toFixed(SHARE_DECIMALS), SHARE_DECIMALS)],
          chainId: robinhoodChain.id,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message.split("\n")[0] : "Transaction failed.");
    }
  };

  const reason = !isLive
    ? "Trading opens when the contracts deploy. Figures are preview data."
    : !isConnected
      ? null
      : !onChain
        ? "Switch to Robinhood Chain."
        : null;

  return (
    <div className="card-raised overflow-hidden">
      <div className="grid grid-cols-2 border-b border-rule">
        {(["buy", "redeem"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={clsx(
              "t-label py-4 transition-colors",
              tab === t ? "bg-ink-3 text-bone" : "text-bone-muted hover:text-bone",
            )}
          >
            {t === "buy" ? "Buy" : "Redeem"}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === "buy" ? (
          <>
            <Label className="text-bone-soft">You pay</Label>
            <div className="relative mt-2">
              <TextInput
                type="number"
                inputMode="decimal"
                min={0}
                step={10}
                value={buyUsd}
                onChange={(e) => setBuyUsd(e.target.value)}
                className="h-14 pr-20 font-mono text-[20px]"
                aria-label="Amount in USDG"
              />
              <span className="t-label pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-bone-muted">
                USDG
              </span>
            </div>

            <dl className="mt-5 flex flex-col gap-2.5">
              <Row k={`Entry fee (${fmtBps(portfolio.entryFeeBps)})`} v={`− ${fmtUsd(mint.fee, true)}`} />
              <Row k="Into the vault" v={fmtUsd(mint.net, true)} />
              <Row k="Token price" v={fmtUsd(mint.price, true)} />
            </dl>

            <div className="mt-5 rounded-xl bg-ink px-4 py-3">
              <Label className="text-copper">You receive</Label>
              <p className="t-figure mt-1.5 text-bone">
                {fmtNumber(mint.shares, 4)}{" "}
                <span className="t-figure-sm text-bone-muted">${portfolio.ticker}</span>
              </p>
            </div>
          </>
        ) : (
          <>
            <Label className="text-bone-soft">You burn</Label>
            <div className="relative mt-2">
              <TextInput
                type="number"
                inputMode="decimal"
                min={0}
                step={1}
                value={redeemShares}
                onChange={(e) => setRedeemShares(e.target.value)}
                className="h-14 pr-24 font-mono text-[20px]"
                aria-label={`Amount in ${portfolio.ticker}`}
              />
              <span className="t-label pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-bone-muted">
                ${portfolio.ticker}
              </span>
            </div>

            <dl className="mt-5 flex flex-col gap-2.5">
              <Row k="Share of the vault" v={`${(redeem.fraction * 100).toFixed(3)}%`} />
              <Row k="Exit fee" v="None" />
            </dl>

            <div className="mt-5 rounded-xl bg-ink px-4 py-3">
              <Label className="text-copper">You receive, in stock tokens</Label>
              <p className="t-figure mt-1.5 text-bone">≈ {fmtUsd(redeem.usd, true)}</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {redeem.legs.map((leg) => (
                  <li key={leg.symbol} className="flex items-center gap-2">
                    <AssetTile symbol={leg.symbol} size={18} />
                    <span className="t-mono flex-1 text-bone-soft">{leg.symbol}</span>
                    <span className="t-mono text-bone">{fmtUsd(leg.usd, true)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="mt-6">
          {isLive && !isConnected ? (
            <WalletConnect wrapperClassName="w-full" className="h-12 w-full" />
          ) : (
            <Button
              size="lg"
              className="w-full"
              disabled={!canWrite || isPending || (tab === "buy" ? usd <= 0 : shares <= 0)}
              onClick={submit}
            >
              {isPending
                ? "Waiting for signature…"
                : tab === "buy"
                  ? `Buy $${portfolio.ticker}`
                  : "Redeem for stocks"}
            </Button>
          )}
          {reason && <p className="t-small mt-3 text-center text-bone-muted">{reason}</p>}
          {error && <p className="t-small mt-3 text-center text-loss">{error}</p>}
        </div>

        <p className="t-small mt-5 text-center text-bone-muted">
          One signature. Non-custodial. Redemption always open.
        </p>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="t-small text-bone-muted">{k}</dt>
      <dd className="t-mono text-bone">{v}</dd>
    </div>
  );
}
