import type { Metadata, Viewport } from "next"
import { Fraunces, Geist, Geist_Mono } from "next/font/google"
import { Suspense } from "react"
import { OfflineWatcher } from "@/components/hotoso/offline-watcher"
import { NavTracker } from "@/components/hotoso/nav-tracker"
import "./globals.css"

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  display: "swap",
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

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

export const viewport: Viewport = {
  themeColor: "#282C20",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GH"
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh" suppressHydrationWarning>
        <OfflineWatcher />
        <Suspense fallback={null}>
          <NavTracker />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
