import { Check, Lock, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatGHSShort, type Minor } from "@/lib/money"
import type { DealStatus } from "@/lib/types"

/**
 * HOLD STRIP: the hero of the product (doc 04 §4.1).
 *
 *     Kwame            Hotoso              Ama
 *      ○ ─────────────── ● ─────────────── ○
 *                 GHS 450 held safely
 *
 * A coin sits at the PLACE where the money is right now. It answers
 * "where is my money?" in under a second, without reading a word.
 *
 * Server Component: no JavaScript is sent for it. The coin's movement is a
 * CSS animation, so it costs nothing on a slow phone.
 */

type Place = "buyer" | "hotoso" | "seller"
type TrackTone = "rule" | "ink" | "clay" | "wait"
type CoinMark = "lock" | "warn" | "check" | null
type Motion = "release" | "refund" | null

type Visual = {
  coinAt: Place | null // null = no coin (cancelled)
  coinOutline?: boolean // money not paid yet: an empty coin
  track: [TrackTone, TrackTone] // [buyer→hotoso, hotoso→seller]
  mark: CoinMark
  motion: Motion
  faded?: boolean
}

// One row per status: the table in doc 04 §4.1, as code.
const VISUALS: Record<DealStatus, Visual> = {
  awaiting_payment: { coinAt: "buyer", coinOutline: true, track: ["rule", "rule"], mark: null, motion: null },
  funded: { coinAt: "hotoso", track: ["ink", "rule"], mark: null, motion: null },
  shipped: { coinAt: "hotoso", track: ["ink", "rule"], mark: null, motion: null },
  disputed: { coinAt: "hotoso", track: ["clay", "rule"], mark: "lock", motion: null },
  releasing: { coinAt: "hotoso", track: ["ink", "ink"], mark: null, motion: "release" },
  released: { coinAt: "seller", track: ["ink", "ink"], mark: "check", motion: null },
  payout_failed: { coinAt: "hotoso", track: ["wait", "rule"], mark: "warn", motion: null },
  refunding: { coinAt: "hotoso", track: ["clay", "rule"], mark: null, motion: "refund" },
  refunded: { coinAt: "buyer", track: ["clay", "rule"], mark: null, motion: null },
  cancelled: { coinAt: null, track: ["rule", "rule"], mark: null, motion: null, faded: true },
}

const PLACE_LEFT: Record<Place, string> = { buyer: "0%", hotoso: "50%", seller: "100%" }

export type HoldStripProps = {
  status: DealStatus
  amountMinor: Minor
  buyerName: string
  sellerName: string
  /** funded: when the seller must ship by, e.g. "Fri, 21 Nov" */
  shipBy?: string
  /** shipped: when money auto-releases, e.g. "Sat 22 Nov, 2:14 PM" */
  releaseAt?: string
  /** shipped: time left, e.g. "2d 14h" (shown in mono) */
  countdown?: string
  /** released / refunded: the date it happened, e.g. "22 Nov" */
  doneOn?: string
  /** Replace the caption (e.g. on the public deal page preview). */
  caption?: string
  /** Replace the small line under the caption. */
  detail?: string
  /** Pay-return "confirming": the coin breathes at the buyer while we check. */
  pulse?: boolean
  /** Pay-return "success": the coin glides Buyer → Hotoso once. */
  arrive?: boolean
  /** Which surface it sits on. Use "ink" inside dark cards. */
  tone?: "paper" | "ink"
  className?: string
}

/* Grammar for when the person reading IS one of the names ("You"). */
const isYou = (name: string) => name === "You"
const possessive = (name: string) => (isYou(name) ? "your" : `${name}'s`)
const object = (name: string) => (isYou(name) ? "you" : name)

/** The words under the strip, per status (doc 04 §4.1 captions). */
export function holdStripCopy(p: HoldStripProps): { caption: string; detail?: string; pill: boolean } {
  const amount = formatGHSShort(p.amountMinor)
  const seller = p.sellerName
  const buyer = p.buyerName
  switch (p.status) {
    case "awaiting_payment":
      return { caption: "Waiting for payment", pill: false }
    case "funded":
      return {
        caption: `${amount} held safely`,
        detail: p.shipBy ? `${isYou(seller) ? "Ship" : `${seller} ships`} by ${p.shipBy}` : undefined,
        pill: true,
      }
    case "shipped":
      return {
        caption: `${amount} held safely`,
        detail: p.releaseAt ? `Releases ${p.releaseAt}` : undefined,
        pill: true,
      }
    case "disputed":
      return { caption: "Frozen while we review", detail: `${amount} stays with Hotoso`, pill: false }
    case "releasing":
      return { caption: `Sending to ${possessive(seller)} MoMo…`, pill: false }
    case "released":
      return { caption: `Paid to ${object(seller)}${p.doneOn ? ` · ${p.doneOn}` : ""}`, pill: false }
    case "payout_failed":
      return { caption: `Couldn't reach ${possessive(seller)} MoMo, retrying`, detail: `${amount} is still safe with Hotoso`, pill: false }
    case "refunding":
      return { caption: `Refunding to ${object(buyer)}…`, pill: false }
    case "refunded":
      return { caption: `Refunded to ${object(buyer)}${p.doneOn ? ` · ${p.doneOn}` : ""}`, pill: false }
    case "cancelled":
      return { caption: "Deal cancelled, no money moved", pill: false }
  }
}

