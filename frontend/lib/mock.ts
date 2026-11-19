/**
 * Mock data: realistic Ghanaian examples until the Django API exists (M2+).
 *
 * The story: Ama Owusu (@ama.kicks) resells sneakers on Instagram from Accra.
 * Ama's buyers are around Accra and Kumasi. Amounts are integer pesewas.
 * "Now" in this mock world is Wed 18 Nov 2026, 2:30 PM.
 */
import type { Deal, DealEvent, DealPhoto, DealStatus, SellerProfile } from "./types"
import { photos as P } from "./photos"
import type { SellerSummary as TrustSeller } from "@/components/hotoso/trust-block"
import type { ReceiptLine } from "@/components/hotoso/receipt-card"
import { previewFeeMinor } from "./fee"

/* ---------------------------------------------------------------- people */

export const ama: SellerProfile = {
  name: "Ama Owusu",
  firstName: "Ama",
  handle: "ama.kicks",
  dealsCompleted: 38,
  problems: 0,
  memberSince: "Mar 2026",
  payoutMasked: "MTN ••• 0187",
  bio: "Authentic sneakers, checked before they ship.",
  location: "East Legon, Accra",
}

export const efua: TrustSeller = {
  name: "Efua Asante",
  handle: "efua.thrift",
  dealsCompleted: 0,
  problems: 0,
  memberSince: "Nov 2026",
}

const buyers = {
  kwame: { name: "Kwame Mensah", firstName: "Kwame", email: "kwame.mensah@example.com", phone: "055 123 4987" },
  akosua: { name: "Akosua Boateng", firstName: "Akosua", email: "akosua.b@example.com", phone: "024 410 2276" },
  yaw: { name: "Yaw Darko", firstName: "Yaw", email: "yaw.darko@example.com", phone: "020 812 3456" },
  kofi: { name: "Kofi Asare", firstName: "Kofi", email: "kofi.asare@example.com", phone: "054 667 1093" },
  esi: { name: "Esi Quartey", firstName: "Esi", email: "esi.q@example.com", phone: "059 300 7781" },
  abena: { name: "Abena Frimpong", firstName: "Abena", email: "abena.f@example.com", phone: "026 555 9012" },
  kwesi: { name: "Kwesi Addo", firstName: "Kwesi", email: "kwesi.addo@example.com", phone: "055 908 4421" },
}

/** Kept for the styleguide */
export const kwame = { ...buyers.kwame, city: "Kumasi" }

/* ---------------------------------------------------------------- helpers */

/** Photos for a deal: real Unsplash images (see assets/photos/CREDITS.md). */
/**
 * Photos for a deal. Real products have several photos, so each deal gets its
 * real photo(s) PLUS two close-up crops of the first one (centre detail and
 * lower detail): honest views of the same item, never a different item.
 */
const shots = (title: string, ...srcs: DealPhoto["src"][]): DealPhoto[] => {
  const real = srcs.map((src, i) => ({ id: `p${i}`, src, alt: i === 0 ? title : `${title}, photo ${i + 1}` }))
  const crops: DealPhoto[] = [
    { id: "c1", src: srcs[0], alt: `${title}, close-up`, crop: { zoom: 1.7, focus: "50% 45%" } },
    { id: "c2", src: srcs[0], alt: `${title}, detail`, crop: { zoom: 2.2, focus: "45% 70%" } },
  ]
  return [...real, ...crops]
}

function money(itemCedis: number) {
  const itemMinor = itemCedis * 100
  const feeMinor = previewFeeMinor(itemMinor)
  return { itemMinor, feeMinor, totalMinor: itemMinor + feeMinor }
}

let eventId = 0
function ev(type: DealEvent["type"], text: string, relative: string, exact: string): DealEvent {
  eventId += 1
  return { id: `e${eventId}`, type, text, relative, exact, iso: "2026-11-18T14:30:00Z" }
}

/* ---------------------------------------------------------------- deals */

