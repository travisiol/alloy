import { Label } from "@/components/ui/Label";

const facts = [
  {
    title: "Backed one for one",
    body: "A portfolio token is a claim on the stocks in its vault. Hold 1% of the tokens and you own 1% of every position in it. There is no basket without the stocks behind it.",
    icon: (
      <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
    ),
  },
  {
    title: "Redeem any time",
    body: "Burn your tokens and the vault hands you the constituent stock tokens directly, pro rata, in the same transaction. Redemption is never paused and never queued.",
    icon: (
      <path d="M12 4v16m0 0-5-5m5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Non-custodial",
    body: "You sign every trade. Alloy never holds your funds or your keys, and the contracts have no admin key that can move what is in a vault.",
    icon: (
      <path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "One signature, any chain",
    body: "Buy with USDG on Robinhood Chain today. Cross-chain routing brings funds in from other chains through a single intent, so a buyer signs once wherever they are.",
    icon: (
      <path d="M4 12h16m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
] as const;

export function Backing() {
  return (
    <section id="backing" className="scroll-mt-16 mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Label className="text-copper">What you actually hold</Label>
          <h2 className="t-display mt-3 text-bone">
            A token that is <em>the stocks</em>, not a promise of them.
          </h2>
          <p className="t-body mt-5 max-w-[44ch] text-bone-soft">
            Most baskets are a price feed with a ticker on it. An Alloy is a
            vault full of the real tokenized shares, and the token is the
            receipt. What backs it can be read on chain at any moment.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {facts.map((fact) => (
            <li key={fact.title} className="card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-copper/10 text-copper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  {fact.icon}
                </svg>
              </span>
              <h3 className="t-title mt-5 text-bone">{fact.title}</h3>
              <p className="t-body mt-2 text-bone-soft">{fact.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
