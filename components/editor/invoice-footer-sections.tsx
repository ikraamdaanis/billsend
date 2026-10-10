import { InvoiceLatePayment } from "~/components/editor/invoice-late-payment";
import { InvoiceNotes } from "~/components/editor/invoice-notes";
import { AddSectionButton } from "~/components/editor/invoice-optional-section";
import { InvoiceTerms } from "~/components/editor/invoice-terms";
import { useOptionalSection } from "~/hooks/use-optional-section";
import {
  useLatePaymentSlice,
  useNotesSlice,
  useTermsSlice
} from "~/stores/invoice-selectors";

/**
 * The optional sections at the foot of the invoice. Open ones render in their
 * fixed order; collapsed ones share a single row of "add" links underneath, so
 * the canvas doesn't stack a ladder of empty headings.
 */
export function InvoiceFooterSections() {
  const { notes, setNotes } = useNotesSlice();
  const { terms, setTerms } = useTermsSlice();
  const { latePayment, setLatePayment } = useLatePaymentSlice();
  const notesSection = useOptionalSection({
    content: notes.content,
    clear: () => setNotes(prev => ({ ...prev, content: "" }))
  });
  const termsSection = useOptionalSection({
    content: terms.content,
    clear: () => setTerms(prev => ({ ...prev, content: "" }))
  });
  const latePaymentSection = useOptionalSection({
    content: latePayment.content,
    clear: () => setLatePayment(prev => ({ ...prev, content: "" }))
  });
  const sections = [
    {
      id: "notes",
      label: notes.label || "Notes",
      section: notesSection,
      content: (
        <InvoiceNotes
          autoFocus={notesSection.autoFocusContent}
          onRemove={notesSection.remove}
        />
      )
    },
    {
      id: "terms",
      label: terms.label || "Terms and conditions",
      section: termsSection,
      content: (
        <InvoiceTerms
          autoFocus={termsSection.autoFocusContent}
          onRemove={termsSection.remove}
        />
      )
    },
    {
      id: "late-payment",
      label: latePayment.label || "Late payment",
      section: latePaymentSection,
      content: (
        <InvoiceLatePayment
          autoFocus={latePaymentSection.autoFocusContent}
          onRemove={latePaymentSection.remove}
        />
      )
    }
  ];
  const collapsed = sections.filter(({ section }) => !section.isOpen);

  return (
    <>
      {sections
        .filter(({ section }) => section.isOpen)
        .map(({ id, content }) => (
          <div key={id} className="mt-6">
            {content}
          </div>
        ))}
      {collapsed.length > 0 && (
        <div
          role="group"
          aria-label="Add a section"
          className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1"
        >
          {collapsed.map(({ id, label, section }) => (
            <AddSectionButton
              key={id}
              onClick={section.open}
              autoFocus={section.autoFocusAdd}
            >
              <span className="sr-only">Add </span>
              {label}
            </AddSectionButton>
          ))}
        </div>
      )}
    </>
  );
}