const samba: Deal = {
  slug: "SMB40OGA",
  title: "Adidas Samba OG, size 40",
  description: "Cloud white / green. Worn twice, no creases, original box.",
  photos: shots("Adidas Samba OG", P.samba1, P.samba2),
  category: "shoes",
  proofs: ["Box label photo on file"],
  ...money(540),
  status: "awaiting_payment",
  seller: ama,
  buyer: null,
  shipWithinDays: 3,
  events: [ev("created", "Ama created this deal", "1h ago", "18 Nov 2026, 1:24 PM")],
}

const af1: Deal = {
  slug: "7KQ2XM4A",
  title: "Black AF1, size 42",
  description: "Black leather, white swoosh. Brand new with tags. Ships from East Legon.",
  photos: shots("Black AF1", P.af1Black),
  category: "shoes",
  ...money(450),
  status: "shipped",
  seller: ama,
  buyer: buyers.kwame,
  shipWithinDays: 3,
  shipBy: "Sat, 21 Nov",
  releaseAt: "Sat 21 Nov, 11:40 AM",
  releaseCountdown: "2d 21h",
  reference: "HTS-PAY-01JD7Q4M8Z",
  paidAt: "16 Nov 2026, 2:02 PM",
  shippedAgo: "3h ago",
  shippingNote: "Sent with VIP bus to Kumasi. Rider number 024 555 0187.",
  events: [
    ev("created", "Ama created this deal", "2d ago", "16 Nov 2026, 10:15 AM"),
    ev("payment_confirmed", "Kwame paid GHS 456.75 into Hotoso", "2d ago", "16 Nov 2026, 2:02 PM"),
    ev("shipped", "Ama marked it shipped, with a photo", "3h ago", "18 Nov 2026, 11:40 AM"),
  ],
}

const nb550: Deal = {
  slug: "AJ1LOWOL",
  title: "Air Jordan 1 Low, size 41",
  description: "White / olive. Lightly worn, cleaned and deodorised.",
  photos: shots("Air Jordan 1 Low", P.jordan1LowOlive),
  category: "shoes",
  proofs: ["Box label photo on file"],
  ...money(620),
  status: "funded",
  seller: ama,
  buyer: buyers.akosua,
  shipWithinDays: 2,
  shipBy: "Thu, 19 Nov",
  shipByCountdown: "18h",
  reference: "HTS-PAY-01JD9B2K4T",
  paidAt: "17 Nov 2026, 8:41 AM",
  events: [
    ev("created", "Ama created this deal", "2d ago", "16 Nov 2026, 6:02 PM"),
    ev("payment_confirmed", "Akosua paid GHS 629.30 into Hotoso", "1d ago", "17 Nov 2026, 8:41 AM"),
  ],
}

const jordan4: Deal = {
  slug: "JD4BRED3",
  title: "Jordan 4 Retro Bred, size 43",
  description: "Black / fire red. Deadstock. Receipt available on request.",
  photos: shots("Jordan 4 Retro Bred", P.jordan4Bred),
  category: "shoes",
  proofs: ["Box label photo on file"],
  ...money(1450),
  status: "funded",
  seller: ama,
  buyer: buyers.yaw,
  shipWithinDays: 3,
  shipBy: "Sat, 21 Nov",
  shipByCountdown: "2d 22h",
  reference: "HTS-PAY-01JDA0R7NC",
  paidAt: "18 Nov 2026, 12:10 PM",
  events: [
    ev("created", "Ama created this deal", "1d ago", "17 Nov 2026, 9:30 PM"),
    ev("payment_confirmed", "Yaw paid GHS 1,471.75 into Hotoso", "2h ago", "18 Nov 2026, 12:10 PM"),
  ],
}

