using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog.Dtos;

namespace DevLearn.Contract.Blog;

public record GetArticleQuery(string Slug)
    : IQuery<ArticleDetailsDto?>;
