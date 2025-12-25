// resources/js/components/AppSidebar.jsx
import React from "react"
import { usePage } from "@inertiajs/react"
import {
  LayoutDashboard,
  Package,
  FileText,
  UserCheck,
  Factory,
  Users,
  Shield,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  Combine,
  ChartBarStacked,
} from "lucide-react"

import { NavMain } from "@/Components/nav-main"
import { NavUser } from "@/Components/nav-user"
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/Components/ui/sidebar"

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
  const isSuperAdmin = auth?.user?.client?.is_superadmin ? true : false;
  const hasViewCompanies = userPermissions.includes("View Companies")

  const navMain = [
    {
      group: "Productivity",
      items: [
        { title: "Dashboard", url: "dashboard", icon: LayoutDashboard, permission: "View Dashboard" },
      ],
    },
    {
      group: "Maintenance",
      items: [
        { title: "Products", url: "products", icon: Package, permission: "View Products" },
        { title: "Dispatch", url: "gatepass/dispatch", icon: ArrowDownLeft, badge: "OUT", permission: "View Dispatch Gatepass" },
        { title: "Pull Out", url: "gatepass/pullout", icon: ArrowUpRight, badge: "IN", permission: "View Pull Out Gatepass" },
        { title: "Projects", url: "projects", icon: Boxes, permission: "View Projects" },
        { title: "Users", url: "users", icon: UserCheck, permission: "View Users" },
        // Show Companies if superadmin OR has permission
        ...(isSuperAdmin && hasViewCompanies
          ? [{
              title: "Companies",
              url: "companies",
              icon: Users,
              permission: "View Companies"
            }]
          : []),
        { title: "Roles & Permissions", url: "roles-permissions", icon: Shield, permission: "View Reports" },
        // { title: "Stock Transfer", url: "/transfer", icon: ArrowLeftRight, permission: "manage stock transfer" },
        // { title: "Stock Adjustment", url: "/adjustment", icon: AlertCircle, permission: "adjust stock" },
      ],
    },
    {
      group: "Catalogs",
      items: [
        { title: "Categories", url: "categories", icon: ChartBarStacked, permission: "View Categories" },
        { title: "Units", url: "units", icon: Combine, permission: "View Units" },
      ],
    },
    // { title: "Roles", url: "roles-permissions/roles", icon: FileText, permission: "view reports" },
    // { title: "Permissions", url: "roles-permissions/permissions", icon: Shield, permission: "view reports" },
    {
      group: "Reports",
      items: [
        { title: "Reports", url: "reports", icon: FileText, permission: "View Reports" },
      ]
    }
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
          name: `${auth?.user?.first_name} ${auth?.user?.last_name}` || "Guest",
          email: auth?.user?.email || "",
          avatar: "/avatars/default.jpg",
        }} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}