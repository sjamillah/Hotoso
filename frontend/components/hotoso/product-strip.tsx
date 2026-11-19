import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatGHSShort } from "@/lib/money"
import type { PublicDeal } from "@/lib/types"
import { DealImage } from "./deal-image"
import { CategoryTag } from "./category-tag"

export function ProductStrip({ deals, sold = false, className }: { deals: PublicDeal[]; sold?: boolean; className?: string }) {
  return (
    <ul
      tabIndex={0}
      aria-label={sold ? "Recently sold items. Scroll sideways to see more." : "Items for sale. Scroll sideways to see more."}
      className={cn(
        "-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:thin] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4",
        className
      )}
    >
      {deals.map((d) => {
        const body = (
          <>
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
              <DealImage
                photo={d.photos[0]}
                sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 60vw"
                className={cn("transition-transform duration-[900ms] ease-calm", !sold && "group-hover:scale-[1.05]", sold && "grayscale-[35%]")}
              />
              {sold && (
                <span className="label-caps absolute top-2 left-2 rounded-full bg-ink px-2.5 py-1 text-paper">Sold</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <CategoryTag code={d.category} />
              <p className="line-clamp-2 text-base text-ink">{d.title}</p>
              {!sold && <p className="font-mono text-sm text-ink tabular-nums">{formatGHSShort(d.totalMinor)} with protection</p>}
            </div>
          </>
        )
        return (
          <li key={d.slug} className="w-[62%] shrink-0 snap-start sm:w-auto">
            {sold ? (
              <div className="flex flex-col gap-3">{body}</div>
            ) : (
              <Link href={`/d/${d.slug}`} className="group flex flex-col gap-3 rounded-sm">
                {body}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}
