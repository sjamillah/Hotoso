"use client"

import { useSyncExternalStore } from "react"
import { OfflineBanner } from "./states"

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
    () => navigator.onLine,
    () => true
  )
  if (online) return null
  return <OfflineBanner className="sticky top-0 z-40" />
}
