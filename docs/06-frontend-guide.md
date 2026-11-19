# 06: Frontend guide (read this slowly)

This guide walks you through the Hotoso frontend **one idea at a time**. Each step:

1. explains **one concept** in plain words,
2. points you to **the exact file** where you can see it,
3. gives you a **small exercise** to write yourself,
4. ends with a **check question**. Answer it in your own words before moving on.

Don't rush. One step per sitting is fine.

---

## Before you start: run it

```bash
cd frontend
npm run dev          # then open http://localhost:3000/screens
```

`/screens` lists **every screen and every state** (loading, error, empty, each deal status). Click around first, so the code has pictures in your head.

> **Mock data.** Everything you see is fake data from `lib/mock.ts`. Nothing talks to Django yet. That's on purpose (step 4 explains why).

---

## The map

```
frontend/
├── app/                      ← PAGES. Each folder is a URL.
│   ├── layout.tsx            ← wraps EVERY page (fonts, offline banner)
│   ├── globals.css           ← design tokens + Tailwind theme
│   ├── page.tsx              ← /            landing
│   ├── d/[slug]/             ← /d/SMB40OGA  public deal page
│   ├── pay/return/           ← /pay/return  after Paystack
│   ├── room/[slug]/          ← /room/…      buyer deal room (+ /problem)
│   ├── seller/               ← /seller      seller home, deal rooms, new deal
│   ├── screens/              ← /screens     every screen (dev helper)
│   └── styleguide/           ← /styleguide  every component
├── components/
│   ├── ui/                   ← shadcn components, restyled (Button, Sheet…)
│   └── hotoso/               ← our own components (HoldStrip, ReceiptCard…)
└── lib/
    ├── api.ts                ← THE ONLY place screens get data from
    ├── mock.ts               ← the fake data
    ├── money.ts              ← format + parse money (integers only!)
    ├── fee.ts                ← fee PREVIEW (backend decides the real one)
    ├── phone.ts              ← Ghana numbers, telco detection
    └── types.ts              ← the shapes of our data
```

---

## Step 1: Design tokens

**Concept.** A token is a *named* design decision: `--ink` means "our text colour". Components use the name, never the hex value. Change it once, and everything follows.

**Look at:** `app/globals.css`, the `:root` block (layer 1), then the `@theme inline` block (layer 3). Notice `--color-*: initial;`: it deletes Tailwind's default colours, so `bg-blue-500` doesn't even exist in our app.

**Exercise.** In `globals.css`, change `--butter` to another colour (any hex). Reload `/styleguide`. Count how many places changed. Then undo it.

**Check.** Why does deleting Tailwind's default palette protect the design better than a rule in a document?

---

## Step 2: Server Components and Client Components

**Concept.** By default a component runs **on the server** and sends plain HTML (zero JavaScript to the phone). Only files that start with `"use client"` run in the browser, and we use them **only** when something must react to the user (typing, tapping, timers).

**Look at:**
- `components/hotoso/hold-strip.tsx`: no `"use client"`. It only *displays*, so it costs the buyer no JS.
- `components/hotoso/photo-carousel.tsx`: `"use client"`, because it updates the "1 / 4" counter as you swipe.

**Exercise.** Search the `components/hotoso` folder for `"use client"`. For each file you find, write one sentence: *what does the user do that needs JavaScript here?*

**Check.** The public deal page is a Server Component, yet it has a working pay button. How? (Hint: open `pay-sheet.tsx`.)

---

## Step 3: Server content inside a client shell

**Concept.** A Client Component can receive **already-rendered server content** as `children`. The open/close logic ships as JS. The content inside doesn't.

**Look at:** `components/hotoso/how-it-works-sheet.tsx` (client: opens and closes) and how `app/d/[slug]/page.tsx` passes `<HowItWorksContent />` into it. Same idea: `components/hotoso/seller/deal-tabs.tsx` receives rows made on the server.

**Check.** Why can't we pass a *function* from a Server Component into a Client Component, but we can pass a *string*? (Look at how `hrefFor` is used in `deal-room/action-card.tsx`: it's called on the server, and only the resulting string reaches the client sheet.)

---

## Step 4: One door for data (`lib/api.ts`)

**Concept.** Screens never touch mock data directly. They call functions like `getPublicDeal(slug)`. Today those return mock data after a fake delay. In M2 we'll change only the *inside* of these functions to call Django, and **no screen changes**.

**Look at:** `lib/api.ts`. Note `pretendNetwork()` and the `?demo=` switches (`slow`, `error`, `empty`).

**Exercise.** Add a new sneaker deal to `lib/mock.ts` (copy `samba` and change the title, price and slug), add it to `DEALS`, then open `/d/YOURSLUG`.

**Check.** If Django returns an error, which file decides what the user sees? (Hint: step 5.)

---

## Step 5: Loading, error and not-found are files

**Concept.** Next.js turns special file names into screen states:

| File | When it shows |
|---|---|
| `loading.tsx` | while the page's data is loading (our **skeleton**) |
| `error.tsx` | if loading throws an error ("Try again" calls `retry()`) |
| `not-found.tsx` | when the page calls `notFound()` |

