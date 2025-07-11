namespace DevLearn.Auth.IRepository;

public interface IAuthRepository
{
    Task<(bool uniqueEmail, bool uniqueUsername)> VerifyUnique(string email, string username);
    Task AddRefreshTokenAsync(string token, string userId, DateTime expiration);
    Task<ApplicationUser?> GetTokenToRefreshAsync(string token);
    Task<IEnumerable<string>> RevokeUserTokensAsync(string userId);
}
