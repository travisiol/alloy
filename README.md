# ALLOY

Forge your own portfolio. Pick real tokenized stocks, set the weights, pour
them into one token anyone can buy with a single signature.

Every Alloy is a vault of Robinhood Stock Tokens on Robinhood Chain and a
receipt token for it: hold 1% of the tokens and you own 1% of every position.
Burn the tokens and the vault hands the stocks back, pro rata, in the same
transaction. Nobody custodies anything.

`Alloy` is one string in `src/lib/site-config.ts` plus the
`NEXT_PUBLIC_ALLOY_*` env prefix, so renaming is a two-line change.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · wagmi v3 + viem ·
framer-motion · TypeScript. Injected wallets only, Robinhood Chain, no backend.

## Pages

| Route | What it is |
| --- | --- |
| `/` | The pitch: hero, asset universe, worked examples, how it works, what backs a token, creator fee calculator, FAQ. |
| `/portfolios` | Every vault, searchable by name, ticker or a stock inside, sorted by value, age, fee or holders. |
| `/portfolios/[slug]` | One vault: composition table, terms, and a buy / redeem panel that shows the arithmetic before the signature. |
| `/forge` | The builder: pick 2–20 assets, weight them to the basis point, name it, set entry and management fees, seed it, sign once. The draft survives a reload. |

## The contract this page expects

The ABI in `src/lib/alloyAbi.ts` is specced from the UI outward:

| Function | Why |
| --- | --- |
| `Factory.vaults(offset, limit)` | The explore page needs every vault's summary in one call, so the factory returns a struct array (name, symbol, creator, assets, weights, fees, TVL in USDG, supply, holders). |
| `Factory.create(name, symbol, assets[], weightsBps[], entryFeeBps, managementFeeBps, seed)` | One signature from the builder. Weights must sum to 10,000. |
| `Vault.mint(usdgAmount, minShares)` | Buy. The site passes a 0.5% slippage floor. |
| `Vault.redeem(shares)` | Burn for the constituent stock tokens. No fee. |
| `Vault.claimFees()` | Creator payout. |

The rules the builder enforces (2–20 assets, entry fee ≤ 3%, management fee
≤ 2% a year, protocol keeps 10% of fees, minimum seed 100 USDG) live in
`limits` in `src/lib/site-config.ts` and should match what the factory checks.

If the deployed contracts name these differently, that one file is the only
thing to change.

## Pre-launch state

The site ships before the contracts do, so it runs entirely on env vars:

- With no factory address the list is six worked examples from
  `src/lib/preview.ts`, tagged **Preview** on every card, page and the nav.
  Their figures are illustrations, not readings, and the FAQ says so.
- Wallets connect. Forge, buy and redeem buttons stay disabled and say why.
- Everything flips to chain reads the moment `NEXT_PUBLIC_ALLOY_FACTORY_ADDRESS`,
  `NEXT_PUBLIC_ALLOY_USDG_ADDRESS` and `NEXT_PUBLIC_ALLOY_LIVE=true` exist.
  No code change. The factory is polled every 20 seconds.
- No yield, APY, performance chart or price history appears anywhere. There is
  no oracle in this build, so there is nothing honest to draw.

## Asset universe

`src/data/assets.json` is a curated subset of the Robinhood Stock Tokens (the
list on chain is 190+). It is data, not code: extending it is a JSON edit.
Tickers are drawn as two-letter marks in a colour derived from the symbol, so
a stock looks the same on every chart and no logo licensing is involved.

## Setup

```bash
npm install
cp .env.example .env.local   # optional — it runs with no env at all
npm run dev
```

## Going live

1. Deploy a factory and vault exposing the functions above.
2. Set `NEXT_PUBLIC_ALLOY_FACTORY_ADDRESS`, `NEXT_PUBLIC_ALLOY_USDG_ADDRESS`
   and `NEXT_PUBLIC_ALLOY_LIVE=true`.
3. Set `NEXT_PUBLIC_ROBINHOOD_RPC_URL` to a private endpoint — the public RPC
   will rate-limit under real traffic.
4. Set `NEXT_PUBLIC_SITE_URL` so metadata, `sitemap.xml` and `robots.txt`
   point at the real domain.
5. Re-verify the Robinhood Chain details in `src/lib/chain.ts` (chain id,
   RPC, explorer) against `docs.robinhood.com/chain`. They are third-party
   research and unverified.

Social links stay hidden until their env vars are set, so no dead link ships.

## Art direction

A foundry, not a terminal. Graphite surfaces, an editorial serif for the
headlines, a grotesk for reading and a mono for every number. Copper is the
one warm colour on the page and it is reserved for value and action: the
wordmark, the filled button, the fee you keep. Composition rings use a
metallic categorical palette keyed to the ticker.

The hero's object is a real entry from the list drawn as a card, not a
mock-up, so the thing being sold is visible before a word of explanation.

## Verification

`npx tsc --noEmit`, `npx eslint` and `npx next build` all pass clean.
