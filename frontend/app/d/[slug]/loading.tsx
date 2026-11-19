import { Skeleton } from "@/components/ui/skeleton"
import { PublicHeader } from "@/components/hotoso/site-header"

export default function Loading() {
  return (
    <div className="min-h-dvh bg-paper" aria-busy="true" aria-label="Loading the deal">
      <PublicHeader />
      <div className="mx-auto grid max-w-[1120px] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:gap-16 lg:px-8 lg:pt-4">
        <Skeleton className="aspect-[4/5] max-h-[52svh] w-full rounded-none lg:max-h-none lg:rounded-md" />
        <div className="flex flex-col gap-4 px-5 lg:px-0">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-5 w-28" />
          <div className="mt-8 flex items-center gap-3">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="mt-8 h-44 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
