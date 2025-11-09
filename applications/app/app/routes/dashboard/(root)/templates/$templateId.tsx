import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardHeader } from "components/dashboard-header";
import { Button } from "components/ui/button";
import { Skeleton } from "components/ui/skeleton";
import { InvoicePreview } from "features/invoices/components/invoice-preview";
import { templateByIdQuery } from "features/invoices/queries/templates-query";
import { INVOICE_TEMPLATES } from "features/invoices/templates/presets";
import type { InvoiceTemplate } from "features/invoices/templates/types";
import { createMockInvoice } from "features/invoices/utils/mock-invoice";
import { useGoBack } from "hooks/use-go-back";
import { ArrowLeft, Pencil } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/(root)/templates/$templateId")(
  {
    component: TemplatePage,
    loader: ({ context, params }) => {
      const isDefaultTemplate = Object.keys(INVOICE_TEMPLATES).includes(
        params.templateId
      );
      if (!isDefaultTemplate) {
        return context.queryClient.prefetchQuery(
          templateByIdQuery(params.templateId)
        );
      }
      return;
    },
    head: () => ({
      meta: [
        {
          title: "Template Preview - billsend"
        }
      ]
    })
  }
);

function TemplatePage() {
  const { templateId } = Route.useParams();

  return (
    <Suspense fallback={<TemplateSkeleton />}>
      <TemplateContent templateId={templateId} />
    </Suspense>
  );
}

function TemplateContent({ templateId }: { templateId: string }) {
  const { goBack } = useGoBack({ to: "/dashboard/templates" });

  const isDefaultTemplate = Object.keys(INVOICE_TEMPLATES).includes(templateId);

  return isDefaultTemplate ? (
    <DefaultTemplateView templateId={templateId} onGoBack={goBack} />
  ) : (
    <CustomTemplateView templateId={templateId} onGoBack={goBack} />
  );
}

function DefaultTemplateView({
  templateId,
  onGoBack
}: {
  templateId: string;
  onGoBack: () => void;
}) {
  const template =
    INVOICE_TEMPLATES[templateId as keyof typeof INVOICE_TEMPLATES];
  const mockInvoice = createMockInvoice();
  const mockOrganization = {
    name: "Your Company",
    logo: null
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <DashboardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={onGoBack}>
            <ArrowLeft className="size-4 shrink-0" />
          </Button>
          <h2 className="text-base font-medium text-gray-900">
            {template.name} Template Preview
          </h2>
        </div>
        <div className="ml-auto text-sm text-gray-500">Default Template</div>
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

function CustomTemplateView({
  templateId,
  onGoBack
}: {
  templateId: string;
  onGoBack: () => void;
}) {
  const { data: dbTemplate } = useSuspenseQuery(
    templateByIdQuery(templateId, false)
  );

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
          <Button variant="ghost" size="icon-sm" onClick={onGoBack}>
            <ArrowLeft className="size-4 shrink-0" />
          </Button>
          <h2 className="text-base font-medium text-gray-900">
            {template.name} Template Preview
          </h2>
        </div>
        <Link
          to="/dashboard/templates/$templateId/edit"
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
