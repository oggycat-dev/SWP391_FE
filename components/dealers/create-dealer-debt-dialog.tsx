/**
 * Create Dealer Debt Dialog Component
 */

'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { useCreateDealerDebt } from '@/hooks/use-dealer-debts'

interface CreateDealerDebtDialogProps {
  dealerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDealerDebtDialog({ dealerId, open, onOpenChange }: CreateDealerDebtDialogProps) {
  const [formData, setFormData] = useState({
    debtAmount: 0,
    dueDate: '',
    notes: '',
  })

  const createDebtMutation = useCreateDealerDebt()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createDebtMutation.mutateAsync({
        dealerId,
        ...formData,
      })
      onOpenChange(false)
      setFormData({ debtAmount: 0, dueDate: '', notes: '' })
    } catch (error) {
      console.error('Failed to create debt:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Dealer Debt
            </DialogTitle>
            <DialogDescription>
              Record a new debt for this dealer
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="debtAmount">Debt Amount (VND) *</Label>
              <Input
                id="debtAmount"
                type="number"
                min="0"
                step="1000"
                placeholder="50000000"
                value={formData.debtAmount || ''}
                onChange={(e) => setFormData({ ...formData, debtAmount: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this debt..."
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
            <Button type="submit" disabled={createDebtMutation.isPending}>
              {createDebtMutation.isPending ? 'Creating...' : 'Create Debt'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

