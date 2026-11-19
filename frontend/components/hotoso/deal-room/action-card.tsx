import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { formatGHSShort } from "@/lib/money"
import type { Deal, Viewer } from "@/lib/types"
import { MoneyMoment } from "../money-moment"
import { CATEGORIES } from "@/lib/categories"
import {
  CancelDealDialog,
  EvidenceSheet,
  PayoutNumberSheet,
  ReleaseSheet,
  ShareSheet,
  ShipSheet,
} from "./sheets"
import { MockAdvance } from "./mock-advance"

/**
 * THE ACTION CARD: the single next step for this person, right now
 * (doc 04 §5.3). One dark button at most. If there's nothing to do, the card
 * says so, which is also reassuring ("Nothing else to do").
 *
 * `hrefFor(status)` builds the demo link to the next status (mock only).
 */

const REASON_TEXT = {
  not_received: "It never arrived",
  not_as_described: "Not as described",
  damaged: "It arrived damaged",
  other: "Something else",
} as const

type Props = {
  deal: Deal
  viewer: Viewer
  hrefFor: (status: Deal["status"]) => string
  problemHref: string
}

export function ActionCard(props: Props) {
  return props.viewer === "buyer" ? <BuyerAction {...props} /> : <SellerAction {...props} />
}

function Frame({
  eyebrow,
  title,
  children,
  tone = "default",
}: {
  eyebrow: string
  title: string
  children?: React.ReactNode
  tone?: "default" | "clay" | "wait"
}) {
  return (
    <section
      aria-labelledby="action-title"
      className={cn(
        "flex flex-col gap-4 rounded-md border bg-card p-5 shadow-card",
        tone === "default" && "border-ink",
        tone === "clay" && "border-clay",
        tone === "wait" && "border-wait"
      )}
    >
      <div className="flex flex-col gap-1.5">
        <p className={cn("label-caps", tone === "clay" ? "text-clay" : tone === "wait" ? "text-wait" : "text-ink-2")}>{eyebrow}</p>
        <h2 id="action-title" className="text-xl font-semibold text-ink">{title}</h2>
      </div>
      {children}
    </section>
  )
}

const Body = ({ children }: { children: React.ReactNode }) => <p className="text-base text-ink-2">{children}</p>

/* =================================================================== BUYER */

function BuyerAction({ deal, hrefFor, problemHref }: Props) {
  const seller = deal.seller.firstName
  const amount = formatGHSShort(deal.itemMinor)

  switch (deal.status) {
    case "awaiting_payment":
      return (
        <Frame eyebrow="Not paid yet" title="We haven't received your payment">
          <Body>Nothing has left your account for this deal.</Body>
          <Button size="lg" width="full" asChild>
            <Link href={`/d/${deal.slug}`}>Go to payment</Link>
          </Button>
        </Frame>
      )
    case "funded":
      return (
        <Frame eyebrow="What happens now" title={`${seller} has until ${deal.shipBy} to ship`}>
          <Body>
            We&apos;ve told {seller} your payment is in. You&apos;ll see it here the moment it&apos;s marked shipped. If it
            isn&apos;t shipped in time, you can cancel for a full refund.
          </Body>
        </Frame>
      )
    case "shipped":
      return (
        <Frame eyebrow="Your next step" title="Got your order?">
          <Body>
            {seller} marked it shipped {deal.shippedAgo}. Check it first: releasing pays {seller} and can&apos;t be undone.
          </Body>
          {deal.shippingNote && (
            <blockquote className="border-l-2 border-rule pl-3 text-base text-ink">“{deal.shippingNote}”</blockquote>
          )}
          <div className="flex flex-col gap-1">
            <ReleaseSheet amount={amount} sellerFirstName={seller} nextHref={hrefFor("releasing")} />
            <Button variant="quiet-danger" width="full" asChild>
              <Link href={problemHref}>Something&apos;s wrong with my order</Link>
            </Button>
          </div>
        </Frame>
      )
    case "disputed":
      return (
        <Frame tone="clay" eyebrow="Problem reported" title="We're reviewing. Usually within 48 hours.">
          <Body>
            Your {amount} stays frozen with Hotoso. {seller} can&apos;t be paid while we look into it, and can add their
            side too.
          </Body>
          <EvidenceSheet
            triggerLabel="Add a photo"
            title="Add to your report"
            description="Photos of the problem help us decide faster."
            nextHref={hrefFor("disputed")}
          />
        </Frame>
      )
    case "releasing":
      return (
        <Frame eyebrow="Done on your side" title={`Sending ${amount} to ${seller}`}>
          <Body>Nothing else to do. Thanks for confirming.</Body>
          <MockAdvance to={hrefFor("released")} />
        </Frame>
      )
    case "released":
      return (
        <Frame eyebrow="Complete" title={`Done. ${seller} was paid on ${deal.doneOn}.`}>
          <Body>Thanks for paying safely with Hotoso.</Body>
        </Frame>
      )
    case "payout_failed":
      return (
        <Frame eyebrow="Done on your side" title={`${seller}'s payout is delayed`}>
          <Body>Your part is done. We&apos;re retrying the transfer to {seller}.</Body>
        </Frame>
      )
    case "refunding":
      return (
        <Frame tone="clay" eyebrow="Refund on its way" title="We're refunding your payment">
          <Body>It goes back the way you paid. We&apos;ll email you when it&apos;s done.</Body>
          <MockAdvance to={hrefFor("refunded")} />
        </Frame>
      )
    case "refunded":
      return (
        <Frame tone="clay" eyebrow="Refunded" title={`Refunded on ${deal.doneOn}`}>
          <Body>Your payment went back the way you paid.</Body>
        </Frame>
      )
    case "cancelled":
      return (
        <Frame eyebrow="Cancelled" title="This deal was cancelled">
          <Body>No money moved.</Body>
        </Frame>
      )
  }
}

