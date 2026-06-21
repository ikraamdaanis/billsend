import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

/**
 * Lets the user type a free-form currency symbol (up to 4 characters) for the
 * current invoice when none of the preset symbols fit.
 */
export function CustomCurrencyDialog({
  open,
  onOpenChange,
  currentSymbol,
  onSubmit
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSymbol: string;
  onSubmit: (symbol: string) => void;
}) {
  const [value, setValue] = useState(currentSymbol);

  useEffect(() => {
    if (open) setValue(currentSymbol);
  }, [open, currentSymbol]);

  const trimmed = value.trim();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!trimmed) return;

    onSubmit(trimmed);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-sm">
        <DialogHeader>
          <DialogTitle>Custom currency symbol</DialogTitle>
          <DialogDescription>
            Enter a symbol to use on this invoice, up to 4 characters.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-4 pb-4">
            <Input
              name="currency-symbol"
              aria-label="Currency symbol"
              value={value}
              onChange={event =>
                setValue(event.target.value.replace(/\p{N}/gu, "").slice(0, 4))
              }
              maxLength={4}
              autoFocus
              autoComplete="off"
              placeholder="e.g. ₿"
              className="max-sm:text-base"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!trimmed}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
