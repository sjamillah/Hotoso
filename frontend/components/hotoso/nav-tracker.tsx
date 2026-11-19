"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export const TRAIL_KEY = "hotoso:trail"
export const TRAIL_EVENT = "hotoso:trail-changed"

export function readTrail(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(TRAIL_KEY) ?? "[]") as string[]
  } catch {
    return []
  }
}

export function NavTracker() {
  const pathname = usePathname()
  useEffect(() => {
    try {
      const trail = readTrail()
      if (trail[trail.length - 1] === pathname) return
      if (trail[trail.length - 2] === pathname) trail.pop()
      else trail.push(pathname)
      sessionStorage.setItem(TRAIL_KEY, JSON.stringify(trail.slice(-30)))
      window.dispatchEvent(new Event(TRAIL_EVENT))
    } catch {
    }
  }, [pathname])
  return null
}
