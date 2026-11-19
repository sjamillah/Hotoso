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

function split(minor: Minor) {
  assertMinor(minor)
  const pesewas = minor % PESEWAS_PER_CEDI
  const cedis = (minor - pesewas) / PESEWAS_PER_CEDI
  return { cedis, pesewas }
}

export function formatAmount(minor: Minor): string {
  const { cedis, pesewas } = split(minor)
  return `${groupThousands.format(cedis)}.${String(pesewas).padStart(2, "0")}`
}

export function formatGHS(minor: Minor): string {
  return `GHS ${formatAmount(minor)}`
}

export function formatGHSShort(minor: Minor): string {
  const { cedis, pesewas } = split(minor)
  if (pesewas === 0) return `GHS ${groupThousands.format(cedis)}`
  return formatGHS(minor)
}

export function amountAriaLabel(minor: Minor): string {
  const { cedis, pesewas } = split(minor)
  const c = `${cedis} ${cedis === 1 ? "cedi" : "cedis"}`
  if (pesewas === 0) return c
  return `${c} ${pesewas} ${pesewas === 1 ? "pesewa" : "pesewas"}`
}

export function parseGhsInput(text: string): Minor | null {
  const cleaned = text.replace(/[,\s]/g, "").replace(/^GHS/i, "")
  const match = /^(\d{1,7})(?:\.(\d{0,2}))?$/.exec(cleaned)
  if (!match) return null
  const cedis = Number(match[1])
  const pesewas = Number((match[2] ?? "").padEnd(2, "0"))
  return cedis * PESEWAS_PER_CEDI + pesewas
}
