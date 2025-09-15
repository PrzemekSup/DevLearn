using System.ComponentModel.DataAnnotations;

namespace DevLearn.Contract.Blog.Dtos;

public class LikeDto(int likes, bool isLikedByCurrentUser)
{
    [Required] public int Likes { get; set; } = likes;
    [Required] public bool IsLikedByCurrentUser { get; set; } = isLikedByCurrentUser;
}

public enum LikeEntityType
{
    Article = 1,
    ArticleComment = 2,
}
