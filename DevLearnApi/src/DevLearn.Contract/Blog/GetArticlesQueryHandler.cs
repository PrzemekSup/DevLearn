using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog.Dtos;
using DevLearn.Contract.Blog.IRepositories;

namespace DevLearn.Contract.Blog;

public class GetArticlesQueryHandler(IArticleRepository repository)
    : IQueryHandler<GetArticlesQuery, ArticleListResponse>
{
    public Task<ArticleListResponse> HandleAsync(GetArticlesQuery query, CancellationToken cancellationToken = default)
    {
        if (query.Tags?.Count > 0)
        {
            if (query.Page.HasValue && query.PageSize.HasValue)
            {
                return repository.SearchAsync(query.Tags, query.Page.Value, query.PageSize.Value);
            }
            else
            {
                return repository.SearchAsync(query.Tags);
            }
        }
        else
        {
            if (query.Page.HasValue && query.PageSize.HasValue)
            {
                return repository.GetAsync(query.Page.Value, query.PageSize.Value);
            }
            else
            {
                return repository.GetAsync();
            }
        }
    }
}