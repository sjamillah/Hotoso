import type { Minor } from "./money"

export const FEE_BPS = 150
export const FEE_MIN_MINOR = 100
export const FEE_MAX_MINOR = 5000
export const DEAL_MIN_MINOR = 1000
export const DEAL_MAX_MINOR = 500000

export function previewFeeMinor(itemMinor: Minor): Minor {
  const raw = Math.floor((itemMinor * FEE_BPS + 5000) / 10000)
  return Math.min(FEE_MAX_MINOR, Math.max(FEE_MIN_MINOR, raw))
}
