using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog.Dtos;
using DevLearn.Contract.Blog.IRepositories;

namespace DevLearn.Contract.Blog;

public class GetArticleQueryHandler(IArticleRepository repository)
    : IQueryHandler<GetArticleQuery, ArticleDetailsDto?>
{
    public Task<ArticleDetailsDto?> HandleAsync(GetArticleQuery query, CancellationToken cancellationToken = default)
    {
        return repository.GetAsync(query.Slug, query.CurrentUserId);
    }
}