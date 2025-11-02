import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { createClient } from "features/clients/api/create-client";
import { clientsQuery } from "features/clients/queries/clients-query";
import { getErrorMessage } from "lib/get-error-message";
import { ArrowLeft } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";

const createClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z
    .object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional()
    })
    .optional()
});

export const Route = createFileRoute("/dashboard/clients/create")({
  component: CreateClientPage
});

function CreateClientPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [pending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        country: "",
        postalCode: ""
      }
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        try {
          const validated = createClientSchema.parse({
            name: value.name,
            email: value.email || undefined,
            phone: value.phone || undefined,
            address:
              value.address.line1 ||
              value.address.line2 ||
              value.address.city ||
              value.address.country ||
              value.address.postalCode
                ? {
                    line1: value.address.line1 || undefined,
                    line2: value.address.line2 || undefined,
                    city: value.address.city || undefined,
                    country: value.address.country || undefined,
                    postalCode: value.address.postalCode || undefined
                  }
                : undefined
          });

          await createClient({
            data: validated
          });

          queryClient.invalidateQueries({
            queryKey: clientsQuery().queryKey
          });

          toast.success("Client created successfully");

          await router.navigate({ to: "/dashboard/clients" });
        } catch (error) {
          toast.error(
            getErrorMessage(error, "An error occurred while creating client")
          );
        }
      });
    }
  });

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/clients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create Client
            </h2>
            <p className="text-sm text-gray-500">
              Add a new client to your organisation
            </p>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>
                Enter the client&apos;s details to create a new client record
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <form.Field name="name">
                    {field => (
                      <>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter client name"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          autoComplete="off"
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-600">
                            {String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </>
                    )}
                  </form.Field>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <form.Field name="email">
                    {field => (
                      <>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter client email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          autoComplete="off"
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-600">
                            {String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </>
                    )}
                  </form.Field>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <form.Field name="phone">
                    {field => (
                      <>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter client phone number"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          autoComplete="off"
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-600">
                            {String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </>
                    )}
                  </form.Field>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Address
                    </h3>
                    <p className="text-sm text-gray-500">
                      Optional address information
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="address.line1">Address Line 1</Label>
                    <form.Field name="address.line1">
                      {field => (
                        <Input
                          id="address.line1"
                          type="text"
                          placeholder="Street address"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          autoComplete="off"
                        />
                      )}
                    </form.Field>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="address.line2">Address Line 2</Label>
                    <form.Field name="address.line2">
                      {field => (
                        <Input
                          id="address.line2"
                          type="text"
                          placeholder="Apartment, suite, etc."
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          autoComplete="off"
                        />
                      )}
                    </form.Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="address.city">City</Label>
                      <form.Field name="address.city">
                        {field => (
                          <Input
                            id="address.city"
                            type="text"
                            placeholder="City"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={e => field.handleChange(e.target.value)}
                            autoComplete="off"
                          />
                        )}
                      </form.Field>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="address.postalCode">Postal Code</Label>
                      <form.Field name="address.postalCode">
                        {field => (
                          <Input
                            id="address.postalCode"
                            type="text"
                            placeholder="Postal code"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={e => field.handleChange(e.target.value)}
                            autoComplete="off"
                          />
                        )}
                      </form.Field>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="address.country">Country</Label>
                    <form.Field name="address.country">
                      {field => (
                        <Input
                          id="address.country"
                          type="text"
                          placeholder="Country"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          autoComplete="off"
                        />
                      )}
                    </form.Field>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link to="/dashboard/clients" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={pending || !form.state.canSubmit}
                  >
                    {pending ? "Creating..." : "Create Client"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
