using DevLearn.Auth;
using Microsoft.Extensions.Configuration;

namespace DevLearn.Infrastructure.Email;

public class EmailService(EmailContext emailContext, IConfiguration configuration) : IEmailService
{
    public Task SendErrorAsync(string[] errorMessages)
    {
        var errorHtml = string.Join("<br />", errorMessages);
        var messageHtml = $"<p><b>Wystąpiły poniższe błędy:</b>{errorHtml}</p>";
        var to = new[] { "przemyslaw.supel@gmail.com" };
        return emailContext.SendHtml(to, "FootRank errors", messageHtml);
    }

    public Task SendContactMessageAsync(string subject, string content)
    {
        var subjectHtml = $"<p><b>Temat:</b> {subject}</p>";
        var contentHtml = $"<p><b>Wiadomość:</b> {content}</p>";
        var to = new[] { "przemyslaw.supel@gmail.com" };
        return emailContext.SendHtml(to, "FootRank wiadomość od odwiedzającego", $"{subjectHtml}{contentHtml}");
    }

    public Task SendConfirmationEmailAsync(string email, string userId, string token)
    {
        var baseUrl = Common.GetConfigurationKey(configuration, "BaseDevLearnUrl");
        var urlToConfirm = $"{baseUrl}user/confirmEmail/{userId}/{token}";
        var html = "<div>Kliknij w <a href=\"{urlToConfirm}\">link</a>, aby potwierdzić adres email. " +
            $"Jeżeli link nie działa, przekopiuj adres url do nowej karty przeglądarki: '{urlToConfirm}'</div>";
        return emailContext.SendHtml([email], "Potwierdź adres email - DevLearn", html);
    }

    public Task SendForgotPasswordLinkAsync(string userId, string email, string forgotPasswordKey)
    {
        var baseUrl = Common.GetConfigurationKey(configuration, "BaseDevLearnUrl");
        var urlToConfirm = $"{baseUrl}forgotpasswordform?u={userId}&k={forgotPasswordKey}";
        var html = $"<div>Kliknij w <a href=\"{urlToConfirm}\">link</a>, aby zrestartować swoje hasło. " +
            $"<br />Jeżeli link nie działa, przekopiuj adres url do nowej karty przeglądarki: '{urlToConfirm}'</div>";
        return emailContext.SendHtml([email], "Zresetuj hasło - FootRank", html);
    }
}
