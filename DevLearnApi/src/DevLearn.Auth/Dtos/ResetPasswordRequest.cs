namespace DevLearn.Auth.Dtos;

public record ResetPasswordRequest(string UserId, string Token, string NewPassword);
