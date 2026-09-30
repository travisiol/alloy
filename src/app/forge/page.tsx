import type { Metadata } from "next";
import { ForgeClient } from "@/components/forge/ForgeClient";
import { Label } from "@/components/ui/Label";

export const metadata: Metadata = {
  title: "Forge a portfolio",
  description:
    "Pick tokenized stocks, set the weights and fees, seed it and sign once.",
};

export default function ForgePage() {
  return (
    <>
      <div className="border-b border-rule">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6">
          <Label className="text-copper">The forge</Label>
          <h1 className="t-display mt-3 text-bone">
            Build the basket, <em>mint the token.</em>
          </h1>
          <p className="t-lead mt-4 max-w-[54ch] text-bone-soft">
            Everything you set here is fixed the moment you sign. Take your time
            with the weights; the draft is saved as you go.
          </p>
        </div>
      </div>
      <ForgeClient />
    </>
  );
}
