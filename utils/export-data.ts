import { format } from "date-fns";
import { getAllImages, getAllInvoices, getAllTemplates } from "~/db";
import type { BillsendExportFile } from "~/types";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

// Snapshots the whole local setup (templates, invoices, and images) into the
// serializable export shape. Kept separate from the download so it can be
// exercised in tests, which have no DOM to drive the file save.
export async function buildExportData(): Promise<BillsendExportFile> {
  const [templates, invoices, images] = await Promise.all([
    getAllTemplates(),
    getAllInvoices(),
    getAllImages()
  ]);

  return {
    meta: {
      version: 3,
      exportedAt: new Date().toISOString(),
      appName: "billsend"
    },
    templates: templates.map(template => ({
      ...template,
      createdAt: new Date(template.createdAt).toISOString(),
      updatedAt: new Date(template.updatedAt).toISOString()
    })),
    invoices: invoices.map(invoice => ({
      ...invoice,
      createdAt: new Date(invoice.createdAt).toISOString(),
      updatedAt: new Date(invoice.updatedAt).toISOString()
    })),
    images: images.map(image => ({
      id: image.id,
      data: arrayBufferToBase64(image.data),
      type: image.type,
      createdAt: new Date(image.createdAt).toISOString()
    }))
  };
}

export async function exportAllData(): Promise<void> {
  const exportData = await buildExportData();

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `billsend-export-${format(new Date(), "yyyy-MM-dd")}.json`;
  a.click();

  URL.revokeObjectURL(url);
}
