"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { MOCK_INVENTORY, MOCK_VEHICLES, MOCK_REQUESTS } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Package, Truck, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function InventoryPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  const isEVM = user?.role === "evm_staff" || user?.role === "admin"

  // Filter inventory based on role and search
  const dealerInventory = MOCK_INVENTORY.filter((i) => i.dealerId === "dealer1") // Mock dealer1
  const centralInventory = MOCK_INVENTORY.filter((i) => i.dealerId === null)

  const getVehicleDetails = (vId: string, varId: string, cId: string) => {
    const vehicle = MOCK_VEHICLES.find((v) => v.id === vId)
    const variant = vehicle?.variants.find((v) => v.id === varId)
    const color = vehicle?.colors.find((c) => c.id === cId)
    return { vehicle, variant, color }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            {isEVM ? "Manage central warehouse and dealer requests." : "Track your stock and request vehicles."}
          </p>
        </div>
        {!isEVM && (
          <Button asChild>
            <Link href="/dashboard/inventory/request">
              <Plus className="mr-2 h-4 w-4" /> Request Vehicle
            </Link>
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isEVM
                ? centralInventory.reduce((acc, i) => acc + i.quantity, 0)
                : dealerInventory.reduce((acc, i) => acc + i.quantity, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_REQUESTS.filter((r) => r.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList>
          <TabsTrigger value="inventory">My Inventory</TabsTrigger>
          {isEVM && <TabsTrigger value="central">Central Warehouse</TabsTrigger>}
          <TabsTrigger value="requests">Vehicle Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock List</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search model, VIN..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dealerInventory.map((item) => {
                    const { vehicle, variant, color } = getVehicleDetails(item.vehicleId, item.variantId, item.colorId)
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {vehicle?.brand} {vehicle?.modelName}
                        </TableCell>
                        <TableCell>{variant?.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: color?.hexCode }} />
                            {color?.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.status === "available" ? "default" : "secondary"}>{item.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold">{item.quantity}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Request History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    {isEVM && <TableHead className="text-right">Action</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_REQUESTS.map((req) => {
                    const { vehicle, variant, color } = getVehicleDetails(req.vehicleId, req.variantId, req.colorId)
                    return (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.id.toUpperCase()}</TableCell>
                        <TableCell>
                          <div>
                            {vehicle?.brand} {vehicle?.modelName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {variant?.name} - {color?.name}
                          </div>
                        </TableCell>
                        <TableCell>{req.quantity}</TableCell>
                        <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              req.status === "approved"
                                ? "default"
                                : req.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {req.status}
                          </Badge>
                        </TableCell>
                        {isEVM && req.status === "pending" && (
                          <TableCell className="text-right">
                            <Button size="sm">Review</Button>
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
