import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "components/app-sidebar";
import { SidebarInset, SidebarProvider } from "components/ui/sidebar";
import { sessionQuery } from "features/auth/queries/session-query";

export const Route = createFileRoute("/dashboard/(root)")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    // Check cache first - if session is already cached, use it immediately
    // This makes subsequent navigations instant (non-blocking)
    const cachedUser = context.queryClient.getQueryData(
      sessionQuery().queryKey
    );

    if (cachedUser) {
      // Fast path: use cached session (instant)
      if (!cachedUser.activeOrganization) {
        throw redirect({ to: "/create-organisation" });
      }

      return { user: cachedUser };
    }

    // Slow path: fetch session (only happens on first load/refresh)
    // We must await here for security - can't allow unauthorized access
    const user = await context.queryClient.ensureQueryData({
      ...sessionQuery()
    });

    if (!user) throw redirect({ to: "/login" });

    if (!user.activeOrganization) {
      throw redirect({ to: "/create-organisation" });
    }

    return { user };
  }
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