const suede: Deal = {
  slug: "VNSK8H42",
  title: "Vans Sk8-Hi, size 42",
  description: "Black suede, 2019 pair. Small mark on the left heel.",
  photos: shots("Vans Sk8-Hi", P.vansSk8hi),
  category: "shoes",
  ...money(350),
  status: "disputed",
  seller: ama,
  buyer: buyers.kofi,
  shipWithinDays: 3,
  reference: "HTS-PAY-01JD5X0P2E",
  paidAt: "13 Nov 2026, 4:15 PM",
  dispute: {
    reason: "not_as_described",
    details: "The sole is coming off at the front. That wasn't in the photos.",
  },
  events: [
    ev("created", "Ama created this deal", "6d ago", "12 Nov 2026, 11:00 AM"),
    ev("payment_confirmed", "Kofi paid GHS 355.25 into Hotoso", "5d ago", "13 Nov 2026, 4:15 PM"),
    ev("shipped", "Ama marked it shipped", "4d ago", "14 Nov 2026, 9:20 AM"),
    ev("dispute_opened", "Kofi reported a problem: not as described", "1d ago", "17 Nov 2026, 7:05 PM"),
  ],
}

const dunk: Deal = {
  slug: "AJ13NV44",
  title: "Air Jordan 13 Retro, size 44",
  description: "White / navy. Worn once to a wedding.",
  photos: shots("Air Jordan 13 Retro", P.jordan13Navy),
  category: "shoes",
  proofs: ["Box label photo on file"],
  ...money(690),
  status: "released",
  seller: ama,
  buyer: buyers.kwesi,
  shipWithinDays: 3,
  doneOn: "15 Nov",
  reference: "HTS-PAY-01JD1C8W3M",
  paidAt: "10 Nov 2026, 1:30 PM",
  events: [
    ev("payment_confirmed", "Kwesi paid GHS 700.35 into Hotoso", "8d ago", "10 Nov 2026, 1:30 PM"),
    ev("shipped", "Ama marked it shipped", "7d ago", "11 Nov 2026, 10:00 AM"),
    ev("buyer_confirmed", "Kwesi confirmed the order arrived", "3d ago", "15 Nov 2026, 6:45 PM"),
    ev("released", "GHS 690 paid to Ama's MoMo", "3d ago", "15 Nov 2026, 6:47 PM"),
  ],
}

const airmax: Deal = {
  slug: "AJ1MDRD1",
  title: "Air Jordan 1 Mid, size 41",
  description: "White / red / grey. Very clean, box included.",
  photos: shots("Air Jordan 1 Mid", P.jordan1MidRed),
  category: "shoes",
  proofs: ["Box label photo on file"],
  ...money(720),
  status: "releasing",
  seller: ama,
  buyer: buyers.esi,
  shipWithinDays: 2,
  reference: "HTS-PAY-01JD8H6Q1V",
  paidAt: "15 Nov 2026, 9:12 AM",
  events: [
    ev("payment_confirmed", "Esi paid GHS 730.80 into Hotoso", "3d ago", "15 Nov 2026, 9:12 AM"),
    ev("shipped", "Ama marked it shipped", "2d ago", "16 Nov 2026, 3:30 PM"),
    ev("buyer_confirmed", "Esi confirmed the order arrived", "4m ago", "18 Nov 2026, 2:26 PM"),
  ],
}

const salomon: Deal = {
  slug: "NB247OLV",
  title: "New Balance 247, size 43",
  description: "Olive suede and mesh. Box included.",
  photos: shots("New Balance 247", P.nb247Olive),
  category: "shoes",
  proofs: ["Box label photo on file"],
  ...money(1150),
  status: "refunded",
  seller: ama,
  buyer: buyers.abena,
  shipWithinDays: 3,
  doneOn: "16 Nov",
  reference: "HTS-PAY-01JCZ4T9AB",
  paidAt: "9 Nov 2026, 10:05 AM",
  events: [
    ev("payment_confirmed", "Abena paid GHS 1,167.25 into Hotoso", "9d ago", "9 Nov 2026, 10:05 AM"),
    ev("cancelled", "Ama couldn't ship in time and cancelled", "4d ago", "14 Nov 2026, 9:00 AM"),
    ev("refund_processed", "Abena's payment was refunded", "2d ago", "16 Nov 2026, 11:20 AM"),
  ],
}

