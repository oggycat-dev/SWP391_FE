"use client"

import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import { MOCK_ORDERS, MOCK_CUSTOMERS, MOCK_VEHICLES } from "@/lib/mock-data"
import { StatusBadge } from "@/components/orders/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Printer, CreditCard, Truck, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function OrderDetailPage() {
  const params = useParams()
  const order = MOCK_ORDERS.find((o) => o.id === params.id)

  if (!order) return <div>Order not found</div>

  const customer = MOCK_CUSTOMERS.find((c) => c.id === order.customerId)
  const vehicle = MOCK_VEHICLES.find((v) => v.id === order.vehicleId)

  // Mock status progression
  const steps = [
    { id: "pending", label: "Pending Approval" },
    { id: "approved", label: "Approved" },
    { id: "vehicle_allocated", label: "Vehicle Allocated" },
    { id: "delivered", label: "Delivered" },
    { id: "completed", label: "Completed" },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === order.status)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id.toUpperCase()}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Created on {new Date(order.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <StatusBadge status={order.status} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Print Contract
          </Button>
          {order.status === "pending" && <Button>Approve Order</Button>}
          {order.status === "approved" && (
            <Button>
              <Truck className="mr-2 h-4 w-4" /> Allocate Vehicle
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Stepper */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex
                  const isCurrent = index === currentStepIndex

                  return (
                    <div key={step.id} className="flex flex-col items-center relative z-10">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                          isCompleted
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-muted-foreground text-muted-foreground",
                          isCurrent && "ring-4 ring-primary/20",
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-xs mt-2 font-medium",
                          isCompleted ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  )
                })}
                {/* Connecting Line */}
                <div className="absolute top-4 left-0 w-full h-[2px] bg-muted -z-0">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Model</div>
                <div className="text-lg font-semibold">
                  {vehicle?.brand} {vehicle?.modelName}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">VIN</div>
                <div className="text-lg font-mono">Pending Allocation</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Color</div>
                <div>{vehicle?.colors[0].name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Variant</div>
                <div>{vehicle?.variants[0].name}</div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Payment Method</div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-muted-foreground">Total Amount</div>
                  <div className="text-2xl font-bold text-primary">${order.totalAmount.toLocaleString()}</div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Deposit Paid</span>
                  <span className="font-medium text-green-600">$1,000.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining Balance</span>
                  <span className="font-medium">${(order.totalAmount - 1000).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Name</div>
                <div>{customer?.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div className="text-sm">{customer?.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Phone</div>
                <div>{customer?.phone}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Address</div>
                <div className="text-sm">{customer?.address}</div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">
                Customer requested delivery by end of month. Prefer morning delivery.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
