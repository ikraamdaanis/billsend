import { IconAlertTriangle, IconRotate } from "@tabler/icons-react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

export function RootErrorBoundary({ error, reset }: ErrorComponentProps) {
  const message =
    error instanceof Error && error.message
      ? error.message
      : "An unexpected error occurred.";

  function handleReload() {
    window.location.reload();
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-neutral-50 px-6 text-neutral-900 antialiased">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-[3px] border border-neutral-200 bg-white p-10 text-center shadow-xl shadow-neutral-900/5">
        <div className="border-brand-200 bg-brand-50 text-brand-600 flex size-12 items-center justify-center rounded-[3px] border">
          <IconAlertTriangle className="size-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-neutral-900">
            Something went wrong
          </h1>
          <p className="text-sm text-pretty text-neutral-600">
            The page ran into an unexpected problem. Your saved invoices and
            templates are stored on your device and are safe.
          </p>
        </div>
        <pre className="max-h-32 w-full overflow-auto rounded-[3px] border border-neutral-200 bg-neutral-50 p-3 text-left font-mono text-xs text-neutral-500">
          {message}
        </pre>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="h-9 px-4 text-sm">
            <IconRotate className="size-4" />
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={handleReload}
            className="h-9 px-4 text-sm"
          >
            Reload page
          </Button>
        </div>
      </div>
    </div>
  );
}
