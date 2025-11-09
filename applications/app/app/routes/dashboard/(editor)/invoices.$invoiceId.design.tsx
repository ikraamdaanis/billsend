import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import { Skeleton } from "components/ui/skeleton";
import { sessionQuery } from "features/auth/queries/session-query";
import { updateInvoiceDesign } from "features/invoices/api/update-invoice-design";
import { DesignControls } from "features/invoices/components/design-controls";
import { EditorLayout } from "features/invoices/components/editor-layout";
import { InvoicePreviewContainer } from "features/invoices/components/invoice-preview-container";
import { PrintButton } from "features/invoices/components/print-button";
import { TemplateSelector } from "features/invoices/components/template-selector";
import { useDesignState } from "features/invoices/hooks/use-design-state";
import { invoiceQuery } from "features/invoices/queries/invoice-query";
import { templatesQuery } from "features/invoices/queries/templates-query";
import { INVOICE_TEMPLATES } from "features/invoices/templates/presets";
import type { InvoiceTemplate } from "features/invoices/templates/types";
import { useDocumentTitle } from "hooks/use-document-title";
import { getErrorMessage } from "lib/get-error-message";
import { ArrowLeft } from "lucide-react";
import { Suspense, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

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
    context.queryClient.prefetchQuery(templatesQuery());
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
  const { data: allTemplates } = useSuspenseQuery(templatesQuery());

  useDocumentTitle(`Design Invoice #${invoice.invoiceNumber} | billsend`);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [isPending, startTransition] = useTransition();

  // Show all custom templates for now (client-specific filtering can be added later)
  const customTemplates = allTemplates;

  // Determine initial template from invoice snapshot or default
  const initialTemplateId = invoice.designSnapshotTemplateId || "classic";
  const [selectedTemplateId, setSelectedTemplateId] =
    useState(initialTemplateId);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Get template (either from defaults or custom templates)
  const getTemplate = (templateId: string): InvoiceTemplate => {
    // Check if it's a default template
    if (templateId in INVOICE_TEMPLATES) {
      return INVOICE_TEMPLATES[templateId as keyof typeof INVOICE_TEMPLATES];
    }

    // Check custom templates
    const customTemplate = customTemplates.find(t => t.id === templateId);
    if (customTemplate) {
      return {
        id: customTemplate.id,
        name: customTemplate.name,
        description: customTemplate.description || "",
        defaultTokens: customTemplate.tokens,
        defaultVisibility: customTemplate.visibility
      };
    }

    // Fallback to classic template
    return INVOICE_TEMPLATES.classic;
  };

  const selectedTemplate = getTemplate(selectedTemplateId);

  // Get initial tokens/visibility from invoice snapshot or template defaults
  const getInitialTokens = () => {
    if (invoice.designSnapshotTokens) {
      return invoice.designSnapshotTokens;
    }
    return selectedTemplate.defaultTokens;
  };

  const getInitialVisibility = () => {
    if (invoice.designSnapshotVisibility) {
      return invoice.designSnapshotVisibility;
    }
    return selectedTemplate.defaultVisibility;
  };

  const {
    designTokens,
    designVisibility,
    setDesignTokens,
    setDesignVisibility,
    handleDesignChange
  } = useDesignState(getInitialTokens(), getInitialVisibility(), previewRef);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = getTemplate(templateId);
    setDesignTokens(template.defaultTokens);
    setDesignVisibility(template.defaultVisibility);
    setHasUnsavedChanges(true);
  };

  const handleDesignChangeWithUnsaved = (
    overrides: Parameters<typeof handleDesignChange>[0]
  ) => {
    handleDesignChange(overrides);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        // Only save custom template IDs (UUIDs), not default template IDs
        const isDefaultTemplate = selectedTemplateId in INVOICE_TEMPLATES;
        const templateIdToSave = isDefaultTemplate ? null : selectedTemplateId;

        await updateInvoiceDesign({
          data: {
            invoiceId,
            designSnapshotTemplateId: templateIdToSave,
            designSnapshotTokens: designTokens,
            designSnapshotVisibility: designVisibility,
            designSnapshotLogoPosition: designTokens.logoPosition
          }
        });

        // Invalidate invoice query to refetch updated data
        queryClient.invalidateQueries({
          queryKey: invoiceQuery(invoiceId).queryKey
        });

        setHasUnsavedChanges(false);
        toast.success("Invoice design saved successfully");
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to save invoice design"));
      }
    });
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    navigate({
      to: "/dashboard/invoices/$invoiceId",
      params: { invoiceId }
    });
  };

  const templateForPreview: InvoiceTemplate = {
    ...selectedTemplate,
    defaultTokens: designTokens,
    defaultVisibility: designVisibility
  };

  const organization = session?.activeOrganization
    ? {
        name: session.activeOrganization.name,
        logo: null
      }
    : { name: "Your Company", logo: null };

  const settingsContent = (
    <div className="flex flex-col gap-4 p-4 pb-0">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-gray-900">Templates</h3>
        <TemplateSelector
          selectedTemplateId={selectedTemplateId}
          customTemplates={customTemplates}
          onSelect={handleTemplateChange}
        />
      </div>
      <div className="flex flex-col gap-4">
        <DesignControls
          defaultTokens={selectedTemplate.defaultTokens}
          defaultVisibility={selectedTemplate.defaultVisibility}
          templateId={selectedTemplateId}
          overrides={{
            templateId: selectedTemplateId,
            tokens: designTokens,
            visibility: designVisibility
          }}
          onChange={handleDesignChangeWithUnsaved}
          previewRef={previewRef}
        />
      </div>
      <div className="border-border sticky bottom-0 z-10 flex gap-4 border-t bg-white py-4">
        <Button
          onClick={handleSave}
          disabled={!hasUnsavedChanges || isPending}
          className="w-full"
        >
          {isPending ? "Saving..." : "Save Design"}
        </Button>
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
      actions={<PrintButton invoiceId={invoiceId} invoice={invoice} />}
    >
      <InvoicePreviewContainer
        previewRef={previewRef}
        invoice={invoice}
        organization={organization}
        template={templateForPreview}
        overrides={{
          templateId: selectedTemplateId,
          tokens: designTokens,
          visibility: designVisibility
        }}
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
