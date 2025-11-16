import type { TemplatePaths, TextConfig } from "features/invoices/state";
import {
  createTypedUpdatePath,
  designStateAtom,
  getTextStyles,
  updateDesignStateAtom,
  updatePathAtom
} from "features/invoices/state";
import type { Atom } from "jotai";
import { useAtomValue, useSetAtom } from "jotai";
import { cn } from "lib/utils";
import { useEffect, useRef } from "react";

export function DesignItem({
  path,
  value: valueAtom
}: {
  path: TemplatePaths;
  value: Atom<TextConfig>;
}) {
  const updatePath = createTypedUpdatePath(useSetAtom(updatePathAtom));

  const currentSelectedPath = useAtomValue(designStateAtom);
  const setCurrentSelectedPath = useSetAtom(updateDesignStateAtom);

  const value = useAtomValue(valueAtom);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const isEditingRef = useRef(false);

  useEffect(() => {
    if (!isEditingRef.current && spanRef.current) {
      spanRef.current.textContent = value.value;
    }
  }, [value.value]);

  return (
    <div
      onClick={() => setCurrentSelectedPath({ path })}
      className={cn(
        "inline-flex w-fit rounded-xs border border-transparent transition",
        currentSelectedPath.currentSelectedPath === path &&
          "border border-blue-300 bg-blue-50"
      )}
      data-design-item
      data-design-item-path={path}
      ref={ref}
    >
      <span
        ref={spanRef}
        contentEditable
        suppressContentEditableWarning
        className={cn(
          "h-full w-full border-0 p-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none",
          currentSelectedPath.currentSelectedPath === path && "p-2"
        )}
        onFocus={() => {
          isEditingRef.current = true;
        }}
        onBlur={event => {
          isEditingRef.current = false;

          const textContent = event.currentTarget.textContent || "";

          if (textContent !== value.value) updatePath(path, textContent);
        }}
        style={{ ...getTextStyles(value) }}
        suppressHydrationWarning
      >
        {value.value}
      </span>
    </div>
  );
}
