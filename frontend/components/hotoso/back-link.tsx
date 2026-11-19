"use client"

import { useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { TRAIL_EVENT, readTrail } from "./nav-tracker"

function canGoBackInHotoso() {
  return readTrail().length >= 2
}

function subscribe(onChange: () => void) {
  window.addEventListener(TRAIL_EVENT, onChange)
  return () => window.removeEventListener(TRAIL_EVENT, onChange)
}

export function BackLink({
  fallbackHref,
  label = "Back",
  tone = "paper",
  className,
}: {
  fallbackHref?: string
  label?: string
  tone?: "paper" | "ink"
  className?: string
}) {
  const router = useRouter()
  const internal = useSyncExternalStore(subscribe, canGoBackInHotoso, () => false)
  if (!internal && !fallbackHref) return null

  return (
    <button
      type="button"
      onClick={() => (internal ? router.back() : router.push(fallbackHref!))}
      className={cn(
        "-ml-2 inline-flex h-11 items-center gap-1.5 rounded-sm px-2 text-base font-medium transition-colors duration-150 [&_svg]:size-5",
        tone === "ink" ? "text-paper hover:bg-ink-2" : "text-ink hover:bg-muted",
        className
      )}
    >
      <ArrowLeft aria-hidden="true" />
      <span className="max-sm:sr-only">{label}</span>
    </button>
  )
}
