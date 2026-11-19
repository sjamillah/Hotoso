"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

/**
 * Toasts: small confirmations like "Link copied".
 * Hotoso has one (light) theme for now, so we don't follow the phone's dark
 * mode here. Otherwise toasts would turn black on our paper pages.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-safe" />,
        info: <InfoIcon className="size-5 text-sky" />,
        warning: <TriangleAlertIcon className="size-5 text-wait" />,
        error: <OctagonXIcon className="size-5 text-clay" />,
        loading: <Loader2Icon className="size-5 animate-spin text-ink-2" />,
      }}
      style={
        {
          "--normal-bg": "var(--ink)",
          "--normal-text": "var(--paper)",
          "--normal-border": "var(--ink)",
          "--border-radius": "8px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "font-sans !text-base",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
