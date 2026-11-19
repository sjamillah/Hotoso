"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

/**
 * "2h ago", with the exact time in a tooltip.
 * This is the only part of the Timeline that needs JavaScript (the tooltip
 * reacts to hover/focus), so it's split into its own small Client Component.
 * The rest of the Timeline stays a Server Component.
 */
export function RelativeTime({ iso, relative, exact }: { iso: string; relative: string; exact: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <time
          dateTime={iso}
          tabIndex={0}
          aria-label={`${relative}, ${exact}`}
          className="label-mono shrink-0 cursor-default rounded-xs text-ink-2"
        >
          {relative}
        </time>
      </TooltipTrigger>
      <TooltipContent>{exact}</TooltipContent>
    </Tooltip>
  )
}
