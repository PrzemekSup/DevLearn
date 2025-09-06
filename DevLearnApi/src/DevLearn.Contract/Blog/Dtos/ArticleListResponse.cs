using System.ComponentModel.DataAnnotations;

namespace DevLearn.Contract.Blog.Dtos;

public class ArticleListResponse(IReadOnlyList<ArticleDto> articles, int articlesCount)
{
    [Required] public IReadOnlyList<ArticleDto> Articles { get; set; } = articles;
    [Required] public int ArticlesCount { get; set; } = articlesCount;
}
