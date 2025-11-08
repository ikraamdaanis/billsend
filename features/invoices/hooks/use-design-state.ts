import type {
  InvoiceDesignOverrides,
  InvoiceSectionVisibility,
  InvoiceTemplateTokens
} from "features/invoices/templates/types";
import type { RefObject } from "react";
import { useState } from "react";

export function useDesignState(
  initialTokens: InvoiceTemplateTokens,
  initialVisibility: InvoiceSectionVisibility,
  previewRef?: RefObject<HTMLDivElement | null>
) {
  const [designTokens, setDesignTokens] =
    useState<InvoiceTemplateTokens>(initialTokens);
  const [designVisibility, setDesignVisibility] =
    useState<InvoiceSectionVisibility>(initialVisibility);

  const handleDesignChange = (overrides: InvoiceDesignOverrides) => {
    if (overrides.tokens) {
      const newTokens = {
        ...designTokens,
        ...overrides.tokens
      };
      setDesignTokens(newTokens);

      if (overrides.tokens.accentColorHex !== undefined && previewRef?.current) {
        const invoicePage = previewRef.current.querySelector(".invoice-page");
        if (invoicePage) {
          (invoicePage as HTMLElement).style.setProperty(
            "--accent-color",
            newTokens.accentColorHex
          );
        }
      }
    }
    if (overrides.visibility) {
      const newVisibility = {
        ...designVisibility,
        ...overrides.visibility
      };
      setDesignVisibility(newVisibility);
    }
  };

  return {
    designTokens,
    designVisibility,
    setDesignTokens,
    setDesignVisibility,
    handleDesignChange
  };
}

