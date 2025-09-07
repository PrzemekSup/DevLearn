using System.ComponentModel.DataAnnotations;

namespace DevLearn.Contract.Blog.Dtos;

public class CommentDto(Guid id, string author, string content, DateTime createdAt, LikeDto likes, Guid? parentCommentId)
{
    [Required] public Guid Id { get; init; } = id;
    [Required] public string Author { get; init; } = author;
    [Required] public string Content { get; init; } = content;
    [Required] public DateTime CreatedAt { get; init; } = createdAt;
    [Required] public LikeDto Likes { get; init; } = likes;
    public Guid? ParentCommentId { get; init; } = parentCommentId;
}

public class CommentResponseDto(CommentDto comment, CommentResponseDto[] childs)
    : CommentDto(comment.Id, comment.Author, comment.Content, comment.CreatedAt, comment.Likes, comment.ParentCommentId)
{
    public CommentResponseDto[] Childrens { get; set; } = childs;
}