import { amountAriaLabel, formatAmount } from "@/lib/money"
import type { SellerSummary } from "@/lib/types"
import { HotosoMark } from "../wordmark"

export function MoneySummary({ summary, payoutMasked }: { summary: SellerSummary; payoutMasked: string }) {
  return (
    <section aria-label="Your money" className="overflow-hidden rounded-md bg-ink text-paper">
      <dl className="grid grid-cols-1 divide-y divide-ink-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:divide-x lg:divide-y-0">
        <div className="flex flex-col gap-3 p-6 lg:p-8">
          <dt className="label-caps text-paper">Held for you</dt>
          <dd className="flex flex-col gap-3">
            <Amount minor={summary.heldMinor} className="text-[2.75rem] text-butter lg:text-[3.5rem]" />
            <span className="text-base text-paper">
              {summary.heldCount === 0
                ? "Nothing held yet. When a buyer pays, their money waits here until they confirm."
                : `${summary.heldCount} ${summary.heldCount === 1 ? "deal" : "deals"}. Released to your MoMo when buyers confirm.`}
            </span>
          </dd>
        </div>
        <Quiet label="On the way to you" minor={summary.onTheWayMinor} note="Released, landing on your MoMo" />
        <Quiet label="Paid out in November" minor={summary.paidOutThisMonthMinor} note="Already on your MoMo" />
      </dl>
      <div className="flex items-center gap-2 border-t border-ink-2 px-6 py-3 lg:px-8">
        <HotosoMark tone="ink" className="size-4" />
        <p className="label-mono text-paper">Payouts go to {payoutMasked}</p>
      </div>
    </section>
  )
}

function Quiet({ label, minor, note }: { label: string; minor: number; note: string }) {
  return (
    <div className="flex flex-col justify-between gap-3 p-6 lg:p-8">
      <dt className="label-caps text-paper">{label}</dt>
      <dd className="flex flex-col gap-1">
        <Amount minor={minor} className="text-3xl text-paper lg:text-[2.25rem]" />
        <span className="text-sm text-paper">{note}</span>
      </dd>
    </div>
  )
}

function Amount({ minor, className }: { minor: number; className?: string }) {
  return (
    <span className={`money leading-none whitespace-nowrap ${className ?? ""}`}>
      <span aria-hidden="true">
        <span className="mr-[0.2em] align-[0.35em] text-[0.4em] tracking-normal">GHS</span>
        {formatAmount(minor)}
      </span>
      <span className="sr-only">{amountAriaLabel(minor)}</span>
    </span>
  )
}
