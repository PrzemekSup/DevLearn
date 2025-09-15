using DevLearn.Contract.Blog.Dtos;
using DevLearn.Contract.Blog.IRepositories;
using DevLearn.Infrastructure.Modules.Blog.Entities;
using Microsoft.EntityFrameworkCore;

namespace DevLearn.Infrastructure.Modules.Blog.Repositories;

public class CommentRepository(BlogDbContext context) : ICommentRepository
{

    /// <inheritdoc/>
    public async Task<CommentDto[]> GetAsync(Guid articleId, string? currentUserId)
    {
        var comments = await context.Comments.Where(x => x.ArticleId == articleId).ToListAsync();
        return [.. comments.Select(x => MapComment(x, currentUserId))];
    }

    /// <inheritdoc/>
    public CommentDto? GetAsync(Guid articleId, Guid commentId, string? currentUserId)
    {
        var comment = context.Comments.FirstOrDefault(x => x.ArticleId == articleId && x.Id == commentId);
        return comment != null ? MapComment(comment, currentUserId) : null;
    }

    /// <inheritdoc/>
    public CommentDto? Get(Guid commentId, string? currentUserId)
    {
        var comment = context.Comments.FirstOrDefault(x => x.Id == commentId);
        return comment != null ? MapComment(comment, currentUserId) : null;
    }

    /// <inheritdoc/>
    public async Task<Guid> CreateAsync(CreateCommentRequest request, string author)
    {
        var comment = new Comment()
        {
            Id = Guid.NewGuid(),
            ArticleId = request.ArticleId,
            Author = author,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow,
            Likes = 0,
        };
        if (request.ParentCommentId != null)
        {
            comment.ParentCommentId = request.ParentCommentId;
        }

        context.Add(comment);
        await context.SaveChangesAsync();
        return comment.Id;
    }

    private CommentDto MapComment(Comment comment, string? currentUserId)
    {
        return new CommentDto(comment.Id, comment.Author, GetContent(comment.Content, comment.DeleteType), comment.CreatedAt, GetLikeDto(comment.Id, currentUserId), comment.ParentCommentId);
    }

    private static string GetContent(string content, int deleteType)
    {
        return deleteType switch
        {
            0 => content,
            1 => "Wiadomość usunięta przez użytkownika.",
            2 => "Wiadomość usunięta ze względu na niezgodność z regulaminem strony",
            _ => string.Empty,
        };
    }

    private LikeDto GetLikeDto(Guid commentId, string? currentUserId)
    {
        var likes = context.Likes
            .Count(x => x.EntityType == (int)LikeEntityType.ArticleComment && x.EntityId == commentId);
        var isLiked = currentUserId != null
            ? context.Likes
                .FirstOrDefault(x => x.EntityType == (int)LikeEntityType.ArticleComment && x.EntityId == commentId && x.UserId == currentUserId)
            : null;
        return new LikeDto(likes, isLiked != null);
    }
}
