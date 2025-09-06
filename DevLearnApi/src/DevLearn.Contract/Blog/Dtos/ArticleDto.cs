using System.ComponentModel.DataAnnotations;

namespace DevLearn.Contract.Blog.Dtos;

public class ArticleDto(Guid id, string title, string slug, string description, DateTime createdAt, DateTime updatedAt, ArticleAuthorDto articleAuthor, string category, string[] tags, int? readTimeInMins, int views)
{
    [Required] public Guid Id { get; init; } = id;
    [Required] public string Title { get; init; } = title;
    [Required] public string Slug { get; init; } = slug;
    [Required] public string Description { get; init; } = description;
    [Required] public DateTime CreatedAt { get; init; } = createdAt;
    [Required] public DateTime UpdatedAt { get; init; } = updatedAt;
    [Required] public ArticleAuthorDto ArticleAuthor { get; init; } = articleAuthor;
    [Required] public string Category { get; init; } = category;
    public string[] Tags { get; init; } = tags;
    public int? ReadTimeInMins { get; init; } = readTimeInMins;
    [Required] public int Views { get; init; } = views;
}

public class ArticleDetailsDto(ArticleDto article, ArticleContent[] contents, int likes)
{
    [Required] public ArticleDto Article { get; set; } = article;
    [Required] public ArticleContent[] Contents { get; set; } = contents;
    [Required] public int Likes { get; set; } = likes;
}

public class ArticleContent(int blockOrder, string content)
{
    [Required] public int BlockOrder { get; set; } = blockOrder;
    [Required] public string Content { get; set; } = content;
}
