using System.ComponentModel.DataAnnotations;

namespace DevLearn.Contract.Blog.Dtos;

public class ArticleAuthorDto(string displayName, string description)
{
    [Required] public string DisplayName { get; set; } = displayName;
    [Required] public string Description { get; set; } = description;
}
