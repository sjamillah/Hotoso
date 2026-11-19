import { cn } from "@/lib/utils"
import { amountAriaLabel, formatAmount, formatGHS, type Minor } from "@/lib/money"

/**
 * RECEIPT CARD (doc 04 §4.3): money moments look like printed receipts.
 *
 *   ╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮   ← perforated top edge
 *   Black AF1, size 42 ......... 450.00
 *   Hotoso protection (1.5%) ...... 6.75
 *   - - - - - - - - - - - - - - - - - -
 *   You pay                  GHS 456.75   ← butter total row
 *   REF HTS-PAY-01JD…     18 NOV, 14:02
 *
 * Numbers are in Geist Mono with "tabular" digits: every digit has the same
 * width, so amounts line up in a neat right-hand column, like a till slip.
 */

export type ReceiptLine = { label: string; amountMinor: Minor }

export function ReceiptCard({
  lines,
  totalLabel = "You pay",
  totalMinor,
  reference,
  timestamp,
  className,
}: {
  lines: ReceiptLine[]
  totalLabel?: string
  totalMinor: Minor
  reference?: string
  timestamp?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "perforated-top rounded-b-md border-x border-b border-rule bg-card px-5 pt-7 pb-5 shadow-card",
        className
      )}
    >
      <dl className="flex flex-col gap-2.5">
        {lines.map((line) => (
          <div key={line.label} className="flex items-end gap-2">
            <dt className="min-w-0 text-base text-ink">{line.label}</dt>
            {/* dotted "leader" that walks your eye from label to number */}
            <span aria-hidden="true" className="mb-1.5 min-w-4 flex-1 border-b-2 border-dotted border-rule" />
            <dd className="shrink-0 font-mono text-base text-ink tabular-nums">
              {formatAmount(line.amountMinor)}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 border-t-2 border-dashed border-rule pt-4">
        <div className="-mx-2 flex items-baseline justify-between gap-3 rounded-sm bg-butter px-3 py-2.5">
          <span className="text-base font-semibold text-ink">{totalLabel}</span>
          <span className="font-mono text-lg font-semibold text-ink tabular-nums">
            <span aria-hidden="true">{formatGHS(totalMinor)}</span>
            <span className="sr-only">{amountAriaLabel(totalMinor)}</span>
          </span>
        </div>
      </div>

      {(reference || timestamp) && (
        <div className="label-mono mt-4 flex flex-wrap justify-between gap-x-4 gap-y-1 text-ink-2">
          {reference && <span>Ref {reference}</span>}
          {timestamp && <span>{timestamp}</span>}
        </div>
      )}
    </div>
  )
}
