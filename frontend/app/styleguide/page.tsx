import type { Metadata } from "next"
import { RotateCw, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HoldStrip, type HoldStripProps } from "@/components/hotoso/hold-strip"
import { StatusChip } from "@/components/hotoso/status-chip"
import { ReceiptCard } from "@/components/hotoso/receipt-card"
import { MoneyMoment } from "@/components/hotoso/money-moment"
import { TrustBlock } from "@/components/hotoso/trust-block"
import { Timeline } from "@/components/hotoso/timeline"
import { MoneyInput } from "@/components/hotoso/money-input"
import { PhoneInput } from "@/components/hotoso/phone-input"
import { HotosoMark, Wordmark } from "@/components/hotoso/wordmark"
import { EmptyState, ErrorState, OfflineBanner } from "@/components/hotoso/states"
import { DEAL_STATUSES } from "@/lib/types"
import { af1Deal, af1Receipt, af1Timeline, ama, efua, kwame } from "@/lib/mock"
import { CarouselDemo, OverlayDemos, TabsDemo } from "./interactive-demos"

export const metadata: Metadata = { title: "Styleguide" }

/* ---------- token tables (class names must be written out in full so
   Tailwind can find them when it scans this file) ---------- */
const SWATCHES = [
  { name: "paper", hex: "#E8E5D8", cls: "bg-paper", note: "App background (Alabaster)" },
  { name: "card", hex: "#F3F1E8", cls: "bg-card", note: "Cards, sheets, inputs" },
  { name: "ink", hex: "#282C20", cls: "bg-ink", note: "Text, primary buttons (Black Olive)" },
  { name: "ink-2", hex: "#4F5345", cls: "bg-ink-2", note: "Secondary text" },
  { name: "ink-3", hex: "#7B7D6F", cls: "bg-ink-3", note: "Non-essential only (3.3:1)" },
  { name: "rule", hex: "#D2CEBE", cls: "bg-rule", note: "Borders, dividers" },
  { name: "muted", hex: "#DDD9CA", cls: "bg-muted", note: "Quiet surfaces, skeletons" },
  { name: "butter", hex: "#E8CA78", cls: "bg-butter", note: "Safe money. Never text on paper" },
  { name: "butter-soft", hex: "#F4E6BC", cls: "bg-butter-soft", note: "Held-safely pill, chips" },
  { name: "safe", hex: "#465A1C", cls: "bg-safe", note: "Released, links" },
  { name: "wait", hex: "#845000", cls: "bg-wait", note: "Awaiting, ship now" },
  { name: "wait-soft", hex: "#F0DCC6", cls: "bg-wait-soft", note: "" },
  { name: "clay", hex: "#9E3727", cls: "bg-clay", note: "Problems, refunds" },
  { name: "clay-soft", hex: "#F0D6CF", cls: "bg-clay-soft", note: "" },
  { name: "sky", hex: "#2B5269", cls: "bg-sky", note: "On the way, info" },
  { name: "sky-soft", hex: "#D8E1E5", cls: "bg-sky-soft", note: "" },
]

/* Example props for the HoldStrip in each status */
const STRIP_BASE = { amountMinor: af1Deal.itemMinor, buyerName: "Kwame", sellerName: "Ama" }
const STRIP_EXTRAS: Partial<Record<HoldStripProps["status"], Partial<HoldStripProps>>> = {
  funded: { shipBy: "Fri, 20 Nov" },
  shipped: { releaseAt: "Sat 21 Nov, 2:14 PM", countdown: "2d 14h" },
  released: { doneOn: "21 Nov" },
  refunded: { doneOn: "24 Nov" },
}

