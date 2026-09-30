import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { robinhoodChain } from "@/lib/chain";

/*
 * Browser wallets announce themselves over EIP-6963 and wagmi lists each
 * one as its own connector, so MetaMask, Rabby, Coinbase and the rest show
 * up by name in the dialog. WalletConnect covers mobile wallets by QR code
 * and only exists once a project id is configured — its SDK refuses to
 * start without one.
 */
const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() ?? "";

export const walletConnectEnabled = walletConnectProjectId.length > 0;

export const wagmiConfig = createConfig({
  chains: [robinhoodChain],
  connectors: [
    injected(),
    ...(walletConnectEnabled
      ? [
          walletConnect({
            projectId: walletConnectProjectId,
            showQrModal: true,
            metadata: {
              name: "Alloy",
              description: "Forge your own portfolio.",
              url:
                process.env.NEXT_PUBLIC_SITE_URL ?? "https://alloy.example",
              icons: [],
            },
          }),
        ]
      : []),
  ],
  transports: {
    [robinhoodChain.id]: http(),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
