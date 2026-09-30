import { clsx } from "clsx";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Label } from "@/components/ui/Label";

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label className="text-bone-soft">{label}</Label>
        {hint && <span className="t-small text-bone-muted">{hint}</span>}
      </div>
      {children}
      {error && <span className="t-small text-loss">{error}</span>}
    </div>
  );
}

export function TextInput({
  className,
  invalid,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      className={clsx(
        "h-11 w-full rounded-xl border bg-ink px-4 text-[15px] text-bone placeholder:text-bone-muted/70 transition-colors focus:border-copper focus:outline-none",
        invalid ? "border-loss/60" : "border-rule-strong",
        className,
      )}
      {...props}
    />
  );
}

export function Slider({
  value,
  min,
  max,
  step,
  onChange,
  ariaLabel,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  ariaLabel: string;
}) {
  const fill = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <input
      type="range"
      aria-label={ariaLabel}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ ["--fill" as string]: `${fill}%` }}
    />
  );
}
