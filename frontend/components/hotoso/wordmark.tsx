import { cn } from "@/lib/utils"

export function HotosoMark({ tone = "paper", className }: { tone?: "paper" | "ink"; className?: string }) {
  const onInk = tone === "ink"
  const fg = onInk ? "fill-paper" : "fill-ink"
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("shrink-0", className)}>
      <rect x="6" y="5" width="10" height="38" rx="5" transform="rotate(4 11 43)" className={fg} />
      <rect x="32" y="5" width="10" height="38" rx="5" transform="rotate(-4 37 43)" className={fg} />
      <rect x="12" y="21" width="24" height="7" rx="3.5" className={fg} />
      <circle cx="24" cy="24.5" r="9.5" strokeWidth="3" className={cn("fill-butter", onInk ? "stroke-paper" : "stroke-ink")} />
    </svg>
  )
}

export function Wordmark({
  tone = "paper",
  mark = true,
  className,
}: {
  tone?: "paper" | "ink"
  mark?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[0.3em] font-display text-2xl leading-none font-semibold tracking-tight",
        tone === "ink" ? "text-paper" : "text-ink",
        className
      )}
      style={{ fontVariationSettings: '"opsz" 72, "SOFT" 50' }}
    >
      {mark && <HotosoMark tone={tone} className="size-[1.15em]" />}
      <span className="-mt-[0.12em]">hotoso</span>
    </span>
  )
}
