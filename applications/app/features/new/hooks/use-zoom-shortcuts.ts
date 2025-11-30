import { useEffect } from "react";

export function useZoomShortcuts({
  locked,
  onZoomIn,
  onZoomOut,
  onReset
}: {
  locked: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  useEffect(() => {
    function handleZoomShortcuts(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey)) return;

      event.preventDefault();

      if (event.key === "=" || event.key === "+") {
        if (!locked) onZoomIn();
      } else if (event.key === "-") {
        if (!locked) onZoomOut();
      } else if (event.key === "0") {
        onReset();
      }
    }

    window.addEventListener("keydown", handleZoomShortcuts, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleZoomShortcuts, {
        capture: true
      });
    };
  }, [locked, onZoomIn, onZoomOut, onReset]);
}
