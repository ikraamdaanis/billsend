import { useForm } from "@tanstack/react-form";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useCanGoBack,
  useNavigate,
  useRouter
} from "@tanstack/react-router";
import { Button } from "components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "components/ui/sheet";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Skeleton } from "components/ui/skeleton";
import { DesignControls } from "features/invoices/components/design-controls";
import { InvoicePreview } from "features/invoices/components/invoice-preview";
import { TemplatePicker } from "features/invoices/components/template-picker";
import { createTemplate } from "features/invoices/api/templates";
import { templatesQuery } from "features/invoices/queries/templates-query";
import { INVOICE_TEMPLATES } from "features/invoices/templates/presets";
import type {
  InvoiceDesignOverrides,
  InvoiceTemplateId
} from "features/invoices/templates/types";
import { createMockInvoice } from "features/invoices/utils/mock-invoice";
import { sessionQuery } from "features/auth/queries/session-query";
import { getErrorMessage } from "lib/get-error-message";
import { ArrowLeft, Settings } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/templates/create")({
  component: CreateTemplatePage,
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
  loader: ({ context }) => {
    return Promise.all([
      context.queryClient.prefetchQuery(sessionQuery()),
      context.queryClient.prefetchQuery(templatesQuery())
    ]);
  },
  head: () => ({
    meta: [
      {
        title: "Create Template - billsend"
      }
    ]
  })
});

function CreateTemplatePage() {
  return (
    <Suspense fallback={<CreateTemplateSkeleton />}>
      <CreateTemplateContent />
    </Suspense>
  );
}

function CreateTemplateContent() {
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const queryClient = useQueryClient();

  const { data: session } = useSuspenseQuery(sessionQuery());

  const previewRef = useRef<HTMLDivElement | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<InvoiceTemplateId>("classic");
  const [designOverrides, setDesignOverrides] = useState<
    InvoiceDesignOverrides | undefined
  >(undefined);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const template = INVOICE_TEMPLATES[selectedTemplateId];
  const mockInvoice = createMockInvoice();
  const mockOrganization = {
    name: session?.activeOrganization?.name || "Your Company",
    logo: null
  };

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      baseTemplateId: selectedTemplateId,
      tokens: {
        ...template.defaultTokens,
        ...designOverrides?.tokens
      },
      visibility: {
        ...template.defaultVisibility,
        ...designOverrides?.visibility
      }
    },
    onSubmit: async ({ value }) => {
      try {
        await createTemplate({
          data: {
            name: value.name,
            description: value.description || undefined,
            baseTemplateId: value.baseTemplateId,
            tokens: value.tokens,
            visibility: value.visibility,
            logoPosition: value.tokens.logoPosition
          }
        });

        queryClient.invalidateQueries({
          queryKey: templatesQuery().queryKey
        });

        toast.success("Template created successfully");

        await navigate({ to: "/dashboard/templates" });
      } catch (error) {
        toast.error(
          getErrorMessage(error, "An error occurred while creating template")
        );
      }
    }
  });

  useEffect(() => {
    const newTokens = {
      ...template.defaultTokens,
      ...designOverrides?.tokens
    };
    const newVisibility = {
      ...template.defaultVisibility,
      ...designOverrides?.visibility
    };

    form.setFieldValue("baseTemplateId", selectedTemplateId);
    form.setFieldValue("tokens", newTokens);
    form.setFieldValue("visibility", newVisibility);
  }, [
    selectedTemplateId,
    template.defaultTokens,
    template.defaultVisibility,
    designOverrides?.tokens,
    designOverrides?.visibility,
    form
  ]);

  const handleTemplateChange = (templateId: InvoiceTemplateId) => {
    setSelectedTemplateId(templateId);
    setDesignOverrides(undefined);
  };

  const handleDesignChange = (overrides: InvoiceDesignOverrides) => {
    setDesignOverrides(overrides);
    const newTokens = {
      ...template.defaultTokens,
      ...overrides.tokens
    };
    const newVisibility = {
      ...template.defaultVisibility,
      ...overrides.visibility
    };
    form.setFieldValue("tokens", newTokens);
    form.setFieldValue("visibility", newVisibility);
  };

  const templateForPreview = {
    ...template,
    defaultTokens: {
      ...template.defaultTokens,
      ...designOverrides?.tokens
    },
    defaultVisibility: {
      ...template.defaultVisibility,
      ...designOverrides?.visibility
    }
  };

  const settingsContent = (
    <div className="flex flex-col gap-8 p-6">
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-8"
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Template Information
          </h3>
          <form.Field name="name">
            {field => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="My Custom Template"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  autoComplete="off"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="description">
            {field => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Optional description for this template"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                  autoComplete="off"
                />
              </div>
            )}
          </form.Field>
        </div>
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
        <div className="flex gap-4">
          <Link to="/dashboard/templates" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="flex-1"
            disabled={!form.state.canSubmit}
          >
            Create Template
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              if (canGoBack) {
                router.history.back();
              } else {
                navigate({ to: "/dashboard/templates" });
              }
            }}
          >
            <ArrowLeft className="size-4 shrink-0" />
          </Button>
          <h2 className="text-sm font-medium text-gray-900 sm:text-base">
            Create Template
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
                <SheetTitle>Template Settings</SheetTitle>
              </SheetHeader>
              {settingsContent}
            </SheetContent>
          </Sheet>
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
                className="invoice-preview-container w-full bg-white shadow-sm"
                data-page-size={template.defaultTokens.pageSize}
              >
                <div className="p-4 pb-12 sm:p-8">
                  <InvoicePreview
                    invoice={mockInvoice}
                    organization={mockOrganization}
                    template={templateForPreview}
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

function CreateTemplateSkeleton() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate({ to: "/dashboard/templates" })}
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
