const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function fmtUsd(value: number, cents = false): string {
  return cents ? usdCents.format(value) : usd.format(value);
}

export function fmtCompactUsd(value: number): string {
  if (value < 10_000) return usd.format(value);
  return `$${compact.format(value)}`;
}

export function fmtNumber(value: number, digits = 0): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function fmtPct(bps: number, digits = 2): string {
  return `${(bps / 100).toFixed(digits).replace(/\.?0+$/, "")}%`;
}

export function fmtBps(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
