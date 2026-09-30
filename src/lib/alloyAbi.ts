/*
 * The contract surface this site is written against. Specced from the UI
 * outward: the explore page needs every vault's summary in one call, the
 * builder needs one create call, and a vault needs mint and redeem.
 *
 * If the deployed contracts name these differently, this file is the only
 * thing to change.
 */

export const factoryAbi = [
  {
    type: "function",
    name: "count",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "vaults",
    stateMutability: "view",
    inputs: [
      { name: "offset", type: "uint256" },
      { name: "limit", type: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "vault", type: "address" },
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "creator", type: "address" },
          { name: "createdAt", type: "uint64" },
          { name: "assets", type: "string[]" },
          { name: "weightsBps", type: "uint16[]" },
          { name: "entryFeeBps", type: "uint16" },
          { name: "managementFeeBps", type: "uint16" },
          /** Vault value in USDG, 6 decimals. */
          { name: "tvl", type: "uint256" },
          /** Portfolio tokens outstanding, 18 decimals. */
          { name: "totalSupply", type: "uint256" },
          { name: "holders", type: "uint32" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "create",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "assets", type: "string[]" },
      { name: "weightsBps", type: "uint16[]" },
      { name: "entryFeeBps", type: "uint16" },
      { name: "managementFeeBps", type: "uint16" },
      /** Seed in USDG, 6 decimals. Pulled via allowance. */
      { name: "seed", type: "uint256" },
    ],
    outputs: [{ name: "vault", type: "address" }],
  },
] as const;

export const vaultAbi = [
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "usdgAmount", type: "uint256" },
      { name: "minShares", type: "uint256" },
    ],
    outputs: [{ name: "shares", type: "uint256" }],
  },
  {
    type: "function",
    name: "redeem",
    stateMutability: "nonpayable",
    inputs: [{ name: "shares", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "claimFees",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
] as const;

export const erc20Abi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const USDG_DECIMALS = 6;
export const SHARE_DECIMALS = 18;
