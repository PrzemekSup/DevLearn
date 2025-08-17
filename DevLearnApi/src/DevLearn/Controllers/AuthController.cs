using DevLearn.Auth;
using DevLearn.Auth.Dto;
using DevLearn.Auth.Dtos;
using DevLearn.Auth.Token;
using DevLearn.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

namespace DevLearn.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    [OpenApiOperation("Auth_RegisterUser")]
    public async Task<ValidationStateDto> Register(RegisterRequest request)
    {
        return await authService.RegisterAsync(request);
    }

    [HttpPost("login")]
    public async Task<TokenResponse> Login(LoginRequest request)
    {
        return await authService.LoginAsync(request);
    }

    [HttpPost("refresh")]
    public async Task<TokenResponse> Refresh(RefreshRequest request)
    {
        return await authService.RefreshTokenAsync(request);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ValidationStateDto> Logout()
    {
        var userId = User.FindFirst("sub")?.Value;
        if (userId == null) return new ValidationStateDto(true, string.Empty, []);

        await authService.LogoutAsync(userId);
        return new ValidationStateDto(true, string.Empty, []);
    }

    [HttpPost("confirm-email")]
    public async Task<ValidationStateDto> ConfirmEmail([FromBody] ConfirmEmailRequest request)
    {
        return await authService.ConfirmEmailAsync(request.UserId, request.Token);
    }

    [HttpPost("resend-confirmation")]
    public async Task<ValidationStateDto> ResendConfirmationEmail([FromBody] ResendConfirmationRequest request)
    {
        return await authService.ResendConfirmationEmailAsync(request.Email);
    }

    [HttpPost("forgot-password")]
    public async Task<ValidationStateDto> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        return await authService.ForgotPasswordAsync(request);
    }

    [HttpPost("reset-password")]
    public async Task<ValidationStateDto> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        return await authService.ResetPasswordAsync(request);
    }
}
