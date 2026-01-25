import type { TabSelectEventType } from "consts/events";

export function setActiveTab({
  eventType,
  tab,
  option
}: {
  eventType: TabSelectEventType;
  tab: string;
  option?: string;
}) {
  const event = new CustomEvent(eventType, {
    detail: { tab, option }
  });

  window.dispatchEvent(event);
}
