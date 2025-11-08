import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardHeader } from "components/dashboard-header";
import { Button } from "components/ui/button";
import { Skeleton } from "components/ui/skeleton";
import { TemplateList } from "features/invoices/components/template-list";
import { templatesQuery } from "features/invoices/queries/templates-query";
import { Plus } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/(root)/templates/")({
  component: TemplatesPage,
  loader: ({ context }) => {
    return context.queryClient.prefetchQuery(templatesQuery());
  },
  head: () => ({
    meta: [
      {
        title: "Templates - billsend"
      }
    ]
  })
});

function TemplatesPage() {
  return (
    <Suspense fallback={<TemplatesSkeleton />}>
      <TemplatesContent />
    </Suspense>
  );
}

function TemplatesContent() {
  const { data: customTemplates } = useSuspenseQuery(templatesQuery());

  return (
    <div className="flex flex-col">
      <DashboardHeader>
        <div>
          <h2 className="text-base font-medium text-gray-900">Templates</h2>
        </div>
        <Link to="/dashboard/templates/create" className="ml-auto">
          <Button size="sm">
            <Plus className="size-3 shrink-0" />
            Create Template
          </Button>
        </Link>
      </DashboardHeader>
      <div className="p-6">
        <TemplateList customTemplates={customTemplates} />
      </div>
    </div>
  );
}

function TemplatesSkeleton() {
  return (
    <div className="flex flex-col">
      <DashboardHeader>
        <Skeleton className="h-8 w-48" />
      </DashboardHeader>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    </div>
  );
}
