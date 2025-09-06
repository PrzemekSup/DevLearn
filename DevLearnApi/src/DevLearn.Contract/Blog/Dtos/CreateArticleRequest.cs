namespace DevLearn.Contract.Blog.Dtos;

public record CreateArticleRequest(string Title, string Description, string Slug, Guid AuthorId, bool IsAccepted, ArticleContent[] Contents);
