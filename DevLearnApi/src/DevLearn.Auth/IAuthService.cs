using DevLearn.Auth.Dto;
using DevLearn.Auth.Dtos;
using DevLearn.Auth.Token;
using DevLearn.Helpers;

namespace DevLearn.Auth;

public interface IAuthService
{
    Task<ValidationStateDto> RegisterAsync(RegisterRequest request);
    Task<TokenResponse> LoginAsync(LoginRequest request);
    Task<TokenResponse> RefreshTokenAsync(RefreshRequest request);
    Task LogoutAsync(string userId);
    Task<ValidationStateDto> ConfirmEmailAsync(string userId, string token);
    Task<ValidationStateDto> ResendConfirmationEmailAsync(string email);
    Task<ValidationStateDto> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<ValidationStateDto> ResetPasswordAsync(ResetPasswordRequest request);
    Task<TokenResponse?> ExternalLoginAsync();
}
