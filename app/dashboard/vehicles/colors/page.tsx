"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Edit, Trash2, Eye, Palette, Settings, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useVehicleColors } from "@/hooks/use-vehicles"
import { CreateVehicleColorDialog } from "@/components/vehicles/create-vehicle-color-dialog"
import { UpdateVehicleColorDialog } from "@/components/vehicles/update-vehicle-color-dialog"
import { DeleteVehicleColorDialog } from "@/components/vehicles/delete-vehicle-color-dialog"
import { ViewVehicleColorDialog } from "@/components/vehicles/view-vehicle-color-dialog"
import { VehicleColorCard } from "@/components/vehicles/vehicle-color-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { VehicleVariantSelector } from "@/components/vehicles/vehicle-variant-selector"

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

function VehicleColorsPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [variantFilter, setVariantFilter] = useState<string>("all")
  const [selectedVariantName, setSelectedVariantName] = useState<string>("")
  const [isVariantSelectorOpen, setIsVariantSelectorOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewingColor, setViewingColor] = useState<string | null>(null)
  const [editingColor, setEditingColor] = useState<string | null>(null)
  const [deletingColor, setDeletingColor] = useState<string | null>(null)


  // Memoize params to prevent unnecessary refetches
  const colorsParams = useMemo(() => ({
    variantId: variantFilter && variantFilter !== 'all' ? variantFilter : undefined,
    isActive: statusFilter !== 'all' ? statusFilter === 'true' : undefined,
    searchTerm: searchTerm || undefined,
    pageNumber: page,
    pageSize: 10,
  }), [variantFilter, statusFilter, searchTerm, page])

  const { data: colorsData, isLoading, error, refetch } = useVehicleColors(
    colorsParams,
    { enabled: true, refetchInterval: undefined }
  )

  const colors = colorsData?.items || []
  const totalPages = colorsData?.totalPages || 0

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Colors</h1>
            <p className="text-muted-foreground">Manage vehicle colors in the system.</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load vehicle colors: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Colors</h1>
          <p className="text-muted-foreground">Manage vehicle colors in the system.</p>
        </div>
        <CreateVehicleColorDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={() => {
            setIsCreateDialogOpen(false)
            refetch()
          }}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Color
          </Button>
        </CreateVehicleColorDialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by color name or code..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1) // Reset to first page on search
                }}
              />
            </div>
            {variantFilter && variantFilter !== "all" && selectedVariantName ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5">
                <Settings className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{selectedVariantName}</span>
                <button
                  onClick={() => {
                    setVariantFilter("all")
                    setSelectedVariantName("")
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
                onClick={() => setIsVariantSelectorOpen(true)}
                className="w-[200px] justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Filter by variant
              </Button>
            )}
            <Select 
              value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value)
                setPage(1)
              }}
            >
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
          ) : colors.length === 0 ? (
            <div className="py-12 text-center">
              <Palette className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No vehicle colors found.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {colors.map((color) => (
                  <VehicleColorCard
                    key={color.id}
                    color={color}
                    onView={setViewingColor}
                    onEdit={setEditingColor}
                    onDelete={setDeletingColor}
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

      {/* Variant Selector for Filter */}
      <VehicleVariantSelector
        open={isVariantSelectorOpen}
        onOpenChange={setIsVariantSelectorOpen}
        onSelect={(variantId, variantName) => {
          setVariantFilter(variantId)
          setSelectedVariantName(variantName)
          setPage(1)
          setIsVariantSelectorOpen(false)
        }}
        selectedVariantId={variantFilter !== "all" ? variantFilter : undefined}
      />

      {viewingColor && (
        <ViewVehicleColorDialog
          colorId={viewingColor}
          open={!!viewingColor}
          onOpenChange={(open) => !open && setViewingColor(null)}
        />
      )}

      {editingColor && (
        <UpdateVehicleColorDialog
          colorId={editingColor}
          open={!!editingColor}
          onOpenChange={(open) => {
            if (!open) {
              setEditingColor(null)
            }
          }}
          onSuccess={() => {
            refetch()
          }}
        />
      )}

      {deletingColor && (
        <DeleteVehicleColorDialog
          colorId={deletingColor}
          open={!!deletingColor}
          onOpenChange={(open: boolean) => !open && setDeletingColor(null)}
          onSuccess={() => {
            setDeletingColor(null)
            refetch()
          }}
        />
      )}
    </div>
  )
}

export default function VehicleColorsPage() {
  return <VehicleColorsPageContent />
}

