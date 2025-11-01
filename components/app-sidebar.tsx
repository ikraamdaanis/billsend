import { Link, useLocation } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "components/ui/sidebar";
import { useLogout } from "features/auth/hooks/use-logout";
import { cn } from "lib/utils";
import { FileCheck, Home, LogOut, Settings, Users } from "lucide-react";

export function AppSidebar() {
  const logout = useLogout();

  const pathname = useLocation().pathname;

  const items = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home
    },
    {
      label: "Clients",
      href: "/dashboard/clients",
      icon: Users
    },
    {
      label: "Invoices",
      href: "/dashboard/invoices",
      icon: FileCheck
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center pl-2">
            <h1 className="text-brand-500 truncate text-xl font-bold">
              billsend
            </h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.href}>
                  <Link to={item.href} preload="viewport">
                    <SidebarMenuButton
                      size="lg"
                      className={cn(
                        pathname === item.href &&
                          "text-brand-500 hover:text-brand-600 bg-zinc-100"
                      )}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/dashboard/settings" preload="viewport">
              <SidebarMenuButton size="lg">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={async () => await logout.mutateAsync()}
              disabled={logout.isPending}
              className={cn(
                "text-red-600 hover:bg-red-50 hover:text-red-700",
                logout.isPending && "opacity-50"
              )}
            >
              <LogOut />
              <span>{logout.isPending ? "Logging out..." : "Log out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
