import { useForm } from "@tanstack/react-form";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
  useRouter
} from "@tanstack/react-router";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Skeleton } from "components/ui/skeleton";
import { sessionQuery } from "features/auth/queries/session-query";
import { updateTemplate } from "features/invoices/api/templates";
import { DesignControls } from "features/invoices/components/design-controls";
import { EditorLayout } from "features/invoices/components/editor-layout";
import { InvoicePreviewContainer } from "features/invoices/components/invoice-preview-container";
import { useDesignState } from "features/invoices/hooks/use-design-state";
import { templateByIdQuery } from "features/invoices/queries/templates-query";
import type { InvoiceTemplate } from "features/invoices/templates/types";
import { createMockInvoice } from "features/invoices/utils/mock-invoice";
import { getErrorMessage } from "lib/get-error-message";
import { Suspense, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/dashboard/(editor)/templates/$templateId/edit"
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
  const queryClient = useQueryClient();

  const { data: session } = useSuspenseQuery(sessionQuery());
  const { data: dbTemplate } = useSuspenseQuery(templateByIdQuery(templateId));

  const template: InvoiceTemplate = {
    id: dbTemplate.id,
    name: dbTemplate.name,
    description: dbTemplate.description || "",
    defaultTokens: dbTemplate.tokens,
    defaultVisibility: dbTemplate.visibility
  };

  const previewRef = useRef<HTMLDivElement | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { designTokens, designVisibility, handleDesignChange } = useDesignState(
    template.defaultTokens,
    template.defaultVisibility,
    previewRef
  );

  const mockInvoice = createMockInvoice();
  const mockOrganization = {
    name: session?.activeOrganization?.name || "Your Company",
    logo: null
  };

  const form = useForm({
    defaultValues: {
      name: template.name,
      description: template.description,
      tokens: designTokens,
      visibility: designVisibility
    },
    onSubmit: async ({ value }) => {
      try {
        await updateTemplate({
          data: {
            templateId,
            name: value.name,
            description: value.description || undefined,
            tokens: designTokens,
            visibility: designVisibility,
            logoPosition: designTokens.logoPosition
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
          to: "/dashboard/templates/$templateId",
          params: { templateId }
        });
      } catch (error) {
        toast.error(
          getErrorMessage(error, "An error occurred while updating template")
        );
      }
    }
  });

  const templateForPreview: InvoiceTemplate = {
    ...template,
    defaultTokens: designTokens,
    defaultVisibility: designVisibility
  };

  const handleBack = () => {
    router.history.back();
  };

  const settingsContent = (
    <div className="flex flex-col gap-8 p-4 pb-0">
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
                  data-1p-ignore
                  data-lpignore="true"
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
              tokens: designTokens,
              visibility: designVisibility
            }}
            onChange={handleDesignChange}
            previewRef={previewRef}
          />
        </div>
        <div className="border-border sticky bottom-0 z-10 flex gap-4 border-t bg-white py-4">
          <Link
            to="/dashboard/templates/$templateId"
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
    <EditorLayout
      title="Edit Template"
      onBack={handleBack}
      settingsContent={settingsContent}
      settingsOpen={settingsOpen}
      onSettingsOpenChange={setSettingsOpen}
    >
      <InvoicePreviewContainer
        previewRef={previewRef}
        invoice={mockInvoice}
        organization={mockOrganization}
        template={templateForPreview}
        overrides={{
          templateId: template.id,
          tokens: designTokens,
          visibility: designVisibility
        }}
      />
    </EditorLayout>
  );
}

function EditTemplateSkeleton() {
  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6">
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <Skeleton className="h-full w-80" />
        <Skeleton className="flex-1" />
      </div>
    </div>
  );
}
