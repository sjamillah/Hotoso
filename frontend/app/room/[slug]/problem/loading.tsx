import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-dvh bg-paper" aria-busy="true" aria-label="Loading">
      <div className="h-14" />
      <main className="mx-auto flex max-w-[560px] flex-col gap-4 px-5 pt-2">
        <Skeleton className="h-0.5 w-full" />
        <Skeleton className="h-7 w-48" />
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-md" />
        ))}
      </main>
    </div>
  )
}
