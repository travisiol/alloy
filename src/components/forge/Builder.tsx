"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useConnection, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { AssetPicker } from "@/components/forge/AssetPicker";
import { WeightEditor } from "@/components/forge/WeightEditor";
import { Summary } from "@/components/forge/Summary";
import { Field, Slider, TextInput } from "@/components/ui/Field";
import { Label } from "@/components/ui/Label";
import { factoryAbi, USDG_DECIMALS } from "@/lib/alloyAbi";
import { robinhoodChain } from "@/lib/chain";
import { fmtBps } from "@/lib/format";
import {
  emptyDraft,
  equalWeights,
  normalizeWeights,
  validateDraft,
  type Draft,
} from "@/lib/portfolios";
import { contracts, isLive, limits } from "@/lib/site-config";

const DRAFT_KEY = "alloy:draft:v1";

function loadDraft(): Draft {
  try {
    const saved = window.localStorage.getItem(DRAFT_KEY);
    if (saved) return { ...emptyDraft, ...(JSON.parse(saved) as Draft) };
  } catch {
    /* a corrupt draft is not worth crashing over */
  }
  return emptyDraft;
}

/*
 * The forge. One long form on the left — pick, weight, name, fees, seed —
 * and a sticky summary on the right that redraws as the draft changes and
 * carries the one button that matters.
 *
 * The draft survives a reload. It would be a shame to lose twenty weights
 * to a mis-swipe.
 */
