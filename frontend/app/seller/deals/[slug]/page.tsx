import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSellerDeal, getSellerDeals, readDemo } from "@/lib/api"
import { isDealStatus } from "@/lib/types"
import { RoomHeader } from "@/components/hotoso/site-header"
import { DealRoomView } from "@/components/hotoso/deal-room/deal-room-view"
import { SellerDealList } from "@/components/hotoso/seller/deal-list"
import { AppFooter } from "@/components/hotoso/app-footer"

export const metadata: Metadata = { title: "Deal" }

export default async function SellerDealPage({ params, searchParams }: PageProps<"/seller/deals/[slug]">) {
  const { slug } = await params
  const query = await searchParams
  const demo = readDemo(query.demo)
  const status = isDealStatus(query.status) ? query.status : undefined

  const [deal, deals] = await Promise.all([getSellerDeal(slug, { demo, status }), getSellerDeals(demo)])
  if (!deal) notFound()

  return (
    <div className="min-h-dvh bg-paper">
      <RoomHeader slug={deal.slug} backHref="/seller" wide />
      <main className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-5 pt-2 pb-16 lg:grid-cols-[340px_minmax(0,1fr)] lg:px-8">
        <nav aria-label="Your deals" className="hidden lg:sticky lg:top-6 lg:block lg:max-h-[calc(100dvh-3rem)] lg:self-start lg:overflow-y-auto">
          <SellerDealList deals={deals} selectedSlug={deal.slug} />
        </nav>
        <DealRoomView deal={deal} viewer="seller" hrefFor={(s) => `/seller/deals/${deal.slug}?status=${s}`} />
      </main>
      <AppFooter />
    </div>
  )
}
