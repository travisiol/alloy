"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Field";
import { Label } from "@/components/ui/Label";
import { fmtBps, fmtUsd } from "@/lib/format";
import { limits } from "@/lib/site-config";

/*
 * The creator's side of the deal, with the arithmetic done in front of
 * them. Three sliders, one number: what a given fee on a given inflow
 * pays out after the protocol's cut. Nothing here is a projection of what
 * anyone will earn — the inflow is the visitor's own guess.
 */
export function Creators() {
  const [entryBps, setEntryBps] = useState(100);
  const [mgmtBps, setMgmtBps] = useState(50);
  const [inflow, setInflow] = useState(250_000);

  const keep = 1 - limits.protocolFeeShareBps / 10_000;
  const entryEarn = ((inflow * entryBps) / 10_000) * keep;
  const mgmtEarn = ((inflow * mgmtBps) / 10_000) * keep;

  return (
    <section id="creators" className="scroll-mt-16 border-y border-rule bg-ink-2/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <Label className="text-copper">For creators</Label>
          <h2 className="t-display mt-3 text-bone">
            Your allocation, <em>your fee.</em>
          </h2>
          <p className="t-body mt-5 max-w-[46ch] text-bone-soft">
            Set an entry fee between 0 and {fmtBps(limits.maxEntryFeeBps)} on
            every mint, and an optional management fee up to{" "}
            {fmtBps(limits.maxManagementFeeBps)} a year on what the vault holds.
            {" "}{siteName()} keeps {fmtBps(limits.protocolFeeShareBps)} of what you
            earn. The rest accrues to your address and is yours to claim whenever
            you like.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {[
              "Fees settle in USDG, not in your own token.",
              "Change nothing after launch: the weights, the fee and the name are fixed at forge time, so holders know exactly what they bought.",
              "No minimum audience. A vault with one holder works the same as a vault with a thousand.",
            ].map((line) => (
              <li key={line} className="t-body flex gap-3 text-bone-soft">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 sm:p-8">
          <Label className="text-bone-soft">Fee calculator</Label>

          <div className="mt-6 flex flex-col gap-6">
            <Control
              label="Entry fee"
              value={fmtBps(entryBps)}
              min={0}
              max={limits.maxEntryFeeBps}
              step={5}
              current={entryBps}
              onChange={setEntryBps}
            />
            <Control
              label="Management fee, per year"
              value={fmtBps(mgmtBps)}
              min={0}
              max={limits.maxManagementFeeBps}
              step={5}
              current={mgmtBps}
              onChange={setMgmtBps}
            />
            <Control
              label="Minted into your vault, over a year"
              value={fmtUsd(inflow)}
              min={10_000}
              max={5_000_000}
              step={10_000}
              current={inflow}
              onChange={setInflow}
            />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-rule pt-6">
            <div>
              <dt className="t-label text-bone-muted">From entry fees</dt>
              <dd className="t-figure mt-2 text-bone">{fmtUsd(entryEarn)}</dd>
            </div>
            <div>
              <dt className="t-label text-bone-muted">From management</dt>
              <dd className="t-figure mt-2 text-bone">{fmtUsd(mgmtEarn)}</dd>
            </div>
            <div className="col-span-2 rounded-xl bg-ink px-4 py-3">
              <dt className="t-label text-copper">You keep</dt>
              <dd className="t-figure mt-2 copper-text">
                {fmtUsd(entryEarn + mgmtEarn)}
              </dd>
              <p className="t-small mt-2 text-bone-muted">
                After the {fmtBps(limits.protocolFeeShareBps)} protocol share.
                Assumes the vault holds the inflow all year. Your inputs, not a
                forecast.
              </p>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function siteName() {
  return "Alloy";
}

function Control({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <span className="t-small text-bone-soft">{label}</span>
        <span className="t-figure-sm text-bone">{value}</span>
      </div>
      <Slider
        ariaLabel={label}
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={onChange}
      />
    </div>
  );
}
