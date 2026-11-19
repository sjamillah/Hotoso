# 04 — Design System & UX Spec

## 1. Design principles

1. **"Where is my money right now?" must be answerable in under 1 second, on every screen.** This is the whole product. Every deal view leads with the **Hold Strip** (§4.1).
2. **Calm, not flashy.** People are anxious about money. No confetti, no neon gradients, no glassmorphism. Use warm paper tones, confident type and generous space.
3. **Receipts, not dashboards.** Money moments look like printed receipts (§4.3): precise, itemised, mono numerals. That signals trust.
4. **Mobile-first, low-end friendly.** Most buyers arrive from WhatsApp on a mid-range Android phone with patchy data. Design at 360px first. The public deal page needs an LCP under 2.5 s on 3G and no layout shift. JS budget (decided 18 Nov 2026): we accept the React + Next.js baseline (~190 KB compressed) and keep Hotoso's own JS on the public deal page small (~20 KB today, so ~210 KB total). No heavy client libraries on that page.
5. **One primary action per screen.** The next thing the user should do is always the single dark button.
6. **Plain language.** Write "Your GHS 450 is safe with Hotoso", not "Escrow funded". Use status words people would actually say.

## 2. Brand

- **Name:** Hotoso (*ho-TOH-so*), from the Twi word *ahotoso*, "trust; the thing you lean on". The money leans on Hotoso until the order arrives.
- **Logo (updated 18 Nov 2026):** a mark + wordmark lockup. The **mark** is an "H" made of meaning: two uprights (the buyer and the seller) lean slightly inward, *leaning on* what's between them (ahotoso), and the crossbar that joins them is the **Butterlight coin**, outlined in ink, held in the middle by Hotoso. It's the Hold Strip folded into one letter, and it still reads as "an H with a gold centre" at 16px. The **wordmark** is Fraunces 600, lowercase `hotoso`. Versions: mark alone (app icon, favicon: `app/icon.svg`, mark on an ink tile), lockup (headers), wordmark alone (tight spaces). Code: `components/hotoso/wordmark.tsx`.
- **Voice:** a reliable older cousin who works at a bank. Warm, brief, never cute about money.
- **Microcopy examples:**
  - Pay button: **Pay GHS 456.75 into Hotoso**
  - Under the button: *Ama gets paid only after you confirm you received it.*
  - Funded (seller): **Kwame's payment is in. Ship by Fri, 21 Nov.**
  - Auto-release: *If there's no problem, we'll release the money on Sat at 2:14 PM.*
  - Dispute CTA: **Something's wrong with my order**, never "File a dispute".

## 3. Tokens

Define these as CSS variables in `app/globals.css` and map them in `tailwind.config` / `@theme`. **Use only tokens. No raw hex values in components.**

### 3.1 Color

**Brand palette: Black Olive · Alabaster · Butterlight.** The palette is warm and grounded, like a cloth-bound ledger. It deliberately avoids the blue/teal and navy + lime looks most fintechs use.

| Swatch | Hex | Role |
|---|---|---|
| **Black Olive** | `#282C20` | Ink: text, primary buttons, the Hold Strip track, focus ring, dark hero sections |
| **Alabaster** | `#E8E5D8` | Paper: the app background |
| **Butterlight** | `#E8CA78` | The "your money is safe" colour: the coin, held-money highlights, accent buttons on dark surfaces |

Tokens (the three brand colours plus derived tints and muted semantic colours tuned to sit beside them):

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#E8E5D8` | App background (Alabaster) |
| `--card` | `#F3F1E8` | Cards, sheets, inputs (lighter Alabaster) |
| `--ink` | `#282C20` | Primary text, primary buttons, focus ring (Black Olive) |
| `--ink-2` | `#4F5345` | Secondary text |
| `--ink-3` | `#7B7D6F` | Tertiary text, placeholders (non-essential only) |
| `--rule` | `#D2CEBE` | Borders, dividers |
| `--butter` | `#E8CA78` | Butterlight: coin fill, receipt total row, accent button fill, and **text colour on `--ink` surfaces** (big amounts on dark cards) |
| `--butter-soft` | `#F4E6BC` | A tint of Butterlight for large surfaces: "held safely" chip background, Hold Strip caption pill, text selection |
| `--safe` | `#465A1C` | Olive green: "safe / released" text and icons, links |
| `--safe-soft` | `#F4E6BC` | Same as `--butter-soft`. In Hotoso, safe *is* butter. |
| `--wait` | `#845000` | Waiting or action needed (awaiting payment, ship now) |
| `--wait-soft` | `#F0DCC6` | |
| `--clay` | `#9E3727` | Disputes, errors, refunds |
| `--clay-soft` | `#F0D6CF` | |
| `--sky` | `#2B5269` | Info, "on the way / shipped" |
| `--sky-soft` | `#D8E1E5` | |

