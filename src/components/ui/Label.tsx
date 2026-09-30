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
        "t-label inline-flex items-center gap-1.5 rounded-full border border-copper/40 bg-copper/10 px-2.5 py-1 text-copper",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-copper" />
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
    neutral: "border-rule-strong text-bone-soft",
    copper: "border-copper/40 bg-copper/10 text-copper",
    gain: "border-gain/40 bg-gain/10 text-gain",
    loss: "border-loss/40 bg-loss/10 text-loss",
  } as const;
  return (
    <span
      className={clsx(
        "t-label inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
