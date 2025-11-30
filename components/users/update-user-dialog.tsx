"use client"

import { useEffect, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useUser, useUpdateUser } from "@/hooks/use-users"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { UserRole } from "@/lib/types/enums"

// Map role string to enum number
const roleStringToEnum: Record<string, number> = {
  'Admin': UserRole.Admin, // 0
  'EVMStaff': UserRole.EVMStaff, // 1
  'DealerManager': UserRole.DealerManager, // 3
  'DealerStaff': UserRole.DealerStaff, // 4
  'Customer': UserRole.Customer, // 5
}

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  role: z.enum(['Admin', 'EVMStaff', 'DealerManager', 'DealerStaff', 'Customer'], {
    required_error: "Please select a role",
  }),
  isActive: z.boolean(),
})

type UserFormValues = z.infer<typeof userSchema>

interface UpdateUserDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UpdateUserDialog({
  userId,
  open,
  onOpenChange,
  onSuccess,
}: UpdateUserDialogProps) {
  const { data: user, isLoading: isLoadingUser } = useUser(userId, { enabled: open && !!userId })
  const { mutate, isLoading } = useUpdateUser()
  const { toast } = useToast()

  // Track processed user ID to prevent duplicate form resets
  const processedUserIdRef = useRef<string | null>(null)
  const isMountedRef = useRef(true)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: "Customer",
      isActive: true,
    },
  })

  // Watch role value to debug
  const watchedRole = useWatch({
    control: form.control,
    name: "role",
  })
  
  console.log('[UpdateUserDialog] Watched role value:', watchedRole)

  // Track mount state
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      processedUserIdRef.current = null
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        role: "Customer",
        isActive: true,
      })
    }
  }, [open, form])

  // Reset form when user data loads (only once per user ID)
  useEffect(() => {
    // Only proceed if dialog is open, we have user data, and haven't processed this user yet
    if (!open || !user || !isMountedRef.current) {
      return
    }

    // Skip if we've already processed this user
    if (processedUserIdRef.current === user.id) {
      console.log('[UpdateUserDialog] User already processed, skipping:', user.id)
      return
    }

    // Map role number to string using UserRole enum (excluding EVMManager = 2)
    const roleMap: Record<number, string> = {
      [UserRole.Admin]: 'Admin',
      [UserRole.EVMStaff]: 'EVMStaff',
      // [UserRole.EVMManager]: 'EVMManager', // Removed (value = 2)
      [UserRole.DealerManager]: 'DealerManager',
      [UserRole.DealerStaff]: 'DealerStaff',
      [UserRole.Customer]: 'Customer',
    }
    
    // Get role as string - handle both number and string formats
    type ValidRole = 'Admin' | 'EVMStaff' | 'DealerManager' | 'DealerStaff' | 'Customer'
    let mappedRole: ValidRole = 'Customer'
    
    // Convert role to number if it's a string number
    let roleNumber: number | null = null
    if (typeof user.role === 'number') {
      roleNumber = user.role
    } else if (typeof user.role === 'string') {
      // Check if it's a valid role string first
      const validRoles: ValidRole[] = ['Admin', 'EVMStaff', 'DealerManager', 'DealerStaff', 'Customer']
      if (validRoles.includes(user.role as ValidRole)) {
        mappedRole = user.role as ValidRole
      } else {
        // Try to parse as number
        const parsed = parseInt(user.role, 10)
        if (!isNaN(parsed)) {
          roleNumber = parsed
        }
      }
    }
    
    // Map number to string if we have a role number
    if (roleNumber !== null) {
      const roleStr = roleMap[roleNumber]
      if (roleStr) {
        mappedRole = roleStr as ValidRole
      } else {
        // If role is 2 (EVMManager) or unknown, default to Customer
        console.warn(`[UpdateUserDialog] Unknown role number: ${roleNumber}, defaulting to Customer`)
        mappedRole = 'Customer'
      }
    }
    
    // Debug log to verify mapping
    console.log('[UpdateUserDialog] User role mapping:', {
      userId: user.id,
      originalRole: user.role,
      roleType: typeof user.role,
      mappedRole,
      roleNumber,
    })
    
    // Mark this user as processed
    processedUserIdRef.current = user.id
    
    // Prepare form data
    const formData = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      role: mappedRole,
      isActive: user.isActive ?? true,
    }
    
    console.log('[UpdateUserDialog] Resetting form with data:', formData)
    
    // Reset form with user data - this will update all fields including role
    form.reset(formData, { keepDefaultValues: false })
    
    // Immediately verify and force update if needed
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (isMountedRef.current && processedUserIdRef.current === user.id) {
        const currentRoleValue = form.getValues('role')
        console.log('[UpdateUserDialog] Current form role value after reset:', currentRoleValue, 'Expected:', mappedRole)
        
        if (currentRoleValue !== mappedRole) {
          console.log('[UpdateUserDialog] Role value mismatch, forcing update to:', mappedRole)
          form.setValue('role', mappedRole, { 
            shouldValidate: false, 
            shouldDirty: false, 
            shouldTouch: false 
          })
        }
        
        // Also ensure all other fields are set correctly
        form.setValue('firstName', formData.firstName, { shouldValidate: false, shouldDirty: false })
        form.setValue('lastName', formData.lastName, { shouldValidate: false, shouldDirty: false })
        form.setValue('email', formData.email, { shouldValidate: false, shouldDirty: false })
        form.setValue('phoneNumber', formData.phoneNumber, { shouldValidate: false, shouldDirty: false })
        form.setValue('isActive', formData.isActive, { shouldValidate: false, shouldDirty: false })
      }
    })
  }, [user?.id, open, form]) // Only depend on user.id to prevent unnecessary re-runs

  const onSubmit = async (data: UserFormValues) => {
    try {
      // Convert role string to enum number
      const roleEnum = roleStringToEnum[data.role] ?? UserRole.Customer
      
      await mutate({
        id: userId,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber || undefined,
          role: roleEnum, // Send enum number instead of string
          isActive: data.isActive,
        },
      })

      toast({
        title: "Success",
        description: "User updated successfully",
      })

      // Close dialog first to disable useUser hook and prevent refetch
      // This ensures only the list is refetched, not the individual user
      onOpenChange(false)
      
      // Call onSuccess after a small delay to ensure dialog is closed
      // This prevents useUser from refetching when onSuccess triggers list refetch
      setTimeout(() => {
        onSuccess?.()
      }, 100)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to update user",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>Update user information and role.</DialogDescription>
        </DialogHeader>

        {isLoadingUser ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+84 123 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => {
                    // Ensure value is always a valid role string
                    const roleValue = field.value || "Customer"
                    const selectKey = `role-select-${user?.id || 'new'}-${roleValue}-${Date.now()}`
                    
                    console.log('[UpdateUserDialog] Select render - field.value:', field.value, 'roleValue:', roleValue, 'user.id:', user?.id)
                    
                    return (
                      <FormItem>
                        <FormLabel>Role *</FormLabel>
                        <Select 
                          key={selectKey} // Force re-render when user or role changes
                          onValueChange={(value) => {
                            console.log('[UpdateUserDialog] Select value changed to:', value)
                            field.onChange(value)
                          }} 
                          value={roleValue}
                          defaultValue={roleValue}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role">
                                {roleValue === 'Admin' && 'Admin'}
                                {roleValue === 'EVMStaff' && 'EVM Staff'}
                                {roleValue === 'DealerManager' && 'Dealer Manager'}
                                {roleValue === 'DealerStaff' && 'Dealer Staff'}
                                {roleValue === 'Customer' && 'Customer'}
                                {!roleValue && 'Select a role'}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="EVMStaff">EVM Staff</SelectItem>
                            <SelectItem value="DealerManager">Dealer Manager</SelectItem>
                            <SelectItem value="DealerStaff">Dealer Staff</SelectItem>
                            <SelectItem value="Customer">Customer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable user account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update User
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

