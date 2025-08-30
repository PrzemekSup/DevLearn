namespace DevLearn.Contract.Blog.Dtos;

public record ArticleListResponse(IReadOnlyList<ArticleDto> Articles, int ArticlesCount);
