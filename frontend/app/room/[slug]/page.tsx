import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBuyerRoom, readDemo } from "@/lib/api"
import { isDealStatus } from "@/lib/types"
import { RoomHeader } from "@/components/hotoso/site-header"
import { DealRoomView } from "@/components/hotoso/deal-room/deal-room-view"
import { AppFooter } from "@/components/hotoso/app-footer"

export const metadata: Metadata = { title: "Your deal room", robots: { index: false } }

/**
 * BUYER DEAL ROOM  /room/[slug]?t=TOKEN   (doc 04 §5.3)
 * The private link emailed to the buyer after paying. `t` proves it's them.
 *
 * Mock-only: &status=shipped (etc.) previews the room in any status.
 */
export default async function BuyerRoomPage({ params, searchParams }: PageProps<"/room/[slug]">) {
  const { slug } = await params
  const query = await searchParams
  const token = typeof query.t === "string" ? query.t : undefined
  const status = isDealStatus(query.status) ? query.status : undefined

  const result = await getBuyerRoom(slug, token, { demo: readDemo(query.demo), status })
  if (result.kind === "not_found") notFound()
  if (result.kind === "bad_token") return <CheckYourLink slug={slug} />

  const { deal } = result
  const base = `/room/${deal.slug}?t=${token}`

  return (
    <div className="min-h-dvh bg-paper">
      <RoomHeader slug={deal.slug} />
      <main className="mx-auto max-w-[1120px] px-5 pt-2 pb-16 lg:px-8">
        <DealRoomView
          deal={deal}
          viewer="buyer"
          hrefFor={(next) => `${base}&status=${next}`}
          problemHref={`/room/${deal.slug}/problem?t=${token}`}
        />
      </main>
      <AppFooter />
    </div>
  )
}

/** The link is missing its private token: show nothing about the deal. */
function CheckYourLink({ slug }: { slug: string }) {
  return (
    <div className="min-h-dvh bg-paper">
      <RoomHeader slug={slug} />
      <main className="mx-auto flex max-w-[560px] flex-col gap-3 px-5 py-16">
        <p className="label-caps text-ink-2">Private link</p>
        <h1 className="title-serif text-4xl text-ink">Check your <em className="italic">link</em></h1>
        <p className="text-base text-ink-2">
          Deal rooms open only from the private link we emailed you after paying. Open that email and tap the link
          again. It ends with a long code.
        </p>
      </main>
    </div>
  )
}
