import type { Metadata } from "next"
import { RoomHeader } from "@/components/hotoso/site-header"
import { NewDealForm } from "@/components/hotoso/new-deal-form"
import { AppFooter } from "@/components/hotoso/app-footer"

export const metadata: Metadata = { title: "New deal" }

/**
 * /seller/deals/new: a static page (no data to load), so no skeleton is
 * needed. The whole form is one Client Component.
 */
export default function NewDealPage() {
  return (
    <div className="min-h-dvh bg-paper">
      <RoomHeader slug="new" backHref="/seller" label="Draft" />
      <main className="mx-auto max-w-[1120px] px-5 pt-2 pb-16 lg:px-8">
        <NewDealForm />
      </main>
      <AppFooter />
    </div>
  )
}
