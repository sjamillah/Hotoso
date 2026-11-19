import Link from "next/link"
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DealPhoto, PublicSeller } from "@/lib/types"
import { DealImage } from "./deal-image"

/**
 * THE STOREFRONT: a seller's shop identity, like a signboard.
 *
 * The cover is a mosaic of the seller's OWN product photos, so the visuals
 * always match what they sell: Ama's sneakers, Kofi's phones. Then the
 * avatar (overlapping the cover, like a profile page), name, a one-line bio,
 * where they are, and the real numbers buyers judge them by.
 *
 *   variant="banner"  the seller's dashboard and their public shop page
 *   variant="card"    the deal page, with a "Visit shop" link
 */

// Column classes written out in full (Tailwind only generates classes it can see)
const MOBILE_COLS = ["grid-cols-1", "grid-cols-1", "grid-cols-2", "grid-cols-3"]
const WIDE_COLS = ["sm:grid-cols-1", "sm:grid-cols-1", "sm:grid-cols-2", "sm:grid-cols-3", "sm:grid-cols-4", "sm:grid-cols-5"]

export function StoreCover({ photos, className }: { photos: DealPhoto[]; className?: string }) {
  // One tile per DIFFERENT photo, up to 5: a seller with one product gets one
  // full-width cover photo instead of one tile and an empty black gap.
  const tiles = photos.filter((p, i, all) => all.findIndex((q) => q.src === p.src) === i).slice(0, 5)
  const n = Math.max(tiles.length, 1)
  return (
    <div aria-hidden="true" className={cn("relative grid gap-0.5 overflow-hidden bg-ink", MOBILE_COLS[Math.min(n, 3)], WIDE_COLS[n], className)}>
      {tiles.map((p, i) => (
        <div key={`${p.id}-${i}`} className={cn("relative bg-muted", i >= 3 && "hidden sm:block")}>
          <DealImage photo={p} sizes="(min-width: 640px) 25vw, 33vw" />
        </div>
      ))}
      {/* a soft ink fade at the bottom, so the avatar and text sit calmly on top */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
    </div>
  )
}

function initials(name: string) {
  return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()
}

export function SellerAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        // relative + z-10: the cover is "positioned", so it would paint OVER the
        // avatar; positioning the avatar with a higher z-index brings it on top
        "relative z-10 flex shrink-0 items-center justify-center rounded-full border-4 border-card bg-butter font-display font-semibold text-ink",
        className
      )}
    >
      {initials(name)}
    </span>
  )
}

export function Storefront({
  seller,
  photos,
  variant = "banner",
  actions,
  className,
}: {
  seller: PublicSeller
  photos: DealPhoto[]
  variant?: "banner" | "card"
  actions?: React.ReactNode
  className?: string
}) {
  const banner = variant === "banner"
  const isNew = seller.dealsCompleted === 0

  return (
    <section aria-label={`${seller.name}'s shop`} className={cn("overflow-hidden rounded-md border border-rule bg-card", className)}>
      <StoreCover photos={photos} className={banner ? "h-32 sm:h-44 lg:h-52" : "h-24"} />

      <div className={cn("flex flex-col gap-5", banner ? "px-5 pb-6 lg:flex-row lg:items-end lg:justify-between lg:px-7" : "px-4 pb-5")}>
        <div className="flex min-w-0 flex-col gap-3">
          <SellerAvatar
            name={seller.name}
            className={banner ? "-mt-10 size-20 text-2xl lg:-mt-12 lg:size-24 lg:text-3xl" : "-mt-8 size-16 text-xl"}
          />
          <div className="flex min-w-0 flex-col gap-1">
            <p className={cn("title-serif flex flex-wrap items-center gap-x-2 text-ink", banner ? "text-[1.75rem] lg:text-[2.25rem]" : "text-2xl")}>
              {seller.name}
              {seller.verified && (
                <span className="label-caps inline-flex items-center gap-1 rounded-full bg-safe-soft px-2 py-1 font-sans text-safe [&_svg]:size-3.5">
                  <BadgeCheck aria-hidden="true" /> Verified
                </span>
              )}
            </p>
            <p className="font-mono text-sm text-ink-2">@{seller.handle}</p>
            {seller.bio && <p className="max-w-[44ch] text-base text-ink">{seller.bio}</p>}
            {seller.location && (
              <p className="label-mono inline-flex items-center gap-1.5 text-ink-2 [&_svg]:size-3.5">
                <MapPin aria-hidden="true" /> {seller.location}
              </p>
            )}
          </div>

          {/* the numbers buyers judge a seller by: real, never stars */}
          {isNew ? (
            <p className="label-caps w-fit rounded-full bg-butter-soft px-2.5 py-1.5 text-ink">New on Hotoso</p>
          ) : (
            <dl className="flex flex-wrap items-end gap-x-7 gap-y-3">
              <Stat value={String(seller.dealsCompleted)} label="Deals done" />
              <Stat value={String(seller.problems)} label="Problems" />
              <Stat value={seller.memberSince} label="On Hotoso since" small />
            </dl>
          )}
        </div>

        {actions && <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">{actions}</div>}
        {!banner && (
          <Link href={`/shop/${seller.handle}`} className="group flex h-11 w-fit items-center gap-1.5 text-base font-medium text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
            Visit {seller.firstName}&apos;s shop <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  )
}

function Stat({ value, label, small }: { value: string; label: string; small?: boolean }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="label-caps text-ink-2">{label}</dt>
      <dd className={cn("money leading-none text-ink", small ? "text-xl" : "text-3xl")}>{value}</dd>
    </div>
  )
}
