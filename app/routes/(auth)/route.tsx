import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout
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
