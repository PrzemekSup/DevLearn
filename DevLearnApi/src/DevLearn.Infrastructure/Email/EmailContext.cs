using Azure.Communication.Email;

namespace DevLearn.Infrastructure.Email;

public class EmailContext(
    bool IsEnabled,
    string ConnectionString,
    string Sender)
{
    private readonly EmailClient _emailClient = new(ConnectionString);

    public Task Send(string[] to, string title, string message)
    {
        if (!IsEnabled)
        {
            return Task.CompletedTask;
        }

        var emailContent = new EmailContent(title)
        {
            PlainText = message
        };

        var emailMessage = PrepareEmail(to, emailContent);
        return _emailClient.SendAsync(Azure.WaitUntil.Completed, emailMessage);
    }

    public Task SendHtml(string[] to, string title, string html)
    {
        if (!IsEnabled)
        {
            return Task.CompletedTask;
        }

        var emailContent = new EmailContent(title)
        {
            Html = html
        };

        var emailMessage = PrepareEmail(to, emailContent);
        return _emailClient.SendAsync(Azure.WaitUntil.Completed, emailMessage);
    }

    private EmailMessage PrepareEmail(string[] to, EmailContent emailContent)
    {
        var emailAddresses = new List<EmailAddress>();
        foreach (var emailAddress in to)
        {
            emailAddresses.Add(new EmailAddress(emailAddress));
        }

        var emailRecipients = new EmailRecipients(emailAddresses);
        return new EmailMessage(Sender, emailRecipients, emailContent);
    }
}
