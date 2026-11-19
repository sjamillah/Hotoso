import {
  BadgeCheck,
  Clock,
  CornerUpLeft,
  FilePlus2,
  Flag,
  ImagePlus,
  PackageCheck,
  Truck,
  TriangleAlert,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { DealEventType } from "@/lib/types"
import { RelativeTime } from "./relative-time"

/**
 * TIMELINE (doc 04 §4.5): what happened to this deal, as plain sentences.
 * Newest at the BOTTOM, like a chat, because people read it top-down as a story.
 * It's built from DealEvent rows, the same audit trail the backend keeps.
 */

export type TimelineItem = {
  id: string
  type: DealEventType
  text: string
  /** "2h ago" */
  relative: string
  /** "18 Nov 2026, 14:02" (shown on hover/focus) */
  exact: string
  /** ISO timestamp for the <time> element */
  iso: string
}

const ICONS: Record<DealEventType, { icon: LucideIcon; tone: string }> = {
  created: { icon: FilePlus2, tone: "text-ink-2" },
  payment_confirmed: { icon: Wallet, tone: "text-ink" },
  shipped: { icon: Truck, tone: "text-sky" },
  buyer_confirmed: { icon: PackageCheck, tone: "text-safe" },
  auto_released: { icon: Clock, tone: "text-safe" },
  dispute_opened: { icon: Flag, tone: "text-clay" },
  evidence_added: { icon: ImagePlus, tone: "text-ink-2" },
  released: { icon: BadgeCheck, tone: "text-safe" },
  payout_failed: { icon: TriangleAlert, tone: "text-wait" },
  refund_processed: { icon: CornerUpLeft, tone: "text-clay" },
  cancelled: { icon: X, tone: "text-ink-2" },
}

export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  if (items.length === 0) {
    return <p className="text-base text-ink-2">Nothing has happened yet.</p>
  }
  return (
    <ol className={cn("flex flex-col", className)}>
      {items.map((item, i) => {
        const { icon: Icon, tone } = ICONS[item.type]
        const last = i === items.length - 1
        return (
          <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
            {/* the thin vertical thread joining the events */}
            {!last && <span aria-hidden="true" className="absolute top-9 bottom-1 left-4 w-px bg-rule" />}
            <span
              aria-hidden="true"
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full border border-rule bg-card [&_svg]:size-4",
                tone,
                last && "border-ink"
              )}
            >
              <Icon />
            </span>
            <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3 pt-1">
              <p className="min-w-0 text-base text-ink">{item.text}</p>
              <RelativeTime iso={item.iso} relative={item.relative} exact={item.exact} />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
