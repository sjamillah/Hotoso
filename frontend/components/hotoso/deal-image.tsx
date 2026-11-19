import Image from "next/image"
import { cn } from "@/lib/utils"
import type { DealPhoto } from "@/lib/types"

/**
 * One deal photo, filling its (relatively positioned) box.
 * If the photo is a close-up crop, it zooms into the chosen spot.
 * Used by the gallery, its thumbnails, and list thumbnails, so a crop always
 * looks the same everywhere.
 */
export function DealImage({
  photo,
  sizes,
  preload = false,
  className,
}: {
  photo: DealPhoto
  sizes: string
  preload?: boolean
  className?: string
}) {
  // A close-up zooms INTO the photo, so it needs a sharper file: ask
  // next/image for a version twice as wide as the box (e.g. 600px → 1200px).
  const finalSizes = photo.crop
    ? sizes.replace(/(\d+)(px|vw)/g, (_, n: string, unit: string) => `${Number(n) * 2}${unit}`)
    : sizes
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={finalSizes}
      preload={preload}
      placeholder={typeof photo.src === "string" ? "empty" : "blur"}
      className={cn("object-cover", className)}
      style={photo.crop ? { scale: String(photo.crop.zoom), transformOrigin: photo.crop.focus } : undefined}
    />
  )
}
