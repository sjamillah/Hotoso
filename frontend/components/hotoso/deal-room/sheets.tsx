"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Copy, ImagePlus, MessageCircle, QrCode, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PhoneInput } from "../phone-input"

function useMockAction(nextHref: string, message: string) {
  const router = useRouter()
  return () => {
    toast.success(message)
    router.push(nextHref)
  }
}

export function ReleaseSheet({ amount, sellerFirstName, nextHref }: { amount: string; sellerFirstName: string; nextHref: string }) {
  const release = useMockAction(nextHref, `Releasing ${amount} to ${sellerFirstName}`)
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" width="full">I got it, release payment</Button>
      </SheetTrigger>
      <SheetContent side="responsive">
        <SheetHeader>
          <SheetTitle>Release {amount} to {sellerFirstName}?</SheetTitle>
          <SheetDescription>
            The money goes to {sellerFirstName}&apos;s MoMo. You can&apos;t undo this, so only release it if your order
            arrived as described.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button size="lg" width="full" onClick={release}>Yes, release {amount}</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline" size="lg" width="full">Not yet</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function EvidenceSheet({ triggerLabel, title, description, nextHref }: { triggerLabel: string; title: string; description: string; nextHref: string }) {
  const send = useMockAction(nextHref, "Added. We'll look at it with the rest.")
  const [files, setFiles] = React.useState<string[]>([])
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" width="full">{triggerLabel}</Button>
      </SheetTrigger>
      <SheetContent side="responsive">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex flex-1 flex-col"
        >
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-5 px-5 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="evidence-note">What should we know?</Label>
              <Textarea id="evidence-note" name="note" required />
            </div>
            <PhotoPicker id="evidence-photos" files={files} onChange={setFiles} />
          </div>
          <SheetFooter>
            <Button type="submit" size="lg" width="full">Send to Hotoso</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export function PhotoPicker({ id, files, onChange, label = "Photos (optional, but they help)" }: { id: string; files: string[]; onChange: (names: string[]) => void; label?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <label
        htmlFor={id}
        className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-ink-3 bg-card text-base font-medium text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink [&_svg]:size-5"
      >
        <ImagePlus aria-hidden="true" /> Add photos
        <input
          id={id}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => onChange(Array.from(e.target.files ?? []).map((f) => f.name))}
        />
      </label>
      {files.length > 0 && <p className="label-mono text-ink-2">{files.length} photo{files.length > 1 ? "s" : ""} added</p>}
    </div>
  )
}

export function ShipSheet({ buyerFirstName, hours, nextHref }: { buyerFirstName: string; hours: number; nextHref: string }) {
  const ship = useMockAction(nextHref, `Marked as shipped. We told ${buyerFirstName}.`)
  const [files, setFiles] = React.useState<string[]>([])
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" width="full"><Truck /> Mark as shipped</Button>
      </SheetTrigger>
      <SheetContent side="responsive">
        <form onSubmit={(e) => { e.preventDefault(); ship() }} className="flex flex-1 flex-col">
          <SheetHeader>
            <SheetTitle>Mark as shipped</SheetTitle>
            <SheetDescription>
              We&apos;ll tell {buyerFirstName}. If there&apos;s no problem, the money is released to you {hours} hours from now.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-5 px-5 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ship-note">Note for {buyerFirstName} (optional)</Label>
              <Textarea id="ship-note" name="note" placeholder="Sent with VIP bus. Rider: 024 555 0187" className="min-h-20" />
            </div>
            <PhotoPicker id="ship-proof" files={files} onChange={setFiles} label="Proof photo (optional)" />
          </div>
          <SheetFooter>
            <Button type="submit" size="lg" width="full">Confirm it&apos;s shipped</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export function PayoutNumberSheet({ current }: { current: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" width="full">Check your number</Button>
      </SheetTrigger>
      <SheetContent side="responsive">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            toast.success("Saved. We'll retry the payout to this number.")
          }}
          className="flex flex-1 flex-col"
        >
          <SheetHeader>
            <SheetTitle>Your payout number</SheetTitle>
            <SheetDescription>This is where Hotoso sends your money. We have {current} on file.</SheetDescription>
          </SheetHeader>
          <div className="px-5 py-2">
            <PhoneInput label="MoMo number" name="payout_number" defaultValue="024 555 0187" />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" size="lg" width="full">Save and retry</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export function ShareSheet({
  url,
  title,
  amount,
  trigger,
  open,
  onOpenChange,
  doneHref,
}: {
  url: string
  title: string
  amount: string
  doneHref?: string
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [showQr, setShowQr] = React.useState(false)
  const message = `${title}, ${amount}. Pay safely with Hotoso: your money waits until you get it. ${url}`
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(message)}`

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied")
    } catch {
      toast.error("Couldn't copy. Press and hold the link to copy it.")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger !== null && (
        <SheetTrigger asChild>
          {trigger ?? <Button size="lg" width="full">Share link</Button>}
        </SheetTrigger>
      )}
      <SheetContent side="responsive">
        <SheetHeader>
          <p className="label-caps text-ink-2">Your link is ready</p>
          <SheetTitle className="break-all font-mono text-lg font-normal">{url.replace(/^https?:\/\//, "")}</SheetTitle>
          <SheetDescription className="sr-only">Share this link with your buyer</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-5 py-2">
          <Button size="lg" width="full" asChild>
            <a href={whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle /> Share to WhatsApp
            </a>
          </Button>
          <Button variant="outline" size="lg" width="full" onClick={copy}>
            <Copy /> Copy link
          </Button>
          <Button variant="ghost" width="full" onClick={() => setShowQr((v) => !v)} aria-expanded={showQr}>
            <QrCode /> {showQr ? "Hide QR code" : "Show QR code"}
          </Button>
          {showQr && (
            <div className="flex flex-col items-center gap-2 rounded-md border border-rule bg-card p-5">
              <MockQr />
              <p className="text-sm text-ink-2">Buyers can scan this at a pop-up or market stall.</p>
            </div>
          )}
        </div>
        <SheetFooter>
          {doneHref && (
            <Button variant="outline" size="lg" width="full" asChild>
              <a href={doneHref}>Done, go to my deals</a>
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function MockQr() {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21, y = Math.floor(i / 21)
    const finder = (cx: number, cy: number) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7 && (x === cx || x === cx + 6 || y === cy || y === cy + 6 || (x >= cx + 2 && x <= cx + 4 && y >= cy + 2 && y <= cy + 4))
    if (finder(0, 0) || finder(14, 0) || finder(0, 14)) return true
    if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) return false
    return (x * 7 + y * 13 + x * y) % 5 < 2
  })
  return (
    <svg viewBox="0 0 21 21" className="size-44" role="img" aria-label="QR code placeholder">
      {cells.map((on, i) => on && <rect key={i} x={i % 21} y={Math.floor(i / 21)} width="1" height="1" className="fill-ink" />)}
    </svg>
  )
}

export function CancelDealDialog({ nextHref }: { nextHref: string }) {
  const cancel = useMockAction(nextHref, "Deal cancelled. No money moved.")
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="quiet-danger" width="full">Cancel this deal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this deal?</DialogTitle>
          <DialogDescription>Nobody has paid yet, so no money moves. The link stops working.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Keep deal</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={cancel}>Cancel deal</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
