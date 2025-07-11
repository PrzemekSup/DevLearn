using StackExchange.Redis;
using System.IdentityModel.Tokens.Jwt;

namespace DevLearn.Middleware;

public class TokenBlacklistMiddleware(RequestDelegate next, IDatabase redis)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        if (!string.IsNullOrEmpty(token))
        {
            var jwtHandler = new JwtSecurityTokenHandler();
            var jwt = jwtHandler.ReadJwtToken(token);
            var userId = jwt.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

            if (userId != null)
            {
                var keys = redis.Multiplexer.GetServer(redis.Multiplexer.GetEndPoints().First()).Keys(pattern: $"jwt_blacklist:{userId}:*");
                if (keys.Any())
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Token is blacklisted");
                    return;
                }
            }
        }

        await next(context);
    }
}
