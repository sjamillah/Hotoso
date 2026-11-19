/**
 * CATEGORIES (docs/08-categories.md §1 and §3), as CONFIG, not code.
 *
 * One table drives everything: the New Deal picker, the extra fields each
 * category needs, the inspection window shown to buyers, and the blocked-
 * items warning. The backend keeps the SAME rules in deals/categories.py
 * (M2) and is the authority; this file is the friendly early warning.
 */

export const CATEGORY_CODES = [
  "fashion",
  "shoes",
  "bags_accessories",
  "hair",
  "beauty",
  "electronics",
  "home",
  "baby_kids",
  "books",
  "crafts",
  "preloved",
  "sports",
  "auto_parts",
  "bulk_goods",
] as const

export type CategoryCode = (typeof CATEGORY_CODES)[number]

/** An extra thing the seller must provide for this category. */
export type Requirement =
  | { kind: "photo"; id: string; label: string; hint: string; whenOverMinor?: number }
  | { kind: "text"; id: string; label: string; hint: string; placeholder: string }

export type CategoryRule = {
  code: CategoryCode
  label: string
  short: string // for tight spaces: chips, table cells
  examples: string
  inspectionHours: 48 | 72
  /** Wording for the inspection window ("test" for electronics) */
  windowWord: "inspect" | "test"
  /** A rule the buyer should know before paying, if any */
  buyerNote?: string
  requirements: Requirement[]
  /** Longest ship window the seller can choose, in days */
  maxShipDays: number
  /** Higher ceiling for verified sellers (pesewas) */
  verifiedMaxMinor?: number
}

export const CATEGORIES: Record<CategoryCode, CategoryRule> = {
  fashion: {
    code: "fashion", label: "Fashion & clothing", short: "Fashion",
    examples: "Dresses, kaftans, kente, batakari, two-pieces, thrift",
    inspectionHours: 72, windowWord: "inspect",
    buyerNote: "Wrong size or colour counts as “not as described”.",
    requirements: [], maxShipDays: 3,
  },
  shoes: {
    code: "shoes", label: "Shoes & sneakers", short: "Shoes",
    examples: "Sneakers, heels, slides, sandals, loafers",
    inspectionHours: 72, windowWord: "inspect",
    requirements: [
      { kind: "photo", id: "box_label", label: "Photo of the box label or size tag", hint: "Required for deals over GHS 500. It helps buyers trust it's genuine.", whenOverMinor: 50000 },
    ],
    maxShipDays: 3,
  },
  bags_accessories: {
    code: "bags_accessories", label: "Bags & accessories", short: "Bags",
    examples: "Handbags, wallets, belts, sunglasses, watches, jewellery, waist beads",
    inspectionHours: 72, windowWord: "inspect", requirements: [], maxShipDays: 3,
  },
  hair: {
    code: "hair", label: "Hair & wigs", short: "Hair",
    examples: "Human-hair wigs, bundles, closures, frontals, braiding hair",
    inspectionHours: 48, windowWord: "inspect",
    buyerNote: "For hygiene, a problem can only be reported if it's unworn and the lace is uncut.",
    requirements: [], maxShipDays: 3,
  },
  beauty: {
    code: "beauty", label: "Beauty & fragrance", short: "Beauty",
    examples: "Perfumes, oils, skincare, makeup, shea butter",
    inspectionHours: 48, windowWord: "inspect",
    buyerNote: "It must arrive sealed. Opened items can only be disputed if they're counterfeit.",
    requirements: [], maxShipDays: 3,
  },
  electronics: {
    code: "electronics", label: "Phones & electronics", short: "Electronics",
    examples: "Phones, AirPods, laptops, tablets, smartwatches, consoles",
    inspectionHours: 48, windowWord: "test",
    buyerNote: "Test it properly: check it isn't locked to someone else's account.",
    requirements: [
      { kind: "photo", id: "serial", label: "Photo of the serial number or IMEI", hint: "Settings → About, or the box. Buyers compare it on delivery." },
    ],
    maxShipDays: 3,
    verifiedMaxMinor: 2000000,
  },
  home: {
    code: "home", label: "Home & living", short: "Home",
    examples: "Furniture, décor, bedding, kitchenware, small appliances",
    inspectionHours: 72, windowWord: "inspect",
    buyerNote: "If it arrives damaged, take photos straight away: they're needed to report it.",
    requirements: [], maxShipDays: 3,
  },
  baby_kids: {
    code: "baby_kids", label: "Baby & kids", short: "Kids",
    examples: "Kids' clothes, toys, strollers, car seats",
    inspectionHours: 72, windowWord: "inspect", requirements: [], maxShipDays: 3,
  },
  books: {
    code: "books", label: "Books & stationery", short: "Books",
    examples: "Textbooks, novels, printed past questions",
    inspectionHours: 72, windowWord: "inspect", requirements: [], maxShipDays: 3,
  },
  crafts: {
    code: "crafts", label: "Arts, crafts & handmade", short: "Handmade",
    examples: "Bolga baskets, paintings, beadwork, carvings, leather goods",
    inspectionHours: 72, windowWord: "inspect", requirements: [],
    maxShipDays: 14, // made-to-order
  },
  preloved: {
    code: "preloved", label: "Pre-loved / second-hand", short: "Pre-loved",
    examples: "Used phones, furniture, designer pieces, kids' items",
    inspectionHours: 72, windowWord: "inspect",
    buyerNote: "The seller's condition photos are the record of how it was before shipping.",
    requirements: [
      { kind: "photo", id: "condition", label: "Condition photos (marks, wear, damage)", hint: "These become the record if there's ever a dispute." },
    ],
    maxShipDays: 3,
  },
  sports: {
    code: "sports", label: "Sports & fitness", short: "Sports",
    examples: "Jerseys, gym equipment, bicycles, boots",
    inspectionHours: 72, windowWord: "inspect", requirements: [], maxShipDays: 3,
  },
  auto_parts: {
    code: "auto_parts", label: "Auto parts & accessories", short: "Auto parts",
    examples: "Tyres, spare parts, car accessories, car electronics",
    inspectionHours: 72, windowWord: "inspect",
    requirements: [
      { kind: "text", id: "fits", label: "Fits which car?", hint: "Make, model and year, so the buyer knows it fits.", placeholder: "Toyota Corolla, 2014–2018" },
    ],
    maxShipDays: 3,
  },
  bulk_goods: {
    code: "bulk_goods", label: "Bulk & farm produce", short: "Bulk",
    examples: "Bags of rice, gari, dried fish, shea butter in bulk",
    inspectionHours: 48, windowWord: "inspect",
    buyerNote: "The quantity or weight stated in the deal is what you should receive.",
    requirements: [
      { kind: "text", id: "quantity", label: "Quantity or weight", hint: "Stated on the deal, so there's no argument later.", placeholder: "50 kg bag" },
    ],
    maxShipDays: 3,
  },
}

