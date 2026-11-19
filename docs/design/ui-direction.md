# UI Direction: Hotoso

> **Status: approved 18 Nov 2026.** All §3 rows were approved and copied into `docs/04-design-system.md`. Mobbin references were skipped by decision (§1).
> Source of truth stays `docs/04-design-system.md`. This document *proposes*; doc 04 *decides*. Approved token changes get copied into doc 04 before Phase 2.

How to read this doc: each section starts with a short **📘 Concept** box that explains the one new idea it uses. If a term confuses you, read its box first.

---

## 0. Concepts used in this document (read once, refer back)

Read these one at a time. Each one builds on the one before.

**📘 1. Design token.** A *named* design decision, such as `--ink = #282C20`. Components use the name, never the raw value. If we later change ink, we change it in one place and every button, text and border follows. Hard-coding `#282C20` in 40 files means 40 edits and a guaranteed miss.

**📘 2. Type scale.** A fixed, short list of allowed text sizes (`xs .75rem`, `sm .875rem`, `base 1rem` …). Picking from a list instead of inventing `15px` here and `17px` there is what makes a page feel *ordered* rather than *random*.

**📘 3. `rem` and `em`.** `1rem` = the root font size (16px in browsers by default). `em` = the *current element's* font size. So `0.1em` letter-spacing on 12px text is 1.2px, and on 48px text it's 4.8px. That's why we write tracking in `em`: it scales with the text.

**📘 4. Tracking (letter-spacing).** Extra space added between *all* letters. Positive tracking (`+0.1em`) opens words up and makes small uppercase look calm and "expensive". Negative tracking (`−0.02em`) pulls big headlines together so they read as one shape.
Rule of thumb: **small uppercase → positive tracking; big display → zero or slightly negative.**

**📘 5. Contrast ratio (WCAG AA).** A number comparing how light the text is versus its background, from 1:1 (invisible) to 21:1 (black on white). AA, the accessibility standard we must pass, needs **4.5:1** for normal text and **3:1** for large text (24px+, or 18.7px+ bold). Butterlight on Alabaster is 1.3:1. That's why it's banned.

**📘 6. Radius.** How rounded a corner is. `0px` = sharp and editorial, `12px` = friendly app, `999px` = pill. Mixing radii without a rule looks messy, so each *kind* of element gets one radius.

**📘 7. Hit target.** The tappable area of a button or link. A thumb needs ≥ 44×44px. A 12px text link can still have a 44px hit target if we pad it invisibly.

**📘 8. Mobile-first (360px).** We design for the narrowest common Android screen first, then *add* layout for wider screens. Going the other way (desktop first, then squeeze) always breaks something on the phone, and our buyers arrive from WhatsApp on phones.

**📘 9. Skeleton.** A grey placeholder in the *shape* of the content that's loading (a box where the photo will be, bars where text will be). Unlike a spinner, it shows the layout instantly, so nothing jumps when data arrives (no layout shift).

---

## 1. Reference images (Mobbin): skipped

> Decision (18 Nov 2026): we go ahead **without** Mobbin screenshots. The pattern list below still guides the screens.

**The folder `docs/design/references/` does not exist in the repo yet.** I searched the whole project and found no images, so I can't write the "for each reference image" table. I won't invent references I haven't seen.

**What I need from you:** copy your Mobbin screenshots into `docs/design/references/` (and the editorial ones into `docs/design/references/editorial/`). Then I'll fill in the table below.

| Image file | Pattern we borrow | For which Hotoso screen | What we deliberately don't copy |
|---|---|---|---|
| *(waiting for files)* | | | |

To help you pick screenshots, these are the UX patterns each screen needs (structure only, never looks):

| Hotoso screen | Pattern worth finding on Mobbin |
|---|---|
| Public deal page | Product page with photo carousel + sticky buy bar · checkout price breakdown · seller identity/trust module |
| Pay / confirming | "Payment processing" waiting screen · payment success receipt · payment failed with retry |
| Deal room | Order tracking with progress stepper · order timeline/activity feed · "confirm delivery" action |
| Seller home | Balance summary cards · tabbed order list with count badges · list-detail split on desktop |
| New deal + share | Multi-photo upload with reorder · live preview while typing · native share sheet / copy link / QR |
| Dispute flow | "Report a problem with order" multi-step flow · reason picker · photo evidence upload · confirmation |
| Landing | Product-led hero (the UI as the illustration) · 3-step "how it works" · FAQ accordion |

