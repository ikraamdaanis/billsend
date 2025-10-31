import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import type { ClientsQueryResult } from "features/clients/queries/clients-query";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<ClientsQueryResult[number]>[] = [
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
      const name = row.getValue<string>("name");
      const initials = name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase();
      return (
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
            <span className="text-sm font-medium text-gray-600">
              {initials}
            </span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{name}</div>
          </div>
        </div>
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
