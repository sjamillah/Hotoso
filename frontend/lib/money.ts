/**
 * Money helpers: the ONLY place the frontend formats or parses money
 * (CLAUDE.md rule 1).
 *
 * Every amount is an integer number of pesewas ("minor units").
 *   GHS 456.75  →  45675
 * We never use decimals (floats) for money, because computers store them
 * approximately: in JavaScript 0.1 + 0.2 === 0.30000000000000004.
 */

/** An integer number of pesewas. The name is a reminder, not a new type. */
export type Minor = number

const PESEWAS_PER_CEDI = 100

const groupThousands = new Intl.NumberFormat("en-GH", {
  maximumFractionDigits: 0,
  useGrouping: true,
})

function assertMinor(minor: Minor): void {
  if (!Number.isSafeInteger(minor) || minor < 0) {
    throw new Error(`Expected a non-negative integer of pesewas, got ${minor}`)
  }
}

/** Split 45675 into { cedis: 456, pesewas: 75 } using integer maths only. */
function split(minor: Minor) {
  assertMinor(minor)
  const pesewas = minor % PESEWAS_PER_CEDI
  const cedis = (minor - pesewas) / PESEWAS_PER_CEDI
  return { cedis, pesewas }
}

/** 135000 → "1,350.00" (no currency). Use for receipts and aligned columns. */
export function formatAmount(minor: Minor): string {
  const { cedis, pesewas } = split(minor)
  return `${groupThousands.format(cedis)}.${String(pesewas).padStart(2, "0")}`
}

/** 45675 → "GHS 456.75" */
export function formatGHS(minor: Minor): string {
  return `GHS ${formatAmount(minor)}`
}

/**
 * Short form for sentences: drops ".00" on whole amounts.
 * 45000 → "GHS 450"   ·   45675 → "GHS 456.75"
 */
export function formatGHSShort(minor: Minor): string {
  const { cedis, pesewas } = split(minor)
  if (pesewas === 0) return `GHS ${groupThousands.format(cedis)}`
  return formatGHS(minor)
}

/**
 * How a screen reader should say an amount (doc 04 §7).
 * 45675 → "456 cedis 75 pesewas"
 */
export function amountAriaLabel(minor: Minor): string {
  const { cedis, pesewas } = split(minor)
  const c = `${cedis} ${cedis === 1 ? "cedi" : "cedis"}`
  if (pesewas === 0) return c
  return `${c} ${pesewas} ${pesewas === 1 ? "pesewa" : "pesewas"}`
}

/**
 * Turn what a person typed into pesewas, WITHOUT floats.
 * "450" → 45000 · "1,350.5" → 135050 · "12.345" → null (too many decimals)
 * Returns null when the text isn't a valid amount.
 */
export function parseGhsInput(text: string): Minor | null {
  const cleaned = text.replace(/[,\s]/g, "").replace(/^GHS/i, "")
  const match = /^(\d{1,7})(?:\.(\d{0,2}))?$/.exec(cleaned)
  if (!match) return null
  const cedis = Number(match[1])
  const pesewas = Number((match[2] ?? "").padEnd(2, "0"))
  return cedis * PESEWAS_PER_CEDI + pesewas
}
