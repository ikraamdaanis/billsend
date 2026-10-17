import { IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import {
  redoInvoiceChange,
  undoInvoiceChange,
  useInvoiceHistory
} from "~/stores/invoice-history";

export function undoLabel(label: string | null) {
  return label ? `Undo change to ${label}` : "Undo";
}

export function redoLabel(label: string | null) {
  return label ? `Redo change to ${label}` : "Redo";
}

// Undo and redo for phones, which have no keyboard to press ⌘Z on. They sit
// in the top bar beside Download while editing, as in Canva and Figma's apps.
export function HistoryButtons({ className }: { className?: string }) {
  const {
    canUndo,
    canRedo,
    undoLabel: undoName,
    redoLabel: redoName
  } = useInvoiceHistory();

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={undoLabel(undoName)}
        disabled={!canUndo}
        onClick={() => undoInvoiceChange()}
        className="text-muted-foreground pointer-coarse:size-11"
      >
        <IconArrowBackUp aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={redoLabel(redoName)}
        disabled={!canRedo}
        onClick={() => redoInvoiceChange()}
        className="text-muted-foreground pointer-coarse:size-11"
      >
        <IconArrowForwardUp aria-hidden="true" />
      </Button>
    </div>
  );
}
