export function setActiveTab({
  eventType,
  tab,
  option
}: {
  eventType:
    | "select-details-tab"
    | "select-line-items-tab"
    | "select-totals-tab";
  tab: string;
  option?: string;
}) {
  const event = new CustomEvent(eventType, {
    detail: { tab, option }
  });

  window.dispatchEvent(event);
}
