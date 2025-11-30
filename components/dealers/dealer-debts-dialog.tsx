/**
 * Dealer Debts Management Dialog Component
 */

'use client'

import { useState } from 'react'
import { DollarSign, Plus, AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDealerDebts } from '@/hooks/use-dealer-debts'
import { CreateDealerDebtDialog } from './create-dealer-debt-dialog'
import { PayDealerDebtDialog } from './pay-dealer-debt-dialog'
import type { DealerDebt } from '@/lib/api/dealer-debts'

interface DealerDebtsDialogProps {
  dealerId: string | null
  dealerName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DealerDebtsDialog({ dealerId, dealerName, open, onOpenChange }: DealerDebtsDialogProps) {
  const { data: debts, isLoading } = useDealerDebts(dealerId || '')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState<DealerDebt | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: any }> = {
      'Pending': { variant: 'secondary', icon: Clock },
      'PartiallyPaid': { variant: 'outline', icon: AlertTriangle },
      'Paid': { variant: 'default', icon: CheckCircle2 },
      'Overdue': { variant: 'destructive', icon: XCircle },
    }
    const config = variants[status] || { variant: 'secondary' as const, icon: Clock }
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const handlePayDebt = (debt: DealerDebt) => {
    setSelectedDebt(debt)
    setPayDialogOpen(true)
  }

  const totalDebt = debts?.reduce((sum, debt) => sum + debt.debtAmount, 0) || 0
  const totalPaid = debts?.reduce((sum, debt) => sum + debt.paidAmount, 0) || 0
  const totalRemaining = debts?.reduce((sum, debt) => sum + debt.remainingAmount, 0) || 0
  const overdueCount = debts?.filter(d => d.status === 'Overdue').length || 0

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 pr-8">
              <div className="flex-1">
                <DialogTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Dealer Debts Management
                </DialogTitle>
                <DialogDescription>
                  Manage debt payments for {dealerName || 'this dealer'}
                </DialogDescription>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Debt
              </Button>
            </div>
          </DialogHeader>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : !debts || debts.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No debts recorded</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create a debt record to track dealer payments
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} className="mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create First Debt
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                      <DollarSign className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Debt</p>
                      <p className="text-lg font-bold">{formatCurrency(totalDebt)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Paid</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Remaining</p>
                      <p className="text-lg font-bold text-orange-600">{formatCurrency(totalRemaining)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Overdue</p>
                      <p className="text-lg font-bold text-red-600">{overdueCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Debts Table */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Debt Amount</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {debts.map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell>
                          <div className="font-semibold">{formatCurrency(debt.debtAmount)}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {debt.notes && (
                              <span className="line-clamp-1">{debt.notes}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(debt.paidAmount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${
                            debt.remainingAmount > 0 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(debt.remainingAmount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm ${
                            debt.status === 'Overdue' ? 'text-red-600 font-medium' : 'text-muted-foreground'
                          }`}>
                            {formatDate(debt.dueDate)}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(debt.status)}</TableCell>
                        <TableCell>
                          {debt.lastPaymentDate ? (
                            <span className="text-sm text-muted-foreground">
                              {formatDate(debt.lastPaymentDate)}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">No payment yet</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {debt.status !== 'Paid' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePayDebt(debt)}
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Pay
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreateDealerDebtDialog
        dealerId={dealerId || ''}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <PayDealerDebtDialog
        debt={selectedDebt}
        open={payDialogOpen}
        onOpenChange={setPayDialogOpen}
      />
    </>
  )
}

