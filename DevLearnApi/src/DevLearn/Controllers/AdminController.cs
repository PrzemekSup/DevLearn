using DevLearn.Auth;
using DevLearn.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

namespace DevLearn.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController(IAuthService authService) : ControllerBase
{
    [HttpPost("revoke/{userId}")]
    [OpenApiOperation("Admin_RevokeUserTokens")]
    public async Task<ValidationStateDto> RevokeUserTokens(string userId)
    {
        await authService.LogoutAsync(userId);
        return new ValidationStateDto(true, $"Revoked sessions for user {userId}", []);
    }
}
