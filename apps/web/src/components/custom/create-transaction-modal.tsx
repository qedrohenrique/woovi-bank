"use client"
import { Button } from "@/components/ui/button"
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateTransaction } from "@/hooks/mutations/transaction"
import { useMe } from "@/hooks/queries/useMe"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatCPF, formatToBRL } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconPlus } from "@tabler/icons-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const transactionSchema = z.object({
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
  cpf: z.string().min(14, "CPF inválido").max(14, "CPF inválido"),
  description: z.string().optional(),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

export function CreateTransactionModal({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()
  const { createTransaction, isPending } = useCreateTransaction()
  const { me } = useMe()
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema
      .refine((data) => {
        if (!me?.cpf) return true
        const inputCpf = data.cpf.replace(/\D/g, "")
        const myCpf = me.cpf.replace(/\D/g, "")
        return inputCpf !== myCpf
      }, {
        message: "Você não pode enviar dinheiro para si mesmo",
        path: ["cpf"],
      })
      .refine((data) => {
        if (me?.balance === undefined || me?.balance === null) return true
        return data.amount <= me.balance
      }, {
        message: "Saldo insuficiente",
        path: ["amount"],
      })
    ),
    defaultValues: {
      amount: 0,
      cpf: "",
      description: "",
    },
  })
  React.useEffect(() => {
    if (open) {
      form.reset()
    }
  }, [open, form])

  const onSubmit = async (data: TransactionFormValues) => {
    const cleanCpf = data.cpf.replace(/\D/g, "")
    await createTransaction(data.amount, cleanCpf, data.description)
    form.reset()
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild className="mx-2">
        {children || (
          <Button>
            <IconPlus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-[425px]">
        <DrawerHeader>
          <DrawerTitle>Nova Transação</DrawerTitle>
          <DrawerDescription>
            Preencha os dados para criar uma nova transação
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="R$ 0,00"
                      inputMode="numeric"
                      value={field.value ? formatToBRL(field.value) : ""}
                      onChange={(e) => {
                        const value = e.target.value
                        const digits = value.replace(/\D/g, "")
                        const numberValue = Number(digits) / 100
                        field.onChange(numberValue)
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Digite o valor da transação em reais
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF do Destinatário</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      maxLength={14}
                      {...field}
                      onChange={(e) => {
                        field.onChange(formatCPF(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    CPF do usuário que receberá a transação
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição da transação"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Adicione uma descrição para esta transação
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DrawerFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Criando..." : "Criar Transação"}
              </Button>
              <DrawerClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
