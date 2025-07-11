using DevLearn.Auth.Dto;

namespace DevLearn.Auth.Token;

public interface ITokenService
{
    Task<TokenResponse> GenerateTokensAsync(ApplicationUser user);
    Task<TokenResponse> RefreshTokensAsync(RefreshRequest request);
    Task RevokeUserTokensAsync(string userId);
    Task<bool> IsTokenBlacklistedAsync(string jti);
}
