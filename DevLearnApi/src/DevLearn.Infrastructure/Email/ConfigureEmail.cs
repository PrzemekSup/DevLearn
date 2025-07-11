using DevLearn.Auth;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace DevLearn.Infrastructure.Email;

public static class ConfigureEmail
{
    public static void Configure(this WebApplicationBuilder builder)
    {
        var isEnabled = bool.Parse(Common.GetConfigurationKey(builder, "EmailConfiguration:Enabled"));
        var connectionString = Common.GetConfigurationKey(builder, "EmailConfiguration:ConnectionString");
        var sender = Common.GetConfigurationKey(builder, "EmailConfiguration:Sender");

        builder.Services.AddSingleton(new EmailContext(isEnabled, connectionString, sender));
        builder.Services.AddScoped<IEmailService, EmailService>();
    }
}
