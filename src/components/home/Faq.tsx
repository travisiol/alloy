import { Label } from "@/components/ui/Label";
import { fmtBps } from "@/lib/format";
import { limits, siteConfig } from "@/lib/site-config";

/*
 * Written against the misreadings that would cost someone money, in the
 * order they would come up. The first answer says what the token is; the
 * second says what it is not.
 */
const entries = [
  {
    q: "What am I actually buying?",
    a: `A token that is a claim on a vault of real tokenized stocks. The vault holds Robinhood Stock Tokens in the weights the creator set, and your share of the token supply is your share of every position in it. Nothing is synthetic and nothing tracks a price from somewhere else.`,
  },
  {
    q: "Is this a fund, or a security?",
    a: `It is a vault contract and a receipt token, forged by whoever created it. ${siteConfig.name} is not a fund manager, does not take custody, and does not rebalance anything on your behalf. Whether the stock tokens themselves are available to you depends on where you live and on their issuer's terms.`,
  },
  {
    q: "Can I get the stocks back?",
    a: "Yes, whenever you want. Burn your portfolio tokens and the vault sends you its constituent stock tokens pro rata in the same transaction. Redemption is always open: there is no lockup, no queue and no fee on the way out.",
  },
  {
    q: "What does it cost to buy in?",
    a: `The creator's entry fee, which is between 0 and ${fmtBps(limits.maxEntryFeeBps)} and shown before you sign, plus gas. Some vaults also carry a management fee of up to ${fmtBps(limits.maxManagementFeeBps)} a year, streamed from the vault's holdings. Both are fixed at forge time and cannot be raised later.`,
  },
  {
    q: "Does the vault rebalance?",
    a: "Not on its own. Every mint buys the stocks in the target weights and every redemption sells them pro rata, which pulls the vault back toward its targets over time. Between those, positions drift with their prices, exactly like a basket you held yourself.",
  },
  {
    q: "What can the creator change after launch?",
    a: "Nothing. Weights, fees, name and ticker are immutable once forged. A creator who wants a different allocation forges a new vault. That is the point: what you bought is what you hold.",
  },
  {
    q: "Where are the stocks held?",
    a: `In the vault contract on Robinhood Chain, at an address you can read at any time. ${siteConfig.name} has no key to it. Neither does the creator.`,
  },
  {
    q: "Which wallet, which chain?",
    a: "Any injected wallet on Robinhood Chain, paid in USDG. The site prompts you to switch networks if you are somewhere else. Cross-chain buys route through a single intent so you sign once, wherever your funds are.",
  },
  {
    q: "How do creators get paid?",
    a: `Entry fees are taken in USDG at mint and management fees accrue against the vault's holdings. ${siteConfig.name} keeps ${fmtBps(limits.protocolFeeShareBps)} of both; the rest sits in the vault for the creator to claim whenever they like.`,
  },
  {
    q: "Is any of this live yet?",
    a: "The contracts are not deployed. Everything on this site runs on worked examples labelled Preview, every write button is disabled and says so, and the figures are illustrations rather than readings. It all switches to the chain the moment the factory address is set.",
  },
] as const;

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Label className="text-copper">Questions</Label>
      <h2 className="t-display mt-3 text-bone">
        Before you <em>sign.</em>
      </h2>

      <dl className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.q} className="border-t border-rule pt-5">
            <dt className="t-title text-bone">{entry.q}</dt>
            <dd className="t-body mt-3 max-w-[56ch] text-bone-soft">{entry.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
