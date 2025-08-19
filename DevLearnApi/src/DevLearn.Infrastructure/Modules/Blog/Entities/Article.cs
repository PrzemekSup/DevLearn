namespace DevLearn.Infrastructure.Modules.Blog.Entities;

public class Article
{
    public Guid Id { get; set; }
    public string Title { get; set; } = default!;
    public string Slug { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid AuthorId { get; set; }
    public Author Author { get; set; } = default!;
    public bool IsAccepted { get; set; }
    public List<ArticleContent> ArticleContents { get; set; } = [];
    public List<Tag> Tags { get; set; } = [];
}