---

## 2. Editorial inspiration

**📘 Concept: inspiration vs. imitation.**
- *Imitation* copies another site's values: their font size, their letter-spacing, their layout. The result looks like a knock-off of them.
- *Inspiration* asks two questions: **"What feeling does this site give me?"** and **"How would Hotoso create that feeling with its own brand?"** The result looks like us, only better.

So Amrit Palace, Adanola and Aligne are a **mood board**, not a rulebook. Nothing below says "do X because site Y does X". Every decision is justified by what Hotoso needs: trust, calm, receipts, and buyers on mid-range Android phones. The numbers we use (sizes, spacing, radii) are **ours**, chosen for our fonts and our users, and tuned by eye in the styleguide.

For each site: **the feeling** → **Hotoso's own idea** → **where it shows up**.

### 2.1 Amrit Palace: *ceremony and warmth*

**The feeling:** walking into a special place. Big, quiet words. Dark rooms lit with warm light. A menu that reads like an honest list of prices.

**Hotoso's own ideas:**
- **Important moments get a ceremonial headline.** Paying a stranger is a big moment, so the landing hero and key section titles use a large, light, uppercase Fraunces. Same feeling, our typeface, sized for a 360px phone. (Style T1 in §3.)
- **Dark "rooms" with warm light.** Full-width Black Olive sections where Butterlight plays the warm lamp: the coin, the held amount, one butter button. Butterlight is already "your money is safe", so the warm light *means* something here.
- **Colour-block tiles** for "How it works", made only from our palette: a Butterlight tile, a sand (`--muted`) tile and a card tile.
- **Honest proof.** A calm card that shows the seller's real numbers (deals completed, problems). No stars, because we have no review data, and doc 04 bans fake ratings.

**Where it shows up:** landing page (strongest), the deal page's trust card.

### 2.2 Adanola: *confidence through saying less*

**The feeling:** the brand doesn't shout. The product is the hero. Space feels deliberate, like a shop with only a few things on the shelf.

**Hotoso's own ideas:**
- **The item is the hero of the deal page.** The buyer opened the link to see *the sneakers*, so the photo comes first and fills the phone width. Title and price follow. Everything else waits further down.
- **The brand steps back.** A quiet header with just the `hotoso•` wordmark. On the deal page, Hotoso is the trusted middle person, not the star.
- **Small useful labels on the photo**, only when they help the buyer: which photo you're on, and a small "Protected" mark.
- **White space as a sign of care.** Generous gaps between sections, so an anxious buyer never feels crowded or rushed.

**Where it shows up:** public deal page (strongest), landing.

### 2.3 Aligne: *tailored precision*

**The feeling:** exact and well-made, like the label sewn inside a good coat. Small details are done with care.

**Hotoso's own ideas:**
- **Section labels as "garment tags".** Short uppercase words with spacing between letters (`PRICE`, `ACTIVITY`, `HELD FOR YOU`). They make screens easy to scan and quietly premium. (Styles T2–T3.)
- **Monospace for every number and reference.** Doc 04 already chose Geist Mono for the receipt idea. Aligne shows that mono can feel *luxurious*, not just technical, which gives us confidence to use it boldly for prices, references and countdowns. (Style T4.)
- **A tailored secondary button.** The solid ink button is the main action. Its partner is lighter: a thin outline with squarer corners, like a well-pressed edge. (R1.)

**Where it shows up:** every screen, in small type details. This is the inspiration that makes the *transactional* screens feel premium without adding decoration.

### 2.4 Where the mood goes (strong → light)

```
Landing page        ██████████  ceremonial headline, dark rooms, colour tiles
Public deal page    ████████░░  item as hero, quiet header, labels on photo, proof card
Pay / confirming    ████░░░░░░  calm; tag labels + mono only
Deal room           ███░░░░░░░  functional; tag labels, mono numbers
Seller home         ███░░░░░░░  functional; MoneyMoment card is the one "moment"
New deal / dispute  ██░░░░░░░░  forms first; type details only
```

