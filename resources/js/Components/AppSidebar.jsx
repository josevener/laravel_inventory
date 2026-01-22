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
  Table,
  UtensilsCrossed,
  ClipboardList,
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

  const clientCode = auth?.user?.client?.code
  const isSuperAdmin = auth?.user?.client?.is_superadmin || false
  const isPosEnable = auth?.user?.client?.is_pos_enable || false
  const isBrandEnable = auth?.user?.client?.is_brand_enable || false
  const hasViewCompanies = userPermissions.includes("View Companies")

  // Define groups and items
  const navGroups = [
    {
      group: "Productivity",
      items: [
        { title: "Dashboard", url: "dashboard", icon: LayoutDashboard, permission: "View Dashboard" },
      ],
    },
    ...(isPosEnable
      ? [
          {
            group: "Point Of Sale",
            items: [
              { title: "POS Screen", url: "pos", icon: Package, permission: "View Products" },
              { title: "Orders", url: "pos/orders", icon: ClipboardList, permission: "View Products" },
              { title: "Kitchen Display", url: "pos/kitchen_display", icon: Table, permission: "View Products" },
              { title: "Tables", url: "pos/tables", icon: UtensilsCrossed, permission: "View Products" },
            ],
          },
        ]
      : []),
    {
      group: "Maintenance",
      items: [
        { title: "Products", url: "products", icon: Package, permission: "View Products" },
        { title: "Dispatch", url: "gatepass/dispatch", icon: ArrowDownLeft, badge: "OUT", permission: "View Dispatch Gatepass" },
        { title: "Pull Out", url: "gatepass/pullout", icon: ArrowUpRight, badge: "IN", permission: "View Pull Out Gatepass" },
        { title: "Projects", url: "projects", icon: Boxes, permission: "View Projects" },
        { title: "Users", url: "users", icon: UserCheck, permission: "View Users" },
        ...(isSuperAdmin && hasViewCompanies
          ? [{ title: "Companies", url: "companies", icon: Users, permission: "View Companies" }]
          : []),
        { title: "Roles & Permissions", url: "roles-permissions", icon: Shield, permission: "View Roles" },
      ],
    },
    {
      group: "Catalogs",
      items: [
        { title: "Categories", url: "categories", icon: ChartBarStacked, permission: "View Categories" },
        ...(isBrandEnable
          ? [{ title: "Brands", url: "brands", icon: ChartBarStacked, permission: "View Categories" }]
          : []),
        { title: "Units", url: "units", icon: Combine, permission: "View Units" },
      ],
    },
    {
      group: "Reports",
      items: [
        { title: "Reports", url: "reports", icon: FileText, permission: "View Reports" },
      ]
    }
  ]

  // Filter items by user permissions and prepend client code
  const navMain = navGroups
    .map(group => {
      const filteredItems = group.items
        .filter(item => userPermissions.includes(item.permission))
        .map(item => ({
          ...item,
          url: `/${clientCode}/${item.url}`,
        }))

      if (filteredItems.length === 0) return null // skip empty groups
      return {
        ...group,
        items: filteredItems,
      }
    })
    .filter(Boolean) // remove nulls

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