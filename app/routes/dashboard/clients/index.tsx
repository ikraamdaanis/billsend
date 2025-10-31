import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "components/table";
import { Button } from "components/ui/button";
import type { ClientsQueryResult } from "features/clients/queries/clients-query";
import { clientsQuery } from "features/clients/queries/clients-query";
import { ArrowUpDown, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/clients/")({
  component: ClientsList,
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(clientsQuery());
  }
});

function ClientsList() {
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
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Clients</h2>
            <p className="text-sm text-gray-500">
              Manage your organisation&#39;s clients
            </p>
          </div>
          <Link to="/dashboard/clients/create">
            <Button>
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6">
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
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <DataTable data={clients} columns={columns} />
          </div>
        )}
      </main>
    </div>
  );
}
