import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublicDeal } from "@/lib/api"
import { receiptLines } from "@/lib/mock"
import { PublicHeader } from "@/components/hotoso/site-header"
import { PayReturn } from "@/components/hotoso/pay-return"
import { AppFooter } from "@/components/hotoso/app-footer"

export const metadata: Metadata = { title: "Confirming your payment" }

/**
 * /pay/return?reference=HTS-PAY-…   (Paystack sends the buyer back here)
 *
 * Mock-only switches: &deal=SLUG picks which deal, &demo=success|failed|slow
 * picks how the pretend Paystack answers. In M3 the backend's status
 * endpoint tells us the deal and the outcome.
 */
export default async function PayReturnPage({ searchParams }: PageProps<"/pay/return">) {
  const query = await searchParams
  const reference = typeof query.reference === "string" ? query.reference : null
  const slug = typeof query.deal === "string" ? query.deal : "SMB40OGA"
  const outcome = query.demo === "failed" || query.demo === "slow" ? query.demo : "success"
  if (!reference) notFound()

  const deal = await getPublicDeal(slug)
  if (!deal) notFound()

  return (
    <div className="min-h-dvh bg-paper">
      <PublicHeader />
      <PayReturn
        reference={reference}
        outcome={outcome}
        deal={{
          slug: deal.slug,
          title: deal.title,
          sellerFirstName: deal.seller.firstName,
          shipWithinDays: deal.shipWithinDays,
          itemMinor: deal.itemMinor,
          totalMinor: deal.totalMinor,
          lines: receiptLines(deal),
        }}
      />
      <AppFooter />
    </div>
  )
}
