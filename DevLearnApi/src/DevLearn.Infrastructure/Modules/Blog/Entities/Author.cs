namespace DevLearn.Infrastructure.Modules.Blog.Entities;

public class Author
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string? ImageUrl { get; set; }
    public List<Article> Articles { get; set; } = [];
}
