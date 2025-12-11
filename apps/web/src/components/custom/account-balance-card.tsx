"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMe } from "@/hooks/queries/useMe"

export function AccountBalanceCard() {
  const { me, isLoading } = useMe()

  return (
    <div className="px-2 mb-3">
      <Card className="py-2">
        <CardContent className="px-4 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Saldo Total</span>
            {isLoading ? (
              <Skeleton className="h-6 w-28" />
            ) : (
              <span className="text-lg font-semibold">
                {me?.balance !== undefined
                  ? new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(me.balance)
                  : "R$ 0,00"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

