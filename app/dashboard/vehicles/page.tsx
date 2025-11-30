"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Package, Palette, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vehicle Management</h1>
        <p className="text-muted-foreground">Manage vehicle models, variants, colors, inventory, and requests.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="variants">Variants & Colors</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vehicle Models</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Base Templates</div>
                <p className="text-xs text-muted-foreground">Manage vehicle model templates</p>
                <Button asChild className="mt-4 w-full" variant="outline">
                  <Link href="/dashboard/vehicles/models">Manage Models</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Variants & Colors</CardTitle>
                <Palette className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Variants</div>
                <p className="text-xs text-muted-foreground">Manage vehicle variants and colors</p>
                <Button asChild className="mt-4 w-full" variant="outline">
                  <Link href="/dashboard/vehicles/variants">Manage Variants</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Stock</div>
                <p className="text-xs text-muted-foreground">Manage vehicle inventory</p>
                <Button asChild className="mt-4 w-full" variant="outline">
                  <Link href="/dashboard/vehicles/inventory">Manage Inventory</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Requests</div>
                <p className="text-xs text-muted-foreground">Manage vehicle requests</p>
                <Button asChild className="mt-4 w-full" variant="outline">
                  <Link href="/dashboard/vehicles/requests">Manage Requests</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Models</CardTitle>
              <CardDescription>Manage base vehicle model templates</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/dashboard/vehicles/models">Go to Models Management</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Variants & Colors</CardTitle>
              <CardDescription>Manage vehicle variants and color options</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/dashboard/vehicles/variants">Go to Variants & Colors</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Inventory</CardTitle>
              <CardDescription>Manage vehicle stock and inventory status</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/dashboard/vehicles/inventory">Go to Inventory</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Requests</CardTitle>
              <CardDescription>Manage vehicle allocation and transfer requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/dashboard/vehicles/requests">Go to Requests</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
