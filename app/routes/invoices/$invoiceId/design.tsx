import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "components/ui/sheet";
import { Skeleton } from "components/ui/skeleton";
import { sessionQuery } from "features/auth/queries/session-query";
import { DesignControls } from "features/invoices/components/design-controls";
import { InvoicePreview } from "features/invoices/components/invoice-preview";
import { PrintButton } from "features/invoices/components/print-button";
import { TemplatePicker } from "features/invoices/components/template-picker";
import { invoiceQuery } from "features/invoices/queries/invoice-query";
import { INVOICE_TEMPLATES } from "features/invoices/templates/presets";
import type {
  InvoiceDesignOverrides,
  InvoiceTemplateId
} from "features/invoices/templates/types";
import {
  loadDesign,
  saveDesign
} from "features/invoices/utils/designer-storage";
import { useDocumentTitle } from "hooks/use-document-title";
import { ArrowLeft, Settings } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/invoices/$invoiceId/design")({
  component: InvoiceDesignPage,
  beforeLoad: async ({ context }) => {
    const cachedUser = context.queryClient.getQueryData(
      sessionQuery().queryKey
    );

    if (cachedUser) {
      if (!cachedUser.activeOrganization) {
        throw redirect({ to: "/create-organisation" });
      }
      return { user: cachedUser };
    }

    const user = await context.queryClient.ensureQueryData({
      ...sessionQuery()
    });

    if (!user) throw redirect({ to: "/login" });

    if (!user.activeOrganization) {
      throw redirect({ to: "/create-organisation" });
    }

    return { user };
  },
  loader: ({ context, params }) => {
    context.queryClient.prefetchQuery(invoiceQuery(params.invoiceId));
    context.queryClient.prefetchQuery(sessionQuery());
  },
  head: () => ({
    meta: [
      {
        title: "Design Invoice - billsend"
      }
    ]
  })
});

function InvoiceDesignPage() {
  const { invoiceId } = Route.useParams();

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <InvoiceDesignContent invoiceId={invoiceId} />
    </Suspense>
  );
}

function InvoiceDesignContent({ invoiceId }: { invoiceId: string }) {
  const { data: invoice } = useSuspenseQuery(invoiceQuery(invoiceId));
  const { data: session } = useSuspenseQuery(sessionQuery());

  useDocumentTitle(`Design Invoice #${invoice.invoiceNumber} | billsend`);

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate({
      to: "/dashboard/invoices/$invoiceId",
      params: { invoiceId }
    });
  };

  const previewRef = useRef<HTMLDivElement | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<InvoiceTemplateId>("classic");
  const [designOverrides, setDesignOverrides] = useState<
    InvoiceDesignOverrides | undefined
  >(undefined);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = loadDesign(invoiceId);
    if (saved) {
      setSelectedTemplateId(saved.templateId);
      setDesignOverrides(saved);
    }
  }, [invoiceId]);

  const debouncedSave = (overrides: InvoiceDesignOverrides) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveDesign(invoiceId, overrides);
    }, 300);
  };

  const handleTemplateChange = (templateId: InvoiceTemplateId) => {
    setSelectedTemplateId(templateId);
    const newOverrides: InvoiceDesignOverrides = {
      templateId
    };
    setDesignOverrides(newOverrides);
    debouncedSave(newOverrides);
  };

  const handleDesignChange = (overrides: InvoiceDesignOverrides) => {
    const newOverrides: InvoiceDesignOverrides = {
      ...overrides,
      templateId: selectedTemplateId
    };
    setDesignOverrides(newOverrides);
    debouncedSave(newOverrides);
  };

  const template = INVOICE_TEMPLATES[selectedTemplateId];
  const organization = session?.activeOrganization
    ? {
        name: session.activeOrganization.name,
        logo: null
      }
    : { name: "Your Company", logo: null };

  const [settingsOpen, setSettingsOpen] = useState(false);

  const settingsContent = (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-900">Templates</h3>
        <TemplatePicker
          selectedTemplateId={selectedTemplateId}
          onSelect={handleTemplateChange}
        />
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-900">Customise</h3>
        <DesignControls
          defaultTokens={template.defaultTokens}
          defaultVisibility={template.defaultVisibility}
          templateId={selectedTemplateId}
          overrides={designOverrides}
          onChange={handleDesignChange}
        />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={handleGoBack}>
            <ArrowLeft className="size-4 shrink-0" />
          </Button>
          <h2 className="text-sm font-medium text-gray-900 sm:text-base">
            Design Invoice #{invoice.invoiceNumber}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="lg:hidden">
                <Settings className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Design Settings</SheetTitle>
              </SheetHeader>
              {settingsContent}
            </SheetContent>
          </Sheet>
          <PrintButton contentRef={previewRef} />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-r border-gray-200 bg-white lg:block">
          {settingsContent}
        </aside>
        <main className="flex flex-1 flex-col overflow-hidden bg-gray-50">
          <div className="flex flex-1 flex-col overflow-y-auto px-4 pt-4 sm:px-8 sm:pt-8">
            <div className="mx-auto w-full max-w-3xl">
              <div
                ref={previewRef}
                className="invoice-preview-container aspect-210/297 min-h-0 w-full bg-white shadow-sm"
                data-page-size={template.defaultTokens.pageSize}
              >
                <div className="p-4 pb-12 sm:p-8">
                  <InvoicePreview
                    invoice={invoice}
                    organization={organization}
                    template={template}
                    overrides={designOverrides}
                  />
                </div>
              </div>
            </div>
            <div className="no-print h-8 shrink-0" />
          </div>
        </main>
      </div>
    </div>
  );
}

function SkeletonComponent() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate({ to: "/dashboard/invoices" })}
          >
            <ArrowLeft className="size-4 shrink-0" />
          </Button>
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <Skeleton className="h-full w-80" />
        <Skeleton className="flex-1" />
      </div>
    </div>
  );
}
