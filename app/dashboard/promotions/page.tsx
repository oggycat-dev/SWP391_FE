"use client"

import { useState } from "react"
import { Plus, Search, Tag, Calendar, Percent, DollarSign, Edit, Trash2, Power } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreatePromotionDialog } from "@/components/promotions/create-promotion-dialog"
import { PromotionDetailDialog } from "@/components/promotions/promotion-detail-dialog"
import { usePromotions, useDeletePromotion, useUpdatePromotionStatus } from "@/hooks/use-promotions"
import type { Promotion, PromotionStatus } from "@/lib/types/promotion"

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null)

  const { data: promotions, isLoading } = usePromotions(
    statusFilter !== "all" ? { status: statusFilter as PromotionStatus } : undefined
  )
  const deleteMutation = useDeletePromotion()
  const updateStatusMutation = useUpdatePromotionStatus()

  const handleCreate = () => {
    setSelectedPromotion(null)
    setDialogOpen(true)
  }

  const handleViewDetails = (promotion: Promotion) => {
    setSelectedPromotion(promotion)
    setDetailDialogOpen(true)
  }

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setPromotionToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (promotionToDelete) {
      await deleteMutation.mutateAsync(promotionToDelete)
      setDeleteDialogOpen(false)
      setPromotionToDelete(null)
    }
  }

  const handleToggleStatus = async (promotion: Promotion) => {
    const newStatus: PromotionStatus = promotion.status === "Active" ? "Inactive" : "Active"
    await updateStatusMutation.mutateAsync({
      id: promotion.id,
      data: { status: newStatus },
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "Inactive":
        return "bg-red-500 hover:bg-red-600 text-white"
      case "Expired":
        return "bg-gray-500 hover:bg-gray-600 text-white"
      case "Scheduled":
        return "bg-blue-500 hover:bg-blue-600 text-white"
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white"
    }
  }

  const filteredPromotions = promotions?.filter((promo) =>
    promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.promotionCode.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  // Calculate stats
  const activeCount = promotions?.filter((p) => p.status === "Active").length || 0
  const totalUsage = promotions?.reduce((sum, p) => sum + p.currentUsageCount, 0) || 0

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Promotions Management</h2>
          <p className="text-muted-foreground">Manage sales campaigns and discounts.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Promotion
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Promotions</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Power className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search promotions..."
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
            <SelectItem value="Expired">Expired</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Promotions Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPromotions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No promotions found</p>
            <p className="text-sm text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first promotion"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPromotions.map((promo) => (
            <Card 
              key={promo.id} 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewDetails(promo)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Tag className="h-4 w-4 text-primary" />
                      {promo.name}
                    </CardTitle>
                    <CardDescription className="text-xs">{promo.promotionCode}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        •••
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(promo)
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleToggleStatus(promo)
                      }}>
                        <Power className="mr-2 h-4 w-4" />
                        {promo.status === "Active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(promo.id)
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Badge className={`w-fit mt-2 ${getStatusColor(promo.status)}`}>
                  {promo.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {promo.description}
                  </p>

                  <div className="flex items-center justify-between rounded-lg border p-2 bg-muted/50">
                    <div className="flex items-center gap-2">
                      {promo.discountType === "Percentage" ? (
                        <Percent className="h-4 w-4 text-primary" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-primary" />
                      )}
                      <span className="text-sm font-medium">Discount</span>
                    </div>
                    <span className="text-lg font-bold">
                      {promo.discountType === "Percentage"
                        ? `${promo.discountPercentage}%`
                        : formatCurrency(promo.discountAmount)}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Start: {format(new Date(promo.startDate), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>End: {format(new Date(promo.endDate), "MMM dd, yyyy")}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Usage:</span>
                      <span className="font-medium">
                        {promo.currentUsageCount} / {promo.maxUsageCount}
                      </span>
                    </div>
                    <Progress 
                      value={(promo.currentUsageCount / promo.maxUsageCount) * 100} 
                      className="h-1.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreatePromotionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        promotion={selectedPromotion}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the promotion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PromotionDetailDialog
        promotion={selectedPromotion}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  )
}
