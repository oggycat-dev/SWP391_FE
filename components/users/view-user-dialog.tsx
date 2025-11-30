"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/hooks/use-users"
import { Skeleton } from "@/components/ui/skeleton"
import { ShieldCheck, UserX, Mail, Phone, User, Building2, Calendar, Hash } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Map role number to display name
const getRoleName = (role: string | number): string => {
  if (typeof role === 'string') return role

  const roleMap: Record<number, string> = {
    0: 'Admin',
    1: 'EVM Staff',
    // 2: 'EVM Manager', // Removed
    3: 'Dealer Manager',
    4: 'Dealer Staff',
    5: 'Customer',
  }
  
  return roleMap[role] || 'Unknown'
}

const ROLE_BADGE_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Admin: "destructive",
  'EVM Staff': "default",
  'Dealer Manager': "secondary",
  'Dealer Staff': "secondary",
  Customer: "outline",
  EVMStaff: "default",
  DealerManager: "secondary",
  DealerStaff: "secondary",
}

interface ViewUserDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewUserDialog({
  userId,
  open,
  onOpenChange,
}: ViewUserDialogProps) {
  const { data: user, isLoading } = useUser(userId, { enabled: open && !!userId })

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View user information and details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View user information and details.</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            User not found
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const roleName = getRoleName(user.role)
  const roleBadgeVariant = ROLE_BADGE_VARIANTS[roleName] || "default"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>View user information and details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName || user.lastName || user.email || user.username || 'User'}`} 
              />
              <AvatarFallback>
                {((user.firstName?.[0] || '') + (user.lastName?.[0] || '') || user.email?.[0] || user.username?.[0] || 'U').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || user.username || 'Unknown User'}
              </h3>
              {user.username && (
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={roleBadgeVariant}>{roleName}</Badge>
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
              </div>
            </div>
          </div>

          <Separator />

          {/* User Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email || 'No email'}</p>
                </div>
              </div>

              {user.phoneNumber && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Phone Number</p>
                    <p className="text-sm text-muted-foreground">{user.phoneNumber}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">First Name</p>
                  <p className="text-sm text-muted-foreground">{user.firstName || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Last Name</p>
                  <p className="text-sm text-muted-foreground">{user.lastName || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-sm text-muted-foreground">{user.username || 'Not provided'}</p>
                </div>
              </div>

              {user.dealerId && (
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Dealer ID</p>
                    <p className="text-sm text-muted-foreground">{user.dealerId}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Created At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {user.updatedAt && (
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

