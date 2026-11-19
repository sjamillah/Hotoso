"use client"

import * as React from "react"
import Image from "next/image"
import { HoldStrip } from "@/components/hotoso/hold-strip"
import type { DealStatus } from "@/lib/types"
import { photos } from "@/lib/photos"

/**
 * The hero's example deal, playing itself out: link sent → paid → shipped →
 * paid out, then again. Where other sites put a star rating, we show the
 * product WORKING.
 *
 * Purposeful details:
 *  - it pauses while you hover or focus it (so you can read it);
 *  - with "reduce motion" on, it stays still on "held safely".
 */
const STAGES: { status: DealStatus; label: string; extra?: Record<string, string> }[] = [
  { status: "awaiting_payment", label: "Link sent on WhatsApp" },
  { status: "funded", label: "Kwame paid. Ama ships.", extra: { shipBy: "Fri, 20 Nov" } },
  { status: "shipped", label: "On the way to Kumasi", extra: { releaseAt: "Sat 21 Nov" } },
  { status: "released", label: "Kwame confirmed. Ama is paid.", extra: { doneOn: "21 Nov" } },
]

export function HeroLiveCard() {
  const [i, setI] = React.useState(1)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce || paused) return
    const t = setInterval(() => setI((n) => (n + 1) % STAGES.length), 3200)
    return () => clearInterval(t)
  }, [paused])

  const stage = STAGES[i]
  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      tabIndex={0}
      aria-label="An example deal, playing through its stages"
      className="w-full rounded-md bg-paper p-4 text-ink shadow-sheet sm:max-w-[380px]"
    >
      <div className="flex items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-muted">
          <Image src={photos.af1Black} alt="" fill sizes="96px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold">Black AF1, size 42</p>
          <p className="label-caps text-ink-2">Example deal · @ama.kicks</p>
        </div>
        <p className="font-mono text-base tabular-nums">450.00</p>
      </div>
      <div className="mt-4 border-t border-rule pt-4">
        <HoldStrip status={stage.status} amountMinor={45000} buyerName="Kwame" sellerName="Ama" {...stage.extra} />
      </div>
      {/* a tiny progress row: which stage we're on */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {STAGES.map((s, n) => (
            <span key={s.status} className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${n <= i ? "bg-ink" : "bg-rule"}`} />
          ))}
        </div>
        <p aria-live="polite" className="label-mono shrink-0 text-ink-2">{stage.label}</p>
      </div>
    </div>
  )
}
