"use client"

import { useState } from "react"
import { Plus, Search, CalendarIcon, Clock, CheckCircle, XCircle, User, Car } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MOCK_TEST_DRIVES, MOCK_CUSTOMERS, MOCK_VEHICLES } from "@/lib/mock-data"

export default function TestDrivesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTestDrives = MOCK_TEST_DRIVES.filter((td) => {
    const customer = MOCK_CUSTOMERS.find((c) => c.id === td.customerId)
    const vehicle = MOCK_VEHICLES.find((v) => v.id === td.vehicleId)
    const searchString = `${customer?.name} ${vehicle?.modelName} ${td.status}`.toLowerCase()
    return searchString.includes(searchTerm.toLowerCase())
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Scheduled
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Test Drives</h2>
          <p className="text-muted-foreground">Manage test drive schedules and feedback.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Test Drive
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Schedules</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schedules..."
                className="pl-8"
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
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestDrives.map((td) => {
                const customer = MOCK_CUSTOMERS.find((c) => c.id === td.customerId)
                const vehicle = MOCK_VEHICLES.find((v) => v.id === td.vehicleId)

                return (
                  <TableRow key={td.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium">{customer?.name}</span>
                          <span className="text-xs text-muted-foreground">{customer?.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span>{vehicle?.modelName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-sm">
                          <CalendarIcon className="h-3 w-3" />
                          {format(new Date(td.date), "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {td.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(td.status)}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {td.notes || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Complete">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Cancel">
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
