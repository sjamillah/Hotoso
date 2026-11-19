# 01 — Product Brief: **Hotoso**

> *Pay sellers you've never met. Your money waits with Hotoso until your order arrives.*

## 0. The name

**Hotoso** (*ho-TOH-so*) is shortened from the Twi word **ahotoso**: trust, confidence, the thing you lean on. That's the whole product: buyer and seller don't have to trust each other, because they can both lean on Hotoso.

| Check (18 Nov 2026) | Result |
|---|---|
| `hotoso.com` | Not registered (Verisign RDAP: no record) |
| `hotoso.app` · `hotoso.dev` | Not registered (Google Registry RDAP: no record) |
| Companies or apps using "Hotoso" | None found in web search |

Before going public: register the domains you want (availability changes daily), run a trademark search (Ghana's Registrar-General, plus WIPO Global Brand Database), and confirm the meaning and pronunciation with a native Twi speaker.

## 1. The real-world problem

Across Ghana, Nigeria, Kenya and the wider region, a big share of retail now happens in **social commerce**: Instagram shops, WhatsApp status sellers, TikTok vendors and Facebook Marketplace. The payment step is broken in both directions:

| Buyer's fear | Seller's fear |
|---|---|
| "If I send MoMo first, will the item ever come?" | "If I ship first, will they ever pay?" |
| "What I ordered vs. what I got": the item doesn't match the photos | Fake orders waste delivery fees and riders' time |
| No recourse. Once a MoMo transfer is sent, it's gone. | Buyers who've been burned before won't pay upfront at all, so sales are lost |

So today, trust depends on screenshots, "trusted vendor" hashtags and gut feeling. Small, honest sellers lose sales because they can't *prove* they're trustworthy.

## 2. The idea

**Hotoso** is a *payment hold* (escrow-style) link for informal online sales.

1. The **seller** creates a "Hotoso deal" for an order and gets a link to share on WhatsApp or Instagram.
2. The **buyer** opens the link and pays by MoMo or card through **Paystack**. The money goes to **Hotoso, not to the seller**.
3. The seller sees the deal is **funded**, so they know the buyer is real, and ships the item.
4. The buyer receives the item and taps **"I got it"**. Hotoso **releases** the money to the seller's MoMo wallet.
5. If something's wrong, the buyer **opens a dispute** before the release window closes. Hotoso freezes the money and a human resolves it with a **refund** or a **release**.
6. If the buyer goes silent, the money is **auto-released** after the window (the category's inspection window, 48 or 72 hours after the item is marked shipped, see doc 08), so sellers are never held hostage.

**Why it's not generic:** the payment gateway isn't a checkout button bolted onto a CRUD app. *Moving money safely is the product.* It uses most of what a real payment integration involves: collections, webhooks, verification, idempotency, a state machine, transfers (payouts), refunds and a ledger.

## 3. Users

| Persona | Context | What they need from Hotoso |
|---|---|---|
| **Ama, 26, sneaker reseller (Accra)** | Sells on Instagram, about 30 orders a month, gets lots of "is this legit?" DMs | One-tap deal links that make her look trustworthy, and fast payouts to MoMo |
| **Kwame, 31, buyer (Kumasi)** | Was scammed once for GHS 450 | Certainty about where his money is at every moment, and a clear way to complain |
| **Ops admin** | The Hotoso team | A dispute queue with evidence from both sides and one-click refund or release |

## 4. Core user stories (MVP)

**Seller**
- S1. Sign up and add a payout MoMo number (MTN, Telecel or AirtelTigo).
- S2. Create a deal: title, photos, price, delivery window and an optional note.
- S3. Share the deal link through WhatsApp with a pre-filled message.
- S4. See deals by status (Awaiting payment, Funded: ship now, Shipped, Released, Disputed).
- S5. Mark a deal as shipped, with an optional proof photo or rider note.
- S6. See money **held for me**, **released** and **paid out**.

**Buyer** (no account needed, guest by email and phone)
- B1. Open a deal link and see the item, the seller's track record and the exact price breakdown.
- B2. Pay with MoMo or card.
- B3. Get a private **deal room** link (sent by email and shown on screen) to track the deal.
- B4. Confirm receipt ("I got it") to release the money.
- B5. Open a dispute with a reason and photos before the auto-release deadline.

**Admin**
- A1. See disputed deals with the full timeline and evidence.
- A2. Resolve each dispute with a **refund to buyer** or a **release to seller**, with a written note.
- A3. See failed payouts and retry them.

## 5. Business rules

| Rule | Value (configurable in settings) |
|---|---|
| Currency | GHS (amounts stored in **pesewas**, as integers) |
| Min / max deal | GHS 10 / GHS 5,000 |
| Hotoso fee | 1.5% of the item price, **paid by the buyer**, min GHS 1, max GHS 50 |
| Seller must ship within | 3 days of funding, otherwise the buyer can cancel for a full refund |
| Auto-release window | The category's inspection window (48h or 72h, doc 08) after `shipped`, unless disputed |
| Categories | Physical products in 14 categories; some items are blocked (doc 08) |
| Dispute window | Any time from `funded` until auto-release |
| Payment channels | `card`, `mobile_money` |

## 6. Out of scope (MVP)

Multi-item carts, partial releases, seller-to-seller chat, delivery-partner integrations, KYC document upload, multi-currency, native mobile apps.

## 7. Success metrics (if this were real)

- % of deal links that get funded (do buyers trust it?)
- Median time from `funded` to `released`
- Dispute rate, and the share of disputes resolved within 48 hours
- Repeat sellers per month

## 8. Real-world reality check ⚠️

This is a **learning project in Paystack test mode**. In real life, holding other people's money (escrow) is a **regulated activity**. You'd need a licence or a licensed partner, and the gateway's approval of your business model. Never switch this to live keys without that.
