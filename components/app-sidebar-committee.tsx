"use client"

import * as React from "react"
import {
  FileText,
  LayoutDashboard,
  Star,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/staff/committee-dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Submissions",
      url: "/staff/committee-dashboard/submissions",
      icon: FileText,
    },
    {
      title: "Ranking",
      url: "/staff/committee-dashboard/evaluation",
      icon: Star,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <Image src="/logo.png" alt="logo" width={50} height={50} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">eProcure</span>
                  <span className="truncate text-xs">Committee Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
} 