import { ButtonLink } from "@/components/ui/Button";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="forge-glow card-raised grain relative overflow-hidden px-6 py-16 text-center sm:px-12">
        <h2 className="t-display relative mx-auto max-w-[18ch] text-bone">
          Your allocation deserves <em>a ticker.</em>
        </h2>
        <p className="t-lead relative mx-auto mt-4 max-w-[44ch] text-bone-soft">
          Two minutes from an idea to a token anyone can hold.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/forge" size="lg">
            Start forging
          </ButtonLink>
          <ButtonLink href="/portfolios" size="lg" variant="ghost">
            Browse first
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
