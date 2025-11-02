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
  SidebarMenuItem,
  SidebarTrigger
} from "components/ui/sidebar";
import { useLogout } from "features/auth/hooks/use-logout";
import { cn } from "lib/utils";
import { FaFileInvoiceDollar, FaUser } from "react-icons/fa";
import { IoCog, IoHome } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

export function AppSidebar() {
  const logout = useLogout();

  const pathname = useLocation().pathname;

  const items = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: IoHome
    },
    {
      label: "Clients",
      href: "/dashboard/clients",
      icon: FaUser
    },
    {
      label: "Invoices",
      href: "/dashboard/invoices",
      icon: FaFileInvoiceDollar
    }
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu className="flex flex-row items-center justify-between gap-2">
          <SidebarMenuItem className="flex items-center pl-2">
            <h1 className="text-brand-500 truncate text-xl font-bold">
              billsend
            </h1>
          </SidebarMenuItem>
          <SidebarTrigger className="lg:hidden" />
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
                <IoCog className="size-5!" />
                Settings
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
              <MdLogout className="size-5!" />
              Log out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
