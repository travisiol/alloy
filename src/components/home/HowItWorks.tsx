import { Label } from "@/components/ui/Label";
import { limits } from "@/lib/site-config";

const steps = [
  {
    n: "01",
    title: "Pick",
    body: `Choose ${limits.minAssets} to ${limits.maxAssets} tokenized stocks and funds. Every one is a real Robinhood Stock Token on Robinhood Chain — a claim on the underlying share, not a synthetic.`,
  },
  {
    n: "02",
    title: "Weight",
    body: "Set the split. Equal weight in one click, or dial each position to the basis point. The ring redraws as you go so you can see the shape of what you are building.",
  },
  {
    n: "03",
    title: "Forge",
    body: "Name it, set your entry fee, seed it with USDG and sign once. The factory buys the stocks, locks them in a vault and mints your portfolio token to you.",
  },
  {
    n: "04",
    title: "Share",
    body: "Anyone can buy your token with one signature. Every mint pays you the entry fee, and the vault holds their stocks for as long as they hold your token.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 border-y border-rule bg-ink-2/60">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Label className="text-copper">How it works</Label>
        <h2 className="t-display mt-3 max-w-[20ch] text-bone">
          From a list of tickers to a token, in <em>one signature.</em>
        </h2>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-[18px] border border-rule bg-rule md:grid-cols-4">
          {steps.map((step) => (
            <li key={step.n} className="bg-ink-2 p-6">
              <span className="t-label text-copper">{step.n}</span>
              <h3 className="t-title mt-4 text-bone">{step.title}</h3>
              <p className="t-body mt-3 text-bone-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
