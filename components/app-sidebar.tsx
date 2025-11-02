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
  SidebarTrigger,
  useSidebar
} from "components/ui/sidebar";
import { useLogout } from "features/auth/hooks/use-logout";
import { cn } from "lib/utils";
import { FaFileInvoiceDollar, FaUser } from "react-icons/fa";
import { IoCog, IoHome } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

export function AppSidebar() {
  const logout = useLogout();

  const pathname = useLocation().pathname;

  const { isMobile, setOpenMobile } = useSidebar();

  const items = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: IoHome,
      iconClassName: "bg-blue-400"
    },
    {
      label: "Clients",
      href: "/dashboard/clients",
      icon: FaUser,
      iconClassName: "bg-green-400"
    },
    {
      label: "Invoices",
      href: "/dashboard/invoices",
      icon: FaFileInvoiceDollar,
      iconClassName: "bg-purple-400"
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
                  <Link
                    to={item.href}
                    preload="viewport"
                    onClick={() => setOpenMobile(false)}
                  >
                    <SidebarMenuButton
                      size="lg"
                      className={cn(
                        "flex items-center gap-2 font-medium",
                        pathname === item.href && "bg-zinc-100"
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-6 place-content-center rounded-sm",
                          item.iconClassName
                        )}
                      >
                        <item.icon className="text-white" />
                      </span>
                      {item.label}
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
            <Link
              to="/dashboard/settings"
              preload="viewport"
              onClick={() => {
                if (isMobile) setOpenMobile(false);
              }}
            >
              <SidebarMenuButton
                size="lg"
                className={cn(
                  "font-medium",
                  pathname === "/dashboard/settings" && "bg-zinc-100"
                )}
              >
                <span className="grid size-6 place-content-center rounded-sm bg-zinc-400">
                  <IoCog className="size-5! text-white" />
                </span>
                Settings
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={async () => await logout.mutateAsync()}
              disabled={logout.isPending}
              className={cn("font-medium", logout.isPending && "opacity-50")}
            >
              <span className="grid size-6 place-content-center rounded-sm bg-rose-500">
                <MdLogout className="size-3.5! text-white" />
              </span>
              Log out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
