namespace DevLearn.Helpers;

public record ValidationStateDto(bool Success, string SuccessMessage, string[] Errors);
