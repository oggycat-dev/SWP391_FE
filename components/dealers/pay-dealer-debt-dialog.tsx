/**
 * Pay Dealer Debt Dialog Component
 */

'use client'

import { useEffect, useState } from 'react'
import { DollarSign } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePayDealerDebt } from '@/hooks/use-dealer-debts'
import type { DealerDebt } from '@/lib/api/dealer-debts'

interface PayDealerDebtDialogProps {
  debt: DealerDebt | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PayDealerDebtDialog({ debt, open, onOpenChange }: PayDealerDebtDialogProps) {
  const [formData, setFormData] = useState({
    paymentAmount: 0,
    notes: '',
  })

  const payDebtMutation = usePayDealerDebt()

  useEffect(() => {
    if (debt) {
      setFormData({
        paymentAmount: debt.remainingAmount,
        notes: '',
      })
    }
  }, [debt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!debt) return

    try {
      await payDebtMutation.mutateAsync({
        id: debt.id,
        data: formData,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to record payment:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  if (!debt) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Record Debt Payment
            </DialogTitle>
            <DialogDescription>
              Record a payment for this dealer debt
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Debt Summary */}
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Debt:</span>
                <span className="text-sm font-semibold">{formatCurrency(debt.debtAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Already Paid:</span>
                <span className="text-sm font-medium text-green-600">
                  {formatCurrency(debt.paidAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">Remaining Amount:</span>
                <span className="text-base font-bold text-orange-600">
                  {formatCurrency(debt.remainingAmount)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Payment Amount (VND) *</Label>
              <Input
                id="paymentAmount"
                type="number"
                min="0"
                max={debt.remainingAmount}
                step="1000"
                placeholder="Enter payment amount"
                value={formData.paymentAmount || ''}
                onChange={(e) => setFormData({ ...formData, paymentAmount: Number(e.target.value) })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Maximum: {formatCurrency(debt.remainingAmount)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Payment Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this payment..."
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={payDebtMutation.isPending || formData.paymentAmount <= 0}
            >
              {payDebtMutation.isPending ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

