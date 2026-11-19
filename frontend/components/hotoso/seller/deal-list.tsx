import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatAmount } from "@/lib/money"
import type { Deal, DealStatus } from "@/lib/types"
import { DealThumb } from "../deal-thumb"
import { CategoryTag } from "../category-tag"
import { StatusChip } from "../status-chip"
import { DealTabs, type DealTabGroup } from "./deal-tabs"

const ALL_STATUSES: DealStatus[] = ["funded", "disputed", "payout_failed", "awaiting_payment", "shipped", "releasing", "refunding", "released", "refunded", "cancelled"]

const GROUPS: { key: string; label: string; statuses: DealStatus[]; empty: string }[] = [
  { key: "all", label: "All", statuses: ALL_STATUSES, empty: "No deals yet." },
  { key: "ship", label: "Ship now", statuses: ["funded"], empty: "Nothing to ship right now." },
  { key: "awaiting", label: "Awaiting payment", statuses: ["awaiting_payment"], empty: "No links waiting for payment." },
  { key: "progress", label: "In progress", statuses: ["shipped", "releasing"], empty: "Nothing on the way." },
  { key: "problems", label: "Problems", statuses: ["disputed", "payout_failed", "refunding"], empty: "No problems. Nice." },
  { key: "done", label: "Done", statuses: ["released", "refunded", "cancelled"], empty: "No finished deals yet." },
]

export function SellerDealList({
  deals,
  selectedSlug,
  layout = "compact",
}: {
  deals: Deal[]
  selectedSlug?: string
  layout?: "compact" | "table"
}) {
  const table = layout === "table"
  const groups: DealTabGroup[] = GROUPS.map((g) => {
    const items = deals
      .filter((d) => g.statuses.includes(d.status))
      .sort((a, b) => g.statuses.indexOf(a.status) - g.statuses.indexOf(b.status))
    return {
      key: g.key,
      label: g.label,
      count: items.length,
      urgent: g.key === "ship" || g.key === "problems",
      quietCount: g.key === "all",
      content: items.length ? (
        <div>
          {table && (
            <div aria-hidden="true" className="label-caps hidden grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.3fr)_7rem] gap-4 border-b border-ink px-2 pb-2 text-ink-2 lg:grid">
              <span>Item</span>
              <span>Buyer</span>
              <span>Status</span>
              <span>Next step</span>
              <span className="text-right">Amount</span>
            </div>
          )}
          <ul className="flex flex-col divide-y divide-rule">
            {items.map((d) => (
              <li key={d.slug}>
                <DealRow deal={d} selected={d.slug === selectedSlug} table={table} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="py-6 text-base text-ink-2">{g.empty}</p>
      ),
    }
  })
  const firstWithItems = groups.find((g) => g.key !== "all" && g.count > 0)?.key ?? "all"
  return <DealTabs groups={groups} defaultKey={table ? "all" : firstWithItems} />
}

function nextStep(deal: Deal): string {
  switch (deal.status) {
    case "awaiting_payment": return "Waiting for payment"
    case "funded": return `Ship by ${deal.shipBy} · ${deal.shipByCountdown} left`
    case "shipped": return `Releases in ${deal.releaseCountdown ?? "3d"}`
    case "disputed": return "Add your side"
    case "releasing": return "On its way to your MoMo"
    case "released": return `Paid ${deal.doneOn ?? ""}`.trim()
    case "payout_failed": return "Check your MoMo number"
    case "refunding": return "Refunding the buyer"
    case "refunded": return `Refunded ${deal.doneOn ?? ""}`.trim()
    case "cancelled": return "No money moved"
  }
}

function DealRow({ deal, selected, table }: { deal: Deal; selected: boolean; table: boolean }) {
  const urgent = deal.status === "funded" && deal.shipByCountdown === "18h"
  const sub =
    deal.status === "funded" ? `Ship by ${deal.shipByCountdown}`
    : deal.status === "awaiting_payment" ? "Link shared"
    : deal.status === "shipped" ? `Releases in ${deal.releaseCountdown ?? "3d"}`
    : null

  return (
    <Link
      href={`/seller/deals/${deal.slug}`}
      aria-current={selected ? "page" : undefined}
      className={cn("-mx-2 block rounded-sm px-2 py-3 transition-colors duration-150 hover:bg-card", selected && "bg-card", table && "lg:mx-0")}
    >
      {table && (
        <div className="hidden grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.3fr)_7rem] items-center gap-4 lg:grid">
          <div className="flex min-w-0 items-center gap-3">
            <DealThumb photo={deal.photos[0]} size={56} className="rounded-md" />
            <div className="min-w-0">
              <p className="truncate text-base font-medium text-ink">{deal.title}</p>
              <CategoryTag code={deal.category} />
            </div>
          </div>
          <span className="truncate text-base text-ink">{deal.buyer?.firstName ?? <span className="text-ink-2">No buyer yet</span>}</span>
          <span><StatusChip status={deal.status} viewer="seller" /></span>
          <span className={cn("text-sm", urgent ? "font-semibold text-wait" : "text-ink-2")}>{nextStep(deal)}</span>
          <span className="text-right font-mono text-base text-ink tabular-nums">{formatAmount(deal.itemMinor)}</span>
        </div>
      )}
      <div className={cn("grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3", table && "lg:hidden")}>
      <DealThumb photo={deal.photos[0]} />
      <div className="min-w-0">
        <p className="truncate text-base font-medium text-ink">{deal.title}</p>
        <p className="truncate text-sm text-ink-2">
          {deal.buyer?.firstName ?? "No buyer yet"}
          {sub && (
            <>
              {" · "}
              <span className={cn("label-mono", urgent ? "font-semibold text-wait" : "text-ink-2")}>{sub}</span>
            </>
          )}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className="font-mono text-base text-ink tabular-nums">{formatAmount(deal.itemMinor)}</span>
        <StatusChip status={deal.status} viewer="seller" />
      </div>
      </div>
    </Link>
  )
}
