"use client"

import {
  IconDashboard,
  IconInnerShadowTop
} from "@tabler/icons-react"
import * as React from "react"

import { NavMain } from "@/components/custom/nav-main"
import { NavUser } from "@/components/custom/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useMe } from "@/hooks/queries/useMe"
import { cn } from "@/lib/utils"
import { Separator } from "../ui/separator"
import { CreateTransactionModal } from "./create-transaction-modal"

const navMain = [
  {
    title: "Dashboard",
    url: "#",
    icon: IconDashboard,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { me, isLoading } = useMe()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Woovi</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Separator
        className={cn("bg-sidebar-border mb-4 w-auto")}
      />

      <SidebarContent>
        <CreateTransactionModal />
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        {isLoading ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" disabled>
                <div className="grid flex-1 text-left text-sm leading-tight gap-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="ml-auto size-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : me ? (
          <NavUser user={{
            name: me.fullName,
            email: me.email,
            avatar: "",
          }} />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  )
}
