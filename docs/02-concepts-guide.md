# 02 — Concepts Guide (read this before you build)

This is the **learning companion** to the project. Each section explains one idea in plain language, shows where it appears in Hotoso, and ends with **✅ Check yourself** questions. If you can answer them without looking, you understand the concept.

Part A covers payments. Part B covers the tools (Next.js, Django and friends).

---

# Part A — How payments actually work

## A1. What a payment gateway is

When Kwame pays GHS 450 with his card or MoMo wallet, several parties are involved:

```
Kwame ──► Hotoso (merchant) ──► Paystack (gateway / processor)
                                   │
                    ┌──────────────┴───────────────┐
              Card networks                 Mobile money operators
           (Visa, Mastercard)             (MTN MoMo, Telecel Cash…)
                    │                               │
          Kwame's bank (issuer)            Kwame's wallet
```

- **Merchant**: you (Hotoso). You want to receive money.
- **Gateway / processor (Paystack)**: talks to the banks and telcos on your behalf. It handles the dangerous parts: card numbers, PINs, OTPs and fraud checks.
- **Issuer**: Kwame's bank or MoMo operator. It approves or declines the charge.
- **Settlement**: later (usually T+1), Paystack pays the collected money, minus its fee, into your **Paystack balance** or bank account.

**Why you use a gateway instead of handling cards yourself:** storing or even *touching* raw card numbers puts you under **PCI DSS**, a heavy security standard. Paystack collects the card or MoMo details on **its own page or popup**, so card data never touches your server. Your server only ever sees a **reference** and a **status**.

✅ Check yourself: Who approves or declines a charge, Paystack or the issuer? Why should Hotoso never have an `<input>` for card numbers?

## A2. Test mode vs. live mode

Paystack gives you two key pairs:

| Key | Looks like | Where it lives | Can do |
|---|---|---|---|
| Public key | `pk_test_…` | Frontend (safe to expose) | Open the payment popup |
| Secret key | `sk_test_…` | **Backend only**, in `.env`, never committed | Everything: initialize, verify, refund, transfer |

In **test mode**, no real money moves, but the API, webhooks and dashboard behave like live mode. You pay with **test cards** and **test MoMo numbers** (listed in `CLAUDE.md`). This is how you learn for free.

