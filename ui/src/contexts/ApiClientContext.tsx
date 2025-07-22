import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { AuthorizedApiClient, initializeApiClient } from "../api/apiclient";
import { useAuth } from "./AuthContext";
import { RefreshRequest, TokenResponse } from "../api/client";
import { tokenManager } from "../api/tokenManager";

interface ApiClientContextType {
  apiClient: AuthorizedApiClient;
  setApiAccessToken: (accessToken: string, refreshToken: string) => void;
  refreshAccessToken: () => Promise<boolean>;
  unauthorize: () => void;
}

const ApiClientContext = createContext<ApiClientContextType | undefined>(
  undefined
);

export const useApiClient = () => {
  const context = useContext(ApiClientContext);
  if (context === undefined) {
    throw new Error("useApiClient must be used within an ApiClientProvider");
  }
  return context;
};

interface ApiClientProviderProps {
  children: React.ReactNode;
}

export const ApiClientProvider = ({ children }: ApiClientProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshPromise, setRefreshPromise] =
    useState<Promise<TokenResponse> | null>(null);
  const { removeLoggedUser, initialize: authInitialize } = useAuth();

  const setApiAccessToken = (accessToken: string, refreshToken: string) => {
    if (!apiClient) {
      throw new Error("ApiClient not initialized");
    }

    apiClient.setAccessToken(accessToken);
    tokenManager.storeTokens(accessToken, refreshToken);
  };

  const onUnauthorized = () => {
    if (!apiClient) {
      throw new Error("ApiClient not initialized");
    }

    removeLoggedUser();
    apiClient.setAccessToken(null);
    tokenManager.clearTokens();
  };

  const refreshPromiseRequest = async (
    refreshToken: string
  ): Promise<TokenResponse> => {
    if (!apiClient) {
      throw new Error("ApiClient not initialized");
    }

    if (refreshPromise) {
      return refreshPromise;
    }

    const newRefreshPromise = apiClient.auth_Refresh(
      new RefreshRequest({
        refreshToken,
      })
    );

    setRefreshPromise(newRefreshPromise);
    return newRefreshPromise;
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    const refreshToken = tokenManager.getStoredTokens().refreshToken;
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await refreshPromiseRequest(refreshToken);
      if (response.accessToken && response.refreshToken) {
        setApiAccessToken(response.accessToken, response.refreshToken);
        return true;
      } else {
        onUnauthorized();
        return false;
      }
    } finally {
      setRefreshPromise(null);
    }
  };

  const apiClient = useMemo(
    () => initializeApiClient(onUnauthorized, refreshAccessToken),
    []
  );

  useEffect(() => {
    const isInitialized = tokenManager.getStoredTokens();
    if (!isInitialized.accessToken || !isInitialized.refreshToken) {
      onUnauthorized();
      setIsLoading(false);
      return;
    }

    const isUserInitialized = authInitialize();
    if (!isUserInitialized) {
      onUnauthorized();
      setIsLoading(false);
      return;
    }

    setApiAccessToken(isInitialized.accessToken, isInitialized.refreshToken);
    setIsLoading(false);
  }, []);

  if (!apiClient || isLoading) {
    return <div>Wczytywanie...</div>;
  }

  return (
    <ApiClientContext.Provider
      value={{
        apiClient,
        setApiAccessToken,
        refreshAccessToken,
        unauthorize: onUnauthorized,
      }}
    >
      {children}
    </ApiClientContext.Provider>
  );
};
