import { cn } from "@/lib/utils"
import { formatGHS } from "@/lib/money"
import { receiptLines } from "@/lib/mock"
import type { Deal, Viewer } from "@/lib/types"
import { HoldStrip } from "../hold-strip"
import { StatusChip } from "../status-chip"
import { Timeline } from "../timeline"
import { ReceiptCard } from "../receipt-card"
import { DealThumb } from "../deal-thumb"
import { PhotoCarousel } from "../photo-carousel"
import { ActionCard } from "./action-card"

export function DealRoomView({
  deal,
  viewer,
  hrefFor,
  problemHref = "#",
  titleAs: Title = "h1",
  className,
}: {
  deal: Deal
  viewer: Viewer
  hrefFor: (status: Deal["status"]) => string
  problemHref?: string
  titleAs?: "h1" | "h2"
  className?: string
}) {
  const buyerName = viewer === "buyer" ? "You" : (deal.buyer?.firstName ?? "Buyer")
  const sellerName = viewer === "seller" ? "You" : deal.seller.firstName

  const me = viewer === "buyer" ? deal.buyer?.firstName : deal.seller.firstName
  const events = deal.events.map((e) =>
    me && e.text.startsWith(`${me} `) ? { ...e, text: `You ${e.text.slice(me.length + 1)}` } : e
  )

  return (
    <div className={cn("@container flex flex-col gap-8", className)}>
      <section aria-labelledby="deal-title" className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-4">
            <DealThumb photo={deal.photos[0]} size={64} className="rounded-md" />
            <div className="min-w-0">
            <p className="label-caps text-ink-2">{viewer === "buyer" ? `Your order from ${deal.seller.firstName}` : `Your deal${deal.buyer ? ` with ${deal.buyer.firstName}` : ""}`}</p>
            <Title id="deal-title" className="title-serif mt-1 text-[1.75rem] text-ink lg:text-4xl">{deal.title}</Title>
            </div>
          </div>
          <StatusChip status={deal.status} viewer={viewer} className="mt-0.5" />
        </div>
        <HoldStrip
          status={deal.status}
          amountMinor={deal.itemMinor}
          buyerName={buyerName}
          sellerName={sellerName}
          shipBy={deal.shipBy}
          releaseAt={deal.releaseAt}
          countdown={deal.status === "shipped" ? deal.releaseCountdown : undefined}
          doneOn={deal.doneOn}
        />
      </section>

      <div className="grid grid-cols-1 gap-8 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)] @3xl:gap-10">
        <div className="flex flex-col gap-8">
          <ActionCard deal={deal} viewer={viewer} hrefFor={hrefFor} problemHref={problemHref} />

          <section aria-labelledby="activity-title" className="flex flex-col gap-4">
            <h2 id="activity-title" className="heading-caps text-ink">Activity</h2>
            <Timeline items={events} />
          </section>
        </div>

        <div className="flex flex-col gap-8">
          <section aria-labelledby="receipt-title" className="flex flex-col gap-4">
            <h2 id="receipt-title" className="heading-caps text-ink">Receipt</h2>
            <ReceiptCard
              lines={receiptLines(deal)}
              totalLabel={viewer === "buyer" ? "You paid" : deal.buyer ? `${deal.buyer.firstName} paid` : "Buyer pays"}
              totalMinor={deal.totalMinor}
              reference={deal.reference}
              timestamp={deal.paidAt}
            />
            {viewer === "seller" && (
              <p className="flex items-baseline justify-between gap-3 rounded-md border border-rule bg-card px-5 py-3 text-base text-ink">
                <span>You get</span>
                <span className="font-mono font-semibold tabular-nums">{formatGHS(deal.itemMinor)}</span>
              </p>
            )}
          </section>

          <section aria-labelledby="item-title" className="flex flex-col gap-4">
            <h2 id="item-title" className="heading-caps text-ink">Item</h2>
            <div className="flex flex-col gap-4 rounded-md border border-rule bg-card p-4">
              <PhotoCarousel photos={deal.photos} title={deal.title} variant="compact" />
              <div className="min-w-0">
                <p className="text-base font-semibold text-ink">{deal.title}</p>
                <p className="font-mono text-sm text-ink tabular-nums">{formatGHS(deal.itemMinor)}</p>
                <p className="mt-1 text-sm text-ink-2">{deal.description}</p>
              </div>
            </div>
            {viewer === "seller" && deal.buyer && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-md border border-rule bg-card p-4 text-base">
                <dt className="label-caps self-center text-ink-2">Buyer</dt>
                <dd className="text-ink">{deal.buyer.name}</dd>
                <dt className="label-caps self-center text-ink-2">Phone</dt>
                <dd className="font-mono text-ink tabular-nums">{deal.buyer.phone}</dd>
              </dl>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
