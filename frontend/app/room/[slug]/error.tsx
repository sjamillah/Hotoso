"use client"

import { RouteError } from "@/components/hotoso/route-error"

export default function RoomError({ retry }: { error: Error; retry: () => void }) {
  return (
    <div className="min-h-dvh bg-paper">
      <RouteError retry={retry} title="We couldn&apos;t load your deal room">
        Your money is not affected: it stays wherever it was. Try again in a
        moment.
      </RouteError>
    </div>
  )
}
