"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight, Eye, EyeOff, ImageIcon, ImagePlus, OctagonAlert, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatGHS, formatGHSShort, type Minor } from "@/lib/money"
import { DEAL_MAX_MINOR, DEAL_MIN_MINOR, previewFeeMinor } from "@/lib/fee"
import { MoneyInput } from "./money-input"
import { PhotoPicker, ShareSheet } from "./deal-room/sheets"
import { CATEGORY_ICONS } from "./category-tag"
import { CATEGORIES, CATEGORY_CODES, blockedReason, windowLabel, type CategoryCode, type Requirement } from "@/lib/categories"

type Photo = { id: string; name: string; url: string }

export function NewDealForm() {
  const [photos, setPhotos] = React.useState<Photo[]>([])
  const [title, setTitle] = React.useState("")
  const [priceMinor, setPriceMinor] = React.useState<Minor | null>(null)
  const [category, setCategory] = React.useState<CategoryCode | null>(null)
  const [shipDays, setShipDays] = React.useState(3)
  const [note, setNote] = React.useState("")
  const [reqPhotos, setReqPhotos] = React.useState<Record<string, string[]>>({})
  const [reqText, setReqText] = React.useState<Record<string, string>>({})
  const [errors, setErrors] = React.useState<{ category?: string; title?: string; price?: string; req?: Record<string, string> }>({})
  const [showPreview, setShowPreview] = React.useState(false)
  const [shareOpen, setShareOpen] = React.useState(false)

  const photosRef = React.useRef<Photo[]>([])
  React.useEffect(() => {
    photosRef.current = photos
  }, [photos])
  React.useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), [])

  const rule = category ? CATEGORIES[category] : null
  const activeReqs: Requirement[] = (rule?.requirements ?? []).filter(
    (r) => !(r.kind === "photo" && r.whenOverMinor != null) || (priceMinor ?? 0) > r.whenOverMinor
  )
  const shipOptions = (rule?.maxShipDays ?? 3) > 3 ? [3, 7, 10, 14] : [3, 2, 1]
  const blocked = blockedReason(`${title} ${note}`)

  function pickCategory(code: CategoryCode) {
    setCategory(code)
    const options = CATEGORIES[code].maxShipDays > 3 ? [3, 7, 10, 14] : [3, 2, 1]
    if (!options.includes(shipDays)) setShipDays(options[0])
    setErrors((e) => ({ ...e, category: undefined, req: undefined }))
  }

  const feeMinor = priceMinor != null ? previewFeeMinor(priceMinor) : null
  const totalMinor = priceMinor != null && feeMinor != null ? priceMinor + feeMinor : null

  function addPhotos(files: FileList | null) {
    if (!files) return
    const added = Array.from(files)
      .slice(0, 4 - photos.length)
      .map((f) => ({ id: crypto.randomUUID(), name: f.name, url: URL.createObjectURL(f) }))
    setPhotos((p) => [...p, ...added])
  }
  function move(i: number, by: -1 | 1) {
    setPhotos((p) => {
      const next = [...p]
      ;[next[i], next[i + by]] = [next[i + by], next[i]]
      return next
    })
  }
  function remove(i: number) {
    setPhotos((p) => {
      URL.revokeObjectURL(p[i].url)
      return p.filter((_, j) => j !== i)
    })
  }

  function validate() {
    const next: typeof errors = {}
    if (!category) next.category = "Choose what kind of item this is."
    if (title.trim().length < 3) next.title = "Give it a name buyers will recognise, like “Black AF1, size 42”."
    else if (blocked) next.title = "This item can't be sold on Hotoso (see below)."
    if (priceMinor == null) next.price = "Enter a price, like 450."
    else if (priceMinor < DEAL_MIN_MINOR) next.price = `The minimum is ${formatGHSShort(DEAL_MIN_MINOR)}.`
    else if (priceMinor > DEAL_MAX_MINOR)
      next.price = rule?.verifiedMaxMinor
        ? `The maximum is ${formatGHSShort(DEAL_MAX_MINOR)}. Verified sellers can sell phones and electronics up to ${formatGHSShort(rule.verifiedMaxMinor)}.`
        : `The maximum is ${formatGHSShort(DEAL_MAX_MINOR)}.`
    const req: Record<string, string> = {}
    for (const r of activeReqs) {
      if (r.kind === "photo" && !(reqPhotos[r.id]?.length)) req[r.id] = "Add this photo: it's required for this category."
      if (r.kind === "text" && !(reqText[r.id] ?? "").trim()) req[r.id] = "Fill this in: it's required for this category."
    }
    if (Object.keys(req).length) next.req = req
    setErrors(next)
    return Object.keys(next).length === 0
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          if (validate()) setShareOpen(true)
        }}
        className="flex flex-col gap-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label-caps text-ink-2">New deal</p>
            <h1 className="title-serif mt-1 text-4xl text-ink">What are you <em className="italic">selling?</em></h1>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="lg:hidden"
            aria-pressed={showPreview}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? <EyeOff /> : <Eye />} Preview
          </Button>
        </div>

        {showPreview && (
          <div className="lg:hidden">
            <WhatsAppPreview photo={photos[0]} title={title} totalMinor={totalMinor} category={category} />
          </div>
        )}

        <fieldset className="flex flex-col gap-3" aria-describedby={errors.category ? "cat-err" : undefined}>
          <legend className="mb-1 text-sm font-medium text-ink">What kind of item is it?</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_CODES.map((code) => {
              const Icon = CATEGORY_ICONS[code]
              const on = category === code
              return (
                <label
                  key={code}
                  className={cn(
                    "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink [&_svg]:size-4",
                    on ? "border-ink bg-ink text-paper" : "border-rule bg-card text-ink hover:border-ink"
                  )}
                >
                  <input type="radio" name="category" value={code} checked={on} onChange={() => pickCategory(code)} className="sr-only" />
                  <Icon aria-hidden="true" />
                  {CATEGORIES[code].short}
                </label>
              )
            })}
          </div>
          {errors.category && <p id="cat-err" className="text-sm font-medium text-clay">{errors.category}</p>}
          {rule && (
            <div className="rounded-md border border-rule bg-card p-4">
              <p className="text-base font-medium text-ink">{rule.label}</p>
              <p className="text-sm text-ink-2">{rule.examples}</p>
              <p className="label-mono mt-2 text-ink">Buyers get {windowLabel(rule.code)} after delivery</p>
              {rule.buyerNote && <p className="mt-1 text-sm text-ink-2">{rule.buyerNote}</p>}
            </div>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium text-ink">Photos (up to 4, the first one shows in WhatsApp)</legend>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {photos.map((p, i) => (
              <li key={p.id} className="flex flex-col gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not a remote image */}
                <img src={p.url} alt={`Photo ${i + 1}: ${p.name}`} className="aspect-square w-full rounded-sm border border-rule object-cover" />
                <div className="flex justify-between">
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move photo ${i + 1} earlier`} className="flex size-11 items-center justify-center rounded-xs text-ink hover:bg-muted disabled:opacity-30 [&_svg]:size-4"><ArrowLeft /></button>
                  <button type="button" onClick={() => remove(i)} aria-label={`Remove photo ${i + 1}`} className="flex size-11 items-center justify-center rounded-xs text-clay hover:bg-muted [&_svg]:size-4"><X /></button>
                  <button type="button" disabled={i === photos.length - 1} onClick={() => move(i, 1)} aria-label={`Move photo ${i + 1} later`} className="flex size-11 items-center justify-center rounded-xs text-ink hover:bg-muted disabled:opacity-30 [&_svg]:size-4"><ArrowRight /></button>
                </div>
              </li>
            ))}
            {photos.length < 4 && (
              <li>
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-ink-3 bg-card text-sm font-medium text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink [&_svg]:size-5">
                  <ImagePlus aria-hidden="true" />
                  Add
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addPhotos(e.target.files)} />
                </label>
              </li>
            )}
          </ul>
        </fieldset>

        <div className="flex flex-col gap-2">
          <Label htmlFor="deal-title">Item name</Label>
          <Input
            id="deal-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Black AF1, size 42"
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? "deal-title-err" : undefined}
          />
          {errors.title && <p id="deal-title-err" className="text-sm font-medium text-clay">{errors.title}</p>}
        </div>

        {blocked && (
          <div role="alert" className="flex items-start gap-3 rounded-md border border-clay bg-clay-soft p-4 text-clay [&_svg]:mt-0.5 [&_svg]:size-5 [&_svg]:shrink-0">
            <OctagonAlert aria-hidden="true" />
            <div className="text-base">
              <p className="font-semibold">Hotoso can&apos;t protect this item</p>
              <p className="mt-1">{blocked} If this is a mistake, change the wording.</p>
            </div>
          </div>
        )}

        {activeReqs.map((r) =>
          r.kind === "photo" ? (
            <div key={r.id} className="flex flex-col gap-1">
              <PhotoPicker
                id={`req-${r.id}`}
                label={r.label}
                files={reqPhotos[r.id] ?? []}
                onChange={(names) => setReqPhotos((m) => ({ ...m, [r.id]: names }))}
              />
              <p className="text-sm text-ink-2">{r.hint}</p>
              {errors.req?.[r.id] && <p className="text-sm font-medium text-clay">{errors.req[r.id]}</p>}
            </div>
          ) : (
            <div key={r.id} className="flex flex-col gap-2">
              <Label htmlFor={`req-${r.id}`}>{r.label}</Label>
              <Input
                id={`req-${r.id}`}
                value={reqText[r.id] ?? ""}
                placeholder={r.placeholder}
                onChange={(e) => setReqText((m) => ({ ...m, [r.id]: e.target.value }))}
                aria-invalid={errors.req?.[r.id] ? true : undefined}
              />
              <p className="text-sm text-ink-2">{r.hint}</p>
              {errors.req?.[r.id] && <p className="text-sm font-medium text-clay">{errors.req[r.id]}</p>}
            </div>
          )
        )}

        <MoneyInput
          label="Price"
          name="price"
          onValueChange={setPriceMinor}
          error={errors.price}
          description={
            totalMinor != null && feeMinor != null ? (
              <>
                Buyer pays <span className="font-mono text-ink tabular-nums">{formatGHS(totalMinor)}</span> (includes{" "}
                {formatGHS(feeMinor)} Hotoso protection). You get <span className="font-mono text-ink tabular-nums">{formatGHS(priceMinor!)}</span>.
              </>
            ) : (
              "The buyer pays a 1.5% protection fee on top. You get the full price."
            )
          }
        />

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium text-ink">
            {shipOptions.length === 4 ? "Made to order? You can take up to 14 days" : "You'll ship within"}
          </legend>
          <div className={cn("grid gap-2", shipOptions.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3")}>
            {shipOptions.map((d) => (
              <label
                key={d}
                className={cn(
                  "flex h-12 cursor-pointer items-center justify-center rounded-sm border bg-card text-base font-medium text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
                  shipDays === d ? "border-ink shadow-[inset_0_0_0_1px_var(--ink)]" : "border-rule"
                )}
              >
                <input type="radio" name="ship" value={d} checked={shipDays === d} onChange={() => setShipDays(d)} className="sr-only" />
                {d} {d === 1 ? "day" : "days"}
              </label>
            ))}
          </div>
          <p className="text-sm text-ink-2">Counted from when the buyer pays. If you miss it, the buyer can cancel for a refund.</p>
        </fieldset>

        <div className="flex flex-col gap-2">
          <Label htmlFor="deal-note">Note for the buyer (optional)</Label>
          <Textarea id="deal-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Brand new with tags. Ships from East Legon." className="min-h-20" />
        </div>

        <Button type="submit" size="lg" width="full" disabled={!!blocked}>Create deal link</Button>
      </form>

      <aside className="hidden lg:block">
        <div className="sticky top-6">
          <WhatsAppPreview photo={photos[0]} title={title} totalMinor={totalMinor} category={category} />
        </div>
      </aside>

      <ShareSheet
        trigger={null}
        open={shareOpen}
        onOpenChange={setShareOpen}
        doneHref="/seller"
        url="https://hotoso.app/d/NWDL7X2Q"
        title={title || "Your item"}
        amount={totalMinor != null ? formatGHSShort(totalMinor) : ""}
      />
    </div>
  )
}

function WhatsAppPreview({ photo, title, totalMinor, category }: { photo?: Photo; title: string; totalMinor: Minor | null; category: CategoryCode | null }) {
  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="label-caps text-ink-2">How buyers see your link</figcaption>
      <div className="rounded-md bg-muted p-4">
        <div className="ml-auto max-w-[300px] overflow-hidden rounded-md rounded-tr-xs bg-card shadow-card">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview
            <img src={photo.url} alt="" className="aspect-[1.91/1] w-full object-cover" />
          ) : (
            <div className="flex aspect-[1.91/1] w-full flex-col items-center justify-center gap-1 bg-muted text-sm text-ink-2 [&_svg]:size-6">
              <ImageIcon aria-hidden="true" /> Your first photo shows here
            </div>
          )}
          <div className="flex flex-col gap-0.5 border-b border-rule bg-paper px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-ink">
              {title || "Your item"}
              {totalMinor != null && ` · ${formatGHSShort(totalMinor)}`}
            </p>
            <p className="truncate text-sm text-ink-2">
              Protected by Hotoso{category ? ` · ${windowLabel(category)}` : ": pay safely"}
            </p>
            <p className="label-mono text-ink-2">hotoso.app</p>
          </div>
          <p className="px-3 py-2.5 text-sm text-ink">
            Pay safely with Hotoso: your money waits until you get it.{" "}
            <span className="break-all text-safe underline">hotoso.app/d/NWDL7X2Q</span>
          </p>
        </div>
      </div>
    </figure>
  )
}
