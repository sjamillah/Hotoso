export type Telco = "MTN" | "Telecel" | "AirtelTigo"

const PREFIXES: Record<string, Telco> = {
  "024": "MTN",
  "025": "MTN",
  "053": "MTN",
  "054": "MTN",
  "055": "MTN",
  "059": "MTN",
  "020": "Telecel",
  "050": "Telecel",
  "026": "AirtelTigo",
  "027": "AirtelTigo",
  "056": "AirtelTigo",
  "057": "AirtelTigo",
}

export function toLocalDigits(input: string): string {
  let d = input.replace(/\D/g, "")
  if (d.startsWith("233")) d = d.slice(3)
  if (d.length > 0 && !d.startsWith("0")) d = `0${d}`
  return d.slice(0, 10)
}

export function detectTelco(input: string): Telco | null {
  const d = toLocalDigits(input)
  return d.length >= 3 ? (PREFIXES[d.slice(0, 3)] ?? null) : null
}

export function formatAfterCountryCode(input: string): string {
  const d = toLocalDigits(input).slice(1)
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 9)].filter(Boolean).join(" ")
}

export function toE164(input: string): string | null {
  const d = toLocalDigits(input)
  return d.length === 10 ? `+233${d.slice(1)}` : null
}

export function formatLocal(input: string): string {
  const d = toLocalDigits(input)
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join(" ")
}
