/**
 * Ghana mobile numbers.
 *
 * A Ghana mobile number is 10 digits written locally ("055 123 4987") or
 * +233 followed by the same number WITHOUT its leading 0 ("+233 55 123 4987").
 * The first three local digits ("055") are the network prefix, which tells us
 * the telco.
 *
 * Telco detection is a UX hint only (we show a small chip). The seller still
 * confirms their network, because people can keep their number when they
 * switch networks.
 */

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

/** Keep only digits, and turn "+233…" or "233…" into the local "0…" form. */
export function toLocalDigits(input: string): string {
  let d = input.replace(/\D/g, "")
  if (d.startsWith("233")) d = d.slice(3)
  if (d.length > 0 && !d.startsWith("0")) d = `0${d}`
  return d.slice(0, 10)
}

/** "0551234987" → "MTN"; null if the prefix is unknown or incomplete. */
export function detectTelco(input: string): Telco | null {
  const d = toLocalDigits(input)
  return d.length >= 3 ? (PREFIXES[d.slice(0, 3)] ?? null) : null
}

/** Digits after +233, grouped for reading: "551234987" → "55 123 4987" */
export function formatAfterCountryCode(input: string): string {
  const d = toLocalDigits(input).slice(1) // drop the leading 0
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 9)].filter(Boolean).join(" ")
}

/** "055 123 4987" → "+233551234987" (the international format APIs expect) */
export function toE164(input: string): string | null {
  const d = toLocalDigits(input)
  return d.length === 10 ? `+233${d.slice(1)}` : null
}

/** "0551234987" → "055 123 4987" (how Ghanaians write numbers) */
export function formatLocal(input: string): string {
  const d = toLocalDigits(input)
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join(" ")
}
