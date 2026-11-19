import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getSellerDeals, getSellerProfile, getSellerSummary, readDemo } from "@/lib/api"
import { formatGHSShort } from "@/lib/money"
import { Button } from "@/components/ui/button"
import { SellerHeader } from "@/components/hotoso/site-header"
import { MoneySummary } from "@/components/hotoso/seller/money-summary"
import { SellerDealList } from "@/components/hotoso/seller/deal-list"
import { NeedsYou, needsYouCount } from "@/components/hotoso/seller/needs-you"
import { ShopWindow } from "@/components/hotoso/seller/shop-window"
import { EmptyState } from "@/components/hotoso/states"
import { AppFooter } from "@/components/hotoso/app-footer"
import { Storefront } from "@/components/hotoso/storefront"
import { Eye } from "lucide-react"

export const metadata: Metadata = { title: "Your deals" }

export default async function SellerHomePage({ searchParams }: PageProps<"/seller">) {
  const demo = readDemo((await searchParams).demo)
  const [profile, summary, deals] = await Promise.all([getSellerProfile(demo), getSellerSummary(demo), getSellerDeals(demo)])
  const todo = needsYouCount(deals)

  return (
    <div className="min-h-dvh bg-paper">
      <SellerHeader name={profile.name} />
      <main className="mx-auto flex max-w-[1120px] flex-col gap-12 px-5 pt-4 pb-16 lg:gap-14 lg:px-8 lg:pt-8">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="label-mono text-ink-2">Your deals · Wednesday 18 November</p>
            <h1 className="title-serif text-[2.75rem] text-ink lg:text-[3.75rem]">
              Good afternoon, <em className="italic">{profile.firstName}.</em>
            </h1>
            <p className="max-w-[44ch] text-lg text-ink-2">
              {deals.length === 0
                ? "Create your first link and share it where your buyers are."
                : todo > 0
                  ? `${todo} ${todo === 1 ? "thing needs" : "things need"} you. ${formatGHSShort(summary.heldMinor)} is held for you.`
                  : `You're all caught up. ${formatGHSShort(summary.heldMinor)} is held for you.`}
            </p>
          </div>
          <Storefront
            seller={profile}
            photos={deals.map((d) => d.photos[0])}
            actions={
              <Button variant="outline" asChild>
                <Link href={`/shop/${profile.handle}?preview=seller`}>
                  <Eye /> See your shop
                </Link>
              </Button>
            }
          />
        </section>

        <MoneySummary summary={summary} payoutMasked={profile.payoutMasked} />

        <Button size="lg" width="full" asChild className="lg:hidden">
          <Link href="/seller/deals/new">
            <Plus /> New deal
          </Link>
        </Button>

        {deals.length === 0 ? (
          <EmptyState
            title="No deals yet"
            action={
              <Button asChild>
                <Link href="/seller/deals/new">
                  <Plus /> Create your first deal
                </Link>
              </Button>
            }
          >
            Make a link for one item, share it on WhatsApp or Instagram, and you&apos;ll see the money arrive here.
          </EmptyState>
        ) : (
          <>
            <NeedsYou deals={deals} />

            <ShopWindow deals={deals} />

            <section aria-labelledby="all-title" className="flex flex-col gap-4">
              <h2 id="all-title" className="heading-caps text-ink">
                All deals <span className="font-mono text-ink-2">· {deals.length}</span>
              </h2>
              <SellerDealList deals={deals} layout="table" />
            </section>
          </>
        )}
      </main>
      <AppFooter className="pb-24 lg:pb-0" />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-paper px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <Button size="lg" width="full" asChild>
          <Link href="/seller/deals/new">
            <Plus /> New deal
          </Link>
        </Button>
      </div>
    </div>
  )
}
