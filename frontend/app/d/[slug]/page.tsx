import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPublicDeal, getSellerShop, readDemo } from "@/lib/api"
import { formatGHS } from "@/lib/money"
import { receiptLines } from "@/lib/mock"
import type { PublicDeal } from "@/lib/types"
import { PublicHeader } from "@/components/hotoso/site-header"
import { PhotoCarousel } from "@/components/hotoso/photo-carousel"
import { Storefront } from "@/components/hotoso/storefront"
import { ProductStrip } from "@/components/hotoso/product-strip"
import { ReceiptCard } from "@/components/hotoso/receipt-card"
import { Reveal } from "@/components/hotoso/reveal"
import { HoldStrip } from "@/components/hotoso/hold-strip"
import { Reassurance, HOW_IT_WORKS } from "@/components/hotoso/reassurance"
import { HowItWorksSheet } from "@/components/hotoso/how-it-works-sheet"
import { PaySheet } from "@/components/hotoso/pay-sheet"
import { AppFooter } from "@/components/hotoso/app-footer"
import { BackLink } from "@/components/hotoso/back-link"
import { CategoryTag } from "@/components/hotoso/category-tag"
import { windowLabel } from "@/lib/categories"

export async function generateMetadata({ params }: PageProps<"/d/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const deal = await getPublicDeal(slug)
  if (!deal) return { title: "Deal not found" }
  return {
    title: `${deal.title} · ${formatGHS(deal.itemMinor)}`,
    description: `Pay ${deal.seller.firstName} safely. Your money waits with Hotoso until your order arrives.`,
  }
}

export default async function DealPage({ params, searchParams }: PageProps<"/d/[slug]">) {
  const { slug } = await params
  const demo = readDemo((await searchParams).demo)
  const deal = await getPublicDeal(slug, demo)
  if (!deal) notFound()
  const shop = await getSellerShop(deal.seller.handle)
  const coverPhotos = shop ? [...shop.available, ...shop.sold].map((d) => d.photos[0]) : deal.photos
  const moreToBuy = shop?.available.filter((d) => d.slug !== deal.slug) ?? []
  const recentlySold = shop?.sold ?? []

  const canPay = deal.status === "awaiting_payment"

  return (
    <div className="min-h-dvh bg-paper">
      <PublicHeader
        back={<BackLink />}
        right={
          <HowItWorksSheet>
            <HowItWorksContent sellerFirstName={deal.seller.firstName} amountMinor={deal.itemMinor} />
          </HowItWorksSheet>
        }
      />

      <main className="mx-auto grid max-w-[1120px] gap-8 pb-36 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:gap-16 lg:px-8 lg:pt-4 lg:pb-24">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <PhotoCarousel photos={deal.photos} title={deal.title} />
        </div>

        <div className="flex flex-col gap-12 px-5 lg:px-0">
          <section className="order-1 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <CategoryTag code={deal.category} />
              <span aria-hidden="true" className="text-ink-2">·</span>
              <p className="label-caps text-ink-2">From @{deal.seller.handle}</p>
            </div>
            <h1 className="title-serif text-[2rem] text-ink lg:text-[2.75rem]">{deal.title}</h1>
            <p className="font-mono text-lg text-ink tabular-nums">{formatGHS(deal.itemMinor)}</p>
            <p className="max-w-[48ch] text-base text-ink-2">{deal.description}</p>
            <p className="label-mono mt-1 text-ink-2">{windowLabel(deal.category)} after delivery · ships within {deal.shipWithinDays} {deal.shipWithinDays === 1 ? "day" : "days"}</p>
          </section>

          <Storefront seller={deal.seller} photos={coverPhotos} variant="card" className="order-2 lg:order-3" />

          {canPay ? <PayStory deal={deal} /> : <NotPayable deal={deal} />}
        </div>
      </main>

      {(moreToBuy.length > 0 || recentlySold.length > 0) && (
        <section aria-labelledby="more-title" className="mx-auto flex max-w-[1120px] flex-col gap-6 border-t border-rule px-5 pt-14 lg:px-8">
          <div className="flex flex-col gap-1">
            <p className="label-mono text-ink-2">From @{deal.seller.handle}</p>
            <h2 id="more-title" className="title-serif text-[2rem] text-ink lg:text-[2.5rem]">
              {moreToBuy.length > 0 ? (
                <>More from <em className="italic">{deal.seller.firstName}</em></>
              ) : (
                <>Recently <em className="italic">sold</em> by {deal.seller.firstName}</>
              )}
            </h2>
          </div>
          {moreToBuy.length > 0 && <ProductStrip deals={moreToBuy} />}
          {recentlySold.length > 0 && (
            <>
              {moreToBuy.length > 0 && <p className="heading-caps text-ink">Recently sold</p>}
              <ProductStrip deals={recentlySold.slice(0, 4)} sold />
            </>
          )}
        </section>
      )}
      <AppFooter padForPayBar={canPay} />
    </div>
  )
}

function PayStory({ deal }: { deal: PublicDeal }) {
  return (
    <>
      <section className="order-3 flex flex-col gap-4 lg:order-2" aria-labelledby="price-heading">
        <h2 id="price-heading" className="heading-caps text-ink">Price</h2>
        <Reveal className="print">
          <ReceiptCard lines={receiptLines(deal)} totalMinor={deal.totalMinor} />
        </Reveal>
        <PaySheet slug={deal.slug} totalMinor={deal.totalMinor} sellerFirstName={deal.seller.firstName} />
      </section>

      <section className="order-4 flex flex-col gap-5" aria-labelledby="money-heading">
        <h2 id="money-heading" className="heading-caps text-ink">How your money moves</h2>
        <HoldStrip
          status="awaiting_payment"
          amountMinor={deal.itemMinor}
          buyerName="You"
          sellerName={deal.seller.firstName}
          caption="Your money stays with you until you pay"
          detail={`Then Hotoso holds it until you get your order.`}
        />
        <Reassurance sellerFirstName={deal.seller.firstName} category={deal.category} proofs={deal.proofs} />
      </section>
    </>
  )
}

function NotPayable({ deal }: { deal: PublicDeal }) {
  const cancelled = deal.status === "cancelled"
  return (
    <section className="order-3 flex flex-col gap-3 rounded-md border border-rule bg-card p-6 lg:order-2">
      <h2 className="text-xl font-semibold text-ink">
        {cancelled ? `${deal.seller.firstName} cancelled this deal` : "This deal is already paid for"}
      </h2>
      <p className="text-base text-ink-2">
        {cancelled
          ? "Nobody can pay for it now, and no money moved. Ask the seller for a new link if you still want it."
          : "If you're the buyer, open the deal room link we emailed you to follow your order."}
      </p>
      <Link href={`https://instagram.com/${deal.seller.handle}`} className="flex h-11 w-fit items-center text-base font-medium text-safe underline underline-offset-4">
        Message @{deal.seller.handle}
      </Link>
    </section>
  )
}

function HowItWorksContent({ sellerFirstName, amountMinor }: { sellerFirstName: string; amountMinor: number }) {
  return (
    <div className="flex flex-col gap-6 pb-2">
      <HoldStrip status="funded" amountMinor={amountMinor} buyerName="You" sellerName={sellerFirstName} />
      <ol className="flex flex-col gap-4">
        {HOW_IT_WORKS.map((step) => (
          <li key={step.n} className="flex gap-4">
            <span className="label-mono pt-1 text-ink-2">{step.n}</span>
            <div>
              <p className="text-base font-semibold text-ink">{step.title}</p>
              <p className="text-base text-ink-2">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