export default function StyleguidePage() {
  return (
    <div className="min-h-dvh bg-paper">
      {/* Dark "room" header: the ceremonial mood, used sparingly */}
      <header className="bg-ink text-paper">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-6 px-5 pt-6 pb-12 md:px-8 md:pb-16">
          <Wordmark tone="ink" />
          <div className="flex flex-col gap-3">
            <p className="label-caps text-paper">Design system · v1</p>
            <h1 className="display-caps text-paper">Styleguide</h1>
            <p className="max-w-[46ch] text-base text-paper">
              Every Hotoso component, in every state. If something looks wrong here, it will look wrong everywhere,
              so this is where we fix it.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1120px] flex-col gap-16 px-5 py-12 md:px-8">
        {/* ------------------------------------------------ LOGO */}
        <Section
          title="Logo"
          intro="An H made of meaning: buyer and seller lean in, and the coin that joins them is held in the middle by Hotoso."
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="flex h-56 items-center justify-center rounded-md border border-rule bg-paper">
              <HotosoMark className="size-28" />
            </div>
            <div className="flex h-56 items-center justify-center rounded-md bg-ink">
              <HotosoMark tone="ink" className="size-28" />
            </div>
            <div className="flex h-56 flex-col items-center justify-center gap-6 rounded-md border border-rule bg-card">
              <Wordmark className="text-4xl" />
              <div className="flex items-end gap-4">
                <HotosoMark className="size-12" />
                <HotosoMark className="size-8" />
                <HotosoMark className="size-4" />
              </div>
            </div>
          </div>
        </Section>

        {/* ------------------------------------------------ COLOUR */}
        <Section title="Colour" intro="Tokens only. These are the only colours that exist as classes in the app.">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {SWATCHES.map((s) => (
              <li key={s.name} className="overflow-hidden rounded-md border border-rule bg-card">
                <div className={`h-16 border-b border-rule ${s.cls}`} />
                <div className="flex flex-col gap-0.5 p-3">
                  <span className="font-mono text-sm font-medium text-ink">--{s.name}</span>
                  <span className="label-mono text-ink-2">{s.hex}</span>
                  {s.note && <span className="text-sm text-ink-2">{s.note}</span>}
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* ------------------------------------------------ TYPE */}
        <Section title="Type" intro="Fraunces for money and ceremony, Geist for reading, Geist Mono for numbers.">
          <div className="flex flex-col gap-6">
            <TypeRow name="display-caps · Fraunces 300">
              <p className="display-caps text-ink">Sell to strangers.</p>
            </TypeRow>
            <TypeRow name="money + text-amount · Fraunces 500">
              <p className="money text-amount text-ink">GHS 456.75</p>
            </TypeRow>
            <TypeRow name="text-3xl / 2xl / xl · Geist 600">
              <p className="text-3xl font-semibold">Your GHS 456.75 is safe</p>
              <p className="text-2xl font-semibold">Kwame&apos;s payment is in</p>
              <p className="text-xl font-semibold">Black AF1, size 42</p>
            </TypeRow>
            <TypeRow name="text-base · body, 16px minimum">
              <p className="max-w-[60ch] text-base">
                Ama gets paid only after you confirm you received it. If something&apos;s wrong, the money stays frozen
                with Hotoso while we review.
              </p>
            </TypeRow>
            <TypeRow name="heading-caps · label-caps · label-mono">
              <p className="heading-caps">Price</p>
              <p className="label-caps text-ink-2">Held for you</p>
              <p className="label-mono text-ink-2">Ref HTS-PAY-01JD7Q4M8Z · 18 Nov, 14:02</p>
            </TypeRow>
          </div>
        </Section>

        {/* ------------------------------------------------ BUTTONS */}
        <Section title="Buttons" intro="One dark button per screen: it's always the next step. Every size is at least 44px tall.">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Mark as shipped</Button>
              <Button variant="outline">Copy link</Button>
              <Button variant="quiet-danger">Something&apos;s wrong with my order</Button>
              <Button variant="ghost">Not now</Button>
              <Button variant="link">How it works</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small (44px)</Button>
              <Button>Default (48px)</Button>
              <Button size="lg">Large (52px)</Button>
              <Button size="icon" variant="outline" aria-label="Refresh">
                <RotateCw />
              </Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="max-w-[400px]">
              <Button size="lg" width="full">
                Pay GHS 456.75 into Hotoso
              </Button>
              <p className="mt-2 text-sm text-ink-2">Ama gets paid only after you confirm you received it.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-md bg-ink p-6">
              <Button variant="butter">
                <Plus /> Create your first deal
              </Button>
              <span className="text-sm text-paper">← butter: only on dark surfaces</span>
            </div>
          </div>
        </Section>

        {/* ------------------------------------------------ INPUTS */}
        <Section title="Inputs" intro="48px tall, label always above, errors under the field in clay.">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-name">Your name</Label>
              <Input id="sg-name" placeholder="Kwame Mensah" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-email">Email</Label>
              <Input id="sg-email" type="email" defaultValue="kwame.mensah@" aria-invalid aria-describedby="sg-email-err" />
              <p id="sg-email-err" className="text-sm font-medium text-clay">
                Check your email address. We&apos;ll send your deal room link there.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-disabled">Deal reference</Label>
              <Input id="sg-disabled" disabled defaultValue="HTS-PAY-01JD7Q4M8Z" className="font-mono" />
            </div>
            <MoneyInput
              label="Price"
              name="price"
              defaultMinor={45000}
              description="Buyer pays GHS 456.75 (includes 1.5% Hotoso protection)."
            />
            <MoneyInput label="Price" name="price_err" defaultMinor={500} error="The minimum is GHS 10." />
            <PhoneInput label="Phone number" name="phone_mtn" defaultValue={kwame.phone} description="MTN detected from 055." />
            <PhoneInput label="Payout MoMo number" name="phone_telecel" defaultValue="020 812 3456" />
            <PhoneInput label="Phone number" name="phone_bad" defaultValue="031 222 3333" error="That doesn't look like a Ghana mobile number." />
          </div>
        </Section>

        {/* ------------------------------------------------ STATUS CHIP */}
        <Section title="Status chip" intro="Words always carry the meaning; colour only supports it.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ChipColumn viewer="buyer" />
            <ChipColumn viewer="seller" />
          </div>
        </Section>

        {/* ------------------------------------------------ HOLD STRIP */}
        <Section
          title="Hold strip"
          intro="Where is the money right now? Every deal status from doc 03 §3. The coin is the only decorative motion."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {DEAL_STATUSES.map((status) => (
              <Card key={status} size="sm">
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-sm font-normal tracking-normal normal-case">{status}</span>
                    <StatusChip status={status} viewer="buyer" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <HoldStrip status={status} {...STRIP_BASE} {...STRIP_EXTRAS[status]} />
                </CardContent>
              </Card>
            ))}
            <Card size="sm">
              <CardHeader>
                <CardTitle className="font-mono text-sm font-normal tracking-normal normal-case">
                  pay return · confirming (pulse)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <HoldStrip
                  status="awaiting_payment"
                  {...STRIP_BASE}
                  pulse
                  caption="Confirming with Paystack…"
                  detail="Your money hasn't moved yet."
                />
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle className="font-mono text-sm font-normal tracking-normal normal-case">
                  public deal page preview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <HoldStrip
                  status="awaiting_payment"
                  {...STRIP_BASE}
                  caption="Your money stays with you until you pay"
                  detail="Then Hotoso holds it until you get your order."
                />
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 rounded-md bg-ink p-6">
            <p className="label-mono mb-4 text-paper">tone=&quot;ink&quot; · pay return success (coin glides in once)</p>
            <HoldStrip status="funded" {...STRIP_BASE} tone="ink" arrive shipBy="Fri, 20 Nov" />
          </div>
        </Section>

        {/* ------------------------------------------------ MONEY */}
        <Section title="Receipt and money moment" intro="Receipts for the breakdown, one money moment per screen.">
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
            <ReceiptCard
              lines={af1Receipt}
              totalMinor={af1Deal.totalMinor}
              reference={af1Deal.reference}
              timestamp={af1Deal.paidAt}
            />
            <div className="flex flex-col gap-4">
              <MoneyMoment label="Held for you" amountMinor={135000}>
                3 deals. Released to your MoMo when buyers confirm.
              </MoneyMoment>
              <MoneyMoment label="Safe with Hotoso" amountMinor={af1Deal.totalMinor}>
                Ama has been told to ship by Fri, 20 Nov.
              </MoneyMoment>
            </div>
          </div>
        </Section>

        {/* ------------------------------------------------ TRUST */}
        <Section title="Seller trust block" intro="Real numbers only. New sellers are labelled honestly, never with stars.">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TrustBlock seller={ama} />
            <TrustBlock seller={efua} />
          </div>
        </Section>

        {/* ------------------------------------------------ TIMELINE */}
        <Section title="Timeline" intro="Plain sentences, newest at the bottom. Hover or focus a time to see the exact moment.">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline items={af1Timeline} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Activity · empty</CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline items={[]} />
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ------------------------------------------------ OVERLAYS + TABS */}
        <Section title="Sheets, dialogs, toasts" intro="Overlays dim the page with ink. No blur (no glass).">
          <OverlayDemos />
        </Section>

        <Section title="Tabs and badges" intro="Seller home tabs: caps labels, an ink underline, counts in mono.">
          <TabsDemo />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge>2</Badge>
            <Badge variant="secondary">New</Badge>
            <Badge variant="outline">12</Badge>
            <Badge variant="muted">0</Badge>
            <Separator orientation="vertical" className="h-6" />
            <Avatar size="sm">
              <AvatarFallback>KM</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AO</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>EA</AvatarFallback>
            </Avatar>
          </div>
        </Section>

        <Section title="Carousel" intro="Photos first. Arrows float on the image as ink pills.">
          <CarouselDemo />
        </Section>

        {/* ------------------------------------------------ STATES */}
        <Section title="Screen states" intro="Every screen: loading, empty, error, offline.">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Loading · deal rows</CardTitle>
                <CardDescription>Skeletons in the shape of the content. No spinners.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="size-12 rounded-sm" />
                    <div className="flex flex-1 flex-col gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <EmptyState
              title="No deals yet"
              action={
                <Button>
                  <Plus /> New deal
                </Button>
              }
            >
              Create your first link and share it on WhatsApp. When a buyer pays, it shows up here.
            </EmptyState>
            <ErrorState
              action={
                <Button variant="outline">
                  <RotateCw /> Try again
                </Button>
              }
            />
            <div className="overflow-hidden rounded-md border border-rule">
              <OfflineBanner />
              <p className="bg-card p-5 text-base text-ink-2">The page underneath stays usable with what it already loaded.</p>
            </div>
          </div>
        </Section>
      </main>
    </div>
  )
}

/* ---------- small layout helpers for this page ---------- */

function Section({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 border-t border-ink pt-4">
        <h2 className="heading-caps text-ink">{title}</h2>
        <p className="max-w-[60ch] text-base text-ink-2">{intro}</p>
      </div>
      {children}
    </section>
  )
}

function TypeRow({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-rule pb-6">
      <span className="label-mono text-ink-2">{name}</span>
      {children}
    </div>
  )
}

function ChipColumn({ viewer }: { viewer: "buyer" | "seller" }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>As the {viewer}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y divide-rule">
          {DEAL_STATUSES.map((s) => (
            <li key={s} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2">
              <span className="font-mono text-sm text-ink-2">{s}</span>
              <StatusChip status={s} viewer={viewer} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
