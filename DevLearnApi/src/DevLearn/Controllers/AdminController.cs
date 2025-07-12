using DevLearn.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevLearn.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController(IAuthService authService) : ControllerBase
{
    [HttpPost("revoke/{userId}")]
    public async Task<IActionResult> RevokeUserTokens(string userId)
    {
        await authService.LogoutAsync(userId);
        return Ok($"Revoked sessions for user {userId}");
    }
}
