"use client"

import { PublicHeader } from "@/components/hotoso/site-header"
import { RouteError } from "@/components/hotoso/route-error"

export default function PayReturnError({ retry }: { error: Error; retry: () => void }) {
  return (
    <div className="min-h-dvh bg-paper">
      <PublicHeader />
      <RouteError retry={retry} title="We couldn&apos;t check your payment">
        If you paid, your money is safe, and we&apos;ll email you when
        it&apos;s confirmed.
      </RouteError>
    </div>
  )
}
