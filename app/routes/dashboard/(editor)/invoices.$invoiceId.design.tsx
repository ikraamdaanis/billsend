import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import { Skeleton } from "components/ui/skeleton";
import { sessionQuery } from "features/auth/queries/session-query";
import { DesignControls } from "features/invoices/components/design-controls";
import { EditorLayout } from "features/invoices/components/editor-layout";
import { InvoicePreviewContainer } from "features/invoices/components/invoice-preview-container";
import { PrintButton } from "features/invoices/components/print-button";
import { TemplatePicker } from "features/invoices/components/template-picker";
import { invoiceQuery } from "features/invoices/queries/invoice-query";
import { INVOICE_TEMPLATES } from "features/invoices/templates/presets";
import type { InvoiceDesignOverrides } from "features/invoices/templates/types";
import {
  loadDesign,
  saveDesign
} from "features/invoices/utils/designer-storage";
import { useDocumentTitle } from "hooks/use-document-title";
import { ArrowLeft } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";

export const Route = createFileRoute(
  "/dashboard/(editor)/invoices/$invoiceId/design"
)({
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
  const previewRef = useRef<HTMLDivElement | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedTemplateId, setSelectedTemplateId] =
    useState<string>("classic");
  const [designOverrides, setDesignOverrides] = useState<
    InvoiceDesignOverrides | undefined
  >(undefined);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const handleTemplateChange = (templateId: string) => {
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

  const handleBack = () => {
    navigate({
      to: "/dashboard/invoices/$invoiceId",
      params: { invoiceId }
    });
  };

  const template =
    INVOICE_TEMPLATES[selectedTemplateId as keyof typeof INVOICE_TEMPLATES];

  const organization = session?.activeOrganization
    ? {
        name: session.activeOrganization.name,
        logo: null
      }
    : { name: "Your Company", logo: null };

  const settingsContent = (
    <div className="flex flex-col gap-8 p-4 pb-0">
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
          previewRef={previewRef}
        />
      </div>
    </div>
  );

  return (
    <EditorLayout
      title={`Design Invoice #${invoice.invoiceNumber}`}
      onBack={handleBack}
      settingsContent={settingsContent}
      settingsOpen={settingsOpen}
      onSettingsOpenChange={setSettingsOpen}
      actions={<PrintButton contentRef={previewRef} />}
    >
      <InvoicePreviewContainer
        previewRef={previewRef}
        invoice={invoice}
        organization={organization}
        template={template}
        overrides={designOverrides}
      />
    </EditorLayout>
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
