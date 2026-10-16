import { useEffect } from "react";
import { useCanvasView } from "~/context/canvas-view-context";
import { useEditorUi } from "~/context/editor-ui-context";

// True when a key press belongs to a field (typing a "p" into an address must
// not toggle Preview). Read-only fields, like the page in Preview, don't count.
function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest(
      "input:not([readonly]), textarea:not([readonly]), select, [contenteditable='true']"
    ) !== null
  );
}

// Something modal or popped-up owns Escape and the keyboard while it's open.
function hasOpenOverlay() {
  return (
    document.querySelector(
      "[role='dialog'], [role='alertdialog'], [role='menu'], [data-slot='popover-content']"
    ) !== null
  );
}

// The editor's single-key and view shortcuts. File shortcuts (⌘S, ⌘O, ⇧⌘S)
// live with the file actions.
export function EditorShortcuts() {
  const {
    mode,
    setMode,
    toggleMode,
    toggleAllPanels,
    paletteOpen,
    setPaletteOpen
  } = useEditorUi();
  const { setView } = useCanvasView();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;

      if (mod && event.key.toLowerCase() === "k" && !event.shiftKey) {
        event.preventDefault();
        setPaletteOpen(!paletteOpen);

        return;
      }

      if (mod && event.key === "\\") {
        event.preventDefault();
        toggleAllPanels();

        return;
      }

      if (mod || event.altKey) return;
      if (isTypingTarget(event.target) || hasOpenOverlay()) return;

      if (event.key === "Escape" && mode === "preview") {
        setMode("edit");
      } else if (event.key.toLowerCase() === "p" && !event.shiftKey) {
        event.preventDefault();
        toggleMode();
      } else if (event.shiftKey && event.code === "Digit1") {
        event.preventDefault();
        setView("fit");
      } else if (event.shiftKey && event.code === "Digit0") {
        event.preventDefault();
        setView(1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    mode,
    setMode,
    toggleMode,
    toggleAllPanels,
    setView,
    paletteOpen,
    setPaletteOpen
  ]);

  return null;
}
