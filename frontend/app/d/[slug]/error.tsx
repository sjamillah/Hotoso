"use client"

import { PublicHeader } from "@/components/hotoso/site-header"
import { RouteError } from "@/components/hotoso/route-error"

export default function DealError({ retry }: { error: Error; retry: () => void }) {
  return (
    <div className="min-h-dvh bg-paper">
      <PublicHeader />
      <RouteError retry={retry} title="We couldn&apos;t load this deal">
        You haven&apos;t paid anything. Check your connection and try again.
      </RouteError>
    </div>
  )
}
