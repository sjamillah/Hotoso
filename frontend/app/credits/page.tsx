import type { Metadata } from "next"
import Image from "next/image"
import { PublicHeader } from "@/components/hotoso/site-header"
import { PHOTO_CREDITS, photos } from "@/lib/photos"
import { AppFooter } from "@/components/hotoso/app-footer"
import { BackLink } from "@/components/hotoso/back-link"

export const metadata: Metadata = { title: "Photo credits" }

export default function CreditsPage() {
  return (
    <div className="min-h-dvh bg-paper">
      <PublicHeader back={<BackLink fallbackHref="/" />} />
      <main className="mx-auto flex max-w-[880px] flex-col gap-8 px-5 py-10 lg:px-8">
        <div className="flex flex-col gap-2">
          <p className="label-caps text-ink-2">Thank you</p>
          <h1 className="title-serif text-[2.75rem] text-ink">Photo <em className="italic">credits</em></h1>
          <p className="max-w-[60ch] text-base text-ink-2">
            All photos come from Unsplash and are used under the{" "}
            <a href="https://unsplash.com/license" className="text-safe underline underline-offset-4">Unsplash License</a>.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {PHOTO_CREDITS.map((c) => (
            <li key={c.file} className="flex flex-col gap-2">
              <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
                <Image src={photos[c.file]} alt="" fill placeholder="blur" sizes="(min-width: 640px) 280px, 50vw" className="object-cover" />
              </div>
              <a href={c.url} className="flex min-h-11 items-center text-base text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
                {c.by}
              </a>
            </li>
          ))}
        </ul>
      </main>
      <AppFooter />
    </div>
  )
}
