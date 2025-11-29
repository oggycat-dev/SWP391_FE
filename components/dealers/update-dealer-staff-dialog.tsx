/**
 * Update Dealer Staff Dialog Component
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
import { Switch } from '@/components/ui/switch'
import { useUpdateDealerStaff } from '@/hooks/use-dealer-staff'
import type { DealerStaff } from '@/lib/api/dealer-staff'

interface UpdateDealerStaffDialogProps {
  staff: DealerStaff | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateDealerStaffDialog({ staff, open, onOpenChange }: UpdateDealerStaffDialogProps) {
  const [formData, setFormData] = useState({
    position: '',
    salesTarget: 0,
    commissionRate: 0,
    isActive: true,
  })

  const updateStaffMutation = useUpdateDealerStaff()

  useEffect(() => {
    if (staff) {
      setFormData({
        position: staff.position || '',
        salesTarget: staff.salesTarget || 0,
        commissionRate: staff.commissionRate || 0,
        isActive: staff.isActive,
      })
    }
  }, [staff])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!staff) return

    try {
      await updateStaffMutation.mutateAsync({
        id: staff.id,
        data: formData,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update staff:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5" />
              Update Staff Member
            </DialogTitle>
            <DialogDescription>
              Update information for {staff?.fullName}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="e.g., Sales Manager, Sales Representative"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salesTarget">Sales Target (VND)</Label>
              <Input
                id="salesTarget"
                type="number"
                min="0"
                step="1000000"
                placeholder="100000000"
                value={formData.salesTarget}
                onChange={(e) => setFormData({ ...formData, salesTarget: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="5.0"
                value={formData.commissionRate}
                onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
              />
            </div>

            <div className="flex items-center justify-between space-y-2">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Active Status</Label>
                <p className="text-xs text-muted-foreground">
                  Staff member can access dealer portal when active
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
            <Button type="submit" disabled={updateStaffMutation.isPending}>
              {updateStaffMutation.isPending ? 'Updating...' : 'Update Staff'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

