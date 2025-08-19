namespace DevLearn.Infrastructure.Modules.Blog.Entities;

public class ArticleContent
{
    public Guid Id { get; set; }
    public Guid ArticleId { get; set; }
    public Article Article { get; set; } = default!;
    public int BlockOrder { get; set; }
    public ArticleContentType BlockType { get; set; }
    public Dictionary<string, object> Content { get; set; } = [];
}
