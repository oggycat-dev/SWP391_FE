/**
 * Dealer Info Tab Component
 */

'use client'

import { MapPin, Phone, Mail, Building2, DollarSign, Calendar } from 'lucide-react'
import type { Dealer } from '@/lib/api/dealers'

interface DealerInfoTabProps {
  dealer: Dealer
}

export function DealerInfoTab({ dealer }: DealerInfoTabProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid Date'
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return 'Invalid Date'
    }
  }

  return (
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
  )
}

