"use client"

import type * as React from "react"
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
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  teams: [
    {
      name: "EV Dealer Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
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
          title: "Create Quote",
          url: "/dashboard/orders/create",
        },
      ],
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
