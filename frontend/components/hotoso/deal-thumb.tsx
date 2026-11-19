import Image from "next/image"
import { cn } from "@/lib/utils"
import type { DealPhoto } from "@/lib/types"

/**
 * A small square photo of a deal (list rows, item cards).
 * `sizes` is small, so phones download a tiny file for a tiny box.
 */
export function DealThumb({ photo, size = 48, className }: { photo?: DealPhoto; size?: number; className?: string }) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-sm bg-muted", className)} style={{ width: size, height: size }}>
      {photo && (
        <Image
          src={photo.src}
          alt=""
          fill
          sizes={`${size * 2}px`}
          placeholder={typeof photo.src === "string" ? "empty" : "blur"}
          className="object-cover"
        />
      )}
    </div>
  )
}
