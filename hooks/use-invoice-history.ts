import { useInvoiceDocument } from "context/invoice-document-context";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { invoiceDefault, useInvoiceStore } from "stores/invoice-store";
import type { Invoice } from "types";

const HISTORY_LIMIT = 50;
const BURST_MS = 400;
const INVOICE_KEYS = Object.keys(invoiceDefault) as (keyof Invoice)[];

function snapshot(state: Invoice): Invoice {
  const data = {} as Record<string, unknown>;

  for (const key of INVOICE_KEYS) {
    data[key] = state[key];
  }

  return JSON.parse(JSON.stringify(data)) as Invoice;
}

function isEditableTarget(element: HTMLElement): boolean {
  const tag = element.tagName;

  return tag === "INPUT" || tag === "TEXTAREA" || element.isContentEditable;
}

/**
 * Document-level undo/redo for the invoice store. Records debounced snapshots so a
 * burst of typing collapses into one history entry, and resets when a different
 * document is loaded. Keyboard shortcuts are skipped while a text field is focused
 * so the browser's native input undo still works there.
 */
export function useInvoiceHistory() {
  const past = useRef<Invoice[]>([]);
  const future = useRef<Invoice[]>([]);
  const isTimeTraveling = useRef(false);
  const pendingBaseline = useRef<Invoice | null>(null);
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, forceRender] = useReducer(count => count + 1, 0);
  const { currentDocumentId } = useInvoiceDocument();

  const commitBaseline = useCallback(() => {
    if (burstTimer.current) {
      clearTimeout(burstTimer.current);
      burstTimer.current = null;
    }

    if (pendingBaseline.current) {
      past.current.push(pendingBaseline.current);

      if (past.current.length > HISTORY_LIMIT) {
        past.current.shift();
      }

      pendingBaseline.current = null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = useInvoiceStore.subscribe((state, prevState) => {
      if (isTimeTraveling.current) {
        isTimeTraveling.current = false;

        return;
      }

      if (pendingBaseline.current === null) {
        pendingBaseline.current = snapshot(prevState);
      }

      future.current = [];

      if (burstTimer.current) {
        clearTimeout(burstTimer.current);
      }

      burstTimer.current = setTimeout(() => {
        commitBaseline();
        forceRender();
      }, BURST_MS);

      forceRender();
    });

    return unsubscribe;
  }, [commitBaseline]);

  useEffect(() => {
    past.current = [];
    future.current = [];
    pendingBaseline.current = null;

    if (burstTimer.current) {
      clearTimeout(burstTimer.current);
      burstTimer.current = null;
    }

    forceRender();
  }, [currentDocumentId]);

  const undo = useCallback(() => {
    commitBaseline();

    const previous = past.current.pop();
    if (!previous) return;

    const { setInvoice } = useInvoiceStore.getState();
    future.current.push(snapshot(useInvoiceStore.getState()));
    isTimeTraveling.current = true;
    setInvoice(previous);
    forceRender();
  }, [commitBaseline]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;

    const { setInvoice } = useInvoiceStore.getState();
    past.current.push(snapshot(useInvoiceStore.getState()));
    isTimeTraveling.current = true;
    setInvoice(next);
    forceRender();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? event.metaKey : event.ctrlKey;

      if (!modKey || event.key.toLowerCase() !== "z") return;

      const target = event.target as HTMLElement | null;
      if (target && isEditableTarget(target)) return;

      event.preventDefault();

      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const canUndo = past.current.length > 0 || pendingBaseline.current !== null;
  const canRedo = future.current.length > 0;

  return { undo, redo, canUndo, canRedo };
}
