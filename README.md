# Hotoso: payment-hold links for social commerce

*Hotoso* (ho-TOH-so) comes from the Twi word *ahotoso*, "trust". Buyers and sellers lean on Hotoso instead of on each other.

A learning project for Paystack payments (test mode), built with Next.js + Django.

| Doc | What's inside |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Instructions Claude Code reads automatically: stack, rules, commands, test data |
| [01 Product brief](docs/01-product-brief.md) | The problem, the idea, users, stories, business rules |
| [02 Concepts guide](docs/02-concepts-guide.md) | **Start here to learn.** Payments, webhooks, idempotency, Next.js, Django |
| [03 Architecture](docs/03-architecture.md) | Data model, state machine, payment flows, API |
| [04 Design system](docs/04-design-system.md) | Tokens, signature components, every screen |
| [05 Build plan](docs/05-build-plan.md) | 8 milestones with demos and self-check questions |
| [06 Frontend guide](docs/06-frontend-guide.md) | The frontend explained step by step: tokens, server vs client components, mock data, money |
| [08 Categories](docs/08-categories.md) | What sellers can sell, inspection windows per category, blocked items |
| [UI direction](docs/design/ui-direction.md) | The visual direction the design system grew from |

## Run it

**In Docker** (production build, locked-down container):

```bash
docker compose up -d --build     # build and start
docker compose ps                # is it healthy?
docker compose down              # stop
```

Then open http://localhost:3000.

**For development** (hot reload when you save a file):

```bash
cd frontend
npm install
npm run dev
```


