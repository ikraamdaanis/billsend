import { IconFileUnknown } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

export function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-neutral-50 px-6 text-neutral-900 antialiased">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-[3px] border border-neutral-200 bg-white p-10 text-center shadow-xl shadow-neutral-900/5">
        <div className="border-brand-200 bg-brand-50 text-brand-600 flex size-12 items-center justify-center rounded-[3px] border">
          <IconFileUnknown className="size-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-neutral-900">
            Page not found
          </h1>
          <p className="text-sm text-pretty text-neutral-600">
            We couldn&apos;t find the page you were looking for. It may have
            moved, or the link might be wrong.
          </p>
        </div>
        <Link to="/">
          <Button className="h-9 px-4 text-sm">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
