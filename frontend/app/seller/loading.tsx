import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-dvh bg-paper" aria-busy="true" aria-label="Loading your deals">
      <div className="h-14" />
      <main className="mx-auto grid max-w-[1120px] grid-cols-1 gap-10 px-5 pt-2 lg:grid-cols-[400px_minmax(0,1fr)] lg:px-8">
        <div className="flex flex-col gap-8">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-40 w-full rounded-md" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-20 rounded-md" />
            <Skeleton className="h-20 rounded-md" />
          </div>
          <Skeleton className="h-13 w-full" />
          <Skeleton className="h-11 w-full" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-12" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        
      </main>
    </div>
  )
}
