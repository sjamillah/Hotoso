import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowRight, Plus, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HotosoMark, Wordmark } from "@/components/hotoso/wordmark"
import { ReceiptCard } from "@/components/hotoso/receipt-card"
import { Reveal } from "@/components/hotoso/reveal"
import { HeroLiveCard } from "@/components/landing/hero-live-card"
import { Journey } from "@/components/landing/journey"
import { photos } from "@/lib/photos"
import { formatGHS } from "@/lib/money"
import { CATEGORIES, CATEGORY_CODES, type CategoryCode } from "@/lib/categories"
import { CategoryTag } from "@/components/hotoso/category-tag"

/**
 * LANDING  /   "Follow the coin"
 *
 * One story told in chapters, each in a DIFFERENT visual form, so the page has
 * rhythm instead of repetition:
 *
 *   Hero    dark photo room        → the promise, and a deal playing itself out
 *   I       pure typography (paper) → the two fears, facing each other
 *   II      scroll story (ink)      → the coin's journey, step by step
 *   III     photo collage (paper)   → what people sell, with hang tags
 *   IV      one object (sand)       → the fee, as a receipt that prints
 *   V       colour band (butter)    → three rules, as giant numbers
 *   FAQ     editorial columns       → questions, answered plainly
 *   Footer  signature (ink)         → the last call, and a giant wordmark
 *
 * Motion is purposeful and switches off with "reduce motion".
 * No invented numbers: every figure on this page is a real Hotoso rule.
 */

const HEADLINE = ["Sell to strangers.", "Get paid", "like family."]

const FAQ = [
  { q: "What if the buyer never confirms?", a: "We release the money to you automatically once the buyer's inspection window ends: 72 hours after shipping for most things, 48 hours for phones, hair, beauty and bulk goods. Unless the buyer reports a problem first." },
  { q: "What can I sell?", a: "Physical products in 14 categories: fashion, shoes, bags, hair, beauty, phones and electronics, home, kids, books, crafts, pre-loved, sports, auto parts and bulk goods. Some things can't be protected: food, gift cards and airtime, tickets, animals, medicines, alcohol, weapons, replicas, land and vehicles." },
  { q: "What if something's wrong with the order?", a: "The buyer reports it before the money is released. We freeze the money, hear both sides, and refund or release it, usually within 48 hours." },
  { q: "How much does it cost?", a: "The buyer pays 1.5% on top of the price (at least GHS 1, at most GHS 50). Sellers get the full price." },
  { q: "How do I get paid?", a: "Straight to your MTN, Telecel or AirtelTigo MoMo number." },
  { q: "Is this live?", a: "Not yet. Hotoso is a learning project running in Paystack test mode, so no real money moves." },
]

export default function LandingPage() {
  return (
    <div className="bg-paper">
      <Hero />
      <main>
        <Fears />
        <TheHold />
        <Collage />
        <TheFee />
        <Rules />
        <Questions />
      </main>
      <Footer />
    </div>
  )
}

