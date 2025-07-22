import { ApiException } from "./client";
import { tokenManager } from "./tokenManager";

interface ErrorHandlerOptions<T> {
  retryOriginalRequest: () => Promise<T>;
  refreshAccessToken: () => Promise<boolean>;
  onUnauthorized: () => void;
}

export async function handleApiErrorWithRetry<T>(
  error: unknown,
  options: ErrorHandlerOptions<T>
): Promise<{ success: boolean; errorMessage: string; response: T | null }> {
  if (ApiException.isApiException(error)) {
    return await handleApiExceptionWithRetry(error, options);
  }

  const errorMessage = handleOtherError(error);
  return {
    success: false,
    errorMessage,
    response: null,
  };
}

async function handleApiExceptionWithRetry<T>(
  error: ApiException,
  options: ErrorHandlerOptions<T>
): Promise<{ success: boolean; errorMessage: string; response: T | null }> {
  // Handle 401 Unauthorized with token refresh
  if (error.status === 401) {
    return await refreshAndRetry(options);
  }

  // Handle other HTTP errors
  return {
    success: false,
    errorMessage: getErrorMessage(error),
    response: null,
  };
}

async function refreshAndRetry<T>(
  options: ErrorHandlerOptions<T>
): Promise<{ success: boolean; errorMessage: string; response: T | null }> {
  const { retryOriginalRequest, refreshAccessToken, onUnauthorized } = options;

  let errorMessage = "Dostęp jedynie po zalogowaniu.";
  try {
    // Token expired, attempting refresh
    const storedTokens = tokenManager.getStoredTokens();
    if (!storedTokens) {
      return unauthorized(onUnauthorized, errorMessage);
    }

    const success = await refreshAccessToken();

    // Retry the original request
    if (success) {
      try {
        const response = await retryOriginalRequest();
        return { success: true, errorMessage: "", response };
      } catch {
        return unauthorized(
          onUnauthorized,
          "Sesja wygasła. Zaloguj się ponownie."
        );
      }
    } else {
      return unauthorized(
        onUnauthorized,
        "Sesja wygasła. Zaloguj się ponownie."
      );
    }
  } catch (refreshError) {
    return unauthorized(onUnauthorized, errorMessage);
  }
}

const unauthorized = (onUnauthorized: () => void, errorMessage: string) => {
  onUnauthorized();
  return {
    success: false,
    errorMessage,
    response: null,
  };
};

const getErrorMessage = (originalError: ApiException): string => {
  const parsedError = tryParseResponse(originalError);

  // Check for specific error types
  if (parsedError?.error) {
    return parsedError.error;
  }

  if (parsedError?.message) {
    return parsedError.message;
  }

  if (parsedError?.errors && Array.isArray(parsedError.errors)) {
    return parsedError.errors.join(", ");
  }

  if (parsedError?.title) {
    return parsedError.title;
  }

  // Handle specific HTTP status codes
  switch (originalError.status) {
    case 400:
      return "Nieprawidłowe żądanie";
    case 401:
      return "Brak autoryzacji";
    case 403:
      return "Brak uprawnień";
    case 404:
      return "Nie znaleziono zasobu";
    case 409:
      return "Konflikt danych";
    case 422:
      return "Nieprawidłowe dane";
    case 429:
      return "Zbyt wiele żądań. Spróbuj ponownie później";
    case 500:
      return "Błąd serwera";
    case 502:
      return "Błąd bramy";
    case 503:
      return "Serwis niedostępny";
    case 504:
      return "Przekroczenie czasu odpowiedzi";
    default:
      return originalError.message || "Wystąpił nieoczekiwany błąd";
  }
};

interface ApiErrorResponse {
  error?: string;
  message?: string;
  errors?: string[];
  title?: string;
}

const tryParseResponse = (error: ApiException): ApiErrorResponse => {
  try {
    if (!error.response) {
      return { message: error.message };
    }

    const parsed = JSON.parse(error.response);

    // Handle different response formats
    if (typeof parsed === "string") {
      return { message: parsed };
    }

    if (typeof parsed === "object") {
      return {
        error: parsed.error,
        message: parsed.message,
        errors: parsed.errors,
        title: parsed.title,
      };
    }

    return { message: error.message };
  } catch {
    return { message: error.message };
  }
};

function handleOtherError(error: unknown): string {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "Błąd połączenia z serwerem. Sprawdź połączenie internetowe.";
  }

  if (error instanceof Error && error.message.includes("timeout")) {
    return "Przekroczenie czasu odpowiedzi. Spróbuj ponownie.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Wystąpił nieoczekiwany błąd";
}
