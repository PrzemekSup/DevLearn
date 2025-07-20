import { ApiException } from "./client";

export function handleApiError(error: unknown): string {
  if (ApiException.isApiException(error)) {
    return getErrorMessage(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Wystąpił nieoczekiwany błąd";
}

const getErrorMessage = (error: ApiException): string => {
  const parsedError = tryParseResponse(error);

  if (parsedError?.error) {
    return parsedError.error;
  }
  if (parsedError?.message) {
    return parsedError.message;
  }
  if (parsedError?.errors && Array.isArray(parsedError.errors)) {
    return parsedError.errors.join(", ");
  }
  return error.message || "Wystąpił nieoczekiwany błąd";
};

const tryParseResponse = (error: ApiException): any => {
  try {
    return JSON.parse(error.response);
  } catch {
    return error.message;
  }
};