### 2.5 Usability guard-rails (these beat mood every time)

- Body text **≥ 16px**. Uppercase labels **≥ 12px** and only for 1–4 word labels, never sentences. (Uppercase sentences are slow to read because every letter is the same height.)
- Every text/background pair passes AA (📘 5). `--ink-3` (3.3:1) stays decorative only, never for labels.
- Uppercase text links get invisible padding so the hit target is ≥ 44px (📘 7).
- The light Fraunces 300 headline is only used at **≥ 32px**. Thin strokes at small sizes become hard to read on cheap screens.

---

## 3. Proposed token changes (need your approval ✋)

**📘 Concept: why propose instead of just changing?** Doc 04 is the source of truth. If I quietly add a style in code, doc and code drift apart, and the next person (or future you) follows the wrong one. So: propose here → you approve → I update doc 04 → *then* code.

Tick each row you approve. Rows you reject keep the current doc 04 value.

**These numbers are ours, not copied.** They're starting points chosen for *our* fonts (Fraunces, Geist, Geist Mono) and *our* users (small Android screens). In Phase 2 I'll put each style on the `/styleguide` page and adjust it by eye until it looks right. A design value earns its place because it works for Hotoso, not because another site uses it.

### 3.1 Typography: new text styles

| # | Name | Spec | Used for | Contrast check |
|---|---|---|---|---|
| T1 | `display-caps` | Fraunces **300**, UPPERCASE, `opsz 144`, `SOFT 0`, letter-spacing **−0.01em**, line-height 1.0. Size `clamp(2.5rem, 9vw, 4.5rem)` (40px on a phone → 72px on desktop) | Landing hero, landing section titles, deal-page "How it works" sheet title | ink on paper 11.3:1 ✅, paper on ink 11.3:1 ✅ |
| T2 | `heading-caps` | Geist **600**, UPPERCASE, letter-spacing **0.1em**, `sm` (14px) | Section headings inside screens: `YOUR ORDER`, `PRICE`, `ACTIVITY` | ink on paper ✅ |
| T3 | `label-caps` | Geist **500**, UPPERCASE, letter-spacing **0.1em**, `xs` (12px) | Eyebrows, flanking labels, form-group labels, tab labels | ink-2 on paper 6.3:1 ✅ |
| T4 | `label-mono` | Geist Mono **400**, UPPERCASE, letter-spacing **0.06em**, `xs` (12px), tabular numerals | References `HTS-PAY-…`, timestamps, "1 / 4" counter, countdown units | ink-2 on paper 6.3:1 ✅ |

What stays the same: big **amounts** stay Fraunces 500–600 with the existing −0.02em (`amount 3rem`). Money must be the boldest, clearest thing on the page, not a light thin style. Body text stays Geist 16px.

📘 *Why `SOFT 0` on T1?* Fraunces has a "softness" setting (an *axis* of a variable font). Doc 04 uses `SOFT 50` (rounded, friendly) for amounts. For the editorial caps we want crisp, classic serifs, so softness goes to 0. Same font file, different setting, so no extra download.

📘 *Why −0.01em on T1 (letters slightly closer)?* Remember 📘 4: big text reads better when letters are pulled a little together, so the word becomes one shape. Fraunces is a wide font, so pulling too hard makes letters touch. −0.01em is a gentle start that we'll tune by eye.

📘 *Why 0.1em for Geist but 0.06em for Mono?* Mono letters are already evenly spaced (every letter is the same width), so they need less extra space to feel open.

### 3.2 Radius

