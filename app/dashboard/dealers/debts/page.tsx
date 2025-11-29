"use client"

import { useState } from "react"
import { Plus, Search, DollarSign, Calendar, AlertCircle } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CreateDealerDebtDialog } from "@/components/dealers/create-dealer-debt-dialog"
import { PayDealerDebtDialog } from "@/components/dealers/pay-dealer-debt-dialog"
import { useDealerDebts } from "@/hooks/use-dealer-debts"
import type { DealerDebt } from "@/lib/types/dealer"

export default function DealerDebtsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState<DealerDebt | null>(null)

  const { data: debts, isLoading } = useDealerDebts()

  const handlePayDebt = (debt: DealerDebt) => {
    setSelectedDebt(debt)
    setPayDialogOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Current":
        return "default"
      case "Overdue":
        return "destructive"
      case "Paid":
        return "secondary"
      default:
        return "outline"
    }
  }

  const filteredDebts = debts?.filter((debt) => {
    const matchesSearch =
      debt.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debt.debtCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || debt.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  // Calculate summary statistics
  const totalDebt = filteredDebts.reduce((sum, debt) => sum + debt.totalDebt, 0)
  const totalPaid = filteredDebts.reduce((sum, debt) => sum + debt.paidAmount, 0)
  const totalRemaining = filteredDebts.reduce((sum, debt) => sum + debt.remainingAmount, 0)
  const overdueCount = filteredDebts.filter((debt) => debt.status === "Overdue").length

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dealer Debt Management</h2>
          <p className="text-muted-foreground">Track and manage dealer debts and payments.</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Debt
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDebt)}</div>
            <p className="text-xs text-muted-foreground">
              Across {filteredDebts.length} debt{filteredDebts.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              {totalDebt > 0 ? `${((totalPaid / totalDebt) * 100).toFixed(1)}% paid` : "0% paid"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalRemaining)}</div>
            <p className="text-xs text-muted-foreground">
              {totalDebt > 0 ? `${((totalRemaining / totalDebt) * 100).toFixed(1)}% remaining` : "0% remaining"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">
              {filteredDebts.length > 0
                ? `${((overdueCount / filteredDebts.length) * 100).toFixed(1)}% overdue`
                : "No debts"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by dealer or debt code..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Current">Current</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="WrittenOff">Written Off</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : filteredDebts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No debts found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first dealer debt"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Debt Code</TableHead>
                  <TableHead>Dealer</TableHead>
                  <TableHead>Total Debt</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebts.map((debt) => (
                  <TableRow key={debt.id}>
                    <TableCell className="font-medium">{debt.debtCode}</TableCell>
                    <TableCell>{debt.dealerName}</TableCell>
                    <TableCell>{formatCurrency(debt.totalDebt)}</TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(debt.paidAmount)}
                    </TableCell>
                    <TableCell className="text-orange-600">
                      {formatCurrency(debt.remainingAmount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(debt.dueDate), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(debt.status)}>
                        {debt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(debt.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      {debt.status !== "Paid" && debt.status !== "WrittenOff" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePayDebt(debt)}
                        >
                          <DollarSign className="mr-1 h-3 w-3" />
                          Pay
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateDealerDebtDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <PayDealerDebtDialog
        debt={selectedDebt}
        open={payDialogOpen}
        onOpenChange={setPayDialogOpen}
      />
    </div>
  )
}
