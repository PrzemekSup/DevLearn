using DevLearn.Auth;

namespace DevLearn.Infrastructure.Modules.Users.Entities;

public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Token { get; set; } = default!;
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsRevoked { get; set; }

    public string UserId { get; set; } = default!;
    public ApplicationUser User { get; set; } = default!;
}
