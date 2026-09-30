"use client";

import { useEffect, useState } from "react";
import { useConnect, useConnection, useDisconnect, useSwitchChain } from "wagmi";
import { robinhoodChain } from "@/lib/chain";
import { clsx } from "clsx";

function short(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/**
 * Whether a wallet is actually reachable in this browser.
 *
 * wagmi always registers the injected connector whether or not anything is
 * there to inject, so its presence says nothing — checking it left the
 * button enabled on a machine with no wallet, where clicking it did
 * nothing at all. This looks for a real provider instead: `window.ethereum`
 * for older wallets, and the EIP-6963 announcement that current ones use.
 *
 * Starts optimistic so the server render and the first client render agree,
 * then corrects itself once the browser has had a moment to answer.
 */
function useWalletAvailable(): boolean {
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let found = typeof window !== "undefined" && "ethereum" in window;

    const onAnnounce = () => {
      found = true;
      setAvailable(true);
    };
    window.addEventListener("eip6963:announceProvider", onAnnounce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    // Wallets answer the request synchronously in practice; the delay is
    // for the ones that do it on the next tick.
    const timer = window.setTimeout(() => setAvailable(found), 400);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("eip6963:announceProvider", onAnnounce);
    };
  }, []);

  return available;
}

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
  const {
    connect,
    connectors,
    isPending: isConnecting,
    error: connectError,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const { mutate: switchChain, isPending: isSwitching } = useSwitchChain();
  const walletAvailable = useWalletAvailable();

  const shell =
    "inline-flex h-10 items-center justify-center rounded-full px-4 text-[13px] font-medium transition-colors duration-150";

  if (isConnected && address) {
    if (chainId !== robinhoodChain.id) {
      return (
        <button
          type="button"
          onClick={() => switchChain({ chainId: robinhoodChain.id })}
          disabled={isSwitching}
          className={clsx(
            shell,
            "bg-copper text-ink hover:bg-copper-bright",
            className,
          )}
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
          "flex items-center gap-2 font-mono text-bone ring-1 ring-rule-strong ring-inset hover:bg-bone hover:text-ink",
          className,
        )}
      >
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-gain" />
        {short(address)}
      </button>
    );
  }

  const connector = connectors[0];
  const canConnect = walletAvailable && !!connector;

  return (
    <span className={clsx("inline-flex flex-col items-start gap-1", wrapperClassName)}>
      <button
        type="button"
        disabled={!canConnect || isConnecting}
        onClick={() => connector && connect({ connector })}
        title={
          canConnect ? undefined : "No browser wallet detected on this device"
        }
        className={clsx(
          shell,
          "text-bone ring-1 ring-rule-strong ring-inset hover:bg-bone hover:text-ink disabled:cursor-not-allowed disabled:text-bone-muted disabled:hover:bg-transparent disabled:hover:text-bone-muted",
          className,
        )}
      >
        {isConnecting
          ? "Connecting…"
          : canConnect
            ? "Connect wallet"
            : "No wallet found"}
      </button>

      {/* A refused or failed connection used to end in silence. */}
      {!compact && connectError && (
        <span className="t-small max-w-[240px] text-loss">
          {connectError.message.split("\n")[0]}
        </span>
      )}
      {!compact && !canConnect && !connectError && (
        <span className="t-small max-w-[240px] text-bone-muted">
          Install a browser wallet to connect.
        </span>
      )}
    </span>
  );
}
