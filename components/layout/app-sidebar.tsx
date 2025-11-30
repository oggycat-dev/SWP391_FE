"use client"

import type * as React from "react"
import { useMemo } from "react"
import {
  GalleryVerticalEnd,
  PieChart,
  Car,
  Users,
  ShoppingCart,
  Package,
  LayoutDashboard,
  Calendar,
  Building2,
  Tag,
  FileText,
  DollarSign,
  UserCog,
  MessageSquare,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, useSidebar } from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import { canAccessRoute } from "@/lib/config/role-config"
import type { Role } from "@/lib/types"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const userRole = (user?.role as Role) || null
  const { state } = useSidebar()

  // All possible menu items
  const allMenuItems: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Vehicles",
      url: "/dashboard/vehicles",
      icon: Car,
      items: [
        {
          title: "Overview",
          url: "/dashboard/vehicles",
        },
        {
          title: "Models",
          url: "/dashboard/vehicles/models",
        },
        {
          title: "Variants & Colors",
          url: "/dashboard/vehicles/variants",
        },
        {
          title: "Inventory",
          url: "/dashboard/vehicles/inventory",
        },
        {
          title: "Requests",
          url: "/dashboard/vehicles/requests",
        },
        {
          title: "Comparison",
          url: "/dashboard/vehicles/compare",
        },
      ],
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: ShoppingCart,
      items: [
        {
          title: "All Orders",
          url: "/dashboard/orders",
        },
        {
          title: "Create Order",
          url: "/dashboard/orders/create",
        },
      ],
    },
    {
      title: "Quotations",
      url: "/dashboard/quotations",
      icon: FileText,
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
      icon: Package,
      items: [
        {
          title: "Stock Status",
          url: "/dashboard/inventory",
        },
        {
          title: "Requests",
          url: "/dashboard/inventory/request",
        },
      ],
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Test Drives",
      url: "/dashboard/test-drives",
      icon: Calendar,
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: DollarSign,
    },
    {
      title: "Dealers",
      url: "/dashboard/dealers",
      icon: Building2,
      items: [
        {
          title: "All Dealers",
          url: "/dashboard/dealers",
        },
        {
          title: "Contracts",
          url: "/dashboard/dealers/contracts",
        },
        {
          title: "Debts",
          url: "/dashboard/dealers/debts",
        },
      ],
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: UserCog,
    },
    {
      title: "Promotions",
      url: "/dashboard/promotions",
      icon: Tag,
    },
    {
      title: "Feedbacks",
      url: "/dashboard/feedbacks",
      icon: MessageSquare,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: PieChart,
    },
  ]

  // Filter menu items based on user role
  const filteredMenuItems = useMemo(() => {
    if (!userRole) return []

    return allMenuItems.filter((item) => {
      // Check if main route is accessible
      if (!canAccessRoute(item.url, userRole)) {
        return false
      }

      // Filter sub-items if they exist
      if (item.items) {
        item.items = item.items.filter((subItem) => canAccessRoute(subItem.url, userRole))
        // Only show parent if it has accessible sub-items or the parent route itself is accessible
        return item.items.length > 0 || canAccessRoute(item.url, userRole)
      }

      return true
    })
  }, [userRole])

  const defaultUser = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: user?.avatar || "https://github.com/shadcn.png",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-2">
            <GalleryVerticalEnd className="h-6 w-6 shrink-0" />
            {state === "expanded" && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold">EV Dealer System</span>
                {userRole && <span className="text-xs text-muted-foreground">{userRole}</span>}
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredMenuItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={defaultUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
