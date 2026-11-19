import type { Minor } from "./money"

/**
 * Hotoso fee PREVIEW (doc 01 §5): 1.5% of the item price, paid by the buyer,
 * minimum GHS 1, maximum GHS 50.
 *
 * ⚠️ This is only for showing "Buyer pays GHS …" while a seller types.
 * The real fee is calculated by the BACKEND (common/money.py, milestone M2),
 * and the backend's number always wins: never trust the browser with money.
 * The rounding rule here (round half up) is a placeholder until we decide it
 * together in M2.
 *
 * "bps" = basis points: 1 bps = 0.01%, so 1.5% = 150 bps. Using bps keeps
 * the percentage a whole number, so all the maths stays in integers.
 */
export const FEE_BPS = 150
export const FEE_MIN_MINOR = 100 // GHS 1.00
export const FEE_MAX_MINOR = 5000 // GHS 50.00
export const DEAL_MIN_MINOR = 1000 // GHS 10
export const DEAL_MAX_MINOR = 500000 // GHS 5,000

export function previewFeeMinor(itemMinor: Minor): Minor {
  // item × 150 / 10,000, rounded half up, in integers only:
  // adding 5,000 (half of 10,000) before dividing down rounds .5 upwards.
  const raw = Math.floor((itemMinor * FEE_BPS + 5000) / 10000)
  return Math.min(FEE_MAX_MINOR, Math.max(FEE_MIN_MINOR, raw))
}
