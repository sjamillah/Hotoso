import {
  Armchair,
  Baby,
  BookOpen,
  Car,
  Dumbbell,
  Footprints,
  HandHeart,
  Recycle,
  Scissors,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Wheat,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CATEGORIES, type CategoryCode } from "@/lib/categories"

/** One icon per category (doc 08 §1). */
export const CATEGORY_ICONS: Record<CategoryCode, LucideIcon> = {
  fashion: Shirt,
  shoes: Footprints,
  bags_accessories: ShoppingBag,
  hair: Scissors,
  beauty: Sparkles,
  electronics: Smartphone,
  home: Armchair,
  baby_kids: Baby,
  books: BookOpen,
  crafts: HandHeart,
  preloved: Recycle,
  sports: Dumbbell,
  auto_parts: Car,
  bulk_goods: Wheat,
}

/** A quiet tag: icon + short category name. */
export function CategoryTag({ code, className }: { code: CategoryCode; className?: string }) {
  const Icon = CATEGORY_ICONS[code]
  return (
    <span className={cn("label-caps inline-flex items-center gap-1.5 text-ink-2 [&_svg]:size-3.5", className)}>
      <Icon aria-hidden="true" /> {CATEGORIES[code].short}
    </span>
  )
}
