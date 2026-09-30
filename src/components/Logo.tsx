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
          <stop offset="0%" stopColor="#f5bf8a" />
          <stop offset="55%" stopColor="#e39a5f" />
          <stop offset="100%" stopColor="#a8602c" />
        </linearGradient>
      </defs>
      <rect x="3" y="4" width="6" height="11" rx="1.5" fill="#b9b4aa" />
      <rect x="13" y="4" width="6" height="11" rx="1.5" fill="#9ab4c9" />
      <rect x="23" y="4" width="6" height="11" rx="1.5" fill="#d8c8a5" />
      <path d="M3 18 H29 L26 28 H6 Z" fill="url(#alloy-mark)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "font-display text-[22px] leading-none tracking-[0.02em] text-bone",
        className,
      )}
    >
      {siteConfig.name}
    </span>
  );
}
