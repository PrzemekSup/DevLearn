using DevLearn.Auth;
using DevLearn.Auth.IRepository;
using DevLearn.Infrastructure.Modules.Users.Entities;
using Microsoft.EntityFrameworkCore;

namespace DevLearn.Infrastructure.Modules.Users.Repositories;

public class AuthRepository(UsersDbContext context) : IAuthRepository
{
    public async Task<(bool uniqueEmail, bool uniqueUsername)> VerifyUnique(string email, string username)
    {
        var normalizedEmail = email.ToUpperInvariant();
        var normalizedUsername = username.ToUpperInvariant();

        var user = await context.Users
            .FirstOrDefaultAsync(x => x.NormalizedEmail == normalizedEmail || x.NormalizedUserName == normalizedUsername);
        if (user == null)
        {
            return (true, true);
        }

        return (user.NormalizedEmail != normalizedEmail, user.NormalizedUserName != normalizedUsername);
    }

    public async Task AddRefreshTokenAsync(string token, string userId, DateTime expiration)
    {
        context.RefreshTokens.Add(new RefreshToken
        {
            Token = token,
            UserId = userId,
            ExpiresAt = expiration
        });
        await context.SaveChangesAsync();
    }

    public async Task<ApplicationUser?> GetTokenToRefreshAsync(string token)
    {
        var tokenEntity = await context.RefreshTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Token == token);

        if (tokenEntity == null || tokenEntity.IsRevoked || tokenEntity.ExpiresAt < DateTime.UtcNow)
        {
            return null;
        }

        tokenEntity.IsRevoked = true;
        return tokenEntity.User;
    }

    public async Task<IEnumerable<string>> RevokeUserTokensAsync(string userId)
    {
        var tokens = await context.RefreshTokens
            .Where(x => x.UserId == userId && !x.IsRevoked)
            .ToListAsync();

        foreach (var token in tokens)
        {
            token.IsRevoked = true;
        }

        await context.SaveChangesAsync();
        return tokens.Select(x => x.Token);
    }
}
