# 05 — Build Plan (milestones + learning checkpoints)

Build **one milestone at a time**. At the end of each one, stop, run the demo, and answer the 🎓 questions in your own words before moving on. Ask Claude Code to *explain* any code you don't understand. The goal is that you could rebuild this without help.

---

## M0 — Setup (½ day)
- Create a Paystack account (choose Ghana) and copy the **test** secret and public keys.
- Install Python 3.12+, Node 20+, Docker Desktop, and ngrok or cloudflared.
- Monorepo skeleton: `backend/` (Django 5, DRF, django-environ, psycopg, pytest-django) and `frontend/` (Next.js, TypeScript, Tailwind, ESLint).
- `docker-compose.yml` with Postgres 16 (and Redis 7 for later).
- Next.js `rewrites` from `/api/:path*` to `http://localhost:8000/api/:path*`.
- **Demo:** `localhost:3000` shows a page that fetches `/api/health/` from Django.
- 🎓 Why does the rewrite remove the need for CORS? What is in `.gitignore` and why?

## M1 — Design foundation (1 day)
- Tokens in `globals.css` and Tailwind (doc 04 §3), fonts with `next/font`.
- Components: `Button`, `Input`, `MoneyInput`, `PhoneInput`, `StatusChip`, `ReceiptCard`, `HoldStrip`, `TrustBlock`, `Timeline`, `Sheet`, `Skeleton`.
- A `/styleguide` page showing every component in every state (HoldStrip in every deal status from doc 03 §3).
- **Demo:** the styleguide at 360px and 1280px.
- 🎓 What's a design token, and what breaks if you hardcode hex values?

## M2 — Accounts & deals, no money yet (1–2 days)
- Custom User, SellerProfile, session auth + CSRF, signup, login and payout-details screens.
- `Deal`, `DealImage` and `DealEvent` models, fee calculation (`common/money.py`) with tests.
- `deals/state.py`: `ALLOWED` and `transition()`, with tests for **every** allowed and forbidden move.
- Seller: create a deal, then the share sheet. Public `/d/[slug]` page with OG image (pay button disabled).
- **Demo:** create a deal and paste the link into WhatsApp Web to see the preview.
- 🎓 Why does all status-changing go through `transition()`? What does `select_for_update` lock?

## M3 — Collecting payments ⭐ (2 days)
- `payments/paystack.py`: a thin client (`initialize`, `verify`, `create_recipient`, `transfer`, `refund`) using `httpx`, with timeouts and error types.
- The `Payment` model, `POST deals/{slug}/pay/` → initialize → return `authorization_url`.
- `confirm_payment(reference)` with every check from doc 03 §4.1, plus tests (success, amount mismatch, double call).
- `/pay/return` page with polling and its 3 states. `GET payments/{ref}/status/`.
- Ledger posting on funding.
- **Demo:** pay with test card `4084 0840 8408 4081` and with MoMo `0551234987`. The deal becomes **funded**. Then try the declined card `4084 0800 0000 5408`.
- 🎓 Explain the reference's job. What would happen if you skipped the amount check?

## M4 — Webhooks ⭐ (1 day)
- `WebhookEvent` model and a signed endpoint (doc 03 §4.4), with tests for valid, invalid and duplicate events.
- Run a tunnel and set the test webhook URL in the Paystack dashboard.
- Make the webhook the main path. Polling and verify remain the fallback.
- A management command `replay_webhook <id>` for debugging.
- **Demo:** pay, close the browser tab *before* returning, and the deal still becomes funded (via the webhook). Then re-send the webhook from the dashboard and see that nothing happens twice.
- 🎓 Why must you use the raw body for the signature? What makes the handler idempotent?

## M5 — Ship, release, payout ⭐ (2 days)
- Mark shipped (with proof upload), `auto_release_at`, the buyer deal room with token access, and "I got it".
- `PayoutProvider` interface with `Simulated` and `Paystack` implementations, chosen by `PAYOUT_MODE`.
- Recipient creation (cached), transfer, and the `transfer.*` webhook handlers. Handle `payout_failed` and admin retry.
- `run_deal_timers` command: auto-release, plus ship-by expiry (which enables buyer cancel).
- Seller home with money totals and tabs.
- **Demo:** a full happy path, buyer pays → seller ships → buyer confirms → released. Then the timer path, with `AUTO_RELEASE_HOURS` set to 0.05 in dev.
- 🎓 Why is the payout reference deterministic? What happens if the transfer webhook never comes?

## M6 — Disputes & refunds (1–2 days)
- Dispute model and evidence, buyer dispute flow, seller evidence upload.
- Refund service + `refund.*` webhooks (test cards `4084 0800 0067 1803` and `…1902` exercise the failure paths).
- Django admin: a dispute queue with the timeline inline and actions **Refund buyer** / **Release to seller** that call the services.
- **Demo:** dispute → admin refund → the deal shows *Refunded* and the ledger nets to zero.
- 🎓 Why does a dispute clear `auto_release_at`? Walk through the ledger entries for a refund.

## M7 — Background jobs & polish (1–2 days)
- Celery + Redis + Beat. Move `run_deal_timers` and emails into tasks. Webhook processing runs async after the 200.
- Transactional emails (console backend in dev): receipt, ship now, shipped, release reminder, released, refunded.
- Rate limiting and a security pass (doc 02 §A12 checklist).
- Empty, loading and error states on every screen. A Lighthouse pass on `/d/[slug]` (aim for ≥ 90 on mobile performance and accessibility).
- Landing page with the interactive Hold Strip demo.
- **Demo:** a full walkthrough of all paths, recorded.

## Stretch ideas (after MVP)
- Paystack Inline popup instead of redirect.
- Split payments with Paystack **subaccounts** (an alternative payout model, worth comparing with escrow).
- Seller public profile `/@handle` with completed-deal history.
- Partial refunds, and multiple items per deal.
- SMS notifications (Hubtel or Arkesel sandbox).
- Deploy: Vercel (frontend) + Render or Railway (Django + Postgres), still on test keys.

---

## How to work with Claude Code on this
1. Put `CLAUDE.md` at the repo root and these docs in `docs/`.
2. Start each session with: *"Read CLAUDE.md and docs/05-build-plan.md. We're on milestone M3. Plan it first, then implement step by step, and explain each payment-related decision as you go."*
3. After each milestone: *"Quiz me on the 🎓 questions for M3, then review my answers."*
4. When something breaks, ask *"why"* before *"fix"*.
