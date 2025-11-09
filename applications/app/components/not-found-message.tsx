import { Link } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import { AlertCircle } from "lucide-react";
import type { ValidRoute } from "types";

export function NotFoundMessage({
  title,
  description,
  to,
  backText = "Back",
  retryText = "Retry"
}: {
  title: string;
  description: string;
  to: ValidRoute;
  backText: string;
  retryText?: string;
}) {
  return (
    <Card className="mx-auto w-full max-w-md border-0">
      <CardContent className="flex flex-col items-center justify-center py-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-gray-900">{title}</h2>
        <p className="mt-2 text-center text-sm text-balance text-gray-500">
          {description}
        </p>
        <div className="mt-4 flex gap-3">
          <Link to={to}>
            <Button variant="outline">{backText}</Button>
          </Link>
          <Button onClick={() => window.location.reload()}>{retryText}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