/** One plain sentence for screen readers (the drawing itself is hidden). */
function spokenSentence(p: HoldStripProps, caption: string, detail?: string) {
  const where: Record<Place, string> = {
    buyer: `with ${object(p.buyerName)}`,
    hotoso: "held by Hotoso",
    seller: `with ${object(p.sellerName)}`,
  }
  const at = VISUALS[p.status].coinAt
  const location = at ? `The money is ${where[at]}.` : "No money has moved."
  return [location, caption, detail, p.countdown ? `${p.countdown} left.` : null]
    .filter(Boolean)
    .join(" ")
}

export function HoldStrip(props: HoldStripProps) {
  const { status, buyerName, sellerName, pulse, arrive, tone = "paper", className } = props
  const v = VISUALS[status]
  const copy = holdStripCopy(props)
  const caption = props.caption ?? copy.caption
  const detail = props.detail ?? copy.detail
  const onInk = tone === "ink"

  // Track colours. On a dark card, "ink" lines would be invisible, so the
  // travelled part of the track turns butter instead.
  const trackClass: Record<TrackTone, string> = {
    rule: onInk ? "bg-ink-2" : "bg-rule",
    ink: onInk ? "bg-butter" : "bg-ink",
    clay: "bg-clay",
    wait: "bg-wait",
  }

  const captionTone: Partial<Record<DealStatus, string>> = {
    disputed: "text-clay",
    payout_failed: "text-wait",
    refunding: "text-clay",
    refunded: "text-clay",
    released: "text-safe",
    cancelled: "text-ink-2",
  }

  const coinMotion =
    arrive ? "animate-coin-arrive"
    : v.motion === "release" ? "animate-coin-release"
    : v.motion === "refund" ? "animate-coin-refund"
    : pulse ? "animate-coin-pulse"
    : ""

  const places: { key: Place; name: string; align: string }[] = [
    { key: "buyer", name: buyerName, align: "text-left" },
    { key: "hotoso", name: "Hotoso", align: "text-center" },
    { key: "seller", name: sellerName, align: "text-right" },
  ]

  return (
    <figure className={cn("w-full", className)}>
      {/* ---- the drawing (hidden from screen readers) ---- */}
      {/* Cancelled: fade the DRAWING only. The words stay full strength so
          they still pass contrast. */}
      <div aria-hidden="true" className={cn(v.faded && "opacity-50")}>
        <div className="grid grid-cols-3 gap-2">
          {places.map((p) => (
            <span
              key={p.key}
              className={cn(
                "label-caps truncate",
                p.align,
                onInk ? "text-paper" : v.coinAt === p.key ? "text-ink" : "text-ink-2"
              )}
            >
              {p.name}
            </span>
          ))}
        </div>

        {/* The inner box is inset by half a coin so the coin never overflows. */}
        <div className="relative mx-3.5 mt-2 h-9">
          <span className={cn("absolute top-1/2 left-0 h-0.5 w-1/2 -translate-y-1/2", trackClass[v.track[0]])} />
          <span className={cn("absolute top-1/2 right-0 h-0.5 w-1/2 -translate-y-1/2", trackClass[v.track[1]])} />

          {/* The three places (small dots) */}
          {(["buyer", "hotoso", "seller"] as Place[]).map((place) => (
            <span
              key={place}
              style={{ left: PLACE_LEFT[place] }}
              className={cn(
                "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2",
                onInk ? "border-paper bg-ink" : "border-ink bg-paper",
                v.faded && (onInk ? "border-ink-2" : "border-rule")
              )}
            />
          ))}

          {/* The coin: where the money is */}
          {v.coinAt && (
            <span
              style={{ left: PLACE_LEFT[arrive ? "hotoso" : v.coinAt] }}
              className={cn(
                // transition-[left]: when the status changes, the coin GLIDES to its new place
                "absolute top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] font-display text-base leading-none font-semibold transition-[left,background-color] duration-700 ease-calm motion-reduce:animate-none",
                v.coinOutline
                  ? onInk ? "border-paper bg-ink text-paper" : "border-ink bg-card text-ink"
                  : "border-ink bg-butter text-ink",
                coinMotion
              )}
            >
              ₵
              {v.mark && (
                <span
                  className={cn(
                    "absolute -top-1.5 -right-1.5 flex size-4.5 items-center justify-center rounded-full border border-ink [&_svg]:size-3",
                    v.mark === "lock" && "bg-clay text-paper",
                    v.mark === "warn" && "bg-wait text-paper",
                    v.mark === "check" && "bg-safe text-paper"
                  )}
                >
                  {v.mark === "lock" && <Lock strokeWidth={2.5} />}
                  {v.mark === "warn" && <TriangleAlert strokeWidth={2.5} />}
                  {v.mark === "check" && <Check strokeWidth={3} />}
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* ---- the words (visible, and the source of truth) ---- */}
      <figcaption className="mt-3 flex flex-col items-center gap-1 text-center" aria-hidden="true">
        <span
          className={cn(
            "text-base font-medium",
            copy.pill && !props.caption
              ? "rounded-full bg-butter-soft px-3.5 py-1 text-ink"
              : onInk ? "text-paper" : (captionTone[status] ?? "text-ink")
          )}
        >
          {caption}
        </span>
        {(detail || props.countdown) && (
          <span className={cn("text-sm", onInk ? "text-paper" : "text-ink-2")}>
            {detail}
            {props.countdown && (
              <>
                {detail ? " · " : ""}
                <span className="font-mono tabular-nums">{props.countdown}</span>
              </>
            )}
          </span>
        )}
      </figcaption>
      <p className="sr-only">{spokenSentence(props, caption, detail)}</p>
    </figure>
  )
}