**Verified contrast (WCAG):** ink on paper 11.3:1 · paper on ink button 11.3:1 · ink on butter 8.9:1 · butter on ink 8.9:1 · ink on butter-soft 11.5:1 · ink-2 6.3:1 · safe 6.1:1 · wait 5.3:1 · clay 5.5:1 · sky 6.6:1 · each semantic colour on its soft background ≥ 5.0:1. All pass AA. `--ink-3` (3.3:1) is for non-essential text only. **Never put Butterlight text on Alabaster (1.3:1).** Butter goes on ink, or behind ink.

**Signature pairing:** an `--ink` card with a `--butter` amount (Fraunces) is the "money moment" surface: the seller's "Held for you" total, the payment success hero, and the landing-page Hold Strip demo. Use it sparingly, about once per screen.

**Dark mode (stretch):** paper `#1C1F16`, card `#282C20`, ink `#E8E5D8`, butter `#E8CA78` stays the same.

### 3.2 Typography

| Role | Font | Notes |
|---|---|---|
| Display / big amounts | **Fraunces** (variable, `opsz` 72–144, weight 500–600, `SOFT` 50) | Hero amounts like **GHS 456.75** and page titles |
| UI / body | **Geist Sans** | Everything else |
| Numbers, references, timestamps | **Geist Mono**, `font-variant-numeric: tabular-nums` | Receipts, references `HTS-PAY-…`, countdowns |

Scale (rem): `xs .75` · `sm .875` · `base 1` · `lg 1.125` · `xl 1.375` · `2xl 1.75` · `3xl 2.25` · `amount 3` (Fraunces). Line-height is 1.5 for body and 1.1 for display. Letter-spacing is `-0.02em` on display.

**Editorial text styles** (approved 18 Nov 2026, see `docs/design/ui-direction.md` §3):

| Style | Spec | Use |
|---|---|---|
| `display-caps` | Fraunces 300, uppercase, `opsz 144`, `SOFT 0`, letter-spacing `-0.01em`, line-height 1.0, size `clamp(2.5rem, 9vw, 4.5rem)`. Only at ≥ 32px. | Landing hero and section titles, "How it works" sheet title |
| `heading-caps` | Geist 600, uppercase, letter-spacing `0.1em`, `sm` | Section headings inside screens (`PRICE`, `ACTIVITY`) |
| `label-caps` | Geist 500, uppercase, letter-spacing `0.1em`, `xs` | Eyebrows, tab labels, short tags (1–4 words, never sentences) |
| `label-mono` | Geist Mono 400, uppercase, letter-spacing `0.06em`, `xs`, tabular numerals | References, timestamps, photo counter, countdown units |

| `title-serif` | Fraunces 300, `opsz 144`, `SOFT 30`, letter-spacing `-0.015em`, line-height 1.08. Pair with a size. Put **one** word in italic: *"Your **deals**"*, *"What are you **selling?**"* | Page titles on every screen after the landing: the landing's voice, kept calm |

Big amounts keep Fraunces 500–600 with `-0.02em`. Body text stays Geist 16px.

### 3.3 Space, radius, elevation, motion

- Spacing: 4-point scale (`4, 8, 12, 16, 24, 32, 48, 64, 96`). `96` is for landing-page section gaps on desktop only. Section rhythm is 48px between major sections on mobile and 64px on desktop. Page gutters are 20px on mobile and 32px on desktop. Max content width is `560px` for buyer flows and `1120px` for the seller dashboard.
- Radius: `--r-xs 4px` (secondary/outline buttons), `--r-sm 8px` (inputs, badges, primary buttons), `--r-md 14px` (cards), `--r-pill 999px` (status chips, pills on photos).
- Elevation: almost flat. Cards use a `1px solid var(--rule)` border plus `0 1px 0 rgba(23,20,15,.04)`. Sheets and modals use `0 12px 40px -12px rgba(23,20,15,.25)`.
- Motion: `150ms` for hovers and presses, and `320ms cubic-bezier(.2,.8,.2,1)` for state changes. Respect `prefers-reduced-motion` (everything below switches off). **Updated 18 Nov 2026:**
  - **Landing page:** purposeful storytelling motion is allowed: headline lines rising in, the hero photo settling, scroll reveals, the scroll-driven "Follow the coin" story, the receipt printing, hang tags swinging on hover. Every motion must say something about the product.
  - **App screens (pay, rooms, seller):** feedback only. The Hold Strip coin glides between places, buttons respond to presses, the receipt prints once on the deal page and on payment success. No decorative loops.
  - Code: the MOTION SYSTEM block in `app/globals.css` and `<Reveal>` in `components/hotoso/reveal.tsx`.

