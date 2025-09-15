namespace DevLearn.Infrastructure.Modules.Blog.Entities;

public class Comment
{
    public Guid Id { get; set; }
    public Guid ArticleId { get; set; }
    public Article Article { get; set; } = default!;
    public string Author { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public int Likes { get; set; }
    public Guid? ParentCommentId { get; set; }
    public int DeleteType { get; set; }
}
