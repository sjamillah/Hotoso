# 07: The frontend, element by element

The code has no explanatory comments. **The explanations live here instead.** Keep this file open next to the code: find the thing you see on screen, read what it is, then open the file.

- **New to a word?** Check the [glossary](#13-glossary) at the bottom.
- **Want the big ideas first?** Read [06 Frontend guide](06-frontend-guide.md). It teaches the concepts in 11 steps; this file explains every element.
- Paths are relative to `frontend/`.

## Contents

1. [The folder map](#1-the-folder-map)
2. [How a page is built](#2-how-a-page-is-built)
3. [Pages, one by one](#3-pages-one-by-one)
4. [The money elements](#4-the-money-elements)
5. [Deal room elements](#5-deal-room-elements)
6. [Seller elements](#6-seller-elements)
7. [Forms and inputs](#7-forms-and-inputs)
8. [Navigation and page frame](#8-navigation-and-page-frame)
9. [Photos](#9-photos)
10. [Building blocks (components/ui)](#10-building-blocks-componentsui)
11. [Data and helpers (lib/)](#11-data-and-helpers-lib)
12. [Styling, config and Docker](#12-styling-config-and-docker)
13. [Glossary](#13-glossary)

---

## 1. The folder map

```
frontend/
├── app/                 PAGES. A folder = a web address (see §2)
├── components/
│   ├── hotoso/          Hotoso's own pieces (HoldStrip, ReceiptCard…)
│   │   ├── deal-room/   pieces of the deal room
│   │   └── seller/      pieces of the seller dashboard
│   ├── landing/         pieces only the home page uses
│   └── ui/              basic building blocks (Button, Input, Sheet…)
├── lib/                 data and helpers, no screens (money, phone, API)
├── assets/photos/       the product photos + CREDITS.md
├── public/              files served as-is (app icons)
└── tests/               small checks you run with npm
```

**Rule of thumb:** `app/` decides *which* page; `components/` decides *what it looks like*; `lib/` decides *what data and rules* go in.

---

## 2. How a page is built

Every page follows the same pattern. Take the deal page:

1. You visit `/d/IPH15P256`.
2. Next.js finds `app/d/[slug]/page.tsx`. `[slug]` catches `IPH15P256`.
3. The page calls `getPublicDeal(slug)` from `lib/api.ts`.
4. **While waiting**, Next.js shows `loading.tsx` (a skeleton).
5. **If it fails**, Next.js shows `error.tsx`.
6. **If the deal doesn't exist**, the page calls `notFound()` and Next.js shows `app/not-found.tsx`.
7. Otherwise it draws the page from components.

Two kinds of components:

| | Server Component (the default) | Client Component (`"use client"` at the top) |
|---|---|---|
| Runs | on the server, once | in the visitor's browser |
| Sends JavaScript? | No, only finished HTML | Yes |
| Can react to clicks/typing? | No | Yes |
| Used for | most of the page | small "islands": sheets, sliders, forms |

We keep Client Components small so a buyer on a cheap Android phone downloads less.

**Layouts.** A `layout.tsx` wraps every page in its folder. `app/layout.tsx` wraps the whole site. `app/room/layout.tsx`, `app/seller/layout.tsx` and `app/styleguide/layout.tsx` each add `AppProviders` (toasts + tooltips) for their pages only (see §8).

---

## 3. Pages, one by one

### Home page · `/` · `app/page.tsx`

The landing page tells one story, **"Follow the coin"**, in chapters. Each chapter uses a different visual form so the page has rhythm instead of repetition:

| Chapter | Form | What it says | Function in the file |
|---|---|---|---|
| Hero | dark photo | the promise, plus a live example deal | `Hero` |
| I · Two strangers | pure type on paper | the buyer's fear and the seller's fear, facing each other | `Fears` |
| II · The hold | scroll story on ink | the coin's journey, step by step | `TheHold` (uses `Journey`) |
| III · What people sell | photo collage | 8 sellers, 8 categories, each with a hang tag | `Collage` |
| IV · The fee | one object | the 1.5% fee, as a receipt that prints | `TheFee` |
| V · Rules | butter colour band | three rules as giant numbers | `Rules` |
| Questions | editorial columns | FAQ | `Questions` |
| Footer | ink | last call + a giant wordmark | `Footer` |

**Details worth knowing:**

- **Hero.** The dark "scrim" over the photo is our own ink colour, darkest where the words sit, so white text stays readable. On phones the logo sits on the left; from tablet up it's centred between the two links.
- **Two strangers.** A black-and-white Accra street photo: the world *before* Hotoso is black and white. Colour returns in the next chapter, when the coin starts moving. Centred text is kept to two lines at most.
- **What people sell.** The collage is three staggered columns on purpose: an editorial spread, not a shop grid. Each photo wears a **hang tag** (`HangTag`) that swings when you hover. On phones a photo is only ~160px wide, so the tag shrinks to a corner and just says "Held"; from the `sm` size up it says "Held by Hotoso". `Shot` is one tile: photo, tag, category, title, "Open deal".
- **The fee.** The receipt **prints** downwards as it scrolls into view (`<Reveal className="print">`).
- **Rules.** Each big number (`48–72h`, `48h`, `₵0`) stays on one line (`whitespace-nowrap`), so the three descriptions underneath start at the same height. The size uses `clamp()` so the longest one fits its column on every screen.
- **Questions.** Each answer is a `<details>` element (opens without JavaScript). The plus sign becomes a minus because its vertical bar folds away.
- **Footer.** The giant "hotoso" is dimmed so mark and word read as one quiet, embossed signature.
- **No invented numbers:** every figure on the page is a real Hotoso rule.

The **live example deal** in the hero is `components/landing/hero-live-card.tsx`: link sent → paid → shipped → paid out, then again. Where other sites show star ratings, we show the product *working*. It pauses while you hover or focus it (so you can read it), and with "reduce motion" switched on it stays still on "held safely". A small progress row shows which stage it's on.

**The Journey** (`components/landing/journey.tsx`) is a scroll story. A "stage" (the coin and its track) stays pinned with CSS `position: sticky` while five steps scroll past beside it. An `IntersectionObserver` reports which step is crossing the middle of the screen, and the stage moves the coin to match. Each step's photo shows the *action* of that step, so it stays one story (Ama's Black AF1). A dashed ring around the held coin is the 72-hour clock. The "frozen" path (when there's a problem) is included because that's what reassures buyers most.

### Deal page · `/d/[slug]` · `app/d/[slug]/page.tsx`

The page a buyer opens from a WhatsApp link, usually on a mid-range Android. It's a **Server Component**: the HTML arrives ready to read. Only three small parts use JavaScript: the photo slider, the "How it works" sheet and the pay sheet.

Order on the screen:

1. **Photos first** (`PhotoCarousel`, variant `hero`): the item is the hero. On desktop the photos stay in view while the details scroll beside them.
2. **Title**, with the category tag and seller handle.
3. **Price + Pay** and **the seller's storefront card**. The order depends on the screen:
   - Phones: title → seller → price. The Pay button is pinned to the bottom anyway.
   - Desktop: title → **price + Pay** → seller, so the decision is visible without scrolling.

   One HTML does both, using CSS `order` (`order-3 lg:order-2`). Screen readers follow the HTML order, so that order must make sense on its own.
4. **The money** (`ReceiptCard`): the price breakdown prints in as it appears, which draws the eye to the exact total.
5. **Reassurance** (§4): what protects the buyer, specific to the category.
6. **More from this seller** (`ProductStrip`): other things they sell, and proof they deliver.

If the deal is already paid or cancelled there's nothing to pay, and a plain card says why instead of the Pay button.

`loading.tsx` shows a skeleton with the same shapes and sizes as the real page, so nothing jumps when the content arrives (no "layout shift"). `error.tsx` uses `RouteError` (§8).

### Payment return · `/pay/return` · `app/pay/return/page.tsx`

Where Paystack sends the buyer after paying. The address carries the payment reference: `/pay/return?reference=HTS-PAY-…`. The logic is in `PayReturn` (§4).

Mock-only switches: `&deal=SLUG` picks the deal, `&demo=success|failed|slow` picks how the pretend Paystack answers. In M3 the backend's status endpoint answers instead.

`loading.tsx` has the same shape as the "confirming" view, for the first split second.

### Buyer deal room · `/room/[slug]?t=TOKEN` · `app/room/[slug]/page.tsx`

The private link emailed to the buyer after paying. The `t` value (a token) proves it's really them. **If the token is missing, the page shows nothing about the deal.** The room itself is `DealRoomView` (§5).

Mock only: `&status=shipped` (or any status) previews the room in that status.

`/room/[slug]/problem?t=TOKEN` is the buyer's "Something's wrong" flow (`DisputeFlow`, §5).

### Seller home · `/seller` · `app/seller/page.tsx`

Answers a seller's two morning questions, in order:

1. **"How am I doing?"** A greeting with the date (like the top of a ledger page), the storefront banner (their own photos make the cover), and the money band (`MoneySummary`).
2. **"What must I do right now?"** `NeedsYou`: one card per task.
3. **Everything else.** `ShopWindow` (live products as photos: it's their shop, not a spreadsheet), then `DealList` (a table on desktop).

It loads three things at once with `Promise.all`, which waits for all of them **in parallel** instead of one after another.

"New deal" is in the header on desktop (top-right, where people look for it). On phones it's pinned to the bottom of the screen, where the thumb is. Desktop uses the width (money side by side, a scannable table) instead of copying the phone column, and there's no generic sidebar.

### Seller deal room · `/seller/deals/[slug]` · `app/seller/deals/[slug]/page.tsx`

- **Phone:** the deal room, with a back arrow to the list.
- **Desktop:** the list of deals on the left, this deal on the right. The page is wider than others (1280px) so the room still gets its two columns. The list is `sticky`: it stays in view while you scroll.

Mock only: `?status=funded` (etc.) previews any status.

### New deal · `/seller/deals/new` · `app/seller/deals/new/page.tsx`

A static page (no data to load), so it has no skeleton. The whole form is one Client Component, `NewDealForm` (§7).

### Public shop · `/shop/[handle]` · `app/shop/[handle]/page.tsx`

What a buyer sees after tapping "Visit shop": the storefront, what's for sale now, and what sold recently (proof the seller delivers). **Never who bought anything.**

When the seller opens their own shop from the dashboard ("See your shop"), the address has `?preview=seller`, and an ink bar says "This is how buyers see your shop" with a way back. In M2 this will be decided by the logged-in session, not by the address (anyone can type an address).

### Other pages

| Page | File | What it's for |
|---|---|---|
| Not found | `app/not-found.tsx` | Any address that doesn't exist. An empty strip with the coin still at the start: a small joke that reassures (the money never left). Then two ways forward. |
| Credits | `app/credits/page.tsx` | Every photo and who took it. Unsplash doesn't require this; we do it anyway. |
| Screens | `app/screens/page.tsx` | A map of every screen and state, for reviewing. A development helper, not part of the product. |
| Styleguide | `app/styleguide/page.tsx` | Every token and component on one page: logo, colour, type, buttons, inputs, chips, hold strip, money, trust, timeline, overlays, states. `interactive-demos.tsx` holds the parts that need clicks. Class names in its token tables are written out in full so Tailwind can find them (see §12). |

**Site icons** (all in `app/`): `icon.svg` and `favicon.ico` (browser tab), `apple-icon.png` (iPhone home screen), `manifest.ts` (what Android uses for "Add to Home screen"), `opengraph-image.jpg` + `.alt.txt` (the preview picture in WhatsApp). The manifest uses raw hex colours because it can't read CSS tokens: `#282C20` is ink and `#E8E5D8` is paper.

---

## 4. The money elements

### HoldStrip · `components/hotoso/hold-strip.tsx`

**The hero of the product.**

```
   Kwame            Hotoso              Ama
     ○ ─────────────── ● ─────────────── ○
                 GHS 450 held safely
```

A coin sits at the **place where the money is right now**. It answers "where is my money?" in under a second, without reading a word.

- It's a **Server Component**: no JavaScript. The coin's movement is a CSS animation, so it costs nothing on a slow phone.
- A table (`VISUALS`, one row per status) decides the coin's position and the colours; `PLACE_LEFT` maps each place to 0%, 50% or 100% across the track.
- An empty coin means "not paid yet"; no coin means cancelled.
- `transition-[left]`: when the status changes, the coin **glides** to its new place.
- On a dark card, ink lines would be invisible, so the travelled part of the track turns butter instead (`tone="ink"`).
- When cancelled, only the *drawing* fades. The words stay full strength so they still pass contrast checks.
- The inner box is inset by half a coin, so the coin never sticks out.
- The drawing is hidden from screen readers; one plain sentence describes it instead. **The words are the source of truth**, the drawing is decoration.
- Props: `shipBy` (funded: e.g. "Fri, 21 Nov"), `releaseAt` (shipped: when money auto-releases), `countdown` (shipped: e.g. "2d 14h", in mono), `doneOn` (released/refunded: the date), `caption` and `detail` (replace the words), `pulse` (the coin breathes while the payment is checked), `arrive` (the coin glides buyer → Hotoso once, on success), `tone` ("ink" inside dark cards).
- Pass `"You"` as `buyerName` or `sellerName` and the grammar adapts ("your money", not "You's money").

### ReceiptCard · `components/hotoso/receipt-card.tsx`

Money moments look like printed receipts:

```
  ╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮   ← perforated top edge
  Black AF1, size 42 ......... 450.00
  Hotoso protection (1.5%) ...... 6.75
  - - - - - - - - - - - - - - - - - -
  You pay                  GHS 456.75   ← butter total row
  REF HTS-PAY-01JD…     18 NOV, 14:02
```

- Numbers are in Geist Mono with **tabular digits**: every digit is the same width, so amounts line up in a neat column, like a till slip.
- The dotted line between label and number is a "leader": it walks your eye across.
- The perforated edge is the `perforated-top` style (§12).

### MoneyMoment · `components/hotoso/money-moment.tsx`

An ink card with the amount in butter Fraunces: the warm light in a dark room. Use it **about once per screen** ("Held for you", payment success). If everything is special, nothing is. "GHS" is set smaller so the number is the hero.

### PayReturn · `components/hotoso/pay-return.tsx`

The buyer just came back from Paystack. **We don't trust that redirect as proof of payment** (anyone can type that address). Instead we **poll**: ask the backend every 2 seconds "is this reference confirmed?", for at most 60 seconds.

```
confirming → success  (the backend verified it with Paystack)
           → failed   (Paystack says it failed or was abandoned)
           → slow     (60 seconds with no answer: stop asking, reassure)
```

- "Check again" restarts the polling (a counter bumps).
- If the buyer leaves the page, polling stops (the effect's cleanup).
- `aria-live` makes screen readers announce the change from "confirming" to the result.
- On success the coin glides into Hotoso, then the receipt prints.

### PaySheet · `components/hotoso/pay-sheet.tsx`

The pay step of the deal page:

1. The buyer taps "Pay GHS … into Hotoso". On phones it's a bar pinned to the bottom, so the price is never out of sight; on desktop it's a normal button.
2. A sheet asks for name, phone and email. Paystack requires an email, and the private deal-room link is sent there.
3. "Continue to Paystack":
   - **M3 (real):** `POST /api/deals/{slug}/pay/` → the backend creates a Payment, asks Paystack for a checkout page, and we send the browser there. The buyer pays on Paystack's page, never ours.
   - **Now (mock):** we skip Paystack and jump to `/pay/return`.

### Reassurance · `components/hotoso/reassurance.tsx`

The calm promises under the price, specific to the category: the inspection window (48h or 72h), any rule the buyer should know **before** paying (doc 08), and the proofs the seller provided. It also exports the three steps used in the "How it works" sheet.

### TrustBlock · `components/hotoso/trust-block.tsx`

Who the seller is, plus a "proof card" of real numbers. **Never stars**: we can't back a star rating with data. New sellers get an honest "New on Hotoso" instead of empty zeros. The label is first in the HTML (as `<dt>`/`<dd>` requires) but `flex-col-reverse` draws the number on top.

### StatusChip · `components/hotoso/status-chip.tsx`

A pill with a dot, soft background and solid text. **Colour is never the only signal**: the words always say the status. Some statuses read differently per person: `funded` says "Ship now" to the seller but "Paid, in Hotoso" to the buyer. "Cancelled" uses ink-2 on muted, because the lighter ink-3 fails contrast for text that matters.

---

## 5. Deal room elements

### DealRoomView · `components/hotoso/deal-room/deal-room-view.tsx`

The same layout for buyer and seller:

1. **Hold strip:** where is the money? Answered first, always.
2. **Action card:** the one next step.
3. **Activity:** what happened, as a story.
4. **Receipt + item:** the details.

- The `viewer` prop only changes names ("You" vs "Kwame") and the action.
- Events are stored in the third person ("Kwame paid…"). When Kwame reads his own room, his name becomes "You" ("You paid…").
- `@container`: the layout reacts to the width of **this box**, not the screen, so the room works full-page *and* inside a narrow panel (see container queries, §13).
- A receipt's lines must **add up** to its total. Both people see the same sum (item + protection = what the buyer paid), and the seller gets a "You get" line underneath.
- The item's photo appears first in the header: the fastest "yes, this is my order".
- `titleAs`: `"h2"` when the room is shown inside another page, so the page keeps one `h1`.

### ActionCard · `components/hotoso/deal-room/action-card.tsx`

The **single next step** for this person, right now. At most one dark button. If there's nothing to do, the card says so ("Nothing else to do"), which is reassuring too. Split into a buyer half and a seller half. `hrefFor(status)` builds the demo link to the next status (mock only).

### Sheets · `components/hotoso/deal-room/sheets.tsx`

The interactive pieces of the deal room. Each slides up from the bottom on phones (closer to the thumb) or in from the side on desktop.

| Sheet | Who | What it does |
|---|---|---|
| Confirm received ("I got it, release payment") | buyer | The **one action that can't be undone**, so it asks clearly |
| Add evidence | both | Add a note and photos to an open problem |
| Mark as shipped | seller | Optional rider note and proof photo. Starts the inspection clock (48h or 72h, by category) |
| Fix payout number | seller | When a payout failed: check and fix the MoMo number |
| Share deal link | seller | WhatsApp (a `wa.me` link with a ready message), copy, QR. Pass `null` as the trigger to open it from code |
| Cancel deal | seller | A dialog (centred) because it's deliberate and rare |

The QR is a **placeholder pattern** (not scannable); a real one needs a small library (e.g. `qrcode`) once real links exist in M2. The file picker is a hidden file input styled as a quiet button, with chosen file names listed.

**Mock behaviour:** confirming shows a toast and moves the demo to the next status. In M5/M6 these call the real API, e.g. `POST /api/room/{slug}/confirm/`.

### MockAdvance · `components/hotoso/deal-room/mock-advance.tsx`

**Mock only.** Moves the demo to the next status after a few seconds, like the backend's *simulate* mode will ("schedules a fake transfer.success after about 5 seconds", doc 03 §4.2). It stops if you leave first. In M5 it disappears: the backend's webhook handler moves the deal, and the page asks for the latest status.

### RoomSkeleton · `components/hotoso/deal-room/room-skeleton.tsx`

The loading shape of a room: title, hold strip, action card, timeline, receipt.

### Timeline · `components/hotoso/timeline.tsx`

What happened to the deal, as plain sentences. **Newest at the bottom**, like a chat, because people read it top-down as a story. Built from DealEvent rows, the same audit trail the backend keeps. A thin vertical line joins the events.

Each event has three times: `ago` ("2h ago"), `exact` ("18 Nov 2026, 14:02", in a tooltip) and `iso` (for the `<time>` element machines read).

**RelativeTime** (`relative-time.tsx`) is the "2h ago" with its tooltip. It's the only part of the timeline that needs JavaScript (the tooltip reacts to hover/focus), so it's split into its own small Client Component; the rest stays on the server.

### DisputeFlow · `components/hotoso/dispute-flow.tsx`

"Something's wrong with my order", in **three short steps** (a stressed person shouldn't face one long form), with a three-segment progress bar. Every step repeats where the money is: still held, and frozen once the problem is sent. When the step changes, keyboard and screen-reader focus moves to the new heading. In M6 the last step sends `POST /api/room/{slug}/dispute/?t=`; the backend moves the deal to `disputed`, which stops the auto-release.

---

## 6. Seller elements

### MoneySummary · `components/hotoso/seller/money-summary.tsx`

**The money statement:** three numbers in one dark band.

- **Held for you** (the hero, in Butterlight, the colour that means "your money is safe"): paid, not yet released.
- **On its way:** released by the buyer, travelling to MoMo.
- **Paid out this month:** already on the seller's MoMo.

Separated by thin lines. One glance, three answers.

### NeedsYou · `components/hotoso/seller/needs-you.tsx`

**"Needs you now"**: the seller's to-do list. Only deals where the *seller* must act: something to ship, a problem to answer, a payout number to fix. Most urgent first, each card with exactly one button. Colours keep their meaning: wait (amber) = a deadline, clay (red) = a problem.

### ShopWindow · `components/hotoso/seller/shop-window.tsx`

The seller's live products as photos in a swipeable row. Sellers think in **products**, not table rows, and photos make the dashboard feel like their shop. Only deals still in motion appear; finished ones live in the table.

### DealList and DealTabs · `components/hotoso/seller/deal-list.tsx`, `deal-tabs.tsx`

The seller's deals in tabs: All · Ship now · Awaiting payment · In progress · Done · Problems. "Ship now" comes first because it's the only tab where the seller owes someone something.

- `layout="table"`: on desktop, a scannable table (Item · Buyer · Status · Next step · Amount). A seller with 30 orders a month compares **down a column**.
- Compact rows: phones, and the narrow list beside a deal room.
- "All" lists the most actionable first. The table opens on "All"; the narrow list opens on the first tab that has deals.
- Each row says the one thing that happens next, in plain words.

The tabs are interactive (a Client Component), but the **rows are made on the server** and passed in as `content`. That's the "server content inside a client shell" pattern (doc 06, step 3).

### Storefront · `components/hotoso/storefront.tsx`

A seller's shop identity, like a signboard:

- **Cover (`StoreCover`):** a mosaic of the seller's *own* product photos, so it always matches what they sell. One tile per *different* photo, up to 5. A seller with one product gets one full-width photo instead of a tile and an empty gap. A soft ink fade at the bottom lets the text sit calmly on top.
- **Avatar:** overlaps the cover like a profile page. It needs `relative z-10`: the cover is "positioned", so it would otherwise paint over the avatar; a higher z-index brings the avatar on top.
- Then name, one-line bio, location and **real numbers** buyers judge sellers by (never stars).
- `variant="banner"`: dashboard and public shop. `variant="card"`: the deal page, with "Visit shop".
- The column classes are written out in full in lists (`MOBILE_COLS`, `WIDE_COLS`) because Tailwind only creates classes it can see written in the code (§12).

### ProductStrip · `components/hotoso/product-strip.tsx`

A row of products, image first: swipe on phones, a grid on desktop. `sold=false` links to the deal page and shows the price. `sold=true` shows a "Sold" mark, no link, and **never the buyer**.

---

## 7. Forms and inputs

### NewDealForm · `components/hotoso/new-deal-form.tsx`

The seller types; a WhatsApp-style preview shows how the link will look. After "Create deal link", the share sheet opens.

Sections, in order: **Category → Photos → Title → Price → Ship within → Note**.

- **Category comes first** because it decides the rest: the extra proof required (IMEI photo, box label, condition photos…), the buyer's inspection window and the longest ship window (doc 08).
- **Blocked items** (gift cards, replicas…) are caught as the seller types, with a plain reason. A clear reason now beats a surprise rejection later.
- **Requirements** for the category appear as fields; some depend on the price.
- **Photos:** previews use temporary `blob:` addresses that must be freed when removed. A `ref` remembers the latest list without re-rendering; it's updated in an effect and cleaned up when the page closes. Two per row on phones (room for 44px buttons), four on desktop. A plain `<img>` is used for these local previews (with an ESLint exception), because `next/image` is for real image files.
- **Price** shows the buyer's total live underneath. This is only a **preview**: the backend calculates the real fee (M2).
- **Desktop:** the preview sits beside the form and updates as you type. It's WhatsApp-*style*: a chat bubble shape in *our* colours (we never copy their brand).
- In M2 the submit sends `POST /api/seller/deals/` with the photos.

### MoneyInput · `components/hotoso/money-input.tsx`

A fixed "GHS" prefix, the number keypad on phones (`inputMode="decimal"`), and tidy formatting when you leave the field ("450" → "450.00"). It reports the value as **integer pesewas**, so nothing after it ever handles a decimal. A hidden input `{name}_minor` carries the pesewas for plain HTML forms. `hint` is the helper text underneath (e.g. "Buyer pays GHS 456.75"); `error` shows an error and marks the field invalid.

### PhoneInput · `components/hotoso/phone-input.tsx`

A fixed "+233" prefix and a chip that names the network as soon as the first digits are typed ("055" → MTN). It accepts "055 123 4987", "0551234987" and "+233 55 123 4987", tidies the display when you leave the field, and sends the international form (`+233551234987`) in a hidden input. The network chip is a live region, so screen readers announce it.

---

## 8. Navigation and page frame

### Headers · `components/hotoso/site-header.tsx`

Three headers, one per kind of screen:

| Header | Used on | Looks like |
|---|---|---|
| `PublicHeader` | buyer-facing pages | Back (when useful) · logo · "How it works" |
| `RoomHeader` | deal rooms | Back arrow · logo · the deal's ID in mono. `wide` makes it 1280px |
| `SellerHeader` | seller pages | logo · "New deal" (desktop) · avatar |

Logo placement: on phones the logo sits on the left (natural reading order, nothing squeezed); on desktop it's centred, because there's room.

### BackLink and NavTracker · `back-link.tsx`, `nav-tracker.tsx`

A smart Back button.

- **NavTracker** keeps a **trail** of Hotoso pages visited in this browser tab, in `sessionStorage` (per tab, cleared when the tab closes). Going to a new page pushes it on; going back pops the current one off; a refresh changes nothing. After each change it sends a `hotoso:trail-changed` event. If storage is blocked (private mode), Back simply stays hidden.
- **BackLink** shows "Back" only when there's a Hotoso page behind you. From a WhatsApp link or a fresh tab it hides itself, because "back" would mean leaving Hotoso and the browser already does that. `fallbackHref` shows it anyway and goes there instead.
- **Why not `document.referrer`?** Next.js changes pages *without* a full reload, and the browser doesn't update the referrer for those moves.
- `useSyncExternalStore` reads the trail safely: the server (which has no trail) shows nothing, and the browser fills it in.

### AppFooter · `components/hotoso/app-footer.tsx`

The quiet footer for every page after the landing. It gives each page an ending, carries the brand, and links back to "How it works" for a buyer who's still unsure. `padForPayBar` leaves room for the pinned Pay bar on the deal page.

### HowItWorksSheet · `components/hotoso/how-it-works-sheet.tsx`

Only the open/close behaviour runs in the browser. The content arrives as `children`, already made on the server (the "server content inside a client shell" pattern).

### AppProviders · `components/hotoso/app-providers.tsx`

Toasts + tooltips, added only by the sections that use them (deal rooms, seller pages, styleguide). They are **not** in the root layout, so the public deal page (the one most buyers see first) doesn't download them.

### States · `components/hotoso/states.tsx`

Every screen that shows data needs four states:

| State | Shows |
|---|---|
| loading | a skeleton in the shape of the content |
| empty | a helpful sentence **and** a next action |
| error | what happened **and** what to do |
| offline | "You're offline. We'll retry." |

Calm words, no blame, no jargon, no error codes in the headline.

### RouteError · `components/hotoso/route-error.tsx`

What every `error.tsx` shows. Error pages must be Client Components because "Try again" is a button that runs code (`retry`). **We never show the technical error message**: it would scare people and could leak details. `app/seller/error.tsx` covers `/seller` and every page under it that has no `error.tsx` of its own.

### OfflineWatcher · `components/hotoso/offline-watcher.tsx`

Shows "You're offline" across the top of every page when the connection drops, and hides it when it returns. `useSyncExternalStore` is React's way of reading something outside React (the browser's online status) and re-rendering when it changes. On the server it assumes online.

### Reveal · `components/hotoso/reveal.tsx`

Shows its content with a gentle rise when it scrolls into view. An `IntersectionObserver` (a browser feature that says when an element enters the screen) sets `data-shown` **once**; the CSS does the animation. `className="print"` makes it print downwards like a receipt. Safe by design: content is hidden only while JavaScript runs and motion is allowed. Without JavaScript, or with "reduce motion", everything simply shows.

### Wordmark (the logo) · `components/hotoso/wordmark.tsx`

The mark is an **H made of meaning**:

- the two uprights are the **buyer** and the **seller**, leaning slightly in ("ahotoso": the thing you lean on);
- the crossbar joining them is the Butterlight **coin**: the money that connects them, held in the middle by Hotoso.

It's the HoldStrip folded into one letter, and still reads as "an H with a gold centre" at 16px (favicon size).

- `<HotosoMark />`: the symbol alone (icons, avatars).
- `<Wordmark />`: mark + "hotoso" in Fraunces, the main logo.
- `<Wordmark mark={false} />`: the word alone.
- `tone`: on ink, the uprights and coin outline turn paper. The coin always keeps an outline, because Butterlight alone on Alabaster is almost invisible (1.3:1 contrast).

### CategoryTag · `components/hotoso/category-tag.tsx`

A quiet tag: one icon per category plus its short name (doc 08 §1).

---

## 9. Photos

### PhotoCarousel · `components/hotoso/photo-carousel.tsx`

**One slider, on every screen that shows a product.**

- **Phones:** swipe (CSS scroll-snap: the browser does it, no library). A "2 / 4" counter on the photo. Underneath: thin segments (each a 44px-tall button), or with many photos a **progress bar**, because tiny segments become too hard to tap.
- **Desktop:** the same slider plus arrow buttons (faded at either end) and a **thumbnail strip** that scrolls by itself, so even 12 photos are one click away and the current one stays in view. Only the strip scrolls, never the page.
- `variant="hero"`: the deal page (large, with a "Protected" pill), capped at about half a phone screen so title and price stay visible. `variant="compact"`: deal rooms (smaller, 4:3).
- Small ink pills float on the photo so they're readable on any image.
- Only the first photo is preloaded: it's the first thing a buyer sees.

### DealImage · `components/hotoso/deal-image.tsx`

One deal photo, filling its box. If the photo is a close-up **crop**, it zooms into the chosen spot. A zoomed photo needs a sharper file, so it asks `next/image` for a version twice as wide as the box. Used by the gallery, thumbnails and lists, so a crop looks the same everywhere.

### DealThumb · `components/hotoso/deal-thumb.tsx`

A small square photo for list rows. Its `sizes` value is small, so phones download a tiny file for a tiny box.

### Photo files · `lib/photos.ts`

Every photo is **imported as a file**, not a web address. That gives `next/image` three things for free:

1. the exact width and height, so it reserves the space and nothing jumps;
2. a tiny blurred preview, shown while the real photo loads on slow networks;
3. a file name with a fingerprint (hash), so browsers can cache it forever.

Credits are in `assets/photos/CREDITS.md` (all Unsplash License).

---

## 10. Building blocks (components/ui)

These come from **shadcn/ui** (copied into our code, then restyled to our tokens).

| File | What it is | Hotoso rules |
|---|---|---|
| `button.tsx` | Buttons | Every size is at least **44px** tall (thumb-sized). `default` (ink) is **the** primary action, one per screen. `butter` only on dark surfaces (butter on paper is invisible). `outline` is the tailored secondary. `quiet-danger` is text-only clay, e.g. "Something's wrong". Caps labels get slightly less padding because they look heavier. `cva` ("class variance authority") picks classes by variant name |
| `input.tsx` | Text field | 48px tall. Text is **16px on purpose**: phones zoom the page in on inputs with smaller text. `aria-invalid="true"` turns the border clay |
| `textarea.tsx` | Multi-line field | Same style as Input |
| `label.tsx` | Field label | Always **above** its field. Never use placeholder text as the label |
| `card.tsx` | Card | Flat: 1px border and the faintest shadow. Hotoso looks printed, not floating |
| `badge.tsx` | Small pill | For counts and short tags (the "2" on Ship now). For statuses use StatusChip |
| `sheet.tsx` | Sliding panel | `side="responsive"`: a bottom sheet on phones (near the thumb), a side panel on desktop (the page stays visible beside it). `mt-auto` pins the actions to the bottom of a side panel |
| `dialog.tsx`, `drawer.tsx` | Pop-ups | Dialog = centred box for rare, deliberate actions |
| `tabs.tsx` | Tabs | Quiet "garment tags": caps labels on a thin line, the active one underlined. The list scrolls sideways on narrow phones instead of squashing. Keyboard ← → moves between tabs (free from Radix) |
| `skeleton.tsx` | Loading shape | The slow pulse means "still loading". It stops completely with "reduce motion" |
| `sonner.tsx` | Toasts | Small confirmations like "Link copied". Always the light theme, so they don't turn black on our paper pages |
| `carousel.tsx` | Embla slider | For the styleguide demo. The deal page uses the lighter CSS scroll-snap slider instead (§9). It reads its starting arrow state on the next frame, not directly in the effect (a React rule) |
| `tooltip.tsx`, `avatar.tsx`, `separator.tsx`, `field.tsx` | Small helpers | Restyled to tokens |

---

## 11. Data and helpers (lib/)

### `api.ts`: the only door for data

Screens get data **only** through these functions. Today each returns **mock** data after a short pretend delay (so the skeletons really appear). From M2 we replace the *inside* of each function with a real `fetch("/api/...")` to Django. **Screens don't change**, because they only depend on the function names and the shapes they return.

| Function | Real address (later) | Returns |
|---|---|---|
| `getPublicDeal` | `GET /api/deals/{slug}/` | the public deal. **Never** buyer details |
| `getPaymentStatus` | `GET /api/payments/{reference}/status/` | pending / success / failed. Mock: "pending" for 2 polls. In M3 the backend asks Paystack's verify endpoint |
| `getSellerShop` | `GET /api/shops/{handle}/` | a public shop: available + sold, photos and titles only |
| `getBuyerRoom` | `GET /api/room/{slug}/?t=` | the buyer's room; the token proves it's them |
| `getSellerProfile` | `GET /api/seller/profile/` | the logged-in seller. **Mock: always Ama** until login exists (M2) |
| `getSellerSummary` | `GET /api/seller/summary/` | the three money numbers |
| `getSellerDeals`, `getSellerDeal` | `GET /api/seller/deals/…` | the seller's deals, one deal with its timeline |

**`toPublic()` is an allowlist.** It copies **only** the fields a stranger may see, including inside the nested seller (`payoutMasked` is private). If someone later adds a private field to Deal, it stays private by default because it isn't on the list. Django's serializer will do the same with `fields = [...]`.

**Demo switches** (mock only), from the address: `?demo=slow` (wait 4 seconds: see the skeleton), `?demo=error` (see the error state), `?demo=empty` (see the empty state).

### `money.ts`: the only place money is formatted

Every amount is an **integer number of pesewas** (GHS 456.75 → `45675`). Never decimals, because computers store them approximately: in JavaScript `0.1 + 0.2 === 0.30000000000000004`.

| Function | Example |
|---|---|
| `formatAmount` | `135000` → `"1,350.00"` (receipts, aligned columns) |
| `formatGHS` | `45675` → `"GHS 456.75"` |
| `formatGHSShort` | `45000` → `"GHS 450"` (for sentences) |
| `amountAriaLabel` | `45675` → `"456 cedis 75 pesewas"` (what a screen reader says) |
| `parseGhsInput` | `"1,350.5"` → `135050`; `"12.345"` → `null` (too many decimals). No floats |

Inside, a private `split()` turns `45675` into `{ cedis: 456, pesewas: 75 }` with integer maths only. `Minor` is just a name for "integer pesewas": a reminder, not a new type.

### `fee.ts`: the fee preview

1.5% of the item price, paid by the buyer, minimum GHS 1, maximum GHS 50. ⚠️ **Only a preview** while the seller types. The backend calculates the real fee (`common/money.py`, M2), and **the backend's number always wins**.

- **bps** = basis points: 1 bps = 0.01%, so 1.5% = 150 bps. It keeps the percentage a whole number, so all maths stays in integers.
- `previewFeeMinor()` does: `(item × 150 + 5,000) / 10,000`, rounded down, then clamps to `FEE_MIN_MINOR`…`FEE_MAX_MINOR`. Adding 5,000 (half of 10,000) first makes .5 round **up**. The rounding rule is a placeholder until we decide it in M2.

### `phone.ts`: Ghana mobile numbers

A Ghana mobile number is 10 digits locally ("055 123 4987"), or +233 then the same number **without** its leading 0 ("+233 55 123 4987"). The first three local digits are the network prefix. Detecting the network is only a hint: people can keep their number when they switch networks, so the seller still confirms it.

`toLocalDigits` (keep digits, turn +233 into 0), `detectTelco` ("055…" → "MTN"), `formatAfterCountryCode` ("55 123 4987", shown after the +233), `toE164` ("+233551234987", the form APIs expect), `formatLocal` ("055 123 4987", how Ghanaians write numbers).

### `categories.ts`: categories as configuration

**One table drives everything:** the New Deal picker, the extra fields each category needs, the inspection window buyers see, and the blocked-items warning. Each category has a short name (for tight spaces), inspection hours (48 or 72), the verb ("test" for electronics, "inspect" otherwise), any buyer rule, requirements, the longest ship window, and a higher price ceiling for verified sellers. The backend will keep the **same** rules in `deals/categories.py` (M2) and is the authority; this file is the friendly early warning.

**`blockedReason()`** returns why an item can't be sold, or `null`. It matches whole words and phrases only, and ambiguous words are written as phrases ("plot of land", not "land"), because **blocking an honest seller treats them like a criminal**. It's tested both ways in `tests/blocked-items.check.ts`.

### `types.ts`: the shapes of the data

These mirror the backend (doc 03). `DealStatus` lists every status from the state machine. `Viewer` is who's looking ("buyer" or "seller"). `Deal` is everything about one deal; `PublicDeal` is what a **stranger** may see (no buyer details, ever). `DealPhoto` is a photo: an imported file now, a web address from Django later. `crop` (mock only) is a close-up of the same photo so products have several views without inventing different items.

### `mock.ts`: the pretend world

Realistic Ghanaian examples until the Django API exists. "Now" in the mock world is Wed 18 Nov 2026, 2:30 PM. Ama Owusu (@ama.kicks) resells sneakers from Accra; seven other sellers cover the other categories (fashion, electronics, beauty, bags, sports, home, crafts). Amounts are integer pesewas.

- `shots()`: each deal gets its real photo **plus** two close-up crops of it: honest views of the same item, never a different one. The iPhone has 12 views to prove the gallery copes with many photos.
- `DEALS`: Ama's deals (her dashboard). `CATEGORY_EXAMPLES`: the other sellers' deals. `ALL_DEALS`: every deal any page can open.
- `withStatus()`: shows any deal in any status, with believable dates, so no screen ever shows "undefined".
- `receiptLines()`: the item + protection lines for a ReceiptCard.

### `use-media-query.ts` and `utils.ts`

- `useMediaQuery("(min-width: 1024px)")` is `true` while the screen matches, and re-renders when it changes (rotate a tablet, resize a window). On the server there's no screen, so it returns `serverValue`.
- `cn()` joins class names and removes conflicting Tailwind classes: `cn("h-8", "h-12")` → `"h-12"`. It guesses conflicts from class names, and would wrongly treat our custom `text-amount` as a *colour*, so we tell it our custom size and radius names.

### `tests/blocked-items.check.ts`

A tiny check: things that **must** be blocked, and honest listings that must **not** be. Run `npm run check:blocked`. It exits with a non-zero code on failure, which is how tools know a test failed. In M2 it becomes a real pytest for `deals/categories.py`.

---

## 12. Styling, config and Docker

### `app/globals.css`: tokens in three layers

1. **Brand tokens** (`:root`): the **only** place raw hex colours live.
   - paper (Alabaster): app background · card: cards, sheets, inputs
   - ink (Black Olive): text, primary buttons, focus ring · ink-2: secondary text (6.3:1 contrast) · ink-3: non-essential text only (3.3:1)
   - rule: borders · muted: quiet surfaces, skeletons
   - butter (Butterlight): "money is safe". **Never text on paper.** safe-soft is the same as butter-soft: in Hotoso, safe *is* butter.
2. **shadcn role tokens**: point shadcn's names (`bg-primary`…) at the brand tokens.
3. **`@theme`**: turns tokens into Tailwind classes (`bg-paper`, `text-ink`…). `--color-*: initial` **deletes** Tailwind's default colours (blue-500…), so an off-brand colour simply won't work.

Also in `@theme`: fonts (from `next/font` in `app/layout.tsx`), the type scale, radius (4px buttons, 8px inputs, 14px cards), an almost-flat elevation, and the HoldStrip coin animations (they move the coin's `left` between 0% buyer, 50% Hotoso, 100% seller, or gently breathe).

**Text styles** (`@utility`, each becomes a class):

| Class | For |
|---|---|
| `display-caps` | ceremonial headlines, only at 32px+ |
| `title-serif` | page titles; pair with a size and put one word in `<em className="italic">` |
| `heading-caps` | section headings inside screens: PRICE, ACTIVITY |
| `label-caps` | eyebrows, tab labels, tags: 1–4 words, never sentences |
| `label-mono` | references, timestamps, counters |
| `money` | big amounts: Fraunces, soft, tight. Pair with a size |
| `perforated-top` | the receipt's bitten top edge, cut with a CSS mask (only transparency, no new colour) |

**Motion system:** the landing has storytelling motion; app screens only use motion as feedback. Scroll reveal (hidden only while JavaScript runs), the receipt print, the hero headline rising line by line, the hero photo settling like a camera finding focus, the hang tags swinging, and FAQ answers gliding open. **Everything stops with "reduce motion"**; the coin then simply sits where the money is.

**Base styles:** one focus style everywhere, a 2px ink ring with a 2px gap.

> **Why are some class names written out in full lists?** Tailwind scans the code for complete class names and only generates those. `"sm:grid-cols-" + n` would never be found, so we write `"sm:grid-cols-1", "sm:grid-cols-2"…` in a list and pick from it.

### `app/layout.tsx`: the frame of every page

- **Fonts:** Fraunces (display serif for amounts and headlines; loaded as a variable font so every weight 100–900 exists, with its optical-size and softness settings; italic for the editorial voice), Geist (UI and body text), Geist Mono (numbers, references, timestamps: the "receipt" font).
- **Metadata:** social previews (WhatsApp) need full image addresses, so `NEXT_PUBLIC_SITE_URL` must be set when the site is deployed. The phone's browser bar takes our ink colour (raw hex, because metadata can't read CSS tokens).
- **`suppressHydrationWarning`:** browser extensions (Grammarly, password managers, translators) add attributes to `<html>`/`<body>` before React starts, which React would report as a "hydration mismatch". This ignores *attribute* differences on those two tags only; everything inside is still checked.
- Only tiny, truly global things live here (OfflineWatcher, NavTracker), because every visitor downloads them.

### `next.config.ts`

- `output: "standalone"`: `next build` also writes `.next/standalone`, a small `server.js` plus only the packages the app really uses. The Docker image ships just that (about a tenth of `node_modules`). `npm run dev` ignores it.
- `experimental.workerThreads`: pages with `[brackets]` make the dev server start a helper. By default it's a whole new Node **process**, which fails when the laptop is low on memory ("Jest worker encountered 2 child process exceptions"). A worker **thread** lives inside the existing process and needs far less memory.
- `rewrites()`: the browser only ever talks to Next.js (port 3000). Requests to `/api/...` are forwarded to Django behind the scenes (`API_ORIGIN`, default `http://localhost:8000`). Because the browser sees **one** origin, session cookies and CSRF just work, and we need no CORS.

### `Dockerfile`: a multi-stage build

Three temporary stages do the work; only the last becomes the image you run:

| Stage | Does |
|---|---|
| `deps` | Copies **only** `package.json` + `package-lock.json`, then `npm ci` (installs exactly what the lockfile says). Docker caches each step, so the slow install is reused until those two files change |
| `builder` | Copies the code and runs `npm run build`. `API_ORIGIN` and `NEXT_PUBLIC_SITE_URL` are build arguments because `next.config.ts` is read at build time. ⚠️ `NEXT_PUBLIC_` values are baked into the browser code: **never put a secret in one** |
| `runner` | Copies in only `.next/standalone`, `.next/static` and `public/`, owned by the built-in `node` user |

- Base image `node:24.16.0-bookworm-slim`: the same Node as this laptop, on a slim Debian (smaller, less to attack).
- `HOSTNAME=0.0.0.0`: answer on every network inside the container. The default (localhost) would only answer from *inside* the container, so Docker couldn't pass your browser's requests in.
- `USER node`: **never run as root**. If someone broke into the app, they'd only get an ordinary user's powers.
- `HEALTHCHECK`: Docker asks the app every 30 seconds; after 3 failures it's marked "unhealthy".

`.dockerignore` keeps out `node_modules` and `.next` (rebuilt inside; Windows versions wouldn't work on Linux), secrets (`.env*`, `*.pem`) and files not needed to build.

### `docker-compose.yml`

```bash
docker compose up -d --build     # build if needed, start in the background
docker compose ps                # what's running, and is it healthy?
docker compose logs -f frontend  # watch the output (Ctrl+C stops watching)
docker compose down              # stop and remove the containers
```

| Setting | Meaning |
|---|---|
| `ports: "127.0.0.1:3000:3000"` | Only **this laptop** can open it. Without `127.0.0.1:`, anyone on the same Wi-Fi could reach it |
| `read_only: true` | Nobody can change the app's files while it runs |
| `tmpfs` | Scratch folders in memory, wiped on restart: `/tmp`, and `/app/.next/cache` where Next.js keeps resized images |
| `cap_drop: [ALL]` | Drop every special Linux power (it needs none) |
| `no-new-privileges` | It can never gain new ones |
| `mem_limit: 768m` | It can't eat the laptop's memory |
| `pids_limit: 200` | It can't start runaway processes |
| `API_ORIGIN: http://backend:8000` | On Docker's network, services find each other by service name |

From M0 we add `db` (PostgreSQL 16 with a named volume, so data survives restarts) and `backend` (Django on port 8000); from M7, `redis` for background jobs.

---

## 13. Glossary

| Word | Plain meaning |
|---|---|
| **Allowlist** | A list of what's allowed; everything else is blocked by default |
| **Client Component** | A component that runs in the browser (has `"use client"`), so it can react to clicks |
| **Container query** (`@container`) | Styles that react to the size of a *box*, not the whole screen |
| **CSRF** | An attack where another site tricks your browser into sending a request; Django blocks it with a token |
| **Effect** (`useEffect`) | Code React runs *after* drawing, e.g. starting a timer; its cleanup runs when you leave |
| **Hydration** | The browser "waking up" server-made HTML so buttons work; a mismatch means the two disagree |
| **IntersectionObserver** | A browser feature that tells you when an element enters or leaves the screen |
| **Layout shift** | Content jumping when something loads late; skeletons with the right size prevent it |
| **Live region** (`aria-live`) | A part of the page whose changes screen readers announce |
| **Mock** | Fake data shaped exactly like the real data, used until the backend exists |
| **Pesewas / minor units** | 1 cedi = 100 pesewas. All money is stored as whole pesewas |
| **Polling** | Asking the same question again every few seconds until there's an answer |
| **Props** | The settings you pass to a component, like `<HoldStrip status="funded" />` |
| **Ref** (`useRef`) | A box that remembers a value without causing a re-draw |
| **Scroll-snap** | CSS that makes a scrolling row stop neatly on each item |
| **Server Component** | A component that runs on the server and sends finished HTML, no JavaScript |
| **sessionStorage** | Small storage in one browser tab, cleared when the tab closes |
| **Skeleton** | A grey placeholder in the shape of content that's still loading |
| **Slug / handle** | A short code in the address that picks one deal (`IPH15P256`) / one seller (`ama.kicks`) |
| **Sticky** | An element that scrolls normally until it reaches an edge, then stays there |
| **Token** (design) | A named value like `ink` or `paper`, used instead of raw colour codes |
| **Token** (`?t=`) | A secret code in a link that proves who you are |
| **`useSyncExternalStore`** | React's safe way to read something that lives outside React (storage, online status) |
| **z-index** | Which element is drawn on top when two overlap |
