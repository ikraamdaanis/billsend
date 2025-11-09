import { useEffect } from "react";

export function useDocumentTitle(title: string | (() => string)) {
  useEffect(() => {
    const previousTitle = document.title;
    const newTitle = typeof title === "function" ? title() : title;

    if (newTitle) document.title = newTitle;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