const converse: Deal = {
  slug: "CNVHIBK9",
  title: "Converse Chuck Taylor High, size 39",
  description: "Black canvas. Never worn.",
  photos: shots("Converse Chuck Taylor High", P.converseBlack),
  category: "shoes",
  ...money(380),
  status: "cancelled",
  seller: ama,
  buyer: null,
  shipWithinDays: 3,
  events: [
    ev("created", "Ama created this deal", "5d ago", "13 Nov 2026, 5:40 PM"),
    ev("cancelled", "Ama cancelled the deal. No money moved.", "4d ago", "14 Nov 2026, 8:10 AM"),
  ],
}


/* ---------------------------------------------------------------- other sellers, other categories (doc 08) */

const seller = (name: string, handle: string, dealsCompleted: number, memberSince: string, bio: string, location: string, verified = false): SellerProfile => ({
  name, firstName: name.split(" ")[0], handle, dealsCompleted, problems: 0, memberSince, payoutMasked: "MTN ••• 0000", verified, bio, location,
})

const efuaThrift = seller("Efua Asante", "efua.thrift", 0, "Nov 2026", "Pre-loved and hand-knitted pieces, washed and folded.", "Osu, Accra")
const kofiGadgets = seller("Kofi Boakye", "kofi.gadgets", 112, "Jan 2026", "Phones and laptops, tested before they leave the shop.", "Circle, Accra", true)
const akuaScents = seller("Akua Sarpong", "akua.scents", 23, "Jun 2026", "Sealed perfumes and oils, with receipts.", "Adum, Kumasi")
const nanaBags = seller("Nana Yaa Owusu", "nanayaa.bags", 41, "Apr 2026", "Leather bags and everyday accessories.", "Spintex, Accra")
const jerseyHub = seller("Selorm Agbeko", "jerseyhub.gh", 67, "Feb 2026", "Club and national jerseys, printing on request.", "Ho, Volta")
const teakCo = seller("Esi Mensah-Bonsu", "teakandco.gh", 15, "Aug 2026", "Solid wood furniture, delivered within Accra.", "Tema")
const bolgaWeaves = seller("Atia Ayamga", "bolga.weaves", 29, "May 2026", "Baskets woven to order in Bolgatanga.", "Bolgatanga")

const awaiting = (d: Omit<Deal, "status" | "buyer" | "events" | "itemMinor" | "feeMinor" | "totalMinor"> & { cedis: number }): Deal => {
  const { cedis, ...rest } = d
  return { ...rest, ...money(cedis), status: "awaiting_payment", buyer: null, events: [ev("created", `${d.seller.firstName} created this deal`, "3h ago", "18 Nov 2026, 11:30 AM")] }
}

