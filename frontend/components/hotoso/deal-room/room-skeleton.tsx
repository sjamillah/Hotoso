import { Skeleton } from "@/components/ui/skeleton"

/** Loading shape of a deal room: title, hold strip, action card, timeline, receipt. */
export function RoomSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-label="Loading the deal">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-6 w-52" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-md" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-10">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-48 w-full rounded-md" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
        <Skeleton className="h-56 w-full rounded-md" />
      </div>
    </div>
  )
}
