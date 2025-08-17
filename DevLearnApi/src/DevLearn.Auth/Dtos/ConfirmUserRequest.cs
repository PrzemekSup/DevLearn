namespace DevLearn.Auth.Dtos;

public record ConfirmEmailRequest(string UserId, string Token);
