import React from "react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"

export function NavMain({ items, currentUrl }) {
  return (
    <>
      {items.map((item, index) => {
        // Group (like Masters)
        if (item.group) {
          return (
            <SidebarGroup key={index}>
              <SidebarGroupLabel>{item.group}</SidebarGroupLabel>
              <SidebarMenu>
                {item.items.map((sub) => (
                  <SidebarMenuItem key={sub.title}>
                    <SidebarMenuButton asChild isActive={currentUrl === sub.url}>
                      <a href={sub.url}>
                        <span>{sub.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )
        }

        // Regular menu item
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={currentUrl === item.url}>
              <a href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </>
  )
}