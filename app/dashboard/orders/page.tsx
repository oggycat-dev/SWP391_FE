"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/orders/status-badge"
import { MOCK_ORDERS, MOCK_QUOTATIONS, MOCK_CUSTOMERS, MOCK_VEHICLES } from "@/lib/mock-data"

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Helper to get customer name
  const getCustomerName = (id: string) => MOCK_CUSTOMERS.find((c) => c.id === id)?.name || "Unknown"
  // Helper to get vehicle name
  const getVehicleName = (id: string) => MOCK_VEHICLES.find((v) => v.id === id)?.modelName || "Unknown"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales & Orders</h1>
          <p className="text-muted-foreground">Manage quotations, orders, and sales pipeline.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/orders/create">
            <Plus className="mr-2 h-4 w-4" /> Create Quotation
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, order ID..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="quotations">Quotations</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>List of all orders currently in progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_ORDERS.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.toUpperCase()}</TableCell>
                      <TableCell>{getCustomerName(order.customerId)}</TableCell>
                      <TableCell>{getVehicleName(order.vehicleId)}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>${order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/orders/${order.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quotations</CardTitle>
              <CardDescription>Quotations sent to customers.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_QUOTATIONS.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.id.toUpperCase()}</TableCell>
                      <TableCell>{getCustomerName(quote.customerId)}</TableCell>
                      <TableCell>{getVehicleName(quote.vehicleId)}</TableCell>
                      <TableCell>{new Date(quote.validUntil).toLocaleDateString()}</TableCell>
                      <TableCell>${quote.finalPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={quote.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
