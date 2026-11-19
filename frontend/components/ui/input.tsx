import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-sm border border-rule bg-card px-3.5 text-base text-ink transition-colors duration-150 placeholder:text-ink-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-clay file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink",
        className
      )}
      {...props}
    />
  )
}

export { Input }
