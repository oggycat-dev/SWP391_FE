/**
 * Add Dealer Staff Dialog Component
 */

'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAddDealerStaff } from '@/hooks/use-dealer-staff'
import { useUsers } from '@/hooks/use-users'

interface AddDealerStaffDialogProps {
  dealerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddDealerStaffDialog({ dealerId, open, onOpenChange }: AddDealerStaffDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState('')
  
  const { data: usersData } = useUsers({ 
    role: 'DealerStaff',
    pageNumber: 1,
    pageSize: 100 
  })
  const addStaffMutation = useAddDealerStaff()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUserId) {
      return
    }

    try {
      await addStaffMutation.mutateAsync({
        userId: selectedUserId,
        dealerId,
      })
      onOpenChange(false)
      setSelectedUserId('')
    } catch (error) {
      console.error('Failed to add staff:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add Staff Member
            </DialogTitle>
            <DialogDescription>
              Select a user to add as staff member to this dealer
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User *</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId} required>
                <SelectTrigger id="userId">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {usersData?.items?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Only users with DealerStaff or DealerManager role can be added
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedUserId || addStaffMutation.isPending}>
              {addStaffMutation.isPending ? 'Adding...' : 'Add Staff'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

