import { clsx } from "clsx";
import type { ReactNode } from "react";

/** A key on the sheet: mono, tracked out, uppercase. */
export function Label({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={clsx("t-label text-bone-muted", className)}>{children}</span>
  );
}

/**
 * Marks data as pre-launch. The figures beside it are worked examples, not
 * readings off the chain — the tag is what keeps a sample vault from
 * asserting activity that has not happened.
 */
export function PreviewTag({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "t-label inline-flex items-center gap-1.5 rounded-full bg-copper/12 px-2.5 py-1 text-copper ring-1 ring-inset ring-copper/35",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-copper shadow-[0_0_8px_1px_rgba(255,156,85,0.7)]" />
      Preview
    </span>
  );
}

export function Pill({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "copper" | "gain" | "loss";
}) {
  const tones = {
    neutral: "ring-white/12 bg-white/4 text-bone-soft",
    copper: "ring-copper/35 bg-copper/12 text-copper",
    gain: "ring-gain/35 bg-gain/10 text-gain",
    loss: "ring-loss/35 bg-loss/10 text-loss",
  } as const;
  return (
    <span
      className={clsx(
        "t-label inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