> Getting keys: sign up at paystack.com. Test keys are available in **Settings → API Keys & Webhooks** before the business is verified. Paystack serves specific countries (Ghana, Nigeria, Kenya, South Africa, Côte d'Ivoire and others). Choose Ghana so the GHS and MoMo examples in this project match.

✅ Check yourself: If someone steals your `pk_test` key, what can they do? What about `sk_test`?

## A3. Money is an integer

Never store money as a float. `0.1 + 0.2 = 0.30000000000000004` in most languages.

Paystack (and Hotoso) express amounts in the **smallest currency unit**: **pesewas** for GHS.

- GHS 450.00 → `45000`
- GHS 1.50 → `150`

In Django, use `PositiveBigIntegerField` named `*_minor` (for example `amount_minor`). Convert to "GHS 450.00" **only for display**, in one formatting helper.

✅ Check yourself: Paystack sends `amount: 45675` for a GHS transaction. What does the UI show?

## A4. The life of one payment

```
1. INITIALIZE   Backend → Paystack: "I want to collect 45675 pesewas from kwame@x.com,
                reference HTS-PAY-8F2K..." ← Paystack returns authorization_url + access_code
2. AUTHORIZE    Buyer is sent to Paystack's page/popup, enters MoMo/card, approves on phone
3. RETURN       Paystack redirects the browser to your callback_url?reference=HTS-PAY-8F2K...
4. CONFIRM      Your backend learns the truth, by
                   (a) WEBHOOK  charge.success  (Paystack → your server), and/or
                   (b) VERIFY   GET /transaction/verify/:reference (your server → Paystack)
5. FULFIL       Only now: deal.status = funded, notify seller to ship
6. SETTLE       Days later, Paystack settles the money to your balance
```

The **reference** is a unique ID that *you* generate. It's how both sides agree on which payment you're talking about.

✅ Check yourself: At which step is it first safe to tell the seller "ship now"?

## A5. Never trust the browser ⚠️ (the most important rule)

After payment, the browser lands on `/pay/return?reference=…`. **This proves nothing.** Anyone can type that URL. Browsers close, networks drop, and users press back.

**The rule:** The deal becomes `funded` only when **your backend** has confirmed with Paystack, through a verified webhook or a server-side verify call, that:

1. `status == "success"`
2. `amount == expected amount` (in pesewas)
3. `currency == "GHS"`
4. `reference` matches a Payment you created

Check 2 matters. An attacker could start a transaction for GHS 1 using your public key, then try to attach that reference to a GHS 4,000 deal. Comparing amounts blocks this.

✅ Check yourself: The return page loads with a valid reference, but the webhook hasn't arrived yet. What should the UI show? (Answer: a "confirming with Paystack…" state that polls the backend, which calls verify.)

## A6. Webhooks

A **webhook** is Paystack calling *your* server when something happens: `charge.success`, `transfer.success`, `refund.processed`, and so on. It's the most reliable signal because it doesn't depend on the buyer's browser.

How to handle them correctly:

1. **Verify the signature.** Paystack sends header `x-paystack-signature` = HMAC-SHA512 of the **raw request body**, keyed with your **secret key**. Recompute it and compare with `hmac.compare_digest`. If it doesn't match, return `401` and do nothing. (This is why the webhook view must read `request.body` before any JSON parsing changes it.)
2. **Respond 200 quickly.** If you don't return 200, Paystack retries (in test mode, hourly for up to 72 hours). Do the heavy work after acknowledging, or keep it fast.
3. **Expect duplicates.** Retries mean the same event can arrive twice. Store each event and skip any you've already processed. This is **idempotency** (A7).
4. **Don't assume order.** `transfer.success` could, in theory, arrive after you've already verified it some other way. Your handlers must work from the current state.
5. **Re-verify anyway.** For `charge.success`, many teams still call the verify endpoint before fulfilling. Hotoso does, because it's cheap insurance.
6. **Local development:** Paystack can't reach `localhost`. Use a tunnel (`ngrok http 8000` or `cloudflared tunnel --url http://localhost:8000`) and paste the public URL into **Paystack Dashboard → Settings → API Keys & Webhooks → Test Webhook URL**.

✅ Check yourself: Why do we sign with the *secret* key and not the public one? What happens if your webhook view returns 500 every time?

## A7. Idempotency: "doing it twice = doing it once"

Payments are full of retries: webhook retries, double-clicks, the verify call and the webhook racing each other. Every money-moving operation must be safe to repeat.

How Hotoso stays idempotent:

| Risk | Defence |
|---|---|
| Same webhook delivered twice | `WebhookEvent` table with a **unique** fingerprint, so a second insert fails and the event is skipped |
| Webhook and verify call both try to fund the deal | One function, `confirm_payment(reference)`, inside `transaction.atomic()` with `select_for_update()` on the Payment row. The second caller sees the status is already `success` and returns. |
| Release button double-clicked | The state machine only allows `shipped → releasing` once, and the Payout has a **unique reference** per deal |
| Transfer request retried after a timeout | The same `reference` is sent to Paystack, which rejects duplicates |

✅ Check yourself: Two requests call `confirm_payment` at the same millisecond. Walk through what `select_for_update()` does.

## A8. State machines

A Hotoso deal isn't "a row with some booleans". It's a **state machine**: a fixed set of states with explicitly allowed transitions. That's what keeps money bugs out.

```
awaiting_payment ─pay─► funded ─ship─► shipped ─confirm / timer─► releasing ─transfer.success─► released
       │                  │               │                          │
    cancel           cancel / no-ship   dispute                transfer.failed
       ▼                  ▼               ▼                          ▼
   cancelled         refunding ◄──── disputed ──admin: release──► releasing
                          │                                    payout_failed ─retry─► releasing
                   refund.processed
                          ▼
                       refunded
```

All transitions go through **one service function**, `transition(deal, to_state, actor, **data)`. It checks the allowed-transitions table, writes a `DealEvent` (audit trail) and saves, all in one database transaction. Views never set `deal.status = …` directly.

✅ Check yourself: Can a deal go from `disputed` to `released` without passing through `releasing`? Why does that matter?

## A9. Ledger (double-entry, lite)

Status fields tell you *where a deal is*. A **ledger** tells you *where the money is*. Every movement is recorded as entries that balance (total debits = total credits):

| Event | Debit | Credit | Amount |
|---|---|---|---|
| Buyer pays 45,675 | `paystack_clearing` | `escrow_hold` | 45,000 |
| | `paystack_clearing` | `hotoso_fees` | 675 |
| Release to seller | `escrow_hold` | `seller_payable` | 45,000 |
| Transfer succeeds | `seller_payable` | `paystack_clearing` | 45,000 |

If at any moment `escrow_hold` doesn't equal the sum of all funded-but-unreleased deals, you have a bug, and the ledger tells you where. Real fintechs live by this.

✅ Check yourself: After a full refund, what should the `escrow_hold` balance be for that deal?

## A10. Escrow, transfers and refunds

- **Collection**: buyer → Hotoso's Paystack balance (A4).
- **Transfer (payout)**: Hotoso's balance → the seller's MoMo. It has two steps:
  1. Create a **transfer recipient** once per seller (`type: mobile_money`, `bank_code: MTN`, `account_number: 0551234987`, `currency: GHS`), then store the `recipient_code`.
  2. `POST /transfer` with `source: balance`, `amount`, `recipient`, `reference` and `reason`. The result arrives by webhook: `transfer.success`, `transfer.failed` or `transfer.reversed`.
- **Refund**: `POST /refund` with the original transaction reference. The result arrives by webhook: `refund.pending`, `refund.processed` or `refund.failed`.

> **Test mode note:** test-mode transfers can be limited by test balance or account setup. Hotoso has a `PAYOUT_MODE` setting: `paystack` calls the real test API, and `simulate` fakes a `transfer.success` after a few seconds. The rest of the app behaves the same either way. That's also a useful design lesson: **put external services behind an interface** (`PayoutProvider`).

✅ Check yourself: Why store `recipient_code` instead of creating a recipient on every payout?

## A11. Timers and background jobs

"Auto-release after 72 hours" means something has to *wake up later*. A web request can't wait 72 hours. Options, from simple to robust:

1. **Management command and a loop or cron**: `python manage.py run_deal_timers` every minute finds deals where `auto_release_at <= now()` and releases them. (MVP)
2. **Celery + Redis + Celery Beat**: a proper task queue for timers, sending emails and processing webhooks after acknowledging them. (Milestone 6)

Either way, timer jobs **must be idempotent** (A7). If one runs twice, nothing bad may happen.

## A12. Security checklist for payment apps

- [ ] Secret key only in backend env vars. `.env` is in `.gitignore`.
- [ ] Webhook signature verified on the raw body with constant-time compare.
- [ ] Amount, currency and reference verified before fulfilment.
- [ ] All money is integers in minor units.
- [ ] State changes only through `transition()`, inside DB transactions.
- [ ] Every money action writes an audit event (who, what, when).
- [ ] Buyer deal-room links use long random tokens (≥ 32 bytes, `secrets.token_urlsafe`).
- [ ] Rate-limit public endpoints (deal page, payment init).
- [ ] Never log full webhook payloads containing customer PII in production.

---

# Part B — The tools

## B1. Architecture at a glance

```
Browser ──► Next.js (localhost:3000)
              │  pages, UI, server components
              │  /api/* is rewritten (proxied) to ▼
              ▼
            Django + DRF (localhost:8000) ──► PostgreSQL
              │   business logic, payments, auth      ▲
              │                                        │
              ├──► Paystack API (initialize, verify, transfer, refund)
              ◄─── Paystack webhooks (through an ngrok/cloudflared tunnel in dev)
              └──► Redis + Celery (later milestone)
```

**Why two frameworks?** Next.js is excellent at UI (fast pages, good developer experience, SEO for the public deal pages). Django is excellent at data and business logic (ORM, migrations, a free admin panel, mature security). Keeping **all money logic in Django** means there's one place to audit.

## B2. Next.js (App Router)

| Concept | What it means | In Hotoso |
|---|---|---|
| **App Router** | Folders in `app/` become URLs. `app/d/[slug]/page.tsx` → `/d/abc123` | Every screen |
| **Server Components** (default) | Run on the server, can fetch data directly, ship no JS to the browser | Public deal page (fast on cheap phones) |
| **Client Components** (`"use client"`) | Run in the browser, can use state, effects and click handlers | Pay button, forms, polling the "confirming" state |
| **Route params / searchParams** | `[slug]` and `?reference=` values | `/pay/return?reference=…` |
| **`rewrites` in `next.config.ts`** | Proxy `/api/*` to Django so the browser sees **one origin**. No CORS problems, and cookies just work. | All API calls |
| **`generateMetadata`** | Per-page `<title>` and Open Graph tags | Deal links show a rich preview in WhatsApp |
| **`next/font`** | Self-hosts fonts with no layout shift | Fraunces + Geist |
| **Env vars** | Only `NEXT_PUBLIC_*` reach the browser | `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is fine. The secret key must **never** be here. |

✅ Check yourself: Should the Pay button be a server or a client component? Why?

## B3. Django

| Concept | What it means | In Hotoso |
|---|---|---|
| **Project vs. apps** | A project holds settings. Apps are feature modules. | `config/` + apps `accounts`, `deals`, `payments`, `disputes`, `ledger` |
| **Models + ORM** | Python classes become tables, and queries are written in Python | `Deal`, `Payment`, `Payout`… |
| **Migrations** | Versioned schema changes: `makemigrations`, then `migrate` | Every model change |
| **Admin** | An auto-generated back-office | The dispute queue for ops (customised) |
| **`transaction.atomic` / `select_for_update`** | All-or-nothing writes and row locks | `confirm_payment`, `transition` |
| **Settings from env** | `django-environ` reads `.env` | Keys, DB URL, `PAYOUT_MODE` |
| **Management commands** | Custom `manage.py` scripts | `run_deal_timers` |

## B4. Django REST Framework (DRF)

| Concept | What it does |
|---|---|
| **Serializer** | Converts model ↔ JSON and validates input (like a form for APIs) |
| **APIView / ViewSet** | Handles HTTP methods for a resource |
| **Permissions** | "Only the seller of this deal can mark it shipped" |
| **Throttling** | Rate limits on public endpoints |

Rule for Hotoso: **views stay thin.** Views validate input and call a **service** function (`deals/services.py`). Services hold the logic and are what you unit-test.

## B5. Authentication (session auth through the proxy)

Because Next.js proxies `/api/*` to Django, the browser thinks everything is one site. So Hotoso uses plain **Django session cookies** (`httpOnly`, `SameSite=Lax`) plus **CSRF tokens** for unsafe methods. That's simpler and safer than storing JWTs in localStorage. Buyers don't log in. They use a secret **deal-room token** in their link.

✅ Check yourself: Why is a JWT in `localStorage` risky if your site has an XSS bug?

## B6. PostgreSQL, Redis, Celery, Docker

- **PostgreSQL**: the main database. Use it from day one, not SQLite, because `select_for_update` and real concurrency behave differently in SQLite.
- **Redis**: an in-memory store, used as Celery's message broker.
- **Celery / Celery Beat**: workers that run background tasks and scheduled tasks.
- **Docker Compose**: one command starts Postgres and Redis locally.

## B7. Tailwind CSS + design tokens

Tailwind gives you utility classes (`px-4 rounded-lg`). **Design tokens** (colors, spacing, radii and type sizes defined once as CSS variables) make the UI consistent and stop it looking generic. See `04-design-system.md`.

---

## Glossary

**Access code**: the Paystack token used to resume a transaction in the popup. **Authorization URL**: Paystack's hosted payment page. **Callback URL**: where Paystack sends the browser after payment. **Escrow**: a neutral party holds funds until conditions are met. **HMAC**: a keyed hash that proves who sent a message. **Idempotent**: safe to repeat. **Minor units**: the smallest currency unit (pesewas). **Recipient code**: Paystack's ID for a payout destination. **Reference**: your unique ID for a transaction. **Settlement**: the gateway paying out collected funds to you. **Webhook**: a server-to-server HTTP notification.
