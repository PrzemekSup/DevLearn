using DevLearn.Auth.Dto;
using DevLearn.Auth.Dtos;
using DevLearn.Auth.Token;

namespace DevLearn.Auth;

public interface IAuthService
{
    Task<ValidationStateDto> RegisterAsync(RegisterRequest request);
    Task<TokenResponse> LoginAsync(LoginRequest request);
    Task<TokenResponse> RefreshTokenAsync(RefreshRequest request);
    Task LogoutAsync(string userId);
    Task<ValidationStateDto> ConfirmEmail(string userId, string token);
    Task<ValidationStateDto> ResendConfirmationEmail(string email);
    Task<ValidationStateDto> ForgotPassword(ForgotPasswordRequest request);
    Task<ValidationStateDto> ResetPassword(ResetPasswordRequest request);
    Task<TokenResponse?> ExternalLoginAsync();
}
