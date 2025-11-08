import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardHeader } from "components/dashboard-header";
import { Button } from "components/ui/button";
import { Skeleton } from "components/ui/skeleton";
import { InvoicePreview } from "features/invoices/components/invoice-preview";
import { templateByIdQuery } from "features/invoices/queries/templates-query";
import type { InvoiceTemplate } from "features/invoices/templates/types";
import { createMockInvoice } from "features/invoices/utils/mock-invoice";
import { useGoBack } from "hooks/use-go-back";
import { ArrowLeft, Pencil } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/templates/custom/$templateId")({
  component: CustomTemplatePage,
  loader: ({ context, params }) => {
    return context.queryClient.prefetchQuery(templateByIdQuery(params.templateId));
  },
  head: () => ({
    meta: [
      {
        title: "Template Preview - billsend"
      }
    ]
  })
});

function CustomTemplatePage() {
  const { templateId } = Route.useParams();

  return (
    <Suspense fallback={<TemplateSkeleton />}>
      <CustomTemplateContent templateId={templateId} />
    </Suspense>
  );
}

function CustomTemplateContent({ templateId }: { templateId: string }) {
  const { goBack } = useGoBack({ to: "/dashboard/templates" });
  const { data: dbTemplate } = useSuspenseQuery(templateByIdQuery(templateId));

  const template: InvoiceTemplate = {
    id: dbTemplate.id,
    name: dbTemplate.name,
    description: dbTemplate.description || "",
    defaultTokens: dbTemplate.tokens,
    defaultVisibility: dbTemplate.visibility
  };

  const mockInvoice = createMockInvoice();
  const mockOrganization = {
    name: "Your Company",
    logo: null
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <DashboardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={goBack}>
            <ArrowLeft className="size-4 shrink-0" />
          </Button>
          <h2 className="text-base font-medium text-gray-900">
            {template.name} Template Preview
          </h2>
        </div>
        <Link
          to="/templates/custom/$templateId/edit"
          params={{ templateId }}
          className="ml-auto"
        >
          <Button size="sm">
            <Pencil className="size-3 shrink-0" />
            Edit
          </Button>
        </Link>
      </DashboardHeader>
      <main className="flex flex-1 flex-col overflow-hidden bg-gray-50">
        <div className="flex flex-1 flex-col overflow-y-auto px-4 pt-4 sm:px-8 sm:pt-8">
          <div className="mx-auto w-full max-w-3xl">
            <div className="invoice-preview-container w-full bg-white shadow-sm">
              <div className="p-4 pb-12 sm:p-8">
                <InvoicePreview
                  invoice={mockInvoice}
                  organization={mockOrganization}
                  template={template}
                />
              </div>
            </div>
          </div>
          <div className="no-print h-8 shrink-0" />
        </div>
      </main>
    </div>
  );
}

function TemplateSkeleton() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <DashboardHeader>
        <Skeleton className="h-5 w-48" />
      </DashboardHeader>
      <main className="flex-1 p-4">
        <Skeleton className="mx-auto h-[800px] w-full max-w-3xl" />
      </main>
    </div>
  );
}
