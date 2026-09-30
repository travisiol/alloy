import { ButtonLink } from "@/components/ui/Button";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="card-raised relative overflow-hidden px-6 py-20 text-center sm:px-12">
        <span
          className="pointer-events-none absolute left-1/2 top-full h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,150,70,0.55), rgba(255,110,40,0.18) 45%, transparent 72%)",
          }}
          aria-hidden
        />
        <span className="hairline-hot absolute inset-x-12 top-0" aria-hidden />
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