| # | Token | Current | Proposed | Why |
|---|---|---|---|---|
| R1 | `--r-xs` (new) | — | **4px** | Secondary (outline) buttons. Squarer corners make the lighter partner feel tailored next to the solid primary |
| R2 | Button radius | 12px | **8px** (`--r-sm`) for the primary button | 12px reads "friendly app". 8px is calmer and sits better next to 4px secondaries. Still clearly a button. |
| R3 | `--r-md` cards | 14px | **keep 14px** | Matches the shadcn `--radius: 0.875rem` you specified. Receipts and cards stay soft. |
| R4 | Carousel image | 14px rounded, inside gutters | **0px, full-bleed on mobile**, 14px on desktop | The item is the hero: an edge-to-edge photo on the phone feels like a magazine, not a widget |

### 3.3 Space and layout

| # | Change | Why |
|---|---|---|
| S1 | Add `96` to the spacing scale (desktop section gaps on landing only) | Editorial white space between landing sections |
| S2 | Section rhythm: 48px between major sections on mobile, 64px on desktop (transactional screens) | Calm, consistent breathing room |
| S3 | Public deal page header: **centred wordmark**, "How it works" as a `label-caps` link on the right (doc 04 §5.1 currently says wordmark *left*) | Hotoso steps back: a centred, quiet wordmark says the page belongs to the *item*, not to an app shell |
| S4 | Carousel indicator: **thin segments** instead of dots (doc 04 §5.1 says dots) | Quieter, more editorial; segment width also shows *how many* photos there are |

### 3.4 Colour: no new colours ✅

We need **zero new hex values**. Every mood maps to an existing token:

| Mood we want | Our token |
|---|---|
| A dark, ceremonial "room" | `--ink` section, `--paper` text, `--butter` for the one big amount |
| A warm tile | `--butter` tile, `--ink` text |
| A quiet sand tile | `--muted` `#DDD9CA` tile, `--ink` text |
| A clean, bright surface | `--card` `#F3F1E8` |
| Warm, never pure-black ink | `--ink` (already warm) |

---

## 4. Screen wireframes (360px first)

**📘 Concept: wireframe.** A rough box-drawing of *where things go and in what order*, with no colours or polish. Fixing order on paper is cheap, while fixing it in code is expensive. Read each one top to bottom as if scrolling on a phone. `▓` = ink surface, `░` = butter/soft surface, `[ ]` = button.

The **"where is my money?" answer** for each screen is marked 💰. It must be visible without scrolling.

### 4.1 Public deal page `/d/[slug]` (buyer from WhatsApp)

```
┌──────────────────────────────────┐ 360
│              hotoso•   HOW IT WORKS│  56px header, wordmark centred
├──────────────────────────────────┤
│                                  │
│        [ full-bleed photo ]      │  4:5 → 360×450, no radius
│ (1 / 4)              (PROTECTED) │  ink pills floating on photo
│                                  │
├──────────────────────────────────┤
│ ━━━━ ──── ──── ────              │  segment indicator
│ Black AF1, size 42               │  Geist 600 xl
│ GHS 450.00                       │  mono
│                                  │
│ (A) Ama Owusu  @ama.kicks        │  Trust block
│ ┌─────────┬─────────┬──────────┐ │  proof card (real numbers)
│ │ 38      │ 0       │ MAR 2026 │ │  Fraunces numbers
│ │ DEALS   │ PROBLEMS│ ON HOTOSO│ │  label-caps
│ └─────────┴─────────┴──────────┘ │
│                                  │
│ PRICE                            │  heading-caps
│ ╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮╭╮ │  perforated edge
│ Black AF1, size 42 ....... 450.00│  ReceiptCard
│ Hotoso protection 1.5% ...... 6.75│
│ - - - - - - - - - - - - - - - - -│
│ You pay              GHS 456.75  │
│                                  │
│ HOW YOUR MONEY MOVES             │
│ Kwame ○──────●──────○ Ama        │  HoldStrip (awaiting_payment)
│ 💰 Your money stays with you      │
│    until you pay                 │
│                                  │
│ ✓ Ama is paid only after you     │  3 reassurance lines
│   confirm you got it             │
│ ✓ Problem? We freeze the money   │
│ ✓ Payments by Paystack           │
│                                  │
├──────────────────────────────────┤
│ [ Pay GHS 456.75 into Hotoso   ] │  ▓ sticky, 52px, always visible
└──────────────────────────────────┘
```

