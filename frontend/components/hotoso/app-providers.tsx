"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

/**
 * Toasts + tooltips, for the sections that use them (deal rooms, seller pages,
 * styleguide). They are NOT in the root layout, so the public deal page,
 * the page most buyers see first, doesn't download them.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      {children}
      <Toaster />
    </TooltipProvider>
  )
}
