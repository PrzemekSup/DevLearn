namespace DevLearn.Infrastructure.Modules.Blog.Entities;

public class Tag
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public List<Article> Articles { get; set; } = [];
    public List<Article> MainArticles { get; set; } = [];
}
