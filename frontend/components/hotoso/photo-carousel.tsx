"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DealPhoto } from "@/lib/types"
import { DealImage } from "./deal-image"

export function PhotoCarousel({
  photos,
  title,
  variant = "hero",
  className,
}: {
  photos: DealPhoto[]
  title: string
  variant?: "hero" | "compact"
  className?: string
}) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const thumbsRef = React.useRef<HTMLDivElement>(null)
  const [index, setIndex] = React.useState(0)
  const many = photos.length > 1
  const lots = photos.length > 6
  const hero = variant === "hero"

  React.useEffect(() => {
    const strip = thumbsRef.current
    const thumb = strip?.children[index] as HTMLElement | undefined
    if (!strip || !thumb) return
    strip.scrollTo({ left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2, behavior: "smooth" })
  }, [index])

  function onScroll() {
    const el = trackRef.current
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }
  function goTo(i: number) {
    const el = trackRef.current
    const next = Math.max(0, Math.min(photos.length - 1, i))
    el?.scrollTo({ left: next * el.clientWidth, behavior: "smooth" })
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="group/gallery relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          tabIndex={many ? 0 : undefined}
          role="region"
          aria-roledescription={many ? "carousel" : undefined}
          aria-label={many ? `Photos of ${title}. Swipe or use arrow keys.` : `Photo of ${title}`}
          className={cn(
            "flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            hero ? "lg:rounded-md" : "rounded-md"
          )}
        >
          {photos.map((photo, i) => (
            <figure key={photo.id} className="w-full shrink-0 snap-center" aria-label={`Photo ${i + 1} of ${photos.length}`}>
              <div
                className={cn(
                  "relative w-full overflow-hidden bg-muted",
                  hero ? "aspect-[4/5] max-h-[52svh] lg:max-h-[78vh]" : "aspect-[4/3]"
                )}
              >
                <DealImage photo={photo} preload={hero && i === 0} sizes={hero ? "(min-width: 1024px) 600px, 100vw" : "(min-width: 1024px) 420px, 100vw"} />
              </div>
            </figure>
          ))}
        </div>

        {many && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous photo"
              className={cn(
                "absolute top-1/2 left-3 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-card transition-opacity duration-200 hover:bg-card lg:flex [&_svg]:size-5",
                index === 0 && "pointer-events-none opacity-0"
              )}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next photo"
              className={cn(
                "absolute top-1/2 right-3 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-card transition-opacity duration-200 hover:bg-card lg:flex [&_svg]:size-5",
                index === photos.length - 1 && "pointer-events-none opacity-0"
              )}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </>
        )}

        {many && (
          <span aria-hidden="true" className="label-mono pointer-events-none absolute bottom-3 left-3 rounded-full bg-ink px-2.5 py-1 text-paper">
            {index + 1} / {photos.length}
          </span>
        )}
        {hero && (
          <span className="label-caps pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-paper [&_svg]:size-3.5">
            <ShieldCheck aria-hidden="true" /> Protected
          </span>
        )}
      </div>

      {many && (
        <>
          {lots && (
            <div aria-hidden="true" className={cn("flex h-11 items-center lg:hidden", hero && "px-5")}>
              <div className="h-0.5 w-full rounded-full bg-rule">
                <div className="h-full rounded-full bg-ink transition-[width] duration-300 ease-calm" style={{ width: `${((index + 1) / photos.length) * 100}%` }} />
              </div>
            </div>
          )}
          <div className={cn("flex gap-1.5 lg:hidden", hero && "px-5", lots && "hidden")}>
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className="group flex h-11 flex-1 items-center"
              >
                <span className={cn("h-0.5 w-full rounded-full transition-colors duration-150", i === index ? "bg-ink" : "bg-rule group-hover:bg-ink-3")} />
              </button>
            ))}
          </div>

          <div ref={thumbsRef} className="hidden snap-x gap-2 overflow-x-auto p-0.5 [scrollbar-width:thin] lg:flex">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show photo ${i + 1}: ${photo.alt}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "relative shrink-0 snap-start overflow-hidden rounded-sm bg-muted transition-[opacity,box-shadow] duration-200",
                  hero ? "size-16" : "size-12",
                  i === index ? "opacity-100 shadow-[0_0_0_2px_var(--ink)]" : "opacity-60 hover:opacity-100"
                )}
              >
                <DealImage photo={photo} sizes="128px" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
