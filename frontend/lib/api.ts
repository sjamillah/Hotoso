import { ALL_DEALS, DEALS, ama, withStatus } from "./mock"
import type { Deal, DealStatus, PaymentStatus, PublicDeal, SellerProfile, SellerSummary } from "./types"

export type Demo = "slow" | "error" | "empty" | undefined

export function readDemo(value: string | string[] | undefined): Demo {
  return value === "slow" || value === "error" || value === "empty" ? value : undefined
}

export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message)
  }
}

async function pretendNetwork(demo: Demo) {
  await new Promise((resolve) => setTimeout(resolve, demo === "slow" ? 4000 : 300))
  if (demo === "error") throw new ApiError("server_error", "The server didn't answer.")
}

function findDeal(slug: string): Deal | undefined {
  return ALL_DEALS.find((d) => d.slug === slug.toUpperCase())
}

export async function getPublicDeal(slug: string, demo?: Demo): Promise<PublicDeal | null> {
  await pretendNetwork(demo)
  const deal = findDeal(slug)
  return deal ? toPublic(deal) : null
}

function toPublic(d: Deal): PublicDeal {
  return {
    slug: d.slug,
    title: d.title,
    description: d.description,
    photos: d.photos,
    category: d.category,
    proofs: d.proofs,
    itemMinor: d.itemMinor,
    feeMinor: d.feeMinor,
    totalMinor: d.totalMinor,
    status: d.status,
    seller: {
      name: d.seller.name,
      firstName: d.seller.firstName,
      handle: d.seller.handle,
      dealsCompleted: d.seller.dealsCompleted,
      problems: d.seller.problems,
      memberSince: d.seller.memberSince,
      verified: d.seller.verified,
      bio: d.seller.bio,
      location: d.seller.location,
    },
    shipWithinDays: d.shipWithinDays,
  }
}

export async function getPaymentStatus(
  reference: string,
  outcome: "success" | "failed" | "slow",
  attempt: number
): Promise<PaymentStatus> {
  await new Promise((resolve) => setTimeout(resolve, 250))
  const deal = DEALS.find((d) => d.reference === reference) ?? DEALS.find((d) => d.slug === "SMB40OGA")!
  if (outcome === "slow" || attempt < 2) return { status: "pending" }
  if (outcome === "failed") return { status: "failed", dealSlug: deal.slug }
  return {
    status: "success",
    dealSlug: deal.slug,
    dealRoomUrl: `/room/${deal.slug}?t=demo&status=funded`,
    amountMinor: deal.totalMinor,
  }
}

export type SellerShop = { seller: PublicDeal["seller"]; available: PublicDeal[]; sold: PublicDeal[] }

const SOLD: DealStatus[] = ["funded", "shipped", "releasing", "released"]

export async function getSellerShop(handle: string, demo?: Demo): Promise<SellerShop | null> {
  await pretendNetwork(demo)
  const mine = ALL_DEALS.filter((d) => d.seller.handle === handle.toLowerCase())
  if (mine.length === 0) return null
  return {
    seller: toPublic(mine[0]).seller,
    available: mine.filter((d) => d.status === "awaiting_payment").map(toPublic),
    sold: mine.filter((d) => SOLD.includes(d.status)).map(toPublic),
  }
}

export type RoomResult = { kind: "ok"; deal: Deal } | { kind: "not_found" } | { kind: "bad_token" }

export async function getBuyerRoom(
  slug: string,
  token: string | undefined,
  opts: { demo?: Demo; status?: DealStatus } = {}
): Promise<RoomResult> {
  await pretendNetwork(opts.demo)
  if (!token) return { kind: "bad_token" }
  const deal = findDeal(slug)
  if (!deal) return { kind: "not_found" }
  return { kind: "ok", deal: opts.status ? withStatus(deal, opts.status) : deal }
}

export async function getSellerProfile(demo?: Demo): Promise<SellerProfile> {
  await pretendNetwork(demo)
  return demo === "empty" ? { ...ama, dealsCompleted: 0, memberSince: "Nov 2026" } : ama
}

export async function getSellerSummary(demo?: Demo): Promise<SellerSummary> {
  await pretendNetwork(demo)
  const deals = demo === "empty" ? [] : DEALS
  const sum = (statuses: DealStatus[]) =>
    deals.filter((d) => statuses.includes(d.status)).reduce((total, d) => total + d.itemMinor, 0)
  return {
    heldMinor: sum(["funded", "shipped", "disputed"]),
    heldCount: deals.filter((d) => ["funded", "shipped", "disputed"].includes(d.status)).length,
    onTheWayMinor: sum(["releasing", "payout_failed"]),
    paidOutThisMonthMinor: demo === "empty" ? 0 : sum(["released"]) + 252000,
  }
}

export async function getSellerDeals(demo?: Demo): Promise<Deal[]> {
  await pretendNetwork(demo)
  return demo === "empty" ? [] : DEALS
}

export async function getSellerDeal(slug: string, opts: { demo?: Demo; status?: DealStatus } = {}): Promise<Deal | null> {
  await pretendNetwork(opts.demo)
  const deal = findDeal(slug)
  if (!deal) return null
  return opts.status ? withStatus(deal, opts.status) : deal
}
