import Image from "next/image"
import { cn } from "@/lib/utils"
import type { DealPhoto } from "@/lib/types"

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
