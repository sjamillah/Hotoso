"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { DisputeReason } from "@/lib/types"
import { PhotoPicker } from "./deal-room/sheets"

/**
 * DISPUTE FLOW: "Something's wrong with my order"  (risk #3, ui-direction §5)
 *
 * Three short steps. A stressed person shouldn't face one long form.
 * Every step repeats where the money is: still held, and frozen once sent.
 *
 * In M6 the last step sends POST /api/room/{slug}/dispute/?t= with the reason,
 * details and photos. The backend moves the deal to `disputed`, which stops
 * the category's auto-release (48h or 72h).
 */

const REASONS: { value: DisputeReason; label: string; hint: string }[] = [
  { value: "not_received", label: "It never arrived", hint: "Nothing has reached you yet." },
  { value: "not_as_described", label: "It's not what was in the photos", hint: "Wrong size, colour, model or condition." },
  { value: "damaged", label: "It arrived damaged", hint: "Broken, torn or stained on arrival." },
  { value: "other", label: "Something else", hint: "Tell us in the next step." },
]

export function DisputeFlow({
  amount,
  sellerFirstName,
  roomHref,
}: {
  amount: string
  sellerFirstName: string
  roomHref: string
}) {
  const router = useRouter()
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [reason, setReason] = React.useState<DisputeReason | null>(null)
  const [details, setDetails] = React.useState("")
  const [photos, setPhotos] = React.useState<string[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  // When the step changes, move keyboard/screen-reader focus to the new heading.
  React.useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  function next() {
    if (step === 1 && !reason) return setError("Choose what happened.")
    if (step === 2 && details.trim().length < 10) return setError("Tell us a little more, so we can help.")
    setError(null)
    setStep((s) => (s === 1 ? 2 : 3))
  }

  function submit() {
    toast.success("Problem reported. The money is frozen while we review.")
    router.push(`${roomHref}&status=disputed`)
  }

  const reasonLabel = REASONS.find((r) => r.value === reason)?.label

  return (
    <div className="flex flex-col gap-8">
      {/* progress: three segments */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-1.5" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span key={n} className={cn("h-0.5 flex-1 rounded-full", n <= step ? "bg-ink" : "bg-rule")} />
          ))}
        </div>
        <p className="label-mono text-ink-2">Step {step} of 3</p>
      </div>

      {step === 1 && (
        <fieldset className="flex flex-col gap-5">
          <legend className="contents">
            <h1 ref={headingRef} tabIndex={-1} className="title-serif text-4xl text-ink outline-none">What <em className="italic">happened?</em></h1>
          </legend>
          <div className="flex flex-col gap-2.5">
            {REASONS.map((r) => (
              <label
                key={r.value}
                className="flex cursor-pointer items-start gap-3 rounded-md border border-rule bg-card p-4 has-[:checked]:border-ink has-[:checked]:shadow-[inset_0_0_0_1px_var(--ink)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
              >
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={() => setReason(r.value)}
                  className="mt-1 size-5 shrink-0 accent-ink"
                />
                <span className="flex flex-col">
                  <span className="text-base font-semibold text-ink">{r.label}</span>
                  <span className="text-sm text-ink-2">{r.hint}</span>
                </span>
              </label>
            ))}
          </div>
          <MoneyNote>Your {amount} is still held safely with Hotoso.</MoneyNote>
        </fieldset>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <h1 ref={headingRef} tabIndex={-1} className="title-serif text-4xl text-ink outline-none">Tell us <em className="italic">more</em></h1>
          <div className="flex flex-col gap-2">
            <Label htmlFor="dispute-details">What&apos;s wrong?</Label>
            <Textarea
              id="dispute-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="The sole is coming off at the front."
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "dispute-error" : undefined}
            />
          </div>
          <PhotoPicker id="dispute-photos" files={photos} onChange={setPhotos} />
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-5">
          <h1 ref={headingRef} tabIndex={-1} className="title-serif text-4xl text-ink outline-none">Check and <em className="italic">send</em></h1>
          <div className="flex items-start gap-3 rounded-md bg-butter-soft p-4 text-ink [&_svg]:mt-0.5 [&_svg]:size-5 [&_svg]:shrink-0">
            <Lock aria-hidden="true" />
            <p className="text-base">
              <strong className="font-semibold">{amount} will stay frozen with Hotoso while we review.</strong>{" "}
              {sellerFirstName} can&apos;t be paid, and can add their side. We usually decide within 48 hours.
            </p>
          </div>
          <dl className="flex flex-col gap-3 rounded-md border border-rule bg-card p-4">
            <div>
              <dt className="label-caps text-ink-2">What happened</dt>
              <dd className="text-base text-ink">{reasonLabel}</dd>
            </div>
            <div>
              <dt className="label-caps text-ink-2">Details</dt>
              <dd className="text-base text-ink">{details}</dd>
            </div>
            <div>
              <dt className="label-caps text-ink-2">Photos</dt>
              <dd className="text-base text-ink">{photos.length ? `${photos.length} added` : "None"}</dd>
            </div>
          </dl>
        </div>
      )}

      {error && (
        <p id="dispute-error" role="alert" className="text-sm font-medium text-clay">{error}</p>
      )}

      <div className="flex flex-col gap-1">
        {step < 3 ? (
          <Button size="lg" width="full" onClick={next}>Next</Button>
        ) : (
          <Button size="lg" width="full" onClick={submit}>Report the problem</Button>
        )}
        {step > 1 ? (
          <Button variant="ghost" width="full" onClick={() => { setError(null); setStep((s) => (s === 3 ? 2 : 1)) }}>
            Back
          </Button>
        ) : (
          <Button variant="ghost" width="full" asChild>
            <a href={roomHref}>Never mind, go back</a>
          </Button>
        )}
      </div>
    </div>
  )
}

function MoneyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-base text-ink">
      <span aria-hidden="true" className="inline-flex size-5 items-center justify-center rounded-full border-[1.5px] border-ink bg-butter font-display text-xs font-semibold">₵</span>
      {children}
    </p>
  )
}
