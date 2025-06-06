"use client"

import * as React from "react"
import {
  FileText,
  LayoutDashboard,
  Star,
  FilePlus2,
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
      url: "/staff/procurement-dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Tenders",
      url: "/staff/procurement-dashboard/tenders",
      icon: FilePlus2,
    },
    {
      title: "Submissions",
      url: "/staff/procurement-dashboard/submissions",
      icon: FileText,
    },
    {
      title: "Evaluation",
      url: "/staff/procurement-dashboard/evaluation",
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
                  <span className="truncate text-xs">Procurement System</span>
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
