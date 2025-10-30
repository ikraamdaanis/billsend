export function getErrorMessage(
  error: unknown,
  defaultMessage: string = "An unexpected error occurred"
) {
  if (error instanceof Error) return error.message;

  return defaultMessage;
}
