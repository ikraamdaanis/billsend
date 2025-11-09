import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export const Route = createFileRoute("/(auth)/signup")({
  component: SignupPage
});

function SignupPage() {
  const [pending, setPending] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validators: {
      onSubmit: signupSchema
    },
    onSubmit: async ({ value }) => {
      setPending(true);

      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
          callbackURL: "/create-organisation"
        },
        {
          onError: error => {
            setPending(false);

            toast.error(
              getErrorMessage(error, "An error occurred while signing up")
            );
          },
          onSuccess: () => {
            queryClient.removeQueries({ queryKey: sessionQuery().queryKey });

            navigate({ to: "/create-organisation" });
          }
        }
      );
    }
  });

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Create your account to get started
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Enter your information to create your account
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
              <Label htmlFor="name">Full Name</Label>
              <form.Field name="name">
                {field => (
                  <>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
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
                      placeholder="Create a password"
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <form.Field name="confirmPassword">
                {field => (
                  <>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
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
              {pending ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="pt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-500 hover:text-brand-600 font-medium"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
