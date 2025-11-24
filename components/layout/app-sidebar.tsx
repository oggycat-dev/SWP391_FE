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
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
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
          title: "Catalog",
          url: "/dashboard/vehicles",
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
    },
    {
      title: "Promotions",
      url: "/dashboard/promotions",
      icon: Tag,
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
    name: user?.name || "Guest",
    email: user?.email || "guest@example.com",
    avatar: user?.avatar || "https://github.com/shadcn.png",
  }

  const teams = [
    {
      name: "EV Dealer Management System",
      logo: GalleryVerticalEnd,
      plan: userRole || "Guest",
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
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
