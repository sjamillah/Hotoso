import type { Metadata, Viewport } from "next"
import { Fraunces, Geist, Geist_Mono } from "next/font/google"
import { Suspense } from "react"
import { OfflineWatcher } from "@/components/hotoso/offline-watcher"
import { NavTracker } from "@/components/hotoso/nav-tracker"
import "./globals.css"

// Display serif for amounts and ceremonial headlines.
// No `weight` = load the variable font, so every weight 100–900 is available.
// `axes` adds Fraunces's extra settings: optical size (opsz) and softness (SOFT).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"], // italic = the editorial "middle voice" for quotes
  display: "swap",
})

// UI / body text
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

// Numbers, references, timestamps (the "receipt" font)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

// Social previews (WhatsApp!) need FULL image URLs, e.g. https://hotoso.app/opengraph-image.jpg.
// Set NEXT_PUBLIC_SITE_URL when the site is deployed.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Hotoso",
  title: {
    default: "Hotoso: pay sellers you've never met",
    template: "%s · Hotoso",
  },
  description:
    "Your money waits with Hotoso until your order arrives. Then the seller gets paid.",
  openGraph: {
    type: "website",
    siteName: "Hotoso",
    locale: "en_GH",
  },
  twitter: { card: "summary_large_image" },
}

// The phone's browser bar takes our ink colour (raw hex: metadata can't read CSS tokens).
export const viewport: Viewport = {
  themeColor: "#282C20",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: browser extensions (Grammarly, password
    // managers, translators…) add attributes to <html>/<body> before React
    // starts, which React would report as a "hydration mismatch". This only
    // ignores ATTRIBUTE differences on these two tags; everything inside the
    // page is still checked.
    <html
      lang="en-GH"
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh" suppressHydrationWarning>
        {/* Only tiny, truly global things live here: every visitor downloads them. */}
        <OfflineWatcher />
        <Suspense fallback={null}>
          <NavTracker />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
