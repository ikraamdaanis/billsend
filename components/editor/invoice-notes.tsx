import { InvoiceInput } from "~/components/editor/invoice-input";
import { InvoiceTextArea } from "~/components/editor/invoice-textarea";
import { useNotesSlice, useTheme } from "~/stores/invoice-selectors";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

export function InvoiceNotes() {
  return (
    <>
      <NotesLabel />
      <NotesContent />
    </>
  );
}

function NotesLabel() {
  const { notes, setNotes } = useNotesSlice();
  const theme = useTheme();

  return (
    <InvoiceInput
      aria-label="Notes section label"
      value={notes.label}
      className="mb-2 font-medium md:text-base"
      onChange={value => setNotes(prev => ({ ...prev, label: value }))}
      placeholder="Notes"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionLabel")
      })}
    />
  );
}

function NotesContent() {
  const { notes, setNotes } = useNotesSlice();
  const theme = useTheme();

  return (
    <InvoiceTextArea
      id="invoice-field-notes"
      aria-label={`${notes.label || "Notes"} content`}
      value={notes.content}
      onChange={value => setNotes(prev => ({ ...prev, content: value }))}
      className="field-sizing-content min-h-[3lh] w-full"
      style={getTextStyles({
        settings: getRoleSettings(theme, "termsContent")
      })}
      placeholder="Add any additional notes"
    />
  );
}