/* ============================================================== HERO */
function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper">
      <Image src={photos.heroJordan1} alt="" fill preload placeholder="blur" sizes="100vw" className="settle -z-20 object-cover object-[50%_65%]" />
      {/* the scrim: our own ink, darkest where the words sit */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/55" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/80 via-transparent to-ink" />

      {/* phones: logo left · tablet and up: centred between the two links */}
      <header className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-5 sm:grid sm:grid-cols-[1fr_auto_1fr] lg:h-20 lg:px-10">
        <Link href="#how" className="label-caps hidden h-11 w-fit items-center rounded-xs px-1 text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper focus-visible:outline-paper sm:flex">
          How it works
        </Link>
        <Link href="/" aria-label="Hotoso home" className="-ml-1 flex h-11 items-center rounded-xs px-1 focus-visible:outline-paper sm:ml-0">
          <Wordmark tone="ink" />
        </Link>
        <div className="flex justify-end">
          <Link href="/seller" className="label-caps -mr-1 flex h-11 items-center rounded-xs px-1 text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper focus-visible:outline-paper">
            Sign in
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-5 pt-14 pb-12 text-center lg:px-10 lg:pt-20">
        <p className="label-mono rise-mask mb-8 text-butter">
          <span className="rise-line">Payments held safely · Accra · Kumasi</span>
        </p>
        <h1 className="font-display text-[clamp(3rem,12.5vw,6.75rem)] leading-[0.95] font-light tracking-[-0.015em] uppercase [font-variation-settings:'opsz'_144,'SOFT'_0]">
          {HEADLINE.map((line, i) => (
            <span key={line} className="rise-mask">
              <span className="rise-line" style={{ "--rise-delay": `${150 + i * 140}ms` } as React.CSSProperties}>
                {i === 2 ? (
                  <>
                    like <em className="font-light text-butter normal-case italic">family.</em>
                  </>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h1>
        <p className="mt-8 max-w-[34ch] text-lg text-paper">Buyers pay into Hotoso. You ship. The money lands on your MoMo.</p>
        <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:gap-5">
          <Button variant="butter" size="lg" asChild>
            <Link href="/seller/deals/new">
              <Plus /> Create your first deal
            </Link>
          </Button>
          <Link href="/d/SMB40OGA" className="group flex h-11 items-center gap-1.5 rounded-xs px-1 text-base font-medium text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper focus-visible:outline-paper">
            See what buyers see <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* bottom: the thread that leads into chapter I, and the example deal */}
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 px-5 pb-6 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pb-10">
        <a href="#fears" className="label-mono hidden items-center gap-3 rounded-xs text-paper focus-visible:outline-paper lg:flex">
          <span className="flex size-11 items-center justify-center rounded-full border border-paper/40 transition-colors duration-300 hover:border-paper [&_svg]:size-4">
            <ArrowDown aria-hidden="true" />
          </span>
          Follow the coin
        </a>
        <HeroLiveCard />
      </div>
    </section>
  )
}

/* ============================================================== I · TWO STRANGERS */
function Fears() {
  return (
    <section id="fears" aria-labelledby="fears-title" className="scroll-mt-4 bg-paper">
      <div className="mx-auto max-w-[1280px] px-5 pt-24 pb-24 lg:px-10 lg:pt-40 lg:pb-32">
        <Reveal>
          <p className="label-mono text-ink-2">I · Two strangers</p>
          <h2 id="fears-title" className="sr-only">Two strangers, two fears</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8 lg:mt-20 lg:gap-16">
          <Reveal>
            <figure>
              <blockquote className="font-display text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.05] font-light text-ink italic">
                “If I send MoMo first, will the item ever come?”
              </blockquote>
              <figcaption className="label-caps mt-6 text-ink-2">Kwame · buyer · Kumasi</figcaption>
            </figure>
          </Reveal>

          {/* the middle: a line between them, and Hotoso sitting on it */}
          <Reveal delay={250} className="flex items-center gap-4 md:h-full md:flex-col md:justify-center">
            <span aria-hidden="true" className="h-px flex-1 bg-rule md:h-auto md:w-px" />
            <span className="flex flex-col items-center gap-2">
              <HotosoMark className="size-14 lg:size-16" />
              <span className="label-caps text-ink">Hotoso</span>
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-rule md:h-auto md:w-px" />
          </Reveal>

          <Reveal delay={450} className="md:text-right">
            <figure>
              <blockquote className="font-display text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.05] font-light text-ink italic">
                “If I ship first, will they ever pay?”
              </blockquote>
              <figcaption className="label-caps mt-6 text-ink-2">Ama · seller · Accra</figcaption>
            </figure>
          </Reveal>
        </div>

      </div>

      {/* A city of strangers. The world BEFORE Hotoso is black and white;
          colour returns in the next chapter, when the coin starts moving. */}
      <div className="relative isolate flex min-h-[22rem] items-center justify-center overflow-hidden bg-ink px-5 py-20 sm:min-h-[28rem] lg:min-h-[34rem]">
        <Image src={photos.accraTrafficBw} alt="Evening traffic in Dzorwulu, Accra" fill placeholder="blur" sizes="100vw" className="-z-20 object-cover grayscale" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/65" />
        <Reveal className="max-w-[min(56rem,100%)] text-center">
          <p className="label-mono text-butter">Dzorwulu, Accra</p>
          {/* two lines at most when centred (doc 04 §8) */}
          <p className="mt-5 font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight font-light text-paper">
            A city of strangers. <em className="italic">Hotoso holds the money in the middle.</em>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================================== II · THE HOLD */
function TheHold() {
  return (
    <section id="how" aria-labelledby="hold-title" className="scroll-mt-0 bg-ink text-paper">
      <div className="mx-auto max-w-[1280px] px-5 pt-24 pb-10 lg:px-10 lg:pt-36 lg:pb-24">
        <Reveal className="max-w-[40rem]">
          <p className="label-mono text-butter">II · The hold</p>
          <h2 id="hold-title" className="display-caps mt-5 text-paper">Follow the coin.</h2>
          <p className="mt-6 max-w-[44ch] text-lg text-paper">
            Scroll, and watch GHS 450 travel from a stranger&apos;s pocket to a seller&apos;s MoMo, with Hotoso holding it
            in between.
          </p>
        </Reveal>
        <div className="mt-10 lg:mt-16">
          <Journey />
        </div>
      </div>
    </section>
  )
}

/* ============================================================== III · WHAT PEOPLE SELL */
function HangTag({ price }: { price: number }) {
  return (
    // On phones the photo is only ~160px wide, so the tag shrinks to a corner
    // and says just "Held"; from `sm` up it's the full "Held by Hotoso" tag.
    <div aria-hidden="true" className="hang-tag pointer-events-none absolute -top-3 right-3 z-10 flex flex-col items-center sm:right-5">
      <span className="h-6 w-px bg-ink sm:h-9" />
      <div className="relative rounded-xs bg-paper px-2.5 pt-4 pb-2 text-center shadow-card sm:min-w-[7.5rem] sm:px-3 sm:pt-5 sm:pb-3">
        <span className="absolute top-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-ink sm:top-2" />
        <p className="label-caps text-ink-2">
          <span className="sm:hidden">Held</span>
          <span className="max-sm:hidden">Held by Hotoso</span>
        </p>
        <p className="mt-0.5 font-mono text-sm text-ink tabular-nums sm:text-base">{formatGHS(price)}</p>
      </div>
    </div>
  )
}

function Shot({
  src,
  title,
  price,
  aspect,
  href,
  category,
}: {
  src: (typeof photos)[keyof typeof photos]
  title: string
  price: number
  aspect: string
  href?: string
  category: CategoryCode
}) {
  const body = (
    <>
      <div className={`relative overflow-hidden bg-muted ${aspect}`}>
        <Image src={src} alt={title} fill placeholder="blur" sizes="(min-width: 1024px) 380px, 50vw" className="object-cover transition-transform duration-[1200ms] ease-calm group-hover:scale-[1.04]" />
      </div>
      <HangTag price={price} />
      <figcaption className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <span className="flex min-w-0 flex-col gap-1">
          <CategoryTag code={category} />
          <span className="line-clamp-2 text-base text-ink">{title}</span>
        </span>
        {href && <span className="label-mono shrink-0 text-ink underline underline-offset-4">Open deal</span>}
      </figcaption>
    </>
  )
  return (
    <figure className="group relative">
      {href ? (
        <Link href={href} className="block rounded-xs">
          {body}
        </Link>
      ) : (
        body
      )}
    </figure>
  )
}

function Collage() {
  return (
    <section aria-labelledby="sell-title" className="bg-paper">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-14 px-5 py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-16 lg:px-10 lg:py-40">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <p className="label-mono text-ink-2">III · What people sell</p>
          <h2 id="sell-title" className="mt-5 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.05] font-light text-ink">
            Anything you sell <em className="italic">in your DMs.</em>
          </h2>
          <p className="mt-6 max-w-[34ch] text-lg text-ink-2">
            One link per item. Every price tag says the same thing: the money waits with Hotoso until it arrives.
          </p>
          <p className="label-mono mt-6 max-w-[40ch] leading-relaxed text-ink">
            {CATEGORY_CODES.map((c) => CATEGORIES[c].short).join(" · ")}
          </p>
          <div className="relative mt-10 hidden aspect-[4/5] w-full max-w-[320px] overflow-hidden lg:block">
            <Image src={photos.shoeboxesBw} alt="Shoeboxes stacked on shelves" fill placeholder="blur" sizes="320px" className="object-cover" />
          </div>
        </Reveal>

        {/* three columns, staggered on purpose: an editorial spread, not a catalogue grid.
            Eight sellers, eight categories: shoes are one tile, not the whole wall. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-14 sm:grid-cols-3 lg:gap-x-6">
          <Reveal className="col-span-2 grid grid-cols-2 gap-x-4 gap-y-14 pt-4 sm:col-span-1 sm:flex sm:flex-col">
            <Shot src={photos.sweaterLilac} title="Lilac chunky knit sweater" price={28000} aspect="aspect-[3/4]" href="/d/SWTLIL01" category="fashion" />
            <Shot src={photos.jerseysRack} title="Club jerseys, 2025/26" price={18000} aspect="aspect-[3/4] sm:aspect-[4/5]" href="/d/JRSY2526" category="sports" />
          </Reveal>
          <Reveal delay={120} className="flex flex-col gap-14 pt-4 sm:pt-24">
            <Shot src={photos.iphone15Pro} title="iPhone 15 Pro, 256GB" price={850000} aspect="aspect-square" href="/d/IPH15P256" category="electronics" />
            <Shot src={photos.armchairWood} title="Wooden lounge armchair" price={240000} aspect="aspect-[4/5]" href="/d/CHRTEAK1" category="home" />
            <Shot src={photos.samba1} title="Adidas Samba OG" price={54000} aspect="aspect-[4/5]" href="/d/SMB40OGA" category="shoes" />
          </Reveal>
          <Reveal delay={240} className="flex flex-col gap-14 pt-4 sm:pt-10">
            <Shot src={photos.perfumeAmbroxan} title="Ambroxan eau de parfum" price={65000} aspect="aspect-[4/5]" href="/d/PRFAMB19" category="beauty" />
            <Shot src={photos.bagWovenLeather} title="Woven leather shoulder bag" price={42000} aspect="aspect-[3/4]" href="/d/BAGWVN01" category="bags_accessories" />
            <Shot src={photos.basketsWeaving} title="Handwoven basket, made to order" price={15000} aspect="aspect-square" href="/d/BSKTWV01" category="crafts" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ============================================================== IV · THE FEE */
function TheFee() {
  return (
    <section aria-labelledby="fee-title" className="overflow-hidden bg-muted">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 px-5 py-24 md:grid-cols-2 md:gap-10 lg:gap-20 lg:px-10 lg:py-36">
        <Reveal>
          <p className="label-mono text-ink-2">IV · The fee</p>
          <h2 id="fee-title" className="mt-4 font-display text-[clamp(5.5rem,17vw,13rem)] leading-[0.85] font-light tracking-[-0.03em] text-ink">
            1.5%
          </h2>
          <p className="mt-6 font-display text-2xl text-ink italic lg:text-3xl">paid by the buyer.</p>
          <p className="mt-4 max-w-[36ch] text-lg text-ink-2">
            Sellers keep every cedi of their price. The protection costs at least GHS 1 and never more than GHS 50.
          </p>
        </Reveal>

        {/* the receipt PRINTS as it scrolls into view */}
        <div className="mx-auto w-full max-w-[400px] -rotate-2">
          <Reveal className="print">
            <ReceiptCard
              lines={[
                { label: "Black AF1, size 42", amountMinor: 45000 },
                { label: "Hotoso protection (1.5%)", amountMinor: 675 },
              ]}
              totalLabel="Kwame pays"
              totalMinor={45675}
              reference="HTS-PAY-01JD7Q4M8Z"
              timestamp="18 Nov, 14:02"
              className="rounded-b-none shadow-sheet"
            />
            <p className="flex items-baseline justify-between rounded-b-md border-x border-b border-dashed border-rule bg-card px-5 py-3 text-base text-ink shadow-sheet">
              <span>Ama receives</span>
              <span className="font-mono font-semibold tabular-nums">{formatGHS(45000)}</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ============================================================== V · THE RULES */
function Rules() {
  const rules = [
    { big: "48–72h", text: "To check the order after delivery, depending on the category. Then the money releases on its own." },
    { big: "48h", text: "How long we usually take to settle a problem, with both sides heard." },
    { big: "₵0", text: "What sellers pay. The 1.5% protection is added for the buyer." },
  ]
  return (
    <section aria-labelledby="rules-title" className="bg-butter text-ink">
      <div className="mx-auto max-w-[1280px] px-5 py-20 lg:px-10 lg:py-32">
        <Reveal>
          <p className="label-mono text-ink">V · Rules, not promises</p>
          <h2 id="rules-title" className="sr-only">Hotoso&apos;s rules</h2>
        </Reveal>
        <ul className="mt-10 grid grid-cols-1 divide-y divide-ink/25 border-y border-ink/25 md:grid-cols-3 md:divide-x md:divide-y-0 lg:mt-14">
          {rules.map((r, i) => (
            <Reveal as="li" key={r.big} delay={i * 140} className="flex flex-col gap-4 py-10 md:px-6 md:first:pl-0 md:last:pr-0 lg:px-10 lg:py-14">
              {/* one line, always: the three descriptions then start at the same height.
                  Sized so the longest ("48–72h") fits its column at every width. */}
              <span className="font-display text-[clamp(3.5rem,7.2vw,6.75rem)] leading-[0.85] font-light tracking-[-0.03em] whitespace-nowrap">{r.big}</span>
              <span className="max-w-[28ch] text-lg">{r.text}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ============================================================== QUESTIONS */
function Questions() {
  return (
    <section aria-labelledby="faq-title" className="bg-paper">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-5 py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-20 lg:px-10 lg:py-36">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <p className="label-mono text-ink-2">Questions</p>
          <h2 id="faq-title" className="mt-5 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.05] font-light text-ink">
            Answered <em className="italic">plainly.</em>
          </h2>
          {/* wide on phones, tall beside the questions on desktop */}
          <figure className="mt-10 max-w-[340px] max-lg:max-w-none">
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-[3/4]">
              <Image src={photos.accraVendor} alt="A street vendor in Accra carrying goods" fill placeholder="blur" sizes="(min-width: 1024px) 340px, 100vw" className="object-cover object-[50%_30%]" />
            </div>
            <figcaption className="label-mono mt-3 text-ink-2">Accra · every seller deserves to be paid</figcaption>
          </figure>
        </Reveal>
        <div className="border-t border-ink">
          {FAQ.map((item, i) => (
            <details key={item.q} className="faq group border-b border-rule">
              <summary className="flex min-h-16 cursor-pointer list-none items-center gap-5 py-5 text-xl text-ink transition-colors duration-200 hover:text-ink-2 [&::-webkit-details-marker]:hidden">
                <span className="label-mono w-6 shrink-0 text-ink-2">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">{item.q}</span>
                {/* a plus that becomes a minus: the vertical bar folds away */}
                <span aria-hidden="true" className="relative size-4 shrink-0">
                  <span className="absolute top-1/2 left-0 h-px w-4 bg-ink" />
                  <span className="absolute top-0 left-1/2 h-4 w-px bg-ink transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-[56ch] pb-6 pl-11 text-lg text-ink-2">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================== FOOTER */
function Footer() {
  return (
    <footer className="overflow-hidden bg-ink text-paper">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-5 pt-24 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pt-36">
        <Reveal>
          <h2 className="display-caps max-w-[12ch] text-paper">Your next sale, protected.</h2>
        </Reveal>
        <Reveal delay={150}>
          <Button variant="butter" size="lg" asChild>
            <Link href="/seller/deals/new">
              <Plus /> Create a deal
            </Link>
          </Button>
        </Reveal>
      </div>

      {/* the signature: a giant wordmark, quietly embossed into the dark */}
      <div aria-hidden="true" className="mx-auto mt-16 flex max-w-[1280px] items-end gap-[2vw] px-5 select-none lg:mt-24 lg:px-10">
        {/* dimmed, so mark + word read as ONE quiet, embossed signature */}
        <HotosoMark tone="ink" className="size-[16vw] max-h-[13rem] max-w-[13rem] opacity-30" />
        <span className="font-display text-[clamp(5rem,24vw,19rem)] leading-[0.78] font-semibold tracking-[-0.045em] text-ink-2">hotoso</span>
      </div>

      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 border-t border-ink-2 px-5 py-5 lg:px-10">
        <p className="label-mono flex items-center gap-2 text-paper">
          <ShieldCheck className="size-4" aria-hidden="true" /> Paystack test mode
        </p>
        <Link href="/credits" className="label-mono flex h-11 items-center text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper">
          Photo credits
        </Link>
      </div>
    </footer>
  )
}
