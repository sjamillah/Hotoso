"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

/**
 * "How it works" bottom sheet. Only the open/close behaviour is client-side.
 * The content arrives as `children`, already rendered on the server.
 */
export function HowItWorksSheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="label-caps -mr-1 flex h-11 items-center rounded-xs px-1 whitespace-nowrap text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
        >
          How it works
        </button>
      </SheetTrigger>
      <SheetContent side="responsive">
        <SheetHeader>
          <SheetTitle className="display-caps text-[2.5rem]">How Hotoso works</SheetTitle>
          <SheetDescription>Your money waits with Hotoso until your order arrives.</SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto px-5">{children}</div>
        <SheetFooter>
          <SheetClose asChild>
            <Button size="lg" width="full">
              Got it
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
