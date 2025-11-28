"use client"

import { useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCreateInstallmentPlan } from "@/hooks/use-payments"
import { useOrder } from "@/hooks/use-orders"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Calculator } from "lucide-react"

const installmentSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  downPayment: z.number().min(0, "Down payment must be positive"),
  termMonths: z.number().min(12, "Term must be at least 12 months").max(48, "Term must be at most 48 months"),
  monthlyInterestRate: z.number().min(0, "Interest rate must be positive").max(1, "Interest rate must be less than 100%"),
  startDate: z.string().min(1, "Start date is required"),
})

type InstallmentFormValues = z.infer<typeof installmentSchema>

interface CreateInstallmentPlanDialogProps {
  children: React.ReactNode
  orderId: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

const BANK_OPTIONS = [
  "Vietcombank",
  "BIDV",
  "Vietinbank",
  "Agribank",
  "ACB",
  "Techcombank",
  "MBBank",
  "VPBank",
]

const TERM_OPTIONS = [12, 24, 36, 48]

export function CreateInstallmentPlanDialog({
  children,
  orderId,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: CreateInstallmentPlanDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const { mutate, isLoading } = useCreateInstallmentPlan()
  const { toast } = useToast()
  const { data: order } = useOrder(orderId)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const form = useForm<InstallmentFormValues>({
    resolver: zodResolver(installmentSchema),
    defaultValues: {
      bankName: "",
      downPayment: 0,
      termMonths: 24,
      monthlyInterestRate: 0.01, // 1% per month
      startDate: new Date().toISOString().split("T")[0],
    },
  })

  // Calculate installment details
  const watchedValues = form.watch()
  const orderTotal = order?.totalAmount || 0
  const downPayment = watchedValues.downPayment || 0
  const loanAmount = orderTotal - downPayment
  const monthlyRate = watchedValues.monthlyInterestRate || 0
  const termMonths = watchedValues.termMonths || 24

  // Calculate monthly payment using formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const monthlyPayment =
    loanAmount > 0 && monthlyRate > 0 && termMonths > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)
      : 0

  const totalInterest = monthlyPayment * termMonths - loanAmount
  const totalAmount = loanAmount + totalInterest

  // Set minimum down payment (20% of order total)
  useEffect(() => {
    const minDownPayment = orderTotal * 0.2
    if (downPayment < minDownPayment && downPayment === 0) {
      form.setValue("downPayment", minDownPayment)
    }
  }, [orderTotal, form])

  const onSubmit = async (data: InstallmentFormValues) => {
    // Validate down payment (minimum 20%)
    const minDownPayment = orderTotal * 0.2
    if (data.downPayment < minDownPayment) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Down payment must be at least 20% ($${minDownPayment.toLocaleString()})`,
      })
      return
    }

    try {
      await mutate({
        orderId,
        bankName: data.bankName,
        downPayment: data.downPayment,
        termMonths: data.termMonths,
        monthlyInterestRate: data.monthlyInterestRate,
        startDate: data.startDate,
      })

      toast({
        title: "Success",
        description: "Installment plan created successfully",
      })

      form.reset()
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to create installment plan",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Installment Plan</DialogTitle>
          <DialogDescription>
            Create an installment payment plan for order {orderId.substring(0, 8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BANK_OPTIONS.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="downPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Down Payment *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum: ${((orderTotal * 0.2) || 0).toLocaleString()} (20%)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term (Months) *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TERM_OPTIONS.map((term) => (
                          <SelectItem key={term} value={String(term)}>
                            {term} months
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="monthlyInterestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Interest Rate *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.001"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>e.g., 0.01 for 1% per month</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5" />
                  Installment Calculation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Total:</span>
                    <span className="font-semibold">${orderTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Down Payment:</span>
                    <span>- ${downPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loan Amount:</span>
                    <span className="font-semibold">${loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-muted-foreground">Monthly Payment:</span>
                    <span className="font-bold text-primary">${monthlyPayment.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Total Interest:</span>
                    <span>${totalInterest.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Total Amount (with interest):</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Installment Plan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

