import { AppProviders } from "@/components/hotoso/app-providers"

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>
}
