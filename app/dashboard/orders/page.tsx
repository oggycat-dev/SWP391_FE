"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Filter, DollarSign, User, Car, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/orders/status-badge"
import { useOrders } from "@/hooks/use-orders"
import { useQuotations } from "@/hooks/use-quotations"
import { CreateOrderDialog } from "@/components/orders/create-order-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { OrderStatus } from "@/lib/api/orders"

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { data: orders, isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useOrders(
    statusFilter !== "all" ? { status: statusFilter } : undefined,
    { enabled: true }
  )

  const { data: quotations, isLoading: quotationsLoading, error: quotationsError } = useQuotations(
    undefined,
    { enabled: true }
  )

  const filteredOrders = orders?.filter((o) => {
    const matchesSearch = searchTerm === "" || 
      o.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.vehicleId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  }) || []

  const filteredQuotations = quotations?.filter((q) => {
    const matchesSearch = searchTerm === "" || 
      q.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.vehicleId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  }) || []

  if (ordersError || quotationsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales & Orders</h1>
            <p className="text-muted-foreground">Manage quotations, orders, and sales pipeline.</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load data: {ordersError?.message || quotationsError?.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales & Orders</h1>
          <p className="text-muted-foreground">Manage quotations, orders, and sales pipeline.</p>
        </div>
        <CreateOrderDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={() => {
            setIsCreateDialogOpen(false)
            refetchOrders()
          }}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Order
          </Button>
        </CreateOrderDialog>
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
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === OrderStatus.Pending ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(OrderStatus.Pending)}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === OrderStatus.Approved ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(OrderStatus.Approved)}
          >
            Approved
          </Button>
        </div>
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
              {ordersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No orders found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id.substring(0, 8).toUpperCase()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{order.customerId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span>{order.vehicleId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 font-semibold">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            ${order.totalAmount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.paymentMethod}</Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status as any} />
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
              )}
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
              {quotationsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredQuotations.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No quotations found.</p>
                </div>
              ) : (
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
                    {filteredQuotations.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.id.substring(0, 8).toUpperCase()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{quote.customerId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span>{quote.vehicleId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(quote.validUntil).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 font-semibold">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            ${quote.finalPrice.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={quote.status as any} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/quotations/${quote.id}`}>View</Link>
                          </Button>
                        </TableCell>
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
