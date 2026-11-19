"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export function OverlayDemos() {
  return (
    <div className="flex flex-wrap gap-3">
      <Sheet>
        <SheetTrigger asChild>
          <Button>I got it, release payment</Button>
        </SheetTrigger>
        <SheetContent side="responsive">
          <SheetHeader>
            <SheetTitle>Release GHS 450 to Ama?</SheetTitle>
            <SheetDescription>
              The money goes to Ama&apos;s MoMo. You can&apos;t undo this, so only release it if your order arrived as
              described.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose asChild>
              <Button size="lg" width="full">
                Yes, release GHS 450
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="outline" size="lg" width="full">
                Not yet
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">How it works (drawer)</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>How Hotoso works</DrawerTitle>
            <DrawerDescription>
              You pay into Hotoso. Ama ships. When you say you got it, or after 72 hours (shoes) with no problem, Ama gets
              paid.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button size="lg" width="full">
                Got it
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Dialog (desktop)</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this deal?</DialogTitle>
            <DialogDescription>Nobody has paid yet, so no money moves. You can create a new link any time.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep deal</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Cancel deal</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="ghost" onClick={() => toast.success("Link copied")}>
        Show a toast
      </Button>
    </div>
  )
}

export function TabsDemo() {
  return (
    <Tabs defaultValue="ship">
      <TabsList>
        <TabsTrigger value="ship">
          Ship now <Badge>2</Badge>
        </TabsTrigger>
        <TabsTrigger value="awaiting">Awaiting payment</TabsTrigger>
        <TabsTrigger value="progress">In progress</TabsTrigger>
        <TabsTrigger value="done">Done</TabsTrigger>
        <TabsTrigger value="problems">Problems</TabsTrigger>
      </TabsList>
      <TabsContent value="ship">2 deals are paid and waiting for you to ship.</TabsContent>
      <TabsContent value="awaiting">1 link is waiting for a buyer to pay.</TabsContent>
      <TabsContent value="progress">3 deals are on the way.</TabsContent>
      <TabsContent value="done">12 deals finished this month.</TabsContent>
      <TabsContent value="problems">No problems. Nice.</TabsContent>
    </Tabs>
  )
}

export function CarouselDemo() {
  const tones = ["bg-muted", "bg-butter-soft", "bg-sky-soft", "bg-wait-soft"]
  return (
    <Carousel className="w-full max-w-sm">
      <CarouselContent>
        {tones.map((tone, i) => (
          <CarouselItem key={tone}>
            <div className={`flex aspect-[4/5] items-end rounded-md p-4 ${tone}`}>
              <span className="label-mono rounded-full bg-ink px-2.5 py-1 text-paper">
                {i + 1} / {tones.length}
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
