import type { RefObject } from "react";

export function handleActiveTab({
  tabsRef,
  value
}: {
  tabsRef?: RefObject<HTMLDivElement | null>;
  value: string;
}) {
  setTimeout(() => {
    const tabsContainer = tabsRef?.current;

    if (!tabsContainer) return;

    const selectedTab = tabsContainer.querySelector(`[data-value="${value}"]`);

    if (selectedTab) {
      const containerRect = tabsContainer.getBoundingClientRect();
      const tabRect = selectedTab.getBoundingClientRect();

      // Calculate the center position of the tab
      const tabCenter = tabRect.left + tabRect.width / 2;

      // Calculate the center position of the container
      const containerCenter = containerRect.left + containerRect.width / 2;

      // Calculate how much to scroll to center the tab
      const scrollAmount = tabCenter - containerCenter;

      // Add padding to ensure the tab is fully visible with space on both sides
      const scrollPadding = 24; // 24px padding

      // Calculate the new scroll position
      const newScrollLeft = tabsContainer.scrollLeft + scrollAmount;

      // Apply the scroll with padding
      tabsContainer.scrollTo({
        left: Math.max(0, newScrollLeft - scrollPadding),
        behavior: "smooth"
      });
    }
  }, 10);
}