**Look at:** `app/d/[slug]/loading.tsx`, `error.tsx`, and the `notFound()` call in `page.tsx`. Then open `/d/SMB40OGA?demo=slow` and `/d/SMB40OGA?demo=error`.

**Check.** Why must the skeleton have the *same sizes* as the real page? (We fixed exactly this bug in the photo skeleton.)

---

## Step 6: Money is whole pesewas 💰

**Concept.** Computers store decimals approximately (`0.1 + 0.2 = 0.30000000000000004`). So every amount is an **integer of pesewas**: GHS 456.75 = `45675`. We only turn it into text at the very end.

**Look at:** `lib/money.ts`, `formatGHS()` and especially `parseGhsInput()`: it splits `"450.5"` at the dot instead of doing `parseFloat × 100`.

**Exercise.** In your browser console, compare `0.1 * 3` with `(10 * 3) / 100`. Then read `parseGhsInput` line by line and explain each line in a comment (in your own notebook, not the file).

**Check.** The fee in `lib/fee.ts` is labelled a *preview*. Who decides the real fee, and why? (CLAUDE.md rule 2.)

---

## Step 7: Never send what a stranger shouldn't see

**Concept.** The public deal page is open to anyone with the link. It must never contain the buyer's details or the seller's payout number. We copy **only** allowed fields (an *allowlist*), so any new private field stays private by default.

**Look at:** `toPublic()` in `lib/api.ts` and `PublicDeal` in `lib/types.ts`. Note that even the nested `seller` object is allowlisted, because `payoutMasked` is private.

**Check.** What's the difference between an allowlist and a blocklist, and which one fails safely when someone adds a new field?

---

## Step 8: Polling (waiting for Paystack)

**Concept.** After paying on Paystack's page, the buyer comes back. We don't trust that redirect as proof. We **ask the backend every 2 seconds** "is this reference confirmed?" for up to 60 seconds. That's *polling*.

**Look at:** `components/hotoso/pay-return.tsx`, the `useEffect` with `poll()`. Note the **cleanup function** at the end: it stops polling if the buyer leaves the page.

**Exercise.** Open `/pay/return?reference=HTS-PAY-01JDSMB40X&deal=SMB40OGA&demo=slow` and wait 20 seconds, then 60. Find the two constants that control those times.

**Check.** Why don't we tell the waiting buyer "your money hasn't moved"?

---

## Step 9: One component, two viewers

**Concept.** The buyer and seller deal rooms are the **same** `DealRoomView`. A `viewer` prop changes names ("You" vs "Kwame") and the action card. The deal's facts are written once.

**Look at:** `components/hotoso/deal-room/deal-room-view.tsx` and `action-card.tsx` (one `switch` per role, one `case` per status).

**Exercise.** Open `/room/7KQ2XM4A?t=demo&status=funded`. In `action-card.tsx`, find the buyer's `funded` case and add one sentence to it. Reload.

**Check.** Why is the "I got it" button inside a confirmation sheet, when every other action is one tap?

---

## Step 10: Container queries

**Concept.** `lg:` reacts to the **screen** width. `@3xl:` (with `@container` on a parent) reacts to the **box the component is in**. The deal room uses container queries, so it lays out correctly full-page *and* inside the seller's side panel.

**Look at:** the `@container` and `@3xl:` classes in `deal-room-view.tsx`. Compare `/seller` and `/seller/deals/NB550GRN` on a wide screen.

**Check.** What went wrong before we switched from `lg:` to `@3xl:`? (Look at the "Next up" panel in your head: thin column, one word per line.)

---

## Step 11: Accessibility you can see in the code

Find one example of each in the code, and say why it's there:

- `aria-hidden="true"` on the HoldStrip drawing **plus** a `sr-only` sentence (`hold-strip.tsx`)
- `aria-live="polite"` (`pay-return.tsx`, `phone-input.tsx`)
- `aria-describedby` linking an input to its error (`pay-sheet.tsx`)
- every button at least 44px tall (`components/ui/button.tsx`, the `size` variants)
- `motion-reduce:animate-none` on the coin (`hold-strip.tsx`)

---

## What's mocked, and when it becomes real

| Now (mock) | Becomes real in |
|---|---|
| `lib/api.ts` returns `lib/mock.ts` | M2 (deals), M3 (payments), M5 (rooms, payouts), M6 (disputes) |
| "Continue to Paystack" jumps straight to `/pay/return` | M3: redirect to Paystack's `authorization_url` |
| `?status=` previews any deal status | M2+: the status comes from Django's state machine |
| Product art is drawn SVG | M2: sellers upload real photos |
| Fee preview rounds half up | M2: we decide the rule together in `common/money.py` |
| QR code is a placeholder pattern | M2: a real QR library, once real links exist |
| Any `?t=` token is accepted | M5: Django checks the buyer token |

---

## Known limits (honest list)

- **JavaScript size.** The public deal page loads about 210 KB of compressed JS. About 190 KB of that is React + Next.js itself; Hotoso's own code there is about 20 KB. We decided to accept this (doc 04 §1, principle 4) and keep our own code small.
- **Mock previews** (`?status=…`) don't rewrite the timeline, so a "released" preview still shows the earlier events.
- The Open Graph image for WhatsApp previews (`opengraph-image.tsx`) is an M2 task.
