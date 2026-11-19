"use client"

import { RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErrorState } from "./states"

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
