import { AppProviders } from "@/components/hotoso/app-providers"

/** Wraps every page in this folder with toasts + tooltips (see AppProviders). */
export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>
}
