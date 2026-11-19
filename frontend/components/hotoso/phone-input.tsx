"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { detectTelco, formatAfterCountryCode, toE164, toLocalDigits } from "@/lib/phone"
import { Label } from "@/components/ui/label"

/**
 * PHONE INPUT (doc 04 §4.6): a fixed "+233" prefix and a small chip that
 * names the network as soon as the first digits are typed ("055" → MTN).
 *
 * People type numbers many ways: "055 123 4987", "0551234987",
 * "+233 55 123 4987". We accept all of them, tidy the display when you leave
 * the field, and send the international form (+233551234987) in a hidden input.
 */
export function PhoneInput({
  label,
  name,
  defaultValue = "",
  description,
  error,
  onValueChange,
  className,
  ...inputProps
}: {
  label: string
  name: string
  defaultValue?: string
  description?: React.ReactNode
  error?: string
  onValueChange?: (e164: string | null) => void
  className?: string
} & Omit<React.ComponentProps<"input">, "name" | "defaultValue" | "value" | "onChange" | "type">) {
  const id = React.useId()
  const [text, setText] = React.useState(defaultValue ? formatAfterCountryCode(defaultValue) : "")
  const digits = toLocalDigits(text)
  const telco = detectTelco(text)
  const unknownPrefix = digits.length >= 3 && !telco
  const descId = description ? `${id}-desc` : undefined
  const errId = error ? `${id}-err` : undefined
  const telcoId = `${id}-telco`

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div
        className={cn(
          "flex h-12 items-stretch overflow-hidden rounded-sm border bg-card has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
          error ? "border-clay" : "border-rule"
        )}
      >
        <span aria-hidden="true" className="flex items-center border-r border-rule px-3.5 font-mono text-sm text-ink-2">
          +233
        </span>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="55 123 4987"
          value={text}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errId, telcoId, descId].filter(Boolean).join(" ")}
          onChange={(e) => {
            setText(e.target.value)
            onValueChange?.(toE164(e.target.value))
          }}
          onBlur={() => {
            if (digits.length > 1) setText(formatAfterCountryCode(text))
          }}
          className="min-w-0 flex-1 bg-transparent px-3.5 font-mono text-base text-ink tabular-nums outline-none placeholder:text-ink-3 focus-visible:outline-none"
          {...inputProps}
        />
        {/* live region: screen readers announce the network when it appears */}
        <span id={telcoId} aria-live="polite" className="flex items-center pr-2">
          {telco && (
            <span className="label-caps inline-flex h-7 items-center rounded-full bg-butter-soft px-2.5 text-ink">
              {telco}
            </span>
          )}
          {unknownPrefix && (
            <span className="label-caps inline-flex h-7 items-center rounded-full bg-wait-soft px-2.5 text-wait">
              Check number
            </span>
          )}
        </span>
        <input type="hidden" name={name} value={toE164(text) ?? ""} />
      </div>
      {error && (
        <p id={errId} className="text-sm font-medium text-clay">
          {error}
        </p>
      )}
      {description && (
        <p id={descId} className="text-sm text-ink-2">
          {description}
        </p>
      )}
    </div>
  )
}
