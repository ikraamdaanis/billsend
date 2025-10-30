import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "components/app-sidebar";
import { SidebarProvider } from "components/ui/sidebar";
import { fetchAuth } from "features/auth/fetch-auth";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { userId } = await fetchAuth();

    if (!userId) throw redirect({ to: "/login" });
  }
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
