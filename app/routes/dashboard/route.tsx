import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "components/app-sidebar";
import { SidebarProvider } from "components/ui/sidebar";
import { sessionQuery } from "features/auth/queries/session-query";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData({
      ...sessionQuery(),
      revalidateIfStale: true
    });

    if (!user) throw redirect({ to: "/login" });

    const orgLength = user.organizations.length;

    if (orgLength === 0) throw redirect({ to: "/create-organisation" });

    return { user };
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
