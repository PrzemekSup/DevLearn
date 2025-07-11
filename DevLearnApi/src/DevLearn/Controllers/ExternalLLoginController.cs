using DevLearn.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace DevLearn.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExternalLoginController(
SignInManager<ApplicationUser> signInManager,
IAuthService authService) : ControllerBase
{
    [HttpGet("external-login/{provider}")]
    public IActionResult ExternalLogin([FromRoute] string provider, [FromQuery] string returnUrl = "/")
    {
        var redirectUrl = Url.Action("ExternalLoginCallback", "Auth", new { returnUrl });
        var properties = signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
        return Challenge(properties, provider);
    }

    [HttpGet("external-login-callback")]
    public async Task<IActionResult> ExternalLoginCallback([FromQuery] string returnUrl = "/")
    {
        var token = await authService.ExternalLoginAsync();
        if (token == null)
        {
            return Redirect($"https://yourfrontend.com/login-failed");
        }

        // Redirect to frontend with tokens (or use cookies if needed)
        var redirectWithToken = QueryHelpers.AddQueryString("https://yourfrontend.com/auth-callback", new Dictionary<string, string?>
        {
            ["accessToken"] = token.AccessToken,
            ["refreshToken"] = token.RefreshToken
        });

        return Redirect(redirectWithToken);
    }
}
