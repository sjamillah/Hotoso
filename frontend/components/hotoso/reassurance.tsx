import { BadgeCheck, CreditCard, Info, Lock, ShieldCheck } from "lucide-react"
import { CATEGORIES, type CategoryCode } from "@/lib/categories"

export function Reassurance({
  sellerFirstName,
  category,
  proofs = [],
}: {
  sellerFirstName: string
  category: CategoryCode
  proofs?: string[]
}) {
  const c = CATEGORIES[category]
  const lines = [
    {
      icon: ShieldCheck,
      text: `${sellerFirstName} is paid only after you confirm, or after your ${c.inspectionHours} hours to ${c.windowWord} it with no problem.`,
    },
    { icon: Lock, text: "Problem? We freeze the money while we review it." },
    ...(c.buyerNote ? [{ icon: Info, text: c.buyerNote }] : []),
    ...proofs.map((p) => ({ icon: BadgeCheck, text: p })),
    { icon: CreditCard, text: "Payments by Paystack. Pay with MoMo or card." },
  ]
  return (
    <ul className="flex flex-col gap-3">
      {lines.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-start gap-3 text-base text-ink">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-butter-soft text-ink [&_svg]:size-3.5">
            <Icon aria-hidden="true" />
          </span>
          {text}
        </li>
      ))}
    </ul>
  )
}

export const HOW_IT_WORKS = [
  { n: "01", title: "You pay into Hotoso", body: "Your money waits with us, not with the seller." },
  { n: "02", title: "The seller ships", body: "They can see you've paid, so they know you're real." },
  { n: "03", title: "You confirm, they get paid", body: "Tap “I got it”, or when your 48 or 72 hours to check it pass with no problem, we pay the seller." },
]
