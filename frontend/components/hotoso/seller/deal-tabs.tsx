"use client"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type DealTabGroup = {
  key: string
  label: string
  count: number
  urgent?: boolean
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
