import type { ComponentProps } from "react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useIsPreview } from "~/hooks/use-shown-sections";
import { cn } from "~/lib/utils";
import { useTheme } from "~/stores/invoice-selectors";

export function InvoiceTextArea({
  className,
  onChange,
  ...props
}: Omit<ComponentProps<"textarea">, "onChange" | "ref"> & {
  onChange?: (value: string) => void;
}) {
  // Preview reads like the PDF: no placeholders, no editing highlight.
  const isPreview = useIsPreview();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Read so a new font or text size re-renders the field and refits it.
  useTheme();

  useLayoutEffect(() => {
    if (textareaRef.current) fitToContent(textareaRef.current);
  });

  // A web font arriving after the first paint changes the line height.
  useEffect(() => {
    function refit() {
      if (textareaRef.current) fitToContent(textareaRef.current);
    }

    document.fonts.addEventListener("loadingdone", refit);

    return () => document.fonts.removeEventListener("loadingdone", refit);
  }, []);

  return (
    <textarea
      {...props}
      ref={textareaRef}
      onFocus={event => {
        fitToContent(event.currentTarget);
        props.onFocus?.(event);
      }}
      onBlur={event => {
        fitToContent(event.currentTarget);
        props.onBlur?.(event);
      }}
      readOnly={isPreview || props.readOnly}
      placeholder={isPreview ? undefined : props.placeholder}
      value={props.value}
      onChange={({ target: { value } }) => {
        onChange?.(value);
      }}
      className={cn(
        "rounded-surface text-paper-foreground placeholder:text-paper-muted-foreground hover:bg-brand-50 focus:border-brand-500 focus:bg-brand-50 relative w-full cursor-text resize-none overflow-hidden border border-transparent bg-transparent transition-[background-color,border-color] outline-none focus:z-20 focus:p-2 focus:outline-none",
        className,
        isPreview &&
          "pointer-events-none min-h-0 hover:bg-transparent focus:border-transparent focus:bg-transparent focus:p-0"
      )}
      rows={1}
    />
  );
}

// Grows the field to show every line, padding and border included. The fields
// also ask for `field-sizing: content`, but Safari leaves out the border and
// the padding added on focus, which clips the last line. The lines are
// measured with the padding taken off, since Safari's scrollHeight also skips
// the bottom padding.
function fitToContent(textarea: HTMLTextAreaElement) {
  const styles = getComputedStyle(textarea);
  const frameY =
    parseFloat(styles.borderTopWidth) +
    parseFloat(styles.borderBottomWidth) +
    parseFloat(styles.paddingTop) +
    parseFloat(styles.paddingBottom);

  textarea.style.height = "auto";
  textarea.style.paddingBlock = "0px";
  const linesHeight = textarea.scrollHeight;

  textarea.style.paddingBlock = "";
  textarea.style.height = `${linesHeight + frameY}px`;
}
