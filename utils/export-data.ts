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

export async function exportAllData(): Promise<void> {
  const [templates, invoices, images] = await Promise.all([
    getAllTemplates(),
    getAllInvoices(),
    getAllImages()
  ]);

  const exportData: BillsendExportFile = {
    meta: {
      version: 1,
      exportedAt: new Date().toISOString(),
      appName: "billsend"
    },
    templates: templates.map(t => ({
      ...t,
      createdAt: new Date(t.createdAt).toISOString(),
      updatedAt: new Date(t.updatedAt).toISOString()
    })),
    invoices: invoices.map(i => ({
      ...i,
      createdAt: new Date(i.createdAt).toISOString(),
      updatedAt: new Date(i.updatedAt).toISOString()
    })),
    images: images.map(img => ({
      id: img.id,
      data: arrayBufferToBase64(img.data),
      type: img.type,
      createdAt: new Date(img.createdAt).toISOString()
    }))
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `billsend-export-${format(new Date(), "yyyy-MM-dd")}.json`;
  a.click();

  URL.revokeObjectURL(url);
}
