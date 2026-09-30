"use client";

import { useId } from "react";
import { assetHue } from "@/lib/assets";
import type { Holding } from "@/lib/portfolios";

/*
 * Composition as a ring. Each holding takes its arc in proportion to its
 * weight, in the ticker's own colour, with a hairline gap between arcs so
 * a two-asset basket still reads as two things and not one.
 */
export function Donut({
  holdings,
  size = 200,
  thickness = 22,
  label,
  sublabel,
}: {
  holdings: Holding[];
  size?: number;
  thickness?: number;
  label?: string;
  sublabel?: string;
}) {
  const id = useId();
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = holdings.reduce((sum, h) => sum + h.weightBps, 0) || 1;
  const gap = holdings.length > 1 ? 3 : 0;

  const arcs = holdings
    .filter((h) => h.weightBps > 0)
    .reduce<{ symbol: string; len: number; offset: number }[]>((acc, h) => {
      const prev = acc[acc.length - 1];
      const offset = prev ? prev.offset + (prev.len + gap) : 0;
      const len = (h.weightBps / total) * c;
      acc.push({ symbol: h.symbol, len: Math.max(len - gap, 0), offset });
      return acc;
    }, []);

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
      role="img"
      aria-label={holdings
        .map((h) => `${h.symbol} ${(h.weightBps / 100).toFixed(1)}%`)
        .join(", ")}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--graphite-4)"
          strokeWidth={thickness}
        />
        {arcs.length === 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--rule-strong)"
            strokeWidth={1}
            strokeDasharray="4 6"
          />
        )}
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {arcs.map((arc) => (
            <circle
              key={arc.symbol}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={`hsl(${assetHue(arc.symbol)} 34% 64%)`}
              strokeWidth={thickness}
              strokeDasharray={`${arc.len} ${c - arc.len}`}
              strokeDashoffset={-arc.offset}
              style={{ transition: "stroke-dasharray 400ms ease, stroke-dashoffset 400ms ease" }}
            />
          ))}
        </g>
      </svg>
      {(label || sublabel) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {label && <span className="t-figure text-bone">{label}</span>}
          {sublabel && (
            <span className="t-label mt-1.5 text-bone-muted">{sublabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
