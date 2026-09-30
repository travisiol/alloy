"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import {
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
  useSwitchChain,
  type Connector,
} from "wagmi";
import { robinhoodChain } from "@/lib/chain";
import { walletConnectEnabled } from "@/lib/wagmiConfig";

function short(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/**
 * Whether a legacy `window.ethereum` provider exists. Wallets that speak
 * EIP-6963 appear in `useConnectors()` on their own; this catches the ones
 * that only inject the global.
 *
 * Starts false so the server render and the first client render agree.
 */
function useLegacyProvider(): boolean {
  const [found, setFound] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(
      () => setFound("ethereum" in window && !!window.ethereum),
      0,
    );
    return () => window.clearTimeout(timer);
  }, []);
  return found;
}

const INSTALL_LINKS = [
  { name: "MetaMask", href: "https://metamask.io/download/" },
  { name: "Rabby", href: "https://rabby.io/" },
  { name: "Coinbase Wallet", href: "https://www.coinbase.com/wallet/downloads" },
] as const;

export function WalletConnect({
  className,
  wrapperClassName,
  compact = false,
}: {
  className?: string;
  /** Lets a caller stretch the control, e.g. full width inside a panel. */
  wrapperClassName?: string;
  /** Button only, no helper text underneath — for the nav rail. */
  compact?: boolean;
}) {
  const { address, isConnected, chainId } = useConnection();
  const { mutate: disconnect } = useDisconnect();
  const { mutate: switchChain, isPending: isSwitching } = useSwitchChain();
  const [open, setOpen] = useState(false);

  const shell =
    "inline-flex h-10 items-center justify-center rounded-full px-4 text-[13px] font-medium transition-colors duration-150";

  if (isConnected && address) {
    if (chainId !== robinhoodChain.id) {
      return (
        <button
          type="button"
          onClick={() => switchChain({ chainId: robinhoodChain.id })}
          disabled={isSwitching}
          className={clsx(shell, "ingot", className)}
        >
          {isSwitching ? "Switching…" : "Switch to Robinhood Chain"}
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        title="Disconnect wallet"
        className={clsx(
          shell,
          "ghost-glass flex items-center gap-2 font-mono text-bone",
          className,
        )}
      >
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-gain" />
        {short(address)}
      </button>
    );
  }

  return (
    <span className={clsx("inline-flex flex-col items-start gap-1", wrapperClassName)}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx(shell, "ghost-glass text-bone", className)}
      >
        Connect wallet
      </button>
      {!compact && (
        <span className="t-small max-w-[260px] text-bone-muted">
          Browser wallet{walletConnectEnabled ? " or mobile by QR code" : ""}, on
          Robinhood Chain.
        </span>
      )}
      {open && <ConnectDialog onClose={() => setOpen(false)} />}
    </span>
  );
}

/*
 * The connect dialog. Every wallet the browser announced is a row with its
 * own icon; WalletConnect is a row when configured; and when there is
 * nothing to list, the dialog says so and points at where to get one,
 * instead of a dead button.
 */
function ConnectDialog({ onClose }: { onClose: () => void }) {
  const connectors = useConnectors();
  const { mutateAsync: connect, isPending, variables, error, reset } =
    useConnect();
  const legacy = useLegacyProvider();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Wallets found by EIP-6963 carry their own id and icon. The generic
  // "injected" connector is wagmi's fallback for window.ethereum; show it
  // only when nothing announced itself and a provider is there anyway.
  const announced = connectors.filter(
    (c) => c.type === "injected" && c.id !== "injected",
  );
  const generic = connectors.find((c) => c.id === "injected");
  const walletConnect = connectors.find((c) => c.type === "walletConnect");

  const rows: { connector: Connector; label: string; icon?: string; hint: string }[] = [
    ...announced.map((c) => ({
      connector: c,
      label: c.name,
      icon: c.icon,
      hint: "Browser extension",
    })),
    ...(announced.length === 0 && legacy && generic
      ? [{ connector: generic, label: "Browser wallet", hint: "window.ethereum" }]
      : []),
    ...(walletConnect
      ? [{ connector: walletConnect, label: "WalletConnect", hint: "Scan with a mobile wallet" }]
      : []),
  ];

  const pendingUid = isPending
    ? typeof variables?.connector === "object"
      ? variables.connector.uid
      : undefined
    : undefined;

  const pick = async (connector: Connector) => {
    reset();
    try {
      await connect({ connector, chainId: robinhoodChain.id });
      onClose();
    } catch {
      // The error is rendered below; the dialog stays open to retry.
    }
  };

  const dialog = (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-void/70 p-3 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="connect-title"
        className="card-raised w-full max-w-[400px] overflow-hidden p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-copper/20 blur-3xl"
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <h2 id="connect-title" className="t-title text-bone">
              Connect a <em>wallet.</em>
            </h2>
            <p className="t-small mt-1 text-bone-muted">
              Robinhood Chain · you sign every transaction.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-bone-soft hover:bg-white/8 hover:text-bone"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        {rows.length > 0 ? (
          <ul className="relative mt-5 flex flex-col gap-2">
            {rows.map((row) => {
              const busy = pendingUid === row.connector.uid;
              return (
                <li key={row.connector.uid}>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => pick(row.connector)}
                    className={clsx(
                      "well flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors",
                      "hover:bg-white/6 disabled:cursor-wait",
                      busy && "ring-1 ring-copper/50",
                    )}
                  >
                    <WalletIcon icon={row.icon} label={row.label} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium text-bone">
                        {row.label}
                      </span>
                      <span className="t-small block text-bone-muted">{row.hint}</span>
                    </span>
                    <span className="t-label text-copper">
                      {busy ? "Waiting…" : "Connect"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="relative mt-5">
            <p className="t-body text-bone-soft">
              No wallet found in this browser. Install one, then come back:
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {INSTALL_LINKS.map((w) => (
                <li key={w.name}>
                  <a
                    href={w.href}
                    target="_blank"
                    rel="noreferrer"
                    className="well flex items-center justify-between rounded-2xl p-3 text-[15px] text-bone transition-colors hover:bg-white/6"
                  >
                    {w.name}
                    <span className="t-label text-bone-muted">Install ↗</span>
                  </a>
                </li>
              ))}
            </ul>
            {!walletConnectEnabled && (
              <p className="t-small mt-3 text-bone-muted">
                On a phone, use the browser inside your wallet app.
              </p>
            )}
          </div>
        )}

        {error && (
          <p className="t-small relative mt-4 text-loss">
            {error.message.split("\n")[0]}
          </p>
        )}
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

function WalletIcon({ icon, label }: { icon?: string; label: string }) {
  if (icon) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={icon} alt="" className="h-9 w-9 rounded-xl" />;
  }
  return (
    <span className="ingot flex h-9 w-9 items-center justify-center rounded-xl text-[13px] font-semibold">
      {label.slice(0, 1)}
    </span>
  );
}
