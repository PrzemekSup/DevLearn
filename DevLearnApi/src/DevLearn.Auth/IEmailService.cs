namespace DevLearn.Auth;

public interface IEmailService
{
    Task SendErrorAsync(string[] errorMessages);
    Task SendContactMessageAsync(string subject, string content);
    Task SendConfirmationEmailAsync(string userId, string email, string token);
    Task SendForgotPasswordLinkAsync(string userId, string email, string forgotPasswordKey);
}
