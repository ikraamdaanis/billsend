/**
 * Takes a string value and returns a formatted percentage string.
 * Only allows integer values. Returns a valid integer string 0-100
 * without leading zeros. Only allows 3 digits if the value is 100.
 */
export function handlePercentageInput(value: string) {
  // Remove percentage symbols, commas, and all
  // non-numeric characters including decimals
  let numericValue = value.replace(/[^0-9]/g, "");

  // Handle leading zeros and edge cases
  if (!numericValue || numericValue === "00") {
    return "0";
  }

  // Remove leading zeros for numbers like 0123
  if (numericValue.startsWith("0") && numericValue.length > 1) {
    numericValue = numericValue.replace(/^0+/, "");
  }

  // Handle maximum of 100 and limit characters
  if (numericValue.length > 2) {
    // Check if it's exactly "100"
    if (numericValue.startsWith("100")) {
      return "100";
    }

    // If the first two digits make a number <= 100, keep only the first two digits
    const firstTwoDigits = numericValue.substring(0, 2);
    const twoDigitValue = parseInt(firstTwoDigits, 10);

    if (twoDigitValue <= 100) {
      return firstTwoDigits;
    } else {
      return "100";
    }
  }

  return numericValue;
}
