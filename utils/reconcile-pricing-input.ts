/**
 * Reconciles a pricing field's local input string against the store's numeric
 * value. Returns the string the field should display.
 *
 * While the user is typing, the local input already represents the store value
 * (e.g. "5." parses to 5, which equals the store), so the in-progress text is
 * preserved untouched. When the active document is replaced (loading a saved
 * invoice, applying a template, or resetting to a new invoice) the store value
 * no longer matches the stale input, so the field is refreshed to the store
 * value formatted as a plain string.
 */
export function reconcilePricingInput(
  localInput: string,
  storeValue: number
): string {
  if (Number(localInput) === storeValue) {
    return localInput;
  }

  return storeValue.toString();
}
