import { useEffect } from "react";

export function useTabSelectEvent(
  eventName: string,
  callback: (tab: string, option?: string) => void
) {
  useEffect(() => {
    function handleEvent(event: Event) {
      const customEvent = event as CustomEvent<{
        tab: string;
        option?: string;
      }>;

      if (customEvent.detail.tab) {
        callback(customEvent.detail.tab, customEvent.detail.option);
      }
    }

    window.addEventListener(eventName, handleEvent);

    return () => {
      window.removeEventListener(eventName, handleEvent);
    };
  }, [eventName, callback]);
}
