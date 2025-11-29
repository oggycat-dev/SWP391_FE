/**
 * Dealer Contracts Tab Component
 */

'use client'

import { useState } from 'react'
import { FileText, Calendar, TrendingUp, Edit2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDealerContracts } from '@/hooks/use-dealer-contracts'
import { DealerContractDetailDialog } from '../dealer-contract-detail-dialog'
import { UpdateContractStatusDialog } from '../update-contract-status-dialog'
import type { DealerContractDto } from '@/lib/api/dealer-contracts'

interface DealerContractsTabProps {
  dealerId: string
  dealerName: string
}

export function DealerContractsTab({ dealerId, dealerName }: DealerContractsTabProps) {
  const { data: contracts, isLoading } = useDealerContracts({ dealerId })
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<DealerContractDto | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusLabel = (status: DealerContractStatus | string | number): string => {
    if (typeof status === 'string') {
      // If already a string, return as is
      return status
    }
    
    // If number or enum, convert to string
    const statusNum = typeof status === 'number' ? status : Number(status)
    switch (statusNum) {
      case 0:
        return 'Draft'
      case 1:
        return 'Active'
      case 2:
        return 'Expired'
      case 3:
        return 'Terminated'
      default:
        return 'Unknown'
    }
  }

  const getStatusVariant = (status: DealerContractStatus | string | number) => {
    const statusNum = typeof status === 'number' ? status : 
                     typeof status === 'string' ? 
                       (status === 'Active' ? 1 : 
                        status === 'Expired' ? 2 : 
                        status === 'Terminated' ? 3 : 0) : 
                     Number(status)
    
    switch (statusNum) {
      case 1: // Active
        return 'default'
      case 2: // Expired
        return 'secondary'
      case 3: // Terminated
        return 'destructive'
      default: // Draft
        return 'outline'
    }
  }

  const handleViewDetails = (contract: DealerContractDto) => {
    setSelectedContract(contract)
    setDetailDialogOpen(true)
  }

  const handleUpdateStatus = (contract: DealerContractDto) => {
    setSelectedContract(contract)
    setUpdateStatusDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (!contracts || contracts.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">No contracts</p>
        <p className="text-sm text-muted-foreground mt-1">
          No contracts found for this dealer
        </p>
      </div>
    )
  }

  const activeContracts = contracts.filter(c => {
    const status = typeof c.status === 'number' ? c.status : 
                   c.status === 'Active' ? 1 : 0
    return status === 1
  }).length
  
  const expiredContracts = contracts.filter(c => {
    const status = typeof c.status === 'number' ? c.status : 
                   c.status === 'Expired' ? 2 : 0
    return status === 2
  }).length

  return (
    <>
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Contracts</p>
                <p className="text-2xl font-bold">{contracts.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeContracts}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/10">
                <FileText className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-gray-600">{expiredContracts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract Code</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => {
                const isExpiringSoon = new Date(contract.endDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                
                return (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <div>
                        <p className="font-mono font-medium">{contract.contractCode}</p>
                        {contract.terms && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {contract.terms}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(contract.startDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className={`text-sm ${
                          isExpiringSoon ? 'text-orange-600 font-medium' : 'text-muted-foreground'
                        }`}>
                          {formatDate(contract.endDate)}
                        </span>
                      </div>
                      {isExpiringSoon && contract.status === 'Active' && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Expiring Soon
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <Badge variant="outline" className="font-mono">
                          {contract.commissionRate.toFixed(1)}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(contract.status)}>
                        {getStatusLabel(contract.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(contract)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(contract)}
                        >
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <DealerContractDetailDialog
        contract={selectedContract}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

      <UpdateContractStatusDialog
        contract={selectedContract}
        open={updateStatusDialogOpen}
        onOpenChange={setUpdateStatusDialogOpen}
      />
    </>
  )
}