## 4. Signature components

### 4.1 Hold Strip (the hero of the product)

A horizontal track with three **places**: **Buyer → Hotoso → Seller**. A small coin token (`--butter` fill, 1.5px `--ink` outline, a "₵" glyph) sits at the place where the money currently is.

```
  Kwame            Hotoso              Ama
   ○ ─────────────── ● ─────────────── ○
               GHS 450 held safely
        Releases Sat 22 Nov, 2:14 PM  (countdown in mono)
```

| Deal status | Coin position | Track color | Caption |
|---|---|---|---|
| awaiting_payment | Buyer (outline) | `--rule` | "Waiting for payment" |
| funded / shipped | Hotoso | `--ink` from Buyer→Hotoso; caption sits in a `--butter-soft` pill | "GHS 450 held safely" + ship-by or release countdown |
| disputed | Hotoso, with a lock icon | `--clay` | "Frozen while we review" |
| releasing | animating Hotoso→Seller | `--ink` | "Sending to Ama's MoMo…" |
| released | Seller | full `--ink`, with a `--safe` check icon | "Paid to Ama · 22 Nov" |
| payout_failed | Hotoso, with a warning icon | `--wait` | "Couldn't reach Ama's MoMo, retrying" |
| refunding / refunded | animating / at Buyer | `--clay` | "Refunding to Kwame…" / "Refunded to Kwame" |
| cancelled | none (track faded) | `--rule` | "Deal cancelled, no money moved" |

It's accessible: the visual is `aria-hidden`, and a visually hidden sentence states the same information.

### 4.2 Status chip
A pill with a dot, using a `*-soft` background and solid text color. Labels: *Awaiting payment* (`--wait`) · *Ship now* (`--wait`, for the seller) · *Paid, in Hotoso* (`--butter-soft` background + `--ink` text, for the buyer) · *On the way* (`--sky`) · *Released* (`--safe`) · *Problem reported* (`--clay`) · *Refunded* (`--clay`) · *Cancelled* (`--ink-3`).

### 4.3 Receipt card
A card with a **perforated top edge** (CSS radial-gradient mask), mono line items and a dashed rule before the total:

```
  Black AF1, size 42 ................. 450.00
  Hotoso protection (1.5%) ............... 6.75
  - - - - - - - - - - - - - - - - - - - - - -
  You pay                        GHS 456.75
  Ref HTS-PAY-01JD…        18 Nov 2026 14:02
```

### 4.4 Seller trust block
Avatar, display name, a `@handle`, then **three facts in mono**: `38 deals completed · 0 problems · on Hotoso since Mar 2026`. Never show a star rating that can't be backed by data. New sellers show "New on Hotoso" honestly.

### 4.5 Timeline
A vertical list of `DealEvent`s: small icon, sentence ("Ama marked it shipped, with a photo"), and relative time ("2h ago", with the exact time in a tooltip). Newest at the bottom, chat-style.

### 4.5b App footer
Every page after the landing ends with a quiet footer: the logo, *"Your money waits with Hotoso **until your order arrives.**"*, How it works, Photo credits, and "Paystack test mode". It gives pages an ending and a way back. Code: `components/hotoso/app-footer.tsx`.

### 4.5c Category tag
An icon + short category name in `label-caps` (doc 08). Shown on deal pages, the collage and the seller's table. Code: `components/hotoso/category-tag.tsx`; rules live in `lib/categories.ts`.

### 4.5d Sheets and panels (updated 18 Nov 2026)
- **Phones:** a bottom sheet (closest to the thumb).
- **Desktop (≥1024px):** a **side panel** from the right, 440px wide, with the page still visible beside it, so you can read the deal while you act on it. Actions are **pinned to the bottom edge** of the panel.
- **Centred dialog:** only for rare, destructive decisions (e.g. "Cancel this deal?").
- Code: `<SheetContent side="responsive">` (`components/ui/sheet.tsx`, `lib/use-media-query.ts`).

### 4.5e Product gallery
One slider wherever a product appears (deal page, buyer and seller deal rooms): swipe + "2 / 4" counter + thin segments on phones; arrows + a **thumbnail strip** on desktop. `variant="hero"` (deal page, 4:5, "Protected" pill) or `"compact"` (rooms, 4:3). Code: `components/hotoso/photo-carousel.tsx`.

