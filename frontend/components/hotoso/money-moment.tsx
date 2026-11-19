import { cn } from "@/lib/utils"
import { amountAriaLabel, formatAmount, type Minor } from "@/lib/money"

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
