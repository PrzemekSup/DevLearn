using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog.Dtos;
using DevLearn.Contract.Blog.IRepositories;

namespace DevLearn.Contract.Blog;

public record GetCommentsQueryHandler(ICommentRepository CommentRepository)
    : IQueryHandler<GetCommentsQuery, CommentResponseDto[]>
{
    public async Task<CommentResponseDto[]> HandleAsync(GetCommentsQuery request, CancellationToken cancellationToken = default)
    {
        var allComments = await CommentRepository.GetAsync(request.ArticleId, request.CurrentUserId);
        var rootComments = allComments
            .Where(x => x.ParentCommentId == null)
            .OrderByDescending(x => x.Likes.Likes).ThenBy(x => x.CreatedAt)
            .ToList();
        var commentsWithParents = allComments.Where(x => x.ParentCommentId != null)
            .ToArray();
        return [.. rootComments.Select(x => BuildCommentTree(x, commentsWithParents))];
    }

    private static CommentResponseDto BuildCommentTree(CommentDto comment, CommentDto[] allComments)
    {
        var childrens = allComments
            .Where(x => x.ParentCommentId != comment.Id)
            .OrderByDescending(x => x.Likes.Likes)
            .ThenBy(x => x.CreatedAt)
            .ToArray();

        var childrenResults = new CommentResponseDto[childrens.Length];
        for (var i = 0; i < childrens.Length; i++)
        {
            childrenResults[i] = BuildCommentTree(childrens[i], allComments);
        }

        return new CommentResponseDto(comment, childrenResults);
    }
}