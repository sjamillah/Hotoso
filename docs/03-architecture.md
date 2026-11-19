# 03 — Architecture & Technical Spec

## 1. Repository layout (monorepo)

```
hotoso/
├── CLAUDE.md
├── docs/                       # these documents
├── docker-compose.yml          # postgres:16, redis:7
├── backend/                    # Django 5 + DRF
│   ├── manage.py
│   ├── config/                 # settings.py, urls.py, celery.py (M6)
│   ├── accounts/               # User, SellerProfile, auth endpoints
│   ├── deals/                  # Deal, DealEvent, state machine, services
│   ├── payments/               # Payment, Payout, Refund, WebhookEvent, paystack client
│   ├── disputes/               # Dispute, evidence, admin actions
│   ├── ledger/                 # LedgerEntry + posting helpers
│   └── common/                 # money helpers, tokens, base models
└── frontend/                   # Next.js 15+, App Router, TypeScript, Tailwind
    ├── app/
    ├── components/
    ├── lib/                    # api client, money formatting, types
    └── next.config.ts          # rewrites /api/* → http://localhost:8000/api/*
```

## 2. Data model

All models extend `TimeStampedModel` (`created_at`, `updated_at`). Primary keys are UUIDs. All money fields are `PositiveBigIntegerField` in **pesewas**.

### accounts
**User** (custom `AbstractUser`, login by email)
- `email` (unique), `phone`, `full_name`

