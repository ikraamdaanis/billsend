import { useSidebar } from "components/ui/sidebar";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";

export function SidebarIcon() {
  const { openMobile } = useSidebar();

  if (openMobile) return <GoSidebarCollapse />;

  return <GoSidebarExpand />;
}
