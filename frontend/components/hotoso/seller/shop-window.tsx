import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatGHSShort } from "@/lib/money"
import type { Deal, DealStatus } from "@/lib/types"
import { DealImage } from "../deal-image"
import { StatusChip } from "../status-chip"
import { CategoryTag } from "../category-tag"

/**
 * "YOUR SHOP WINDOW": the seller's live products as photos, in a swipeable
 * row (CSS scroll-snap). Sellers think in PRODUCTS, not table rows, and
 * photos make the dashboard feel like their shop, not a spreadsheet.
 * Only deals still in motion appear; finished ones live in the table below.
 */
const LIVE: DealStatus[] = ["funded", "disputed", "payout_failed", "awaiting_payment", "shipped", "releasing"]

export function ShopWindow({ deals }: { deals: Deal[] }) {
  const live = deals
    .filter((d) => LIVE.includes(d.status))
    .sort((a, b) => LIVE.indexOf(a.status) - LIVE.indexOf(b.status))
  if (live.length === 0) return null

  return (
    <section aria-labelledby="window-title" className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="window-title" className="heading-caps text-ink">
          Your shop window <span className="font-mono text-ink-2">· {live.length} live</span>
        </h2>
        <p className="label-mono hidden text-ink-2 sm:block">Swipe to see all</p>
      </div>
      <ul
        tabIndex={0}
        aria-label="Your live deals. Scroll sideways to see more."
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:thin] lg:-mx-0 lg:px-0"
      >
        {live.map((deal) => (
          <li key={deal.slug} className="w-[62%] shrink-0 snap-start sm:w-[40%] lg:w-[calc((100%-4rem)/5)]">
            <Link href={`/seller/deals/${deal.slug}`} className="group flex flex-col gap-3 rounded-sm">
              <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
                <DealImage
                  photo={deal.photos[0]}
                  sizes="(min-width: 1024px) 220px, 60vw"
                  className="transition-transform duration-[900ms] ease-calm group-hover:scale-[1.05]"
                />
                <StatusChip status={deal.status} viewer="seller" className="absolute top-2 left-2" />
              </div>
              <div className="flex flex-col gap-1">
                <CategoryTag code={deal.category} />
                <p className={cn("line-clamp-2 text-base text-ink")}>{deal.title}</p>
                <p className="font-mono text-sm text-ink tabular-nums">{formatGHSShort(deal.itemMinor)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
