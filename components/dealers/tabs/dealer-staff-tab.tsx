/**
 * Dealer Staff Tab Component
 */

'use client'

import { useState } from 'react'
import { Users, Plus, Edit2, UserCheck, UserX, Target, TrendingUp } from 'lucide-react'
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
import { useDealerStaff } from '@/hooks/use-dealer-staff'
import { AddDealerStaffDialog } from '../add-dealer-staff-dialog'
import { UpdateDealerStaffDialog } from '../update-dealer-staff-dialog'
import type { DealerStaff } from '@/lib/api/dealer-staff'

interface DealerStaffTabProps {
  dealerId: string
  dealerName: string
}

export function DealerStaffTab({ dealerId, dealerName }: DealerStaffTabProps) {
  const { data: staff, isLoading } = useDealerStaff(dealerId)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<DealerStaff | null>(null)

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

  const handleEditStaff = (staffMember: DealerStaff) => {
    setSelectedStaff(staffMember)
    setUpdateDialogOpen(true)
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

  if (!staff || staff.length === 0) {
    return (
      <>
        <div className="text-center py-12 border rounded-lg">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No staff members</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add staff members to manage this dealer
          </p>
          <Button onClick={() => setAddDialogOpen(true)} className="mt-4" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add First Staff Member
          </Button>
        </div>
        <AddDealerStaffDialog
          dealerId={dealerId}
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
        />
      </>
    )
  }

  const activePolicies = staff.filter(s => s.isActive).length

  return (
    <>
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Staff</p>
                <p className="text-2xl font-bold">{staff.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{activePolicies}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                  <UserX className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-red-600">
                    {staff.length - activePolicies}
                  </p>
                </div>
              </div>
              <Button onClick={() => setAddDialogOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Sales Target</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{staffMember.fullName}</p>
                      <p className="text-xs text-muted-foreground">{staffMember.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{staffMember.position || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">
                        {formatCurrency(staffMember.salesTarget || 0)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {staffMember.commissionRate?.toFixed(1) || '0.0'}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(staffMember.joinedDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={staffMember.isActive ? 'default' : 'secondary'}>
                      {staffMember.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStaff(staffMember)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddDealerStaffDialog
        dealerId={dealerId}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />

      <UpdateDealerStaffDialog
        staff={selectedStaff}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
      />
    </>
  )
}

