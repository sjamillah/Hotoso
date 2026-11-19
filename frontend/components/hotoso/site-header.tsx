import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Wordmark } from "./wordmark"

export function PublicHeader({ right, back, className }: { right?: React.ReactNode; back?: React.ReactNode; className?: string }) {
  return (
    <header className={cn("mx-auto flex h-14 max-w-[1120px] items-center justify-between gap-4 px-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8", className)}>
      {back ? <div className="flex items-center lg:justify-self-start">{back}</div> : <span className="hidden lg:block" />}
      <Link href="/" aria-label="Hotoso home" className="mr-auto -ml-1 flex h-11 items-center rounded-xs px-1 lg:mr-0 lg:ml-0">
        <Wordmark />
      </Link>
      <div className="flex justify-end">{right}</div>
    </header>
  )
}

export function RoomHeader({ slug, backHref, label, wide = false }: { slug: string; backHref?: string; label?: string; wide?: boolean }) {
  return (
    <header className={cn("mx-auto flex h-14 items-center justify-between gap-3 px-5 lg:px-8", wide ? "max-w-[1280px]" : "max-w-[1120px]")}>
      <div className="flex items-center gap-1">
        {backHref && (
          <Link href={backHref} aria-label="Back to your deals" className="-ml-3 flex size-11 items-center justify-center rounded-sm text-ink hover:bg-muted">
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>
        )}
        <Link href="/" aria-label="Hotoso home" className="flex h-11 items-center rounded-xs px-1">
          <Wordmark className="text-xl" />
        </Link>
      </div>
      <span className="label-mono text-ink-2">{label ?? `Deal ${slug}`}</span>
    </header>
  )
}

export function SellerHeader({ name = "Ama Owusu" }: { name?: string }) {
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2)
  return (
    <header className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5 lg:px-8">
      <Link href="/seller" aria-label="Your deals" className="-ml-1 flex h-11 items-center rounded-xs px-1">
        <Wordmark className="text-xl" />
      </Link>
      <div className="flex items-center gap-3">
        <Button size="sm" asChild className="hidden lg:inline-flex">
          <Link href="/seller/deals/new">
            <Plus /> New deal
          </Link>
        </Button>
        <Avatar size="sm" aria-label={name}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
