function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDateForFilename(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function generatePdfFilename(
  invoiceDate: Date | string,
  clientName: string,
  invoiceNumber: string
): string {
  const dateStr = formatDateForFilename(invoiceDate);
  const clientNameKebab = toKebabCase(clientName);
  const invoiceNumberKebab = toKebabCase(invoiceNumber);

  return `${dateStr}-${clientNameKebab}-${invoiceNumberKebab}.pdf`;
}
