"use client"

import { SellerHeader } from "@/components/hotoso/site-header"
import { RouteError } from "@/components/hotoso/route-error"

/** Covers /seller and every page under it that has no error.tsx of its own. */
export default function SellerError({ retry }: { error: Error; retry: () => void }) {
  return (
    <div className="min-h-dvh bg-paper">
      <SellerHeader />
      <RouteError retry={retry} title="We couldn&apos;t load your deals">
        Your money is safe with Hotoso either way. Check your connection and try again.
      </RouteError>
    </div>
  )
}
