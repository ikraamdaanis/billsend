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
import { templateByIdQuery } from "features/invoices/queries/templates-query";
import { updateTemplate } from "features/invoices/api/templates";
import type { InvoiceTemplate } from "features/invoices/templates/types";
import { createMockInvoice } from "features/invoices/utils/mock-invoice";
import { sessionQuery } from "features/auth/queries/session-query";
import { getErrorMessage } from "lib/get-error-message";
import { ArrowLeft, Settings } from "lucide-react";
import { Suspense, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/templates/custom/$templateId/edit"
)({
  component: EditTemplatePage,
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
    return Promise.all([
      context.queryClient.prefetchQuery(sessionQuery()),
      context.queryClient.prefetchQuery(templateByIdQuery(params.templateId))
    ]);
  },
  head: () => ({
    meta: [
      {
        title: "Edit Template - billsend"
      }
    ]
  })
});

function EditTemplatePage() {
  const { templateId } = Route.useParams();

  return (
    <Suspense fallback={<EditTemplateSkeleton />}>
      <EditTemplateContent templateId={templateId} />
    </Suspense>
  );
}

function EditTemplateContent({ templateId }: { templateId: string }) {
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const queryClient = useQueryClient();

  const { data: session } = useSuspenseQuery(sessionQuery());
  const { data: dbTemplate } = useSuspenseQuery(templateByIdQuery(templateId));

  const previewRef = useRef<HTMLDivElement | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const mockInvoice = createMockInvoice();
  const mockOrganization = {
    name: session?.activeOrganization?.name || "Your Company",
    logo: null
  };

  const template: InvoiceTemplate = {
    id: dbTemplate.id,
    name: dbTemplate.name,
    description: dbTemplate.description || "",
    defaultTokens: dbTemplate.tokens,
    defaultVisibility: dbTemplate.visibility
  };

  const form = useForm({
    defaultValues: {
      name: template.name,
      description: template.description,
      tokens: template.defaultTokens,
      visibility: template.defaultVisibility
    },
    onSubmit: async ({ value }) => {
      try {
        await updateTemplate({
          data: {
            templateId,
            name: value.name,
            description: value.description || undefined,
            tokens: value.tokens,
            visibility: value.visibility,
            logoPosition: value.tokens.logoPosition
          }
        });

        queryClient.invalidateQueries({
          queryKey: templateByIdQuery(templateId).queryKey
        });
        queryClient.invalidateQueries({
          queryKey: ["templates"]
        });

        toast.success("Template updated successfully");

        await navigate({
          to: "/dashboard/templates/custom/$templateId",
          params: { templateId }
        });
      } catch (error) {
        toast.error(
          getErrorMessage(error, "An error occurred while updating template")
        );
      }
    }
  });

  const handleDesignChange = (overrides: {
    templateId: string;
    tokens: typeof template.defaultTokens;
    visibility: typeof template.defaultVisibility;
  }) => {
    form.setFieldValue("tokens", overrides.tokens);
    form.setFieldValue("visibility", overrides.visibility);
  };

  const templateForPreview: InvoiceTemplate = {
    ...template,
    defaultTokens: form.state.values.tokens,
    defaultVisibility: form.state.values.visibility
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
          <h3 className="text-sm font-semibold text-gray-900">Customise</h3>
          <DesignControls
            defaultTokens={template.defaultTokens}
            defaultVisibility={template.defaultVisibility}
            templateId={template.id}
            overrides={{
              templateId: template.id,
              tokens: form.state.values.tokens,
              visibility: form.state.values.visibility
            }}
            onChange={handleDesignChange}
          />
        </div>
        <div className="flex gap-4">
          <Link
            to="/dashboard/templates/custom/$templateId"
            params={{ templateId }}
            className="flex-1"
          >
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="flex-1"
            disabled={!form.state.canSubmit}
          >
            Save Changes
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
                navigate({
                  to: "/dashboard/templates/custom/$templateId",
                  params: { templateId }
                });
              }
            }}
          >
            <ArrowLeft className="size-4 shrink-0" />
          </Button>
          <h2 className="text-sm font-medium text-gray-900 sm:text-base">
            Edit Template
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

function EditTemplateSkeleton() {
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
