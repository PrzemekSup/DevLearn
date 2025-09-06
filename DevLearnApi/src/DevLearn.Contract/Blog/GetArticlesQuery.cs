using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog.Dtos;

namespace DevLearn.Contract.Blog;

public record GetArticlesQuery(int? Page, int? PageSize, List<string>? Tags)
    : IQuery<ArticleListResponse>;
