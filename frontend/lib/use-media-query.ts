"use client"

import { useSyncExternalStore } from "react"

/**
 * true while the screen matches a CSS media query, e.g. "(min-width: 1024px)".
 * Re-renders when it changes (rotate a tablet, resize a window).
 * On the server there is no screen, so it answers `serverValue`.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => serverValue
  )
}
