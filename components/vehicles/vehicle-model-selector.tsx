"use client"

import { useEffect, useState, useCallback } from "react"
import { X, Car, ChevronRight, Check, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useVehicleModels } from "@/hooks/use-vehicles"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

interface VehicleModelSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (modelId: string, modelName: string) => void
  selectedModelId?: string
  isActive?: boolean // Filter by active status
}

export function VehicleModelSelector({
  open,
  onOpenChange,
  onSelect,
  selectedModelId,
  isActive = true,
}: VehicleModelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1) // Reset to first page on search
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Load models with pagination
  const { data: modelsData, isLoading } = useVehicleModels(
    {
      isActive,
      searchTerm: debouncedSearch || undefined,
      pageNumber: page,
      pageSize,
    },
    { enabled: open }
  )

  const models = modelsData?.items || []
  const totalPages = modelsData?.totalPages || 0
  const totalCount = modelsData?.totalCount || 0

  const handleSelect = (modelId: string, modelName: string) => {
    onSelect(modelId, modelName)
    handleClose()
  }

  const handleClose = () => {
    setSearchQuery("")
    setDebouncedSearch("")
    setPage(1)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Vehicle Model</DialogTitle>
          <DialogDescription>
            Search and select a vehicle model. {totalCount > 0 && `Found ${totalCount} model(s).`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search by model name, brand, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            <Car className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Models List */}
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : models.length === 0 ? (
            <div className="py-12 text-center">
              <Car className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                {debouncedSearch ? "No models found matching your search." : "No models available."}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {models.map((model) => {
                  const isSelected = selectedModelId === model.id
                  return (
                    <button
                      key={model.id}
                      onClick={() => handleSelect(model.id, model.modelName)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-lg border transition-colors text-left",
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{model.modelName}</p>
                          <p className="text-sm text-muted-foreground">
                            {model.brand} • {model.category} • {model.year}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="h-5 w-5 text-primary" />}
                      {!isSelected && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                    </button>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center pt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

