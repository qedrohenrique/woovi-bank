"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export type Transaction = {
  id: string
  amount: number
  description: string | null
  date: string
  accountId: string
  targetAccountId: string
}

function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    days.push(date)
  }
  return days
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}

function processTransactions(transactions: Transaction[], userAccountId?: string) {
  const last7Days = getLast7Days()

  const dayData = last7Days.map(date => ({
    date: date,
    dateLabel: formatDate(date),
    entradas: 0,
    saidas: 0,
    total: 0,
  }))

  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date)
    transactionDate.setHours(0, 0, 0, 0)

    const dayIndex = last7Days.findIndex(day =>
      day.getTime() === transactionDate.getTime()
    )

    if (dayIndex !== -1) {
      const isSaida = userAccountId
        ? transaction.accountId === userAccountId
        : transaction.amount < 0

      if (isSaida) {
        dayData[dayIndex].saidas += Math.abs(transaction.amount)
        dayData[dayIndex].total -= Math.abs(transaction.amount)
      } else {
        dayData[dayIndex].entradas += Math.abs(transaction.amount)
        dayData[dayIndex].total += Math.abs(transaction.amount)
      }
    }
  })

  return dayData
}

const chartConfig = {
  total: {
    label: "Total",
  },
} satisfies ChartConfig

interface BarChartTransactionsProps {
  transactions: Transaction[]
  userAccountId?: string
}

export function BarChartTransactions({ transactions, userAccountId }: BarChartTransactionsProps) {
  const chartData = processTransactions(transactions, userAccountId)

  const totalEntradas = chartData.reduce((sum, day) => sum + day.entradas, 0)
  const totalSaidas = chartData.reduce((sum, day) => sum + day.saidas, 0)
  const saldo = totalEntradas - totalSaidas

  const maxAbsValue = Math.max(
    ...chartData.map(day => Math.abs(day.total)),
    0
  )
  const domainMax = maxAbsValue > 0 ? maxAbsValue * 1.2 : 100

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Entradas e Saídas - Últimos 7 Dias</CardTitle>
        <CardDescription className="text-xs">
          Total de entradas e saídas por dia
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <YAxis
              domain={[-domainMax, domainMax]}
              tickFormatter={(value) => `R$ ${Math.abs(value).toFixed(0)}`}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                hideIndicator
                labelFormatter={(value) => {
                  const day = chartData.find(d => d.dateLabel === value)
                  return day ? day.dateLabel : value
                }}
                formatter={(value, name, item, index, payload) => {
                  const numValue = typeof value === 'number' ? value : Number(value)
                  const day = item?.payload as typeof chartData[0] | undefined
                  if (!day) return `R$ ${Math.abs(numValue).toFixed(2).replace('.', ',')}`
                  return (
                    <div className="flex flex-col gap-1">
                      <div className="text-green-600 dark:text-green-400">
                        Entradas: R$ {day.entradas.toFixed(2).replace('.', ',')}
                      </div>
                      <div className="text-red-600 dark:text-red-400">
                        Saídas: R$ {day.saidas.toFixed(2).replace('.', ',')}
                      </div>
                      <div className="font-medium">
                        Saldo: R$ {day.total.toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  )
                }}
              />}
            />
            <Bar dataKey="total" barSize={30}>
              <LabelList position="top" dataKey="dateLabel" fillOpacity={1} className="text-[10px]" />
              {chartData.map((item, index) => (
                <Cell
                  key={index}
                  fill={item.total >= 0 ? "var(--chart-1)" : "var(--chart-2)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 pt-3 text-xs">
        <div className="flex flex-wrap gap-3 leading-none font-medium">
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <TrendingUp className="h-3 w-3" />
            Entradas: R$ {totalEntradas.toFixed(2).replace('.', ',')}
          </div>
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <TrendingDown className="h-3 w-3" />
            Saídas: R$ {totalSaidas.toFixed(2).replace('.', ',')}
          </div>
        </div>
        <div className="text-muted-foreground leading-none text-xs">
          Saldo: R$ {saldo.toFixed(2).replace('.', ',')} | Últimos 7 dias
        </div>
      </CardFooter>
    </Card>
  )
}

