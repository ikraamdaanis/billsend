import { useSyncExternalStore } from "react";
import { Toaster } from "sonner";
import type { EditorTheme } from "~/types";

// Toasts follow the editor's scheme while it's open (the editor sets
// data-editor-theme on <html>); everywhere else the site is light.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-editor-theme"]
  });

  return () => observer.disconnect();
}

function getTheme(): EditorTheme {
  return document.documentElement.dataset.editorTheme === "dark"
    ? "dark"
    : "light";
}

function getServerTheme(): EditorTheme {
  return "light";
}

export function AppToaster() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  return <Toaster richColors theme={theme} />;
}
