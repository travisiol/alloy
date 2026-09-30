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
    <section id="how" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Label className="text-copper">How it works</Label>
        <h2 className="t-display mt-3 max-w-[20ch] text-bone">
          From a list of tickers to a token, in <em>one signature.</em>
        </h2>

        <ol className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.n} className="card glass-hover relative overflow-hidden p-6">
              {i === 2 && (
                <span
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-copper/25 blur-3xl"
                  aria-hidden
                />
              )}
              <span className="t-figure molten-text relative">{step.n}</span>
              <h3 className="t-title relative mt-5 text-bone">{step.title}</h3>
              <p className="t-body relative mt-3 text-bone-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
