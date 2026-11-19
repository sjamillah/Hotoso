# 08 — Categories: what Hotoso supports

Hotoso protects **any sale where the buyer pays before they can see or check what they're getting**. In the MVP, that means **physical products that get delivered**. Services come in a later version (they need a "job done" flow instead of "shipped").

Each category has its own **rules** (inspection window, proof required, what counts as a valid dispute). Store them as config, not code (see §4).

---

## 1. Products (MVP)

| Code | Category | Examples (Ghana social commerce) | Main buyer risk | Category rules |
|---|---|---|---|---|
| `fashion` | Fashion & clothing | Dresses, kaftans, kente and batakari pieces, jeans, two-pieces, office wear, thrift ("bend-down select") | Wrong size, looks different from the photos | 72h inspection. Size or colour mismatch counts as "not as described" |
| `shoes` | Shoes & sneakers | Sneakers, heels, slides, sandals, loafers | Fake or replica, wrong size | 72h inspection. Seller photo of the box label/size tag required for deals over GHS 500 |
| `bags_accessories` | Bags & accessories | Handbags, wallets, belts, sunglasses, watches, jewellery, waist beads | Fake, poor quality | 72h inspection |
| `hair` | Hair & wigs | Human-hair wigs, bundles, closures, frontals, braiding hair | Not human hair, wrong length or texture | 48h inspection. **Hygiene rule:** a dispute is only valid if the item is unworn, with the lace uncut |
| `beauty` | Beauty & fragrance | Perfumes, oils, skincare, makeup, body care, shea butter | Fake or diluted, expired | 48h inspection. Must arrive **sealed**, and opened items can't be disputed unless they're counterfeit |
| `electronics` | Phones & electronics | Phones, AirPods, laptops, tablets, smartwatches, consoles, speakers, chargers | Biggest scam category: fake, locked, refurbished sold as new, iCloud-locked | 48h **test window**. Seller must add a serial/IMEI photo. Higher max deal (e.g. GHS 20,000) once the seller is verified |
| `home` | Home & living | Furniture, décor, bedding, curtains, kitchenware, small appliances (blenders, rice cookers) | Damaged in delivery, not as pictured | 72h inspection. Damage-on-arrival photos required for disputes |
| `baby_kids` | Baby & kids | Kids' clothes, toys, strollers, car seats | Quality and safety | 72h inspection |
| `books` | Books & stationery | Textbooks, novels, exam past questions (printed) | Wrong edition, pirated copy | 72h inspection |
| `crafts` | Arts, crafts & handmade | Bolga baskets, paintings, beadwork, carvings, leather goods, made-to-order pieces | Not as described, long delays | 72h inspection. **Made-to-order:** ship window up to 14 days (seller sets it) |
| `preloved` | Pre-loved / second-hand | Used phones, furniture, designer pieces, kids' items | Hidden damage, "not as described" | 72h inspection. **Condition photos required** when creating the deal, which become the evidence baseline |
| `sports` | Sports & fitness | Jerseys, gym equipment, bicycles, boots | Fake jerseys, wrong size | 72h inspection |
| `auto_parts` | Auto parts & accessories | Tyres, spare parts, car accessories, car electronics | Wrong part / doesn't fit | 72h inspection. Seller must list the make, model and year the part fits |
| `bulk_goods` | Non-perishable bulk & farm produce | Bags of rice, gari, dried fish, shea butter in bulk, cocoa products | Short weight, poor quality | 48h inspection. Quantity/weight stated in the deal |

## 2. Services (version 2: "job done" instead of "shipped")

The same hold-and-release idea works, with different steps: **book → pay into Hotoso → service delivered → "I'm happy with it" → release**. Larger jobs need **milestones** (e.g. 50% after the first draft, 50% at the end).

| Code | Category | Examples | Flow notes |
|---|---|---|---|
| `svc_beauty` | Beauty services | Braiders and hairdressers (home service), makeup artists, nail and lash technicians | Single appointment. Release 24h after the appointment unless disputed |
| `svc_events` | Events | Photographers, videographers, DJs, MCs, decorators, caterers, event planners, canopy and chair rentals | Deposit at booking + balance on the day. Release after the event date |
| `svc_tailoring` | Tailoring & made-to-measure | Seamstresses, kaba and slit, suits, bridal wear | Milestones: fabric bought → first fitting → final pickup |
| `svc_creative` | Creative & digital freelance | Graphic and logo design, social media management, web development, video editing, writing | Milestones per deliverable, with buyer approval of each one |
| `svc_home` | Home & repair services | Plumbers, electricians, AC servicing, cleaners, painters, carpenters | Release after the buyer confirms the job is done. Photo of the finished job |
| `svc_device_repair` | Device repair | Phone and laptop repair | Release after the buyer tests the device (24h) |
| `svc_moving` | Moving & logistics | Movers, haulage | Release on delivery confirmation |
| `svc_rentals` | Rentals & short stays | Short-stay apartments, car rentals, equipment hire | **Security-deposit hold:** the money returns to the renter unless the owner reports damage |
| `svc_tutoring` | Tutoring & lessons | Private tutors, music lessons | Per-session or per-package. Release after each session |

## 3. Not supported (blocked at deal creation)

| Type | Why |
|---|---|
| Perishable food, cooked meals, cakes | Too small and fast, and spoilage disputes can't be fairly judged |
| Digital goods, gift cards, airtime/data, game credits, crypto | Instant delivery, and gift cards are a common scam route |
| Event tickets, vouchers | Hard to verify, and they're often resold fraudulently |
| Live animals and pets | Welfare and verification problems |
| Medicines, prescription drugs, supplements with medical claims | Regulated (FDA Ghana) |
| Alcohol, tobacco, vapes | Regulated / age-restricted |
| Weapons, ammunition, fireworks | Prohibited |
| Counterfeits and replicas | Illegal. Selling them is grounds for a ban |
| Land, houses, vehicles | Need legal transfer of ownership, far above deal limits |
| Loans, investments, susu schemes | Financial services, not goods |
| Adult content | Prohibited |

Also check **Paystack's own list of prohibited and restricted businesses**. It overrides this table.

## 4. How this fits the build

- Add `category` to `Deal` (choices from the **codes** in §1; service codes come in v2).
- Store per-category rules in a `CATEGORY_RULES` dict (in `deals/categories.py`, or a table later):
  `{"electronics": {"inspection_hours": 48, "requires_serial_photo": True, "max_minor": 2_000_000}, ...}`
- `auto_release_at = shipped_at + inspection_hours` for that category (replacing the single 72h default).
- Deal creation shows a **category picker**, then category-specific fields (e.g. IMEI photo for phones, condition photos for pre-loved).
- A blocked keyword check on the title and description catches obvious "not supported" items (e.g. "cake", "gift card", "iPhone replica").
- Mockups: the deal page example rotates between categories so the product doesn't read as "shoes only".

---

## 5. Implementation notes (added 18 Nov 2026)

- **Frontend (done, mock data):** `frontend/lib/categories.ts` mirrors §1 and §3 as config. It drives the New Deal category picker, the category-specific fields, the blocked-items warning, the inspection window shown on each deal, and the seller dashboard.
- **Backend (M2):** `deals/categories.py` must hold the **same** rules; the backend is the authority (the frontend check is only a friendly early warning). Keep the two files in sync, or later serve the rules from an API endpoint so there's only one copy.
- **Changes to other docs:** the single 72h auto-release in doc 01 §5 and doc 03 §3 becomes "the category's `inspection_hours` (48h or 72h)". The ship window can be up to 14 days for made-to-order `crafts`.