- **Tapping Pay** opens a bottom **sheet** (not a page) with Name, Phone (+233, telco chip), Email, and the same button. Then it redirects to Paystack. (📘 *Why a sheet and not a modal?* On phones a sheet slides up from where your thumb already is and keeps the deal visible behind it. Doc 04 bans modals only for the *payment itself*. The details form isn't the payment.)
- **Desktop 1280:** two columns. Photo carousel left (sticky, 14px radius), everything else right in a 560px column. The pay button is inline, not sticky.
- **States:** loading = skeleton photo + bars · not found = "This deal link doesn't exist or was removed." · already paid = "This deal is already paid for." + link to deal room help · offline = top banner.
- **Server Component**, with only the carousel and the pay sheet as small client islands (no carousel library, just CSS scroll-snap). This keeps it under 100 KB.

### 4.2 Pay return `/pay/return`: Confirming · Success · Failed

```
CONFIRMING                     SUCCESS                        FAILED
┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│        hotoso•       │       │        hotoso•       │       │        hotoso•       │
│                      │       │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │       │                      │
│ CHECKING YOUR PAYMENT│       │ ▓ SAFE WITH HOTOSO  ▓ │       │ PAYMENT DIDN'T GO    │
│                      │       │ ▓ GHS 456.75        ▓ │ 💰    │ THROUGH              │
│ ○ ~ ~ ● ─────── ○    │       │ ▓ (butter Fraunces) ▓ │       │                      │
│ coin pulses at Buyer │       │ ▓ ○────●────○       ▓ │       │ 💰 No money left your │
│                      │       │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │       │    account.          │
│ 💰 Confirming with    │       │ Ama has been told to │       │                      │
│    Paystack…         │       │ ship by Fri, 21 Nov. │       │ This sometimes       │
│                      │       │                      │       │ happens if the MoMo  │
│ (after 20s:)         │       │ [receipt card]       │       │ prompt timed out.    │
│ MoMo approvals can   │       │                      │       │                      │
│ take a minute. Check │       │ We also emailed you  │       │ [ Try again        ] │
│ your phone for a     │       │ this link.           │       │                      │
│ prompt.              │       │                      │       │ Back to the deal     │
│                      │       │ [ Go to your deal  ] │       │                      │
│ REF HTS-PAY-01JD…    │       │ [   room           ] │       │ REF HTS-PAY-01JD…    │
└──────────────────────┘       └──────────────────────┘       └──────────────────────┘
```

- Success uses the **MoneyMoment** (ink card + butter amount): the one celebratory surface, with no confetti.
- A reference in `label-mono` is always visible, so if anything goes wrong the buyer has something to quote.
- After 60s with no answer: "Still waiting on Paystack. Your money is safe either way. We'll email you as soon as it's confirmed." + [Check again].

### 4.3 Deal room: buyer `/room/[slug]` and seller `/seller/deals/[slug]`

Same skeleton; only the **action card** differs by role and status.

```
┌──────────────────────────────────┐
│ ← hotoso•             DEAL 7KQ2  │  label-mono deal id
├──────────────────────────────────┤
│ Kwame ○──────●──────○ Ama        │  HoldStrip FIRST (doc 04 §1)
│ ░ 💰 GHS 450 held safely ░        │  butter-soft caption pill
│ Releases Sat 22 Nov, 2:14 PM     │  mono countdown
│                                  │
│ ┌──────────────────────────────┐ │  ACTION CARD (one next step)
│ │ Ama marked it shipped.       │ │
│ │ Got your order?              │ │
│ │ [ I got it, release payment ]│ │  ▓ primary
│ │   Something's wrong with my  │ │  quiet-danger (clay text)
│ │   order                      │ │
│ └──────────────────────────────┘ │
│                                  │
│ ACTIVITY                         │  heading-caps
│ ○ Deal created          2D AGO   │  Timeline, label-mono times
│ ○ You paid GHS 456.75   2D AGO   │
│ ● Ama shipped it, with  3H AGO   │
│   a photo [thumb]                │
│                                  │
│ RECEIPT                          │
│ [receipt card]                   │
│ ITEM                             │
│ [thumb] Black AF1, size 42       │
└──────────────────────────────────┘
```

Action card by role × status:

| Status | Buyer sees | Seller sees |
|---|---|---|
| funded | "Ama has until Fri, 21 Nov to ship." (no button; cancel appears only after ship-by) | **[Mark as shipped]** → sheet: note + proof photo |
| shipped | **[I got it, release payment]** + "Something's wrong" | "Waiting for Kwame. Auto-release in 2d 14h." |
| disputed | "We're reviewing. Usually within 48h." + [Add a photo] | "Kwame reported a problem: *Not as described*." + [Add your side] |
| releasing | "Sending to Ama's MoMo…" | "On its way to your MoMo…" |
| released | "Done. Ama was paid on 22 Nov." | MoneyMoment: "GHS 450 paid to MTN ••• 4987" |
| payout_failed | "Ama's payout is delayed. Your part is done." | "We couldn't reach your MoMo. **[Check your number]**" |
| refunding / refunded | "Refunding GHS 456.75 to you…" / "Refunded on …" | "Refunded to Kwame." |

- **Release confirmation sheet:** "Release GHS 450 to Ama? You can't undo this." → [Yes, release] (primary) / [Not yet] (secondary). See risk #2.
- **Desktop:** HoldStrip full width across the top. Below it two columns: action card + timeline (left), receipt + item (right).

### 4.4 Seller home `/seller`

```
┌──────────────────────────────────┐
│ hotoso•                    (A)   │  avatar → profile/payout
├──────────────────────────────────┤
│ GOOD MORNING, AMA                │  label-caps
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓ 💰 HELD FOR YOU               ▓ │  MoneyMoment (the one per screen)
│ ▓ GHS 1,350.00  (butter)        ▓ │
│ ▓ 3 deals · released when buyers▓ │
│ ▓ confirm                       ▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ┌──────────────┐┌──────────────┐ │
│ │ ON THE WAY   ││ PAID OUT     │ │  regular cards
│ │ GHS 450.00   ││ NOVEMBER     │ │
│ │              ││ GHS 3,210.00 │ │
│ └──────────────┘└──────────────┘ │
│ [ + New deal                   ] │  ▓ primary
│                                  │
│ SHIP NOW 2 │ AWAITING │ IN PROG… │  tabs, scroll horizontally
│ ─────────                        │
│ [img] Black AF1, size 42  450.00 │  deal row
│       Kwame · SHIP BY 18H  (chip)│  countdown in --wait <24h
│ [img] Jordan 4 Retro      780.00 │
│       Efua · SHIP BY 2D    (chip)│
└──────────────────────────────────┘
```

- **Empty (new seller):** "No deals yet. Create your first link and share it on WhatsApp." + [New deal].
- **Desktop:** list on the left (400px), selected deal room on the right, so there's **no sidebar**. The top three money cards sit in one row.

### 4.5 New deal `/seller/deals/new` + share sheet

```
NEW DEAL                          SHARE SHEET (after create)
┌──────────────────────────┐      ┌──────────────────────────┐
│ ← NEW DEAL     PREVIEW ◐ │      │ ────  (drag handle)      │
│                          │      │ YOUR LINK IS READY       │
│ PHOTOS (up to 4)         │      │ hotoso.app/d/7KQ2XM      │
│ [+][img][img][  ]        │      │                          │
│ Drag to reorder          │      │ ┌──────────────────────┐ │
│                          │      │ │ [thumb] Black AF1…   │ │
│ What are you selling?    │      │ │ GHS 456.75 · Protect-│ │  WhatsApp-style
│ [ Black AF1, size 42   ] │      │ │ ed by Hotoso         │ │  link preview
│                          │      │ └──────────────────────┘ │
│ Price                    │      │                          │
│ [GHS| 450.00           ] │      │ [ Share to WhatsApp    ] │  ▓ primary
│ Buyer pays GHS 456.75    │      │ [ Copy link            ] │  secondary 4px
│ (includes 1.5% Hotoso    │      │ Show QR code             │  text link
│ protection)              │      │                          │
│                          │      └──────────────────────────┘
│ You'll ship within       │
│ (•) 3 days  ( ) 2  ( ) 1 │
│                          │
│ Note for the buyer       │
│ [                      ] │
│                          │
│ [ Create deal link     ] │
└──────────────────────────┘
```

- On mobile, **PREVIEW** toggles the WhatsApp-style card. On desktop it shows live on the right.
- Errors appear under each field (e.g. "Minimum is GHS 10").

### 4.6 Dispute flow (buyer), from "Something's wrong with my order"

A full page (not a sheet, because it has steps and photo uploads), with 3 short steps and a 3-segment progress bar.

```
STEP 1 of 3                 STEP 2 of 3                 STEP 3 of 3
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│ ━━━ ─── ───           │   │ ━━━ ━━━ ───           │   │ ━━━ ━━━ ━━━           │
│ WHAT HAPPENED?        │   │ TELL US MORE          │   │ CHECK AND SEND        │
│                       │   │                       │   │                       │
│ ( ) It never arrived  │   │ What's wrong?         │   │ ░ 💰 GHS 450 will stay ░│
│ ( ) It's not what was │   │ [                   ] │   │ ░ frozen with Hotoso  ░│
│     in the photos     │   │ [                   ] │   │ ░ while we review.   ░│
│ ( ) It arrived damaged│   │                       │   │                       │
│ ( ) Something else    │   │ Photos (optional,     │   │ Ama can't be paid and │
│                       │   │ but they help)        │   │ can add her side.     │
│ 💰 Your GHS 450 is     │   │ [+][img][  ]          │   │ We usually decide     │
│    still held safely. │   │                       │   │ within 48 hours.      │
│                       │   │                       │   │                       │
│ [ Next              ] │   │ [ Next              ] │   │ [ Report the problem ]│
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
```

- Reasons map 1:1 to the backend enum (`not_received`, `not_as_described`, `damaged`, `other`) but use plain words.
- After sending, the buyer goes back to the deal room. The HoldStrip is now in `disputed` (clay track, lock icon, "Frozen while we review").
- **Seller side:** the deal room action card shows the buyer's reason + "[Add your side]" (note + photos), using the same Step-2 form.

### 4.7 Landing `/`

```
┌──────────────────────────────────┐
│ ▓          hotoso•        SIGN IN▓│  ink header on ink hero
│ ▓                                ▓│
│ ▓ PAYMENTS HELD      ACCRA·KUMASI ▓│  label-caps eyebrows
│ ▓ SELL TO                        ▓│
│ ▓ STRANGERS.                     ▓│  display-caps, paper on ink
│ ▓ GET PAID LIKE                  ▓│
│ ▓ THEY'RE FAMILY.                ▓│
│ ▓                                ▓│
│ ▓ Buyers pay into Hotoso. You    ▓│  body 16px, left-aligned
│ ▓ ship. We release it to your MoMo▓│
│ ▓ [ Create your first deal ]     ▓│  BUTTER button on ink
│ ▓ See how it works (underline)   ▓│
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                                  │
│ TRY IT: TAP THROUGH              │  interactive HoldStrip demo
│ [Pay][Ship][Confirm][Paid]       │  4 small steps
│ Kwame ○──────●──────○ Ama        │  (coin = the only motion)
│ GHS 450 held safely              │
│                                  │
│ ░░░░░░░░░░░░░░░ ┌──────────────┐ │  colour-block tiles
│ ░ 01 SHARE    ░ │ 02 SHIP      │ │  butter tile / muted tile
│ ░ Send a link ░ │ Once it's    │ │
│ ░ on WhatsApp ░ │ paid, ship.  │ │
│ ░░░░░░░░░░░░░░░ └──────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ 03 GET PAID — buyer confirms │ │
│ │ or 72h passes, money → MoMo  │ │
│ └──────────────────────────────┘ │
│                                  │
│ QUESTIONS                        │  FAQ accordion
│ What if the buyer never     +    │
│ confirms?                        │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ ▓ Your next sale, protected.     ▓│  ink footer CTA
│ ▓ [ Create a deal ]              ▓│
└──────────────────────────────────┘
```

- **Desktop:** the hero is a 2-column layout. The caps headline sits left, and a real deal-page mock (the UI as the illustration, no stock photos) sits right. Tiles go in a 3-column grid.
- A butter button on an ink background follows doc 04: "accent buttons on dark surfaces".

---

## 5. The 3 riskiest UX moments and how the design calms them

**📘 Concept: risky moment.** A point where the user feels most anxious *or* where a mistake costs real money. These deserve more design attention than anything else, because a confused user at these moments leaves (lost sale) or panics (support ticket, lost trust).

### Risk 1: Waiting for the MoMo approval (pay return, "Confirming")
*Why it's scary:* Kwame entered his number, maybe approved a prompt on his phone, and now a page is "thinking". He was scammed for GHS 450 before. Every second feels like his money is vanishing.

How the design calms it:
1. **Say where the money is, not what the system is doing.** "Checking your payment with Paystack" is followed by the HoldStrip with the coin still at **Kwame**. The coin hasn't moved, so the money hasn't moved.
2. **Predict the wait.** At 20s the copy changes to "MoMo approvals can take a minute. Check your phone for a prompt." This tells him what to *do*.
3. **No dead ends.** At 60s: "Your money is safe either way. We'll email you as soon as it's confirmed." + [Check again]. The webhook will still fund the deal even if he closes the tab (M4).
4. **A reference he can quote** (`HTS-PAY-…` in mono) is visible the whole time.
5. **Calm motion:** a slow pulse on the coin only, and none at all if the phone has *reduce motion* on.

### Risk 2: "I got it, release payment" (irreversible)
*Why it's scary:* once released, the money goes to Ama's MoMo and cannot come back. A mis-tap, or releasing *before* checking the item, is permanent.

How the design calms it:
1. **The button only exists when it makes sense** (status `shipped`). There's no release button while the item isn't shipped.
2. **The words name the consequence:** "I got it, release payment", not "Confirm".
3. **A confirmation sheet** repeats amount + person + permanence: "Release GHS 450 to Ama? You can't undo this." The "Yes" button sits where the thumb is, with "Not yet" as an equal-sized secondary option, so backing out is easy.
4. **The quiet alternative is always beside it:** "Something's wrong with my order" (clay text). The buyer sees there's another path before committing.
5. **After release,** the HoldStrip animates the coin to Ama, then shows the `released` state with a date. That's closure, not ambiguity.

### Risk 3: Reporting a problem and the 48h frozen wait (dispute)
*Why it's scary:* the buyer is already upset ("it's not what was in the photos") and fears the system will side with the seller or take forever. The seller fears losing both item and money.

How the design calms it:
1. **Every dispute step repeats where the money is:** "Your GHS 450 is still held safely." Step 3 says it plainly: it will **stay frozen** and *Ama can't be paid*.
2. **Short and forgiving:** 3 steps, plain-word reasons, photos optional ("but they help"). A stressed person shouldn't face a long form.
3. **A promise with a number:** "We usually decide within 48 hours." Then the deal room shows a clay **frozen** HoldStrip with a lock icon, so the state is visible at a glance on every return visit.
4. **Both sides get a voice:** the seller's action card says what was reported and offers "Add your side". Calm, factual copy, no accusations.
5. **The timeline records everything** (reported, photos added, decided), so nobody has to wonder what happened.

*Honourable mentions (handled, but less risky):* the handoff to Paystack's page (we say "You'll finish on Paystack's secure page" before redirecting) and `payout_failed` for the seller (the HoldStrip shows the money still at Hotoso, never "lost").

---

## 6. What happens after you approve

1. I copy the approved rows of §3 into `docs/04-design-system.md`.
2. Phase 2: shadcn install + re-theme with our tokens, custom components, `/styleguide`.
3. Phase 3: screens in the order you listed, with 360px + 1280px Playwright screenshots and a critique after each.

**Open questions for you:**
- Can you add the Mobbin screenshots to `docs/design/references/` so I can complete §1?
- Approve, reject or tweak each row in §3 (T1–T4, R1–R4, S1–S4).
- The Next.js `frontend/` app doesn't exist yet (that's milestone M0). Shall I scaffold it at the start of Phase 2?
