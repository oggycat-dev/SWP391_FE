"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"

export default function VehicleInventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vehicle Inventory</h1>
        <p className="text-muted-foreground">Manage vehicle stock and inventory status.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Management
          </CardTitle>
          <CardDescription>
            This feature is under development. You will be able to manage vehicle inventory here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Vehicle inventory management will allow you to:
          </p>
          <ul className="mt-4 list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Track vehicle stock levels</li>
            <li>Manage inventory status (Available, Reserved, Sold, etc.)</li>
            <li>Allocate vehicles to dealers</li>
            <li>View warehouse locations and vehicle details</li>
            <li>Monitor inventory movements and transfers</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

