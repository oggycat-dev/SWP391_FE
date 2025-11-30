"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Edit, Trash2, Eye, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useVehicleModels } from "@/hooks/use-vehicles"
import { CreateVehicleModelDialog } from "@/components/vehicles/create-vehicle-model-dialog"
import { UpdateVehicleModelDialog } from "@/components/vehicles/update-vehicle-model-dialog"
import { DeleteVehicleModelDialog } from "@/components/vehicles/delete-vehicle-model-dialog"
import { ViewVehicleModelDialog } from "@/components/vehicles/view-vehicle-model-dialog"
import { VehicleModelCard } from "@/components/vehicles/vehicle-model-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'Sedan', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'Hatchback', label: 'Hatchback' },
  { value: 'Truck', label: 'Truck' },
  { value: 'Van', label: 'Van' },
  { value: 'Coupe', label: 'Coupe' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

function VehicleModelsPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewingModel, setViewingModel] = useState<string | null>(null)
  const [editingModel, setEditingModel] = useState<string | null>(null)
  const [deletingModel, setDeletingModel] = useState<string | null>(null)

  // Memoize params to prevent unnecessary refetches
  const modelsParams = useMemo(() => ({
    category: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
    isActive: statusFilter !== 'all' ? statusFilter === 'true' : undefined,
    searchTerm: searchTerm || undefined, // Brand search in searchTerm
    pageNumber: page,
    pageSize: 10,
  }), [categoryFilter, statusFilter, searchTerm, page])

  const { data: modelsData, isLoading, error, refetch } = useVehicleModels(
    modelsParams,
    { enabled: true, refetchInterval: undefined }
  )

  const models = modelsData?.items || []
  const totalPages = modelsData?.totalPages || 0

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Models</h1>
            <p className="text-muted-foreground">Manage vehicle models in the system.</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load vehicle models: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Models</h1>
          <p className="text-muted-foreground">Manage vehicle models in the system.</p>
        </div>
        <CreateVehicleModelDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={() => {
            setIsCreateDialogOpen(false)
            refetch()
          }}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Model
          </Button>
        </CreateVehicleModelDialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by brand, model name, or model code..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1) // Reset to first page on search
                }}
              />
            </div>
            <Select value={categoryFilter} onValueChange={(value) => {
              setCategoryFilter(value)
              setPage(1)
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value)
              setPage(1)
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : models.length === 0 ? (
            <div className="py-12 text-center">
              <Car className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No vehicle models found.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {models.map((model) => (
                  <VehicleModelCard
                    key={model.id}
                    model={model}
                    onView={setViewingModel}
                    onEdit={setEditingModel}
                    onDelete={setDeletingModel}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (page <= 3) {
                          pageNum = i + 1
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = page - 2 + i
                        }
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setPage(pageNum)}
                              isActive={page === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {viewingModel && (
        <ViewVehicleModelDialog
          modelId={viewingModel}
          open={!!viewingModel}
          onOpenChange={(open) => !open && setViewingModel(null)}
        />
      )}

      {editingModel && (
        <UpdateVehicleModelDialog
          modelId={editingModel}
          open={!!editingModel}
          onOpenChange={(open) => {
            if (!open) {
              setEditingModel(null)
            }
          }}
          onSuccess={() => {
            refetch()
          }}
        />
      )}

      {deletingModel && (
        <DeleteVehicleModelDialog
          modelId={deletingModel}
          open={!!deletingModel}
          onOpenChange={(open: boolean) => !open && setDeletingModel(null)}
          onSuccess={() => {
            setDeletingModel(null)
            refetch()
          }}
        />
      )}
    </div>
  )
}

export default function VehicleModelsPage() {
  return <VehicleModelsPageContent />
}

