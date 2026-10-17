// Who is changing the invoice store right now, so its listeners can tell an
// edit apart from undo and from an invoice being loaded:
// - edit: someone editing (the default); recorded for undo, and saved
// - history: undo or redo putting an earlier state back; saved, not recorded
// - load: opening an invoice, or following a write from another tab; neither
//   saved nor recorded
type ChangeOrigin = "edit" | "history" | "load";

let origin: ChangeOrigin = "edit";

export function getChangeOrigin(): ChangeOrigin {
  return origin;
}

// Runs a store update as coming from `nextOrigin`. Store listeners run
// synchronously inside the update, so they read the origin it ran under.
export function runWithOrigin(nextOrigin: ChangeOrigin, update: () => void) {
  const previous = origin;

  origin = nextOrigin;

  try {
    update();
  } finally {
    origin = previous;
  }
}
