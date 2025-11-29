/**
 * Update Contract Status Dialog Component
 */

'use client'

import { useEffect, useState } from 'react'
import { FileText, CheckCircle2 } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUpdateDealerContractStatus } from '@/hooks/use-dealer-contracts'
import type { DealerContractDto } from '@/lib/api/dealer-contracts'

interface UpdateContractStatusDialogProps {
  contract: DealerContractDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusOptions = [
  { value: '0', label: 'Draft', description: 'Contract is in draft status' },
  { value: '1', label: 'Active', description: 'Contract is currently active' },
  { value: '2', label: 'Expired', description: 'Contract has expired' },
  { value: '3', label: 'Terminated', description: 'Contract has been terminated' },
]

export function UpdateContractStatusDialog({ 
  contract, 
  open, 
  onOpenChange 
}: UpdateContractStatusDialogProps) {
  const [formData, setFormData] = useState({
    status: '1',
    signedBy: '',
  })

  const updateStatusMutation = useUpdateDealerContractStatus()

  useEffect(() => {
    if (contract) {
      setFormData({
        status: String(contract.status),
        signedBy: contract.signedBy || '',
      })
    }
  }, [contract])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contract) return

    try {
      await updateStatusMutation.mutateAsync({
        id: contract.id,
        data: {
          status: Number(formData.status),
          signedBy: formData.signedBy || undefined,
        },
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update contract status:', error)
    }
  }

  const selectedStatus = statusOptions.find(s => s.value === formData.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Update Contract Status
            </DialogTitle>
            <DialogDescription>
              Update the status for contract {contract?.contractNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Current Contract Info */}
            {contract && (
              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Dealer:</span>
                  <span className="font-medium">{contract.dealerName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Contract Number:</span>
                  <span className="font-mono font-medium">{contract.contractNumber}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Commission Rate:</span>
                  <span className="font-medium">{contract.commissionRate.toFixed(1)}%</span>
                </div>
              </div>
            )}

            {/* Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="status">Contract Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                required
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedStatus && (
                <p className="text-xs text-muted-foreground">
                  {selectedStatus.description}
                </p>
              )}
            </div>

            {/* Signed By (optional for Active status) */}
            {formData.status === '1' && (
              <div className="space-y-2">
                <Label htmlFor="signedBy">Signed By</Label>
                <Input
                  id="signedBy"
                  placeholder="e.g., CEO Tesla Vietnam - Nguyen Van A"
                  value={formData.signedBy}
                  onChange={(e) => setFormData({ ...formData, signedBy: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Name and title of the person who signed this contract
                </p>
              </div>
            )}

            {/* Warning for status change */}
            {contract && String(contract.status) !== formData.status && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950 p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    <p className="font-medium">Status will be changed</p>
                    <p className="mt-1">
                      From <span className="font-medium">{statusOptions.find(s => s.value === String(contract.status))?.label}</span>
                      {' → '}
                      To <span className="font-medium">{selectedStatus?.label}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateStatusMutation.isPending}>
              {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

