"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import { Mark, Wordmark } from "@/components/Logo";
import { WalletConnect } from "@/components/WalletConnect";
import { ButtonLink } from "@/components/ui/Button";
import { PreviewTag } from "@/components/ui/Label";
import { useApp } from "@/lib/appState";

const links = [
  { href: "/portfolios", label: "Explore" },
  { href: "/forge", label: "Forge" },
  { href: "/#how", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { isPreview } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Mark />
          <Wordmark />
        </Link>

        {isPreview && <PreviewTag className="hidden sm:inline-flex" />}

        <ul className="ml-4 hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const path = link.href.split("#")[0];
            const active = path.length > 1 && pathname.startsWith(path);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "rounded-full px-3.5 py-2 text-[14px] transition-colors",
                    active
                      ? "bg-ink-3 text-bone"
                      : "text-bone-soft hover:bg-ink-3 hover:text-bone",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:block">
            <ButtonLink href="/forge" size="sm">
              Forge a portfolio
            </ButtonLink>
          </span>
          <span className="hidden md:block">
            <WalletConnect compact />
          </span>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-bone-soft hover:bg-ink-3 hover:text-bone md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? (
                <path d="M3 3l12 12M15 3L3 15" />
              ) : (
                <path d="M2 4.5h14M2 9h14M2 13.5h14" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-rule bg-ink px-4 py-3 md:hidden">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-[15px] text-bone-soft hover:bg-ink-3 hover:text-bone"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex flex-col gap-2">
              <ButtonLink href="/forge" className="w-full">
                Forge a portfolio
              </ButtonLink>
              <WalletConnect wrapperClassName="w-full" className="w-full" />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
