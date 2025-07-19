using DevLearn.Auth;
using DevLearn.Auth.Dto;
using DevLearn.Auth.Dtos;
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
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var result = await authService.RegisterAsync(request);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var tokens = await authService.LoginAsync(request);
        return Ok(tokens);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshRequest request)
    {
        var tokens = await authService.RefreshTokenAsync(request);
        return Ok(tokens);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var userId = User.FindFirst("sub")?.Value;
        if (userId == null) return Unauthorized();

        await authService.LogoutAsync(userId);
        return Ok("Logged out.");
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string token)
    {
        var result = await authService.ConfirmEmailAsync(userId, token);
        return Ok(result);
    }

    [HttpPost("resend-confirmation")]
    public async Task<IActionResult> ResendConfirmationEmail([FromBody] ResendConfirmationRequest request)
    {
        var result = await authService.ResendConfirmationEmailAsync(request.Email);
        return Ok(result);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var result = await authService.ForgotPasswordAsync(request);
        return Ok(result);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var result = await authService.ResetPasswordAsync(request);
        return Ok(result);
    }
}