**SellerProfile** (1:1 User)
- `display_name`, `handle` (unique slug, e.g. `ama.kicks`), `bio`, `avatar`, `instagram_handle`
- `payout_momo_number`, `payout_telco` (`MTN` | `VOD` | `ATL`; get codes from `GET /bank?currency=GHS&type=mobile_money`. Telecel may still use Vodafone's code)
- `paystack_recipient_code` (nullable, set once)
- Derived stats (computed or cached): `deals_completed`, `dispute_rate`, `member_since`

### deals
**Deal**
- `slug` (short public ID, 8 chars, unique), `seller` FK
- `title`, `description`, `images` (up to 4 via `DealImage`), `category` (a code from doc 08 §1)
- `item_amount_minor`, `fee_minor`, `total_minor` (= item + fee, stored for audit), `currency` = `GHS`
- `status` (enum, see §3), `ship_by` (datetime), `auto_release_at` (nullable)
- Buyer (guest): `buyer_email`, `buyer_phone`, `buyer_name`, `buyer_token` (random, unique, indexed)
- `funded_at`, `shipped_at`, `released_at`, `refunded_at`, `cancelled_at`
- `shipping_note`, `shipping_proof` (image, optional)

**DealEvent** (append-only audit trail, which also powers the UI timeline)
- `deal` FK, `type` (e.g. `created`, `payment_confirmed`, `shipped`, `buyer_confirmed`, `auto_released`, `dispute_opened`, `refund_processed`…), `from_status`, `to_status`, `actor_type` (`seller` | `buyer` | `admin` | `system` | `paystack`), `actor_user` (nullable), `data` (JSON)

### payments
**Payment** (one deal may have several attempts, but only one `success`)
- `deal` FK, `reference` (unique, e.g. `HTS-PAY-{ulid}`), `amount_minor`, `currency`
- `status`: `initialized` | `success` | `failed` | `abandoned`
- `paystack_access_code`, `paystack_transaction_id`, `channel`, `paid_at`, `gateway_response` (JSON)

**Payout**
- `deal` 1:1, `reference` (unique `HTS-OUT-{deal.slug}`, which is deterministic and so idempotent), `amount_minor`, `recipient_code`
- `status`: `pending` | `success` | `failed` | `reversed`, `transfer_code`, `failure_reason`, `attempts`

**Refund**
- `deal` FK, `payment` FK, `amount_minor`, `paystack_refund_id`, `status`: `pending` | `processing` | `processed` | `failed`, `reason`

**WebhookEvent** (idempotency + debugging)
- `fingerprint` (unique, SHA-256 of the raw body), `event` (e.g. `charge.success`), `payload` (JSON), `received_at`, `processed_at`, `error`

### disputes
**Dispute**
- `deal` 1:1, `reason` (`not_received` | `not_as_described` | `damaged` | `other`), `details`
- `status`: `open` | `resolved_refund` | `resolved_release`, `resolution_note`, `resolved_by` FK User, `resolved_at`

**DisputeEvidence**: `dispute` FK, `submitted_by` (`buyer` | `seller`), `image`, `note`

### ledger
**LedgerEntry**
- `deal` FK, `account` (`paystack_clearing` | `escrow_hold` | `hotoso_fees` | `seller_payable` | `refunds`), `direction` (`debit` | `credit`), `amount_minor`, `memo`, `posted_at`
- Entries are written in balanced groups by `ledger.post(deal, [(debit_acct, credit_acct, amount), …])`.

## 3. Deal state machine

| From | To | Triggered by | Side effects |
|---|---|---|---|
| — | `awaiting_payment` | Seller creates deal | `DealEvent created` |
| `awaiting_payment` | `funded` | `confirm_payment()` (webhook or verify) | `funded_at`, `ship_by = now + 3d`, ledger post, email seller "Ship now" + buyer receipt |
| `awaiting_payment` | `cancelled` | Seller cancels | — |
| `funded` | `shipped` | Seller marks shipped | `shipped_at`, `auto_release_at = now + CATEGORY_RULES[deal.category].inspection_hours` (48h or 72h, doc 08), email buyer |
| `funded` | `refunding` | Buyer cancels after `ship_by` passed, or seller cancels | Create Refund → Paystack |
| `funded` / `shipped` | `disputed` | Buyer opens dispute | Clear `auto_release_at`, email seller + admin |
| `shipped` | `releasing` | Buyer confirms, or timer hits `auto_release_at` | Ledger hold → payable, create Payout → transfer |
| `disputed` | `releasing` | Admin resolves for seller | Same as above |
| `disputed` | `refunding` | Admin resolves for buyer | Create Refund → Paystack |
| `releasing` | `released` | `transfer.success` (or simulate) | `released_at`, ledger, email both |
| `releasing` | `payout_failed` | `transfer.failed` / `transfer.reversed` | Alert admin |
| `payout_failed` | `releasing` | Admin retries | New transfer attempt (same reference rules) |
| `refunding` | `refunded` | `refund.processed` | `refunded_at`, ledger, email both |

Implement this as `ALLOWED = {from: {to, …}}` in `deals/state.py` and **one** function:

```python
def transition(deal: Deal, to: str, *, actor_type: str, actor_user=None, event: str, data=None) -> Deal:
    # must be called inside transaction.atomic() with the deal row locked (select_for_update)
    # raises InvalidTransition if `to` not in ALLOWED[deal.status]
```

## 4. Payment flows

### 4.1 Collect (buyer pays)

```mermaid
sequenceDiagram
  participant B as Buyer browser
  participant N as Next.js
  participant D as Django
  participant P as Paystack
  B->>N: Open /d/{slug}, tap "Pay GHS 456.75"
  N->>D: POST /api/deals/{slug}/pay {email, phone, name}
  D->>D: Create Payment(reference, amount=total_minor, initialized)
  D->>P: POST /transaction/initialize {email, amount, currency:GHS, reference, callback_url, channels, metadata.deal_id}
  P-->>D: {authorization_url, access_code}
  D-->>B: {authorization_url}
  B->>P: Redirect, pays with MoMo/card
  P-->>B: Redirect to /pay/return?reference=…
  P->>D: Webhook charge.success (signed)
  D->>D: verify signature → store WebhookEvent → confirm_payment(ref)
  B->>D: Poll GET /api/payments/{ref}/status (calls verify if still pending)
  D-->>B: {status: success, deal_room_url}
```

**`confirm_payment(reference)`** in `payments/services.py`:
1. `with transaction.atomic():` lock the Payment with `select_for_update()`. If it's already `success`, return (idempotent).
2. `GET /transaction/verify/{reference}`.
3. Assert `data.status == "success"`, `data.amount == payment.amount_minor` and `data.currency == "GHS"`. On a mismatch, mark it failed, log, and **don't fund**.
4. Update the Payment, lock the Deal, and call `transition(deal, "funded", actor_type="paystack", event="payment_confirmed")`.
5. Post to the ledger and queue emails (after commit, using `transaction.on_commit`).

MVP uses the **redirect** flow. An optional enhancement is the Paystack Inline popup (`@paystack/inline-js`, resuming the transaction with `access_code`). The backend stays the same.

### 4.2 Release (payout)

`release_deal(deal, actor)` → `transition(→ releasing)` → ledger `escrow_hold → seller_payable` → `PayoutProvider.send(payout)`:
- `PaystackPayoutProvider`: ensures the recipient exists (creates one and caches `recipient_code`), then `POST /transfer {source:"balance", amount, recipient, reference, reason}`.
- `SimulatedPayoutProvider`: schedules a fake `transfer.success` handling after about 5 seconds (it calls the same handler the webhook uses).

Selected by the setting `PAYOUT_MODE=simulate|paystack`.

### 4.3 Refund

`refund_deal(deal, actor, reason)` → `transition(→ refunding)` → `POST /refund {transaction: payment.reference}` → webhook `refund.processed` → `transition(→ refunded)`. Add a `REFUND_MODE` toggle with the same simulate pattern.

### 4.4 Webhook endpoint

`POST /api/webhooks/paystack/` (CSRF-exempt, no auth, signature required):

```python
raw = request.body
expected = hmac.new(settings.PAYSTACK_SECRET_KEY.encode(), raw, hashlib.sha512).hexdigest()
if not hmac.compare_digest(expected, request.headers.get("x-paystack-signature", "")):
    return HttpResponse(status=401)
fingerprint = sha256(raw)
event, created = WebhookEvent.objects.get_or_create(fingerprint=fingerprint, defaults={...})
if not created and event.processed_at:
    return HttpResponse(status=200)          # duplicate: acknowledge, do nothing
dispatch(event)                               # charge.success | transfer.* | refund.*
return HttpResponse(status=200)
```

Handlers: `charge.success` → `confirm_payment`. `transfer.success|failed|reversed` → look up the Payout by `data.reference`. `refund.processed|failed` → look up the Refund by its transaction reference or ID. Unknown events → store and return 200.

## 5. REST API

Base path: `/api/`. JSON. Session auth for sellers and admins. Buyer endpoints take `?t={buyer_token}`.

| Method | Path | Who | Purpose |
|---|---|---|---|
| POST | `auth/signup/` · `auth/login/` · `auth/logout/` | public | Session auth |
| GET | `auth/me/` · `auth/csrf/` | any | Current user, CSRF cookie |
| GET/PUT | `seller/profile/` | seller | Profile + payout MoMo |
| GET | `seller/summary/` | seller | `{held_minor, released_minor, counts_by_status}` |
| GET/POST | `seller/deals/` | seller | List (filter `?status=`) / create |
| GET | `seller/deals/{slug}/` | seller | Detail + events |
| POST | `seller/deals/{slug}/ship/` | seller | Mark shipped (multipart: note, proof) |
| POST | `seller/deals/{slug}/cancel/` | seller | Cancel |
| GET | `deals/{slug}/` | public | Public deal page data + seller trust stats (no buyer PII) |
| POST | `deals/{slug}/pay/` | public | Init payment → `{authorization_url, reference}` |
| GET | `payments/{reference}/status/` | public | Poll; verifies with Paystack if pending → `{status, deal_room_url?}` |
| GET | `room/{slug}/?t=` | buyer | Deal room detail + timeline |
| POST | `room/{slug}/confirm/?t=` | buyer | "I got it" → release |
| POST | `room/{slug}/dispute/?t=` | buyer | Open dispute (multipart) |
| POST | `room/{slug}/cancel/?t=` | buyer | Cancel if `ship_by` passed and not shipped |
| POST | `webhooks/paystack/` | Paystack | Webhook |

Admin actions (resolve dispute, retry payout) live in the **Django admin** as custom actions that call the same services.

Error shape: `{"error": {"code": "invalid_transition", "message": "…"}}`.

## 6. Configuration (`backend/.env`)

```
DJANGO_SECRET_KEY=…
DATABASE_URL=postgres://hotoso:hotoso@localhost:5432/hotoso
PAYSTACK_SECRET_KEY=sk_test_…
PAYSTACK_BASE_URL=https://api.paystack.co
FRONTEND_URL=http://localhost:3000
PAYOUT_MODE=simulate          # or paystack
REFUND_MODE=paystack          # or simulate
HOTOSO_FEE_BPS=150              # 1.5%
HOTOSO_FEE_MIN_MINOR=100
HOTOSO_FEE_MAX_MINOR=5000
SHIP_WITHIN_HOURS=72
AUTO_RELEASE_HOURS=72
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

`frontend/.env.local`: `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_…` (only needed for the popup enhancement) and `API_ORIGIN=http://localhost:8000`.

## 7. Testing strategy

- **Unit tests (pytest-django):** fee calculation, every allowed and forbidden transition, `confirm_payment` (success, amount mismatch, duplicate call), webhook signature (valid, invalid, missing), duplicate webhook, release and refund paths with mocked providers.
- **Paystack HTTP mocked** with `responses` or `respx`. No network in tests.
- **Manual end-to-end in test mode:** create a deal, pay with test card `4084 0840 8408 4081` (CVV 408, any future expiry) and with MoMo `0551234987` (MTN), ship, confirm, and watch the payout.
- **Frontend:** Playwright smoke test of create deal → pay page renders, plus component checks of the status UI across all states.
