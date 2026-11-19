"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * <Reveal>: shows its content with a gentle rise when it scrolls into view.
 *
 * How it works: an IntersectionObserver (a browser feature that tells you when
 * an element enters the screen) sets `data-shown` ONCE. The CSS in
 * globals.css ("MOTION SYSTEM") does the animation. Add className="print" to
 * make it print downwards like a receipt instead of rising.
 *
 * Safe by design: content is only hidden while JavaScript runs and motion is
 * allowed. Without JS, or with "reduce motion", everything simply shows.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: "div" | "section" | "li" | "p" | "span"
}) {
  const ref = React.useRef<HTMLElement>(null)
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect() // once is enough
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic ref
      ref={ref as any}
      data-shown={shown || undefined}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  )
}
