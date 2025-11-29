/**
 * Dealer Discount Policies Dialog Component
 */

'use client'

import { useState } from 'react'
import { Percent, Plus, Edit2, CheckCircle2, XCircle } from 'lucide-react'
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
import { useDealerDiscountPolicies } from '@/hooks/use-dealer-discount-policies'
import { CreateDiscountPolicyDialog } from './create-discount-policy-dialog'
import { UpdateDiscountPolicyDialog } from './update-discount-policy-dialog'
import type { DealerDiscountPolicy } from '@/lib/api/dealer-discount-policies'

interface DealerDiscountPoliciesDialogProps {
  dealerId: string | null
  dealerName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DealerDiscountPoliciesDialog({ 
  dealerId, 
  dealerName, 
  open, 
  onOpenChange 
}: DealerDiscountPoliciesDialogProps) {
  const { data: policies, isLoading } = useDealerDiscountPolicies({ dealerId: dealerId || '' })
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<DealerDiscountPolicy | null>(null)

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

  const handleEditPolicy = (policy: DealerDiscountPolicy) => {
    setSelectedPolicy(policy)
    setUpdateDialogOpen(true)
  }

  const activePolicies = policies?.filter(p => p.isActive).length || 0
  const inactivePolicies = policies?.filter(p => !p.isActive).length || 0

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 pr-8">
              <div className="flex-1">
                <DialogTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Dealer Discount Policies
                </DialogTitle>
                <DialogDescription>
                  Manage discount policies for {dealerName || 'this dealer'}
                </DialogDescription>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Policy
              </Button>
            </div>
          </DialogHeader>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : !policies || policies.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Percent className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No discount policies</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create a discount policy for this dealer
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} className="mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create First Policy
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Percent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Policies</p>
                      <p className="text-2xl font-bold">{policies.length}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Active</p>
                      <p className="text-2xl font-bold text-green-600">{activePolicies}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/10">
                      <XCircle className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Inactive</p>
                      <p className="text-2xl font-bold text-gray-600">{inactivePolicies}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policies Table */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Discount Rate</TableHead>
                      <TableHead>Min Order Qty</TableHead>
                      <TableHead>Max Discount</TableHead>
                      <TableHead>Effective Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy) => {
                      const isExpired = new Date(policy.expiryDate) < new Date()
                      const isUpcoming = new Date(policy.effectiveDate) > new Date()
                      
                      return (
                        <TableRow key={policy.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Percent className="h-4 w-4 text-primary" />
                              <Badge variant="default" className="font-mono text-base">
                                {policy.discountRate.toFixed(1)}%
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">
                              {policy.minOrderQuantity} units
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">
                              {formatCurrency(policy.maxDiscountAmount)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(policy.effectiveDate)}
                              </span>
                              {isUpcoming && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Upcoming
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className={`text-sm ${
                                isExpired ? 'text-red-600 font-medium' : 'text-muted-foreground'
                              }`}>
                                {formatDate(policy.expiryDate)}
                              </span>
                              {isExpired && (
                                <Badge variant="destructive" className="ml-2 text-xs">
                                  Expired
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={policy.isActive ? 'default' : 'secondary'}>
                              {policy.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPolicy(policy)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Conditions Note */}
              {policies.some(p => p.conditions) && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h4 className="text-sm font-semibold mb-2">Policy Conditions:</h4>
                  <ul className="space-y-2">
                    {policies
                      .filter(p => p.conditions)
                      .map(policy => (
                        <li key={policy.id} className="text-sm">
                          <span className="font-medium">{policy.discountRate}%:</span>{' '}
                          <span className="text-muted-foreground">{policy.conditions}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreateDiscountPolicyDialog
        dealerId={dealerId || ''}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <UpdateDiscountPolicyDialog
        policy={selectedPolicy}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
      />
    </>
  )
}

