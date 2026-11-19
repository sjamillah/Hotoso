import { RoomSkeleton } from "@/components/hotoso/deal-room/room-skeleton"

export default function Loading() {
  return (
    <div className="min-h-dvh bg-paper">
      <div className="h-14" />
      <main className="mx-auto max-w-[1120px] px-5 pt-2 lg:px-8">
        <RoomSkeleton />
      </main>
    </div>
  )
}
