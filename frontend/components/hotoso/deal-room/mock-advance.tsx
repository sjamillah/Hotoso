"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

/**
 * MOCK ONLY: moves the demo to the next status after a few seconds, like the
 * backend's SIMULATE mode will (doc 03 §4.2: "SimulatedPayoutProvider:
 * schedules a fake transfer.success after about 5 seconds").
 *
 * In M5 this disappears. Instead the page asks the backend for the deal's
 * status, and the backend's webhook handler moves the deal forward.
 */
export function MockAdvance({ to, afterMs = 5000 }: { to: string; afterMs?: number }) {
  const router = useRouter()
  React.useEffect(() => {
    const t = setTimeout(() => router.replace(to), afterMs)
    return () => clearTimeout(t) // stop if the person leaves first
  }, [to, afterMs, router])
  return null
}
