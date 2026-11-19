"use client"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * The tabs are interactive (client), but the ROWS inside each tab are
 * rendered on the server and passed in as `content`. That's the same
 * "server content inside a client shell" pattern as the How-it-works sheet.
 */
export type DealTabGroup = {
  key: string
  label: string
  count: number
  urgent?: boolean
  /** show the count without a badge (e.g. on "All") */
  quietCount?: boolean
  content: React.ReactNode
}

export function DealTabs({ groups, defaultKey }: { groups: DealTabGroup[]; defaultKey: string }) {
  return (
    <Tabs defaultValue={defaultKey}>
      <TabsList aria-label="Your deals by status">
        {groups.map((g) => (
          <TabsTrigger key={g.key} value={g.key}>
            {g.label}
            {g.count > 0 && <Badge variant={g.urgent ? "default" : g.quietCount ? "outline" : "muted"}>{g.count}</Badge>}
          </TabsTrigger>
        ))}
      </TabsList>
      {groups.map((g) => (
        <TabsContent key={g.key} value={g.key} tabIndex={-1}>
          {g.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
