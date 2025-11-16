import { createFileRoute, redirect } from "@tanstack/react-router";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Skeleton } from "components/ui/skeleton";
import { sessionQuery } from "features/auth/queries/session-query";
import { DesignItem } from "features/invoices/components/design/design-item";
import { DesignItemSettings } from "features/invoices/components/design/design-item-settings";
import { EditorLayout } from "features/invoices/components/designer-layout";
import { templatesQuery } from "features/invoices/queries/templates-query";
import type { TemplatePaths, TemplateValue } from "features/invoices/state";
import {
  colorsAtom,
  createTypedUpdatePath,
  dateAtom,
  dateLabelAtom,
  designStateAtom,
  dueDateAtom,
  dueDateLabelAtom,
  getPathAtom,
  numberAtom,
  numberLabelAtom,
  titleAtom,
  updatePathAtom
} from "features/invoices/state";
import { useAtomValue, useSetAtom } from "jotai";
import type { ComponentProps, CSSProperties } from "react";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/(editor)/templates/create")({
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
  return (
    <EditorLayout
      title="Create Template"
      settingsContent={<CreateTemplatePreview />}
    >
      <CreateTemplatePreviewContent />
    </EditorLayout>
  );
}

function CreateTemplatePreviewContent() {
  const cssVariables = useAtomValue(colorsAtom) as CSSProperties;

  return (
    <div className="flex flex-1 flex-col bg-white p-10" style={cssVariables}>
      <DesignItem path="components.title.value" value={titleAtom} />
      <div className="flex flex-row items-center gap-2">
        <DesignItem
          path="components.numberLabel.value"
          value={numberLabelAtom}
        />
        <DesignItem path="components.number.value" value={numberAtom} />
      </div>
      <div className="flex flex-row items-center gap-2">
        <DesignItem path="components.dateLabel.value" value={dateLabelAtom} />
        <DesignItem path="components.date.value" value={dateAtom} />
      </div>
      <div className="flex flex-row items-center gap-2">
        <DesignItem
          path="components.dueDateLabel.value"
          value={dueDateLabelAtom}
        />
        <DesignItem path="components.dueDate.value" value={dueDateAtom} />
      </div>
    </div>
  );
}

export function InputUpdater<TPath extends TemplatePaths>({
  variableName,
  label,
  type
}: {
  variableName: TPath;
  label: string;
  type: ComponentProps<typeof Input>["type"];
}) {
  const pathValue = useAtomValue(getPathAtom(variableName));
  const updatePath = createTypedUpdatePath(useSetAtom(updatePathAtom));

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={String(pathValue)}
        onChange={e =>
          updatePath(variableName, e.target.value as TemplateValue<TPath>)
        }
      />
    </div>
  );
}

function CreateTemplatePreview() {
  const currentSelectedPath = useAtomValue(designStateAtom);
  return (
    <div className="flex flex-1 flex-col gap-6 bg-white p-4">
      <InputUpdater
        variableName="colors.--accent-color"
        label="Accent Colour"
        type="color"
      />
      <InputUpdater
        variableName="colors.--primary-color"
        label="Primary Colour"
        type="color"
      />
      <InputUpdater
        variableName="colors.--text-color"
        label="Text Colour"
        type="color"
      />
      <InputUpdater
        variableName="components.title.value"
        label="Title Label"
        type="text"
      />
      <InputUpdater
        variableName="components.title.fontSize"
        label="Font Size"
        type="number"
      />
      <InputUpdater
        variableName="components.title.fontWeight"
        label="Font Weight"
        type="number"
      />
      {currentSelectedPath.currentSelectedPath === "components.title.value" && (
        <DesignItemSettings path="components.title" />
      )}
    </div>
  );
}

function CreateTemplateSkeleton() {
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
