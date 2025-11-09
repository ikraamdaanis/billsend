import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
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
import { authClient } from "lib/auth-client";
import { getErrorMessage } from "lib/get-error-message";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

export const Route = createFileRoute("/(auth)/login")({
  component: LoginPage
});

function LoginPage() {
  const { redirectUrl } = Route.useRouteContext();

  const [pending, setPending] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    validators: {
      onSubmit: loginSchema
    },
    onSubmit: async ({ value }) => {
      setPending(true);

      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL: redirectUrl
        },
        {
          onError: error => {
            setPending(false);

            toast.error(
              getErrorMessage(error, "An error occurred while signing in")
            );
          }
        }
      );
    }
  });

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your account to continue
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
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
              <Label htmlFor="email">Email</Label>
              <form.Field name="email">
                {field => (
                  <>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <form.Field name="password">
                {field => (
                  <>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
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
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don&#39;t have an account?{" "}
              <Link
                to="/signup"
                className="text-brand-500 hover:text-brand-600 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
