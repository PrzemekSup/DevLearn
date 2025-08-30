namespace DevLearn.Contract.Blog.Dtos;

public record ArticleDto(Guid Id, string Title, string Slug, string Description, DateTime CreatedAt, DateTime UpdatedAt, ArticleAuthorDto ArticleAuthor, string[] Tags);
