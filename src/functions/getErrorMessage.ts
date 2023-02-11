export function getErrorMessage(error: any, fallbackMessage: string): string {
  if (typeof error === "string") {
    return error;
  }
  if (
    typeof error === "object" &&
    error.hasOwnProperty("message") &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  if (
    typeof error === "object" &&
    error.hasOwnProperty("error") &&
    typeof error.error === "string"
  ) {
    return error.error;
  }

  return fallbackMessage;
}
