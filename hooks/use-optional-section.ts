import { useState } from "react";

/**
 * Open / collapsed state for an optional invoice section (shipping, notes,
 * terms, late payment). The section shows when it has content or when the
 * user just asked to add it, so an empty one collapses again on reload; the
 * PDF skips empty sections either way.
 *
 * Focus follows the user: adding focuses the section's content field and
 * removing returns focus to the section's "add" control.
 */
export function useOptionalSection({
  content,
  clear
}: {
  content: string;
  clear: () => void;
}) {
  const [focusTarget, setFocusTarget] = useState<"none" | "content" | "add">(
    "none"
  );

  return {
    isOpen: content.trim().length > 0 || focusTarget === "content",
    autoFocusContent: focusTarget === "content",
    autoFocusAdd: focusTarget === "add",
    open: () => setFocusTarget("content"),
    remove: () => {
      clear();
      setFocusTarget("add");
    }
  };
}
