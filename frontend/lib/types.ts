import type { Minor } from "./money"
import type { CategoryCode } from "./categories"

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

export type DealPhoto = {
  id: string
  alt: string
  src: import("next/image").StaticImageData | string
  crop?: { zoom: number; focus: string }
}

export type SellerProfile = {
  name: string
  firstName: string
  handle: string
  dealsCompleted: number
  problems: number
  memberSince: string
  payoutMasked: string
  verified?: boolean
  bio?: string
  location?: string
}

export type Buyer = {
  name: string
  firstName: string
  email: string
  phone: string
}

export type DisputeReason = "not_received" | "not_as_described" | "damaged" | "other"

export type Deal = {
  slug: string
  title: string
  description: string
  photos: DealPhoto[]
  category: CategoryCode
  proofs?: string[]
  itemMinor: Minor
  feeMinor: Minor
  totalMinor: Minor
  status: DealStatus
  seller: SellerProfile
  buyer: Buyer | null
  shipWithinDays: number
  shipBy?: string
  shipByCountdown?: string
  releaseAt?: string
  releaseCountdown?: string
  doneOn?: string
  reference?: string
  paidAt?: string
  shippedAgo?: string
  shippingNote?: string
  dispute?: { reason: DisputeReason; details: string }
  events: DealEvent[]
}

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
