import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DashboardHeader } from "components/dashboard-header";
import { DataTable } from "components/table";
import { Button } from "components/ui/button";
import { Skeleton } from "components/ui/skeleton";
import type { ClientsQueryResult } from "features/clients/queries/clients-query";
import { clientsQuery } from "features/clients/queries/clients-query";
import { ArrowUpDown, Plus } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/clients/")({
  component: ClientsList,
  loader: ({ context }) => {
    return context.queryClient.prefetchQuery(clientsQuery());
  }
});

function ClientsTableSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-64" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientsList() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <DashboardHeader>
        <div>
          <h2 className="text-base font-medium text-gray-900">Clients</h2>
        </div>
        <Link to="/dashboard/clients/create" className="ml-auto">
          <Button size="sm">
            <Plus className="size-3 shrink-0" />
            Add Client
          </Button>
        </Link>
      </DashboardHeader>
      <main className="flex-1 p-4">
        <Suspense fallback={<ClientsTableSkeleton />}>
          <ClientsTableContent />
        </Suspense>
      </main>
    </div>
  );
}

function ClientsTableContent() {
  const { data: clients } = useSuspenseQuery(clientsQuery());

  const columns: ColumnDef<ClientsQueryResult[number]>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const client = row.original;
        const name = row.getValue<string>("name");
        const initials = name
          .split(" ")
          .map(n => n[0])
          .join("")
          .toUpperCase();
        return (
          <Link
            to="/dashboard/clients/$clientId"
            params={{ clientId: client.id }}
            preload="render"
          >
            <div className="flex items-center hover:text-blue-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                <span className="text-sm font-medium text-gray-600">
                  {initials}
                </span>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{name}</div>
              </div>
            </div>
          </Link>
        );
      }
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const email = row.getValue<string>("email");
        return <div className="text-sm text-gray-900">{email || "-"}</div>;
      }
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const phone = row.getValue<string>("phone");
        return <div className="text-sm text-gray-900">{phone || "-"}</div>;
      }
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const address = row.getValue<{
          line1?: string;
          line2?: string;
          city?: string;
          country?: string;
          postalCode?: string;
        } | null>("address");
        if (!address) {
          return <div className="text-sm text-gray-900">-</div>;
        }
        return (
          <div className="text-sm text-gray-900">
            {address.line1 && <div>{address.line1}</div>}
            {address.line2 && <div>{address.line2}</div>}
            <div>
              {[address.city, address.postalCode, address.country]
                .filter(Boolean)
                .join(", ")}
            </div>
          </div>
        );
      }
    }
  ];

  return (
    <>
      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-12">
          <p className="text-sm text-gray-600">No clients found</p>
          <Link to="/dashboard/clients/create" className="mt-4">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create your first client
            </Button>
          </Link>
        </div>
      ) : (
        <DataTable data={clients} columns={columns} />
      )}
    </>
  );
}
