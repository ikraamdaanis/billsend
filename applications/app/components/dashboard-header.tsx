import { SidebarTrigger } from "components/ui/sidebar";
import { cn } from "lib/utils";
import type { ComponentProps } from "react";

export function DashboardHeader({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <header className="border-border sticky top-0 z-10 border-b bg-white/70 py-4 pr-4 pl-2 backdrop-blur-sm">
      <nav className="flex h-full items-center">
        <SidebarTrigger className="size-8 lg:hidden" />
        <div
          className={cn("flex flex-1 items-center gap-4 pl-3", className)}
          {...props}
        >
          {children}
        </div>
      </nav>
    </header>
  );
}
