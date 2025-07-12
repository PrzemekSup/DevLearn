namespace DevLearn.Auth;

public interface IEmailService
{
    Task SendErrorAsync(string[] errorMessages);
    Task SendContactMessageAsync(string subject, string content);
    Task SendConfirmationEmailAsync(string email, string userId, string token);
    Task SendForgotPasswordLinkAsync(string userId, string email, string forgotPasswordKey);
}
