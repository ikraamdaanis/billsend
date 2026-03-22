import { cn } from "lib/utils";
import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

export function SettingsSection({
  title,
  defaultOpen = true,
  children
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-border/60 border-b last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between py-1.5"
      >
        <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
          {title}
        </span>
        <ChevronDownIcon
          className={cn(
            "text-muted-foreground/60 size-3 transition-transform duration-150",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-150",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1.5 pb-2.5">{children}</div>
        </div>
      </div>
    </div>
  );
}
