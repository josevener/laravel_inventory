// resources/js/components/AppSidebar.jsx
import React from "react"
import { usePage } from "@inertiajs/react"
import {
  LayoutDashboard,
  Package,
  Truck,
  FileText,
  UserCheck,
  Factory,
  Users,
  Shield,
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

const CompanyHeader = ({ company_name }) => (
  <div className="flex items-center gap-3 px-4 py-6">
    <Factory className="h-9 w-9 text-primary" />
    <div>
      <h1 className="text-xl font-bold tracking-tight">{company_name}</h1>
      {/* <p className="text-xs text-muted-foreground">Management System</p> */}
    </div>
  </div>
)

export function AppSidebar({ ...props }) {
  const { auth, url } = usePage().props
  const userPermissions = auth?.user?.permissions || []

  const hasPermission = (perm) => !perm || userPermissions.includes(perm)

  const clientCode = auth?.user?.client?.code;

  const navMain = [
    { title: "Dashboard", url: "dashboard", icon: LayoutDashboard, permission: "View Dashboard" },
    { title: "Products", url: "products", icon: Package, permission: "View Products" },
    { title: "Inward Gate Pass", url: "gatepass/inward", icon: Truck, badge: "IN", permission: "View Inward Gatepass" },
    { title: "Pull Out", url: "pull_out", icon: Truck, permission: "View Outward Gatepass" },
    // { title: "Stock Transfer", url: "/transfer", icon: ArrowLeftRight, permission: "manage stock transfer" },
    // { title: "Stock Adjustment", url: "/adjustment", icon: AlertCircle, permission: "adjust stock" },
    {
      group: "Masters",
      items: [
        { title: "Categories", url: "categories", permission: "View Categories" },
        { title: "Projects", url: "projects", permission: "View Projects" },
        { title: "Units", url: "units", permission: "View Units" },
      ],
    },
    { title: "Users", url: "users", icon: UserCheck, permission: "View Users" },
    { title: "Companies", url: "companies", icon: Users, permission: "View Companies" },
    { title: "Roles & Permissions", url: "roles-permissions", icon: Shield, permission: "View Reports" },
    // { title: "Roles", url: "roles-permissions/roles", icon: FileText, permission: "view reports" },
    // { title: "Permissions", url: "roles-permissions/permissions", icon: Shield, permission: "view reports" },
    { title: "Reports", url: "reports", icon: FileText, permission: "View Reports" },
  ].map((item) => {
    if (item.items) {
      return {
        ...item,
        items: item.items.map((sub) => ({
          ...sub,
          url: `/${clientCode}/${sub.url}`,
        })),
      };
    }

    return {
      ...item,
      url: `/${clientCode}/${item.url}`,
    };
  }).filter(item => {
    if (item.permission) return hasPermission(item.permission)
    if (item.items) return item.items.some(sub => hasPermission(sub.permission))
    return true
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyHeader company_name={auth?.user?.client?.name}/>
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