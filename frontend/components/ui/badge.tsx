import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

/**
 * Small pill for counts and short tags (e.g. the "2" on the Ship now tab).
 * For deal statuses use <StatusChip>, which knows the status → colour rules.
 */
const badgeVariants = cva(
  "inline-flex h-6 min-w-6 w-fit shrink-0 items-center justify-center gap-1 rounded-full px-2 font-mono text-xs font-medium tabular-nums whitespace-nowrap [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper",
        secondary: "bg-butter-soft text-ink",
        outline: "border border-ink text-ink",
        muted: "bg-muted text-ink-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
