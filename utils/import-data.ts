import { z } from "zod";
import {
  getAllImages,
  getAllInvoices,
  getAllTemplates,
  saveImage,
  saveInvoice,
  saveTemplate
} from "~/db";
import type {
  BillsendExportFile,
  ImportAnalysis,
  ImportResult,
  InvoiceDocument,
  InvoiceTemplate
} from "~/types";

const billsendExportSchema = z.object({
  meta: z.object({
    version: z.number().int().positive(),
    exportedAt: z.string(),
    appName: z.literal("billsend")
  }),
  templates: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      isDefault: z.boolean(),
      templateData: z.record(z.string(), z.unknown()),
      screenshotUrl: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string()
    })
  ),
  invoices: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      invoiceData: z.record(z.string(), z.unknown()),
      templateId: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string()
    })
  ),
  images: z.array(
    z.object({
      id: z.string(),
      data: z.string(),
      type: z.string(),
      createdAt: z.string()
    })
  )
});

export async function parseExportFile(file: File): Promise<BillsendExportFile> {
  let text: string;
  try {
    text = await file.text();
  } catch {
    throw new Error("Failed to read the selected file.");
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }

  const result = billsendExportSchema.safeParse(json);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Unknown error";
    throw new Error(`The file is not a valid Billsend export: ${firstError}`);
  }

  return result.data as unknown as BillsendExportFile;
}

export async function analyzeImport(
  parsed: BillsendExportFile
): Promise<ImportAnalysis> {
  const [existingTemplates, existingInvoices, existingImages] =
    await Promise.all([getAllTemplates(), getAllInvoices(), getAllImages()]);

  const existingTemplateNames = new Set(
    existingTemplates.map(t => t.name.toLowerCase())
  );
  const existingInvoiceNames = new Set(
    existingInvoices.map(i => i.name.toLowerCase())
  );
  const existingImageIds = new Set(existingImages.map(img => img.id));

  const templateConflicts = parsed.templates
    .filter(t => existingTemplateNames.has(t.name.toLowerCase()))
    .map(t => t.name);

  const invoiceConflicts = parsed.invoices
    .filter(i => existingInvoiceNames.has(i.name.toLowerCase()))
    .map(i => i.name);

  const imageDuplicates = parsed.images.filter(img =>
    existingImageIds.has(img.id)
  ).length;

  return {
    templates: {
      total: parsed.templates.length,
      new: parsed.templates.length - templateConflicts.length,
      conflicts: templateConflicts
    },
    invoices: {
      total: parsed.invoices.length,
      new: parsed.invoices.length - invoiceConflicts.length,
      conflicts: invoiceConflicts
    },
    images: {
      total: parsed.images.length,
      new: parsed.images.length - imageDuplicates,
      duplicates: imageDuplicates
    }
  };
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function resolveConflictName(name: string, existingNames: Set<string>): string {
  if (!existingNames.has(name.toLowerCase())) return name;

  let candidate = `${name} (imported)`;
  let suffix = 1;
  while (existingNames.has(candidate.toLowerCase())) {
    suffix++;
    candidate = `${name} (imported ${suffix})`;
  }
  existingNames.add(candidate.toLowerCase());
  return candidate;
}

export async function executeImport(
  parsed: BillsendExportFile
): Promise<ImportResult> {
  const [existingTemplates, existingInvoices] = await Promise.all([
    getAllTemplates(),
    getAllInvoices()
  ]);

  const existingTemplateNames = new Set(
    existingTemplates.map(t => t.name.toLowerCase())
  );
  const existingInvoiceNames = new Set(
    existingInvoices.map(i => i.name.toLowerCase())
  );

  // Import images with new IDs
  const imageIdMap = new Map<string, string>();
  for (const img of parsed.images) {
    const newId = crypto.randomUUID();
    imageIdMap.set(img.id, newId);
    const arrayBuffer = base64ToArrayBuffer(img.data);
    const blob = new Blob([arrayBuffer], { type: img.type });
    await saveImage(newId, blob, img.type);
  }

  // Import templates with new IDs
  const templateIdMap = new Map<string, string>();
  for (const t of parsed.templates) {
    const newId = crypto.randomUUID();
    templateIdMap.set(t.id, newId);
    const resolvedName = resolveConflictName(t.name, existingTemplateNames);

    const templateData = JSON.parse(JSON.stringify(t.templateData));
    if (templateData.image && imageIdMap.has(templateData.image)) {
      templateData.image = imageIdMap.get(templateData.image);
    }

    const template: InvoiceTemplate = {
      id: newId,
      name: resolvedName,
      description: t.description,
      isDefault: false,
      templateData,
      screenshotUrl: t.screenshotUrl,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt)
    };
    await saveTemplate(template);
  }

  // Import invoices with new IDs
  for (const i of parsed.invoices) {
    const newId = crypto.randomUUID();
    const resolvedName = resolveConflictName(i.name, existingInvoiceNames);

    const invoiceData = JSON.parse(JSON.stringify(i.invoiceData));
    if (invoiceData.image && imageIdMap.has(invoiceData.image)) {
      invoiceData.image = imageIdMap.get(invoiceData.image);
    }

    const newTemplateId =
      i.templateId && templateIdMap.has(i.templateId)
        ? templateIdMap.get(i.templateId)!
        : i.templateId;

    const invoice: InvoiceDocument = {
      id: newId,
      name: resolvedName,
      invoiceData,
      templateId: newTemplateId,
      createdAt: new Date(i.createdAt),
      updatedAt: new Date(i.updatedAt)
    };
    await saveInvoice(invoice);
  }

  return {
    templatesImported: parsed.templates.length,
    invoicesImported: parsed.invoices.length,
    imagesImported: parsed.images.length
  };
}