### 4.5f Storefront (a seller's shop identity)
A signboard for each seller: a **cover mosaic made from the seller's own product photos** (so the visuals always match what they sell), an avatar overlapping the cover, name (+ "Verified" when true), @handle, a one-line bio, location, and the real stats (deals done · problems · since). New sellers get an honest "New on Hotoso". Two sizes: `banner` (seller dashboard, public shop page) and `card` (deal page, with "Visit shop"). Code: `components/hotoso/storefront.tsx`.

### 4.6 Buttons & inputs
- Primary: `--ink` background, `--paper` text, `--r-sm` (8px) corners, 52px tall on mobile, full width in buyer flows.
- Secondary: transparent with a 1px `--ink` border and `--r-xs` (4px) corners, label in `heading-caps`.
- Danger-quiet: text-only in `--clay`, used for "Something's wrong".
- Inputs: 48px tall, `--card` background, `--rule` border. Focus gets a 2px `--ink` ring plus a 2px offset. The label always sits above the field, never placeholder-only.
- Money input: a fixed "GHS" prefix in mono and `inputmode="decimal"`. Format on blur.
- Phone input: a "+233" prefix and telco auto-detection from the prefix (024/054/055/059 → MTN …), shown as a small chip.

## 5. Screens

### 5.1 Public deal page `/d/[slug]` (buyer arrives from WhatsApp)
Top to bottom, at 360px:
1. Slim header. **Logo placement rule (updated 18 Nov 2026):** on phones the logo sits on the **left** with "How it works" on the right (natural reading order, no squeeze); from desktop width the logo is **centred**, the editorial look, because there is room. Same rule on the landing header.
2. The product gallery (§4.5e), 4:5. **Full-bleed on mobile**, `--r-md` on desktop, where it stays in view beside the details. Built for many photos (12+): phones get segments (or a progress bar above 6 photos); desktop gets arrows and a self-scrolling thumbnail strip. Ink pills on the photo: a `1 / 12` counter and "Protected".
3. Category tag · seller handle, the title (`title-serif`), price, description, and one mono line with the category's window: *"48 hours to test it after delivery · ships within 1 day"*. Then the seller trust block (verified sellers say so).
4. Receipt card (the price breakdown).
5. Hold Strip in its *awaiting payment* state, as a preview of how it works.
6. Buyer details: name, phone, email (Paystack requires email). The form is collapsed into the pay step.
7. Primary button **Pay GHS 456.75 into Hotoso**, sticky at the bottom on mobile.
8. Reassurance lines with icons, **category-aware** (doc 08): the inspection window (*"…or after your 48 hours to test it"*), *Problem? Money is frozen while we review*, the category's buyer rule if any (sealed, hygiene, IMEI…), each proof the seller provided (*"IMEI photo on file"*), and *Payments by Paystack*.
9. **Desktop:** the photos stack down the left like a fashion product page (every photo seen); phones keep the swipeable carousel. The page ends with the app footer.

Open Graph image: generated per deal (`app/d/[slug]/opengraph-image.tsx`) showing the item photo, title, price and "Protected by Hotoso", so the WhatsApp preview already looks trustworthy.

### 5.2 Payment return `/pay/return?reference=`
A full-height centered state with three variants:
- **Confirming** (polling every 2s, up to 60s): the Hold Strip coin pulses at Buyer, with the text "Confirming with Paystack…". After 20s, add "MoMo approvals can take a minute. Check your phone for a prompt."
- **Success**: the coin animates Buyer→Hotoso, then shows "Your GHS 456.75 is safe with Hotoso", the receipt card and a **Go to your deal room** button. A note explains that the link was also emailed.
- **Failed / abandoned**: calm copy, "No money left your account.", and a **Try again** button.

### 5.3 Deal room `/room/[slug]?t=` (buyer) and `/seller/deals/[slug]` (seller)
The same layout, with role-aware actions:
- Hold Strip at the top, then a contextual **action card** (the single next step), then the timeline, the receipt and the item details.
- Buyer action cards by status: *funded* → "Ama has until Fri to ship". *shipped* → **I got it, release payment** plus the quiet "Something's wrong". *disputed* → "We're reviewing. Usually within 48h."
- Seller action cards: *funded* → **Mark as shipped** (opens a sheet with a note and a proof photo). *shipped* → "Waiting for Kwame. Auto-release in 2d 14h". *payout_failed* → "We couldn't reach your MoMo. Check your number."
- The release confirmation is a bottom sheet: "Release GHS 450 to Ama? You can't undo this." **Yes, release**.

