using DevLearn.Contract.Blog.Dtos;

namespace DevLearn.Contract.Blog.IRepositories;

public interface IArticleRepository
{
    /// <summary>
    /// Gets <paramref name="pageSize"/> number of articles for <paramref name="page"/>.
    /// Articles are sorted descending by CreateDate.
    /// </summary>
    /// <returns>Articles sorted descending by CreateDate.</returns>
    Task<ArticleListResponse> GetAsync(int page = 1, int pageSize = 10);

    /// <summary>
    /// Gete articles containing at least one of the mentioned tags.
    /// Gets <paramref name="pageSize"/> number of articles for <paramref name="page"/>.
    /// Articles are sorted descending by CreateDate.
    /// </summary>
    /// <returns>Articles sorted descending by CreateDate.</returns>
    Task<ArticleListResponse> SearchAsync(List<string> tags, int page = 1, int pageSize = 10);

    /// <summary>
    /// Gets Article based on provided slug (link).
    /// </summary>
    /// <returns>Single Article or NULL.</returns>
    Task<ArticleDetailsDto?> GetAsync(string slug, string? currentUserId);

    /// <summary>
    /// Get article data (without contents) by Id.
    /// </summary>
    /// <param name="id">Identifier of article.</param>
    /// <returns>Base data of article.</returns>
    Task<ArticleDto?> GetAsync(Guid id);

    /// <summary>
    /// Creates Article based on provided type.
    /// </summary>
    /// <returns>GUID of the new article.</returns>
    Task<Guid> CreateAsync(CreateArticleRequest request);

    /// <summary>
    /// Returns name of the author.
    /// </summary>
    /// <param name="authorId">Identifier of author.</param>
    /// <returns>Name of the author when found, NULL otherwise.</returns>
    Task<string?> GetAuthorAsync(Guid authorId);
}
