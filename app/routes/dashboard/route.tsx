import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "components/app-sidebar";
import { SidebarProvider } from "components/ui/sidebar";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
