// Whether a modal dialog (not a popover) is open over the editor. It owns the
// keyboard while it's open, so the editor's shortcuts stand down.
export function hasOpenModal(): boolean {
  return (
    document.querySelector(
      "[data-slot='dialog-content'], [role='alertdialog']"
    ) !== null
  );
}

// Whether anything modal or popped-up (a dialog, a menu, a popover) is open.
// It owns Escape and single-key presses while it's open. A phone's panel
// sheet (an aside) is the editor's own and doesn't count.
export function hasOpenOverlay(): boolean {
  return (
    document.querySelector(
      "[role='dialog']:not(aside), [role='alertdialog'], [role='menu'], [data-slot='popover-content']"
    ) !== null
  );
}
