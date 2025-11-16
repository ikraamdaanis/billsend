import { useRouter } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "components/ui/sheet";
import { ArrowLeft, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

function EditorHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 pr-4 pl-2">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.history.back()}
        >
          <ArrowLeft className="size-4 shrink-0" />
        </Button>
        <h2 className="text-sm font-medium text-gray-900 sm:text-base">
          {title}
        </h2>
      </div>
    </div>
  );
}

function EditorSheet({ settingsContent }: { settingsContent: ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="lg:hidden">
          <Settings className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        {settingsContent}
      </SheetContent>
    </Sheet>
  );
}

export function EditorLayout({
  title,
  settingsContent,
  children
}: {
  title: string;
  settingsContent: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 pr-4 pl-2">
        <EditorHeader title={title} />
        <EditorSheet settingsContent={settingsContent} />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-r border-gray-200 bg-white lg:block">
          {settingsContent}
        </aside>
        <main className="flex flex-1 flex-col overflow-hidden bg-gray-50">
          <div className="flex flex-1 flex-col overflow-y-auto px-4 pt-4 sm:px-8 sm:pt-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
