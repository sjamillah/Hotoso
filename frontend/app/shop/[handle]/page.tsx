import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSellerShop, readDemo } from "@/lib/api"
import { PublicHeader } from "@/components/hotoso/site-header"
import { AppFooter } from "@/components/hotoso/app-footer"
import { Storefront } from "@/components/hotoso/storefront"
import { ProductStrip } from "@/components/hotoso/product-strip"
import { EmptyState } from "@/components/hotoso/states"
import { BackLink } from "@/components/hotoso/back-link"
import Link from "next/link"
import { ArrowLeft, Eye } from "lucide-react"

export async function generateMetadata({ params }: PageProps<"/shop/[handle]">): Promise<Metadata> {
  const { handle } = await params
  const shop = await getSellerShop(handle)
  return shop ? { title: `${shop.seller.name} (@${shop.seller.handle})`, description: shop.seller.bio } : { title: "Shop not found" }
}

export default async function ShopPage({ params, searchParams }: PageProps<"/shop/[handle]">) {
  const { handle } = await params
  const query = await searchParams
  const shop = await getSellerShop(handle, readDemo(query.demo))
  if (!shop) notFound()
  const preview = query.preview === "seller"

  const coverPhotos = [...shop.available, ...shop.sold].map((d) => d.photos[0])

  return (
    <div className="min-h-dvh bg-paper">
      {preview && (
        <div className="bg-ink text-paper">
          <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-2 lg:px-8">
            <p className="label-caps inline-flex items-center gap-2 text-paper [&_svg]:size-4">
              <Eye aria-hidden="true" /> This is how buyers see your shop
            </p>
            <Link href="/seller" className="inline-flex h-11 items-center gap-1.5 text-base font-medium text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper focus-visible:outline-paper [&_svg]:size-4">
              <ArrowLeft aria-hidden="true" /> Back to your deals
            </Link>
          </div>
        </div>
      )}
      <PublicHeader back={<BackLink fallbackHref={preview ? "/seller" : undefined} />} />
      <main className="mx-auto flex max-w-[1120px] flex-col gap-14 px-5 pt-2 pb-16 lg:px-8">
        <Storefront seller={shop.seller} photos={coverPhotos} />

        <section aria-labelledby="available-title" className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="label-mono text-ink-2">For sale now · {shop.available.length}</p>
            <h1 id="available-title" className="title-serif text-[2.25rem] text-ink">
              Available <em className="italic">to buy</em>
            </h1>
            <p className="max-w-[52ch] text-base text-ink-2">
              Every link is protected: your money waits with Hotoso until your order arrives.
            </p>
          </div>
          {shop.available.length ? (
            <ProductStrip deals={shop.available} />
          ) : (
            <EmptyState title="Nothing for sale right now">
              Check back soon, or message @{shop.seller.handle} to ask for a link.
            </EmptyState>
          )}
        </section>

        {shop.sold.length > 0 && (
          <section aria-labelledby="sold-title" className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="label-mono text-ink-2">Proof it arrives · {shop.sold.length}</p>
              <h2 id="sold-title" className="title-serif text-[2.25rem] text-ink">
                Recently <em className="italic">sold</em>
              </h2>
            </div>
            <ProductStrip deals={shop.sold} sold />
          </section>
        )}
      </main>
      <AppFooter />
    </div>
  )
}
