class TokenManager {
  private static instance: TokenManager;

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  // Store tokens in localStorage
  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  // Get stored tokens
  getStoredTokens(): {
    accessToken: string | null;
    refreshToken: string | null;
  } {
    return {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  }

  // Clear stored tokens
  clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  // Check if token is expired (you can implement your own logic here)
  isTokenExpired(): boolean {
    // This is a simple implementation - you might want to decode the JWT
    // and check the expiration time properly
    const { accessToken } = this.getStoredTokens();
    if (!accessToken) return true;

    // For now, we'll assume tokens are valid for 1 hour
    // In a real implementation, you'd decode the JWT and check exp claim
    return false;
  }
}

export const tokenManager = TokenManager.getInstance();
