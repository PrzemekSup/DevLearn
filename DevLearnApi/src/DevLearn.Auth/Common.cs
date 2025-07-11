using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;

namespace DevLearn.Auth;

public class Common
{
    public static string GetConfigurationKey(WebApplicationBuilder builder, string key)
    {
        var result = builder.Configuration[key];
        return GetConfigurationKey(builder.Configuration, key);
    }

    public static string GetConfigurationKey(IConfiguration configuration, string key)
    {
        var result = configuration[key];
        if (string.IsNullOrEmpty(result))
        {
            throw new Exception($"Error on initialization. Missing key '{key}'");
        }

        return result;
    }
}
