import { SidebarTrigger } from "components/ui/sidebar";
import type { ReactNode } from "react";

export function DashboardHeader({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 h-10 border-b border-gray-200 bg-white/70 pr-4 pl-2 backdrop-blur-sm">
      <nav className="flex h-full items-center">
        <SidebarTrigger className="size-8 lg:hidden" />
        <div className="flex flex-1 items-center gap-4 pl-3">{children}</div>
      </nav>
    </header>
  );
}
