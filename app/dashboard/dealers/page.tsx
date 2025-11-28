"use client"

import { useState } from "react"
import { Plus, Search, MapPin, Phone, Mail, Building2, DollarSign } from "lucide-react"

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
import { CreateDealerDialog } from "@/components/dealers/create-dealer-dialog"
import { DealerDetailDialog } from "@/components/dealers/dealer-detail-dialog"
import { useDealers } from "@/hooks/use-dealers"
import type { Dealer } from "@/lib/api/dealers"

export default function DealersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [cityFilter, setCityFilter] = useState<string>("all")
  const [pageNumber, setPageNumber] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null)

  const { data: dealersData, isLoading } = useDealers({
    searchTerm,
    status: statusFilter === "all" ? undefined : statusFilter,
    city: cityFilter === "all" ? undefined : cityFilter,
    pageNumber,
    pageSize: 12,
  })

  const handleCreateNew = () => {
    setDialogOpen(true)
  }

  const handleViewDetails = (dealerId: string) => {
    setSelectedDealerId(dealerId)
    setDetailDialogOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const dealers = dealersData?.items || []

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dealer Management</h2>
          <p className="text-muted-foreground">Manage dealer network and information.</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Dealer
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dealers..."
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
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            <SelectItem value="Ho Chi Minh City">Ho Chi Minh City</SelectItem>
            <SelectItem value="Hanoi">Hanoi</SelectItem>
            <SelectItem value="Da Nang">Da Nang</SelectItem>
            <SelectItem value="Can Tho">Can Tho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <div className="h-6 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : dealers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No dealers found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dealers.map((dealer) => (
            <Card 
              key={dealer.id} 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewDetails(dealer.id)}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-base font-semibold">{dealer.dealerName}</CardTitle>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {dealer.dealerCode}
                  </div>
                </div>
                <Badge variant={dealer.status === "Active" ? "default" : "secondary"}>
                  {dealer.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm mt-2">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{dealer.address}, {dealer.district}, {dealer.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{dealer.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{dealer.email}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Manager:</span>
                      <span className="text-xs">{dealer.managerName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Debt:
                      </span>
                      <span className={`text-xs font-medium ${dealer.currentDebt > dealer.debtLimit * 0.8 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(dealer.currentDebt)} / {formatCurrency(dealer.debtLimit)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {dealersData && dealersData.totalCount > 12 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
            disabled={!dealersData.hasPreviousPage}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pageNumber} of {Math.ceil(dealersData.totalCount / 12)}
          </span>
          <Button
            variant="outline"
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={!dealersData.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}

      <CreateDealerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <DealerDetailDialog
        dealerId={selectedDealerId}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  )
}
