import { cn } from "@/lib/utils"

/**
 * A placeholder in the SHAPE of the content that's loading.
 * The slow pulse is functional ("still loading"), not decoration, and it
 * stops entirely when the phone has "reduce motion" switched on.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-sm bg-muted [animation-duration:2s] motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
