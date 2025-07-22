using DevLearn.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DevLearn.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : Controller
{
    [HttpPost("islogged")]
    [Authorize]
    public ValidationStateDto Index()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return userId != null ? new ValidationStateDto(true, userId, []) : new ValidationStateDto(false, string.Empty, ["Empty user id"]);
    }
}
