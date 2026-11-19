import { createCn } from "cn/config"

/**
 * `cn()` joins class names and removes conflicting Tailwind classes, so that
 * cn("h-8", "h-12") → "h-12" (the last one wins).
 *
 * It decides what "conflicts" by guessing from the class name. Out of the box
 * it knows `text-sm` is a SIZE, but it would guess our custom `text-amount`
 * is a COLOUR (like `text-ink`), and then silently drop one of them.
 * So we tell it about our custom size and radius names here.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["amount"] }],
    },
  },
})
