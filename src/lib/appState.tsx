"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { robinhoodChain } from "@/lib/chain";
import { factoryAbi, SHARE_DECIMALS, USDG_DECIMALS } from "@/lib/alloyAbi";
import type { Portfolio } from "@/lib/portfolios";
import { previewPortfolios } from "@/lib/preview";
import { contracts, isLive } from "@/lib/site-config";

/*
 * One seam between the site as a preview and the site on chain.
 *
 * With no factory address the list is the worked examples in preview.ts,
 * flagged as such on every card. With one, the same list is read from the
 * factory in a single view call and refreshed every twenty seconds.
 * Nothing above this file knows which it got.
 */

export interface Totals {
  portfolios: number;
  tvlUsd: number;
  holders: number;
}

interface AppState {
  portfolios: Portfolio[];
  totals: Totals;
  isPreview: boolean;
  isLoading: boolean;
  bySlug: (slug: string) => Portfolio | undefined;
}

const AppContext = createContext<AppState | null>(null);

const PAGE = 200n;

export function AppStateProvider({ children }: { children: ReactNode }) {
  const chainRead = useReadContract({
    abi: factoryAbi,
    address: contracts.factory ?? undefined,
    functionName: "vaults",
    args: [0n, PAGE],
    chainId: robinhoodChain.id,
    query: {
      enabled: isLive,
      refetchInterval: 20_000,
    },
  });

  const portfolios = useMemo<Portfolio[]>(() => {
    if (!isLive) return previewPortfolios;
    const rows = chainRead.data ?? [];
    return rows.map((row) => ({
      slug: row.vault.toLowerCase(),
      vault: row.vault,
      name: row.name,
      ticker: row.symbol,
      description: "",
      creator: row.creator,
      createdAt: new Date(Number(row.createdAt) * 1000).toISOString(),
      holdings: row.assets.map((symbol, i) => ({
        symbol,
        weightBps: row.weightsBps[i] ?? 0,
      })),
      entryFeeBps: row.entryFeeBps,
      managementFeeBps: row.managementFeeBps,
      tvlUsd: Number(formatUnits(row.tvl, USDG_DECIMALS)),
      supply: Number(formatUnits(row.totalSupply, SHARE_DECIMALS)),
      holders: row.holders,
      preview: false,
    }));
  }, [chainRead.data]);

  const value = useMemo<AppState>(() => {
    const totals = portfolios.reduce<Totals>(
      (acc, p) => ({
        portfolios: acc.portfolios + 1,
        tvlUsd: acc.tvlUsd + p.tvlUsd,
        holders: acc.holders + p.holders,
      }),
      { portfolios: 0, tvlUsd: 0, holders: 0 },
    );
    return {
      portfolios,
      totals,
      isPreview: !isLive,
      isLoading: isLive && chainRead.isLoading,
      bySlug: (slug) =>
        portfolios.find((p) => p.slug === slug.toLowerCase()),
    };
  }, [portfolios, chainRead.isLoading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppStateProvider");
  return value;
}
