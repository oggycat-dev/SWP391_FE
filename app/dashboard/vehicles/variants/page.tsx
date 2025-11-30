"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Car, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useVehicleVariants } from "@/hooks/use-vehicles"
import { CreateVehicleVariantDialog } from "@/components/vehicles/create-vehicle-variant-dialog"
import { UpdateVehicleVariantDialog } from "@/components/vehicles/update-vehicle-variant-dialog"
import { DeleteVehicleVariantDialog } from "@/components/vehicles/delete-vehicle-variant-dialog"
import { ViewVehicleVariantDialog } from "@/components/vehicles/view-vehicle-variant-dialog"
import { VehicleVariantCard } from "@/components/vehicles/vehicle-variant-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { VehicleModelSelector } from "@/components/vehicles/vehicle-model-selector"

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

function VehicleVariantsPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [modelFilter, setModelFilter] = useState<string>("all")
  const [selectedModelName, setSelectedModelName] = useState<string>("")
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewingVariant, setViewingVariant] = useState<string | null>(null)
  const [editingVariant, setEditingVariant] = useState<string | null>(null)
  const [deletingVariant, setDeletingVariant] = useState<string | null>(null)

  // Memoize params to prevent unnecessary refetches
  const variantsParams = useMemo(() => ({
    modelId: modelFilter && modelFilter !== 'all' ? modelFilter : undefined,
    isActive: statusFilter !== 'all' ? statusFilter === 'true' : undefined,
    searchTerm: searchTerm || undefined,
    pageNumber: page,
    pageSize: 10,
  }), [modelFilter, statusFilter, searchTerm, page])

  const { data: variantsData, isLoading, error, refetch } = useVehicleVariants(
    variantsParams,
    { enabled: true, refetchInterval: undefined }
  )

  const variants = variantsData?.items || []
  const totalPages = variantsData?.totalPages || 0

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Variants</h1>
            <p className="text-muted-foreground">Manage vehicle variants in the system.</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load vehicle variants: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Variants</h1>
          <p className="text-muted-foreground">Manage vehicle variants in the system.</p>
        </div>
        <CreateVehicleVariantDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={() => {
            refetch()
            setIsCreateDialogOpen(false)
          }}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Variant
          </Button>
        </CreateVehicleVariantDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Variants Management
          </CardTitle>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by variant name or code..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1) // Reset to first page on search
                }}
              />
            </div>
            {modelFilter && modelFilter !== "all" && selectedModelName ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5">
                <Car className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{selectedModelName}</span>
                <button
                  onClick={() => {
                    setModelFilter("all")
                    setSelectedModelName("")
                    setPage(1)
                  }}
                  className="p-1 rounded hover:bg-primary/10"
                >
                  <XCircle className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModelSelectorOpen(true)}
                className="w-[200px] justify-start"
              >
                <Car className="mr-2 h-4 w-4" />
                Filter by model
              </Button>
            )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : variants.length === 0 ? (
            <div className="py-12 text-center">
              <Car className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No vehicle variants found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {variants.map((variant) => (
                  <VehicleVariantCard
                    key={variant.id}
                    variant={variant}
                    onView={(id) => setViewingVariant(id)}
                    onEdit={(id) => setEditingVariant(id)}
                    onDelete={(id) => setDeletingVariant(id)}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1
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
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Model Selector for Filter */}
      <VehicleModelSelector
        open={isModelSelectorOpen}
        onOpenChange={setIsModelSelectorOpen}
        onSelect={(modelId, modelName) => {
          setModelFilter(modelId)
          setSelectedModelName(modelName)
          setPage(1)
          setIsModelSelectorOpen(false)
        }}
        selectedModelId={modelFilter !== "all" ? modelFilter : undefined}
      />

      {/* Dialogs */}
      {viewingVariant && (
        <ViewVehicleVariantDialog
          variantId={viewingVariant}
          open={!!viewingVariant}
          onOpenChange={(open) => !open && setViewingVariant(null)}
        />
      )}

      {editingVariant && (
        <UpdateVehicleVariantDialog
          variantId={editingVariant}
          open={!!editingVariant}
          onOpenChange={(open) => {
            if (!open) setEditingVariant(null)
          }}
          onSuccess={() => {
            refetch()
            setEditingVariant(null)
          }}
        />
      )}

      {deletingVariant && (
        <DeleteVehicleVariantDialog
          variantId={deletingVariant}
          open={!!deletingVariant}
          onOpenChange={(open) => {
            if (!open) setDeletingVariant(null)
          }}
          onSuccess={() => {
            refetch()
            setDeletingVariant(null)
          }}
        />
      )}
    </div>
  )
}

export default function VehicleVariantsPage() {
  return <VehicleVariantsPageContent />
}
