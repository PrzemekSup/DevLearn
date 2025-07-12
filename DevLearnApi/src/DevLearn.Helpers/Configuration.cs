using Microsoft.Extensions.Configuration;

namespace DevLearn.Helpers;

public static class Configuration
{
    public static string GetSafeConfigurationKey(this IConfiguration configuration, string key)
    {
        var result = configuration[key];
        if (string.IsNullOrEmpty(result))
        {
            throw new Exception($"Error on initialization. Missing key '{key}'");
        }

        return result;
    }

    public static string GetSafeConnectionString(this IConfiguration configuration, string key)
    {
        var result = configuration.GetConnectionString(key);
        if (string.IsNullOrEmpty(result))
        {
            throw new Exception($"Error on initialization. Missing ConnectionString '{key}'");
        }

        return result;
    }

}
