import type { MetadataRoute } from "next"

/**
 * The web app manifest: what Android uses when someone taps "Add to Home
 * screen". Colours are raw hex because a manifest can't read CSS tokens:
 * --ink #282C20, --paper #E8E5D8.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hotoso: pay sellers you've never met",
    short_name: "Hotoso",
    description: "Your money waits with Hotoso until your order arrives. Then the seller gets paid.",
    start_url: "/seller",
    display: "standalone",
    background_color: "#E8E5D8",
    theme_color: "#282C20",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
