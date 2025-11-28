"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Package, Truck, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useVehicleInventories, useCentralInventory } from "@/hooks/use-vehicles"
import { useVehicleRequests } from "@/hooks/use-vehicle-requests"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { VehicleInventoryStatus } from "@/lib/api/vehicles"
import { VehicleRequestStatus } from "@/lib/api/vehicle-requests"
import { UserRole } from "@/lib/types/enums"

export default function InventoryPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  const userRole = user?.role as string
  const isEVM = userRole === UserRole[UserRole.EVMStaff] || 
                userRole === UserRole[UserRole.EVMManager] || 
                userRole === UserRole[UserRole.Admin]
  const isDealer = userRole === UserRole[UserRole.DealerStaff] || 
                   userRole === UserRole[UserRole.DealerManager]

  // Fetch inventory based on role
  const dealerInventoryQuery = useVehicleInventories(isDealer ? { dealerId: user?.id } : undefined)
  const dealerInventoryData = isDealer ? dealerInventoryQuery.data : null
  const dealerLoading = isDealer ? dealerInventoryQuery.isLoading : false
  const dealerError = isDealer ? dealerInventoryQuery.error : null

  const centralInventoryQuery = useCentralInventory()
  const centralInventory = isEVM ? centralInventoryQuery.data : null
  const centralLoading = isEVM ? centralInventoryQuery.isLoading : false
  const centralError = isEVM ? centralInventoryQuery.error : null

  const { data: vehicleRequests, isLoading: requestsLoading, error: requestsError } = useVehicleRequests({
    enabled: true
  })

  const dealerInventory = dealerInventoryData?.items || []
  const filteredDealerInventory = dealerInventory.filter((item) => {
    const matchesSearch = searchTerm === "" || 
      item.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.variantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vinNumber.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const filteredCentralInventory = (centralInventory || []).filter((item) => {
    const matchesSearch = searchTerm === "" || 
      item.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.variantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vinNumber.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const pendingRequests = vehicleRequests?.filter((req) => req.status === VehicleRequestStatus.Pending) || []

  if (dealerError || centralError || requestsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground">
              {isEVM ? "Manage central warehouse and dealer requests." : "Track your stock and request vehicles."}
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load inventory: {dealerError?.message || centralError?.message || requestsError?.message}
          </AlertDescription>
        </Alert>
      </div>
    )
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
        {isDealer && (
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
                ? filteredCentralInventory.length
                : filteredDealerInventory.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isEVM
                ? filteredCentralInventory.filter((i) => i.status === VehicleInventoryStatus.Available).length
                : filteredDealerInventory.filter((i) => i.status === VehicleInventoryStatus.Available).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList>
          <TabsTrigger value="inventory">{isEVM ? "Central Warehouse" : "My Inventory"}</TabsTrigger>
          <TabsTrigger value="requests">Vehicle Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock List</CardTitle>
              <div className="flex items-center gap-4 mt-4">
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
              {(isEVM ? centralLoading : dealerLoading) ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (isEVM ? filteredCentralInventory : filteredDealerInventory).length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No inventory items found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Variant</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>VIN</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(isEVM ? filteredCentralInventory : filteredDealerInventory).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.modelName}</TableCell>
                        <TableCell>{item.variantName}</TableCell>
                        <TableCell>{item.colorName}</TableCell>
                        <TableCell className="font-mono text-sm">{item.vinNumber || "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.status === VehicleInventoryStatus.Available
                                ? "default"
                                : item.status === VehicleInventoryStatus.Reserved
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{item.warehouseLocation || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Request History</CardTitle>
            </CardHeader>
            <CardContent>
              {requestsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : vehicleRequests?.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No vehicle requests found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Variant</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      {isEVM && <TableHead className="text-right">Action</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicleRequests?.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.id.substring(0, 8).toUpperCase()}</TableCell>
                        <TableCell>{req.vehicleId}</TableCell>
                        <TableCell>{req.variantId}</TableCell>
                        <TableCell>{req.colorId}</TableCell>
                        <TableCell>{req.quantity}</TableCell>
                        <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              req.status === VehicleRequestStatus.Approved
                                ? "default"
                                : req.status === VehicleRequestStatus.Pending
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {req.status}
                          </Badge>
                        </TableCell>
                        {isEVM && req.status === VehicleRequestStatus.Pending && (
                          <TableCell className="text-right">
                            <Button size="sm">Review</Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
