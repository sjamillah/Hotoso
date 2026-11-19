import Link from "next/link"
import { ArrowRight, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatGHSShort } from "@/lib/money"
import type { Deal } from "@/lib/types"
import { DealThumb } from "../deal-thumb"

/**
 * "NEEDS YOU NOW": the seller's to-do list, answered first.
 *
 * Only deals where the SELLER must act appear here: something to ship, a
 * problem to answer, a payout number to fix. Most urgent first. Each card
 * says exactly what to do, with one button.
 */

type Todo = { deal: Deal; why: string; action: string; urgent: boolean; rank: number; tone: "wait" | "clay" | "rule" }

function todosFor(deals: Deal[]): Todo[] {
  const out: Todo[] = []
  for (const d of deals) {
    const buyer = d.buyer?.firstName ?? "The buyer"
    if (d.status === "funded") {
      const urgent = d.shipByCountdown === "18h"
      out.push({ deal: d, why: `${buyer} paid. Ship by ${d.shipBy} · ${d.shipByCountdown} left`, action: "Mark as shipped", urgent, rank: urgent ? 0 : 2, tone: urgent ? "wait" : "rule" })
    } else if (d.status === "disputed") {
      out.push({ deal: d, why: `${buyer} reported a problem. Add your side`, action: "See the problem", urgent: true, rank: 1, tone: "clay" })
    } else if (d.status === "payout_failed") {
      out.push({ deal: d, why: "We couldn't reach your MoMo", action: "Check your number", urgent: true, rank: 1, tone: "wait" })
    }
  }
  return out.sort((a, b) => a.rank - b.rank)
}

export function needsYouCount(deals: Deal[]) {
  return todosFor(deals).length
}

export function NeedsYou({ deals }: { deals: Deal[] }) {
  const todos = todosFor(deals)
  return (
    <section aria-labelledby="needs-title" className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="needs-title" className="heading-caps text-ink">
          Needs you now {todos.length > 0 && <span className="font-mono text-ink-2">· {todos.length}</span>}
        </h2>
      </div>

      {todos.length === 0 ? (
        <p className="flex items-center gap-2 rounded-md border border-dashed border-rule p-5 text-base text-ink-2 [&_svg]:size-5">
          <CheckCheck aria-hidden="true" className="text-safe" /> You&apos;re all caught up. New orders will show up here.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {todos.map(({ deal, why, action, urgent, tone }) => (
            <li key={deal.slug}>
              <Link
                href={`/seller/deals/${deal.slug}`}
                className={cn(
                  "group flex h-full flex-col gap-4 rounded-md border bg-card p-4 transition-colors duration-200 hover:border-ink",
                  // our colour meanings: wait = a deadline, clay = a problem
                  tone === "clay" ? "border-clay" : tone === "wait" ? "border-wait" : "border-rule"
                )}
              >
                <div className="flex items-start gap-3">
                  <DealThumb photo={deal.photos[0]} size={72} className="rounded-md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-medium text-ink">{deal.title}</p>
                    <p className={cn("mt-0.5 text-sm", tone === "clay" ? "font-medium text-clay" : urgent ? "font-medium text-wait" : "text-ink-2")}>{why}</p>
                  </div>
                  <span className="font-mono text-sm text-ink tabular-nums">{formatGHSShort(deal.itemMinor)}</span>
                </div>
                <span className="mt-auto flex items-center justify-between border-t border-rule pt-3 text-base font-semibold text-ink">
                  {action}
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
