import { Skeleton } from "@/components/ui/skeleton"
import { PublicHeader } from "@/components/hotoso/site-header"

export default function Loading() {
  return (
    <div className="min-h-dvh bg-paper" aria-busy="true" aria-label="Loading the shop">
      <PublicHeader />
      <div className="mx-auto flex max-w-[1120px] flex-col gap-10 px-5 pt-2 lg:px-8">
        <Skeleton className="h-72 w-full rounded-md lg:h-80" />
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
}
