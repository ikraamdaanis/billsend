import {
  IconArrowLeft,
  IconBookmark,
  IconChevronDown,
  IconCommand,
  IconDeviceFloppy,
  IconDownload,
  IconFile,
  IconFilePlus,
  IconFolderOpen,
  IconMoon,
  IconSun,
  IconUpload
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { useEditorUi } from "~/context/editor-ui-context";
import { useFileActions } from "~/context/file-actions-context";
import { useEditorTheme } from "~/hooks/use-editor-theme";
import { shortcutLabel } from "~/utils/shortcut-label";

// The logo opens one menu with everything the old File menu had, plus the way
// back to the homepage, like the project menu in Framer. It also carries the
// light/dark switch, which phones have no canvas pill for.
export function ProjectMenu({ onLeave }: { onLeave: () => void }) {
  const actions = useFileActions();
  const { setPaletteOpen } = useEditorUi();
  const { theme, toggleTheme } = useEditorTheme();
  const isDark = theme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Project menu"
        className="hover:bg-muted aria-expanded:bg-accent focus-visible:ring-ring text-muted-foreground hover:text-foreground flex h-8 shrink-0 items-center gap-0.5 rounded-md pr-1 pl-0.5 outline-none focus-visible:ring-1 pointer-coarse:h-11"
      >
        <img
          src="/favicon.svg"
          alt=""
          className="size-6 rounded-[6px] pointer-coarse:size-8"
        />
        <IconChevronDown aria-hidden="true" className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          onClick={actions.newInvoice}
          disabled={actions.pending}
        >
          <IconFilePlus aria-hidden="true" />
          New Invoice
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={actions.showOpenInvoice}
          disabled={actions.pending}
        >
          <IconFolderOpen aria-hidden="true" />
          Open Invoice
          <DropdownMenuShortcut>{shortcutLabel("⌘O")}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={actions.save} disabled={actions.pending}>
          <IconDeviceFloppy aria-hidden="true" />
          Save
          <DropdownMenuShortcut>{shortcutLabel("⌘S")}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={actions.saveAs} disabled={actions.pending}>
          <IconFile aria-hidden="true" />
          Save As...
          <DropdownMenuShortcut>{shortcutLabel("⇧⌘S")}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={actions.showOpenTemplate}
          disabled={actions.pending}
        >
          <IconBookmark aria-hidden="true" />
          Open Template
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={actions.saveAsTemplate}
          disabled={actions.pending}
        >
          <IconDeviceFloppy aria-hidden="true" />
          Save As Template
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={actions.exportData}
          disabled={actions.pending}
        >
          <IconDownload aria-hidden="true" />
          Export Data
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={actions.importData}
          disabled={actions.pending}
        >
          <IconUpload aria-hidden="true" />
          Import Data
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleTheme}>
          {isDark ? (
            <IconSun aria-hidden="true" />
          ) : (
            <IconMoon aria-hidden="true" />
          )}
          {isDark ? "Light mode" : "Dark mode"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setPaletteOpen(true)}>
          <IconCommand aria-hidden="true" />
          Quick actions
          <DropdownMenuShortcut>{shortcutLabel("⌘K")}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLeave}>
          <IconArrowLeft aria-hidden="true" />
          Back to homepage
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
