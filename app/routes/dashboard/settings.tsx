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
import { Separator } from "components/ui/separator";
import { SidebarTrigger } from "components/ui/sidebar";
import { sessionQuery } from "features/auth/queries/session-query";
import { authClient } from "lib/auth-client";
import { getErrorMessage } from "lib/get-error-message";
import { Building2, User } from "lucide-react";
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
  loader: ({ context }) => {
    return context.queryClient.prefetchQuery(sessionQuery());
  }
});

function SettingsPage() {
  const { user } = Route.useRouteContext();

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
            <p className="text-sm text-gray-500">
              Manage your account and organization
            </p>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <SettingsContent user={user} organization={user.activeOrganization} />
        </div>
      </main>
    </div>
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

          // Email update might require separate API call - Better Auth might not support email updates via updateUser
          if (value.email !== user.email) {
            // You may need to use a separate email update endpoint if Better Auth supports it
            // For now, keeping it simple with just name update
            toast.info("Email updates may require separate verification");
          }

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
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-500" />
            <CardTitle>Account Settings</CardTitle>
          </div>
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
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-gray-500" />
            <CardTitle>Organization Settings</CardTitle>
          </div>
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
                  <Input
                    value={field.state.value}
                    disabled
                    className="bg-gray-50"
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
            <Separator />
            <Button type="submit" disabled={orgPending}>
              Update Organization
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
