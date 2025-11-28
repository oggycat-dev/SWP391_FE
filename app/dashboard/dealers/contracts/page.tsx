"use client"

import { useState } from "react"
import { Plus, Search, FileText, Calendar, DollarSign } from "lucide-react"
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
import { useDealerContracts } from "@/hooks/use-dealer-contracts"
import { DealerContractStatus, DealerContractDto } from "@/lib/api/dealer-contracts"
import { CreateDealerContractDialog } from "@/components/dealers/create-dealer-contract-dialog"
import { DealerContractDetailDialog } from "@/components/dealers/dealer-contract-detail-dialog"

export default function DealerContractsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<DealerContractDto | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const { data: contracts, isLoading } = useDealerContracts({
    status: statusFilter === "all" ? undefined : Number(statusFilter),
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadgeVariant = (status: DealerContractStatus) => {
    switch (status) {
      case DealerContractStatus.Active:
        return "default"
      case DealerContractStatus.Draft:
        return "secondary"
      case DealerContractStatus.Expired:
        return "destructive"
      case DealerContractStatus.Terminated:
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusLabel = (status: DealerContractStatus) => {
    switch (status) {
      case DealerContractStatus.Draft:
        return "Draft"
      case DealerContractStatus.Active:
        return "Active"
      case DealerContractStatus.Expired:
        return "Expired"
      case DealerContractStatus.Terminated:
        return "Terminated"
      default:
        return "Unknown"
    }
  }

  const filteredContracts = contracts?.filter((contract) => {
    const matchesSearch =
      searchTerm === "" ||
      contract.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dealer Contracts</h2>
          <p className="text-muted-foreground">Manage dealer contracts and agreements.</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Contract
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contracts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="0">Draft</SelectItem>
            <SelectItem value="1">Active</SelectItem>
            <SelectItem value="2">Expired</SelectItem>
            <SelectItem value="3">Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contracts List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : filteredContracts?.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No contracts found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters or create a new contract
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract Number</TableHead>
                  <TableHead>Dealer</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Commission Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Signed By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts?.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {contract.contractNumber}
                      </div>
                    </TableCell>
                    <TableCell>{contract.dealerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDate(contract.startDate)}</span>
                        <span className="text-muted-foreground">→</span>
                        <span>{formatDate(contract.endDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{formatCurrency(contract.commissionRate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(contract.status)}>
                        {getStatusLabel(contract.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {contract.signedBy || (
                        <span className="text-muted-foreground italic">Not signed</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedContract(contract)
                          setIsDetailDialogOpen(true)
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Contract Dialog */}
      <CreateDealerContractDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {/* View Contract Details Dialog */}
      <DealerContractDetailDialog 
        contract={selectedContract}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  )
}