/** e.g. "72 hours to inspect" / "48 hours to test" */
export function windowLabel(code: CategoryCode) {
  const c = CATEGORIES[code]
  return `${c.inspectionHours} hours to ${c.windowWord} it`
}

/* ------------------------------------------------------------------ blocked items (§3) */

const BLOCKED: { words: string[]; reason: string }[] = [
  { words: ["cake", "cakes", "cooked", "jollof", "kenkey", "waakye", "cooked meal", "meals", "pastry", "pastries", "fresh fish", "fresh meat"], reason: "Perishable food can't be protected: spoilage disputes can't be judged fairly." },
  { words: ["gift card", "giftcard", "airtime", "data bundle", "game credit", "crypto", "bitcoin", "usdt", "voucher", "e-book", "ebook", "software key"], reason: "Digital goods, vouchers and gift cards are delivered instantly and are a common scam route." },
  { words: ["ticket", "tickets"], reason: "Event tickets are hard to verify and often resold fraudulently." },
  { words: ["puppy", "puppies", "kitten", "kittens", "dog for sale", "cat for sale", "parrot", "live animal", "live chicken", "goat for sale"], reason: "Live animals can't be protected (welfare and verification)." },
  { words: ["medicine", "prescription", "antibiotic", "tablets for", "supplement", "herbal cure"], reason: "Medicines and supplements with health claims are regulated (FDA Ghana)." },
  { words: ["alcohol", "whisky", "whiskey", "vodka", "gin", "crate of beer", "bottle of wine", "bottles of wine", "cigarette", "cigarettes", "tobacco", "vape", "shisha"], reason: "Alcohol, tobacco and vapes are age-restricted." },
  { words: ["pistol", "rifle", "shotgun", "gun for sale", "ammunition", "bullets", "firework", "fireworks", "knuckle duster"], reason: "Weapons and fireworks are prohibited." },
  { words: ["replica", "first copy", "1st copy", "fake", "copy grade", "master copy", "aaa quality", "inspired by"], reason: "Counterfeits and replicas are illegal on Hotoso, and selling them gets an account banned." },
  { words: ["plot of land", "land for sale", "plots", "house for sale", "apartment for sale", "car for sale", "vehicle for sale"], reason: "Land, houses and vehicles need a legal transfer of ownership." },
  { words: ["loan", "investment", "susu", "double your money"], reason: "Loans, investments and susu are financial services, not goods." },
]

/**
 * Returns why an item can't be sold, or null. Matches whole words/phrases only.
 * Ambiguous words are written as PHRASES ("plot of land", not "land") because a
 * false block treats an honest seller like a criminal. Tested both ways in
 * tests/blocked-items.check.ts (run: npm run check:blocked).
 */
export function blockedReason(text: string): string | null {
  const t = ` ${text.toLowerCase().replace(/[^a-z0-9 ]/g, " ")} `
  for (const group of BLOCKED) {
    if (group.words.some((w) => t.includes(` ${w} `))) return group.reason
  }
  return null
}
