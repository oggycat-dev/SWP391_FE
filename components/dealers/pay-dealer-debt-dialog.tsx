"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePayDealerDebt } from "@/hooks/use-dealer-debts"
import type { DealerDebt } from "@/lib/types/dealer"

const formSchema = z.object({
  paymentAmount: z.string().min(1, "Payment amount is required"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface PayDealerDebtDialogProps {
  debt: DealerDebt | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PayDealerDebtDialog({
  debt,
  open,
  onOpenChange,
}: PayDealerDebtDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const payMutation = usePayDealerDebt()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentAmount: "",
      notes: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    if (!debt) return

    const paymentAmount = parseFloat(values.paymentAmount)
    if (paymentAmount > debt.remainingAmount) {
      form.setError("paymentAmount", {
        message: `Payment cannot exceed remaining amount (${formatCurrency(debt.remainingAmount)})`,
      })
      return
    }

    setIsSubmitting(true)
    try {
      await payMutation.mutateAsync({
        id: debt.id,
        data: {
          paymentAmount,
          notes: values.notes,
        },
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to record payment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a payment for debt {debt?.debtCode}
          </DialogDescription>
        </DialogHeader>
        {debt && (
          <div className="space-y-2 rounded-lg border p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dealer:</span>
              <span className="font-medium">{debt.dealerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Debt:</span>
              <span className="font-medium">{formatCurrency(debt.totalDebt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paid Amount:</span>
              <span className="font-medium">{formatCurrency(debt.paidAmount)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-muted-foreground">Remaining:</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(debt.remainingAmount)}
              </span>
            </div>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="paymentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add payment notes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Record Payment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
