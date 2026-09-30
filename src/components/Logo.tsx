import { clsx } from "clsx";
import { siteConfig } from "@/lib/site-config";

/**
 * The mark: three bars pouring into one. Many inputs, one ingot — the whole
 * product in a glyph small enough for a favicon.
 */
export function Mark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      focusable="false"
      className={clsx("shrink-0", className)}
    >
      <defs>
        <linearGradient id="alloy-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe0bd" />
          <stop offset="45%" stopColor="#ff9c55" />
          <stop offset="100%" stopColor="#b34c1a" />
        </linearGradient>
        <linearGradient id="alloy-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <rect x="3" y="4" width="6" height="11" rx="2" fill="url(#alloy-bar)" />
      <rect x="13" y="4" width="6" height="11" rx="2" fill="url(#alloy-bar)" />
      <rect x="23" y="4" width="6" height="11" rx="2" fill="url(#alloy-bar)" />
      <path d="M3 18 H29 L26 28 H6 Z" fill="url(#alloy-mark)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "font-display text-[20px] font-semibold leading-none tracking-[-0.03em] text-bone",
        className,
      )}
    >
      {siteConfig.name}
    </span>
  );
}
