"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { formatAmount, parseGhsInput, type Minor } from "@/lib/money"
import { Label } from "@/components/ui/label"

export function MoneyInput({
  label,
  name,
  defaultMinor,
  description,
  error,
  onValueChange,
  className,
  ...inputProps
}: {
  label: string
  name: string
  defaultMinor?: Minor
  description?: React.ReactNode
  error?: string
  onValueChange?: (minor: Minor | null) => void
  className?: string
} & Omit<React.ComponentProps<"input">, "name" | "defaultValue" | "value" | "onChange" | "type">) {
  const id = React.useId()
  const [text, setText] = React.useState(defaultMinor != null ? formatAmount(defaultMinor) : "")
  const minor = parseGhsInput(text)
  const descId = description ? `${id}-desc` : undefined
  const errId = error ? `${id}-err` : undefined

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div
        className={cn(
          "flex h-12 items-stretch overflow-hidden rounded-sm border bg-card transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
          error ? "border-clay" : "border-rule"
        )}
      >
        <span aria-hidden="true" className="flex items-center border-r border-rule px-3.5 font-mono text-sm text-ink-2">
          GHS
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errId, descId].filter(Boolean).join(" ") || undefined}
          onChange={(e) => {
            setText(e.target.value)
            onValueChange?.(parseGhsInput(e.target.value))
          }}
          onBlur={() => {
            if (minor != null) setText(formatAmount(minor))
          }}
          className="min-w-0 flex-1 bg-transparent px-3.5 font-mono text-base text-ink tabular-nums outline-none placeholder:text-ink-3 focus-visible:outline-none"
          {...inputProps}
        />
        <input type="hidden" name={`${name}_minor`} value={minor ?? ""} />
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
