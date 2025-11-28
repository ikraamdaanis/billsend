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
  let message = defaultMessage;

  if (isErrorContext(error)) {
    message = error.error.message || error.error.statusText;
  }

  if (error instanceof Error) {
    message = error.message;
  }

  return message;
}
