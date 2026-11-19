/**
 * Shared frontend types. These mirror the backend (docs/03-architecture.md).
 * When the Django API exists, lib/api.ts returns exactly these shapes.
 */
import type { Minor } from "./money"
import type { CategoryCode } from "./categories"

/** Every deal status from the state machine (doc 03 §3). */
export const DEAL_STATUSES = [
  "awaiting_payment",
  "funded",
  "shipped",
  "disputed",
  "releasing",
  "released",
  "payout_failed",
  "refunding",
  "refunded",
  "cancelled",
] as const

export type DealStatus = (typeof DEAL_STATUSES)[number]

export function isDealStatus(value: unknown): value is DealStatus {
  return typeof value === "string" && (DEAL_STATUSES as readonly string[]).includes(value)
}

/** Who is looking at the screen. Some labels differ by role. */
export type Viewer = "buyer" | "seller"

export type DealEventType =
  | "created"
  | "payment_confirmed"
  | "shipped"
  | "buyer_confirmed"
  | "auto_released"
  | "dispute_opened"
  | "evidence_added"
  | "released"
  | "payout_failed"
  | "refund_processed"
  | "cancelled"

export type DealEvent = {
  id: string
  type: DealEventType
  text: string
  relative: string
  exact: string
  iso: string
}

/**
 * A deal photo. Mock: an imported file (StaticImageData).
 * M2: a URL string from Django's media storage, which next/image also accepts.
 */
export type DealPhoto = {
  id: string
  alt: string
  src: import("next/image").StaticImageData | string
  /**
   * Mock only: a close-up CROP of the same photo (zoom + where to look), so
   * every product has several views without inventing different items.
   * Real sellers upload separate photos in M2.
   */
  crop?: { zoom: number; focus: string }
}

export type SellerProfile = {
  name: string
  firstName: string
  handle: string
  dealsCompleted: number
  problems: number
  memberSince: string
  payoutMasked: string // "MTN ••• 0187"
  /** verified sellers get higher limits in some categories (doc 08) */
  verified?: boolean
  /** one line about the shop, in the seller's words */
  bio?: string
  /** area and city, e.g. "East Legon, Accra" */
  location?: string
}

export type Buyer = {
  name: string
  firstName: string
  email: string
  phone: string
}

export type DisputeReason = "not_received" | "not_as_described" | "damaged" | "other"

/** Everything about one deal. The PUBLIC page only ever sees PublicDeal. */
export type Deal = {
  slug: string
  title: string
  description: string
  photos: DealPhoto[]
  /** doc 08 §1: decides the inspection window and the proof required */
  category: CategoryCode
  /** proof the seller provided for this category, e.g. "IMEI photo on file" */
  proofs?: string[]
  itemMinor: Minor
  feeMinor: Minor
  totalMinor: Minor
  status: DealStatus
  seller: SellerProfile
  buyer: Buyer | null
  shipWithinDays: number // up to 14 for made-to-order crafts
  shipBy?: string // "Fri, 20 Nov"
  shipByCountdown?: string // "18h"
  releaseAt?: string // "Sat 21 Nov, 2:14 PM"
  releaseCountdown?: string // "2d 14h"
  doneOn?: string // "22 Nov"
  reference?: string // "HTS-PAY-…"
  paidAt?: string
  shippedAgo?: string
  shippingNote?: string
  dispute?: { reason: DisputeReason; details: string }
  events: DealEvent[]
}

/**
 * What a STRANGER opening the link may see. No buyer details, ever.
 * (doc 03 §5: "Public deal page data + seller trust stats (no buyer PII)")
 */
export type PublicSeller = Pick<SellerProfile, "name" | "firstName" | "handle" | "dealsCompleted" | "problems" | "memberSince" | "verified" | "bio" | "location">

export type PublicDeal = Pick<
  Deal,
  "slug" | "title" | "description" | "photos" | "category" | "proofs" | "itemMinor" | "feeMinor" | "totalMinor" | "status" | "shipWithinDays"
> & { seller: PublicSeller }

export type SellerSummary = {
  heldMinor: Minor
  heldCount: number
  onTheWayMinor: Minor
  paidOutThisMonthMinor: Minor
}

export type PaymentStatus =
  | { status: "pending" }
  | { status: "success"; dealSlug: string; dealRoomUrl: string; amountMinor: Minor }
  | { status: "failed" | "abandoned"; dealSlug: string }
