namespace DevLearn.Infrastructure.Modules.Blog.Entities;

public class Like
{
    public Guid Id { get; set; }
    public int EntityType { get; set; }
    public Guid EntityId { get; set; }
    public string UserId { get; set; } = default!;
}
