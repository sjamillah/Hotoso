import { CloudOff, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Shared screen states (doc 04 §6). Every data view needs:
 *   loading → a Skeleton in the shape of the content (components/ui/skeleton)
 *   empty   → a helpful sentence AND a next action
 *   error   → what happened AND what to do
 *   offline → "You're offline. We'll retry."
 * Calm words, no blame, no jargon, no error codes in the headline.
 */

export function EmptyState({
  title,
  children,
  action,
  className,
}: {
  title: string
  children?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-start gap-3 rounded-md border border-dashed border-rule p-6", className)}>
      <p className="text-lg font-semibold text-ink">{title}</p>
      {children && <div className="text-base text-ink-2">{children}</div>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

export function ErrorState({
  title = "We couldn't load this",
  children = "Your money is not affected. Check your connection and try again.",
  action,
  className,
}: {
  title?: string
  children?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div role="alert" className={cn("flex flex-col items-start gap-3 rounded-md border border-clay-soft bg-card p-6", className)}>
      <span className="flex size-10 items-center justify-center rounded-full bg-clay-soft text-clay [&_svg]:size-5">
        <TriangleAlert aria-hidden="true" />
      </span>
      <p className="text-lg font-semibold text-ink">{title}</p>
      <div className="text-base text-ink-2">{children}</div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

export function OfflineBanner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      className={cn("flex items-center gap-2.5 bg-wait-soft px-5 py-3 text-base text-wait [&_svg]:size-5", className)}
    >
      <CloudOff aria-hidden="true" className="shrink-0" />
      <span>
        <strong className="font-semibold">You&apos;re offline.</strong> We&apos;ll retry when you&apos;re back.
      </span>
    </div>
  )
}
