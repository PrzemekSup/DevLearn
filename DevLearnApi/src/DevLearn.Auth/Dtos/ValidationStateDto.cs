namespace DevLearn.Auth.Dtos;

public record ValidationStateDto(bool Success, string SuccessMessage, string[] Errors);
