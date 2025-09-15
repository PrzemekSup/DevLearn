using DevLearn.Contract.Blog.Dtos;

namespace DevLearn.Contract.Blog.IRepositories;

public interface ICommentRepository
{

    /// <summary>
    /// Retrieves list of comments added to specific article.
    /// </summary>
    /// <param name="articleId">Id of article, where comments belong.</param>
    /// <param name="currentUserId">Identifier of the current user to verify "likes".</param>
    /// <returns>List of comments</returns>
    Task<CommentDto[]> GetAsync(Guid articleId, string? currentUserId);

    /// <summary>
    /// Retrieves comment for article from database.
    /// </summary>
    /// <param name="articleId">Identifier of article where comment belong.</param>
    /// <param name="commentId">Identifier of comment.</param>
    /// <param name="currentUserId">Identifier of the current user to verify "likes".</param>
    /// <returns>Comment or NULL, when it was not found.</returns>
    CommentDto? GetAsync(Guid articleId, Guid commentId, string? currentUserId);

    /// <summary>
    /// Retrieves comment from database.
    /// </summary>
    /// <param name="commentId">Identifier of comment.</param>
    /// <param name="currentUserId">Identifier of the current user to verify "likes".</param>
    /// <returns>Comment or NULL, when it was not found.</returns>
    CommentDto? Get(Guid commentId, string? currentUserId);

    /// <summary>
    /// Creates new comment to specified article.
    /// </summary>
    /// <param name="request">Details of new comment</param>
    /// <param name="author">Author of comment (logger user or 'Anonim'</param>
    /// <returns></returns>
    Task<Guid> CreateAsync(CreateCommentRequest request, string author);
}
