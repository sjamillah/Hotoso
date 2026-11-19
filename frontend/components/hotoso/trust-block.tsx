import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export type SellerSummary = {
  name: string
  handle: string
  avatarUrl?: string
  dealsCompleted: number
  problems: number
  memberSince: string
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function TrustBlock({ seller, className }: { seller: SellerSummary; className?: string }) {
  const isNew = seller.dealsCompleted === 0
  const firstName = seller.name.split(" ")[0]

  return (
    <section aria-label={`About the seller, ${seller.name}`} className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          {seller.avatarUrl && <AvatarImage src={seller.avatarUrl} alt="" />}
          <AvatarFallback>{initials(seller.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-ink">{seller.name}</p>
          <p className="truncate font-mono text-sm text-ink-2">@{seller.handle}</p>
        </div>
      </div>

      {isNew ? (
        <div className="rounded-md border border-rule bg-card p-4">
          <p className="label-caps inline-flex h-7 items-center rounded-full bg-butter-soft px-2.5 text-ink">
            New on Hotoso
          </p>
          <p className="mt-2 text-base text-ink-2">
            {firstName} joined in {seller.memberSince}. Your money is protected the same way as with any seller.
          </p>
        </div>
      ) : (
        <dl className="grid grid-cols-3 divide-x divide-rule rounded-md border border-rule bg-card">
          <Stat value={String(seller.dealsCompleted)} label="Deals done" />
          <Stat value={String(seller.problems)} label="Problems" />
          <Stat value={seller.memberSince} label="On Hotoso since" small />
        </dl>
      )}
    </section>
  )
}

function Stat({ value, label, small }: { value: string; label: string; small?: boolean }) {
  return (
    <div className="flex flex-col-reverse items-center justify-center gap-1 px-2 py-4 text-center">
      <dt className="label-caps text-ink-2">{label}</dt>
      <dd className={cn("money text-ink", small ? "text-lg" : "text-2xl")}>{value}</dd>
    </div>
  )
}
