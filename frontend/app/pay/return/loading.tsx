import { Skeleton } from "@/components/ui/skeleton"
import { PublicHeader } from "@/components/hotoso/site-header"

export default function Loading() {
  return (
    <div className="min-h-dvh bg-paper" aria-busy="true" aria-label="Checking your payment">
      <PublicHeader />
      <div className="mx-auto flex max-w-[560px] flex-col gap-8 px-5 pt-6">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-7 w-4/5" />
        </div>
        <Skeleton className="h-28 w-full rounded-md" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  )
}
