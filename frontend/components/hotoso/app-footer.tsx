import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Wordmark } from "./wordmark"

/**
 * The quiet footer for every page after the landing. It gives each page an
 * ending (instead of just stopping), carries the brand, and offers the way
 * back to "How it works" for a buyer who's still unsure.
 *
 * `padForPayBar`: the public deal page has a pay button pinned to the bottom
 * of the phone screen, so the footer leaves room for it there.
 */
export function AppFooter({ padForPayBar = false, className }: { padForPayBar?: boolean; className?: string }) {
  return (
    <footer className={cn("mt-16 border-t border-rule", padForPayBar && "pb-28 lg:pb-0", className)}>
      <div className="mx-auto flex max-w-[1120px] flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex flex-col gap-2">
          <Link href="/" aria-label="Hotoso home" className="flex h-11 w-fit items-center rounded-xs">
            <Wordmark className="text-xl" />
          </Link>
          <p className="max-w-[36ch] font-display text-lg leading-snug font-light text-ink-2">
            Your money waits with Hotoso <em className="italic">until your order arrives.</em>
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Link href="/#how" className="label-mono flex h-11 items-center text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
            How it works
          </Link>
          <Link href="/credits" className="label-mono flex h-11 items-center text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
            Photo credits
          </Link>
          <span className="label-mono flex h-11 items-center gap-1.5 text-ink-2 [&_svg]:size-3.5">
            <ShieldCheck aria-hidden="true" /> Paystack test mode
          </span>
        </nav>
      </div>
    </footer>
  )
}
