"use client"

import { useState } from "react"
import Link from "next/link"
import { DollarSign, CreditCard, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrders } from "@/hooks/use-orders"
import { CreatePaymentDialog } from "@/components/payments/create-payment-dialog"
import { CreateInstallmentPlanDialog } from "@/components/payments/create-installment-plan-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { OrderStatus, PaymentMethod } from "@/lib/api/orders"
import { StatusBadge } from "@/components/orders/status-badge"

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isInstallmentDialogOpen, setIsInstallmentDialogOpen] = useState(false)

  const { data: orders, isLoading, error, refetch } = useOrders(
    undefined,
    { enabled: true }
  )

  // Filter orders that need payment
  const ordersNeedingPayment = orders?.filter(
    (o) => o.status !== OrderStatus.Cancelled && o.status !== OrderStatus.Completed
  ) || []

  const filteredOrders = ordersNeedingPayment.filter((o) => {
    const matchesSearch = searchTerm === "" || 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
            <p className="text-muted-foreground">Manage payments and installment plans.</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load orders: {error.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage payments and installment plans for orders.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search by order ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
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
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0, 8).toUpperCase()}</TableCell>
                    <TableCell>{order.customerId}</TableCell>
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
                      <div className="flex items-center justify-end gap-2">
                        {order.paymentMethod === PaymentMethod.Installment ? (
                          <CreateInstallmentPlanDialog
                            orderId={order.id}
                            open={isInstallmentDialogOpen && selectedOrderId === order.id}
                            onOpenChange={(open) => {
                              setIsInstallmentDialogOpen(open)
                              setSelectedOrderId(open ? order.id : null)
                            }}
                            onSuccess={() => {
                              setIsInstallmentDialogOpen(false)
                              setSelectedOrderId(null)
                              refetch()
                            }}
                          >
                            <Button variant="outline" size="sm">
                              Create Plan
                            </Button>
                          </CreateInstallmentPlanDialog>
                        ) : (
                          <CreatePaymentDialog
                            orderId={order.id}
                            open={isPaymentDialogOpen && selectedOrderId === order.id}
                            onOpenChange={(open) => {
                              setIsPaymentDialogOpen(open)
                              setSelectedOrderId(open ? order.id : null)
                            }}
                            onSuccess={() => {
                              setIsPaymentDialogOpen(false)
                              setSelectedOrderId(null)
                              refetch()
                            }}
                          >
                            <Button variant="default" size="sm">
                              Record Payment
                            </Button>
                          </CreatePaymentDialog>
                        )}
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/orders/${order.id}`}>View</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

