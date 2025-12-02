"use client"
import { AppSidebar } from "@/components/custom/app-sidebar"
import { BarChartTransactions } from "@/components/custom/bar-chart-transactions"
import { CreateTransactionModal } from "@/components/custom/create-transaction-modal"
import { SiteHeader } from "@/components/custom/site-header"
import { TransactionsTable } from "@/components/custom/transactions-table"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useTransactions } from "@/hooks/queries/transactions"
import { useMe } from "@/hooks/queries/useMe"
import { Suspense } from "react"

function TransactionsContent() {
  const { transactions, isLoading: isLoadingTransactions } = useTransactions()
  const { me, isLoading: isLoadingMe } = useMe()

  if (isLoadingTransactions || isLoadingMe) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Carregando transações...</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-6 p-6">
      <BarChartTransactions transactions={transactions} userAccountId={me?.accountId} />
      <TransactionsTable data={transactions} userAccountId={me?.accountId} />
    </div>
  )
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
        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Carregando transações...</p>
          </div>
        }>
          <TransactionsContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider >
  )
}
