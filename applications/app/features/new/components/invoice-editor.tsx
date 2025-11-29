"use client";

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
import { ArrowLeftIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { memo } from "react";

const NAVBAR_HEIGHT = 56;

export function InvoiceEditor() {
  const setActiveSettings = useSetAtom(activeSettingsAtom);
  const activeSettings = useAtomValue(activeSettingsAtom);

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
            className="relative h-full overflow-y-auto p-4"
            onClick={handleSectionClick}
          >
            <div
              className="mx-auto h-fit w-full max-w-[210mm] border border-zinc-300 bg-white p-4 text-zinc-900 shadow-md sm:p-8 lg:p-16 xl:p-20"
              onClick={handleCanvasClick}
            >
              <Top />
              <Mid />
              <Bottom />
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
          <section className="bg-background relative z-20 hidden h-full overflow-y-auto pb-4 lg:block">
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
