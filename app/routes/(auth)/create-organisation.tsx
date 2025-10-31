import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
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
import { sessionQuery } from "features/auth/queries/session-query";
import { authClient } from "lib/auth-client";
import { getErrorMessage } from "lib/get-error-message";
import { useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";

const createOrganisationSchema = z.object({
  name: z.string().min(1, "Name is required")
});

export const Route = createFileRoute("/(auth)/create-organisation")({
  component: CreateOrganisationPage,
  beforeLoad: ({ context }) => {
    const user = context.user;

    if (!user) throw redirect({ to: "/login" });

    const organizationCount = user.organizations.length;

    if (organizationCount > 0) throw redirect({ to: "/dashboard" });
  }
});

function CreateOrganisationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [pending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: { name: "" },
    validators: {
      onSubmit: createOrganisationSchema
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        try {
          const { error } = await authClient.organization.create({
            name: value.name,
            slug: value.name.toLowerCase().replace(/ /g, "-")
          });

          if (error) throw new Error(error.message);

          // Invalidate and remove the cached session data to force a fresh fetch
          queryClient.removeQueries({
            queryKey: sessionQuery().queryKey
          });

          await router.navigate({ to: "/dashboard" });
        } catch (error) {
          toast.error(
            getErrorMessage(
              error,
              "An error occurred while creating organisation"
            )
          );
        }
      });
    }
  });

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Create your organisation
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Create your organisation to get started
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create your organisation</CardTitle>
          <CardDescription>
            Enter your organisation name to create your organisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <form.Field name="name">
                {field => (
                  <>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your organisation name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      autoComplete="off"
                      data-1p-ignore
                      data-lpignore="true"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-600">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </>
                )}
              </form.Field>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={pending || !form.state.canSubmit}
            >
              {pending ? "Creating organisation..." : "Create organisation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
