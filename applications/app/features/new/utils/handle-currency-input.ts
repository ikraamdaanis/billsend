/**
 * Takes a string value and returns a formatted currency string.
 * Handles inputs like $124.34, 002343, etc.
 * Returns a valid number string 0 or greater without leading zeros.
 */
export function handleCurrencyInput(value: string) {
  // Remove currency symbols, commas, and other non-numeric characters
  let numericValue = value.replace(/[^0-9.]/g, "");

  // Prevent multiple decimal points
  const decimalCount = numericValue.split(".").length - 1;

  if (decimalCount > 1) {
    numericValue = numericValue.replace(/\./g, (match, offset) =>
      offset === numericValue.indexOf(".") ? match : ""
    );
  }

  // Handle decimal places
  if (numericValue.includes(".")) {
    const [whole, decimal] = numericValue.split(".");
    // Limit decimal places to 2
    numericValue = `${whole}.${decimal.slice(0, 2)}`;
  }

  // Handle leading zeros and edge cases
  if (!numericValue || numericValue === "." || numericValue === "00") {
    return "0";
  }

  // Remove leading zeros for whole numbers
  if (numericValue.startsWith("0") && numericValue.length > 1) {
    if (numericValue[1] === ".") {
      // Keep the zero for decimal numbers less than 1 (e.g., 0.42)
      return numericValue;
    } else {
      // Remove leading zeros for numbers like 0123
      return numericValue.replace(/^0+/, "");
    }
  }

  return numericValue;
}
