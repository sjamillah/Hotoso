"use client"

import * as React from "react"
import Link from "next/link"
import { RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPaymentStatus } from "@/lib/api"
import { formatGHS, type Minor } from "@/lib/money"
import type { ReceiptLine } from "./receipt-card"
import { ReceiptCard } from "./receipt-card"
import { HoldStrip } from "./hold-strip"
import { MoneyMoment } from "./money-moment"
import { Reveal } from "./reveal"

/**
 * PAY RETURN  (doc 04 §5.2): risk #1 in docs/design/ui-direction.md §5.
 *
 * The buyer just came back from Paystack. We DON'T trust that redirect as
 * proof of payment. Instead we POLL: ask the backend every 2 seconds
 * "is this reference confirmed?", for at most 60 seconds.
 *
 *   confirming → success  (the backend verified it with Paystack)
 *              → failed   (Paystack says it failed / was abandoned)
 *              → slow     (60s passed with no answer: stop asking, reassure)
 */

const POLL_EVERY_MS = 2000
const HINT_AFTER_MS = 20000
const GIVE_UP_AFTER_MS = 60000

type Phase = "confirming" | "slow" | "success" | "failed"

export type PayReturnDeal = {
  slug: string
  title: string
  sellerFirstName: string
  shipWithinDays: number
  itemMinor: Minor
  totalMinor: Minor
  lines: ReceiptLine[]
}

export function PayReturn({
  reference,
  outcome,
  deal,
}: {
  reference: string
  outcome: "success" | "failed" | "slow"
  deal: PayReturnDeal
}) {
  const [phase, setPhase] = React.useState<Phase>("confirming")
  const [showHint, setShowHint] = React.useState(false)
  const [roomUrl, setRoomUrl] = React.useState<string | null>(null)
  const [round, setRound] = React.useState(0) // bumps when the buyer taps "Check again"

  React.useEffect(() => {
    let cancelled = false
    let attempt = 0
    let timer: ReturnType<typeof setTimeout>
    const startedAt = Date.now()
    const hintTimer = setTimeout(() => setShowHint(true), HINT_AFTER_MS)

    async function poll() {
      const result = await getPaymentStatus(reference, outcome, attempt++)
      if (cancelled) return
      if (result.status === "success") {
        setRoomUrl(result.dealRoomUrl)
        setPhase("success")
      } else if (result.status === "failed" || result.status === "abandoned") {
        setPhase("failed")
      } else if (Date.now() - startedAt >= GIVE_UP_AFTER_MS) {
        setPhase("slow")
      } else {
        timer = setTimeout(poll, POLL_EVERY_MS)
      }
    }
    timer = setTimeout(poll, 600)

    // Cleanup: if the buyer leaves the page, stop polling.
    return () => {
      cancelled = true
      clearTimeout(timer)
      clearTimeout(hintTimer)
    }
  }, [reference, outcome, round])

  function checkAgain() {
    setShowHint(false)
    setPhase("confirming")
    setRound((r) => r + 1)
  }

  return (
    // aria-live: screen readers announce the change from "confirming" to the result
    <div aria-live="polite" className="mx-auto flex w-full max-w-[560px] flex-col gap-8 px-5 pt-6 pb-16">
      {(phase === "confirming" || phase === "slow") && (
        <Confirming deal={deal} reference={reference} showHint={showHint} slow={phase === "slow"} onCheckAgain={checkAgain} />
      )}
      {phase === "success" && <Success deal={deal} reference={reference} roomUrl={roomUrl!} />}
      {phase === "failed" && <Failed deal={deal} reference={reference} />}
    </div>
  )
}

export function Confirming({
  deal,
  reference,
  showHint = false,
  slow = false,
  onCheckAgain,
}: {
  deal: PayReturnDeal
  reference: string
  showHint?: boolean
  slow?: boolean
  onCheckAgain?: () => void
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="label-caps text-ink-2">{slow ? "Still checking" : "Checking your payment"}</p>
        <h1 className="title-serif text-[2rem] text-ink">
          {slow ? (
            <>Paystack is taking <em className="italic">longer than usual</em></>
          ) : (
            <>Confirming your {formatGHS(deal.totalMinor)} <em className="italic">payment</em></>
          )}
        </h1>
      </div>

      <HoldStrip
        status="awaiting_payment"
        amountMinor={deal.itemMinor}
        buyerName="You"
        sellerName={deal.sellerFirstName}
        pulse={!slow}
        caption={slow ? "We haven't heard back yet" : "Confirming with Paystack…"}
        detail={slow ? undefined : "This usually takes a few seconds."}
      />

      {showHint && !slow && (
        <p className="rounded-md bg-butter-soft p-4 text-base text-ink">
          <strong className="font-semibold">MoMo approvals can take a minute.</strong> Check your phone for a prompt and
          approve it there.
        </p>
      )}

      {slow && (
        <div className="flex flex-col gap-4">
          <p className="text-base text-ink">
            If you paid, your money is safe either way. We&apos;ll email you the moment Paystack confirms it, and{" "}
            {deal.sellerFirstName} won&apos;t ship until then.
          </p>
          <Button size="lg" width="full" onClick={onCheckAgain}>
            <RotateCw /> Check again
          </Button>
        </div>
      )}

      <p className="label-mono text-ink-2">Ref {reference}</p>
    </>
  )
}

function Success({ deal, reference, roomUrl }: { deal: PayReturnDeal; reference: string; roomUrl: string }) {
  return (
    <>
      <h1 className="sr-only">
        Payment confirmed. Your {formatGHS(deal.totalMinor)} is safe with Hotoso.
      </h1>
      <MoneyMoment label="Safe with Hotoso" amountMinor={deal.totalMinor}>
        <HoldStrip
          status="funded"
          tone="ink"
          arrive
          amountMinor={deal.itemMinor}
          buyerName="You"
          sellerName={deal.sellerFirstName}
          caption="Your money is with Hotoso"
          detail={`${deal.sellerFirstName} has been told to ship within ${deal.shipWithinDays} days.`}
          className="mt-2"
        />
      </MoneyMoment>

      {/* prints just after the coin lands in Hotoso */}
      <Reveal className="print" delay={900}>
        <ReceiptCard lines={deal.lines} totalLabel="You paid" totalMinor={deal.totalMinor} reference={reference} timestamp="Just now" />
      </Reveal>

      <div className="flex flex-col gap-3">
        <Button size="lg" width="full" asChild>
          <Link href={roomUrl}>Go to your deal room</Link>
        </Button>
        <p className="text-sm text-ink-2">
          We also emailed you this link. Keep it: it&apos;s where you confirm delivery or tell us if something&apos;s wrong.
        </p>
      </div>
    </>
  )
}

function Failed({ deal, reference }: { deal: PayReturnDeal; reference: string }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="label-caps text-clay">Payment didn&apos;t go through</p>
        <h1 className="title-serif text-[2rem] text-ink">No money left your <em className="italic">account</em></h1>
      </div>
      <HoldStrip
        status="awaiting_payment"
        amountMinor={deal.itemMinor}
        buyerName="You"
        sellerName={deal.sellerFirstName}
        caption="Your money is still with you"
      />
      <p className="text-base text-ink-2">
        This can happen if the MoMo prompt timed out or the card was declined. You can try again with the same or a
        different method.
      </p>
      <Button size="lg" width="full" asChild>
        <Link href={`/d/${deal.slug}`}>Try again</Link>
      </Button>
      <p className="label-mono text-ink-2">Ref {reference}</p>
    </>
  )
}
