"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreatePayment } from "@/hooks/use-payments"
import { useOrder } from "@/hooks/use-orders"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { PaymentType } from "@/lib/api/payments"

const paymentSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  paymentType: z.nativeEnum(PaymentType),
  paymentDate: z.string().min(1, "Payment date is required"),
  transactionReference: z.string().optional(),
  notes: z.string().optional(),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

interface CreatePaymentDialogProps {
  children: React.ReactNode
  orderId: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function CreatePaymentDialog({
  children,
  orderId,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: CreatePaymentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const { mutate, isLoading } = useCreatePayment()
  const { toast } = useToast()
  const { data: order } = useOrder(orderId)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: order?.totalAmount || 0,
      paymentType: PaymentType.Cash,
      paymentDate: new Date().toISOString().split("T")[0],
      transactionReference: "",
      notes: "",
    },
  })

  // Update amount when order changes
  useState(() => {
    if (order) {
      form.setValue("amount", order.totalAmount)
    }
  })

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      await mutate({
        orderId,
        amount: data.amount,
        paymentType: data.paymentType,
        paymentDate: data.paymentDate,
        transactionReference: data.transactionReference || undefined,
        notes: data.notes || undefined,
      })

      toast({
        title: "Success",
        description: "Payment recorded successfully",
      })

      form.reset()
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to record payment",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>Record a payment for order {orderId.substring(0, 8).toUpperCase()}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Order total: ${order?.totalAmount.toLocaleString() || "0"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PaymentType.Cash}>Cash</SelectItem>
                      <SelectItem value={PaymentType.BankTransfer}>Bank Transfer</SelectItem>
                      <SelectItem value={PaymentType.CreditCard}>Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transactionReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Reference</FormLabel>
                  <FormControl>
                    <Input placeholder="Transaction ID or reference number" {...field} />
                  </FormControl>
                  <FormDescription>Optional: For bank transfers or credit card payments</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Record Payment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

