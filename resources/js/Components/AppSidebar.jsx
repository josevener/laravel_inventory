// resources/js/components/AppSidebar.jsx
import React from "react"
import { usePage } from "@inertiajs/react"
import {
  LayoutDashboard,
  Package,
  Truck,
  ArrowLeftRight,
  AlertCircle,
  FileText,
  Settings,
  UserCheck,
  Factory,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const CompanyHeader = () => (
  <div className="flex items-center gap-3 px-4 py-6">
    <Factory className="h-9 w-9 text-primary" />
    <div>
      <h1 className="text-xl font-bold tracking-tight">SSI Metal Corp.</h1>
      {/* <p className="text-xs text-muted-foreground">Management System</p> */}
    </div>
  </div>
)

export function AppSidebar({ ...props }) {
  const { auth, url } = usePage().props
  const userPermissions = auth?.user?.permissions || []

  const hasPermission = (perm) => !perm || userPermissions.includes(perm)

  const navMain = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, permission: "view dashboard" },
    { title: "Products", url: "/products", icon: Package, permission: "manage products" },
    { title: "Inward Gate Pass", url: "/gatepass/inward", icon: Truck, badge: "IN", permission: "view inward gatepass" },
    { title: "Pull Out", url: "/pull_out", icon: Truck, permission: "create outward gatepass" },
    { title: "Stock Transfer", url: "/transfer", icon: ArrowLeftRight, permission: "manage stock transfer" },
    { title: "Stock Adjustment", url: "/adjustment", icon: AlertCircle, permission: "adjust stock" },
    {
      group: "Masters",
      items: [
        { title: "Categories", url: "/categories", permission: "manage products" },
        { title: "Projects", url: "/projects", permission: "manage products" },
        { title: "Units", url: "/units", permission: "manage products" },
      ],
    },
    { title: "Reports", url: "/reports", icon: FileText, permission: "view reports" },
    { title: "Users & Roles", url: "/users", icon: UserCheck, permission: "manage users" },
  ].filter(item => {
    if (item.permission) return hasPermission(item.permission)
    if (item.items) return item.items.some(sub => hasPermission(sub.permission))
    return true
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyHeader />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} currentUrl={url} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{
          name: auth?.user?.name || "Guest",
          email: auth?.user?.email || "",
          avatar: "/avatars/default.jpg",
        }} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}