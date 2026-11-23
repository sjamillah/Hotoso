# CLAUDE.md — Hotoso

**Hotoso** is a payment-hold (escrow-style) link for social-commerce sellers in Ghana. A buyer pays through Paystack, the money is held by Hotoso, and it's released to the seller's MoMo when the buyer confirms receipt (or automatically after 72h), or refunded if a dispute is upheld.

This is a **learning project**. The developer is building their first payment integration. **Explain payment-related decisions as you make them**, keep code readable over clever, and pause at the end of each milestone for the 🎓 questions.

## Read first
- `docs/01-product-brief.md`: what we're building and why
- `docs/02-concepts-guide.md`: payment and stack concepts (refer to these sections when explaining)
- `docs/03-architecture.md`: models, state machine, flows, API (**source of truth**)
- `docs/04-design-system.md`: tokens, components, screens (**follow exactly**)
- `docs/05-build-plan.md`: milestones. Work on **one milestone at a time.**

## Stack
- `backend/`: Django 6.1, Django REST Framework, PostgreSQL 16, django-environ, httpx, pytest-django. Celery + Redis from M7.
- `frontend/`: Next.js (App Router, TypeScript, strict), Tailwind CSS, `next/font` (Fraunces, Geist, Geist Mono).
- Next.js rewrites `/api/:path*` → Django. Auth is Django session cookies + CSRF. No JWT.
- Paystack in **TEST MODE ONLY**. Currency GHS.

## Commands
```bash
docker compose up -d                                  # postgres (+ redis)
cd backend && python manage.py runserver 8000
cd backend && pytest
cd backend && python manage.py run_deal_timers        # auto-release / ship-by expiry loop
cd frontend && npm run dev                            # localhost:3000
ngrok http 8000                                       # webhook tunnel → Paystack dashboard test webhook URL
```

## Non-negotiable rules (money safety)
1. **Money is an integer in pesewas** (`*_minor`, `PositiveBigIntegerField`). Never use floats. Format only in `common/money.py` and `frontend/lib/money.ts`.
2. **Never trust the browser.** A deal becomes `funded` only via `payments.services.confirm_payment(reference)`, which verifies with Paystack and checks `status == success`, **amount**, **currency** and reference.
3. **Every status change goes through `deals.state.transition()`**, inside `transaction.atomic()`, with the deal row locked by `select_for_update()`. Views never assign `deal.status`.
4. **Webhooks:** verify the HMAC-SHA512 of the **raw body** with `PAYSTACK_SECRET_KEY`, using `hmac.compare_digest`. Store the event in `WebhookEvent` (unique fingerprint). Duplicates return 200 and do nothing. Unknown events return 200.
5. **Idempotency everywhere:** unique references (`HTS-PAY-{ulid}`, `HTS-OUT-{slug}`), and handlers safe to run twice.
6. **Secret key lives only in `backend/.env`.** Never in the frontend, logs, fixtures or commits.
7. External money calls go through providers (`PayoutProvider`, `RefundProvider`) with `simulate` and `paystack` implementations, chosen by `PAYOUT_MODE` / `REFUND_MODE`.
8. Every money action writes a `DealEvent` and balanced `LedgerEntry` rows.
9. Paystack HTTP is **mocked in tests**. Tests never hit the network.

## Code conventions
- Django apps: `accounts`, `deals`, `payments`, `disputes`, `ledger`, `common`. Business logic goes in `services.py`. Views are thin.
- API errors: `{"error": {"code": "...", "message": "..."}}`.
- Frontend: Server Components by default. Use `"use client"` only for interactivity. Typed API client in `frontend/lib/api.ts`.
- **Brand palette:** Black Olive `#282C20` (ink), Alabaster `#E8E5D8` (paper), Butterlight `#E8CA78` (safe-money accent; never as text on paper). Full token list in doc 04 §3.1.
- **UI: use design tokens only** (no raw hex, no arbitrary Tailwind colors). Every screen has loading, empty and error states. Mobile-first at 360px.
- Copy follows the voice in doc 04 §2. Plain language, no jargon like "escrow" in buyer-facing UI.

## Paystack test data
- Success card: `4084 0840 8408 4081`, CVV `408`, any future expiry
- PIN + OTP card: `5060 6666 6666 6666 666`, CVV `123`, PIN `1234`, OTP `123456`
- Declined card: `4084 0800 0000 5408`, CVV `001`
- Refund-fails card: `4084 0800 0067 1803`, CVV `180`. Refund-needs-attention card: `4084 0800 0067 1902`, CVV `190`
- MoMo (MTN, no PIN/OTP): `0551234987`
- Docs: https://paystack.com/docs/payments/test-payments/ · https://paystack.com/docs/payments/webhooks/ · https://paystack.com/docs/transfers/creating-transfer-recipients/

## When unsure
Check `docs/03-architecture.md` first. If the docs don't cover something, ask the developer rather than inventing payment behaviour.
