"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette } from "lucide-react"

export default function VehicleVariantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vehicle Variants & Colors</h1>
        <p className="text-muted-foreground">Manage vehicle variants and color options.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Variants & Colors Management
          </CardTitle>
          <CardDescription>
            This feature is under development. You will be able to manage vehicle variants and colors here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Vehicle variants and colors management will allow you to:
          </p>
          <ul className="mt-4 list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Create and manage vehicle variants for each model</li>
            <li>Configure color options for each variant</li>
            <li>Set pricing and specifications for variants</li>
            <li>Manage variant availability and status</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

