"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

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
