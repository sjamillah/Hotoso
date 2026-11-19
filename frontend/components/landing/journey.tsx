"use client"

import * as React from "react"
import Image, { type StaticImageData } from "next/image"
import { Check, Lock } from "lucide-react"
import { photos } from "@/lib/photos"
import { cn } from "@/lib/utils"

/**
 * CHAPTER II · THE HOLD: a scroll-driven story.
 *
 * Layout: a "stage" stays pinned (CSS `position: sticky`) while the five
 * steps scroll past. An IntersectionObserver reports which step is in the
 * middle of the screen; the stage then moves the coin to match.
 *
 * Why it's worth the JavaScript: it's the product's whole promise, told by
 * the reader's own scrolling, including the "frozen" path that reassures
 * buyers most.
 */

type Place = "buyer" | "hotoso" | "seller"
type CoinState = "unpaid" | "held" | "clock" | "frozen" | "paid"

// Each photo shows the ACTION of its step, so the story stays one deal (Ama's Black AF1).
const STEPS: { n: string; title: string; body: string; at: Place; state: CoinState; caption: string; photo: StaticImageData; alt: string }[] = [
  {
    n: "01",
    title: "A link, not a leap of faith",
    body: "Ama creates a Hotoso link for the Black AF1 and drops it in WhatsApp. Kwame sees the photos, the exact price and Ama's track record.",
    at: "buyer",
    state: "unpaid",
    caption: "GHS 450 is still in Kwame's pocket",
    photo: photos.af1Black,
    alt: "The Black AF1 Ama is selling",
  },
  {
    n: "02",
    title: "Kwame pays Hotoso, not Ama",
    body: "MoMo or card, through Paystack. The money comes to us and waits. Ama gets a message: paid, ship now.",
    at: "hotoso",
    state: "held",
    caption: "GHS 450, held by Hotoso",
    photo: photos.phonePaying,
    alt: "Paying on a phone",
  },
  {
    n: "03",
    title: "Ama ships without fear",
    body: "The buyer is real: the money is already here. The moment the order is marked shipped, a 72-hour clock starts.",
    at: "hotoso",
    state: "clock",
    caption: "Still held · releases in 72 hours",
    photo: photos.riderStreet,
    alt: "A rider on the road with a delivery",
  },
  {
    n: "04",
    title: "Something wrong? It freezes.",
    body: "Not what was in the photos? Kwame taps “Something's wrong” before the clock runs out. The money freezes while we hear both sides.",
    at: "hotoso",
    state: "frozen",
    caption: "Frozen while we review",
    photo: photos.gazelleCloseup,
    alt: "A close look at the sole of a sneaker",
  },
  {
    n: "05",
    title: "“I got it.” Ama gets paid.",
    body: "When Kwame confirms, or the 72 hours pass quietly, the money goes straight to Ama's MoMo. Nobody had to trust a stranger.",
    at: "seller",
    state: "paid",
    caption: "Paid to Ama's MoMo",
    photo: photos.phoneTyping,
    alt: "Hands on a phone",
  },
]

const LEFT: Record<Place, string> = { buyer: "0%", hotoso: "50%", seller: "100%" }

export function Journey() {
  const [active, setActive] = React.useState(0)
  const stepRefs = React.useRef<(HTMLElement | null)[]>([])

  React.useEffect(() => {
    // A step is "active" when it crosses the middle band of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const step = STEPS[active]
  const fill = step.state === "unpaid" ? "0%" : step.state === "paid" ? "100%" : "50%"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
      {/* ------------------------------------------------ the pinned stage */}
      <div className="sticky top-0 z-10 -mx-5 bg-ink px-5 pt-6 pb-8 lg:top-[14vh] lg:mx-0 lg:h-[72vh] lg:self-start lg:px-0 lg:pt-0">
        <div className="flex h-full flex-col justify-center">
          <div aria-hidden="true">
            <div className="grid grid-cols-3 text-paper">
              {(["Kwame", "Hotoso", "Ama"] as const).map((name, i) => (
                <span
                  key={name}
                  className={cn(
                    "label-caps transition-colors duration-500",
                    i === 0 ? "text-left" : i === 1 ? "text-center" : "text-right",
                    LEFT[step.at] === ["0%", "50%", "100%"][i] ? "text-butter" : "text-paper"
                  )}
                >
                  {name}
                </span>
              ))}
            </div>

            <div className="relative mx-7 mt-5 h-20 lg:mx-9 lg:h-24">
              {/* the track, and how far the money has travelled */}
              <span className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-ink-2" />
              <span
                className={cn(
                  "absolute top-1/2 left-0 h-0.5 -translate-y-1/2 transition-[width,background-color] duration-700 ease-calm",
                  step.state === "frozen" ? "bg-clay" : "bg-butter"
                )}
                style={{ width: fill }}
              />
              {(["0%", "50%", "100%"] as const).map((x) => (
                <span key={x} style={{ left: x }} className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-ink" />
              ))}

              {/* the 72-hour clock: a dashed orbit around the held coin */}
              <span
                style={{ left: "50%" }}
                className={cn(
                  "absolute top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-butter transition-opacity duration-500 lg:size-32",
                  step.state === "clock" ? "opacity-100" : "opacity-0"
                )}
              />

              {/* THE coin */}
              <span
                style={{ left: LEFT[step.at] }}
                className={cn(
                  "absolute top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 font-display text-2xl font-semibold transition-[left,background-color,box-shadow] duration-[900ms] ease-calm lg:size-20 lg:text-4xl",
                  step.state === "unpaid" ? "border-paper bg-ink text-paper" : "border-ink bg-butter text-ink",
                  step.state === "frozen" && "shadow-[0_0_0_6px_var(--clay)]"
                )}
              >
                ₵
                {step.state === "frozen" && (
                  <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full border-2 border-ink bg-clay text-paper [&_svg]:size-3.5">
                    <Lock strokeWidth={2.5} />
                  </span>
                )}
                {step.state === "paid" && (
                  <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full border-2 border-ink bg-safe text-paper [&_svg]:size-3.5">
                    <Check strokeWidth={3} />
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* the caption, in the editorial italic voice */}
          <p aria-live="polite" className="mt-6 text-center font-display text-2xl font-light text-paper italic lg:mt-10 lg:text-4xl">
            {step.caption}
          </p>
          <p aria-hidden="true" className="label-mono mt-3 text-center text-paper">
            Step {step.n} of 05
          </p>
        </div>
      </div>

      {/* ------------------------------------------------ the steps that scroll past */}
      <ol className="relative">
        {STEPS.map((s, i) => (
          <li
            key={s.n}
            ref={(el) => {
              stepRefs.current[i] = el
            }}
            data-index={i}
            className="flex min-h-[88svh] flex-col justify-center py-10 lg:min-h-[82vh]"
          >
            <div className={cn("border-l-2 pl-6 transition-colors duration-500", i === active ? "border-butter" : "border-ink-2")}>
              <div className="relative mb-6 aspect-[16/10] w-full max-w-[460px] overflow-hidden rounded-sm bg-ink-2">
                <Image
                  src={s.photo}
                  alt={s.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 460px, 90vw"
                  className={cn("object-cover transition-[scale,filter] duration-[900ms] ease-calm", i === active ? "scale-100" : "scale-[1.06] brightness-75")}
                />
              </div>
              <span className="label-mono text-butter">{s.n}</span>
              <h3 className="mt-3 font-display text-3xl leading-[1.05] font-light text-paper lg:text-5xl">{s.title}</h3>
              <p className="mt-4 max-w-[40ch] text-lg text-paper">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
