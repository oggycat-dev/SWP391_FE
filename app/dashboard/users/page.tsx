"use client"

import { useState } from "react"
import * as React from "react"
import { Plus, Search, Edit, Trash2, Shield, ShieldCheck, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUsers } from "@/hooks/use-users"
import { CreateUserDialog } from "@/components/users/create-user-dialog"
import { UpdateUserDialog } from "@/components/users/update-user-dialog"
import { DeleteUserDialog } from "@/components/users/delete-user-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminOnlyRoute } from "@/lib/guards/route-guard"
import { useAuth } from "@/components/auth/auth-provider"
import type { Role } from "@/lib/types"

const ROLE_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  { value: 'Admin', label: 'Admin' },
  { value: 'EVMStaff', label: 'EVM Staff' },
  { value: 'EVMManager', label: 'EVM Manager' },
  { value: 'DealerManager', label: 'Dealer Manager' },
  { value: 'DealerStaff', label: 'Dealer Staff' },
  { value: 'Customer', label: 'Customer' },
]

const ROLE_BADGE_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Admin: "destructive",
  EVMStaff: "default",
  EVMManager: "default",
  DealerManager: "secondary",
  DealerStaff: "secondary",
  Customer: "outline",
}

function UsersPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [deletingUser, setDeletingUser] = useState<string | null>(null)
  
  // Memoize params to prevent unnecessary refetches
  const usersParams = React.useMemo(() => ({
    role: roleFilter && roleFilter !== 'all' ? roleFilter : undefined,
    search: searchTerm || undefined,
    page: 1,
    pageSize: 100,
  }), [roleFilter, searchTerm])
  
  const { data: usersData, isLoading, error, refetch } = useUsers(
    usersParams,
    { enabled: true, refetchInterval: undefined } // Disable auto-refetch
  )

  const users = usersData?.items || []

  const filteredUsers = users.filter(
    (u) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        (u.fullName?.toLowerCase().includes(searchLower) ?? false) ||
        (u.email?.toLowerCase().includes(searchLower) ?? false) ||
        (u.username?.toLowerCase().includes(searchLower) ?? false) ||
        (u.phoneNumber && u.phoneNumber.includes(searchTerm))
      )
    }
  )

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage all system users and their roles.</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load users: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage all system users and their roles.</p>
        </div>
        <CreateUserDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={() => {
            setIsCreateDialogOpen(false)
            refetch()
          }}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </CreateUserDialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, username, or phone..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No users found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName || user.email || user.username || 'User'}`} />
                          <AvatarFallback>
                            {(user.fullName || user.email || user.username || 'U').substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.fullName || user.email || user.username || 'Unknown User'}</div>
                          {user.username && (
                            <div className="text-xs text-muted-foreground">@{user.username}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>{user.email || 'No email'}</div>
                        {user.phoneNumber && (
                          <div className="text-muted-foreground">{user.phoneNumber}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ROLE_BADGE_VARIANTS[user.role] || "default"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? (
                          <>
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <UserX className="mr-1 h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingUser(user.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingUser(user.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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

      {editingUser && (
        <UpdateUserDialog
          userId={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null)
            refetch()
          }}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog
          userId={deletingUser}
          open={!!deletingUser}
          onOpenChange={(open: boolean) => !open && setDeletingUser(null)}
          onSuccess={() => {
            setDeletingUser(null)
            refetch()
          }}
        />
      )}
    </div>
  )
}

export default function UsersPage() {
  const { user, isLoading } = useAuth()
  const userRole = (user?.role as Role) || null

  return (
    <AdminOnlyRoute
      userRole={userRole}
      isAuthenticated={!!user}
      isLoading={isLoading}
    >
      <UsersPageContent />
    </AdminOnlyRoute>
  )
}

