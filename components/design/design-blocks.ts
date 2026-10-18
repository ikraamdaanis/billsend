import type { DesignBlock, DesignViewport } from "~/types";

// Each viewport's real size, and how far the catalogue scales it down.
export const DESIGN_VIEWPORTS: Record<
  DesignViewport,
  { label: string; width: number; height: number; scale: number }
> = {
  phone: { label: "Phone", width: 390, height: 780, scale: 0.7 },
  tablet: { label: "Tablet", width: 768, height: 1024, scale: 0.5 },
  desktop: { label: "Desktop", width: 1280, height: 800, scale: 0.5 }
};

const ALL: DesignViewport[] = ["phone", "tablet", "desktop"];

// The quick actions button and the palette are for keyboards and wider
// screens; phones have no way in.
const WIDE: DesignViewport[] = ["tablet", "desktop"];

const PANELS_KEY = "billsend-editor-panels";

const MODE_KEY = "billsend-editor-mode";

function panels(left: boolean, right: boolean) {
  return { [PANELS_KEY]: JSON.stringify({ left, right }) };
}

// The design catalogue's blocks, in order. What each frame does once the
// editor is up lives in design-frame-setups.ts, which only frames load.
export const DESIGN_BLOCKS: DesignBlock[] = [
  {
    id: "banner-read-only",
    group: "Status banners",
    title: "Open in another tab",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "banner-deleted",
    group: "Status banners",
    title: "Deleted in another tab",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "banner-save-failed",
    group: "Status banners",
    title: "Save failed",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "banner-storage-full",
    group: "Status banners",
    title: "Storage full",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "banner-reload",
    group: "Status banners",
    title: "Updated in another tab",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "banner-unavailable",
    group: "Status banners",
    title: "No storage in this browser",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "banner-backup",
    group: "Status banners",
    title: "Backup suggestion (Safari)",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "toast-success",
    group: "Toasts",
    title: "Success",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "toast-warning",
    group: "Toasts",
    title: "Warning",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "toast-error",
    group: "Toasts",
    title: "Error",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "toast-stacked",
    group: "Toasts",
    title: "Several at once",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "editor-default",
    group: "Editor",
    title: "Editing, panels as they start",
    note: "Wide screens start with both panels open; phones with none.",
    kind: "editor",
    viewports: ALL,
    storage: {},
    emptyLibrary: false
  },
  {
    id: "editor-panels-closed",
    group: "Editor",
    title: "Editing, panels closed",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "editor-preview",
    group: "Editor",
    title: "Preview",
    note: "Phones have no Preview, so they show the editor.",
    kind: "editor",
    viewports: ALL,
    storage: { ...panels(true, true), [MODE_KEY]: JSON.stringify("preview") },
    emptyLibrary: false
  },
  {
    id: "editor-field-zoom",
    group: "Editor",
    title: "A field tapped on a phone",
    kind: "editor",
    viewports: ["phone"],
    storage: {},
    emptyLibrary: false
  },
  {
    id: "panel-invoices",
    group: "Panels",
    title: "Invoices",
    kind: "editor",
    viewports: ALL,
    storage: panels(true, false),
    emptyLibrary: false
  },
  {
    id: "panel-invoices-empty",
    group: "Panels",
    title: "Invoices, none saved yet",
    kind: "editor",
    viewports: ALL,
    storage: panels(true, false),
    emptyLibrary: true
  },
  {
    id: "panel-templates-empty",
    group: "Panels",
    title: "Templates, none saved yet",
    kind: "editor",
    viewports: ALL,
    storage: panels(true, false),
    emptyLibrary: true
  },
  {
    id: "panel-inspector",
    group: "Panels",
    title: "Inspector",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, true),
    emptyLibrary: false
  },
  {
    id: "menu-project",
    group: "Menus and popovers",
    title: "Project menu",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "popover-download",
    group: "Menus and popovers",
    title: "Download",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "palette",
    group: "Menus and popovers",
    title: "Quick actions",
    kind: "editor",
    viewports: WIDE,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "dialog-open-invoice",
    group: "Dialogs",
    title: "Open invoice",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "dialog-open-invoice-empty",
    group: "Dialogs",
    title: "Open invoice, none saved yet",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: true
  },
  {
    id: "dialog-confirm-delete",
    group: "Dialogs",
    title: "Delete confirmation",
    kind: "editor",
    viewports: ALL,
    storage: panels(true, false),
    emptyLibrary: false
  },
  {
    id: "dialog-versions",
    group: "Dialogs",
    title: "Version history",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "dialog-rename",
    group: "Dialogs",
    title: "Rename",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "dialog-save-template",
    group: "Dialogs",
    title: "Save as template",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "dialog-open-template",
    group: "Dialogs",
    title: "Open template",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "dialog-import",
    group: "Dialogs",
    title: "Import data",
    kind: "editor",
    viewports: ALL,
    storage: panels(false, false),
    emptyLibrary: false
  },
  {
    id: "controls",
    group: "Controls",
    title: "Buttons, fields and switches",
    note: "Every variant and size, enabled and disabled.",
    kind: "controls",
    viewports: ALL,
    height: 1100,
    storage: {},
    emptyLibrary: true
  }
];
