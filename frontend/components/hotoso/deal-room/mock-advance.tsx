"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

export function MockAdvance({ to, afterMs = 5000 }: { to: string; afterMs?: number }) {
  const router = useRouter()
  React.useEffect(() => {
    const t = setTimeout(() => router.replace(to), afterMs)
    return () => clearTimeout(t)
  }, [to, afterMs, router])
  return null
}