export function Builder() {
  const router = useRouter();
  // Client-only (see forge/page.tsx), so reading storage in the initialiser
  // is safe: there is no server render to disagree with.
  const [draft, setDraft] = useState<Draft>(loadDraft);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* private mode, quota — the form still works without it */
    }
  }, [draft]);

  const issues = useMemo(() => validateDraft(draft), [draft]);
  const issueFor = (field: string) =>
    touched ? (issues.find((i) => i.field === field)?.message ?? null) : null;

  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const toggleAsset = (symbol: string) => {
    setDraft((d) => {
      const has = d.holdings.some((h) => h.symbol === symbol);
      if (has) {
        const rest = d.holdings.filter((h) => h.symbol !== symbol);
        return { ...d, holdings: rest.length ? normalizeWeights(rest) : [] };
      }
      if (d.holdings.length >= limits.maxAssets) return d;
      return {
        ...d,
        holdings: equalWeights([...d.holdings.map((h) => h.symbol), symbol]),
      };
    });
  };

  const { isConnected, chainId } = useConnection();
  const { writeContractAsync, isPending } = useWriteContract();
  const [txError, setTxError] = useState<string | null>(null);

  const onChain = chainId === robinhoodChain.id;
  const ready = issues.length === 0;

  const forge = async () => {
    setTouched(true);
    setTxError(null);
    if (!ready) return;
    if (!isLive || !contracts.factory) return;
    try {
      await writeContractAsync({
        abi: factoryAbi,
        address: contracts.factory,
        functionName: "create",
        args: [
          draft.name.trim(),
          draft.ticker,
          draft.holdings.map((h) => h.symbol),
          draft.holdings.map((h) => h.weightBps),
          draft.entryFeeBps,
          draft.managementFeeBps,
          parseUnits(String(draft.seedUsd), USDG_DECIMALS),
        ],
        chainId: robinhoodChain.id,
      });
      window.localStorage.removeItem(DRAFT_KEY);
      router.push("/portfolios");
    } catch (err) {
      setTxError(
        err instanceof Error ? err.message.split("\n")[0] : "Transaction failed.",
      );
    }
  };

  const disabledReason = !isLive
    ? "The factory contract is not deployed yet. Your draft is saved in this browser."
    : !isConnected
      ? "Connect a wallet to forge."
      : !onChain
        ? "Switch to Robinhood Chain to forge."
        : !ready && touched
          ? issues[0]?.message
          : null;

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_400px] lg:items-start">
      <div className="flex flex-col gap-10">
        <Step n="01" title="Pick the assets" hint={`${draft.holdings.length} / ${limits.maxAssets}`}>
          <AssetPicker
            selected={draft.holdings.map((h) => h.symbol)}
            onToggle={toggleAsset}
            full={draft.holdings.length >= limits.maxAssets}
          />
          {issueFor("assets") && (
            <p className="t-small mt-3 text-loss">{issueFor("assets")}</p>
          )}
        </Step>

        <Step n="02" title="Set the weights" hint="Must sum to 100%">
          <WeightEditor
            holdings={draft.holdings}
            onChange={(holdings) => update({ holdings })}
            onRemove={toggleAsset}
          />
          {issueFor("weights") && (
            <p className="t-small mt-3 text-loss">{issueFor("weights")}</p>
          )}
        </Step>

        <Step n="03" title="Name it">
          <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
            <Field label="Name" error={issueFor("name")}>
              <TextInput
                placeholder="e.g. Silicon"
                maxLength={40}
                value={draft.name}
                invalid={!!issueFor("name")}
                onChange={(e) => update({ name: e.target.value })}
              />
            </Field>
            <Field
              label="Ticker"
              hint={`${limits.tickerMin}–${limits.tickerMax} chars`}
              error={issueFor("ticker")}
            >
              <TextInput
                placeholder="SILIC"
                maxLength={limits.tickerMax}
                value={draft.ticker}
                invalid={!!issueFor("ticker")}
                className="font-mono uppercase tracking-wider"
                onChange={(e) =>
                  update({
                    ticker: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""),
                  })
                }
              />
            </Field>
          </div>
          <Field label="One line on why" hint="Optional" className="mt-5">
            <TextInput
              placeholder="What this basket is for."
              maxLength={140}
              value={draft.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </Field>
        </Step>

        <Step n="04" title="Set your fees">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <Label className="text-bone-soft">Entry fee</Label>
                <span className="t-figure-sm text-bone">{fmtBps(draft.entryFeeBps)}</span>
              </div>
              <Slider
                ariaLabel="Entry fee"
                min={0}
                max={limits.maxEntryFeeBps}
                step={5}
                value={draft.entryFeeBps}
                onChange={(entryFeeBps) => update({ entryFeeBps })}
              />
              <p className="t-small mt-3 text-bone-muted">
                Taken on every mint, paid to you in USDG.
              </p>
            </div>
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <Label className="text-bone-soft">Management fee / yr</Label>
                <span className="t-figure-sm text-bone">
                  {fmtBps(draft.managementFeeBps)}
                </span>
              </div>
              <Slider
                ariaLabel="Management fee"
                min={0}
                max={limits.maxManagementFeeBps}
                step={5}
                value={draft.managementFeeBps}
                onChange={(managementFeeBps) => update({ managementFeeBps })}
              />
              <p className="t-small mt-3 text-bone-muted">
                Streamed from the vault. Zero is a fine answer.
              </p>
            </div>
          </div>
          {issueFor("fees") && (
            <p className="t-small mt-3 text-loss">{issueFor("fees")}</p>
          )}
        </Step>

        <Step n="05" title="Seed it" hint={`Min ${limits.minSeedUsd} USDG`}>
          <Field label="Seed amount" error={issueFor("seed")}>
            <div className="relative">
              <TextInput
                type="number"
                inputMode="decimal"
                min={limits.minSeedUsd}
                step={10}
                value={Number.isFinite(draft.seedUsd) ? draft.seedUsd : ""}
                invalid={!!issueFor("seed")}
                className="pr-20 font-mono"
                onChange={(e) => update({ seedUsd: Number(e.target.value) })}
              />
              <span className="t-label pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-bone-muted">
                USDG
              </span>
            </div>
          </Field>
          <p className="t-small mt-3 max-w-[60ch] text-bone-muted">
            The seed buys the first basket at your weights and mints the first
            tokens to you. It is your money in your vault: redeem it whenever
            you like.
          </p>
        </Step>
      </div>

      <div className="lg:sticky lg:top-24">
        <Summary
          draft={draft}
          issues={touched ? issues : []}
          onForge={forge}
          busy={isPending}
          disabledReason={disabledReason}
          error={txError}
        />
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  hint,
  children,
}: {
  n: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-6 sm:p-8">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="t-label text-copper">{n}</span>
          <h2 className="t-title text-bone">{title}</h2>
        </div>
        {hint && <span className="t-mono text-bone-muted">{hint}</span>}
      </div>
      {children}
    </section>
  );
}
