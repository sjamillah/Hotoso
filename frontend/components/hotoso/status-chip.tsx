import { cn } from "@/lib/utils"
import type { DealStatus, Viewer } from "@/lib/types"

type Tone = "wait" | "butter" | "sky" | "safe" | "clay" | "muted"

type ChipDef = { label: string | Record<Viewer, string>; tone: Tone | Record<Viewer, Tone> }

const CHIPS: Record<DealStatus, ChipDef> = {
  awaiting_payment: { label: "Awaiting payment", tone: "wait" },
  funded: {
    label: { buyer: "Paid, in Hotoso", seller: "Ship now" },
    tone: { buyer: "butter", seller: "wait" },
  },
  shipped: { label: "On the way", tone: "sky" },
  disputed: { label: "Problem reported", tone: "clay" },
  releasing: { label: "Releasing", tone: "safe" },
  released: { label: "Released", tone: "safe" },
  payout_failed: {
    label: { buyer: "Releasing", seller: "Payout delayed" },
    tone: { buyer: "safe", seller: "wait" },
  },
  refunding: { label: "Refunding", tone: "clay" },
  refunded: { label: "Refunded", tone: "clay" },
  cancelled: { label: "Cancelled", tone: "muted" },
}

const TONE_CLASS: Record<Tone, string> = {
  wait: "bg-wait-soft text-wait",
  butter: "bg-butter-soft text-ink",
  sky: "bg-sky-soft text-sky",
  safe: "bg-safe-soft text-safe",
  clay: "bg-clay-soft text-clay",
  muted: "bg-muted text-ink-2",
}

export function statusChipLabel(status: DealStatus, viewer: Viewer): string {
  const l = CHIPS[status].label
  return typeof l === "string" ? l : l[viewer]
}

export function StatusChip({
  status,
  viewer = "buyer",
  className,
}: {
  status: DealStatus
  viewer?: Viewer
  className?: string
}) {
  const def = CHIPS[status]
  const tone = typeof def.tone === "string" ? def.tone : def.tone[viewer]
  return (
    <span
      className={cn(
        "label-caps inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 whitespace-nowrap",
        TONE_CLASS[tone],
        className
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {statusChipLabel(status, viewer)}
    </span>
  )
}
