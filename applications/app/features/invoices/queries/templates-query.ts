import { queryOptions } from "@tanstack/react-query";
import {
  getTemplateById,
  listTemplates
} from "features/invoices/api/templates";

export function templatesQuery() {
  return queryOptions({
    queryKey: ["templates"],
    queryFn: listTemplates,
    staleTime: 30 * 1000,
    placeholderData: prev => prev
  });
}

export function templateByIdQuery(templateId: string) {
  return queryOptions({
    queryKey: ["template", templateId],
    queryFn: () => getTemplateById({ data: { templateId } }),
    placeholderData: prev => prev
  });
}

export type TemplatesQueryResult = Awaited<ReturnType<typeof listTemplates>>;
export type TemplateByIdQueryResult = Awaited<
  ReturnType<typeof getTemplateById>
>;
