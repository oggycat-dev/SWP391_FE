import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusType =
  | "draft"
  | "pending"
  | "approved"
  | "vehicle_allocated"
  | "delivered"
  | "completed"
  | "cancelled" // Order
  | "sent"
  | "accepted"
  | "rejected"
  | "expired" // Quotation

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig: Record<
  StatusType,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
> = {
  draft: { label: "Draft", variant: "secondary" },
  pending: { label: "Pending", variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  approved: { label: "Approved", variant: "default", className: "bg-blue-500 hover:bg-blue-600" },
  vehicle_allocated: { label: "Allocated", variant: "default", className: "bg-indigo-500 hover:bg-indigo-600" },
  delivered: { label: "Delivered", variant: "default", className: "bg-purple-500 hover:bg-purple-600" },
  completed: { label: "Completed", variant: "default", className: "bg-green-500 hover:bg-green-600" },
  cancelled: { label: "Cancelled", variant: "destructive" },

  sent: { label: "Sent", variant: "outline", className: "text-blue-500 border-blue-500" },
  accepted: { label: "Accepted", variant: "default", className: "bg-green-500 hover:bg-green-600" },
  rejected: { label: "Rejected", variant: "destructive" },
  expired: { label: "Expired", variant: "secondary" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: "secondary" }

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
