using DevLearn.Auth;
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
    public async Task<IActionResult> RevokeUserTokens(string userId)
    {
        await authService.LogoutAsync(userId);
        return Ok($"Revoked sessions for user {userId}");
    }
}
