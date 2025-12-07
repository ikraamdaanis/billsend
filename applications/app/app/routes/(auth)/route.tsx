import {
  createFileRoute,
  Link,
  Outlet,
  redirect
} from "@tanstack/react-router";
import { sessionQuery } from "features/auth/queries/session-query";

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
  beforeLoad: async ({ context, location }) => {
    const REDIRECT_URL = "/dashboard";

    const user = await context.queryClient.ensureQueryData({
      ...sessionQuery()
    });

    const isCreateOrganisation = location.pathname === "/create-organisation";

    if (user && !isCreateOrganisation) throw redirect({ to: "/" });

    return { user, redirectUrl: REDIRECT_URL };
  }
});

function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/">
        <h1 className="text-brand-500 text-3xl font-bold">billsend</h1>
      </Link>
      <Outlet />
    </div>
  );
}
