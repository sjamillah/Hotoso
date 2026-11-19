"use client"

import { RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErrorState } from "./states"

/**
 * What every error.tsx shows. Error boundaries must be Client Components,
 * because "Try again" is a button that runs code (`retry`).
 * We never show the technical error message to people: it would scare them
 * and could leak details. We say what happened and what to do.
 */
export function RouteError({ retry, title, children }: { retry: () => void; title?: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[560px] px-5 py-16">
      <ErrorState
        title={title}
        action={
          <Button variant="outline" onClick={() => retry()}>
            <RotateCw /> Try again
          </Button>
        }
      >
        {children}
      </ErrorState>
    </div>
  )
}
