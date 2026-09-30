"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { AssetTile } from "@/components/ui/AssetTile";
import { TextInput } from "@/components/ui/Field";
import { assets, sectors } from "@/lib/assets";

export function AssetPicker({
  selected,
  onToggle,
  full,
}: {
  selected: string[];
  onToggle: (symbol: string) => void;
  full: boolean;
}) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter(
      (a) =>
        (!sector || a.sector === sector) &&
        (!q || a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)),
    );
  }, [query, sector]);

  return (
    <div>
      <TextInput
        placeholder="Search a ticker or a company"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search assets"
      />

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Chip active={sector === null} onClick={() => setSector(null)}>
          All
        </Chip>
        {sectors.map((s) => (
          <Chip key={s} active={sector === s} onClick={() => setSector(s)}>
            {s}
          </Chip>
        ))}
      </div>

      <ul className="mt-4 grid max-h-[420px] gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2">
        {list.map((asset) => {
          const on = selected.includes(asset.symbol);
          const blocked = !on && full;
          return (
            <li key={asset.symbol}>
              <button
                type="button"
                onClick={() => onToggle(asset.symbol)}
                disabled={blocked}
                aria-pressed={on}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                  on
                    ? "border-copper/60 bg-copper/10"
                    : "border-transparent bg-ink hover:border-rule-strong",
                  blocked && "cursor-not-allowed opacity-40",
                )}
              >
                <AssetTile symbol={asset.symbol} size={32} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="t-mono text-bone">{asset.symbol}</span>
                    <span className="t-label text-bone-muted">{asset.kind}</span>
                  </span>
                  <span className="t-small block truncate text-bone-muted">
                    {asset.name}
                  </span>
                </span>
                <span
                  className={clsx(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-[12px]",
                    on
                      ? "border-copper bg-copper text-ink"
                      : "border-rule-strong text-transparent",
                  )}
                  aria-hidden
                >
                  ✓
                </span>
              </button>
            </li>
          );
        })}
        {list.length === 0 && (
          <li className="t-small col-span-full py-8 text-center text-bone-muted">
            Nothing matches. The universe is Robinhood Stock Tokens only.
          </li>
        )}
      </ul>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-full px-3 py-1.5 text-[12px] transition-colors",
        active ? "bg-bone text-ink" : "bg-ink text-bone-soft hover:text-bone",
      )}
    >
      {children}
    </button>
  );
}
