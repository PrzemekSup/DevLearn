using DevLearn.Auth;
using DevLearn.Helpers;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace DevLearn.Infrastructure.Email;

public static class ConfigureEmail
{
    public static void Configure(this WebApplicationBuilder builder)
    {
        var isEnabled = bool.Parse(builder.Configuration.GetSafeConfigurationKey("EmailConfiguration:Enabled"));
        var connectionString = builder.Configuration.GetSafeConfigurationKey("EmailConfiguration:ConnectionString");
        var sender = builder.Configuration.GetSafeConfigurationKey("EmailConfiguration:Sender");

        builder.Services.AddSingleton(new EmailContext(isEnabled, connectionString, sender));
        builder.Services.AddScoped<IEmailService, EmailService>();
    }
}
