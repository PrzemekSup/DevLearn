namespace DevLearn.Auth.Token;

public record TokenResponse(string Id, string UserName, string AccessToken, string RefreshToken);