### 5.4 Seller home `/seller` (reworked 18 Nov 2026)
It answers the seller's two morning questions, in this order, and uses the desktop's width instead of a phone column:
1. **How am I doing?** A greeting title (*"Good afternoon, **Ama**."*) + a one-line summary (*"3 things need you. GHS 2,870 is held for you."*), then the seller's **storefront banner** (§4.5f) with "See your shop": their shop as buyers see it.
2. **Money statement:** one dark band (like the landing's dark rooms) holding all three amounts, separated by hairlines: **Held for you** as the hero in Butterlight, **On the way to you** and **Paid out this month** quieter beside it, and *"Payouts go to MTN ••• 0187"* along its foot. The opening line is a greeting title (*"Good afternoon, **Ama**."*) under a mono date line.
3. **Needs you now:** one card per task the seller must do (ship this, answer this problem, fix this payout), most urgent first, each with a photo, the reason, a countdown and one action. Borders follow the colour meanings: `--wait` = a deadline, `--clay` = a problem. Empty: *"You're all caught up."*
3b. **Your shop window:** the live products as photos in a swipeable row, each with its status chip floating on the image. Sellers think in products, not rows.
4. **All deals:** tabs *All* (default) · *Ship now* · *Awaiting payment* · *In progress* · *Problems* · *Done*. On desktop, a scannable **table**: Item (photo, title, category) · Buyer · Status · Next step · Amount. On phones, compact rows.
- **New deal** sits top-right in the header on desktop, and is **pinned to the bottom of the screen on phones** (where the thumb is).
- No embedded deal room on the home page and no generic sidebar. The seller deal room keeps a compact list on the left on desktop.

### 5.4b Public shop `/shop/[handle]` (added 19 Nov 2026)
The storefront banner, then **Available to buy** (links anyone can pay) and **Recently sold** (proof the seller delivers, shown with a "Sold" mark). Photos and titles only: never buyers. Phones get swipeable rows; desktop gets a grid. The deal page links here ("Visit shop") and ends with **More from {seller}** / **Recently sold by {seller}**.

### 5.5 New deal `/seller/deals/new`
A single-column form on the left. On desktop, a **live WhatsApp-style preview** on the right shows how the link card will look as the seller types (including the category's window). On mobile, the preview is a toggle. Fields: **category first** (chips with icons; it decides the rest, doc 08), photos (reorder with buttons), title, then the **category's required proof** (IMEI photo, box label over GHS 500, condition photos, *fits which car*, quantity…), price (with the buyer-pays fee shown live underneath), ship window (3/2/1 days, or up to 14 for made-to-order crafts) and a note. If the title or note names a **blocked item** (doc 08 §3), a clay warning explains why, right away, and the submit button is disabled. The backend repeats the check; the frontend only warns early. After creating, a **Share sheet** offers *Copy link*, *Share to WhatsApp* (`https://wa.me/?text=` with a pre-filled message), and a QR code.

### 5.6 Onboarding `/signup` → `/seller/payout`
Two steps, with a progress bar of 2 dots. Step 2 collects the payout MoMo number and telco, and the account name is confirmed back where the API allows it. It reads: "This is where Hotoso sends your money."

### 5.7 Landing `/` (built as "Follow the coin": see `app/page.tsx` for the chapter structure; the notes below were the starting brief)
Hero headline in Fraunces: *"Sell to strangers. Get paid like they're family."* Under it, an interactive Hold Strip demo (tap through the 4 stages), a "How it works" section in three steps, a seller-focused CTA and a small FAQ ("What if the buyer never confirms?"). No stock photos. Use real-looking product thumbnails and the UI itself as the illustration.

## 6. States checklist (every screen)
Each data view needs designed **loading** (skeletons that match the layout, not spinners), **empty** (a helpful sentence and an action), **error** (what happened and what to do) and **offline** ("You're offline. We'll retry.") states.

## 7. Accessibility
- Hit targets of at least 44×44px. Visible focus everywhere. All flows are keyboard-navigable.
- Color is never the only signal: chips always have text, and the Hold Strip has a text caption.
- Amounts are read naturally with `aria-label="456 cedis 75 pesewas"` on big numbers.
- Forms show inline errors linked with `aria-describedby`, and error text appears under the field.

## 8. Anti-patterns (don't)
Shoes-only examples (show a mix of categories, doc 08) · numbers that aren't real rules or data · purple-to-blue gradients · glass cards · emoji in UI copy · generic "Dashboard" sidebars with 9 icons · fake 5-star ratings · centered body text longer than 2 lines · spinners for full-page loads · modals for the payment flow (redirect or Paystack's own popup only).