/* =================================================================== SELLER */

function SellerAction({ deal, hrefFor }: Props) {
  const buyer = deal.buyer?.firstName ?? "the buyer"
  const amount = formatGHSShort(deal.itemMinor)
  const url = `https://hotoso.app/d/${deal.slug}`

  switch (deal.status) {
    case "awaiting_payment":
      return (
        <Frame eyebrow="Waiting for a buyer" title="Nobody has paid yet">
          <Body>Share your link. We&apos;ll email you the moment someone pays, and then you ship.</Body>
          <div className="flex flex-col gap-1">
            <ShareSheet url={url} title={deal.title} amount={formatGHSShort(deal.totalMinor)} />
            <CancelDealDialog nextHref={hrefFor("cancelled")} />
          </div>
        </Frame>
      )
    case "funded":
      return (
        <Frame
          tone={deal.shipByCountdown === "18h" ? "wait" : "default"}
          eyebrow={`Ship by ${deal.shipBy} · ${deal.shipByCountdown} left`}
          title={`${buyer}'s payment is in. Ship now.`}
        >
          <Body>The money is safe with Hotoso. It&apos;s released to you when {buyer} confirms, or {CATEGORIES[deal.category].inspectionHours} hours after you ship.</Body>
          <ShipSheet buyerFirstName={buyer} hours={CATEGORIES[deal.category].inspectionHours} nextHref={hrefFor("shipped")} />
        </Frame>
      )
    case "shipped":
      return (
        <Frame eyebrow="Shipped" title={`Waiting for ${buyer}`}>
          <Body>
            Auto-release in <span className="font-mono tabular-nums text-ink">{deal.releaseCountdown}</span> if {buyer}{" "}
            doesn&apos;t report a problem. Nothing to do.
          </Body>
        </Frame>
      )
    case "disputed":
      return (
        <Frame tone="clay" eyebrow="Problem reported" title={`${buyer} reported: ${REASON_TEXT[deal.dispute!.reason]}`}>
          <blockquote className="border-l-2 border-clay pl-3 text-base text-ink">“{deal.dispute!.details}”</blockquote>
          <Body>We&apos;ll decide within 48 hours. The money stays with Hotoso until then. Add your side so we hear both.</Body>
          <EvidenceSheet
            triggerLabel="Add your side"
            title="Your side"
            description="Photos from before you shipped, and anything the buyer said, help us decide fairly."
            nextHref={hrefFor("disputed")}
          />
        </Frame>
      )
    case "releasing":
      return (
        <Frame eyebrow="On its way" title={`Sending ${amount} to your MoMo`}>
          <Body>To {deal.seller.payoutMasked}. This usually takes a few minutes.</Body>
          <MockAdvance to={hrefFor("released")} />
        </Frame>
      )
    case "released":
      return (
        <MoneyMoment label={`Paid to ${deal.seller.payoutMasked} · ${deal.doneOn}`} amountMinor={deal.itemMinor}>
          {buyer} confirmed the order. This deal is complete.
        </MoneyMoment>
      )
    case "payout_failed":
      return (
        <Frame tone="wait" eyebrow="Payout delayed" title="We couldn't reach your MoMo">
          <Body>
            Your {amount} is safe with Hotoso. Check that {deal.seller.payoutMasked} is right, and we&apos;ll retry.
          </Body>
          <PayoutNumberSheet current={deal.seller.payoutMasked} />
        </Frame>
      )
    case "refunding":
      return (
        <Frame tone="clay" eyebrow="Refunding" title={`Refunding ${buyer}`}>
          <Body>The payment is going back to {buyer}. No payout for this deal.</Body>
          <MockAdvance to={hrefFor("refunded")} />
        </Frame>
      )
    case "refunded":
      return (
        <Frame tone="clay" eyebrow="Refunded" title={`Refunded to ${buyer} on ${deal.doneOn}`}>
          <Body>No payout for this deal.</Body>
        </Frame>
      )
    case "cancelled":
      return (
        <Frame eyebrow="Cancelled" title="You cancelled this deal">
          <Body>No money moved. The link no longer works.</Body>
        </Frame>
      )
  }
}
