import { ApiClient } from "./client";
import { handleApiErrorWithRetry } from "./handleError";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// Extend the ApiClient to add authorization support
export class AuthorizedApiClient extends ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  protected getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }
    return headers;
  }

  constructor(baseUrl: string) {
    super(baseUrl, {
      fetch: async (
        url: RequestInfo,
        init?: RequestInit
      ): Promise<Response> => {
        const authHeaders = this.getAuthHeaders();

        const options: RequestInit = {
          ...init,
          headers: {
            ...authHeaders,
            ...init?.headers,
          },
        };

        return await window.fetch(url, options);
      },
    });
  }
}

// Wrapper method for API calls with automatic error handling
export class ApiClientErrorWrapper {
  private onUnauthorized: () => void;
  private refreshAccessToken: () => Promise<boolean>;

  constructor(
    onUnauthorized: () => void,
    refreshAccessToken: () => Promise<boolean>
  ) {
    this.onUnauthorized = onUnauthorized;
    this.refreshAccessToken = refreshAccessToken;
  }

  async action<T>(apiCall: () => Promise<T>): Promise<T | DevErrorMessage> {
    return this.callWithRetryAndErrorHandling<T>(apiCall);
  }

  // Wrapper method for API calls with automatic error handling
  async callWithRetryAndErrorHandling<T>(
    apiCall: () => Promise<T>
  ): Promise<T | DevErrorMessage> {
    try {
      return await apiCall();
    } catch (error) {
      const { success, errorMessage, response } =
        await handleApiErrorWithRetry<T>(error, {
          retryOriginalRequest: apiCall,
          refreshAccessToken: this.refreshAccessToken,
          onUnauthorized: () => {
            this.onUnauthorized();

            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }
          },
        });

      if (success && response) {
        return response;
      }

      return new DevErrorMessage(errorMessage);
    }
  }
}

export function createApiClientWithErrorHandling(
  apiClient: AuthorizedApiClient,
  errorWrapper: ApiClientErrorWrapper
): AuthorizedApiClient {
  return new Proxy(apiClient, {
    get(target, prop) {
      // exclude setAccessToken action from error handling
      if (prop === "setAccessToken") {
        return target[prop as keyof typeof target];
      }

      const orig = target[prop as keyof ApiClient];
      if (typeof orig === "function") {
        return async (...args: any[]) => {
          const result = await errorWrapper.action(() =>
            (orig as Function).call(target, ...args)
          );

          if (result instanceof DevErrorMessage) {
            alert(result.message);
          }
          return result;
        };
      }
      return orig;
    },
  });
}

export const initializeApiClient = (
  onUnauthorized: () => void,
  refreshAccessToken: () => Promise<boolean>
): AuthorizedApiClient => {
  const apiClient = new AuthorizedApiClient(API_BASE_URL);
  const errorWrapper = new ApiClientErrorWrapper(
    onUnauthorized,
    refreshAccessToken
  );

  return createApiClientWithErrorHandling(apiClient, errorWrapper);
};

class DevErrorMessage {
  constructor(public message: string) {}
}
