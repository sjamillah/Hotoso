/**
 * THE API CLIENT: the only way screens get data.
 *
 * Phase 3 (now): every function returns MOCK data after a short pretend
 * network delay, so loading skeletons really appear.
 * M2+ (later): we replace the INSIDE of each function with a real
 * `fetch("/api/...")` call to Django. The screens don't change at all,
 * because they only depend on these function names and return types.
 *
 * Demo switches (only exist in mock mode), passed from the URL:
 *   ?demo=slow   → wait 4 seconds (see the skeleton)
 *   ?demo=error  → pretend the server failed (see the error state)
 *   ?demo=empty  → pretend there's no data (see the empty state)
 */
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

/* ------------------------------------------------------------ public (anyone with the link) */

/** GET /api/deals/{slug}/ → the public deal page. NEVER includes buyer details. */
export async function getPublicDeal(slug: string, demo?: Demo): Promise<PublicDeal | null> {
  await pretendNetwork(demo)
  const deal = findDeal(slug)
  return deal ? toPublic(deal) : null
}

/**
 * ALLOWLIST: copy ONLY the fields a stranger may see. If someone later adds a
 * private field to Deal (say, the buyer's address), it stays private by
 * default, because it isn't on this list. The Django serializer does the same
 * with `fields = [...]`.
 */
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
    // Allowlist the NESTED seller too: payoutMasked is private.
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

/**
 * GET /api/payments/{reference}/status/ → is the payment confirmed yet?
 * Mock: "pending" for the first 2 polls, then the outcome from ?demo.
 * In M3 the backend calls Paystack's verify endpoint to answer this.
 */
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

/**
 * GET /api/shops/{handle}/ → a seller's public shop.
 *   available: links anyone can still pay for
 *   sold:      recently sold items, as proof the seller delivers
 * Photos and titles only (allowlisted): never who bought them.
 */
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

/* ------------------------------------------------------------ buyer (private link with ?t=token) */

export type RoomResult = { kind: "ok"; deal: Deal } | { kind: "not_found" } | { kind: "bad_token" }

/** GET /api/room/{slug}/?t= → the buyer's deal room. The token proves it's really the buyer. */
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

/* ------------------------------------------------------------ seller (logged in) */

/** GET /api/seller/profile/ → the logged-in seller (name, stats buyers see, payout number). */
export async function getSellerProfile(demo?: Demo): Promise<SellerProfile> {
  await pretendNetwork(demo)
  return demo === "empty" ? { ...ama, dealsCompleted: 0, memberSince: "Nov 2026" } : ama
}

/** GET /api/seller/summary/ → the three money numbers on seller home. */
export async function getSellerSummary(demo?: Demo): Promise<SellerSummary> {
  await pretendNetwork(demo)
  const deals = demo === "empty" ? [] : DEALS
  const sum = (statuses: DealStatus[]) =>
    deals.filter((d) => statuses.includes(d.status)).reduce((total, d) => total + d.itemMinor, 0)
  return {
    // Money Hotoso is holding for Ama right now: paid, not yet released.
    heldMinor: sum(["funded", "shipped", "disputed"]),
    heldCount: deals.filter((d) => ["funded", "shipped", "disputed"].includes(d.status)).length,
    // Released by the buyer, on its way to the seller's MoMo.
    onTheWayMinor: sum(["releasing", "payout_failed"]),
    // Already landed on the seller's MoMo this month (+ earlier November deals not in the mock list).
    paidOutThisMonthMinor: demo === "empty" ? 0 : sum(["released"]) + 252000,
  }
}

/** GET /api/seller/deals/ → all of the seller's deals. */
export async function getSellerDeals(demo?: Demo): Promise<Deal[]> {
  await pretendNetwork(demo)
  return demo === "empty" ? [] : DEALS
}

/** GET /api/seller/deals/{slug}/ → one deal with its full timeline. */
export async function getSellerDeal(slug: string, opts: { demo?: Demo; status?: DealStatus } = {}): Promise<Deal | null> {
  await pretendNetwork(opts.demo)
  const deal = findDeal(slug)
  if (!deal) return null
  return opts.status ? withStatus(deal, opts.status) : deal
}
