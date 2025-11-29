/**
 * Create Discount Policy Dialog Component
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
import { useCreateDealerDiscountPolicy } from '@/hooks/use-dealer-discount-policies'

interface CreateDiscountPolicyDialogProps {
  dealerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDiscountPolicyDialog({ dealerId, open, onOpenChange }: CreateDiscountPolicyDialogProps) {
  const [formData, setFormData] = useState({
    discountRate: 0,
    minOrderQuantity: 1,
    maxDiscountAmount: 0,
    effectiveDate: '',
    expiryDate: '',
    conditions: '',
  })

  const createPolicyMutation = useCreateDealerDiscountPolicy()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createPolicyMutation.mutateAsync({
        dealerId,
        ...formData,
      })
      onOpenChange(false)
      setFormData({
        discountRate: 0,
        minOrderQuantity: 1,
        maxDiscountAmount: 0,
        effectiveDate: '',
        expiryDate: '',
        conditions: '',
      })
    } catch (error) {
      console.error('Failed to create discount policy:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Discount Policy
            </DialogTitle>
            <DialogDescription>
              Create a new discount policy for this dealer
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountRate">Discount Rate (%) *</Label>
                <Input
                  id="discountRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="5.0"
                  value={formData.discountRate || ''}
                  onChange={(e) => setFormData({ ...formData, discountRate: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minOrderQuantity">Min Order Quantity *</Label>
                <Input
                  id="minOrderQuantity"
                  type="number"
                  min="1"
                  placeholder="10"
                  value={formData.minOrderQuantity || ''}
                  onChange={(e) => setFormData({ ...formData, minOrderQuantity: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscountAmount">Max Discount Amount (VND) *</Label>
              <Input
                id="maxDiscountAmount"
                type="number"
                min="0"
                step="1000000"
                placeholder="50000000"
                value={formData.maxDiscountAmount || ''}
                onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date *</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conditions">Policy Conditions</Label>
              <Textarea
                id="conditions"
                placeholder="e.g., Applies only to VF8 Plus model, Valid for orders above 10 units..."
                rows={3}
                value={formData.conditions}
                onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPolicyMutation.isPending}>
              {createPolicyMutation.isPending ? 'Creating...' : 'Create Policy'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

