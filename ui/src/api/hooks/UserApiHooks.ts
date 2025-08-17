import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  TokenResponse,
  LoginRequest,
  ValidationStateDto,
  RegisterRequest,
  ConfirmEmailRequest,
  ResendConfirmationRequest,
} from "../client";
import { useApiClient } from "../../contexts/ApiClientContext";

// Custom hook for testing authentication
export const useTest = (
  onSuccess: (data: ValidationStateDto) => void,
  onError: (error: Error) => void
): UseMutationResult<ValidationStateDto, Error, void> => {
  const { apiClient } = useApiClient();
  return useMutation({
    mutationFn: () => apiClient.test_Index(),
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error) => {
      onError(error);
    },
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (handled by automatic token refresh)
      if (error instanceof Error && error.message.includes("401")) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export function useLogin(
  onSuccess: (data: TokenResponse) => void,
  onError: (error: string) => void
): UseMutationResult<
  TokenResponse,
  Error,
  { email: string; password: string }
> {
  const { apiClient } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient.auth_Login(new LoginRequest({ email, password })),
    onSuccess: (data: TokenResponse) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["test-auth"] });
      onSuccess(data);
    },
    onError: (error) => onError(error.message),
  });
}

// Logout mutation
export const useLogout = (
  onSuccess: (result: ValidationStateDto) => void,
  onError: (error: string) => void
): UseMutationResult<ValidationStateDto, Error, null> => {
  const { apiClient } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.auth_Logout(),
    onSuccess: (result: ValidationStateDto) => {
      queryClient.clear();
      onSuccess(result);
    },
    onError: (error: Error) => {
      queryClient.clear();
      onError(error.message);
    },
  });
};

export function useRegister(
  onSuccess: (data: ValidationStateDto) => void,
  onError: (error: string) => void
): UseMutationResult<
  ValidationStateDto,
  Error,
  { name: string; email: string; password: string }
> {
  const { apiClient } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) =>
      apiClient.auth_RegisterUser(
        new RegisterRequest({ userName: name, email, password })
      ),
    onSuccess: (data: ValidationStateDto) => {
      queryClient.clear();
      onSuccess(data);
    },
    onError: (error: Error) => {
      queryClient.clear();
      onError(error.message);
    },
  });
}

export function useConfirmEmail(
  onSuccess: (data: ValidationStateDto) => void,
  onError: (error: string) => void
): UseMutationResult<
  ValidationStateDto,
  Error,
  { userId: string; token: string }
> {
  const { apiClient } = useApiClient();

  return useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) =>
      apiClient.auth_ConfirmEmail(new ConfirmEmailRequest({ userId, token })),
    onSuccess: (data: ValidationStateDto) => {
      onSuccess(data);
    },
    onError: (error: Error) => {
      onError(error.message);
    },
  });
}

export function useResendLink(
  onSuccess: (data: ValidationStateDto) => void,
  onError: (error: string) => void
): UseMutationResult<ValidationStateDto, Error, { email: string }> {
  const { apiClient } = useApiClient();

  return useMutation({
    mutationFn: ({ email }: { email: string }) =>
      apiClient.auth_ResendConfirmationEmail(
        new ResendConfirmationRequest({ email })
      ),
    onSuccess: (data: ValidationStateDto) => {
      onSuccess(data);
    },
    onError: (error: Error) => {
      onError(error.message);
    },
  });
}
