import { clsx } from "clsx";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/*
 * One filled button — the ingot, in copper — because pressing it is the
 * act the page exists for. Everything else is a ghost.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 disabled:cursor-not-allowed select-none";

const sizes = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[14px]",
  lg: "h-13 px-7 text-[15px]",
} as const;

const variants = {
  solid: "ingot",
  ghost:
    "text-bone ring-1 ring-rule-strong ring-inset hover:bg-bone hover:text-ink disabled:text-bone-muted disabled:hover:bg-transparent disabled:hover:text-bone-muted",
  quiet:
    "text-bone-soft hover:text-bone hover:bg-ink-3 disabled:text-bone-muted",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

export function Button({
  children,
  variant = "solid",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      type="button"
      className={clsx(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "solid",
  size = "md",
  className,
  external = false,
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
}) {
  const cls = clsx(base, sizes[size], variants[variant], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
