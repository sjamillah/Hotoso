"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatGHS, type Minor } from "@/lib/money"
import { PhoneInput } from "./phone-input"

/**
 * The pay step of the public deal page.
 *
 * 1. The buyer taps "Pay GHS … into Hotoso" (sticky on phones, inline on desktop).
 * 2. A sheet asks for name, phone and email. Paystack requires an email, and
 *    we send the private deal-room link there.
 * 3. "Continue to Paystack":
 *      M3 (real): POST /api/deals/{slug}/pay/ → backend creates a Payment and
 *                 asks Paystack for a checkout page → we REDIRECT the browser
 *                 there. The buyer pays on Paystack's page, never ours.
 *      Now (mock): we skip Paystack and jump straight to /pay/return.
 */
export function PaySheet({
  slug,
  totalMinor,
  sellerFirstName,
}: {
  slug: string
  totalMinor: Minor
  sellerFirstName: string
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [phone, setPhone] = React.useState<string | null>(null)
  const [errors, setErrors] = React.useState<{ name?: string; phone?: string; email?: string }>({})
  const payLabel = `Pay ${formatGHS(totalMinor)} into Hotoso`

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const email = String(form.get("email") ?? "").trim()
    const next: typeof errors = {}
    if (name.length < 2) next.name = `Tell us your name so ${sellerFirstName} knows who's buying.`
    if (!phone) next.phone = "Enter a Ghana mobile number, like 055 123 4987."
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter an email like kwame@example.com. Your deal room link goes there."
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    // MOCK: pretend the backend answered with a reference, skip Paystack.
    router.push(`/pay/return?reference=HTS-PAY-01JDSMB40X&deal=${slug}&demo=success`)
  }

  return (
    <>
      {/* Desktop: inline button */}
      <div className="hidden flex-col gap-2 lg:flex">
        <Button size="lg" width="full" onClick={() => setOpen(true)}>
          {payLabel}
        </Button>
        <p className="text-sm text-ink-2">
          {sellerFirstName} gets paid only after you confirm you received it.
        </p>
      </div>

      {/* Phone: sticky bar, always visible, so the price is never out of sight */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-paper px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <Button size="lg" width="full" onClick={() => setOpen(true)}>
          {payLabel}
        </Button>
        <p className="mt-1.5 text-center text-sm text-ink-2">
          {sellerFirstName} is paid only after you confirm.
        </p>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="responsive">
          <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
            <SheetHeader>
              <SheetTitle>Your details</SheetTitle>
              <SheetDescription>So {sellerFirstName} can deliver, and we can send you your deal room link.</SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-5 overflow-y-auto px-5 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pay-name">Full name</Label>
                <Input
                  id="pay-name"
                  name="name"
                  autoComplete="name"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "pay-name-err" : undefined}
                />
                {errors.name && <p id="pay-name-err" className="text-sm font-medium text-clay">{errors.name}</p>}
              </div>
              <PhoneInput label="Phone number" name="phone" error={errors.phone} onValueChange={setPhone} />
              <div className="flex flex-col gap-2">
                <Label htmlFor="pay-email">Email</Label>
                <Input
                  id="pay-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "pay-email-err" : "pay-email-hint"}
                />
                {errors.email ? (
                  <p id="pay-email-err" className="text-sm font-medium text-clay">{errors.email}</p>
                ) : (
                  <p id="pay-email-hint" className="text-sm text-ink-2">We email your private deal room link here.</p>
                )}
              </div>
            </div>

            <SheetFooter>
              <Button type="submit" size="lg" width="full" disabled={submitting}>
                {submitting ? "Opening Paystack…" : "Continue to Paystack"}
              </Button>
              <p className="flex items-start gap-2 text-sm text-ink-2 [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0">
                <Lock aria-hidden="true" />
                You&apos;ll pay on Paystack&apos;s secure page. Hotoso never sees your card or MoMo PIN.
              </p>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
