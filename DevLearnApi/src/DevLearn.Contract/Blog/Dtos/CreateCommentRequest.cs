namespace DevLearn.Contract.Blog.Dtos;

public record CreateCommentRequest(Guid ArticleId, string Content, Guid? ParentCommentId);
