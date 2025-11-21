"use client"

import { useParams } from "next/navigation"
import { MOCK_CUSTOMERS, MOCK_ORDERS, MOCK_VEHICLES } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/orders/status-badge"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CreditCard } from "lucide-react"
import Link from "next/link"

export default function CustomerProfilePage() {
  const params = useParams()
  const customer = MOCK_CUSTOMERS.find((c) => c.id === params.id)

  if (!customer) return <div>Customer not found</div>

  const orders = MOCK_ORDERS.filter((o) => o.customerId === customer.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Customer Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`} />
                <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{customer.name}</h2>
              <p className="text-sm text-muted-foreground">
                Customer since {new Date(customer.createdAt).getFullYear()}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{customer.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>DOB: {new Date(customer.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>ID: {customer.idNumber}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button className="w-full bg-transparent" variant="outline">
                Edit Profile
              </Button>
              <Button className="w-full">Create Order</Button>
            </div>
          </CardContent>
        </Card>

        {/* History Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="orders">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="appointments">Test Drives</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const vehicle = MOCK_VEHICLES.find((v) => v.id === order.vehicleId)
                      return (
                        <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-1">
                            <div className="font-medium">Order #{order.id.toUpperCase()}</div>
                            <div className="text-sm text-muted-foreground">
                              {vehicle?.brand} {vehicle?.modelName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="font-bold">${order.totalAmount.toLocaleString()}</div>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                      )
                    })}
                    {orders.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">No orders found for this customer.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">No upcoming test drives scheduled.</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
