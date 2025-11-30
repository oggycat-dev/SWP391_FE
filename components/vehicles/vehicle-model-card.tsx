"use client"

import Image from "next/image"
import { Car, Eye, Edit, Trash2, MoreVertical } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { VehicleModelDto } from "@/lib/api/vehicles"

interface VehicleModelCardProps {
  model: VehicleModelDto
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function VehicleModelCard({ model, onView, onEdit, onDelete }: VehicleModelCardProps) {
  const mainImage = model.imageUrls && model.imageUrls.length > 0 ? model.imageUrls[0] : "/placeholder.svg"

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={mainImage}
          alt={model.modelName}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute right-2 top-2 flex gap-2">
          <Badge variant={model.isActive ? "default" : "secondary"}>
            {model.isActive ? "Active" : "Inactive"}
          </Badge>
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            {model.category}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{model.brand}</p>
            <CardTitle className="line-clamp-1 mt-1">{model.modelName}</CardTitle>
            <p className="text-xs text-muted-foreground font-mono mt-1">{model.modelCode}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(model.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(model.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(model.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Year</span>
            <span className="text-sm font-medium">{model.year}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Base Price</span>
            <span className="text-lg font-bold text-primary">${model.basePrice.toLocaleString()}</span>
          </div>
          {model.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{model.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2 pt-4">
        {onView && (
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onView(model.id)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        )}
        {onEdit && (
          <Button 
            variant="default" 
            className="flex-1"
            onClick={() => onEdit(model.id)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

