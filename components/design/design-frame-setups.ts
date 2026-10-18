import { toast } from "sonner";
import { failureMessage } from "~/context/document-session";
import { useDocumentStore } from "~/stores/document-store";

function isPhone() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function isShown(element: Element) {
  return element.getClientRects().length > 0;
}

// A control's name as a person reads it: its label, or its text without a
// menu item's shortcut.
function controlName(control: HTMLElement) {
  const label = control.getAttribute("aria-label") ?? control.title;

  if (label) return label;

  return [...control.childNodes]
    .filter(
      node =>
        !(
          node instanceof HTMLElement && node.dataset.slot?.endsWith("shortcut")
        )
    )
    .map(node => node.textContent)
    .join("")
    .trim();
}

// The first shown control called `name`, or whose name starts with it when
// `name` ends in a space (a row's "Actions for …" menu).
function findControl(name: string) {
  const controls = document.querySelectorAll<HTMLElement>(
    "button, [role='button'], [role='menuitem'], [role='tab'], a"
  );

  return [...controls].find(control => {
    if (!isShown(control)) return false;

    const controlLabel = controlName(control);

    return name.endsWith(" ")
      ? controlLabel.startsWith(name)
      : controlLabel === name;
  });
}

async function waitFor<TFound>(find: () => TFound | null | undefined) {
  for (let attempt = 0; attempt < 80; attempt++) {
    const found = find();

    if (found) return found;

    await new Promise(resolve => setTimeout(resolve, 50));
  }

  throw new Error("The design frame couldn't find what its block opens");
}

async function click(name: string) {
  const control = await waitFor(() => findControl(name));

  control.click();
}

async function openFromProjectMenu(item: string) {
  await click("Project menu");
  await click(item);
}

// Phones open a panel from the tab bar; wider screens start with it open
// from the block's remembered panels.
async function openPanelOnPhone(tab: "Invoices" | "Style") {
  if (isPhone()) await click(tab);
}

function setDocument(
  state: Partial<ReturnType<typeof useDocumentStore.getState>>
) {
  useDocumentStore.setState(state);
}

const SAVE_FAILED = failureMessage(new Error("Write failed"));

const STORAGE_FULL = failureMessage(
  new DOMException("Storage is full", "QuotaExceededError")
);

// What each block's frame does once the editor has the sample invoice open:
// forcing a state the session would only reach on its own, or opening a
// panel, menu or dialog the way a person would.
export const DESIGN_FRAME_SETUPS: Partial<
  Record<string, () => Promise<void> | void>
> = {
  "banner-read-only": () => setDocument({ status: "readOnly" }),
  "banner-deleted": () => setDocument({ status: "deleted" }),
  "banner-save-failed": () =>
    setDocument({
      saveFailure: { message: SAVE_FAILED, storageFull: false, episode: 1 }
    }),
  "banner-storage-full": () =>
    setDocument({
      saveFailure: { message: STORAGE_FULL, storageFull: true, episode: 1 }
    }),
  "banner-reload": () => setDocument({ status: "reloadRequired" }),
  "banner-unavailable": () => setDocument({ status: "unavailable" }),
  "banner-backup": () => setDocument({ backupReminder: true }),
  "toast-success": () => {
    toast.success("Invoice renamed", { duration: Infinity });
  },
  "toast-warning": () => {
    toast.warning("This invoice was changed in another tab", {
      duration: Infinity
    });
  },
  "toast-error": () => {
    toast.error("This invoice couldn't be saved, so it stays open", {
      duration: Infinity
    });
  },
  "toast-stacked": () => {
    toast.success("Data exported successfully", { duration: Infinity });
    toast.success("Template created successfully!", { duration: Infinity });
    toast.error("Reload the page to open another invoice", {
      duration: Infinity
    });
  },
  "editor-field-zoom": async () => {
    const field = await waitFor(() =>
      document.querySelector<HTMLElement>("[aria-label='To details']")
    );

    field.focus();
  },
  "panel-invoices": () => openPanelOnPhone("Invoices"),
  "panel-invoices-empty": () => openPanelOnPhone("Invoices"),
  "panel-templates-empty": async () => {
    await openPanelOnPhone("Invoices");
    await click("Templates");
  },
  "panel-inspector": () => openPanelOnPhone("Style"),
  "menu-project": () => click("Project menu"),
  "popover-download": () => click("Download"),
  palette: () => click("Quick actions"),
  "dialog-confirm-delete": async () => {
    await openPanelOnPhone("Invoices");
    await click("Actions for ");
    await click("Delete…");
  },
  "dialog-open-invoice": () => openFromProjectMenu("Open Invoice"),
  "dialog-open-invoice-empty": () => openFromProjectMenu("Open Invoice"),
  "dialog-versions": () => openFromProjectMenu("Version History"),
  "dialog-rename": () => click("Rename"),
  "dialog-save-template": () => openFromProjectMenu("Save As Template"),
  "dialog-open-template": () => openFromProjectMenu("Open Template"),
  "dialog-import": () => openFromProjectMenu("Import Data")
};
