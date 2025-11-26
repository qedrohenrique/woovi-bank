"use client"

import { AppSidebar } from "@/components/custom/app-sidebar"
import { ChartAreaInteractive } from "@/components/custom/chart-area-interactive"
import { SectionCards } from "@/components/custom/section-cards"
import { SiteHeader } from "@/components/custom/site-header"
import { TransactionsTable } from "@/components/custom/transactions-table"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useTransactions } from "@/hooks/queries/transactions"
import { Suspense } from "react"

function TransactionsContent() {
  const { transactions, isLoading } = useTransactions()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Carregando transações...</p>
      </div>
    )
  }

  return <TransactionsTable data={transactions} />
}

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <Suspense fallback={
                <div className="flex items-center justify-center p-8">
                  <p className="text-muted-foreground">Carregando transações...</p>
                </div>
              }>
                <TransactionsContent />
              </Suspense>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
