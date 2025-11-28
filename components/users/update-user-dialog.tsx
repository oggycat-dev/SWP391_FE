"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
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

const userSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(['Admin', 'EVMStaff', 'EVMManager', 'DealerManager', 'DealerStaff', 'Customer']).optional(),
  dealerId: z.string().optional(),
  isActive: z.boolean().optional(),
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

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phoneNumber: "",
      role: "Customer",
      dealerId: "",
      isActive: true,
    },
  })

  // Reset form when user data loads or dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      form.reset({
        email: "",
        fullName: "",
        phoneNumber: "",
        role: "Customer",
        dealerId: "",
        isActive: true,
      })
      return
    }

    if (user && open) {
      // Map role number to string if needed
      const roleMap: Record<number, string> = {
        0: 'Admin',
        1: 'EVMStaff',
        2: 'EVMManager',
        3: 'DealerManager',
        4: 'DealerStaff',
        5: 'Customer',
      }
      
      // Get role as string - handle both number and string formats
      let mappedRole = user.role
      if (typeof user.role === 'number') {
        mappedRole = roleMap[user.role] || 'Customer'
      }
      
      // Only reset if user data is different from current form values
      const currentValues = form.getValues()
      if (
        currentValues.email !== user.email ||
        currentValues.fullName !== user.fullName ||
        currentValues.role !== mappedRole
      ) {
        form.reset({
          email: user.email,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber || "",
          role: (mappedRole as any) || "Customer",
          dealerId: user.dealerId || "",
          isActive: user.isActive,
        })
      }
    }
  }, [user?.id, open]) // Use user.id instead of user object to prevent unnecessary re-renders

  const onSubmit = async (data: UserFormValues) => {
    try {
      await mutate({
        id: userId,
        data: {
          email: data.email,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber || undefined,
          role: data.role,
          dealerId: data.dealerId || undefined,
          isActive: data.isActive,
        },
      })

      toast({
        title: "Success",
        description: "User updated successfully",
      })

      onOpenChange(false)
      onSuccess?.()
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
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || "Customer"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="EVMStaff">EVM Staff</SelectItem>
                          <SelectItem value="EVMManager">EVM Manager</SelectItem>
                          <SelectItem value="DealerManager">Dealer Manager</SelectItem>
                          <SelectItem value="DealerStaff">Dealer Staff</SelectItem>
                          <SelectItem value="Customer">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dealerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dealer ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional: Dealer ID" {...field} />
                      </FormControl>
                      <FormDescription>Required for Dealer roles</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end">
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-0.5">
                          <FormLabel>Active Status</FormLabel>
                          <FormDescription>Enable or disable user account</FormDescription>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

