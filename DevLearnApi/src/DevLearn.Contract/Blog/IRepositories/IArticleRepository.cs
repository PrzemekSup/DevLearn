using DevLearn.Contract.Blog.Dtos;

namespace DevLearn.Contract.Blog.IRepositories;

public interface IArticleRepository
{
    /// <summary>
    /// Gets <paramref name="pageSize"/> number of articles for <paramref name="page"/>.
    /// Articles are sorted descending by CreateDate.
    /// </summary>
    /// <returns>Articles sorted descending by CreateDate.</returns>
    Task<ArticleListResponse> Get(int page = 1, int pageSize = 10);

    /// <summary>
    /// Gete articles containing at least one of the mentioned tags.
    /// Gets <paramref name="pageSize"/> number of articles for <paramref name="page"/>.
    /// Articles are sorted descending by CreateDate.
    /// </summary>
    /// <returns>Articles sorted descending by CreateDate.</returns>
    Task<ArticleListResponse> Search(List<string> tags, int page = 1, int pageSize = 10);

    /// <summary>
    /// Gets Article based on provided slug (link).
    /// </summary>
    /// <returns>Single Article or NULL.</returns>
    Task<ArticleDetailsDto?> Get(string slug);

    /// <summary>
    /// Creates Article based on provided type.
    /// </summary>
    /// <returns>GUID of the new article.</returns>
    Task<Guid> CreateAsync(CreateArticleRequest request);
}
