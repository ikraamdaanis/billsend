import { useConvexMutation } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "components/ui/form";
import { Input } from "components/ui/input";
import { api } from "convex/_generated/api";
import { fetchAuth } from "features/auth/fetch-auth";
import { authClient } from "lib/auth-client";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/create-organization")({
  component: CreateOrganization,
  beforeLoad: async () => {
    const { userId } = await fetchAuth();

    if (!userId) throw redirect({ to: "/login" });
  }
});

const organizationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
});

function CreateOrganization() {
  const router = useRouter();
  const initializeSettings = useConvexMutation(
    api.organizations.initializeOrganizationSettings
  );

  const form = useForm({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: "" }
  });

  const createOrgMutation = useMutation({
    mutationFn: async (name: string) => {
      const auth = await fetchAuth();

      if (!auth.userId) throw new Error("User not authenticated");

      // Generate slug from name (required field)
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const result = await authClient.organization.create({
        userId: auth.userId,
        name,
        slug,
        keepCurrentActiveOrganization: true
      });

      console.log("RESULT", result);

      if (!result.data) {
        throw new Error(
          result.error.message || "Failed to create organization"
        );
      }

      // Initialize organization settings in Convex
      await initializeSettings({ organizationId: result.data.id });

      return result.data;
    },
    onSuccess: () => {
      router.navigate({ to: "/dashboard" });
    }
  });

  function onSubmit(data: { name: string }) {
    createOrgMutation.mutate(data.name);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Create Your Organization
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Get started by creating an organization for your business.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Inc."
                      {...field}
                      disabled={createOrgMutation.isPending}
                      data-1p-ignore
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the name of your organization.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {createOrgMutation.isError && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">
                  {createOrgMutation.error instanceof Error
                    ? createOrgMutation.error.message
                    : "Failed to create organization. Please try again."}
                </p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={createOrgMutation.isPending}
            >
              {createOrgMutation.isPending
                ? "Creating..."
                : "Create Organization"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
