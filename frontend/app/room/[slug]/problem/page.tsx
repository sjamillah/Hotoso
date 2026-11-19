import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getBuyerRoom } from "@/lib/api"
import { formatGHSShort } from "@/lib/money"
import { RoomHeader } from "@/components/hotoso/site-header"
import { DisputeFlow } from "@/components/hotoso/dispute-flow"
import { AppFooter } from "@/components/hotoso/app-footer"

export const metadata: Metadata = { title: "Something's wrong", robots: { index: false } }

/** /room/[slug]/problem?t=TOKEN: the buyer's "Something's wrong" flow. */
export default async function ProblemPage({ params, searchParams }: PageProps<"/room/[slug]/problem">) {
  const { slug } = await params
  const query = await searchParams
  const token = typeof query.t === "string" ? query.t : undefined

  const result = await getBuyerRoom(slug, token)
  if (result.kind === "not_found") notFound()
  if (result.kind === "bad_token") redirect(`/room/${slug}`)

  const { deal } = result
  const roomHref = `/room/${deal.slug}?t=${token}`

  return (
    <div className="min-h-dvh bg-paper">
      <RoomHeader slug={deal.slug} />
      <main className="mx-auto max-w-[560px] px-5 pt-2 pb-16">
        <DisputeFlow amount={formatGHSShort(deal.itemMinor)} sellerFirstName={deal.seller.firstName} roomHref={roomHref} />
      </main>
      <AppFooter />
    </div>
  )
}
