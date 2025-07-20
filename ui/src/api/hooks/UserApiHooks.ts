import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { apiClient } from "../DevLearnApiClient";
import { LoginRequest, TokenResponse } from "../client";
import { handleApiError } from "../handleError";

export function useLogin(
  onSuccess: (data: TokenResponse) => void,
  onError: (error: string) => void
): UseMutationResult<
  TokenResponse,
  Error,
  { email: string; password: string }
> {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient.auth_Login(new LoginRequest({ email, password })),
    onSuccess: onSuccess,
    onError: (error) => onError(handleApiError(error)),
  });
}
