import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PublicHeader } from "@/components/hotoso/site-header"
import { AppFooter } from "@/components/hotoso/app-footer"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <PublicHeader />
      <main className="mx-auto flex w-full max-w-[880px] flex-1 flex-col justify-center gap-10 px-5 py-16 lg:px-8">
        <div className="flex flex-col gap-5">
          <p className="label-mono text-ink-2">404 · Link not found</p>
          <h1 className="title-serif text-[clamp(2.75rem,8vw,5rem)] text-ink">
            This link went <em className="italic">nowhere.</em>
          </h1>
          <p className="max-w-[46ch] text-lg text-ink-2">
            If someone sent you a deal link, check it was copied in full, or ask them to send it again.
          </p>
        </div>

        <div aria-hidden="true" className="relative mx-4 h-12">
          <span className="absolute top-1/2 h-px w-full -translate-y-1/2 border-t border-dashed border-ink-3" />
          <span className="absolute top-1/2 left-0 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-butter font-display text-xl font-semibold text-ink">
            ₵
          </span>
          <span className="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-3 bg-paper" />
        </div>
        <p className="font-display text-xl font-light text-ink italic">Don&apos;t worry: no money moves until you pay.</p>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          <Button size="lg" asChild>
            <Link href="/">Go to Hotoso</Link>
          </Button>
          <Link href="/#how" className="group flex h-11 items-center gap-1.5 text-base font-medium text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
            How Hotoso keeps your money safe <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </main>
      <AppFooter className="mt-0" />
    </div>
  )
}
