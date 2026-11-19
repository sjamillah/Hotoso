import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

/**
 * Hotoso buttons (doc 04 §4.6).
 *
 * `cva` = "class variance authority": a small helper that picks a set of
 * classes from a variant name, e.g. variant="butter" → butter fill classes.
 *
 * Rules baked in here:
 * - Every size is at least 44px tall (thumb-sized hit target).
 * - `default` (ink) is THE primary action. One per screen.
 * - `butter` is for dark (ink) surfaces only: butter on paper is invisible.
 * - `outline` is the tailored secondary: thin ink border, 4px corners, caps label.
 * - `quiet-danger` is text-only clay, e.g. "Something's wrong with my order".
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap select-none font-sans transition-[background-color,color,border-color,scale] duration-150 ease-calm active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "rounded-sm bg-ink text-base font-semibold text-paper hover:bg-ink-2",
        butter:
          "rounded-sm bg-butter text-base font-semibold text-ink hover:bg-butter-soft focus-visible:outline-butter",
        outline:
          "heading-caps rounded-xs border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
        "quiet-danger":
          "rounded-sm bg-transparent px-2 text-base font-medium text-clay underline-offset-4 hover:underline",
        ghost: "rounded-sm bg-transparent text-ink hover:bg-muted",
        link: "rounded-xs bg-transparent px-1 font-medium text-ink underline underline-offset-4 hover:text-ink-2",
      },
      size: {
        default: "h-12 px-5",
        lg: "h-13 px-6",
        sm: "h-11 px-4",
        icon: "size-11",
        "icon-sm": "size-11",
        "icon-lg": "size-12",
      },
      width: {
        auto: "",
        full: "w-full",
      },
    },
    compoundVariants: [
      // caps labels look heavier than sentence case, so pad them a bit less
      { variant: "outline", size: "default", className: "px-4" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      width: "auto",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  width = "auto",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, width }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
