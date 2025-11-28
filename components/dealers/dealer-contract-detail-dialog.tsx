/**
 * Dealer Contract Detail Dialog Component
 */

'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DealerContractDto, DealerContractStatus } from '@/lib/api/dealer-contracts'
import { Calendar, FileText, DollarSign, User } from 'lucide-react'

interface DealerContractDetailDialogProps {
  contract: DealerContractDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getStatusBadgeVariant = (status: DealerContractStatus) => {
  switch (status) {
    case DealerContractStatus.Active:
      return 'default'
    case DealerContractStatus.Draft:
      return 'secondary'
    case DealerContractStatus.Expired:
      return 'destructive'
    case DealerContractStatus.Terminated:
      return 'outline'
    default:
      return 'secondary'
  }
}

const getStatusLabel = (status: DealerContractStatus) => {
  switch (status) {
    case DealerContractStatus.Active:
      return 'Active'
    case DealerContractStatus.Draft:
      return 'Draft'
    case DealerContractStatus.Expired:
      return 'Expired'
    case DealerContractStatus.Terminated:
      return 'Terminated'
    default:
      return 'Unknown'
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function DealerContractDetailDialog({
  contract,
  open,
  onOpenChange,
}: DealerContractDetailDialogProps) {
  if (!contract) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">Contract Details</DialogTitle>
              <DialogDescription className="mt-1">
                Contract #{contract.contractNumber}
              </DialogDescription>
            </div>
            <Badge variant={getStatusBadgeVariant(contract.status)}>
              {getStatusLabel(contract.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dealer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Dealer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Dealer Name</p>
                <p className="font-medium">{contract.dealerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dealer ID</p>
                <p className="font-medium font-mono text-sm">{contract.dealerId}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contract Period */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Contract Period
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{formatDate(contract.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">{formatDate(contract.endDate)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Commission */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Commission
            </h3>
            <div>
              <p className="text-sm text-muted-foreground">Commission Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {contract.commissionRate.toFixed(2)}%
              </p>
            </div>
          </div>

          <Separator />

          {/* Contract Terms */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Terms & Conditions
            </h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{contract.terms}</p>
            </div>
          </div>

          <Separator />

          {/* Signature Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              Signature
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Signed By</p>
                <p className="font-medium">
                  {contract.signedBy || (
                    <span className="text-muted-foreground italic">Not signed yet</span>
                  )}
                </p>
              </div>
              {contract.signedDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Signed Date</p>
                  <p className="font-medium">{formatDate(contract.signedDate)}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="text-xs text-muted-foreground">
            <p>Created: {formatDate(contract.createdAt)}</p>
            <p>Contract ID: {contract.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
