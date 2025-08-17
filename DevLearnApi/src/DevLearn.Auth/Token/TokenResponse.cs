namespace DevLearn.Auth.Token;

public record TokenResponse(string Id, string Email, string UserName, string AccessToken, string RefreshToken);
