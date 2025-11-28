"use client"

import { useState } from "react"
import { Plus, Search, Calendar, Clock, Car, User, CheckCircle, XCircle } from "lucide-react" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useTestDrives } from "@/hooks/use-test-drives"
import { CreateTestDriveDialog } from "@/components/test-drives/create-test-drive-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { TestDriveStatus } from "@/lib/api/test-drives"

const statusConfig: Record<TestDriveStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  [TestDriveStatus.Scheduled]: { label: "Scheduled", variant: "default" },
  [TestDriveStatus.Completed]: { label: "Completed", variant: "default" },
  [TestDriveStatus.Cancelled]: { label: "Cancelled", variant: "destructive" },
  [TestDriveStatus.NoShow]: { label: "No Show", variant: "secondary" },
}

export default function TestDrivesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<TestDriveStatus | "all">("all")

  const { data, isLoading, error, refetch } = useTestDrives(
    {
      status: statusFilter !== "all" ? statusFilter : undefined,
    },
    { enabled: true }
  )

  const testDrives = data?.items || []

  const filteredTestDrives = testDrives.filter((td) => {
    const matchesSearch = searchTerm === "" || 
      td.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      td.vehicleId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Test Drives</h1>
            <p className="text-muted-foreground">Schedule and manage test drive appointments.</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load test drives: {error.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Drives</h1>
          <p className="text-muted-foreground">Schedule and manage test drive appointments.</p>
        </div>
        <CreateTestDriveDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={() => {
            setIsCreateDialogOpen(false)
            refetch()
          }}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Schedule Test Drive
          </Button>
        </CreateTestDriveDialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer or vehicle..."
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
                variant={statusFilter === TestDriveStatus.Scheduled ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(TestDriveStatus.Scheduled)}
              >
                Scheduled
              </Button>
              <Button
                variant={statusFilter === TestDriveStatus.Completed ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(TestDriveStatus.Completed)}
              >
                Completed
              </Button>
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
          ) : filteredTestDrives.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No test drives found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTestDrives.map((testDrive) => (
                  <TableRow key={testDrive.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{testDrive.customerId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span>{testDrive.vehicleId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(testDrive.scheduledDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {testDrive.scheduledTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[testDrive.status].variant}>
                        {statusConfig[testDrive.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(testDrive.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
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