const sweater = awaiting({ slug: "SWTLIL01", title: "Lilac chunky knit sweater, size M", description: "Hand-knitted, thick rib. Worn twice, washed and folded.", photos: shots("Lilac chunky knit sweater", P.sweaterLilac), category: "fashion", seller: efuaThrift, shipWithinDays: 2, cedis: 280 })
// 12 views, like a careful phone seller posts (front, corners, camera, ports…):
// the real photo plus close-up crops of it. Proves the gallery copes with many photos.
const iphoneViews: DealPhoto[] = [
  ["50% 50%", 1], ["25% 25%", 2.2], ["30% 35%", 1.6], ["70% 30%", 2], ["50% 80%", 2], ["80% 70%", 1.8],
  ["20% 70%", 2.2], ["60% 50%", 1.4], ["40% 60%", 2.4], ["75% 50%", 2], ["35% 20%", 2.3], ["55% 65%", 1.9],
].map(([focus, zoom], i) => ({
  id: `v${i}`,
  src: P.iphone15Pro,
  alt: i === 0 ? "iPhone 15 Pro" : `iPhone 15 Pro, detail ${i}`,
  ...(i === 0 ? {} : { crop: { zoom: zoom as number, focus: focus as string } }),
}))
const iphone = awaiting({ slug: "IPH15P256", title: "iPhone 15 Pro, 256GB", description: "Natural titanium. 91% battery health. Not iCloud locked, no scratches.", photos: iphoneViews, category: "electronics", proofs: ["IMEI photo on file", "Verified seller"], seller: kofiGadgets, shipWithinDays: 1, cedis: 8500 })
const perfume = awaiting({ slug: "PRFAMB19", title: "Ambroxan eau de parfum, 100ml", description: "Sealed in the box. Bought in Dubai, receipt available.", photos: shots("Ambroxan eau de parfum", P.perfumeAmbroxan), category: "beauty", seller: akuaScents, shipWithinDays: 2, cedis: 650 })
const bag = awaiting({ slug: "BAGWVN01", title: "Woven leather shoulder bag", description: "Tan leather with a gold chain strap. Brand new.", photos: shots("Woven leather shoulder bag", P.bagWovenLeather), category: "bags_accessories", seller: nanaBags, shipWithinDays: 3, cedis: 420 })
const jerseys = awaiting({ slug: "JRSY2526", title: "Club jerseys, 2025/26 season", description: "Home and away, sizes S to XXL. Name and number printing available.", photos: shots("Club jerseys", P.jerseysRack), category: "sports", seller: jerseyHub, shipWithinDays: 3, cedis: 180 })
const armchair = awaiting({ slug: "CHRTEAK1", title: "Wooden lounge armchair", description: "Solid wood frame, cream cushions. Delivery within Accra included.", photos: shots("Wooden lounge armchair", P.armchairWood), category: "home", seller: teakCo, shipWithinDays: 3, cedis: 2400 })
const basket = awaiting({ slug: "BSKTWV01", title: "Handwoven market basket, made to order", description: "Woven by hand after you order. Choose your colours in the chat.", photos: shots("Handwoven basket", P.basketsWeaving), category: "crafts", seller: bolgaWeaves, shipWithinDays: 10, cedis: 150 })

/** Public example deals in other categories (the deal page "rotates between categories", doc 08 §4) */
export const CATEGORY_EXAMPLES: Deal[] = [sweater, iphone, perfume, bag, jerseys, armchair, basket]

export const DEALS: Deal[] = [nb550, jordan4, samba, af1, airmax, suede, dunk, salomon, converse]

/** Every deal any page can open (Ama's dashboard only shows DEALS). */
export const ALL_DEALS: Deal[] = [...DEALS, ...CATEGORY_EXAMPLES]

/* ---------------------------------------------------------------- demo helpers */

/**
 * Show any deal in any status (for reviewing every action card).
 * Fills in plausible dates so the screen never shows "undefined".
 */
export function withStatus(deal: Deal, status: DealStatus): Deal {
  if (status === deal.status) return deal
  const buyer = deal.buyer ?? buyers.kwame
  return {
    ...deal,
    status,
    buyer: status === "awaiting_payment" || status === "cancelled" ? deal.buyer : buyer,
    shipBy: deal.shipBy ?? "Sat, 21 Nov",
    shipByCountdown: deal.shipByCountdown ?? "2d 21h",
    releaseAt: deal.releaseAt ?? "Sat 21 Nov, 11:40 AM",
    releaseCountdown: deal.releaseCountdown ?? "2d 21h",
    doneOn: deal.doneOn ?? "18 Nov",
    reference: deal.reference ?? "HTS-PAY-01JDDEMO00",
    paidAt: deal.paidAt ?? "16 Nov 2026, 2:02 PM",
    shippedAgo: deal.shippedAgo ?? "3h ago",
    dispute: deal.dispute ?? { reason: "not_as_described", details: "The colour is different from the photos." },
  }
}

export function receiptLines(deal: Pick<Deal, "title" | "itemMinor" | "feeMinor">): ReceiptLine[] {
  return [
    { label: deal.title, amountMinor: deal.itemMinor },
    { label: "Hotoso protection (1.5%)", amountMinor: deal.feeMinor },
  ]
}

/* ---------------------------------------------------------------- styleguide */

export const af1Deal = {
  slug: af1.slug,
  title: af1.title,
  itemMinor: af1.itemMinor,
  feeMinor: af1.feeMinor,
  totalMinor: af1.totalMinor,
  reference: af1.reference!,
  paidAt: af1.paidAt!,
}
export const af1Receipt = receiptLines(af1)
export const af1Timeline = af1.events
