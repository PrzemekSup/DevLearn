# API Client Authorization Guide

This guide explains how to use the authorized API client with .NET Core 8 backend.

## Overview

The API client has been extended to automatically include authorization headers for authenticated requests. The system includes:

1. **AuthorizedApiClient**: Extended version of the NSwag-generated client
2. **ApiClientErrorWrapper**: Wrapper for error handling. Uses **handleApiErrorWithRetry** within handleError.ts
3. **TokenManager**: Singleton class for token store
4. **AuthContext**: React context for authentication state
5. **ApiClientContext**: React context for singleton authorized API Client
6. **Custom Hooks**: React Query hooks for API operations

## Setup

### 1. Environment Variables

Make sure you have the API base URL configured in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 2. Initialize Authorized API Client

The Authorized API Client is automatically initialized in the `ApiClientProvider`.

`ApiClientProvider` will also:

- Check for existing tokens in localStorage
- Set the access token for API calls
- Define function for token refresh

## Usage Examples

### Basic API Calls

```typescript
import { useApiClient } from "../../contexts/ApiClientContext";
const { apiClient } = useApiClient();

// All API calls will automatically include the Authorization header
// if a token is available

// Example: Test authentication
const testAuth = async () => {
  try {
    const response = await apiClient.test_Index();
    console.log("User is authenticated:", response.success);
  } catch (error) {
    console.error("Authentication failed:", error);
  }
};

// Example: Get user data (protected endpoint)
const getUserData = async () => {
  try {
    // This will automatically include the Bearer token
    const response = await apiClient.someProtectedEndpoint();
    return response;
  } catch (error) {
    console.error("Failed to get user data:", error);
  }
};
```

### Define React Query Hooks

```typescript
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
};
```

### Using React Query Hooks

```typescript
import { useLogin } from "../../api/hooks/UserApiHooks";

const loginMutation = useLogin(
  (data) => {
    setLoggedUser(data);
    setApiAccessToken(data.accessToken!, data.refreshToken!);
    navigate("/dashboard");
  },
  (error) => {
    setError(error);
  }
);

// action
loginMutation.mutate({ email, password });
```

### Protected Route Example

```typescript
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

## How It Works

### 1. Authorization Header Injection

The `AuthorizedApiClient` extends the NSwag-generated `ApiClient` and:

- Stores the access token internally
- Automatically adds `Authorization: Bearer <token>` header to all requests
- Handles token management through the `TokenManager`
- Provider handles token refresh when needed

### 2. Token Management

The `TokenManager` provides:

- **Token Storage**: Secure storage in localStorage
- **Token Validation**: Checks token expiration
- **Singleton Pattern**: Ensures consistent token state across the app

### 3. React Integration

The `AuthContext` integrates with:

- **Token Manager**: For token operations
- **React Query**: For API state management
- **Local Storage**: For persistence across sessions

## Error Handling

The API client now includes **automatic error handling** with the following features:

### 🔄 Automatic Token Refresh

When a request returns 401, the system automatically:

1. Attempts to refresh the access token
2. Retries the original request with the new token
3. Queues concurrent requests during refresh
4. Redirects to login if refresh fails

### 📊 React Query Integration

The hooks automatically handle errors and retries:

```typescript
import {
  useAuthenticatedQuery,
  useAuthenticatedMutation,
} from "./api/hooks/UserApiHooks";

// Query with automatic error handling
const { data, isLoading, error } = useAuthenticatedQuery(
  ["user-data"],
  () => apiClient.getUserData(),
  {
    retry: 3, // Retry up to 3 times
    staleTime: 5 * 60 * 1000, // 5 minutes
  }
);

// Mutation with automatic error handling
const mutation = useAuthenticatedMutation(
  (data) => apiClient.updateUser(data),
  {
    onSuccess: (data) => {
      console.log("Success:", data);
    },
    onError: (error) => {
      console.error("Error:", error.message);
    },
  }
);
```

### 🚨 Error Types Handled

- **401 Unauthorized**: Automatic token refresh
- **Network Errors**: Connection and timeout issues
- **Server Errors**: 5xx status codes
- **Client Errors**: 4xx status codes with detailed messages
- **Validation Errors**: Form validation and business logic errors

## Best Practices

1. **Always use the hooks**: Use the provided React Query hooks for better error handling and caching
2. **Handle loading states**: Check `isLoading` and `isPending` states in your components
3. **Implement error boundaries**: Wrap your app with error boundaries for API errors
4. **Use TypeScript**: Leverage the generated types for better development experience
5. **Test authentication**: Use the `useTest` hook to verify authentication status

## Troubleshooting

### Common Issues

1. **Token not being sent**: Ensure `tokenManager.initialize()` is called on app startup
2. **CORS errors**: Make sure your .NET Core backend allows requests from your frontend domain
3. **401 errors**: Check if the token is valid and not expired
4. **Network errors**: Verify the API base URL is correct

### Debug Mode

Enable debug logging by adding this to your browser console:

```typescript
// Enable debug mode for token manager
localStorage.setItem("debug", "true");
```

This will log token operations to the console for debugging purposes.
