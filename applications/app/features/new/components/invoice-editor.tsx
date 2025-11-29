"use client";

import { useGesture } from "@use-gesture/react";
import { Button } from "components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger
} from "components/ui/drawer";
import { DownloadInvoice } from "features/new/components/download-invoice";
import { InvoiceClientDetails } from "features/new/components/invoice-client-details";
import { InvoiceDetails } from "features/new/components/invoice-details";
import { InvoiceImage } from "features/new/components/invoice-image";
import { InvoiceLineItems } from "features/new/components/invoice-line-items";
import { InvoicePricing } from "features/new/components/invoice-pricing";
import { InvoiceSellerDetails } from "features/new/components/invoice-seller-details";
import { InvoiceTerms } from "features/new/components/invoice-terms";
import { InvoiceTitle } from "features/new/components/invoice-title";
import {
  activeSettingsAtom,
  SettingsPanel
} from "features/new/components/settings-panel";
import { useAtomValue, useSetAtom } from "jotai";
import {
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  RotateCcwIcon
} from "lucide-react";
import type { MouseEvent } from "react";
import { memo, useCallback, useRef, useState } from "react";

const NAVBAR_HEIGHT = 50;
const MIN_SCALE = 0.25;
const MAX_SCALE = 2;
const DEFAULT_SCALE = 1;

export function InvoiceEditor() {
  const setActiveSettings = useSetAtom(activeSettingsAtom);
  const activeSettings = useAtomValue(activeSettingsAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: DEFAULT_SCALE
  });

  // Bind gesture handlers - with target option, events are attached automatically
  useGesture(
    {
      onWheel: ({ delta: [dx, dy], event, pinching }) => {
        // Don't handle wheel if we're pinching
        if (pinching) return;
        event.preventDefault();

        // Cmd + wheel = zoom
        if (event.metaKey) {
          const delta = -dy * 0.002;

          setTransform(t => ({
            ...t,
            scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale + delta))
          }));

          return;
        }

        // Two-finger scroll = pan
        setTransform(t => ({
          ...t,
          x: t.x - dx,
          y: t.y - dy
        }));
      },
      onPinch: ({ offset: [scale], event }) => {
        event.preventDefault();

        setTransform(t => ({
          ...t,
          scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
        }));
      }
    },
    {
      target: containerRef,
      wheel: { eventOptions: { passive: false } },
      pinch: {
        scaleBounds: { min: MIN_SCALE, max: MAX_SCALE },
        from: () => [transform.scale, 0]
      }
    }
  );

  const zoomIn = useCallback(() => {
    setTransform(t => ({
      ...t,
      scale: Math.min(MAX_SCALE, t.scale + 0.1)
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform(t => ({
      ...t,
      scale: Math.max(MIN_SCALE, t.scale - 0.1)
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: DEFAULT_SCALE });
  }, []);

  function handleSectionClick() {
    setActiveSettings("main");
  }

  function handleCanvasClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <>
      <div className="h-dvh w-full">
        <nav
          className="bg-background border-border sticky top-0 flex w-full items-center justify-between border-b px-4"
          style={{ height: `${NAVBAR_HEIGHT}px` }}
        >
          <h1 className="font-bricolage-grotesque text-brand-500 text-lg font-bold">
            billsend
          </h1>
          <DownloadInvoice />
        </nav>
        <div
          className="relative flex w-full grid-cols-[1fr_260px] flex-col bg-zinc-200 lg:grid"
          style={{ height: `calc(100dvh - ${NAVBAR_HEIGHT}px)` }}
        >
          <section
            ref={containerRef}
            className="relative h-full touch-none overflow-hidden"
            onClick={handleSectionClick}
          >
            {/* Canvas with transforms */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transformOrigin: "center center"
              }}
            >
              <div
                className="h-fit w-[210mm] border border-zinc-300 bg-white p-4 text-zinc-900 shadow-xl sm:p-8 lg:p-16 xl:p-20"
                onClick={handleCanvasClick}
              >
                <Top />
                <Mid />
                <Bottom />
              </div>
            </div>
            {/* Zoom controls */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 rounded-lg border border-zinc-300 bg-white p-1 shadow-md">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={zoomOut}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={resetZoom}
              >
                <RotateCcwIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={zoomIn}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
              <span className="px-2 text-xs text-zinc-500">
                {Math.round(transform.scale * 100)}%
              </span>
            </div>
            {activeSettings !== "main" && (
              <Button
                variant="outline"
                size="icon"
                className="fixed top-18 right-[264px] z-30 hidden size-8 w-fit min-w-8 lg:flex"
                onClick={() => setActiveSettings("main")}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            )}
          </section>
          <section className="bg-background border-border relative z-20 hidden h-full overflow-y-auto border-l pb-4 lg:block">
            <SettingsPanel />
          </section>
        </div>
      </div>
      <div className="bg-background border-border fixed bottom-0 flex h-10 w-full items-center justify-center border-t lg:hidden">
        <Drawer>
          <DrawerTrigger className="h-full w-full cursor-pointer">
            Open Settings
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle className="sr-only">Settings</DrawerTitle>
            <SettingsPanel />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

const Top = memo(function Top() {
  return (
    <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row">
      <div className="flex w-full flex-col gap-4">
        <InvoiceTitle />
        <InvoiceSellerDetails />
      </div>
      <InvoiceImage />
    </div>
  );
});

const Mid = memo(function Mid() {
  return (
    <>
      <p className="mt-6 mb-2 font-medium">Bill to:</p>
      <div className="grid gap-8 sm:grid-cols-2">
        <InvoiceClientDetails />
        <InvoiceDetails />
      </div>
    </>
  );
});

const Bottom = memo(function Bottom() {
  return (
    <>
      <div className="mt-6 max-w-full">
        <InvoiceLineItems />
        <InvoicePricing />
      </div>
      <div className="mt-6">
        <InvoiceTerms />
      </div>
    </>
  );
});
