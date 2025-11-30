"use client"

import Image from "next/image"
import { Palette, Eye, Edit, Trash2, MoreVertical } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { VehicleColorDto } from "@/lib/api/vehicles"

interface VehicleColorCardProps {
  color: VehicleColorDto
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function VehicleColorCard({ color, onView, onEdit, onDelete }: VehicleColorCardProps) {
  const colorImage = color.imageUrl || "/placeholder.svg"

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={colorImage}
          alt={color.colorName}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          unoptimized
        />
        <div className="absolute right-2 top-2 flex gap-2">
          <Badge variant={color.isActive ? "default" : "secondary"}>
            {color.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{color.variantName}</p>
            <CardTitle className="line-clamp-1 mt-1">{color.colorName}</CardTitle>
            <div className="mt-2 flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: color.colorCode }}
              />
              <p className="text-xs text-muted-foreground font-mono">{color.colorCode}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(color.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(color.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(color.id)}
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
            <span className="text-sm text-muted-foreground">Additional Price</span>
            <span className="text-sm font-medium">${color.additionalPrice.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2 pt-4">
        {onView && (
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onView(color.id)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        )}
        {onEdit && (
          <Button 
            variant="default" 
            className="flex-1"
            onClick={() => onEdit(color.id)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

