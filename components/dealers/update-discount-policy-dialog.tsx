/**
 * Update Discount Policy Dialog Component
 */

'use client'

import { useEffect, useState } from 'react'
import { Edit2 } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import { useUpdateDealerDiscountPolicy } from '@/hooks/use-dealer-discount-policies'
import type { DealerDiscountPolicy } from '@/lib/api/dealer-discount-policies'

interface UpdateDiscountPolicyDialogProps {
  policy: DealerDiscountPolicy | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateDiscountPolicyDialog({ policy, open, onOpenChange }: UpdateDiscountPolicyDialogProps) {
  const [formData, setFormData] = useState({
    discountRate: 0,
    minOrderQuantity: 1,
    maxDiscountAmount: 0,
    effectiveDate: '',
    expiryDate: '',
    isActive: true,
    conditions: '',
  })

  const updatePolicyMutation = useUpdateDealerDiscountPolicy()

  useEffect(() => {
    if (policy) {
      setFormData({
        discountRate: policy.discountRate,
        minOrderQuantity: policy.minOrderQuantity,
        maxDiscountAmount: policy.maxDiscountAmount,
        effectiveDate: policy.effectiveDate.split('T')[0],
        expiryDate: policy.expiryDate.split('T')[0],
        isActive: policy.isActive,
        conditions: policy.conditions || '',
      })
    }
  }, [policy])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!policy) return

    try {
      await updatePolicyMutation.mutateAsync({
        id: policy.id,
        data: formData,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update discount policy:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5" />
              Update Discount Policy
            </DialogTitle>
            <DialogDescription>
              Update discount policy settings
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountRate">Discount Rate (%)</Label>
                <Input
                  id="discountRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.discountRate}
                  onChange={(e) => setFormData({ ...formData, discountRate: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minOrderQuantity">Min Order Quantity</Label>
                <Input
                  id="minOrderQuantity"
                  type="number"
                  min="1"
                  value={formData.minOrderQuantity}
                  onChange={(e) => setFormData({ ...formData, minOrderQuantity: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscountAmount">Max Discount Amount (VND)</Label>
              <Input
                id="maxDiscountAmount"
                type="number"
                min="0"
                step="1000000"
                value={formData.maxDiscountAmount}
                onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conditions">Policy Conditions</Label>
              <Textarea
                id="conditions"
                placeholder="Additional conditions..."
                rows={3}
                value={formData.conditions}
                onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between space-y-2">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Active Status</Label>
                <p className="text-xs text-muted-foreground">
                  Policy will only apply when active
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updatePolicyMutation.isPending}>
              {updatePolicyMutation.isPending ? 'Updating...' : 'Update Policy'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

