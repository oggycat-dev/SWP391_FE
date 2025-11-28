"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, DollarSign, Calendar, User, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useQuotations } from "@/hooks/use-quotations"
import { CreateQuotationDialog } from "@/components/quotations/create-quotation-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { QuotationStatus } from "@/lib/api/quotations"
import { StatusBadge } from "@/components/orders/status-badge"

const statusConfig: Record<QuotationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  [QuotationStatus.Draft]: { label: "Draft", variant: "secondary" },
  [QuotationStatus.Sent]: { label: "Sent", variant: "outline" },
  [QuotationStatus.Accepted]: { label: "Accepted", variant: "default" },
  [QuotationStatus.Rejected]: { label: "Rejected", variant: "destructive" },
  [QuotationStatus.Expired]: { label: "Expired", variant: "secondary" },
}

export default function QuotationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { data: quotations, isLoading, error, refetch } = useQuotations(
    undefined,
    { enabled: true }
  )

  const filteredQuotations = quotations?.filter((q) => {
    const matchesSearch = searchTerm === "" || 
      q.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.vehicleId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  }) || []

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
            <p className="text-muted-foreground">Create and manage price quotations for customers.</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load quotations: {error.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">Create and manage price quotations for customers.</p>
        </div>
        <CreateQuotationDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={() => {
            setIsCreateDialogOpen(false)
            refetch()
          }}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Quotation
          </Button>
        </CreateQuotationDialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer or vehicle..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredQuotations.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No quotations found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">{quotation.id.substring(0, 8).toUpperCase()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{quotation.customerId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span>{quotation.vehicleId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(quotation.validUntil).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-semibold">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        ${quotation.finalPrice.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[quotation.status].variant}>
                        {statusConfig[quotation.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/quotations/${quotation.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

