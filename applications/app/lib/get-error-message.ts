import type { ErrorContext } from "types";

function isErrorContext(error: unknown): error is ErrorContext {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    "request" in error &&
    "error" in error &&
    error.response instanceof Response
  );
}

export function getErrorMessage(
  error: unknown,
  defaultMessage: string = "An unexpected error occurred"
) {
  if (error instanceof Error) return error.message;

  if (isErrorContext(error)) {
    return error.error.message || defaultMessage;
  }

  return defaultMessage;
}
