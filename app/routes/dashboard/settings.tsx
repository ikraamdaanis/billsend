import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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
import { SidebarTrigger } from "components/ui/sidebar";
import { sessionQuery } from "features/auth/queries/session-query";
import { authClient } from "lib/auth-client";
import { getErrorMessage } from "lib/get-error-message";
import { useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address")
});

const updateOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  slug: z.string().min(1, "Organization slug is required")
});

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
  loader: ({ context }) => context.queryClient.prefetchQuery(sessionQuery())
});

function SettingsPage() {
  const { user } = Route.useRouteContext();

  return (
    <main className="flex flex-1 flex-col bg-white">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-2 p-4 lg:gap-4 lg:pt-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="size-8 lg:hidden" />
          <h2 className="text-lg font-medium lg:text-2xl">Settings</h2>
        </div>
        <SettingsContent user={user} organization={user.activeOrganization} />
      </div>
    </main>
  );
}

function SettingsContent({
  user,
  organization
}: {
  user: { name: string; email: string };
  organization?: { name: string; slug: string; id: string } | null;
}) {
  const queryClient = useQueryClient();

  const [userPending, startUserTransition] = useTransition();
  const [orgPending, startOrgTransition] = useTransition();

  const userForm = useForm({
    defaultValues: {
      name: user.name || "",
      email: user.email || ""
    },
    validators: {
      onSubmit: updateUserSchema
    },
    onSubmit: ({ value }) => {
      startUserTransition(async () => {
        try {
          const { error } = await authClient.updateUser({
            name: value.name
          });

          if (error) throw new Error(error.message);

          queryClient.invalidateQueries({
            queryKey: sessionQuery().queryKey
          });

          toast.success("Account updated successfully");
        } catch (error) {
          toast.error(
            getErrorMessage(
              error,
              "An error occurred while updating your account"
            )
          );
        }
      });
    }
  });

  const organizationForm = useForm({
    defaultValues: {
      name: organization?.name || "",
      slug: organization?.slug || ""
    },
    validators: {
      onSubmit: updateOrganizationSchema
    },
    onSubmit: ({ value }) => {
      startOrgTransition(async () => {
        try {
          if (!organization?.id) {
            throw new Error("No active organization found");
          }

          const { error } = await authClient.organization.update({
            organizationId: organization.id,
            data: {
              name: value.name
            }
          });

          if (error) throw new Error(error.message);

          queryClient.invalidateQueries({
            queryKey: sessionQuery().queryKey
          });

          toast.success("Organization updated successfully");
        } catch (error) {
          toast.error(
            getErrorMessage(
              error,
              "An error occurred while updating your organization"
            )
          );
        }
      });
    }
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Update your personal account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault();
              userForm.handleSubmit();
            }}
            className="space-y-4"
          >
            <userForm.Field name="name">
              {field => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Name</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {field.state.meta.errors[0]?.message ||
                        String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </userForm.Field>
            <userForm.Field name="email">
              {field => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    type="email"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {field.state.meta.errors[0]?.message ||
                        String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </userForm.Field>
            <Button type="submit" disabled={userPending}>
              Update Account
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>
            Update your organization information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault();
              organizationForm.handleSubmit();
            }}
            className="space-y-4"
          >
            <organizationForm.Field name="name">
              {field => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Organization Name</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={e => {
                      field.handleChange(e.target.value);

                      // Update the  slug field with the new value
                      const slug = e.target.value
                        .toLowerCase()
                        .replace(/ /g, "-");
                      organizationForm.setFieldValue("slug", slug);
                    }}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {field.state.meta.errors[0]?.message ||
                        String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </organizationForm.Field>
            <organizationForm.Field name="slug">
              {field => (
                <div className="space-y-2">
                  <Label>Organization Slug</Label>
                  <Input value={field.state.value} disabled />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {field.state.meta.errors[0]?.message ||
                        String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </organizationForm.Field>
            <Button type="submit" disabled={orgPending}>
              Update Organization
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
