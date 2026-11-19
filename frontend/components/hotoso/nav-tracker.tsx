"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * Keeps a TRAIL of the Hotoso pages visited in this tab (sessionStorage is
 * per tab and cleared when the tab closes). <BackLink> shows "Back" only
 * when there's a Hotoso page behind you on the trail.
 *
 *   go forward to a new page → push it onto the trail
 *   go back to the previous page → pop the current one off
 *
 * Why not document.referrer? Next.js changes pages WITHOUT a full reload,
 * and the browser doesn't update the referrer for those in-app moves.
 */
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
      if (trail[trail.length - 1] === pathname) return // same page (e.g. a refresh)
      if (trail[trail.length - 2] === pathname) trail.pop() // went back
      else trail.push(pathname) // went forward
      sessionStorage.setItem(TRAIL_KEY, JSON.stringify(trail.slice(-30)))
      window.dispatchEvent(new Event(TRAIL_EVENT)) // tell any <BackLink> to re-check
    } catch {
      // private mode / storage blocked: Back simply stays hidden (safe default)
    }
  }, [pathname])
  return null
}
