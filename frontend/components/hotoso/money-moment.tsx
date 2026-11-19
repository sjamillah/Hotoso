import { cn } from "@/lib/utils"
import { amountAriaLabel, formatAmount, type Minor } from "@/lib/money"

/**
 * MONEY MOMENT (doc 04 §3.1, "signature pairing"): an ink card with the
 * amount in butter Fraunces. It's the warm light in a dark room. Use it about
 * ONCE per screen: "Held for you", payment success, the landing demo.
 * If everything is special, nothing is.
 */
export function MoneyMoment({
  label,
  amountMinor,
  children,
  className,
}: {
  label: string
  amountMinor: Minor
  children?: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("rounded-md bg-ink p-6 text-paper", className)}>
      <p className="label-caps text-paper">{label}</p>
      <p className="money mt-3 text-amount text-butter">
        {/* The currency is set smaller so the NUMBER is the hero, and so the
            tight display spacing doesn't glue "GHS" to the digits. */}
        <span aria-hidden="true">
          <span className="mr-[0.2em] align-[0.35em] text-[0.42em] tracking-normal">GHS</span>
          {formatAmount(amountMinor)}
        </span>
        <span className="sr-only">{amountAriaLabel(amountMinor)}</span>
      </p>
      {children && <div className="mt-4 text-base text-paper">{children}</div>}
    </section>
  )
}
