using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog.Dtos;

namespace DevLearn.Contract.Blog;

public record GetCommentsQuery(Guid ArticleId, string? CurrentUserId)
    : IQuery<CommentResponseDto[]>;

