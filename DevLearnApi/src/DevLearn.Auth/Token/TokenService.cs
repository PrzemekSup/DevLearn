using DevLearn.Auth.Dto;
using DevLearn.Auth.IRepository;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace DevLearn.Auth.Token;

public class TokenService(
    IConfiguration configuration,
    UserManager<ApplicationUser> userManager,
    IConnectionMultiplexer redis,
    IAuthRepository authRepository
) : ITokenService
{
    private readonly TimeSpan accessTokenLifetime = TimeSpan.FromHours(1);
    private readonly TimeSpan refreshTokenLifetime = TimeSpan.FromDays(7);

    public async Task<TokenResponse> GenerateTokensAsync(ApplicationUser user)
    {
        var accessToken = await GenerateJwtToken(user);
        var refreshToken = GenerateSecureToken();

        await authRepository.AddRefreshTokenAsync(refreshToken, user.Id, DateTime.UtcNow.Add(refreshTokenLifetime));

        return new TokenResponse(accessToken, refreshToken);
    }

    public async Task<TokenResponse> RefreshTokensAsync(RefreshRequest request)
    {
        var user = await authRepository.GetTokenToRefreshAsync(request.RefreshToken)
            ?? throw new SecurityTokenException("Invalid refresh token");

        var newToken = await GenerateJwtToken(user);
        var newRefresh = GenerateSecureToken();

        await authRepository.AddRefreshTokenAsync(newRefresh, user.Id, DateTime.UtcNow.Add(refreshTokenLifetime));

        return new TokenResponse(newToken, newRefresh);
    }

    public async Task RevokeUserTokensAsync(string userId)
    {
        var tokens = await authRepository.RevokeUserTokensAsync(userId);
        foreach (var token in tokens)
        {
            await redis.GetDatabase().StringSetAsync($"jwt_blacklist:{token}", "1", accessTokenLifetime);
        }
    }

    public async Task<bool> IsTokenBlacklistedAsync(string jti)
    {
        return await redis.GetDatabase().KeyExistsAsync($"jwt_blacklist:{jti}");
    }

    private async Task<string> GenerateJwtToken(ApplicationUser user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var roles = await userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var jwtKey = Common.GetConfigurationKey(configuration, "DevJwtKey");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: Common.GetConfigurationKey(configuration, "DevJwtIssuer"),
            audience: Common.GetConfigurationKey(configuration, "DevJwtAudience"),
            claims: claims,
            expires: DateTime.UtcNow.Add(accessTokenLifetime),
            signingCredentials: creds);

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        var jti = claims.First(x => x.Type == JwtRegisteredClaimNames.Jti).Value;
        await redis.GetDatabase().StringSetAsync($"jwt_blacklist:{jti}", "valid", accessTokenLifetime);

        return jwt;
    }

    private static string GenerateSecureToken()
    {
        var random = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(random);
        return Convert.ToBase64String(random);
    }
}
