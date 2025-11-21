"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Car, ShoppingCart, TrendingUp, AlertCircle, Activity } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const isDealer = user.role.includes("dealer")
  const isManager = user.role === "dealer_manager"
  const isEVM = user.role === "evm_staff"
  const isAdmin = user.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {user.role.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isDealer ? "Active Orders" : "Total Dealers"}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isDealer ? "12" : "48"}</div>
            <p className="text-xs text-muted-foreground">{isDealer ? "+2 new today" : "+4 this month"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isDealer ? "Vehicles in Stock" : "Total Production"}</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isDealer ? "24" : "1,203"}</div>
            <p className="text-xs text-muted-foreground">{isDealer ? "4 reserved" : "Running at 92% capacity"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Role Specific Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart Area */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md">
              <Activity className="mr-2 h-4 w-4" />
              Sales Performance Chart Placeholder
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity / Tasks */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">New customer registered</p>
                    <p className="text-sm text-muted-foreground">Olivia Martin created a new account</p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-muted-foreground">Just now</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manager/Admin Only Section */}
      {(isManager || isAdmin || isEVM) && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">You have 3 large orders waiting for approval.</div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Sales Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Team is at 85% of monthly goal with 5 days remaining.</div>
            </CardContent>
          </Card>

          {isEVM && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-blue-500" />
                  Inventory Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Model X inventory low in Northern Region.</div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
