import * as React from "react"
import { cn } from "@/lib/utils"

/** Multi-line text, styled exactly like Input (card fill, rule border, 16px). */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-28 w-full rounded-sm border border-rule bg-card px-3.5 py-3 text-base text-ink placeholder:text-ink-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-clay",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
