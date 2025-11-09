import { Button } from "components/ui/button";
import { FileDown } from "lucide-react";
import type { RefObject } from "react";

export function PrintButton({
  contentRef
}: {
  contentRef: RefObject<HTMLDivElement | null>;
}) {
  function handlePrint() {
    if (!contentRef.current) return;

    const printContent = contentRef.current.innerHTML;
    const printWindow = window.open("", "_blank");

    if (!printWindow) return;

    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules)
            .map(rule => rule.cssText)
            .join("\n");
        } catch {
          return "";
        }
      })
      .filter(Boolean)
      .join("\n");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice</title>
          <style>
            ${styles}
            @page {
              size: A4;
              margin: 16mm;
            }
            @media print {
              html, body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              @page {
                margin: 4mm;
              }
              .no-print {
                display: none !important;
              }
              .invoice-preview-container {
                box-shadow: none !important;
              }
            }
            body {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 250);
  }

  return (
    <Button
      type="button"
      onClick={handlePrint}
      className="gap-2"
      aria-label="Export invoice as PDF"
    >
      <FileDown className="size-4" />
      Export PDF
    </Button>
  );
}
