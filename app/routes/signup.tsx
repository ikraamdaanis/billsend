import { useForm } from "@tanstack/react-form";
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
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export const Route = createFileRoute("/signup")({
  component: SignupPage
});

function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      console.log(value);

      try {
        toast.success("Account created successfully!");
        router.navigate({ to: "/dashboard" });
      } catch (_error) {
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/">
            <h1 className="text-brand-500 text-3xl font-bold">billsend</h1>
          </Link>
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
                disabled={isLoading || !form.state.canSubmit}
              >
                {isLoading ? "Creating account..." : "Create account"}
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
    </div>
  );
}
