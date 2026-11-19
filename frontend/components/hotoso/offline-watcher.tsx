"use client"

import { useSyncExternalStore } from "react"
import { OfflineBanner } from "./states"

/**
 * Shows "You're offline" across the top of EVERY page when the phone loses
 * its connection, and hides it when the connection comes back.
 *
 * `useSyncExternalStore` is React's way of reading something that lives
 * outside React (here: the browser's online/offline status) and re-rendering
 * whenever it changes.
 */
function subscribe(callback: () => void) {
  window.addEventListener("online", callback)
  window.addEventListener("offline", callback)
  return () => {
    window.removeEventListener("online", callback)
    window.removeEventListener("offline", callback)
  }
}

export function OfflineWatcher() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // in the browser
    () => true // on the server we assume online
  )
  if (online) return null
  return <OfflineBanner className="sticky top-0 z-40" />
}
