import { InvoiceInput } from "~/components/editor/invoice-input";
import {
  OptionalSection,
  RemoveSectionButton
} from "~/components/editor/invoice-optional-section";
import { InvoiceTextArea } from "~/components/editor/invoice-textarea";
import { useNotesSlice, useTheme } from "~/stores/invoice-selectors";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

export function InvoiceNotes({ onRemove }: { onRemove: () => void }) {
  return (
    <OptionalSection>
      <div className="mb-2 flex items-center gap-1">
        <NotesLabel />
        <RemoveSectionButton label="Hide notes" onClick={onRemove} />
      </div>
      <NotesContent />
    </OptionalSection>
  );
}

function NotesLabel() {
  const { notes, setNotes } = useNotesSlice();
  const theme = useTheme();

  return (
    <InvoiceInput
      aria-label="Notes section label"
      value={notes.label}
      className="font-medium"
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
