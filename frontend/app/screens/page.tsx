import type { Metadata } from "next"
import Link from "next/link"
import { Wordmark } from "@/components/hotoso/wordmark"
import { DEAL_STATUSES } from "@/lib/types"

export const metadata: Metadata = { title: "All screens", robots: { index: false } }

const statusLinks = (base: string) =>
  DEAL_STATUSES.map((s) => ({ label: s, href: `${base}${base.includes("?") ? "&" : "?"}status=${s}` }))

const GROUPS: { title: string; note?: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Landing",
    links: [{ label: "Landing page", href: "/" }],
  },
  {
    title: "Public deal page",
    links: [
      { label: "Normal (can pay)", href: "/d/SMB40OGA" },
      { label: "Already paid", href: "/d/7KQ2XM4A" },
      { label: "Cancelled", href: "/d/CNVHIBK9" },
      { label: "Loading (4s)", href: "/d/SMB40OGA?demo=slow" },
      { label: "Error", href: "/d/SMB40OGA?demo=error" },
      { label: "Not found", href: "/d/NOPE1234" },
    ],
  },
  {
    title: "Deal page in other categories (doc 08)",
    note: "Each one shows its own inspection window and buyer rules.",
    links: [
      { label: "Fashion · sweater", href: "/d/SWTLIL01" },
      { label: "Electronics · iPhone (48h test, IMEI)", href: "/d/IPH15P256" },
      { label: "Beauty · perfume (48h, sealed)", href: "/d/PRFAMB19" },
      { label: "Bags · woven bag", href: "/d/BAGWVN01" },
      { label: "Sports · jerseys", href: "/d/JRSY2526" },
      { label: "Home · armchair", href: "/d/CHRTEAK1" },
      { label: "Handmade · basket (10-day make)", href: "/d/BSKTWV01" },
    ],
  },
  {
    title: "Seller shops (public)",
    note: "What buyers see when they tap “Visit shop”.",
    links: [
      { label: "@ama.kicks (sneakers)", href: "/shop/ama.kicks" },
      { label: "@kofi.gadgets (verified)", href: "/shop/kofi.gadgets" },
      { label: "@efua.thrift (new seller)", href: "/shop/efua.thrift" },
      { label: "Shop not found", href: "/shop/nobody.here" },
    ],
  },
  {
    title: "Pay return",
    links: [
      { label: "Confirming → success", href: "/pay/return?reference=HTS-PAY-01JDSMB40X&deal=SMB40OGA&demo=success" },
      { label: "Confirming → failed", href: "/pay/return?reference=HTS-PAY-01JDSMB40X&deal=SMB40OGA&demo=failed" },
      { label: "Slow (hint at 20s, give up at 60s)", href: "/pay/return?reference=HTS-PAY-01JDSMB40X&deal=SMB40OGA&demo=slow" },
    ],
  },
  {
    title: "Buyer deal room",
    note: "Kwame's AF1 order. Each link previews one status.",
    links: [
      { label: "As it is (shipped)", href: "/room/7KQ2XM4A?t=demo" },
      ...statusLinks("/room/7KQ2XM4A?t=demo"),
      { label: "Missing token", href: "/room/7KQ2XM4A" },
      { label: "Loading (4s)", href: "/room/7KQ2XM4A?t=demo&demo=slow" },
      { label: "Error", href: "/room/7KQ2XM4A?t=demo&demo=error" },
    ],
  },
  {
    title: "Dispute flow",
    links: [{ label: "Something's wrong", href: "/room/7KQ2XM4A/problem?t=demo" }],
  },
  {
    title: "Seller home",
    links: [
      { label: "Normal", href: "/seller" },
      { label: "Empty (new seller)", href: "/seller?demo=empty" },
      { label: "Loading (4s)", href: "/seller?demo=slow" },
      { label: "Error", href: "/seller?demo=error" },
    ],
  },
  {
    title: "Seller deal room",
    note: "Akosua's Air Jordan 1 Low. Each link previews one status.",
    links: [{ label: "As it is (ship now)", href: "/seller/deals/AJ1LOWOL" }, ...statusLinks("/seller/deals/AJ1LOWOL")],
  },
  {
    title: "New deal + share sheet",
    links: [{ label: "New deal", href: "/seller/deals/new" }],
  },
  {
    title: "Design system",
    links: [{ label: "Styleguide", href: "/styleguide" }],
  },
]

export default function ScreensPage() {
  return (
    <div className="min-h-dvh bg-paper">
      <main className="mx-auto flex max-w-[880px] flex-col gap-10 px-5 py-10 lg:px-8">
        <div className="flex flex-col gap-3">
          <Wordmark />
          <h1 className="text-3xl font-semibold text-ink">All screens</h1>
          <p className="max-w-[60ch] text-base text-ink-2">
            Every screen and state, with mock data. Turn on airplane mode on any page to see the offline banner.
          </p>
        </div>
        {GROUPS.map((g) => (
          <section key={g.title} className="flex flex-col gap-3 border-t border-ink pt-4">
            <h2 className="heading-caps text-ink">{g.title}</h2>
            {g.note && <p className="text-base text-ink-2">{g.note}</p>}
            <ul className="flex flex-wrap gap-2">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex h-11 items-center rounded-xs border border-rule bg-card px-3 font-mono text-sm text-ink hover:border-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  )
}
