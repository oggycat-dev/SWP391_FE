/**
 * Dealer Detail Dialog Component
 */

'use client'

import { MapPin, Phone, Mail, Building2, DollarSign, Calendar, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useDealer } from '@/hooks/use-dealers'
import type { Dealer } from '@/lib/api/dealers'

interface DealerDetailDialogProps {
  dealerId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DealerDetailDialog({ dealerId, open, onOpenChange }: DealerDetailDialogProps) {
  const { data: dealer, isLoading } = useDealer(dealerId || '')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="flex-1">
              <DialogTitle>Dealer Details</DialogTitle>
              <DialogDescription>
                View detailed information about this dealer
              </DialogDescription>
            </div>
            {dealer && (
              <Badge variant={dealer.status === 'Active' ? 'default' : 'secondary'} className="mt-1">
                {dealer.status}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
          </div>
        ) : dealer ? (
          <div className="space-y-4">
            {/* Basic Information Card */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Basic Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Dealer Name</p>
                    <p className="text-sm font-semibold truncate">{dealer.dealerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Dealer Code</p>
                    <p className="text-sm font-mono font-medium">{dealer.dealerCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                    <MapPin className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium">{dealer.address}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {dealer.district}, {dealer.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <Phone className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Phone Number</p>
                    <p className="text-sm font-medium">{dealer.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <Mail className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{dealer.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Manager Information Card */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Manager
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                  <User className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Manager Name</p>
                  <p className="text-sm font-medium">
                    {dealer.managerName || (
                      <span className="text-muted-foreground italic">Not assigned</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Information Card */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Financial Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <DollarSign className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Debt Limit</p>
                    <p className="text-sm font-semibold">{formatCurrency(dealer.debtLimit)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    dealer.currentDebt > dealer.debtLimit * 0.8
                      ? 'bg-red-500/10'
                      : 'bg-green-500/10'
                  }`}>
                    <DollarSign className={`h-5 w-5 ${
                      dealer.currentDebt > dealer.debtLimit * 0.8
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Current Debt</p>
                    <p className={`text-sm font-semibold ${
                      dealer.currentDebt > dealer.debtLimit * 0.8
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}>
                      {formatCurrency(dealer.currentDebt)}
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Usage</span>
                        <span className="font-medium">
                          {((dealer.currentDebt / dealer.debtLimit) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            dealer.currentDebt > dealer.debtLimit * 0.8
                              ? 'bg-red-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min((dealer.currentDebt / dealer.debtLimit) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Information Card */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Contract Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Contract Start Date</p>
                    <p className="text-sm font-medium">{formatDate(dealer.contractStartDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Calendar className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Contract End Date</p>
                    <p className="text-sm font-medium">{formatDate(dealer.contractEndDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-500/10">
                    <Calendar className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Created At</p>
                    <p className="text-sm font-medium">{formatDate(dealer.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Dealer not found</p>
            <p className="text-sm text-muted-foreground mt-1">
              The dealer you're looking for doesn't exist
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
